'use client'

import { useState, useMemo } from 'react'
import { Printer, Download } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  currency: string
  created_at: string
  ozow_payment_id: string | null
  status: string
  guard_id: string
}

interface Employee {
  id: string
  first_name: string
  last_name: string
  location: string | null
}

interface Props {
  transactions: Transaction[]
  employees: Employee[]
  companyName: string
}

export default function ReportsClient({ transactions, employees, companyName }: Props) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')

  const guardMap = Object.fromEntries(
    employees.map((g) => [g.id, `${g.first_name} ${g.last_name}`])
  )
  const locationMap = Object.fromEntries(
    employees.map((g) => [g.id, g.location || '—'])
  )

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.created_at)
      if (fromDate && txDate < new Date(fromDate)) return false
      if (toDate && txDate > new Date(toDate + 'T23:59:59')) return false
      if (selectedEmployee && tx.guard_id !== selectedEmployee) return false
      return true
    })
  }, [transactions, fromDate, toDate, selectedEmployee])

  const totalTips = filtered.reduce((sum, tx) => sum + Number(tx.amount), 0)
  const avgTip = filtered.length ? totalTips / filtered.length : 0
  const highestTip = filtered.length ? Math.max(...filtered.map((tx) => Number(tx.amount))) : 0
  const uniqueEmployees = new Set(filtered.map((tx) => tx.guard_id)).size

  // Employee performance breakdown
  const employeeStats = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {}
    filtered.forEach((tx) => {
      if (!map[tx.guard_id]) map[tx.guard_id] = { total: 0, count: 0 }
      map[tx.guard_id].total += Number(tx.amount)
      map[tx.guard_id].count += 1
    })
    return Object.entries(map).map(([id, stats]) => ({
      name: guardMap[id] || '—',
      count: stats.count,
      total: stats.total,
      avg: stats.total / stats.count,
    })).sort((a, b) => b.total - a.total)
  }, [filtered])

  const reportFrom = fromDate
    ? new Date(fromDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : filtered.length
    ? new Date(filtered[filtered.length - 1].created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const reportTo = toDate
    ? new Date(toDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

  const handlePrint = () => window.print()

  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Employee', 'Location', 'Amount', 'Reference']
    const rows = filtered.map((tx) => {
      const d = new Date(tx.created_at)
      return [
        d.toLocaleDateString('en-ZA'),
        d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
        guardMap[tx.guard_id] || '—',
        locationMap[tx.guard_id] || '—',
        `R${Number(tx.amount).toFixed(2)}`,
        tx.ozow_payment_id || '—',
      ]
    })
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyName.replace(/\s+/g, '-')}-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFromDate('')
    setToDate('')
    setSelectedEmployee('')
  }

  return (
    <div className="space-y-8">

      {/* Screen-only controls */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Filter and export your transaction history</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Filters - screen only */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={clearFilters} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 underline">
            Clear filters
          </button>
        </div>
      </div>

      {/* ── PRINTABLE REPORT ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 print:shadow-none print:border-none print:p-0">

        {/* Report Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-black">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{companyName}</h1>
            <p className="text-base font-semibold text-slate-500 mt-1">Transaction Report</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-widest">Report Period</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{reportFrom} – {reportTo}</p>
            <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Summary Stats - 3 columns */}
        <div className="grid grid-cols-3 border border-slate-200 rounded-xl overflow-hidden mt-6">
          <div className="p-5 border-r border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Received</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              R{totalTips.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-5 border-r border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Transactions</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{filtered.length}</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Average Payment</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              R{avgTip.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-8">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 mb-3">Payment Summary</h2>
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50">
                <td className="px-4 py-3 text-slate-500 font-medium">Total received</td>
                <td className="px-4 py-3 font-bold text-slate-900 text-right">R{totalTips.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-500 font-medium">Successful payments</td>
                <td className="px-4 py-3 font-bold text-slate-900 text-right">{filtered.length}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 text-slate-500 font-medium">Average payment</td>
                <td className="px-4 py-3 font-bold text-slate-900 text-right">R{avgTip.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-500 font-medium">Highest payment</td>
                <td className="px-4 py-3 font-bold text-slate-900 text-right">R{highestTip.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 text-slate-500 font-medium">Employees receiving payments</td>
                <td className="px-4 py-3 font-bold text-slate-900 text-right">{uniqueEmployees}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Employee Performance */}
        {employeeStats.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 mb-3">Employee Performance</h2>
            <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 text-left font-semibold">Employee</th>
                  <th className="px-4 py-3 text-right font-semibold">Payments</th>
                  <th className="px-4 py-3 text-right font-semibold">Total Received</th>
                  <th className="px-4 py-3 text-right font-semibold">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeStats.map((emp, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{emp.count}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">R{emp.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right text-slate-600">R{emp.avg.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 mb-3">Transaction History</h2>
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Employee</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold print:hidden">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx, i) => {
                const d = new Date(tx.created_at)
                return (
                  <tr key={tx.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-slate-600">{d.toLocaleDateString('en-ZA')}</td>
                    <td className="px-4 py-3 text-slate-400">{d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{guardMap[tx.guard_id] || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{locationMap[tx.guard_id] || '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">R{Number(tx.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 print:hidden">{tx.ozow_payment_id || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">No transactions found for the selected filters.</div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t-2 border-orange-500">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-600">Powered by ScanTippr</p>
              <p>Cashless appreciation. Real impact.</p>
              <p>www.scantippr.co.za  |  support@scantippr.co.za</p>
            </div>
            <p className="text-slate-400">Confidential business report</p>
          </div>
        </div>

      </div>
    </div>
  )
}