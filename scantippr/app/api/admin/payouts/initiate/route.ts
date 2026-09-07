import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { runCompanyPayout } from '../../../../../lib/payouts/payoutOrchestrator'
import { FeeDisposalMode } from '../../../../../lib/payouts/payoutTypes'

// POST /api/admin/payouts/initiate
// Admin-only — initiates a payout for any company by companyId.
// No cookie auth: this route is only reachable from the admin dashboard
// which uses the service role key throughout.
// Body: { companyId: string, periodMonth: number, periodYear: number, feeDisposalMode?: string }

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { companyId, periodMonth, periodYear, feeDisposalMode } = body

    // ── Validate inputs ───────────────────────────────────────
    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

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

    // ── Fetch company ─────────────────────────────────────────
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('id', companyId)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // ── Fetch active guards ───────────────────────────────────
    const { data: guards } = await supabase
      .from('guards')
      .select('id, company_id, first_name, last_name, bank_account_number, bank_name, bank_account_holder, bank_account_type')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (!guards || guards.length === 0) {
      return NextResponse.json({ error: 'No active employees found for this company' }, { status: 400 })
    }

    // ── Fetch unpaid transactions for this period ─────────────
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

    // ── Run orchestrator ──────────────────────────────────────
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
      success:        true,
      payoutPeriodId: result.payoutPeriodId,
      summary: {
        companyName:   company.name,
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
    console.error('[admin/payouts/initiate] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
