import { createClient } from '@supabase/supabase-js';
import { getOzowPaymentTransactions } from '@/lib/ozow';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guardId: string }> }
) {
  const { guardId } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const reference = request.nextUrl.searchParams.get('ref');

  if (!reference) {
    return NextResponse.redirect(new URL(`/pay/${guardId}/success?status=error`, siteUrl));
  }

  const { data: transaction } = await supabase
    .from('transactions')
    .select('id, ozow_payment_id, status')
    .eq('paystack_reference', reference)
    .maybeSingle();

  if (!transaction?.ozow_payment_id) {
    return NextResponse.redirect(new URL(`/pay/${guardId}/success?status=error`, siteUrl));
  }

  try {
    const result = await getOzowPaymentTransactions(transaction.ozow_payment_id);
console.log('Ozow transactions result:', JSON.stringify(result, null, 2));
const latestTransaction = result.transactions?.[0];
console.log('Latest transaction status:', latestTransaction?.status);
const isSuccess = latestTransaction?.status === 'successful';

    await supabase
      .from('transactions')
      .update({ status: isSuccess ? 'success' : 'cancelled' })
      .eq('id', transaction.id);

    const status = isSuccess ? 'success' : 'cancelled';
    return NextResponse.redirect(
      new URL(`/pay/${guardId}/success?status=${status}&reference=${reference}`, siteUrl)
    );
  } catch (err: any) {
    console.error('Ozow transaction check error:', err.message);
    return NextResponse.redirect(new URL(`/pay/${guardId}/success?status=error`, siteUrl));
  }
}
