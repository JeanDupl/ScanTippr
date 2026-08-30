import { NextRequest, NextResponse } from 'next/server'
import { createOzowPayout } from '@/lib/payouts/ozowPayout'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await createOzowPayout(body)
  return NextResponse.json(result)
}
