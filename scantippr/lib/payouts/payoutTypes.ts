// ============================================================
// lib/payouts/payoutTypes.ts
// Shared types for the ScanTippr payout engine
// ============================================================

export type RecipientType = 'company' | 'guard'

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export type FeeStatus =
  | 'unpaid'
  | 'included'
  | 'collected'
  | 'in_float'
  | 'not_applicable'
  | 'failed'

export type PayoutStatus =
  | 'unpaid'
  | 'included'
  | 'paid'
  | 'not_due'
  | 'failed'

export type PayoutPeriodStatus =
  | 'pending'
  | 'submitted'
  | 'paid'
  | 'not_due'
  | 'failed'

export type FeePayoutStatus =
  | 'pending'
  | 'submitted'
  | 'collected'
  | 'in_float'
  | 'not_applicable'
  | 'failed'

export type FeeDisposalMode =
  | 'payout_to_scantippr'
  | 'remain_in_float'
  | 'pending_decision'

// ── Input types ──────────────────────────────────────────────

// A single transaction as read from the database
export interface Transaction {
  id: string
  guard_id: string
  company_id: string
  amount: number          // in rands
  payment_status: PaymentStatus
  payout_status: PayoutStatus
  fee_status: FeeStatus
  created_at: string
}

// A guard as read from the database
export interface Guard {
  id: string
  company_id: string | null
  first_name: string
  last_name: string
  bank_account_number: string | null
  bank_name: string | null
  bank_account_holder: string | null
  bank_account_type: string | null
}

// A company as read from the database
export interface Company {
  id: string
  name: string
  bank_account_number: string | null
  bank_name: string | null
  bank_account_holder: string | null
  bank_account_type: string | null
}

// ── Output types ─────────────────────────────────────────────

// Per-employee calculation result (becomes a payout_line_item row)
export interface EmployeeLineItem {
  guardId: string
  guardName: string           // snapshot at calculation time
  transactionIds: string[]    // which transactions are included
  transactionCount: number
  grossAmount: number         // sum of transaction amounts (rands)
  feeAmount: number           // MIN(150, gross) — immutable once stored
  netAmount: number           // gross - fee
}

// Snapshot of bank details at payout time
export interface BankSnapshot {
  bankAccountNumber: string
  bankName: string
  bankAccountHolder: string
  bankAccountType: string
}

// Full payout summary for one recipient for one period
// This is what gets written to payout_periods + payout_line_items
export interface PayoutSummary {
  periodMonth: number
  periodYear: number
  recipientType: RecipientType
  recipientId: string
  lineItems: EmployeeLineItem[]
  totalGross: number          // sum of all employee gross amounts
  totalFee: number            // sum of all employee fees (= ScanTippr revenue)
  totalNet: number            // sum of all employee nets (= Ozow payout instruction amount)
  bankSnapshot: BankSnapshot
  // Edge case flags
  hasZeroNet: boolean         // true if totalNet = 0 (nothing to pay out)
  hasZeroFee: boolean         // true if totalFee = 0 (no fee due)
}

// Result of the calculation — may contain errors
export type CalculationResult =
  | { success: true; summary: PayoutSummary }
  | { success: false; error: string }

// ── Constants ────────────────────────────────────────────────
export const SCANTIPPR_FEE_CAP = 150  // R150 per employee per month
