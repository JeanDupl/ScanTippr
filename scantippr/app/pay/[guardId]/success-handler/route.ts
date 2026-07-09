import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyPeachSignature(
  params: Record<string, string>,
  secretToken: string,
  receivedSignature: string
): boolean {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== 'signature')
    .sort();
  const signatureString = sortedKeys.map((key) => `${key}${params[key]}`).join('');
  const expected = crypto.createHmac('sha256', secretToken).update(signatureString).digest('hex');
  return expected === receivedSignature;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { guardId: string } }
) {
  const { guardId } = params;
  const body = await request.text();
  const formParams = Object.fromEntries(new URLSearchParams(body));

  const { signature, ...rest } = formParams;
  const secretToken = process.env.PEACH_SECRET_TOKEN!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (signature && !verifyPeachSignature(rest, secretToken, signature)) {
    return NextResponse.redirect(new URL(`/pay/${guardId}/success?status=error`, siteUrl));
  }

  const resultCode: string = formParams['result.code'] ?? '';
  const isSuccess = resultCode.startsWith('000.000') || resultCode.startsWith('000.100');
  const reference = formParams['merchantTransactionId'] ?? '';

  if (isSuccess) {
    const amount = parseFloat(formParams['amount'] ?? '0');

    const { data: guard } = await supabase
      .from('guards')
      .select('company_id')
      .eq('id', guardId)
      .maybeSingle();

    if (guard) {
      await supabase.from('transactions').insert({
        guard_id: guardId,
        company_id: guard.company_id,
        amount,
        paystack_reference: reference,
        status: 'success',
      });
    }
  }

  const status = isSuccess ? 'success' : 'cancelled';
  return NextResponse.redirect(
    new URL(`/pay/${guardId}/success?status=${status}&reference=${reference}`, siteUrl)
  );
}