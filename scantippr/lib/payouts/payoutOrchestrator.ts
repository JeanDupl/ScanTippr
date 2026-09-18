// ============================================================
// lib/payouts/payoutOrchestrator.ts
// ============================================================

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import {
  Company,
  Guard,
  Transaction,
  PayoutSummary,
  FeeDisposalMode,
  PeriodType,
} from './payoutTypes'
import {
  calculateCompanyPayout,
  calculateIndividualPayout,
} from './calculatePayouts'
import { createOzowPayout } from './ozowPayout'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface OrchestratorInput {
  periodType:      PeriodType
  periodStart:     string   // YYYY-MM-DD
  periodEnd:       string   // YYYY-MM-DD
  feeDisposalMode: FeeDisposalMode
}

export interface OrchestratorResult {
  success:         boolean
  payoutPeriodId?: string
  summary?:        PayoutSummary
  error?:          string
}

async function periodAlreadyExists(
  supabase: ReturnType<typeof getSupabase>,
  recipientType: string,
  recipientId: string,
  periodStart: string,
  periodEnd: string
): Promise<boolean> {
  const { data } = await supabase
    .from('payout_periods')
    .select('id')
    .eq('recipient_type', recipientType)
    .eq('recipient_id', recipientId)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
    .maybeSingle()
  return !!data
}

async function createPayoutPeriod(
  supabase: ReturnType<typeof getSupabase>,
  summary: PayoutSummary,
  feeDisposalMode: FeeDisposalMode
): Promise<string | null> {
  const { data, error } = await supabase
    .from('payout_periods')
    .insert({
      period_type:          summary.periodType,
      period_start:         summary.periodStart,
      period_end:           summary.periodEnd,
      // Only set month/year for monthly periods
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

async function createLineItems(
  supabase: ReturnType<typeof getSupabase>,
  payoutPeriodId: string,
  summary: PayoutSummary
): Promise<boolean> {
  for (const li of summary.lineItems) {
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

async function markTransactionsIncluded(
  supabase: ReturnType<typeof getSupabase>,
  summary: PayoutSummary,
  payoutPeriodId: string
): Promise<boolean> {
  const allTxIds = summary.lineItems.flatMap((li) => li.transactionIds)
  if (allTxIds.length === 0) return true

  const { error } = await supabase
    .from('transactions')
    .update({ payout_status: 'included', fee_status: 'included' })
    .in('id', allTxIds)

  if (error) {
    console.error('[orchestrator] markTransactionsIncluded error:', error)
    return false
  }
  return true
}

async function updatePayoutPeriodStatus(
  supabase: ReturnType<typeof getSupabase>,
  payoutPeriodId: string,
  updates: Record<string, string | null>
): Promise<void> {
  const { error } = await supabase
    .from('payout_periods')
    .update(updates)
    .eq('id', payoutPeriodId)

  if (error) console.error('[orchestrator] updatePayoutPeriodStatus error:', error)
}

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

  if (error) console.error('[orchestrator] createFeeRecord error:', error)
}

// Short reference for bank statements
function shortRef(prefix: string, periodType: PeriodType, periodStart: string): string {
  // e.g. NET-2026-09 for monthly, NET-2026-09-07 for weekly
  const date = periodStart.substring(0, periodType === 'weekly' ? 10 : 7)
  return `${prefix}-${date}`
}

// ── Company payout ────────────────────────────────────────────

export async function runCompanyPayout(
  company: Company,
  guards: Guard[],
  transactions: Transaction[],
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const supabase = getSupabase()
  const { periodType, periodStart, periodEnd, feeDisposalMode } = input

  const exists = await periodAlreadyExists(supabase, 'company', company.id, periodStart, periodEnd)
  if (exists) {
    return { success: false, error: `Payout period ${periodStart}–${periodEnd} already exists for company ${company.id}` }
  }

  const result = calculateCompanyPayout(company, guards, transactions, periodType, periodStart, periodEnd)
  if (!result.success) return { success: false, error: result.error }
  const { summary } = result

  const payoutPeriodId = await createPayoutPeriod(supabase, summary, feeDisposalMode)
  if (!payoutPeriodId) return { success: false, error: 'Failed to create payout period record' }

  const lineItemsOk = await createLineItems(supabase, payoutPeriodId, summary)
  if (!lineItemsOk) return { success: false, error: 'Failed to create payout line items' }

  await markTransactionsIncluded(supabase, summary, payoutPeriodId)

  let ozowFeePayoutId: string | null = null
  if (!summary.hasZeroFee && feeDisposalMode === 'payout_to_scantippr') {
    const feeRef = shortRef('FEE', periodType, periodStart)
    const feeResult = await createOzowPayout({
      amount:            summary.totalFee,
      bank: {
        bankAccountNumber: process.env.SCANTIPPR_BANK_ACCOUNT_NUMBER!,
        bankName:          process.env.SCANTIPPR_BANK_NAME!,
        bankAccountHolder: process.env.SCANTIPPR_BANK_ACCOUNT_HOLDER!,
        bankAccountType:   process.env.SCANTIPPR_BANK_ACCOUNT_TYPE!,
      },
      reference:         feeRef,
      customerReference: feeRef,
      payoutPeriodId,
      description:       `ScanTippr fee — ${company.name} — ${periodStart}`,
    })

    if (feeResult.success) {
      ozowFeePayoutId = feeResult.ozowPayoutId ?? null
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status:  'submitted',
        fee_ozow_payout_id: ozowFeePayoutId,
        fee_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, { fee_payout_status: 'failed' })
      console.error('[orchestrator] fee payout failed:', feeResult.error)
    }
  } else if (feeDisposalMode === 'remain_in_float') {
    await updatePayoutPeriodStatus(supabase, payoutPeriodId, { fee_payout_status: 'in_float' })
  }

  await createFeeRecord(supabase, summary, payoutPeriodId, feeDisposalMode, ozowFeePayoutId)

  if (!summary.hasZeroNet) {
    const netRef        = shortRef('NET', periodType, periodStart)
    const encryptionKey = crypto.randomBytes(16).toString('hex').substring(0, 16)

    await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
      net_merchant_reference: netRef,
      encryption_key:         encryptionKey,
      net_payout_status:      'initiating',
    })

    const netResult = await createOzowPayout({
      amount:            summary.totalNet,
      bank:              summary.bankSnapshot,
      reference:         netRef,
      customerReference: netRef,
      payoutPeriodId,
      encryptionKey,
      description:       `Net payout — ${company.name} — ${periodStart}`,
    })

    if (netResult.success) {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status:  'submitted',
        net_ozow_payout_id: netResult.ozowPayoutId ?? null,
        net_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, { net_payout_status: 'failed' })
      console.error('[orchestrator] net payout failed:', netResult.error)
    }
  }

  return { success: true, payoutPeriodId, summary }
}

