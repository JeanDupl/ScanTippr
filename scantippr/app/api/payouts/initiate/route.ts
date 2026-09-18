import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { runCompanyPayout } from '../../../../lib/payouts/payoutOrchestrator'
import { FeeDisposalMode } from '../../../../lib/payouts/payoutTypes'

// POST /api/payouts/initiate
// Server-side only — initiates a payout for the authenticated user's company
// Body: { periodStart: string, periodEnd: string, feeDisposalMode?: string }
// NOTE: This route is currently unused — payouts are initiated via /api/admin/payouts/initiate

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const cookieStore = await cookies()
    const userId = cookieStore.get('sb_user_id')?.value
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (!profile?.company_id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const companyId = profile.company_id
    const body = await request.json()
    const { periodStart, periodEnd, feeDisposalMode } = body

    if (!periodStart || !periodEnd) {
      return NextResponse.json({ error: 'periodStart and periodEnd are required' }, { status: 400 })
    }

    if (isNaN(Date.parse(periodStart)) || isNaN(Date.parse(periodEnd))) {
      return NextResponse.json({ error: 'Invalid date format — use YYYY-MM-DD' }, { status: 400 })
    }

    const resolvedFeeDisposalMode: FeeDisposalMode =
      feeDisposalMode === 'payout_to_scantippr' || feeDisposalMode === 'remain_in_float'
        ? feeDisposalMode
        : 'pending_decision'

    const { data: company } = await supabase
      .from('companies')
      .select('id, name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('id', companyId)
      .single()

    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

    const { data: guards } = await supabase
      .from('guards')
      .select('id, company_id, first_name, last_name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (!guards || guards.length === 0) {
      return NextResponse.json({ error: 'No active employees found' }, { status: 400 })
    }

    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, guard_id, company_id, amount, payment_status, payout_status, fee_status, created_at')
      .eq('company_id', companyId)
      .eq('payment_status', 'completed')
      .eq('payout_status', 'unpaid')
      .eq('fee_status', 'unpaid')
      .gte('created_at', periodStart)
      .lt('created_at', new Date(new Date(periodEnd).getTime() + 86400000).toISOString())

    const result = await runCompanyPayout(
      company,
      guards,
      transactions ?? [],
      { periodType: 'monthly', periodStart, periodEnd, feeDisposalMode: resolvedFeeDisposalMode }
    )

    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })

    return NextResponse.json({
      success:        true,
      payoutPeriodId: result.payoutPeriodId,
      summary: {
        periodStart,
        periodEnd,
        totalGross:    result.summary?.totalGross,
        totalFee:      result.summary?.totalFee,
        totalNet:      result.summary?.totalNet,
        employeeCount: result.summary?.lineItems.length,
        hasZeroNet:    result.summary?.hasZeroNet,
      },
    })

  } catch (err) {
    console.error('[payouts/initiate] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
