import { NextRequest, NextResponse } from 'next/server'
import { createOzowPayout } from '@/lib/payouts/ozowPayout'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const started = Date.now()
  const result = await createOzowPayout(body)
  const duration = Date.now() - started

  const statusMap: Record<number, string> = {
    1: 'BelowMinimumAmount',
    2: 'AboveMaximumAmount',
    3: 'Pending',
    4: 'PayoutProcessingError',
    5: 'PayoutComplete',
    90: 'PayoutReturned',
    99: 'PayoutCancelled',
  }

  const subStatusMap: Record<number, string> = {
    101: 'Rejected - Amount below minimum',
    102: 'Rejected - Amount above maximum',
    201: 'Verification pending',
    202: 'Verification successful',
    266: 'Account decryption failed',
  }

  return NextResponse.json({
    test: {
      amount: body.amount,
      reference: body.reference,
      bank: body.bank?.bankName,
      timestamp: new Date().toISOString(),
      durationMs: duration,
    },
    result: {
      success: result.success,
      ozowPayoutId: result.ozowPayoutId,
      status: result.status,
      statusDescription: result.status ? (statusMap[result.status] ?? 'Unknown') : null,
      subStatus: result.subStatus,
      subStatusDescription: result.subStatus ? (subStatusMap[result.subStatus] ?? 'Unknown') : null,
      encryptionKey: result.encryptionKey ? '***stored***' : null,
      error: result.error ?? null,
    },
  })
}
