// ============================================================
// lib/payouts/calculatePayouts.ts
// Pure fee calculation engine — no Ozow, no DB writes
// Fully testable in isolation
//
// Rules (confirmed):
//   fee = MIN(R150, employee monthly gross)
//   net = gross - fee
//   company payout = SUM(all employee nets)
//   individual payout = that employee's net
// ============================================================

import {
  Transaction,
  Guard,
  Company,
  EmployeeLineItem,
  PayoutSummary,
  BankSnapshot,
  CalculationResult,
  SCANTIPPR_FEE_CAP,
} from './payoutTypes'

// ── Fee calculation (core rule) ──────────────────────────────

/**
 * Calculate ScanTippr fee for one employee for one period.
 * fee = MIN(R150, gross)
 * Stored immutably — never recalculated from this point forward.
 */
export function calculateEmployeeFee(grossAmount: number): number {
  if (grossAmount <= 0) return 0
  return Math.min(SCANTIPPR_FEE_CAP, grossAmount)
}

/**
 * Calculate net payout for one employee.
 * net = gross - fee
 */
export function calculateEmployeeNet(grossAmount: number): number {
  const fee = calculateEmployeeFee(grossAmount)
  return Math.max(0, grossAmount - fee)
}

// ── Round to 2 decimal places ────────────────────────────────
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// ── Per-employee line item ────────────────────────────────────

/**
 * Build a single employee line item from their transactions.
 * Filters to only completed + unpaid transactions.
 */
function buildEmployeeLineItem(
  guard: Guard,
  transactions: Transaction[]
): EmployeeLineItem {
  // Only include completed payments that haven't been paid out yet
  const eligible = transactions.filter(
    (tx) =>
      tx.payment_status === 'completed' &&
      tx.payout_status === 'unpaid' &&
      tx.fee_status === 'unpaid'
  )

  const grossAmount = round2(
    eligible.reduce((sum, tx) => sum + Number(tx.amount), 0)
  )
  const feeAmount  = round2(calculateEmployeeFee(grossAmount))
  const netAmount  = round2(calculateEmployeeNet(grossAmount))

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

/**
 * Calculate payout for a company-managed account.
 * One line item per employee. Company receives SUM(all nets).
 *
 * @param company     The company record (with bank details)
 * @param guards      All active guards for this company
 * @param transactions All completed+unpaid transactions for this company in the period
 * @param periodMonth 1–12
 * @param periodYear  e.g. 2026
 */
export function calculateCompanyPayout(
  company: Company,
  guards: Guard[],
  transactions: Transaction[],
  periodMonth: number,
  periodYear: number
): CalculationResult {
  // Validate bank details
  const bankResult = validateBankDetails(company, company.name)
  if (!bankResult.valid) {
    return { success: false, error: bankResult.error }
  }

  // Group transactions by guard
  const txByGuard = new Map<string, Transaction[]>()
  for (const guard of guards) {
    txByGuard.set(guard.id, [])
  }
  for (const tx of transactions) {
    if (txByGuard.has(tx.guard_id)) {
      txByGuard.get(tx.guard_id)!.push(tx)
    }
  }

  // Build line items — one per guard (even if they have no transactions)
  const lineItems: EmployeeLineItem[] = guards.map((guard) =>
    buildEmployeeLineItem(guard, txByGuard.get(guard.id) ?? [])
  )

  // Aggregate
  const totalGross = round2(lineItems.reduce((sum, li) => sum + li.grossAmount, 0))
  const totalFee   = round2(lineItems.reduce((sum, li) => sum + li.feeAmount,   0))
  const totalNet   = round2(lineItems.reduce((sum, li) => sum + li.netAmount,   0))

  const summary: PayoutSummary = {
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

/**
 * Calculate payout for an individual (no company) guard.
 * One line item for the guard themselves. Guard receives their own net.
 *
 * @param guard       The guard record (with bank details)
 * @param transactions All completed+unpaid transactions for this guard in the period
 * @param periodMonth 1–12
 * @param periodYear  e.g. 2026
 */
export function calculateIndividualPayout(
  guard: Guard,
  transactions: Transaction[],
  periodMonth: number,
  periodYear: number
): CalculationResult {
  // Validate bank details
  const bankResult = validateBankDetails(
    guard,
    `${guard.first_name} ${guard.last_name}`
  )
  if (!bankResult.valid) {
    return { success: false, error: bankResult.error }
  }

  const lineItem = buildEmployeeLineItem(guard, transactions)

  const summary: PayoutSummary = {
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

// ── Summary helpers (for display / logging) ───────────────────

/**
 * Human-readable summary of a payout calculation.
 * Useful for logging and dashboard display.
 */
export function formatPayoutSummary(summary: PayoutSummary): string {
  const lines = [
    `Payout summary — ${summary.periodMonth}/${summary.periodYear}`,
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
