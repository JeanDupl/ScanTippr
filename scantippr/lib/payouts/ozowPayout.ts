// ============================================================
// lib/payouts/ozowPayout.ts
// Ozow Payouts API implementation
// API docs: https://hub.ozow.com/docs/payouts-api
//
// Authentication: SiteCode + ApiKey headers
// Account numbers must be AES-256-CBC encrypted
// Hash: SHA512(concatenated fields + apiKey, lowercased)
// ============================================================

import crypto from 'crypto'
import { BankSnapshot } from './payoutTypes'

// ── Environment ──────────────────────────────────────────────
const PAYOUT_BASE_URL = process.env.OZOW_PAYOUT_ENV === 'staging'
  ? 'https://stagingpayoutsapi.ozow.com/v1'
  : 'https://payoutsapi.ozow.com/v1'

const SITE_CODE = process.env.OZOW_SITE_CODE!           // SCA-SCA-007
const API_KEY   = process.env.OZOW_PAYOUT_API_KEY!      // provisioned by Teyla
const NOTIFY_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ozow/payout-webhook`

// ── Types ─────────────────────────────────────────────────────
export interface OzowPayoutInstruction {
  amount: number           // rands (e.g. 350.00)
  bank: BankSnapshot
  reference: string        // merchantReference — max 20 chars
  customerReference: string // appears on recipient bank statement — max 20 chars
  payoutPeriodId: string
  description?: string
}

export interface OzowPayoutResult {
  success: boolean
  ozowPayoutId?: string
  status?: number
  subStatus?: number
  error?: string
}

// ── SHA512 hash ───────────────────────────────────────────────
function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

// ── AES-256-CBC account number encryption ────────────────────
// Ozow requires bank account numbers to be encrypted per request
// IV = first 16 chars of SHA512(merchantRef + amountInCents + encryptionKey).toLowerCase()
function encryptAccountNumber(
  accountNumber: string,
  encryptionKey: string,
  merchantReference: string,
  amountInCents: number
): { encryptedAccountNumber: string; encryptionKey: string } {
  // Pad/truncate key to 32 bytes
  let key = encryptionKey
  while (key.length < 32) key += key
  key = key.substring(0, 32)

  // IV: SHA512(merchantRef + amountCents + encryptionKey) → first 16 chars
  const ivString = `${merchantReference}${amountInCents}${encryptionKey}`.toLowerCase()
  const iv = sha512(ivString).substring(0, 16)

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'utf8'),
    Buffer.from(iv, 'utf8')
  )

  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(accountNumber, 'utf8')),
    cipher.final()
  ])

  return {
    encryptedAccountNumber: encrypted.toString('base64'),
    encryptionKey,
  }
}

// ── Generate request hash ─────────────────────────────────────
// Concatenate in order: siteCode, amountCents, merchantRef, customerRef,
// isRtc, notifyUrl, bankGroupId, encryptedAccountNumber, branchCode, apiKey
// → lowercase → SHA512
function generateHashCheck(params: {
  siteCode: string
  amountCents: number
  merchantReference: string
  customerBankReference: string
  isRtc: boolean
  notifyUrl: string
  bankGroupId: string
  encryptedAccountNumber: string
  branchCode: string
  apiKey: string
}): string {
  const input = [
    params.siteCode,
    params.amountCents,
    params.merchantReference,
    params.customerBankReference,
    params.isRtc,
    params.notifyUrl,
    params.bankGroupId,
    params.encryptedAccountNumber,
    params.branchCode,
    params.apiKey,
  ].join('').toLowerCase()

  return sha512(input)
}

// ── Get available banks (returns BankGroupId per bank) ────────
export async function getOzowPayoutBanks(): Promise<Array<{
  bankGroupId: string
  bankGroupName: string
  universalBranchCode: string
}>> {
  const res = await fetch(`${PAYOUT_BASE_URL}/getavailablebanks`, {
    method: 'GET',
    headers: {
      'ApiKey':   API_KEY,
      'SiteCode': SITE_CODE,
      'Accept':   'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Ozow getavailablebanks failed: ${res.status}`)
  }

  return res.json()
}

// ── Bank name → BankGroupId lookup ───────────────────────────
// Maps common SA bank names to their Ozow BankGroupIds
// Call getOzowPayoutBanks() to get the live list with real UUIDs
const BANK_NAME_MAP: Record<string, string> = {
  'ABSA':                        '', // populated at runtime from getavailablebanks
  'Capitec Bank':                '',
  'Capitec':                     '',
  'First National Bank (FNB)':   '',
  'FNB':                         '',
  'Nedbank':                     '',
  'Standard Bank':               '',
  'African Bank':                '',
  'Bidvest Bank':                '',
  'Discovery Bank':              '',
  'Investec':                    '',
  'TymeBank':                    '',
}

