'use client'

import { useState } from 'react'
import {
  DollarSign,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Play,
  Info,
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
  hasBankDetails,
  payoutPeriods,
  lineItems,
  unpaidTransactionCount,
  currentMonth,
  currentYear,
}: Props) {
  const [initiating, setInitiating] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    summary?: any
  } | null>(null)

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear]   = useState(currentYear)

  const lineItemsByPeriod = (periodId: string) =>
    lineItems.filter((li) => li.payout_period_id === periodId)

  const periodAlreadyExists = payoutPeriods.some(
    (p) => p.period_month === selectedMonth && p.period_year === selectedYear
  )

  const initiatePayout = async () => {
    if (!confirm(
      `Initiate payout for ${monthName(selectedMonth)} ${selectedYear}?\n\n` +
      `This will calculate fees and net amounts for all employees and submit payout instructions to Ozow.`
    )) return

    setInitiating(true)
    setResult(null)

    try {
      const res = await fetch('/api/payouts/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodMonth:     selectedMonth,
          periodYear:      selectedYear,
          feeDisposalMode: 'pending_decision',
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setResult({ success: false, message: data.error || 'Payout failed' })
      } else {
        setResult({
          success: true,
          message: `Payout initiated for ${monthName(selectedMonth)} ${selectedYear}`,
          summary: data.summary,
        })
        // Reload to show updated payout history
        setTimeout(() => window.location.reload(), 2000)
      }
    } catch {
      setResult({ success: false, message: 'Network error — please try again' })
    } finally {
      setInitiating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monthly net payout history and manual payout trigger for {companyName}
        </p>
      </div>

      {/* No bank details warning */}
      {!hasBankDetails && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Bank details required</p>
            <p className="mt-0.5">
              Please add your company bank details in{' '}
              <a href="/dashboard/settings" className="underline font-medium">Settings</a>{' '}
              before initiating a payout.
            </p>
          </div>
        </div>
      )}

      {/* Initiate payout card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Initiate payout</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculate and submit a net payout for a billing period
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Period selector */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white
                           focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white
                           focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {unpaidTransactionCount} unpaid transaction{unpaidTransactionCount !== 1 ? 's' : ''} total
            </span>
            {periodAlreadyExists && (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <AlertTriangle className="w-4 h-4" />
                Payout already exists for this period
              </span>
            )}
          </div>

          {/* Result message */}
          {result && (
            <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
              result.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {result.success
                ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                : <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              }
              <div>
                <p className="font-medium">{result.message}</p>
                {result.summary && (
                  <p className="mt-1 text-xs">
                    Gross R{result.summary.totalGross?.toFixed(2)} ·{' '}
                    Fee R{result.summary.totalFee?.toFixed(2)} ·{' '}
                    Net R{result.summary.totalNet?.toFixed(2)} ·{' '}
                    {result.summary.employeeCount} employees
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Payout instructions are sent to Ozow — ScanTippr never holds your funds.
          </p>
          <button
            onClick={initiatePayout}
            disabled={initiating || !hasBankDetails || periodAlreadyExists}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm
                       font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {initiating ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
            ) : (
              <><Play className="w-4 h-4" />Initiate payout</>
            )}
          </button>
        </div>
      </div>

      {/* Payout history */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Payout history</h2>
        {payoutPeriods.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-400">
            <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No payouts yet</p>
            <p className="text-sm mt-1">Initiated payouts will appear here</p>
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
