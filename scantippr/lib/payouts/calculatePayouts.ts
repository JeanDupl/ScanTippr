// ============================================================
// lib/payouts/calculatePayouts.ts
// Pure fee calculation engine — no Ozow, no DB writes
// ============================================================

import {
  Transaction,
  Guard,
  Company,
  EmployeeLineItem,
  PayoutSummary,
  BankSnapshot,
  CalculationResult,
  PeriodType,
  SCANTIPPR_FEE_CAP,
} from './payoutTypes'

// ── Fee calculation ──────────────────────────────────────────

export function calculateEmployeeFee(grossAmount: number): number {
  if (grossAmount <= 0) return 0
  return Math.min(SCANTIPPR_FEE_CAP, grossAmount)
}

export function calculateEmployeeNet(grossAmount: number): number {
  const fee = calculateEmployeeFee(grossAmount)
  return Math.max(0, grossAmount - fee)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// ── Period helpers ───────────────────────────────────────────

/**
 * Derive periodMonth/periodYear from a date string for monthly periods.
 * Returns null for weekly periods.
 */
function monthYearFromDate(
  periodType: PeriodType,
  periodStart: string
): { periodMonth: number | null; periodYear: number | null } {
  if (periodType === 'monthly') {
    const d = new Date(periodStart)
    return { periodMonth: d.getMonth() + 1, periodYear: d.getFullYear() }
  }
  return { periodMonth: null, periodYear: null }
}

// ── Per-employee line item ────────────────────────────────────

function buildEmployeeLineItem(
  guard: Guard,
  transactions: Transaction[]
): EmployeeLineItem {
  const eligible = transactions.filter(
    (tx) =>
      tx.payment_status === 'completed' &&
      tx.payout_status === 'unpaid' &&
      tx.fee_status === 'unpaid'
  )

  const grossAmount = round2(eligible.reduce((sum, tx) => sum + Number(tx.amount), 0))
  const feeAmount   = round2(calculateEmployeeFee(grossAmount))
  const netAmount   = round2(calculateEmployeeNet(grossAmount))

  return {
    guardId:          guard.id,
    guardName:        `${guard.first_name} ${guard.last_name}`.trim(),
    transactionIds:   eligible.map((tx) => tx.id),
    transactionCount: eligible.length,
    grossAmount,
    feeAmount,
    netAmount,
  }
}

// ── Bank detail validation ────────────────────────────────────

function validateBankDetails(
  details: {
    bank_account_number: string | null
    bank_name: string | null
    bank_account_holder: string | null
    bank_account_type: string | null
  },
  ownerName: string
): { valid: true; snapshot: BankSnapshot } | { valid: false; error: string } {
  const { bank_account_number, bank_name, bank_account_holder, bank_account_type } = details

  if (!bank_account_number || !bank_name || !bank_account_holder || !bank_account_type) {
    return {
      valid: false,
      error: `Bank details are incomplete for ${ownerName}. Please update them in Settings before initiating a payout.`,
    }
  }

  return {
    valid: true,
    snapshot: {
      bankAccountNumber: bank_account_number.trim(),
      bankName:          bank_name.trim(),
      bankAccountHolder: bank_account_holder.trim(),
      bankAccountType:   bank_account_type.trim(),
    },
  }
}

// ── Company payout calculation ────────────────────────────────

export function calculateCompanyPayout(
  company: Company,
  guards: Guard[],
  transactions: Transaction[],
  periodType: PeriodType,
  periodStart: string,
  periodEnd: string
): CalculationResult {
  const bankResult = validateBankDetails(company, company.name)
  if (!bankResult.valid) return { success: false, error: bankResult.error }

  const txByGuard = new Map<string, Transaction[]>()
  for (const guard of guards) txByGuard.set(guard.id, [])
  for (const tx of transactions) {
    if (txByGuard.has(tx.guard_id)) txByGuard.get(tx.guard_id)!.push(tx)
  }

  const lineItems = guards.map((guard) =>
    buildEmployeeLineItem(guard, txByGuard.get(guard.id) ?? [])
  )

  const totalGross = round2(lineItems.reduce((sum, li) => sum + li.grossAmount, 0))
  const totalFee   = round2(lineItems.reduce((sum, li) => sum + li.feeAmount,   0))
  const totalNet   = round2(lineItems.reduce((sum, li) => sum + li.netAmount,   0))

  const { periodMonth, periodYear } = monthYearFromDate(periodType, periodStart)

  const summary: PayoutSummary = {
    periodType,
    periodStart,
    periodEnd,
    periodMonth,
    periodYear,
    recipientType: 'company',
    recipientId:   company.id,
    lineItems,
    totalGross,
    totalFee,
    totalNet,
    bankSnapshot:  bankResult.snapshot,
    hasZeroNet:    totalNet === 0,
    hasZeroFee:    totalFee === 0,
  }

  return { success: true, summary }
}

// ── Individual payout calculation ─────────────────────────────

export function calculateIndividualPayout(
  guard: Guard,
  transactions: Transaction[],
  periodType: PeriodType,
  periodStart: string,
  periodEnd: string
): CalculationResult {
  const bankResult = validateBankDetails(guard, `${guard.first_name} ${guard.last_name}`)
  if (!bankResult.valid) return { success: false, error: bankResult.error }

  const lineItem = buildEmployeeLineItem(guard, transactions)
  const { periodMonth, periodYear } = monthYearFromDate(periodType, periodStart)

  const summary: PayoutSummary = {
    periodType,
    periodStart,
    periodEnd,
    periodMonth,
    periodYear,
    recipientType: 'guard',
    recipientId:   guard.id,
    lineItems:     [lineItem],
    totalGross:    lineItem.grossAmount,
    totalFee:      lineItem.feeAmount,
    totalNet:      lineItem.netAmount,
    bankSnapshot:  bankResult.snapshot,
    hasZeroNet:    lineItem.netAmount === 0,
    hasZeroFee:    lineItem.feeAmount === 0,
  }

  return { success: true, summary }
}

export function formatPayoutSummary(summary: PayoutSummary): string {
  const periodLabel = summary.periodType === 'weekly'
    ? `${summary.periodStart} to ${summary.periodEnd}`
    : `${summary.periodMonth}/${summary.periodYear}`

  const lines = [
    `Payout summary — ${periodLabel}`,
    `Recipient: ${summary.recipientType} ${summary.recipientId}`,
    ``,
    ...summary.lineItems.map(
      (li) =>
        `  ${li.guardName.padEnd(30)} ` +
        `gross=R${li.grossAmount.toFixed(2).padStart(8)} ` +
        `fee=R${li.feeAmount.toFixed(2).padStart(8)} ` +
        `net=R${li.netAmount.toFixed(2).padStart(8)} ` +
        `(${li.transactionCount} tips)`
    ),
    ``,
    `  ${'TOTAL'.padEnd(30)} ` +
      `gross=R${summary.totalGross.toFixed(2).padStart(8)} ` +
      `fee=R${summary.totalFee.toFixed(2).padStart(8)} ` +
      `net=R${summary.totalNet.toFixed(2).padStart(8)}`,
    ``,
    summary.hasZeroNet
      ? `  ⚠ Net is R0 — no payout instruction will be sent (not_due)`
      : `  → Ozow payout instruction: R${summary.totalNet.toFixed(2)} to ${summary.bankSnapshot.bankName}`,
  ]
  return lines.join('\n')
}
