import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { runHybridPayout } from '../../../../../lib/payouts/payoutOrchestrator'
import { FeeDisposalMode, PeriodType } from '../../../../../lib/payouts/payoutTypes'

// POST /api/admin/payouts/initiate-hybrid
// Body: { companyId, periodType, periodStart, periodEnd, feeDisposalMode }
// Fires one Ozow payout per employee, each to their own bank account.

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { companyId, periodType, periodStart, periodEnd, feeDisposalMode } = body

    if (!companyId)              return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    if (!periodStart || !periodEnd) return NextResponse.json({ error: 'periodStart and periodEnd are required' }, { status: 400 })
    if (!periodType || !['monthly', 'weekly'].includes(periodType))
      return NextResponse.json({ error: 'periodType must be monthly or weekly' }, { status: 400 })
    if (isNaN(Date.parse(periodStart)) || isNaN(Date.parse(periodEnd)))
      return NextResponse.json({ error: 'Invalid date format — use YYYY-MM-DD' }, { status: 400 })
    if (new Date(periodEnd) < new Date(periodStart))
      return NextResponse.json({ error: 'periodEnd must be on or after periodStart' }, { status: 400 })

    const resolvedFeeDisposalMode: FeeDisposalMode =
      feeDisposalMode === 'payout_to_scantippr' || feeDisposalMode === 'remain_in_float'
        ? feeDisposalMode
        : 'pending_decision'

    const resolvedPeriodType: PeriodType = periodType === 'weekly' ? 'weekly' : 'monthly'

    // Fetch company — must be model_type = 'hybrid'
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name, model_type, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('id', companyId)
      .single()

    if (companyError || !company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    if (company.model_type !== 'hybrid')
      return NextResponse.json({ error: 'Company is not a Hybrid model company' }, { status: 400 })

    // Fetch active employees — bank details required per employee
    const { data: guards } = await supabase
      .from('guards')
      .select('id, company_id, first_name, last_name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (!guards || guards.length === 0)
      return NextResponse.json({ error: 'No active employees found for this company' }, { status: 400 })

    // Fetch unpaid transactions for the period
    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, guard_id, company_id, amount, payment_status, payout_status, fee_status, created_at')
      .eq('company_id', companyId)
      .eq('payment_status', 'completed')
      .eq('payout_status', 'unpaid')
      .eq('fee_status', 'unpaid')
      .gte('created_at', periodStart)
      .lt('created_at', new Date(new Date(periodEnd).getTime() + 86400000).toISOString())

    const result = await runHybridPayout(
      company,
      guards,
      transactions ?? [],
      { periodType: resolvedPeriodType, periodStart, periodEnd, feeDisposalMode: resolvedFeeDisposalMode }
    )

    const status = result.success ? 200 : result.failCount > 0 && result.successCount > 0 ? 207 : 400

    return NextResponse.json({
      success:        result.success,
      companyName:    result.companyName,
      periodType:     resolvedPeriodType,
      periodStart,
      periodEnd,
      totalEmployees: result.totalEmployees,
      successCount:   result.successCount,
      failCount:      result.failCount,
      employeeResults: result.employeeResults,
      error:          result.error,
    }, { status })

  } catch (err) {
    console.error('[admin/payouts/initiate-hybrid] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
