import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { guardId, amount } = await request.json();

  // Look up the guard and their company's subaccount
  const { data: guard, error } = await supabase
    .from('guards')
    .select('id, first_name, last_name, company_id, companies(paystack_subaccount_code, name)')
    .eq('id', guardId)
    .maybeSingle();

  if (!guard || error) {
    return Response.json({ error: 'Guard not found' }, { status: 404 });
  }

  const subaccountCode = (guard as any).companies?.paystack_subaccount_code;

  if (!subaccountCode) {
    return Response.json({ error: 'Payment not set up for this guard yet' }, { status: 400 });
  }

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'tipper@scantippr.co.za',
      amount: amount * 100,
      currency: 'ZAR',
      subaccount: subaccountCode,
      callback_url: `https://www.scantippr.co.za/pay/${guardId}/success`,
      metadata: {
        guard_id: guardId,
        guard_name: `${guard.first_name} ${guard.last_name}`,
      },
    }),
  });

  const paystackData = await paystackRes.json();

  if (!paystackData.status) {
    return Response.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }

  return Response.json({
    authorization_url: paystackData.data.authorization_url,
    reference: paystackData.data.reference,
  });
}