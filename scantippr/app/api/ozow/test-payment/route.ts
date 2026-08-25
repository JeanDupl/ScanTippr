import { NextResponse } from 'next/server';
import { createOzowPayment } from '@/lib/ozow';

export async function GET() {
  try {
    const payment = await createOzowPayment({
      amount: 25.00,
      merchantReference: `TEST-${Date.now()}`,
      returnUrl: 'https://example.com/payment-return',
    });
    return NextResponse.json({ success: true, payment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
