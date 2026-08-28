import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

// ============================================================
// app/api/ozow/payout-webhook/route.ts
//
// Ozow calls this endpoint twice per payout:
//
// 1. VERIFICATION REQUEST (Step 3)
//    Ozow sends the payout details and asks us to verify.
//    We must respond with IsVerified + AccountNumberDecryptionKey.
//    The decryption key is what we used to encrypt the account number.
//
// 2. NOTIFICATION (Step 4)
//    Ozow sends the final payout status (complete, failed, etc.)
//    We update our payout_periods record accordingly.
//
// Authentication: Ozow sends our AccessToken in the header.
// We set OZOW_PAYOUT_WEBHOOK_TOKEN in env vars.
// ============================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const API_KEY   = process.env.OZOW_PAYOUT_API_KEY ?? ''
const SITE_CODE = process.env.OZOW_SITE_CODE!
const ACCESS_TOKEN = process.env.OZOW_PAYOUT_WEBHOOK_TOKEN ?? ''

// ── SHA512 hash ───────────────────────────────────────────────
function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

// ── Verify the hash Ozow sends in the verification request ───
function verifyRequestHash(body: any): boolean {
  if (!API_KEY) return true // skip if not configured yet

  const input = [
    body.PayoutId ?? '',
    body.SiteCode ?? '',
    Math.round((body.Amount ?? 0) * 100),
    body.MerchantReference ?? '',
    body.CustomerBankReference ?? '',
    body.IsRtc ?? false,
    body.NotifyUrl ?? '',
    body.BankGroupId ?? '',
    body.AccountNumber ?? '',
    body.BranchCode ?? '',
    API_KEY,
  ].join('').toLowerCase()

  const expected = sha512(input)
  const received = (body.HashCheck ?? '').toLowerCase()

  return expected === received
}

// ── Verify the notification hash ─────────────────────────────
function verifyNotificationHash(body: any): boolean {
  if (!API_KEY) return true

  const input = [
    body.PayoutId ?? '',
    body.SiteCode ?? '',
    body.MerchantReference ?? '',
    body.CustomerMerchantReference ?? '',
    body.PayoutStatus ?? '',
    body.PayoutSubStatus ?? '',
    API_KEY,
  ].join('').toLowerCase()

  const expected = sha512(input)
  const received = (body.HashCheck ?? '').toLowerCase()

  return expected === received
}

// ── Map payout status to our internal status ──────────────────
function mapPayoutStatus(status: number): string {
  switch (status) {
    case 5:  return 'paid'     // PayoutComplete
    case 4:  return 'failed'   // PayoutProcessingError
    case 90: return 'failed'   // PayoutReturned
    case 99: return 'failed'   // PayoutCancelled
    default: return 'submitted' // still in progress
  }
}

export async function POST(request: Request) {
  // Verify our access token
  const accessToken = request.headers.get('AccessToken') ?? ''
  if (ACCESS_TOKEN && accessToken !== ACCESS_TOKEN) {
    console.error('[payout-webhook] Invalid AccessToken')
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[payout-webhook] Received:', JSON.stringify(body, null, 2))

  const payoutId          = body.PayoutId
  const merchantReference = body.MerchantReference
  const hasIsVerified     = 'IsVerified' in body // not present in notification
  const isVerificationRequest = body.AccountNumber !== undefined && !body.PayoutStatus

  // ── VERIFICATION REQUEST (Step 3) ────────────────────────────
  if (isVerificationRequest) {
    console.log('[payout-webhook] Verification request for payoutId:', payoutId)

    // Verify hash
    if (!verifyRequestHash(body)) {
      console.error('[payout-webhook] Verification hash mismatch')
      return NextResponse.json({
        PayoutId:                   payoutId,
        IsVerified:                 false,
        AccountNumberDecryptionKey: '',
        Reason:                     'Hash verification failed',
      })
    }

    // Look up the payout period to get the encryption key
    const { data: period } = await supabase
      .from('payout_periods')
      .select('id, encryption_key, net_amount')
      .eq('net_ozow_payout_id', payoutId)
      .maybeSingle()

    if (!period) {
      console.error('[payout-webhook] Payout period not found for payoutId:', payoutId)
      return NextResponse.json({
        PayoutId:                   payoutId,
        IsVerified:                 false,
        AccountNumberDecryptionKey: '',
        Reason:                     'Payout not found',
      })
    }

    if (!period.encryption_key) {
      console.error('[payout-webhook] No encryption key stored for period:', period.id)
      return NextResponse.json({
        PayoutId:                   payoutId,
        IsVerified:                 false,
        AccountNumberDecryptionKey: '',
        Reason:                     'Encryption key not available',
      })
    }

    // Update period status to verification
    await supabase
      .from('payout_periods')
      .update({ net_payout_status: 'submitted' })
      .eq('id', period.id)

    console.log('[payout-webhook] Verification successful for period:', period.id)

    // Respond with decryption key
    return NextResponse.json({
      PayoutId:                   payoutId,
      IsVerified:                 true,
      AccountNumberDecryptionKey: period.encryption_key,
      Reason:                     '',
    })
  }

  // ── NOTIFICATION (Step 4) ─────────────────────────────────────
  console.log('[payout-webhook] Notification for payoutId:', payoutId)

  if (!verifyNotificationHash(body)) {
    console.error('[payout-webhook] Notification hash mismatch')
    // Still return 200 — Ozow will retry if we return an error
    return NextResponse.json({ received: true })
  }

  const payoutStatus    = body.PayoutStatus?.Status ?? body.PayoutStatus
  const payoutSubStatus = body.PayoutStatus?.SubStatus ?? body.PayoutSubStatus
  const newStatus       = mapPayoutStatus(Number(payoutStatus))

  console.log(`[payout-webhook] Status: ${payoutStatus} SubStatus: ${payoutSubStatus} → ${newStatus}`)

  // Update payout period
  const { error } = await supabase
    .from('payout_periods')
    .update({
      net_payout_status: newStatus,
      net_paid_at:       newStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('net_ozow_payout_id', payoutId)

  if (error) {
    console.error('[payout-webhook] Supabase update error:', error)
  }

  // If payout is complete, mark transactions as paid
  if (newStatus === 'paid') {
    const { data: period } = await supabase
      .from('payout_periods')
      .select('id')
      .eq('net_ozow_payout_id', payoutId)
      .maybeSingle()

    if (period) {
      // Get all transaction IDs in this period via join table
      const { data: joinRows } = await supabase
        .from('payout_line_item_tips')
        .select('transaction_id, payout_line_items!inner(payout_period_id)')
        .eq('payout_line_items.payout_period_id', period.id)

      if (joinRows && joinRows.length > 0) {
        const txIds = joinRows.map((r: any) => r.transaction_id)
        await supabase
          .from('transactions')
          .update({ payout_status: 'paid' })
          .in('id', txIds)

        console.log(`[payout-webhook] Marked ${txIds.length} transactions as paid`)
      }
    }
  }

  return NextResponse.json({ received: true })
}
