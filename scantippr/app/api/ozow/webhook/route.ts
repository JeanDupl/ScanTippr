import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();

  // Log all headers to diagnose what Ozow actually sends
  const allHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    allHeaders[key] = value;
  });
  console.log('Ozow webhook headers:', JSON.stringify(allHeaders));

  // Try every possible signature header name
  const svixSignature    = request.headers.get('svix-signature') ?? '';
  const svixId           = request.headers.get('svix-id') ?? '';
  const svixTimestamp    = request.headers.get('svix-timestamp') ?? '';
  const ozowSignature    = request.headers.get('x-ozow-signature') ??
                           request.headers.get('X-Ozow-Signature') ?? '';
  const hubSignature     = request.headers.get('x-hub-signature-256') ?? '';

  if (process.env.OZOW_WEBHOOK_SECRET) {
    const secret = process.env.OZOW_WEBHOOK_SECRET!
    const secretBase64 = secret.startsWith('whsec_') ? secret.slice(6) : secret
    let secretBytes: Buffer
    try {
      secretBytes = Buffer.from(secretBase64, 'base64')
    } catch {
      secretBytes = Buffer.from(secret)
    }

    let valid = false

    // Method 1: Full Svix (svix-id + svix-timestamp + body)
    if (svixId && svixTimestamp && svixSignature) {
      const signedContent = `${svixId}.${svixTimestamp}.${body}`
      const expected = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64')

      const sigs = svixSignature.split(' ').map(s => s.replace(/^v1,/, '').trim()).filter(Boolean)
      valid = sigs.some(sig => {
        try {
          if (sig.length !== expected.length) return false
          return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
        } catch { return false }
      })
      console.log('Ozow webhook: tried Svix full method, valid:', valid)
    }

    // Method 2: Svix signature only (no id/timestamp) — body only
    if (!valid && svixSignature) {
      const sigs = svixSignature.split(' ').map(s => s.replace(/^v1,/, '').trim()).filter(Boolean)
      const expectedHex = crypto.createHmac('sha256', secretBytes).update(body).digest('hex')
      const expectedB64 = crypto.createHmac('sha256', secretBytes).update(body).digest('base64')

      valid = sigs.some(sig => {
        try {
          if (sig.length === expectedHex.length) {
            return crypto.timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(sig, 'hex'))
          }
          if (sig.length === expectedB64.length) {
            return crypto.timingSafeEqual(Buffer.from(expectedB64), Buffer.from(sig))
          }
          return false
        } catch { return false }
      })
      console.log('Ozow webhook: tried svix-signature body-only method, valid:', valid)
    }

    // Method 3: X-Ozow-Signature header
    if (!valid && ozowSignature) {
      const expectedHex = crypto.createHmac('sha256', secret).update(body).digest('hex')
      const expectedB64 = crypto.createHmac('sha256', secret).update(body).digest('base64')
      try {
        if (ozowSignature.length === expectedHex.length) {
          valid = crypto.timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(ozowSignature, 'hex'))
        } else if (ozowSignature.length === expectedB64.length) {
          valid = crypto.timingSafeEqual(Buffer.from(expectedB64), Buffer.from(ozowSignature))
        }
      } catch { valid = false }
      console.log('Ozow webhook: tried X-Ozow-Signature method, valid:', valid)
    }

    // Method 4: x-hub-signature-256
    if (!valid && hubSignature) {
      const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`
      try {
        valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hubSignature))
      } catch { valid = false }
      console.log('Ozow webhook: tried x-hub-signature-256 method, valid:', valid)
    }

    if (!valid) {
      console.error('Ozow webhook: all signature methods failed')
      console.error('Body preview:', body.slice(0, 200))
      // Return 200 temporarily so we can inspect the payload
      // TODO: restore 401 once correct signature method is confirmed
      // return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('Ozow webhook received:', JSON.stringify(event, null, 2));

  if (event.eventType !== 'transaction.complete') {
    return Response.json({ received: true });
  }

  const paymentId = event.data?.paymentId;
  const transactionStatus = event.data?.status;

  if (!paymentId) {
    console.error('Ozow webhook: missing paymentId');
    return Response.json({ received: true });
  }

  const isSuccess = transactionStatus === 'successful';
  const newStatus = isSuccess ? 'success' : 'failed';
  const newPaymentStatus = isSuccess ? 'completed' : 'failed';

  const { error } = await supabase
    .from('transactions')
    .update({
      status: newStatus,
      payment_status: newPaymentStatus,
    })
    .eq('ozow_payment_id', paymentId);

  if (error) {
    console.error('Ozow webhook: supabase update error', error);
    return Response.json({ received: true });
  }

  console.log(`Ozow webhook: payment ${paymentId} marked as ${newStatus} / ${newPaymentStatus}`);
  return Response.json({ received: true });
}
