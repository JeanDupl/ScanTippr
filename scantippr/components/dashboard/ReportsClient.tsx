'use client'

import { useState, useMemo } from 'react'
import { Printer, Download } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  currency: string
  created_at: string
  paystack_reference: string
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
}

export default function ReportsClient({ transactions, employees }: Props) {
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

  const handlePrint = () => window.print()

  const handleExportCSV = () => {
    const headers = ['Date', 'Employee', 'Location', 'Amount', 'Reference']
    const rows = filtered.map((tx) => [
      new Date(tx.created_at).toLocaleDateString('en-ZA'),
      guardMap[tx.guard_id] || '—',
      locationMap[tx.guard_id] || '—',
      `R${Number(tx.amount).toFixed(2)}`,
      tx.paystack_reference,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scantippr-report-${new Date().toISOString().slice(0, 10)}.csv`
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
      {/* Header */}
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

      {/* Print header - only shows when printing */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">ScanTippr — Transaction Report</h1>
        <p className="text-sm text-slate-500">Generated: {new Date().toLocaleDateString('en-ZA')}</p>
      </div>

      {/* Filters */}
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
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total tips collected</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            R{totalTips.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total transactions</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{filtered.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Average tip</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            R{avgTip.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Transaction history</h2>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Employee</th>
              <th className="p-4">Location</th>
              <th className="p-4">Amount</th>
              <th className="p-4 print:hidden">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="p-4">{new Date(tx.created_at).toLocaleDateString('en-ZA')}</td>
                <td className="p-4 font-medium text-slate-900">{guardMap[tx.guard_id] || '—'}</td>
                <td className="p-4">{locationMap[tx.guard_id] || '—'}</td>
                <td className="p-4 font-semibold text-emerald-600">
                  R{Number(tx.amount).toFixed(2)}
                </td>
                <td className="p-4 text-xs font-mono text-slate-400 print:hidden">
                  {tx.paystack_reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">No transactions found for the selected filters.</div>
        )}
      </div>
    </div>
  )
}