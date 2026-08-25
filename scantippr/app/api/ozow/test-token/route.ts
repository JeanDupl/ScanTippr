import { NextResponse } from 'next/server';
import { getOzowAccessToken } from '@/lib/ozow';

export async function GET() {
  try {
    const token = await getOzowAccessToken();
    return NextResponse.json({ success: true, tokenPreview: token.slice(0, 12) + '...' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
