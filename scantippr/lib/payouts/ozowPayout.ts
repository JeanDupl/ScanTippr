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

const SITE_CODE  = process.env.OZOW_PAYOUT_SITE_CODE ?? process.env.OZOW_SITE_CODE!
const API_KEY    = process.env.OZOW_PAYOUT_API_KEY ?? ''
const NOTIFY_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ozow/payout-webhook`

// ── Types ─────────────────────────────────────────────────────
export interface OzowPayoutInstruction {
  amount: number            // rands (e.g. 350.00)
  bank: BankSnapshot
  reference: string         // merchantReference — max 20 chars
  customerReference: string // appears on recipient bank statement — max 20 chars
  payoutPeriodId: string
  description?: string
}

export interface OzowPayoutResult {
  success: boolean
  ozowPayoutId?: string
  encryptionKey?: string    // must be stored so verification webhook can return it
  status?: number
  subStatus?: number
  error?: string
}

// ── SHA512 hash ───────────────────────────────────────────────
function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

// ── AES-256-CBC account number encryption ────────────────────
function encryptAccountNumber(
  accountNumber: string,
  encryptionKey: string,
  merchantReference: string,
  amountInCents: number
): string {
  let key = encryptionKey
  while (key.length < 32) key += key
  key = key.substring(0, 32)

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

  return encrypted.toString('base64')
}

// ── Generate request hash ─────────────────────────────────────
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

// ── Get available banks ───────────────────────────────────────
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
  if (!res.ok) throw new Error(`Ozow getavailablebanks failed: ${res.status}`)
  return res.json()
}

// ── Main payout function ──────────────────────────────────────
export async function createOzowPayout(
  instruction: OzowPayoutInstruction
): Promise<OzowPayoutResult> {

  // Stub if API key not yet configured
  if (!API_KEY) {
    console.log('[ozowPayout] STUB — OZOW_PAYOUT_API_KEY not set:')
    console.log(JSON.stringify({
      amount:         instruction.amount,
      reference:      instruction.reference,
      bankName:       instruction.bank.bankName,
      accountHolder:  instruction.bank.bankAccountHolder,
      accountNumber:  `****${instruction.bank.bankAccountNumber.slice(-4)}`,
      payoutPeriodId: instruction.payoutPeriodId,
    }, null, 2))
    const stubKey = crypto.randomBytes(8).toString('hex')
    return {
      success:         true,
      ozowPayoutId:    `STUB-${instruction.payoutPeriodId}-${Date.now()}`,
      encryptionKey:   stubKey,
    }
  }

  try {
    // 1. Get available banks
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
        error: `Bank "${bankName}" not found. Available: ${banks.map(b => b.bankGroupName).join(', ')}`,
      }
    }

    const bankGroupId   = matchedBank.bankGroupId
    const branchCode    = matchedBank.universalBranchCode
    const amountInCents = Math.round(instruction.amount * 100)

    const merchantReference     = instruction.reference.substring(0, 20)
    const customerBankReference = instruction.customerReference.substring(0, 20)

    // 2. Generate unique encryption key for this request (must be stored)
    const encryptionKey = crypto.randomBytes(16).toString('hex').substring(0, 16)

    // 3. Encrypt account number
    const encryptedAccountNumber = encryptAccountNumber(
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
      isRtc:                  false,
      notifyUrl:              NOTIFY_URL,
      bankGroupId,
      encryptedAccountNumber,
      branchCode,
      apiKey:                 API_KEY,
    })

    // 5. Submit payout
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

    console.log('[ozowPayout] Submitting:', {
      amount: instruction.amount,
      merchantReference,
      bankGroupId,
      payoutPeriodId: instruction.payoutPeriodId,
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
    const isSuccess = [1, 2, 3].includes(payoutStatus?.status)

    console.log('[ozowPayout] Response:', {
      payoutId:  data.payoutId,
      status:    payoutStatus?.status,
      subStatus: payoutStatus?.subStatus,
    })

    return {
      success:       isSuccess,
      ozowPayoutId:  data.payoutId,
      encryptionKey, // IMPORTANT: orchestrator must store this in payout_periods.encryption_key
      status:        payoutStatus?.status,
      subStatus:     payoutStatus?.subStatus,
      error:         isSuccess ? undefined : payoutStatus?.errorMessage,
    }

  } catch (err: any) {
    console.error('[ozowPayout] Error:', err)
    return { success: false, error: err.message }
  }
}