// ── Main payout function ──────────────────────────────────────
export async function createOzowPayout(
  instruction: OzowPayoutInstruction
): Promise<OzowPayoutResult> {

  // ── STUB CHECK ────────────────────────────────────────────
  if (!process.env.OZOW_PAYOUT_API_KEY) {
    console.log('[ozowPayout] STUB — OZOW_PAYOUT_API_KEY not set, logging instruction only:')
    console.log(JSON.stringify({
      amount:           instruction.amount,
      reference:        instruction.reference,
      bankName:         instruction.bank.bankName,
      accountHolder:    instruction.bank.bankAccountHolder,
      accountNumber:    `****${instruction.bank.bankAccountNumber.slice(-4)}`,
      payoutPeriodId:   instruction.payoutPeriodId,
    }, null, 2))
    return {
      success:      true,
      ozowPayoutId: `STUB-${instruction.payoutPeriodId}-${Date.now()}`,
    }
  }
  // ── END STUB CHECK ────────────────────────────────────────

  try {
    // 1. Get available banks to find the BankGroupId
    const banks = await getOzowPayoutBanks()
    const bankName = instruction.bank.bankName.trim()
    const matchedBank = banks.find(b =>
      b.bankGroupName.toLowerCase() === bankName.toLowerCase() ||
      b.bankGroupName.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(b.bankGroupName.toLowerCase())
    )

    if (!matchedBank) {
      return {
        success: false,
        error: `Bank "${bankName}" not found in Ozow available banks list. Available: ${banks.map(b => b.bankGroupName).join(', ')}`,
      }
    }

    const bankGroupId    = matchedBank.bankGroupId
    const branchCode     = matchedBank.universalBranchCode
    const amountInCents  = Math.round(instruction.amount * 100)

    // Truncate references to 20 chars (Ozow limit)
    const merchantReference     = instruction.reference.substring(0, 20)
    const customerBankReference = instruction.customerReference.substring(0, 20)

    // 2. Generate a unique encryption key for this request
    const encryptionKey = crypto.randomBytes(16).toString('hex').substring(0, 16)

    // 3. Encrypt account number
    const { encryptedAccountNumber } = encryptAccountNumber(
      instruction.bank.bankAccountNumber,
      encryptionKey,
      merchantReference,
      amountInCents
    )

    // 4. Generate hash
    const hashCheck = generateHashCheck({
      siteCode:               SITE_CODE,
      amountCents:            amountInCents,
      merchantReference,
      customerBankReference,
      isRtc:                  false,  // RTC not available on staging; set to false
      notifyUrl:              NOTIFY_URL,
      bankGroupId,
      encryptedAccountNumber,
      branchCode,
      apiKey:                 API_KEY,
    })

    // 5. Submit payout request
    const body = {
      siteCode:             SITE_CODE,
      amount:               instruction.amount,
      merchantReference,
      customerBankReference,
      isRtc:                false,
      notifyUrl:            NOTIFY_URL,
      bankingDetails: {
        bankGroupId,
        accountNumber:      encryptedAccountNumber,
        branchCode,
      },
      hashCheck,
    }

    console.log('[ozowPayout] Submitting payout:', {
      amount:           instruction.amount,
      merchantReference,
      bankGroupId,
      payoutPeriodId:   instruction.payoutPeriodId,
    })

    const res = await fetch(`${PAYOUT_BASE_URL}/requestpayout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        'SiteCode':     SITE_CODE,
        'ApiKey':       API_KEY,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[ozowPayout] API error:', data)
      return {
        success: false,
        error: data?.payoutStatus?.errorMessage || `HTTP ${res.status}`,
      }
    }

    const payoutStatus = data.payoutStatus
    const isSuccess = payoutStatus?.status === 1 ||  // PayoutReceived
                      payoutStatus?.status === 2 ||  // Verification
                      payoutStatus?.status === 3     // SubmittedForProcessing

    console.log('[ozowPayout] Response:', {
      payoutId:   data.payoutId,
      status:     payoutStatus?.status,
      subStatus:  payoutStatus?.subStatus,
    })

    return {
      success:      isSuccess,
      ozowPayoutId: data.payoutId,
      status:       payoutStatus?.status,
      subStatus:    payoutStatus?.subStatus,
      error:        isSuccess ? undefined : payoutStatus?.errorMessage,
    }

  } catch (err: any) {
    console.error('[ozowPayout] Unexpected error:', err)
    return { success: false, error: err.message }
  }
}
