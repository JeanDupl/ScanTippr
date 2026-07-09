import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

function generatePeachSignature(params: Record<string, string>, secretToken: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys.map((key) => `${key}${params[key]}`).join('');
  return crypto.createHmac('sha256', secretToken).update(signatureString).digest('hex');
}

export async function POST(request: Request) {
  const { guardId, amount } = await request.json();

  const { data: guard, error } = await supabase
    .from('guards')
    .select('id, first_name, last_name, company_id, companies(name)')
    .eq('id', guardId)
    .maybeSingle();

  if (!guard || error) {
    return Response.json({ error: 'Guard not found' }, { status: 404 });
  }

  const entityId = process.env.PEACH_ENTITY_ID!;
  const secretToken = process.env.PEACH_SECRET_TOKEN!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const merchantTransactionId = `TIP-${guardId}-${Date.now()}`;
  const nonce = crypto.randomBytes(16).toString('hex');

  const params: Record<string, string> = {
    'authentication.entityId': entityId,
    amount: amount.toFixed(2),
    currency: 'ZAR',
    merchantTransactionId,
    nonce,
    paymentType: 'DB',
    shopperResultUrl: `${siteUrl}/pay/${guardId}/success`,
    'customParameters[guard_id]': guardId,
    'customParameters[guard_name]': `${guard.first_name} ${guard.last_name}`,
  };

  const signature = generatePeachSignature(params, secretToken);

  const body = new URLSearchParams({ ...params, signature });

  const peachRes = await fetch('https://testsecure.peachpayments.com/checkout/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Referer: siteUrl,
    },
    body: body.toString(),
  });

  const peachData = await peachRes.json();

  if (!peachData.redirectUrl) {
    console.error('Peach error:', peachData);
    return Response.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }

  return Response.json({
    authorization_url: peachData.redirectUrl,
    reference: merchantTransactionId,
  });
}