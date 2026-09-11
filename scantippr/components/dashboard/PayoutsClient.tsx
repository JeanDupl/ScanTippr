'use client'

import { useState } from 'react'
import {
  DollarSign,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Info,
  CalendarClock,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface PayoutPeriod {
  id: string
  period_month: number
  period_year: number
  gross_amount: number
  fee_amount: number
  net_amount: number
  fee_payout_status: string
  net_payout_status: string
  fee_disposal_mode: string
  bank_name: string
  bank_account_holder: string
  created_at: string
}

interface LineItem {
  id: string
  payout_period_id: string
  guard_id: string
  guard_name: string
  gross_amount: number
  fee_amount: number
  net_amount: number
  tip_count: number
}

interface Props {
  companyId: string
  companyName: string
  isIndividual?: boolean
  hasBankDetails: boolean
  payoutPeriods: PayoutPeriod[]
  lineItems: LineItem[]
  unpaidTransactionCount: number
  currentMonth: number
  currentYear: number
}

// ── Month name helper ─────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function monthName(m: number) {
  return MONTHS[m - 1] ?? '?'
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:        { label: 'Pending',        className: 'bg-amber-100 text-amber-800' },
    submitted:      { label: 'Submitted',      className: 'bg-blue-100 text-blue-800' },
    paid:           { label: 'Paid',           className: 'bg-emerald-100 text-emerald-800' },
    collected:      { label: 'Collected',      className: 'bg-emerald-100 text-emerald-800' },
    in_float:       { label: 'In float',       className: 'bg-purple-100 text-purple-800' },
    not_due:        { label: 'Not due',        className: 'bg-slate-100 text-slate-600' },
    not_applicable: { label: 'N/A',            className: 'bg-slate-100 text-slate-400' },
    failed:         { label: 'Failed',         className: 'bg-red-100 text-red-700' },
  }
  const { label, className } = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

// ── Payout period row ─────────────────────────────────────────
function PeriodRow({
  period,
  lineItems,
}: {
  period: PayoutPeriod
  lineItems: LineItem[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Period header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          {expanded
            ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          }
          <div>
            <p className="font-semibold text-slate-900">
              {monthName(period.period_month)} {period.period_year}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {lineItems.length} employee{lineItems.length !== 1 ? 's' : ''} ·{' '}
              {period.bank_account_holder} · {period.bank_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500">Gross</p>
            <p className="font-medium text-slate-700">R{Number(period.gross_amount).toFixed(2)}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500">Fee</p>
            <p className="font-medium text-red-500">−R{Number(period.fee_amount).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Net payout</p>
            <p className="font-bold text-emerald-600">R{Number(period.net_amount).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <StatusBadge status={period.net_payout_status} />
          </div>
        </div>
      </button>

      {/* Expanded line items */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <th className="px-5 py-3 text-left">Employee</th>
                <th className="px-5 py-3 text-right">Tips</th>
                <th className="px-5 py-3 text-right">Gross</th>
                <th className="px-5 py-3 text-right">ScanTippr fee</th>
                <th className="px-5 py-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineItems.map((li) => (
                <tr key={li.id} className="bg-white">
                  <td className="px-5 py-3 font-medium text-slate-900">{li.guard_name}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{li.tip_count}</td>
                  <td className="px-5 py-3 text-right text-slate-700">R{Number(li.gross_amount).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-red-500">−R{Number(li.fee_amount).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-emerald-600">
                    R{Number(li.net_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200">
              <tr className="bg-slate-50">
                <td className="px-5 py-3 font-bold text-slate-900">Total</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-700">
                  {lineItems.reduce((s, li) => s + li.tip_count, 0)}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-slate-700">
                  R{Number(period.gross_amount).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-red-500">
                  −R{Number(period.fee_amount).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right font-bold text-emerald-600">
                  R{Number(period.net_amount).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Fee disposal note */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            ScanTippr fee: {period.fee_disposal_mode === 'remain_in_float'
              ? 'remains in Ozow float'
              : period.fee_disposal_mode === 'payout_to_scantippr'
              ? 'paid to ScanTippr'
              : 'pending decision'
            } · Fee status: <StatusBadge status={period.fee_payout_status} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function PayoutsClient({
  companyId,
  companyName,
  isIndividual = false,
  hasBankDetails,
  payoutPeriods,
  lineItems,
  unpaidTransactionCount,
  currentMonth,
  currentYear,
}: Props) {
  const lineItemsByPeriod = (periodId: string) =>
    lineItems.filter((li) => li.payout_period_id === periodId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monthly net payout history for {companyName}
        </p>
      </div>

      {/* No bank details warning */}
      {!hasBankDetails && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Bank details required</p>
            <p className="mt-0.5">
              Please add your {isIndividual ? '' : 'company '}bank details in{' '}
              <a href="/dashboard/settings" className="underline font-medium">Settings</a>{' '}
              so ScanTippr can process your monthly payout.
            </p>
          </div>
        </div>
      )}

      {/* Automatic payout notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <CalendarClock className="w-4.5 h-4.5 text-orange-500" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-slate-900">Payouts are processed automatically</p>
          <p className="text-slate-500 mt-0.5">
            ScanTippr processes net payouts on your behalf at the end of each month.
            You don't need to do anything — {isIndividual ? 'you will be paid automatically.' : 'your employees will be paid automatically.'}
          </p>
        </div>
      </div>

      {/* Payout history */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Payout history</h2>
        {payoutPeriods.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-400">
            <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No payouts yet</p>
            <p className="text-sm mt-1">Your payout history will appear here once the first month-end run is processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payoutPeriods.map((period) => (
              <PeriodRow
                key={period.id}
                period={period}
                lineItems={lineItemsByPeriod(period.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
