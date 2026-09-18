import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { runIndividualPayout } from '../../../../../lib/payouts/payoutOrchestrator'
import { FeeDisposalMode, PeriodType } from '../../../../../lib/payouts/payoutTypes'

// POST /api/admin/payouts/initiate-individual
// Body: { guardId, periodType, periodStart, periodEnd, feeDisposalMode }

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { guardId, periodType, periodStart, periodEnd, feeDisposalMode } = body

    if (!guardId) return NextResponse.json({ error: 'guardId is required' }, { status: 400 })
    if (!periodStart || !periodEnd) return NextResponse.json({ error: 'periodStart and periodEnd are required' }, { status: 400 })
    if (!periodType || !['monthly', 'weekly'].includes(periodType)) return NextResponse.json({ error: 'periodType must be monthly or weekly' }, { status: 400 })

    if (isNaN(Date.parse(periodStart)) || isNaN(Date.parse(periodEnd))) {
      return NextResponse.json({ error: 'Invalid date format — use YYYY-MM-DD' }, { status: 400 })
    }
    if (new Date(periodEnd) < new Date(periodStart)) {
      return NextResponse.json({ error: 'periodEnd must be on or after periodStart' }, { status: 400 })
    }

    const resolvedFeeDisposalMode: FeeDisposalMode =
      feeDisposalMode === 'payout_to_scantippr' || feeDisposalMode === 'remain_in_float'
        ? feeDisposalMode
        : 'pending_decision'

    const resolvedPeriodType: PeriodType = periodType === 'weekly' ? 'weekly' : 'monthly'

    const { data: guard, error: guardError } = await supabase
      .from('guards')
      .select('id, company_id, first_name, last_name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('id', guardId)
      .is('company_id', null)
      .single()

    if (guardError || !guard) return NextResponse.json({ error: 'Independent worker not found' }, { status: 404 })

    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, guard_id, company_id, amount, payment_status, payout_status, fee_status, created_at')
      .eq('guard_id', guardId)
      .eq('payment_status', 'completed')
      .eq('payout_status', 'unpaid')
      .eq('fee_status', 'unpaid')
      .gte('created_at', periodStart)
      .lt('created_at', new Date(new Date(periodEnd).getTime() + 86400000).toISOString())

    const result = await runIndividualPayout(
      guard,
      transactions ?? [],
      { periodType: resolvedPeriodType, periodStart, periodEnd, feeDisposalMode: resolvedFeeDisposalMode }
    )

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })

    return NextResponse.json({
      success:        true,
      payoutPeriodId: result.payoutPeriodId,
      summary: {
        guardName:  `${guard.first_name} ${guard.last_name}`,
        periodType: resolvedPeriodType,
        periodStart,
        periodEnd,
        totalGross: result.summary?.totalGross,
        totalFee:   result.summary?.totalFee,
        totalNet:   result.summary?.totalNet,
        hasZeroNet: result.summary?.hasZeroNet,
      },
    })

  } catch (err) {
    console.error('[admin/payouts/initiate-individual] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
