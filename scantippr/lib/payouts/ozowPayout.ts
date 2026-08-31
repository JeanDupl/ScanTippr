import crypto from 'crypto'
import { BankSnapshot } from './payoutTypes'

const PAYOUT_BASE_URL = process.env.OZOW_PAYOUT_ENV === 'staging'
  ? 'https://stagingpayoutsapi.ozow.com/v1'
  : 'https://payoutsapi.ozow.com/v1'

const SITE_CODE   = process.env.OZOW_PAYOUT_SITE_CODE ?? process.env.OZOW_SITE_CODE!
const API_KEY     = process.env.OZOW_PAYOUT_API_KEY ?? ''
const PRIVATE_KEY = process.env.OZOW_PAYOUT_PRIVATE_KEY ?? process.env.OZOW_CLIENT_SECRET ?? ''
const NOTIFY_URL  = `${process.env.NEXT_PUBLIC_SITE_URL}/api/ozow/payout-webhook`

export interface OzowPayoutInstruction {
  amount: number
  bank: BankSnapshot
  reference: string
  customerReference: string
  payoutPeriodId: string
  description?: string
}

export interface OzowPayoutResult {
  success: boolean
  ozowPayoutId?: string
  encryptionKey?: string
  status?: number
  subStatus?: number
  error?: string
}

function sha512(input: string): string {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex')
}

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
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), Buffer.from(iv, 'utf8'))
  const encrypted = Buffer.concat([cipher.update(Buffer.from(accountNumber, 'utf8')), cipher.final()])
  return encrypted.toString('base64')
}

function generateHashCheck(
  siteCode: string,
  amount: string | number,
  merchantReference: string,
  customerBankReference: string,
  isRtc: boolean,
  notifyUrl: string,
  bankGroupId: string,
  encryptedAccountNumber: string,
  branchCode: string,
  privateKey: string
): string {
  const input = [
    siteCode,
    amount,
    merchantReference,
    customerBankReference,
    isRtc ? 'true' : 'false',
    notifyUrl,
    bankGroupId,
    encryptedAccountNumber,
    branchCode,
    privateKey,
  ].join('').toLowerCase()
  console.log('[ozowPayout] Hash input (first 120):', input.substring(0, 120))
  return sha512(input)
}

export async function getOzowPayoutBanks(): Promise<Array<{
  bankGroupId: string
  bankGroupName: string
  universalBranchCode: string
}>> {
  const res = await fetch(`${PAYOUT_BASE_URL}/getavailablebanks`, {
    method: 'GET',
    headers: { 'ApiKey': API_KEY, 'SiteCode': SITE_CODE, 'Accept': 'application/json' },
  })
  if (!res.ok) throw new Error(`Ozow getavailablebanks failed: ${res.status}`)
  return res.json()
}

export async function createOzowPayout(instruction: OzowPayoutInstruction): Promise<OzowPayoutResult> {
  if (!API_KEY) {
    const stubKey = crypto.randomBytes(8).toString('hex')
    return { success: true, ozowPayoutId: `STUB-${instruction.payoutPeriodId}-${Date.now()}`, encryptionKey: stubKey }
  }

  try {
    const banks = await getOzowPayoutBanks()
    const bankName = instruction.bank.bankName.trim()
    const matchedBank = banks.find(b =>
      b.bankGroupName.toLowerCase() === bankName.toLowerCase() ||
      b.bankGroupName.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(b.bankGroupName.toLowerCase())
    )
    if (!matchedBank) {
      return { success: false, error: `Bank "${bankName}" not found. Available: ${banks.map(b => b.bankGroupName).join(', ')}` }
    }

    const bankGroupId   = matchedBank.bankGroupId
    const branchCode    = matchedBank.universalBranchCode
    const amountInCents = Math.round(instruction.amount * 100)
    const amountRandsStr = (amountInCents / 100).toFixed(2)

    const merchantReference     = instruction.reference.substring(0, 20)
    const customerBankReference = instruction.customerReference.substring(0, 20)
    const encryptionKey = crypto.randomBytes(16).toString('hex').substring(0, 16)

    const encryptedAccountNumber = encryptAccountNumber(
      instruction.bank.bankAccountNumber,
      encryptionKey,
      merchantReference,
      amountInCents
    )

    console.log('[ozowPayout] Config:', {
      siteCode: SITE_CODE,
      notifyUrl: NOTIFY_URL,
      privateKeyLast4: PRIVATE_KEY.slice(-4),
      apiKeyLast4: API_KEY.slice(-4),
      amountRandsStr,
      amountInCents,
    })

    const hashCheck = generateHashCheck(
      SITE_CODE,
      amountRandsStr,
      merchantReference,
      customerBankReference,
      false,
      NOTIFY_URL,
      bankGroupId,
      encryptedAccountNumber,
      branchCode,
      PRIVATE_KEY
    )

    const body = {
      siteCode:             SITE_CODE,
      amount:               amountRandsStr,
      merchantReference,
      customerBankReference,
      isRtc:                false,
      notifyUrl:            NOTIFY_URL,
      bankingDetails: {
        bankGroupId,
        accountNumber: encryptedAccountNumber,
        branchCode,
      },
      hashCheck,
    }

    console.log('[ozowPayout] Submitting:', { merchantReference, amountRandsStr, bodyAmount: body.amount })

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
      return { success: false, error: data?.payoutStatus?.errorMessage || `HTTP ${res.status}` }
    }

    const payoutStatus = data.payoutStatus
    const isSuccess = [1, 2, 3].includes(payoutStatus?.status)

    console.log('[ozowPayout] Response:', {
      payoutId:     data.payoutId,
      status:       payoutStatus?.status,
      subStatus:    payoutStatus?.subStatus,
      errorMessage: payoutStatus?.errorMessage,
    })

    return {
      success:       isSuccess,
      ozowPayoutId:  data.payoutId,
      encryptionKey,
      status:        payoutStatus?.status,
      subStatus:     payoutStatus?.subStatus,
      error:         isSuccess ? undefined : payoutStatus?.errorMessage,
    }

  } catch (err: any) {
    console.error('[ozowPayout] Error:', err)
    return { success: false, error: err.message }
  }
}
