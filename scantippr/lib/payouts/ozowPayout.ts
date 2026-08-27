// ============================================================
// lib/payouts/ozowPayout.ts
// Ozow payout API call — STUB until Teyla confirms exact fields
//
// This function will be called TWICE per payout period:
//   1. Fee payout  → ScanTippr's account (if disposal_mode = payout_to_scantippr)
//   2. Net payout  → Company or guard bank account
//
// When Ozow confirms the payout API fields, replace the stub
// body with the real implementation. Nothing else changes.
// ============================================================

import { BankSnapshot } from './payoutTypes'

export interface OzowPayoutInstruction {
  amount: number           // rands — net or fee amount
  bank: BankSnapshot       // snapshotted recipient bank details
  reference: string        // unique reference for this instruction
  payoutPeriodId: string   // for reconciliation
  description?: string     // optional narrative
}

export interface OzowPayoutResult {
  success: boolean
  ozowPayoutId?: string    // returned by Ozow on success
  error?: string
}

/**
 * Send a single payout instruction to Ozow.
 *
 * STUB — logs the instruction and returns a simulated success.
 * Replace the body of this function once Teyla confirms:
 *   1. Ozow payout API endpoint
 *   2. Required fields (account number format, bank code vs name, etc.)
 *   3. Authentication method for payout scope
 *   4. Webhook confirmation flow
 *
 * The interface (inputs/outputs) will not change.
 */
export async function createOzowPayout(
  instruction: OzowPayoutInstruction
): Promise<OzowPayoutResult> {
  // ── STUB ──────────────────────────────────────────────────
  // Log what would be sent to Ozow
  console.log('[ozowPayout] STUB — payout instruction (not yet sent to Ozow):')
  console.log(JSON.stringify({
    amount:          instruction.amount,
    bankName:        instruction.bank.bankName,
    accountHolder:   instruction.bank.bankAccountHolder,
    accountNumber:   `****${instruction.bank.bankAccountNumber.slice(-4)}`,  // mask for logs
    accountType:     instruction.bank.bankAccountType,
    reference:       instruction.reference,
    payoutPeriodId:  instruction.payoutPeriodId,
    description:     instruction.description,
  }, null, 2))

  // Return simulated success so the orchestrator can continue
  // and write the payout_period record to the database
  return {
    success:      true,
    ozowPayoutId: `STUB-${instruction.payoutPeriodId}-${Date.now()}`,
  }
  // ── END STUB ──────────────────────────────────────────────

  // ── REAL IMPLEMENTATION (replace stub above with this) ────
  // try {
  //   const response = await fetch(`${process.env.OZOW_PAYOUT_BASE_URL}/...`, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.OZOW_PAYOUT_ACCESS_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       // fields confirmed by Teyla
  //     }),
  //   })
  //   const data = await response.json()
  //   if (!response.ok) return { success: false, error: data.message }
  //   return { success: true, ozowPayoutId: data.payoutId }
  // } catch (err: any) {
  //   return { success: false, error: err.message }
  // }
  // ── END REAL IMPLEMENTATION ───────────────────────────────
}
