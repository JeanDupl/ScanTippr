import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyPeachSignature(params: Record<string, string>, secretToken: string, receivedSignature: string): boolean {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== 'signature')
    .sort();
  const signatureString = sortedKeys.map((key) => `${key}${params[key]}`).join('');
  const expected = crypto.createHmac('sha256', secretToken).update(signatureString).digest('hex');
  return expected === receivedSignature;
}

export async function POST(request: Request) {
  const body = await request.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  const { signature, ...rest } = params;
  const secretToken = process.env.PEACH_SECRET_TOKEN!;

  if (!verifyPeachSignature(rest, secretToken, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // result.code starting with 000.000 or 000.100 = success
  const resultCode: string = params['result.code'] ?? '';
  const isSuccess = resultCode.startsWith('000.000') || resultCode.startsWith('000.100');

  if (!isSuccess) {
    return Response.json({ received: true });
  }

  const guardId = params['customParameters[guard_id]'];
  const reference = params['merchantTransactionId'];
  const amount = parseFloat(params['amount'] ?? '0');

  if (!guardId) {
    return Response.json({ error: 'No guard ID' }, { status: 400 });
  }

  const { data: guard } = await supabase
    .from('guards')
    .select('company_id')
    .eq('id', guardId)
    .maybeSingle();

  if (!guard) {
    return Response.json({ error: 'Guard not found' }, { status: 404 });
  }

  await supabase.from('transactions').insert({
    guard_id: guardId,
    company_id: guard.company_id,
    amount,
    paystack_reference: reference,
    status: 'success',
  });

  return Response.json({ received: true });
}