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
    // Strip whsec_ prefix and base64-decode the secret
    const secretBase64 = secret.startsWith('whsec_') ? secret.slice(6) : secret
    const secretBytes = Buffer.from(secretBase64, 'base64')

    // Svix signed content format: "{webhook-id}.{webhook-timestamp}.{body}"
    const signedContent = `${webhookId}.${webhookTimestamp}.${body}`

    const expected = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64')

    // Header can contain multiple sigs: "v1,<sig1> v1,<sig2>"
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

  // Ozow uses webhook-id/webhook-timestamp/webhook-signature headers (not svix-*)
  const webhookId        = request.headers.get('webhook-id') ?? ''
  const webhookTimestamp = request.headers.get('webhook-timestamp') ?? ''
  const webhookSignature = request.headers.get('webhook-signature') ?? ''

  // Also check content-type — Ozow fires two webhooks:
  // 1. JSON (Svix): transaction.complete event
  // 2. Form-encoded (IpayRuntime): notify URL callback — handled separately
  const contentType = request.headers.get('content-type') ?? ''

  // Handle form-encoded notify callback (IpayRuntime/1.0)
  // This is Ozow's legacy notify webhook — return 200 to acknowledge
  if (contentType.includes('application/x-www-form-urlencoded')) {
    console.log('Ozow notify webhook (form-encoded) received — acknowledged')
    const params = new URLSearchParams(body)
    const transactionId = params.get('TransactionId')
    const status = params.get('Status')
    console.log(`Ozow notify: TransactionId=${transactionId} Status=${status}`)
    return Response.json({ received: true })
  }

  // Verify Svix signature for JSON webhook
  if (process.env.OZOW_WEBHOOK_SECRET) {
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.error('Ozow webhook: missing signature headers', {
        webhookId, webhookTimestamp, webhookSignature: webhookSignature?.slice(0, 20)
      })
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

  // Parse JSON body
  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Ozow webhook received:', JSON.stringify(event, null, 2))

  // Only process transaction.complete events
  if (event.type !== 'transaction.complete') {
    return Response.json({ received: true })
  }

  const data = event.data
  const transactionId = data?.TransactionId   // Ozow's own transaction ID
  const status = data?.Status                 // "Successful", "Error", "Cancelled", etc.

  if (!transactionId) {
    console.error('Ozow webhook: missing TransactionId')
    return Response.json({ received: true })
  }

  // Ozow uses capital "Successful" — normalise to lowercase for comparison
  const isSuccess = status?.toLowerCase() === 'successful'
  const newStatus = isSuccess ? 'success' : 'failed'
  const newPaymentStatus = isSuccess ? 'completed' : 'failed'

  // Update transaction by ozow_payment_id (which is the Ozow TransactionId)
  const { error } = await supabase
    .from('transactions')
    .update({
      status: newStatus,
      payment_status: newPaymentStatus,
    })
    .eq('ozow_payment_id', transactionId)

  if (error) {
    console.error('Ozow webhook: supabase update error', error)
    return Response.json({ received: true })
  }

  console.log(`Ozow webhook: transaction ${transactionId} marked as ${newStatus} / ${newPaymentStatus}`)
  return Response.json({ received: true })
}
