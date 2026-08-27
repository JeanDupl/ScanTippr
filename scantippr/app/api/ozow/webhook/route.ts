import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyOzowSignature(body: string, receivedSignature: string): boolean {
  const secret = process.env.OZOW_WEBHOOK_SECRET!;

  // Compute HMAC-SHA256 of the raw body
  const hmac = crypto.createHmac('sha256', secret).update(body);

  // Try hex comparison first
  const expectedHex = hmac.digest('hex');

  // Try base64 comparison as fallback (some providers send base64)
  const hmac2 = crypto.createHmac('sha256', secret).update(body);
  const expectedBase64 = hmac2.digest('base64');

  // Normalise the received signature — strip any whitespace
  const received = receivedSignature.trim();

  // Safe comparison for hex
  if (received.length === expectedHex.length) {
    return crypto.timingSafeEqual(
      Buffer.from(expectedHex, 'hex'),
      Buffer.from(received, 'hex')
    );
  }

  // Safe comparison for base64
  if (received.length === expectedBase64.length) {
    return crypto.timingSafeEqual(
      Buffer.from(expectedBase64),
      Buffer.from(received)
    );
  }

  // Log lengths to help diagnose format mismatch
  console.error(
    `Ozow webhook: signature length mismatch. ` +
    `received=${received.length} expectedHex=${expectedHex.length} expectedBase64=${expectedBase64.length}`
  );
  console.error(`Ozow webhook: received signature prefix: ${received.slice(0, 20)}...`);

  return false;
}

export async function POST(request: Request) {
  const body = await request.text();

  // Log which header Ozow is actually sending
  const signatureHeader =
    request.headers.get('svix-signature') ??
    request.headers.get('X-Ozow-Signature') ??
    request.headers.get('x-ozow-signature') ??
    '';

  const signatureId     = request.headers.get('svix-id') ?? '';
  const signatureTimestamp = request.headers.get('svix-timestamp') ?? '';

  // Ozow uses Svix for webhooks — the actual signature payload is:
  // "{svix-id}.{svix-timestamp}.{body}"
  // and the svix-signature header contains "v1,<base64_hmac>"
  if (process.env.OZOW_WEBHOOK_SECRET) {
    try {
      let valid = false;

      if (signatureId && signatureTimestamp) {
        // Svix signature format
        const signedContent = `${signatureId}.${signatureTimestamp}.${body}`
        const secret = process.env.OZOW_WEBHOOK_SECRET!

        // Svix secrets are base64-encoded — decode first
        let secretBytes: Buffer
        try {
          // Strip 'whsec_' prefix if present
          const secretBase64 = secret.startsWith('whsec_')
            ? secret.slice(6)
            : secret
          secretBytes = Buffer.from(secretBase64, 'base64')
        } catch {
          secretBytes = Buffer.from(secret)
        }

        const expectedSig = crypto
          .createHmac('sha256', secretBytes)
          .update(signedContent)
          .digest('base64')

        // svix-signature can contain multiple signatures: "v1,<sig1> v1,<sig2>"
        const signatures = signatureHeader
          .split(' ')
          .map(s => s.replace(/^v1,/, '').trim())
          .filter(Boolean)

        valid = signatures.some(sig => {
          try {
            if (sig.length !== expectedSig.length) return false
            return crypto.timingSafeEqual(
              Buffer.from(expectedSig),
              Buffer.from(sig)
            )
          } catch {
            return false
          }
        })
      } else {
        // Fallback: simple HMAC comparison
        valid = verifyOzowSignature(body, signatureHeader)
      }

      if (!valid) {
        console.error('Ozow webhook: invalid signature')
        console.error('Headers received:', {
          'svix-id': signatureId,
          'svix-timestamp': signatureTimestamp,
          'svix-signature': signatureHeader?.slice(0, 40) + '...',
        })
        return Response.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } catch (err) {
      console.error('Ozow webhook: signature check error', err)
      return Response.json({ error: 'Signature error' }, { status: 401 })
    }
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('Ozow webhook received:', JSON.stringify(event, null, 2));

  // We only care about transaction.complete events
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
      payment_status: newPaymentStatus,   // keep our new field in sync
    })
    .eq('ozow_payment_id', paymentId);

  if (error) {
    console.error('Ozow webhook: supabase update error', error);
    return Response.json({ received: true });
  }

  console.log(`Ozow webhook: payment ${paymentId} marked as ${newStatus} / ${newPaymentStatus}`);
  return Response.json({ received: true });
}
