// ============================================================
// lib/payouts/payoutOrchestrator.ts
// Orchestrates the full payout flow for one recipient/period:
//   1. Validate inputs
//   2. Calculate gross / fee / net per employee
//   3. Write payout_periods + payout_line_items + join table
//   4. Mark transactions as included
//   5. Send fee payout instruction to Ozow (if applicable)
//   6. Send net payout instruction to Ozow (if net > 0)
//   7. Update statuses based on Ozow responses
// ============================================================

import { createClient } from '@supabase/supabase-js'
import {
  Company,
  Guard,
  Transaction,
  PayoutSummary,
  FeeDisposalMode,
} from './payoutTypes'
import {
  calculateCompanyPayout,
  calculateIndividualPayout,
} from './calculatePayouts'
import { createOzowPayout } from './ozowPayout'

// ── Supabase client (service role — server-side only) ────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Input for the orchestrator ────────────────────────────────
export interface OrchestratorInput {
  periodMonth:     number           // 1–12
  periodYear:      number           // e.g. 2026
  feeDisposalMode: FeeDisposalMode  // how ScanTippr fee is handled
}

export interface OrchestratorResult {
  success:       boolean
  payoutPeriodId?: string
  summary?:      PayoutSummary
  error?:        string
}

// ── Guard against double-processing ──────────────────────────
async function periodAlreadyExists(
  supabase: ReturnType<typeof getSupabase>,
  recipientType: string,
  recipientId: string,
  periodMonth: number,
  periodYear: number
): Promise<boolean> {
  const { data } = await supabase
    .from('payout_periods')
    .select('id')
    .eq('recipient_type', recipientType)
    .eq('recipient_id', recipientId)
    .eq('period_month', periodMonth)
    .eq('period_year', periodYear)
    .maybeSingle()
  return !!data
}

