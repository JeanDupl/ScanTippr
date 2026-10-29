// ============================================================
// lib/payouts/payoutTypes.ts
// Shared types for the ScanTippr payout engine
// ============================================================

export type RecipientType = 'company' | 'guard' | 'hybrid'

export type CompanyModelType = 'company' | 'hybrid'

export type PeriodType = 'monthly' | 'weekly'

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

export interface Transaction {
  id: string
  guard_id: string
  company_id: string
  amount: number
  payment_status: PaymentStatus
  payout_status: PayoutStatus
  fee_status: FeeStatus
  created_at: string
}

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

export interface Company {
  id: string
  name: string
  model_type?: CompanyModelType
  bank_account_number: string | null
  bank_name: string | null
  bank_account_holder: string | null
  bank_account_type: string | null
}

// ── Hybrid payout types ──────────────────────────────────────

/**
 * Result for a single employee in a hybrid payout run.
 * Each employee gets their own Ozow payout instruction.
 */
export interface HybridEmployeePayout {
  summary: PayoutSummary
  payoutPeriodId: string
}

export interface HybridPayoutResult {
  success: boolean
  companyId: string
  companyName: string
  employeeResults: Array<{
    guardId: string
    guardName: string
    success: boolean
    payoutPeriodId?: string
    error?: string
    netAmount?: number
  }>
  totalEmployees: number
  successCount: number
  failCount: number
  error?: string
}

// ── Output types ─────────────────────────────────────────────

export interface EmployeeLineItem {
  guardId: string
  guardName: string
  transactionIds: string[]
  transactionCount: number
  grossAmount: number
  feeAmount: number
  netAmount: number
}

export interface BankSnapshot {
  bankAccountNumber: string
  bankName: string
  bankAccountHolder: string
  bankAccountType: string
}

export interface PayoutSummary {
  periodType: PeriodType
  periodStart: string   // ISO date string YYYY-MM-DD
  periodEnd: string     // ISO date string YYYY-MM-DD
  // Monthly convenience fields (null for weekly)
  periodMonth: number | null
  periodYear: number | null
  recipientType: RecipientType
  recipientId: string
  lineItems: EmployeeLineItem[]
  totalGross: number
  totalFee: number
  totalNet: number
  bankSnapshot: BankSnapshot
  hasZeroNet: boolean
  hasZeroFee: boolean
}

export type CalculationResult =
  | { success: true; summary: PayoutSummary }
  | { success: false; error: string }

export const SCANTIPPR_FEE_CAP = 150
