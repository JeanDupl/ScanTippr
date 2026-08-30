import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return Response.json({ IsVerified: false, Reason: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[payout-verify] Received:', JSON.stringify(body, null, 2))

  const payoutId = body.PayoutId

  // Look up the payout period by payoutId
  const { data: period } = await supabase
    .from('payout_periods')
    .select('id, encryption_key')
    .eq('net_ozow_payout_id', payoutId)
    .maybeSingle()

  if (!period || !period.encryption_key) {
    console.error('[payout-verify] Period or encryption key not found for payoutId:', payoutId)
    return Response.json({
      PayoutId: payoutId,
      IsVerified: false,
      AccountNumberDecryptionKey: '',
      Reason: 'Payout not found',
    })
  }

  // Update status
  await supabase
    .from('payout_periods')
    .update({ net_payout_status: 'submitted' })
    .eq('id', period.id)

  console.log('[payout-verify] Verified successfully for period:', period.id)

  return Response.json({
    PayoutId: payoutId,
    IsVerified: true,
    AccountNumberDecryptionKey: period.encryption_key,
    Reason: '',
  })
}
