import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return Response.json({ IsVerified: false, Reason: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[payout-verify] Received:', JSON.stringify(body, null, 2))
  // TEMP: force cancellation for Test 6
  return Response.json({ PayoutId: body.PayoutId, IsVerified: false, AccountNumberDecryptionKey: '', Reason: 'Test 6 cancellation' })

  const payoutId          = body.PayoutId
  const merchantReference = body.MerchantReference

  let { data: period } = await supabase
    .from('payout_periods')
    .select('id, encryption_key')
    .eq('net_ozow_payout_id', payoutId)
    .maybeSingle()

  if (!period && merchantReference) {
    const { data: periodByRef } = await supabase
      .from('payout_periods')
      .select('id, encryption_key')
      .eq('net_merchant_reference', merchantReference)
      .maybeSingle()
    period = periodByRef
  }

  if (!period || !period.encryption_key) {
    console.error('[payout-verify] Period not found for payoutId:', payoutId, 'ref:', merchantReference)
    return Response.json({
      PayoutId: payoutId,
      IsVerified: false,
      AccountNumberDecryptionKey: '',
      Reason: 'Payout record or encryption key not found',
    })
  }

  await supabase
    .from('payout_periods')
    .update({
      net_ozow_payout_id: payoutId,
      net_payout_status: 'submitted',
    })
    .eq('id', period.id)

  console.log('[payout-verify] Verified successfully for period:', period.id)

  return Response.json({
    PayoutId:                   payoutId,
    IsVerified:                 true,
    AccountNumberDecryptionKey: period.encryption_key,
    Reason:                     '',
  })
}
