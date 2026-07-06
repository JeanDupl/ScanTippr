'use client'

import { useState } from 'react'

export default function CollapsibleTransactions({
  companyName,
  transactions,
  guards,
}: {
  companyName: string
  transactions: any[]
  guards: any[]
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left px-6 py-3 bg-gray-50 border-b"
      >
        <h3 className="font-semibold text-gray-700">{companyName}</h3>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Guard</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Reference</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="px-6 py-3 text-gray-500">
                  {new Date(tx.created_at).toLocaleDateString('en-ZA')}
                </td>
                <td className="px-6 py-3">
                  {guards?.find((g) => g.id === tx.guard_id)?.first_name}{' '}
                  {guards?.find((g) => g.id === tx.guard_id)?.last_name}
                </td>
                <td className="px-6 py-3 font-medium text-green-600">R{tx.amount}</td>
                <td className="px-6 py-3 text-gray-400 text-xs">{tx.paystack_reference}</td>
                <td className="px-6 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}