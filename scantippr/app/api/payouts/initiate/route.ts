import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { runCompanyPayout, runIndividualPayout } from '../../../../lib/payouts/payoutOrchestrator'
import { FeeDisposalMode } from '../../../../lib/payouts/payoutTypes'

// POST /api/payouts/initiate
// Server-side only — initiates a payout for the authenticated user's company
// Body: { periodMonth: number, periodYear: number, feeDisposalMode: string }

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify authentication
    const cookieStore = await cookies()
    const userId = cookieStore.get('sb_user_id')?.value
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const companyId = profile.company_id

    // Parse and validate body
    const body = await request.json()
    const { periodMonth, periodYear, feeDisposalMode } = body

    if (!periodMonth || !periodYear) {
      return NextResponse.json(
        { error: 'periodMonth and periodYear are required' },
        { status: 400 }
      )
    }

    if (periodMonth < 1 || periodMonth > 12) {
      return NextResponse.json({ error: 'periodMonth must be 1–12' }, { status: 400 })
    }

    if (periodYear < 2024) {
      return NextResponse.json({ error: 'periodYear must be 2024 or later' }, { status: 400 })
    }

    const resolvedFeeDisposalMode: FeeDisposalMode =
      feeDisposalMode === 'payout_to_scantippr' || feeDisposalMode === 'remain_in_float'
        ? feeDisposalMode
        : 'pending_decision'

    // Fetch company with bank details
    const { data: company } = await supabase
      .from('companies')
      .select('id, name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('id', companyId)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Fetch active guards for this company
    const { data: guards } = await supabase
      .from('guards')
      .select('id, company_id, first_name, last_name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (!guards || guards.length === 0) {
      return NextResponse.json({ error: 'No active employees found' }, { status: 400 })
    }

    // Fetch completed + unpaid transactions for this period
    const periodStart = new Date(periodYear, periodMonth - 1, 1).toISOString()
    const periodEnd   = new Date(periodYear, periodMonth, 1).toISOString()

    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, guard_id, company_id, amount, payment_status, payout_status, fee_status, created_at')
      .eq('company_id', companyId)
      .eq('payment_status', 'completed')
      .eq('payout_status', 'unpaid')
      .eq('fee_status', 'unpaid')
      .gte('created_at', periodStart)
      .lt('created_at', periodEnd)

    // Run the orchestrator
    const result = await runCompanyPayout(
      company,
      guards,
      transactions ?? [],
      {
        periodMonth,
        periodYear,
        feeDisposalMode: resolvedFeeDisposalMode,
      }
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success:       true,
      payoutPeriodId: result.payoutPeriodId,
      summary: {
        periodMonth,
        periodYear,
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