// ── Individual payout ─────────────────────────────────────────

export async function runIndividualPayout(
  guard: Guard,
  transactions: Transaction[],
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const supabase = getSupabase()
  const { periodType, periodStart, periodEnd, feeDisposalMode } = input

  const exists = await periodAlreadyExists(supabase, 'guard', guard.id, periodStart, periodEnd)
  if (exists) {
    return { success: false, error: `Payout period ${periodStart}–${periodEnd} already exists for guard ${guard.id}` }
  }

  const result = calculateIndividualPayout(guard, transactions, periodType, periodStart, periodEnd)
  if (!result.success) return { success: false, error: result.error }
  const { summary } = result

  const payoutPeriodId = await createPayoutPeriod(supabase, summary, feeDisposalMode)
  if (!payoutPeriodId) return { success: false, error: 'Failed to create payout period record' }

  const lineItemsOk = await createLineItems(supabase, payoutPeriodId, summary)
  if (!lineItemsOk) return { success: false, error: 'Failed to create payout line items' }

  await markTransactionsIncluded(supabase, summary, payoutPeriodId)

  let ozowFeePayoutId: string | null = null
  if (!summary.hasZeroFee && feeDisposalMode === 'payout_to_scantippr') {
    const feeRef = shortRef('FEE', periodType, periodStart)
    const feeResult = await createOzowPayout({
      amount:            summary.totalFee,
      bank: {
        bankAccountNumber: process.env.SCANTIPPR_BANK_ACCOUNT_NUMBER!,
        bankName:          process.env.SCANTIPPR_BANK_NAME!,
        bankAccountHolder: process.env.SCANTIPPR_BANK_ACCOUNT_HOLDER!,
        bankAccountType:   process.env.SCANTIPPR_BANK_ACCOUNT_TYPE!,
      },
      reference:         feeRef,
      customerReference: feeRef,
      payoutPeriodId,
      description:       `ScanTippr fee — ${guard.first_name} ${guard.last_name} — ${periodStart}`,
    })

    if (feeResult.success) {
      ozowFeePayoutId = feeResult.ozowPayoutId ?? null
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        fee_payout_status:  'submitted',
        fee_ozow_payout_id: ozowFeePayoutId,
        fee_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, { fee_payout_status: 'failed' })
    }
  } else if (feeDisposalMode === 'remain_in_float') {
    await updatePayoutPeriodStatus(supabase, payoutPeriodId, { fee_payout_status: 'in_float' })
  }

  await createFeeRecord(supabase, summary, payoutPeriodId, feeDisposalMode, ozowFeePayoutId)

  if (!summary.hasZeroNet) {
    const netRef        = shortRef('NET', periodType, periodStart)
    const encryptionKey = crypto.randomBytes(16).toString('hex').substring(0, 16)

    await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
      net_merchant_reference: netRef,
      encryption_key:         encryptionKey,
      net_payout_status:      'initiating',
    })

    const netResult = await createOzowPayout({
      amount:            summary.totalNet,
      bank:              summary.bankSnapshot,
      reference:         netRef,
      customerReference: netRef,
      payoutPeriodId,
      encryptionKey,
      description:       `Net payout — ${guard.first_name} ${guard.last_name} — ${periodStart}`,
    })

    if (netResult.success) {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, {
        net_payout_status:  'submitted',
        net_ozow_payout_id: netResult.ozowPayoutId ?? null,
        net_submitted_at:   new Date().toISOString(),
      })
    } else {
      await updatePayoutPeriodStatus(supabase, payoutPeriodId, { net_payout_status: 'failed' })
    }
  }

  return { success: true, payoutPeriodId, summary }
}
