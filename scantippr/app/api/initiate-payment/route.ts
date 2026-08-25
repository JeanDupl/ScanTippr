import { createClient } from '@supabase/supabase-js';
import { createOzowPayment } from '@/lib/ozow';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { guardId, amount, institutionId } = await request.json();
const formattedAmount = Number(parseFloat(amount).toFixed(2));
console.log('Payment request - amount:', formattedAmount, typeof formattedAmount);

  const { data: guard, error } = await supabase
    .from('guards')
    .select('id, first_name, last_name, company_id')
    .eq('id', guardId)
    .maybeSingle();

  if (!guard || error) {
    return Response.json({ error: 'Guard not found' }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const merchantReference = `TIP-${guardId.slice(0, 8)}-${Date.now()}`;
  const beneficiaryReference = `TIP${guardId.replace(/-/g, '').slice(0, 15)}`.toUpperCase();

  try {
        const payment = await createOzowPayment({
      amount: formattedAmount,
      merchantReference,
      beneficiaryReference,
      returnUrl: `${siteUrl}/pay/${guardId}/success-handler?ref=${merchantReference}`,
      institutionId,
    });

    // Save a pending transaction row so we have something to update when the customer returns
    await supabase.from('transactions').insert({
      guard_id: guardId,
      company_id: guard.company_id,
      amount,
      paystack_reference: merchantReference,
      status: 'pending',
      ozow_payment_id: payment.id,
    });

    return Response.json({
      authorization_url: payment.redirectUrl,
      reference: merchantReference,
    });
  } catch (err: any) {
    console.error('Ozow initiate error:', err.message);
    return Response.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}
