import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(body: string, receivedSignature: string): boolean {
  const secret = process.env.OZOW_PAYOUT_WEBHOOK_SECRET!;
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

  if (process.env.OZOW_PAYOUT_WEBHOOK_SECRET) {
    try {
      const valid = verifySignature(body, signature);
      if (!valid) {
        console.error('Ozow payout webhook: invalid signature');
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch (err) {
      console.error('Ozow payout webhook: signature check error', err);
      return Response.json({ error: 'Signature error' }, { status: 401 });
    }
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('Ozow payout webhook received:', JSON.stringify(event, null, 2));

  // Handle payout status updates
  const payoutId = event.payoutId ?? event.id;
  const status = event.status;

  if (!payoutId || !status) {
    console.error('Ozow payout webhook: missing payoutId or status');
    return Response.json({ received: true });
  }

  const newStatus = status === 'successful' ? 'success' : 'failed';

  const { error } = await supabase
    .from('payouts')
    .update({ status: newStatus })
    .eq('ozow_payout_id', payoutId);

  if (error) {
    console.error('Ozow payout webhook: supabase update error', error);
  }

  console.log(`Ozow payout webhook: payout ${payoutId} marked as ${newStatus}`);
  return Response.json({ received: true });
}