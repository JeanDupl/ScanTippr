'use client'

import { useState } from 'react'

export default function CollapsibleCompany({
  company,
}: {
  company: any
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left mb-2"
      >
        <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Guard ID</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {company.guards?.map((guard: any) => (
              <tr key={guard.id} className="border-b last:border-0">
                <td className="py-2 text-gray-500">{guard.id}</td>
                <td className="py-2 font-medium">{guard.first_name} {guard.last_name}</td>
                <td className="py-2">
                  <span className={guard.is_active
                    ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-700'
                    : 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500'}>
                    {guard.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-2">
                  <a href={'/api/qr/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                    Download QR
                  </a>
                  <span className="text-gray-300 mx-1">|</span>
                  <a href={'/guard-card/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                    Print card
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}