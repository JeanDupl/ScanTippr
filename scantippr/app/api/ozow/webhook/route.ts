import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyWebhookSignature(
  webhookId: string,
  webhookTimestamp: string,
  body: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    const secretBase64 = secret.startsWith('whsec_') ? secret.slice(6) : secret
    const secretBytes = Buffer.from(secretBase64, 'base64')
    const signedContent = `${webhookId}.${webhookTimestamp}.${body}`
    const expected = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64')

    const signatures = signatureHeader
      .split(' ')
      .map(s => s.replace(/^v1,/, '').trim())
      .filter(Boolean)

    return signatures.some(sig => {
      try {
        if (sig.length !== expected.length) return false
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
      } catch {
        return false
      }
    })
  } catch (err) {
    console.error('Ozow webhook: signature verification error', err)
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const contentType = request.headers.get('content-type') ?? ''

  // Handle form-encoded notify callback (IpayRuntime/1.0) — acknowledge only
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(body)
    console.log(`Ozow notify: TransactionId=${params.get('TransactionId')} Status=${params.get('Status')}`)
    return Response.json({ received: true })
  }

  // Verify Svix signature for JSON webhook
  const webhookId        = request.headers.get('webhook-id') ?? ''
  const webhookTimestamp = request.headers.get('webhook-timestamp') ?? ''
  const webhookSignature = request.headers.get('webhook-signature') ?? ''

  if (process.env.OZOW_WEBHOOK_SECRET) {
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.error('Ozow webhook: missing signature headers')
      return Response.json({ error: 'Missing signature headers' }, { status: 401 })
    }

    const valid = verifyWebhookSignature(
      webhookId,
      webhookTimestamp,
      body,
      webhookSignature,
      process.env.OZOW_WEBHOOK_SECRET
    )

    if (!valid) {
      console.error('Ozow webhook: invalid signature')
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Ozow webhook received:', JSON.stringify(event, null, 2))

  if (event.type !== 'transaction.complete') {
    return Response.json({ received: true })
  }

  const data = event.data
  const transactionReference = data?.TransactionReference  // our merchantReference e.g. TIP-1388ef51-...
  const transactionId        = data?.TransactionId         // Ozow's transaction ID
  const status               = data?.Status                // "Successful", "Error", etc.

  if (!transactionReference) {
    console.error('Ozow webhook: missing TransactionReference')
    return Response.json({ received: true })
  }

  const isSuccess        = status?.toLowerCase() === 'successful'
  const newStatus        = isSuccess ? 'success' : 'failed'
  const newPaymentStatus = isSuccess ? 'completed' : 'failed'

  // Match on our merchantReference (stored as _deprecated_paystack_reference)
  // Also store Ozow's TransactionId for future reference
  const { error } = await supabase
    .from('transactions')
    .update({
      status:           newStatus,
      payment_status:   newPaymentStatus,
      ozow_payment_id:  transactionId,
    })
    .eq('_deprecated_paystack_reference', transactionReference)

  if (error) {
    console.error('Ozow webhook: supabase update error', error)
    return Response.json({ received: true })
  }

  console.log(`Ozow webhook: ${transactionReference} marked as ${newStatus} / ${newPaymentStatus}`)
  return Response.json({ received: true })
}
