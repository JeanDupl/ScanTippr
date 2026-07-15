'use client'

import { useState, useMemo } from 'react'

type Transaction = {
  id: string
  guard_id: string
  company_id: string
  amount: number
  currency: string
  paystack_reference: string
  status: string
  created_at: string
}

type Guard = {
  id: string
  first_name: string
  last_name: string
  job_title: string | null
  company_id: string
}

type Company = {
  id: string
  name: string
}

export default function ReportsClient({
  transactions,
  guards,
  companies,
}: {
  transactions: Transaction[]
  guards: Guard[]
  companies: Company[]
}) {
  const today = new Date().toISOString().split('T')[0]
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const [from, setFrom] = useState(firstOfMonth)
  const [to, setTo] = useState(today)
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedGuard, setSelectedGuard] = useState<string>('all')

  const filtered = useMemo(() => {
  return transactions.filter((tx) => {
    const date = tx.created_at.split('T')[0]
    const inRange = date >= from && date <= to
    const inCompany = selectedCompany === 'all' || tx.company_id === selectedCompany
    const inGuard = selectedGuard === 'all' || tx.guard_id === selectedGuard
    return inRange && inCompany && inGuard
  })
}, [transactions, from, to, selectedCompany, selectedGuard])

  const guardName = (id: string) => {
    const g = guards.find((g) => g.id === id)
    return g ? `${g.first_name} ${g.last_name}` : '—'
  }

  const companyName = (id: string) => {
    return companies.find((c) => c.id === id)?.name ?? '—'
  }

  // Group by company
  const byCompany = useMemo(() => {
    const map: Record<string, Transaction[]> = {}
    filtered.forEach((tx) => {
      if (!map[tx.company_id]) map[tx.company_id] = []
      map[tx.company_id].push(tx)
    })
    return map
  }, [filtered])

  // Totals per guard
  const guardTotals = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach((tx) => {
      map[tx.guard_id] = (map[tx.guard_id] ?? 0) + tx.amount
    })
    return map
  }, [filtered])

  const totalAll = filtered.reduce((sum, tx) => sum + tx.amount, 0)

  // CSV export - all filtered transactions
  const exportCSV = (txList: Transaction[], filename: string) => {
    const rows = [
      ['Date', 'Company', 'Employee', 'Job Title', 'Amount (ZAR)', 'Reference', 'Status'],
      ...txList.map((tx) => {
        const g = guards.find((g) => g.id === tx.guard_id)
        return [
          new Date(tx.created_at).toLocaleDateString('en-ZA'),
          companyName(tx.company_id),
          guardName(tx.guard_id),
          g?.job_title ?? '—',
          tx.amount.toString(),
          tx.paystack_reference,
          tx.status,
        ]
      }),
    ]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => window.print()

  return (
    <main className="min-h-screen bg-gray-50 p-8 print:p-4 print:bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <a href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 block">
            ← Back to Admin
          </a>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV(filtered, `scantippr-report-${from}-to-${to}.csv`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
          >
            Export All CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700"
          >
            Print
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ScanTippr — Transaction Report</h1>
        <p className="text-gray-500 text-sm">Period: {from} to {to}</p>
        {selectedCompany !== 'all' && (
          <p className="text-gray-500 text-sm">Company: {companyName(selectedCompany)}</p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 print:hidden">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                 setSelectedCompany(e.target.value)
                 setSelectedGuard('all')
                 }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
  <label className="block text-xs text-gray-500 mb-1 font-medium">Employee</label>
  <select
    value={selectedGuard}
    onChange={(e) => setSelectedGuard(e.target.value)}
    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
  >
    <option value="all">All employees</option>
    {guards
      .filter((g) => selectedCompany === 'all' || g.company_id === selectedCompany)
      .map((g) => (
        <option key={g.id} value={g.id}>
          {g.first_name} {g.last_name}
        </option>
      ))}
  </select>
</div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total collected</p>
          <p className="text-2xl font-bold text-green-600">R{totalAll.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Companies</p>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(byCompany).length}</p>
        </div>
      </div>

      {/* Transactions by company */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          No transactions found for this period.
        </div>
      ) : (
        Object.entries(byCompany).map(([companyId, txList]) => {
          const companyTotal = txList.reduce((sum, tx) => sum + tx.amount, 0)
          const company = companies.find((c) => c.id === companyId)

          return (
            <div key={companyId} className="bg-white rounded-xl shadow mb-6 overflow-hidden print:break-inside-avoid">
              {/* Company header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                <div>
                  <h2 className="font-semibold text-gray-800">{company?.name}</h2>
                  <p className="text-sm text-gray-400">{txList.length} transactions · Total: <span className="text-green-600 font-semibold">R{companyTotal.toFixed(2)}</span></p>
                </div>
                <button
                  onClick={() => exportCSV(txList, `${company?.name}-${from}-to-${to}.csv`)}
                  className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 print:hidden"
                >
                  Export CSV
                </button>
              </div>

              {/* Guard totals summary */}
              <div className="px-6 py-3 bg-blue-50 border-b flex flex-wrap gap-4">
                {Object.entries(
                  txList.reduce((acc, tx) => {
                    acc[tx.guard_id] = (acc[tx.guard_id] ?? 0) + tx.amount
                    return acc
                  }, {} as Record<string, number>)
                ).map(([guardId, total]) => (
                  <span key={guardId} className="text-xs text-blue-700">
                    {guardName(guardId)}: <strong>R{total.toFixed(2)}</strong>
                  </span>
                ))}
              </div>

              {/* Transactions table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b text-xs">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {txList.map((tx) => {
                    const g = guards.find((g) => g.id === tx.guard_id)
                    return (
                      <tr key={tx.id} className="border-t">
                        <td className="px-6 py-3 text-gray-500">
                          {new Date(tx.created_at).toLocaleDateString('en-ZA')}
                        </td>
                        <td className="px-6 py-3">{guardName(tx.guard_id)}</td>
                        <td className="px-6 py-3 text-gray-400">{g?.job_title ?? '—'}</td>
                        <td className="px-6 py-3 font-medium text-green-600">R{tx.amount}</td>
                        <td className="px-6 py-3 text-gray-400 text-xs">{tx.paystack_reference ?? '—'}</td>
                        <td className="px-6 py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-gray-50">
                    <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-600">Company Total</td>
                    <td className="px-6 py-3 font-bold text-green-600">R{companyTotal.toFixed(2)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        })
      )}
    </main>
  )
}