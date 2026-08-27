'use client'

import { useState } from 'react'
import { Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const SA_BANKS = [
  'ABSA',
  'African Bank',
  'Bidvest Bank',
  'Capitec Bank',
  'Discovery Bank',
  'First National Bank (FNB)',
  'Investec',
  'Nedbank',
  'Standard Bank',
  'TymeBank',
  'Other',
]

const ACCOUNT_TYPES = [
  { value: 'cheque', label: 'Cheque / Current' },
  { value: 'savings', label: 'Savings' },
  { value: 'transmission', label: 'Transmission' },
]

interface BankDetails {
  bank_account_number: string
  bank_name: string
  bank_account_holder: string
  bank_account_type: string
}

interface Props {
  companyId: string
  companyName: string
  initialCompanyBank: BankDetails
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function BankDetailsSection({
  title,
  description,
  icon: Icon,
  fields,
  onSave,
  saveState,
  errorMessage,
}: {
  title: string
  description: string
  icon: React.ElementType
  fields: {
    id: string
    label: string
    value: string
    onChange: (v: string) => void
    type?: 'text' | 'select' | 'bank-select'
    options?: { value: string; label: string }[]
    placeholder?: string
    sensitive?: boolean
  }[]
  onSave: () => void
  saveState: SaveState
  errorMessage?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-6 space-y-5">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              {field.label}
            </label>

            {field.type === 'bank-select' ? (
              <select
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900
                           bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                           transition-colors"
              >
                <option value="">Select bank</option>
                {SA_BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900
                           bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                           transition-colors"
              >
                <option value="">Select account type</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.id}
                type={field.sensitive ? 'text' : 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                autoComplete="off"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900
                           placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400
                           focus:border-transparent transition-colors"
              />
            )}
          </div>
        ))}

        {/* Security note */}
        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Bank details are encrypted and never shared with third parties.
          Used only for Ozow payout instructions.
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {/* Status message */}
        <div className="text-sm">
          {saveState === 'saved' && (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Bank details saved
            </span>
          )}
          {saveState === 'error' && (
            <span className="flex items-center gap-1.5 text-red-500 font-medium">
              <AlertCircle className="w-4 h-4" />
              {errorMessage || 'Failed to save — please try again'}
            </span>
          )}
        </div>

        <button
          onClick={onSave}
          disabled={saveState === 'saving'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm
                     font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors"
        >
          {saveState === 'saving' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save bank details'
          )}
        </button>
      </div>
    </div>
  )
}

export default function BankDetailsForm({
  companyId,
  companyName,
  initialCompanyBank,
}: Props) {
  // Company bank state
  const [companyBank, setCompanyBank] = useState<BankDetails>(initialCompanyBank)
  const [companySaveState, setCompanySaveState] = useState<SaveState>('idle')
  const [companyError, setCompanyError] = useState('')

  const updateCompanyField = (field: keyof BankDetails) => (value: string) =>
    setCompanyBank((prev) => ({ ...prev, [field]: value }))

  const saveCompanyBank = async () => {
    setCompanySaveState('saving')
    setCompanyError('')
    try {
      const res = await fetch('/api/settings/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'company',
          companyId,
          ...companyBank,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Save failed')
      }
      setCompanySaveState('saved')
      setTimeout(() => setCompanySaveState('idle'), 3000)
    } catch (err: any) {
      setCompanyError(err.message)
      setCompanySaveState('error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 text-sm text-blue-800">
        <strong>Payout account</strong> — This is the bank account that will receive the
        net monthly payout via Ozow. ScanTippr never holds your funds; Ozow processes
        the payout instruction directly to this account.
      </div>

      {/* Company bank details */}
      <BankDetailsSection
        title={`${companyName} — Company Bank Account`}
        description="Net monthly payout will be sent to this account via Ozow"
        icon={Building2}
        saveState={companySaveState}
        errorMessage={companyError}
        onSave={saveCompanyBank}
        fields={[
          {
            id: 'company_account_holder',
            label: 'Account holder name',
            value: companyBank.bank_account_holder,
            onChange: updateCompanyField('bank_account_holder'),
            placeholder: 'Registered company name or trading name',
          },
          {
            id: 'company_bank_name',
            label: 'Bank',
            value: companyBank.bank_name,
            onChange: updateCompanyField('bank_name'),
            type: 'bank-select',
          },
          {
            id: 'company_account_number',
            label: 'Account number',
            value: companyBank.bank_account_number,
            onChange: updateCompanyField('bank_account_number'),
            placeholder: 'e.g. 1234567890',
            sensitive: true,
          },
          {
            id: 'company_account_type',
            label: 'Account type',
            value: companyBank.bank_account_type,
            onChange: updateCompanyField('bank_account_type'),
            type: 'select',
            options: ACCOUNT_TYPES,
          },
        ]}
      />

      {/* Payout model explanation */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 space-y-2">
        <p className="font-semibold text-slate-800">How payouts work</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>Donations are collected by Ozow on your behalf</li>
          <li>At month-end, ScanTippr calculates each employee's net amount</li>
          <li>
            ScanTippr fee per employee:{' '}
            <span className="font-medium text-slate-700">
              MIN(R150, employee's monthly donations)
            </span>
          </li>
          <li>The combined net amount is paid to your company account via Ozow</li>
          <li>Use the Reports section to see individual employee breakdowns for payroll</li>
        </ul>
      </div>
    </div>
  )
}
