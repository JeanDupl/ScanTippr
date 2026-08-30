import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const API_KEY = process.env.OZOW_PAYOUT_API_KEY ?? ''

function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

function verifyNotificationHash(body: any): boolean {
  if (!API_KEY) return true
  const input = [
    body.PayoutId ?? '',
    body.SiteCode ?? '',
    body.MerchantReference ?? '',
    body.CustomerMerchantReference ?? '',
    body.PayoutStatus?.Status ?? body.PayoutStatus ?? '',
    body.PayoutStatus?.SubStatus ?? body.PayoutSubStatus ?? '',
    API_KEY,
  ].join('').toLowerCase()
  const expected = sha512(input)
  const received = (body.HashCheck ?? '').toLowerCase()
  return expected === received
}

function mapPayoutStatus(status: number): string {
  switch (status) {
    case 5:  return 'paid'
    case 4:  return 'failed'
    case 90: return 'failed'
    case 99: return 'failed'
    default: return 'submitted'
  }
}

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[payout-webhook] Received:', JSON.stringify(body, null, 2))

  const payoutId = body.PayoutId

  // ── NOTIFICATION ─────────────────────────────────────────────
  console.log('[payout-webhook] Notification for payoutId:', payoutId)

  if (!verifyNotificationHash(body)) {
    console.error('[payout-webhook] Notification hash mismatch')
    return NextResponse.json({ received: true })
  }

  const payoutStatus    = body.PayoutStatus?.Status ?? body.PayoutStatus
  const payoutSubStatus = body.PayoutStatus?.SubStatus ?? body.PayoutSubStatus
  const newStatus       = mapPayoutStatus(Number(payoutStatus))

  console.log(`[payout-webhook] Status: ${payoutStatus} SubStatus: ${payoutSubStatus} → ${newStatus}`)

  const { error } = await supabase
    .from('payout_periods')
    .update({
      net_payout_status: newStatus,
      net_paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('net_ozow_payout_id', payoutId)

  if (error) {
    console.error('[payout-webhook] Supabase update error:', error)
  }

  if (newStatus === 'paid') {
    const { data: period } = await supabase
      .from('payout_periods')
      .select('id')
      .eq('net_ozow_payout_id', payoutId)
      .maybeSingle()

    if (period) {
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
