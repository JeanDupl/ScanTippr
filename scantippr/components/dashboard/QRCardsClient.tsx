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
    a.href = `/api/qr/${employeeId}?v=4`
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
              className="print:break-inside-avoid"
              style={{
                width: '105mm',
                minHeight: '148mm',
                background: '#f5f7fa',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                fontFamily: 'sans-serif',
              }}
            >
              {/* Blue header */}
              <div style={{
                background: '#1a3a5c',
                padding: '14px 20px',
                textAlign: 'center',
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#7ab3d9',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {companyName}
                </p>
              </div>

              {/* Body */}
              <div style={{
                flex: 1,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Guard name */}
                <p style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: '#1a2b3c', textAlign: 'center' }}>
                  {emp.first_name} {emp.last_name}
                </p>

                {/* Job title */}
                {emp.job_title && (
                  <p style={{ margin: '-8px 0 0 0', fontSize: '14px', color: '#495864', textAlign: 'center' }}>
                    {emp.job_title}
                  </p>
                )}

                <div style={{ width: '100%', height: '1px', background: '#e0e8f0' }} />

                {/* CTA */}
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#495864', textAlign: 'center' }}>
                  Scan the QR code below to show your appreciation.
                </p>

                {/* QR Code */}
                <div style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px',
                  border: '0.5px solid #e0e8f0',
                }}>
                  <img
                    src={`/api/qr/${emp.id}?v=4`}
                    alt={`QR code for ${emp.first_name} ${emp.last_name}`}
                    width={180}
                    height={180}
                  />
                </div>

                {/* Thank you */}
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#495864', textAlign: 'center' }}>
                  Thank you for your support!
                </p>
              </div>

              {/* Blue footer */}
              <div style={{ background: '#1a3a5c', padding: '10px 20px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#7ab3d9', fontWeight: 600 }}>
                  www.scantippr.co.za
                </p>
              </div>

              {/* Download button - hidden on print */}
              <button
                onClick={() => handleDownload(emp.id, `${emp.first_name}-${emp.last_name}`)}
                className="print:hidden"
                style={{
                  margin: '12px 16px 16px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download className="w-4 h-4" />
                Download QR
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
