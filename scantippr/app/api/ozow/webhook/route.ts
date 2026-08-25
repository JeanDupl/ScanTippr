import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyOzowSignature(body: string, receivedSignature: string): boolean {
  const secret = process.env.OZOW_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('X-Ozow-Signature') ?? '';

  // Verify signature — skip only if secret not yet configured (during setup)
  if (process.env.OZOW_WEBHOOK_SECRET) {
    try {
      const valid = verifyOzowSignature(body, signature);
      if (!valid) {
        console.error('Ozow webhook: invalid signature');
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch (err) {
      console.error('Ozow webhook: signature check error', err);
      return Response.json({ error: 'Signature error' }, { status: 401 });
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
  const transactionStatus = event.data?.status; // successful, error, cancelled, pending, refunded

  if (!paymentId) {
    console.error('Ozow webhook: missing paymentId');
    return Response.json({ received: true });
  }

  const isSuccess = transactionStatus === 'successful';
  const newStatus = isSuccess ? 'success' : 'failed';

  const { error } = await supabase
    .from('transactions')
    .update({ status: newStatus })
    .eq('ozow_payment_id', paymentId);

  if (error) {
    console.error('Ozow webhook: supabase update error', error);
    // Still return 200 so Ozow doesn't keep retrying for a DB glitch
    return Response.json({ received: true });
  }

  console.log(`Ozow webhook: payment ${paymentId} marked as ${newStatus}`);
  return Response.json({ received: true });
}
