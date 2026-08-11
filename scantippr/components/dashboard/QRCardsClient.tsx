'use client'

import { Printer, Download } from 'lucide-react'

interface Employee {
  id: string
  first_name: string
  last_name: string
  job_title: string | null
  location: string | null
  is_active: boolean
}

interface Props {
  employees: Employee[]
  companyName: string
}

export default function QRCardsClient({ employees, companyName }: Props) {
  const handlePrint = () => window.print()

  const handleDownload = (employeeId: string, name: string) => {
    const a = document.createElement('a')
    a.href = `/api/qr/${employeeId}`
    a.download = `${name.replace(/\s+/g, '-')}-qr.png`
    a.click()
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">QR Cards</h1>
          <p className="text-slate-500 text-sm mt-1">Download or print QR codes for your active employees</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print all
        </button>
      </div>

      {/* Cards grid */}
      {employees.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">No active employees found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-6 gap-4 print:break-inside-avoid print:border print:border-slate-300"
            >
              {/* Company name */}
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{companyName}</p>

              {/* QR Code */}
              <img
                src={`/api/qr/${emp.id}`}
                alt={`QR code for ${emp.first_name} ${emp.last_name}`}
                className="w-48 h-48 rounded-lg"
              />

              {/* Employee info */}
              <div className="text-center">
                <p className="text-lg font-extrabold text-slate-900">{emp.first_name} {emp.last_name}</p>
                {emp.job_title && <p className="text-sm text-slate-500 mt-0.5">{emp.job_title}</p>}
                {emp.location && <p className="text-xs text-slate-400 mt-0.5">{emp.location}</p>}
              </div>

              {/* Tip prompt */}
              <p className="text-xs text-slate-400 text-center">Scan to leave a tip</p>

              {/* Download button - hidden on print */}
              <button
                onClick={() => handleDownload(emp.id, `${emp.first_name}-${emp.last_name}`)}
                className="print:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors w-full justify-center"
              >
                <Download className="w-4 h-4" />
                Download QR
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Print footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        <p>Powered by ScanTippr — www.scantippr.co.za</p>
      </div>
    </div>
  )
}