// ── Write payout_periods record ───────────────────────────────
async function createPayoutPeriod(
  supabase: ReturnType<typeof getSupabase>,
  summary: PayoutSummary,
  feeDisposalMode: FeeDisposalMode
): Promise<string | null> {
  const { data, error } = await supabase
    .from('payout_periods')
    .insert({
      period_month:         summary.periodMonth,
      period_year:          summary.periodYear,
      recipient_type:       summary.recipientType,
      recipient_id:         summary.recipientId,
      gross_amount:         summary.totalGross,
      fee_amount:           summary.totalFee,
      net_amount:           summary.totalNet,
      bank_account_number:  summary.bankSnapshot.bankAccountNumber,
      bank_name:            summary.bankSnapshot.bankName,
      bank_account_holder:  summary.bankSnapshot.bankAccountHolder,
      bank_account_type:    summary.bankSnapshot.bankAccountType,
      fee_disposal_mode:    feeDisposalMode,
      fee_payout_status:    summary.hasZeroFee ? 'not_applicable' : 'pending',
      net_payout_status:    summary.hasZeroNet ? 'not_due' : 'pending',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[orchestrator] createPayoutPeriod error:', error)
    return null
  }
  return data.id
}

// ── Write payout_line_items + join table ──────────────────────
async function createLineItems(
  supabase: ReturnType<typeof getSupabase>,
  payoutPeriodId: string,
  summary: PayoutSummary
): Promise<boolean> {
  for (const li of summary.lineItems) {
    // Insert line item
    const { data: lineItem, error: liError } = await supabase
      .from('payout_line_items')
      .insert({
        payout_period_id: payoutPeriodId,
        guard_id:         li.guardId,
        guard_name:       li.guardName,
        period_month:     summary.periodMonth,
        period_year:      summary.periodYear,
        gross_amount:     li.grossAmount,
        fee_amount:       li.feeAmount,
        net_amount:       li.netAmount,
        tip_count:        li.transactionCount,
      })
      .select('id')
      .single()

    if (liError || !lineItem) {
      console.error('[orchestrator] createLineItem error:', liError)
      return false
    }

    // Insert join table rows (one per transaction)
    if (li.transactionIds.length > 0) {
      const joinRows = li.transactionIds.map((txId) => ({
        payout_line_item_id: lineItem.id,
        transaction_id:      txId,
      }))
      const { error: joinError } = await supabase
        .from('payout_line_item_tips')
        .insert(joinRows)

      if (joinError) {
        console.error('[orchestrator] createJoinRows error:', joinError)
        return false
      }
    }
  }
  return true
}

// ── Mark transactions as included ────────────────────────────
async function markTransactionsIncluded(
  supabase: ReturnType<typeof getSupabase>,
  summary: PayoutSummary,
  payoutPeriodId: string
): Promise<boolean> {
  const allTxIds = summary.lineItems.flatMap((li) => li.transactionIds)
  if (allTxIds.length === 0) return true

  const { error } = await supabase
    .from('transactions')
    .update({
      payout_status: 'included',
      fee_status:    'included',
    })
    .in('id', allTxIds)

  if (error) {
    console.error('[orchestrator] markTransactionsIncluded error:', error)
    return false
  }
  return true
}

// ── Update payout period status after Ozow calls ─────────────
async function updatePayoutPeriodStatus(
  supabase: ReturnType<typeof getSupabase>,
  payoutPeriodId: string,
  updates: Record<string, string | null>
): Promise<void> {
  const { error } = await supabase
    .from('payout_periods')
    .update(updates)
    .eq('id', payoutPeriodId)

  if (error) {
    console.error('[orchestrator] updatePayoutPeriodStatus error:', error)
  }
}

// ── Write ScanTippr fee record ────────────────────────────────
async function createFeeRecord(
  supabase: ReturnType<typeof getSupabase>,
  summary: PayoutSummary,
  payoutPeriodId: string,
  feeDisposalMode: FeeDisposalMode,
  ozowFeePayoutId: string | null
): Promise<void> {
  const { error } = await supabase
    .from('scantippr_fee_records')
    .insert({
      period_month:     summary.periodMonth,
      period_year:      summary.periodYear,
      payout_period_id: payoutPeriodId,
      recipient_type:   summary.recipientType,
      recipient_id:     summary.recipientId,
      fee_amount:       summary.totalFee,
      disposal_mode:    feeDisposalMode,
      status:           ozowFeePayoutId ? 'submitted' : 'pending',
      ozow_payout_id:   ozowFeePayoutId,
      submitted_at:     ozowFeePayoutId ? new Date().toISOString() : null,
    })

  if (error) {
    console.error('[orchestrator] createFeeRecord error:', error)
  }
}

// ── Main orchestrator: company-managed ───────────────────────

export async function runCompanyPayout(
  company: Company,
  guards: Guard[],
  transactions: Transaction[],
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const supabase = getSupabase()
  const { periodMonth, periodYear, feeDisposalMode } = input

  // 1. Guard against double-processing
  const exists = await periodAlreadyExists(
    supabase, 'company', company.id, periodMonth, periodYear
  )
  if (exists) {
    return {
      success: false,
      error: `Payout period ${periodMonth}/${periodYear} already exists for company ${company.id}`,
    }
  }

  // 2. Calculate
  const result = calculateCompanyPayout(company, guards, transactions, periodMonth, periodYear)
  if (!result.success) return { success: false, error: result.error }
  const { summary } = result

  // 3. Write payout_periods record
  const payoutPeriodId = await createPayoutPeriod(supabase, summary, feeDisposalMode)
  if (!payoutPeriodId) return { success: false, error: 'Failed to create payout period record' }

  // 4. Write line items + join table
  const lineItemsOk = await createLineItems(supabase, payoutPeriodId, summary)
  if (!lineItemsOk) return { success: false, error: 'Failed to create payout line items' }

  // 5. Mark transactions as included
  await markTransactionsIncluded(supabase, summary, payoutPeriodId)

  // 6. Fee payout instruction (if applicable)
  let ozowFeePayoutId: string | null = null
  if (!summary.hasZeroFee && feeDisposalMode === 'payout_to_scantippr') {
    const feeResult = await createOzowPayout({
      amount:         summary.totalFee,
      bank: {
        bankAccountNumber: process.env.SCANTIPPR_BANK_ACCOUNT_NUMBER!,
        bankName:          process.env.SCANTIPPR_BANK_NAME!,
        bankAccountHolder: process.env.SCANTIPPR_BANK_ACCOUNT_HOLDER!,
        bankAccountType:   process.env.SCANTIPPR_BANK_ACCOUNT_TYPE!,
      },
      reference:      `FEE-${periodYear}-${periodMonth}-${payoutPeriodId.slice(0, 8)}`,
      payoutPeriodId,
      description:    `ScanTippr fee — ${company.name} — ${periodMonth}/${periodYear}`,
    })

    if (feeResult.success) {
      ozowFeePayoutId = feeResult.ozowPayoutId ?? null
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status:  'submitted',
        fee_ozow_payout_id: ozowFeePayoutId,
        fee_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status: 'failed',
      })
      console.error('[orchestrator] fee payout failed:', feeResult.error)
    }
  } else if (feeDisposalMode === 'remain_in_float') {
    await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
      fee_payout_status: 'in_float',
    })
  }

  // 7. Write ScanTippr fee record
  await createFeeRecord(supabase, summary, payoutPeriodId, feeDisposalMode, ozowFeePayoutId)

  // 8. Net payout instruction
  if (!summary.hasZeroNet) {
    const netResult = await createOzowPayout({
      amount:         summary.totalNet,
      bank:           summary.bankSnapshot,
      reference:      `NET-${periodYear}-${periodMonth}-${payoutPeriodId.slice(0, 8)}`,
      payoutPeriodId,
      description:    `Net payout — ${company.name} — ${periodMonth}/${periodYear}`,
    })

    if (netResult.success) {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status:  'submitted',
        net_ozow_payout_id: netResult.ozowPayoutId ?? null,
        net_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status: 'failed',
      })
      console.error('[orchestrator] net payout failed:', netResult.error)
    }
  }

  return { success: true, payoutPeriodId, summary }
}

