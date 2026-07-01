import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  // Verify the webhook is actually from Paystack
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const { reference, amount, metadata } = event.data;
    const guardId = metadata?.guard_id;

    if (!guardId) {
      return Response.json({ error: 'No guard ID' }, { status: 400 });
    }

    // Look up the guard to get company_id
    const { data: guard } = await supabase
      .from('guards')
      .select('company_id')
      .eq('id', guardId)
      .maybeSingle();

    if (!guard) {
      return Response.json({ error: 'Guard not found' }, { status: 404 });
    }

    // Record the transaction
    await supabase.from('transactions').insert({
      guard_id: guardId,
      company_id: guard.company_id,
      amount: amount / 100, // convert from kobo/cents back to rands
      paystack_reference: reference,
      status: 'success',
    });
  }

  return Response.json({ received: true });
}