// ── Main orchestrator: individual-managed ────────────────────

export async function runIndividualPayout(
  guard: Guard,
  transactions: Transaction[],
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const supabase = getSupabase()
  const { periodMonth, periodYear, feeDisposalMode } = input

  // 1. Guard against double-processing
  const exists = await periodAlreadyExists(
    supabase, 'guard', guard.id, periodMonth, periodYear
  )
  if (exists) {
    return {
      success: false,
      error: `Payout period ${periodMonth}/${periodYear} already exists for guard ${guard.id}`,
    }
  }

  // 2. Calculate
  const result = calculateIndividualPayout(guard, transactions, periodMonth, periodYear)
  if (!result.success) return { success: false, error: result.error }
  const { summary } = result

  // 3. Write payout_periods record
  const payoutPeriodId = await createPayoutPeriod(supabase, summary, feeDisposalMode)
  if (!payoutPeriodId) return { success: false, error: 'Failed to create payout period record' }

  // 4. Write line items + join table
  const lineItemsOk = await createLineItems(supabase, payoutPeriodId, summary)
  if (!lineItemsOk) return { success: false, error: 'Failed to create payout line items' }

  // 5. Mark transactions as included
  await markTransactionsIncluded(supabase, summary, payoutPeriodId)

  // 6. Fee payout (same logic as company)
  let ozowFeePayoutId: string | null = null
  if (!summary.hasZeroFee && feeDisposalMode === 'payout_to_scantippr') {
    const feeResult = await createOzowPayout({
      amount:         summary.totalFee,
      bank: {
        bankAccountNumber: process.env.SCANTIPPR_BANK_ACCOUNT_NUMBER!,
        bankName:          process.env.SCANTIPPR_BANK_NAME!,
        bankAccountHolder: process.env.SCANTIPPR_BANK_ACCOUNT_HOLDER!,
        bankAccountType:   process.env.SCANTIPPR_BANK_ACCOUNT_TYPE!,
      },
      reference:      `FEE-${periodYear}-${periodMonth}-${payoutPeriodId.slice(0, 8)}`,
      payoutPeriodId,
      description:    `ScanTippr fee — ${guard.first_name} ${guard.last_name} — ${periodMonth}/${periodYear}`,
    })

    if (feeResult.success) {
      ozowFeePayoutId = feeResult.ozowPayoutId ?? null
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status:  'submitted',
        fee_ozow_payout_id: ozowFeePayoutId,
        fee_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status: 'failed',
      })
    }
  } else if (feeDisposalMode === 'remain_in_float') {
    await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
      fee_payout_status: 'in_float',
    })
  }

  // 7. Write ScanTippr fee record
  await createFeeRecord(supabase, summary, payoutPeriodId, feeDisposalMode, ozowFeePayoutId)

  // 8. Net payout
  if (!summary.hasZeroNet) {
    const netResult = await createOzowPayout({
      amount:         summary.totalNet,
      bank:           summary.bankSnapshot,
      reference:      `NET-${periodYear}-${periodMonth}-${payoutPeriodId.slice(0, 8)}`,
      payoutPeriodId,
      description:    `Net payout — ${guard.first_name} ${guard.last_name} — ${periodMonth}/${periodYear}`,
    })

    if (netResult.success) {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status:  'submitted',
        net_ozow_payout_id: netResult.ozowPayoutId ?? null,
        net_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status: 'failed',
      })
    }
  }

  return { success: true, payoutPeriodId, summary }
}

