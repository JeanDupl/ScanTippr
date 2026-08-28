'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TABS = ['Overview', 'Employees', 'Transactions', 'Reports', 'QR Cards', 'Payouts', 'Settings'] as const
type Tab = typeof TABS[number]

const statusStyle = (status: string) => {
  if (status === 'complete') return { bg: '#F0FDF4', color: '#15803D', label: 'Complete' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  return { bg: '#FFFBEB', color: '#B45309', label: status ?? 'Pending' }
}

export default function CompanyProfileClient({
  company, guards, transactions, payoutPeriods,
  totalDonations, thisMonthDonations, initialTab,
}: {
  company: any
  guards: any[]
  transactions: any[]
  payoutPeriods: any[]
  totalDonations: number
  thisMonthDonations: number
  initialTab: string
}) {
  const tabFromParam = TABS.find(t => t.toLowerCase() === initialTab.toLowerCase()) ?? 'Overview'
  const [activeTab, setActiveTab] = useState<Tab>(tabFromParam)

  // Guard edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFirst, setEditFirst] = useState('')
  const [editLast, setEditLast] = useState('')
  const [editJob, setEditJob] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [guardsList, setGuardsList] = useState(guards)
  const [saving, setSaving] = useState(false)

  // Company edit state
  const [companyName, setCompanyName] = useState(company.name)
  const [companyLogo, setCompanyLogo] = useState(company.logo_url ?? '')
  const [savingCompany, setSavingCompany] = useState(false)
  const [companySaved, setCompanySaved] = useState(false)

  const startEdit = (g: any) => {
    setEditingId(g.id)
    setEditFirst(g.first_name)
    setEditLast(g.last_name)
    setEditJob(g.job_title ?? '')
    setEditLocation(g.location ?? '')
  }

  const saveEdit = async (guardId: string) => {
    setSaving(true)
    const { error } = await supabase.from('guards').update({
      first_name: editFirst.trim(),
      last_name: editLast.trim(),
      job_title: editJob.trim() || null,
      location: editLocation.trim() || null,
    }).eq('id', guardId)
    if (!error) {
      setGuardsList(prev => prev.map(g => g.id === guardId
        ? { ...g, first_name: editFirst.trim(), last_name: editLast.trim(), job_title: editJob.trim() || null, location: editLocation.trim() || null }
        : g))
      setEditingId(null)
    }
    setSaving(false)
  }

  const toggleActive = async (g: any) => {
    const newStatus = !g.is_active
    const res = await fetch('/api/toggle-guard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guardId: g.id, isActive: newStatus }),
    })
    if (res.ok) setGuardsList(prev => prev.map(x => x.id === g.id ? { ...x, is_active: newStatus } : x))
  }

  const saveCompany = async () => {
    setSavingCompany(true)
    await supabase.from('companies').update({
      name: companyName.trim(),
      logo_url: companyLogo.trim() || null,
    }).eq('id', company.id)
    setSavingCompany(false)
    setCompanySaved(true)
    setTimeout(() => setCompanySaved(false), 2000)
  }

  const activeEmployees = guardsList.filter(g => g.is_active).length
  const completedTx = transactions.filter(tx => tx.payment_status === 'complete')

  // Guard totals for reports tab
  const guardTotals = guardsList.map(g => {
    const gtx = completedTx.filter(tx => tx.guard_id === g.id)
    const gross = gtx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
    const fee = Math.min(150, gross)
    const net = gross - fee
    return { ...g, txCount: gtx.length, gross, fee, net }
  })

  const exportCSV = () => {
    const rows = [
      ['Employee', 'Transactions', 'Gross Donations', 'ScanTippr Fee', 'Net Amount'],
      ...guardTotals.map(g => [
        `${g.first_name} ${g.last_name}`, g.txCount.toString(),
        g.gross.toFixed(2), g.fee.toFixed(2), g.net.toFixed(2),
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `${company.name}-report.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '36px 40px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <Link href="/admin/companies" style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>Companies</Link>
        <span style={{ color: '#D1D5DB', fontSize: '13px' }}>/</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{company.name}</span>
      </div>

      {/* Company header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name} style={{ height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '4px', background: '#fff' }} />
          ) : (
            <div style={{
              width: '48px', height: '48px', borderRadius: '10px',
              background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 700, color: '#F97316',
            }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.3px' }}>
              {company.name}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9CA3AF' }}>
              Company ID: {company.id}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('Settings')}
            style={{
              padding: '8px 18px',
              background: '#fff', color: '#374151',
              border: '1px solid #E5E7EB', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Edit Company
          </button>
          <Link href="/admin/add-guard" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '8px 18px',
              background: '#F97316', color: '#fff',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 1px 4px rgba(249,115,22,0.3)',
            }}>
              + Add Employee
            </div>
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Total Employees', value: guardsList.length, sub: `${activeEmployees} active` },
          { label: 'Active Employees', value: activeEmployees, sub: 'currently active' },
          { label: 'Total Donations', value: fmtCurrency(totalDonations), sub: 'all time', accent: true },
          { label: 'This Month', value: fmtCurrency(thisMonthDonations), sub: 'current month' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '10px', padding: '18px 20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            {(card as any).accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#F97316' }} />}
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
            <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>{card.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', background: '#F3F4F6', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '7px 16px',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#0A0A0A' : '#9CA3AF',
              border: 'none', borderRadius: '7px',
              fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.12s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {activeTab === 'Overview' && (
        <div>
          <div style={{
            background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
          }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Employee Performance</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>All-time donation totals per employee</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Employee', 'Job Title', 'Location', 'Transactions', 'Total Donations', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guardTotals.map((g, i) => (
                  <tr key={g.id} style={{ borderBottom: i < guardTotals.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <td style={{ padding: '13px 24px' }}>
                      <Link href={`/admin/employees/${g.id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A0A0A' }}>{g.first_name} {g.last_name}</span>
                      </Link>
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#6B7280' }}>{g.job_title || '—'}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#6B7280' }}>{g.location || '—'}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{g.txCount}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(g.gross)}</td>
                    <td style={{ padding: '13px 24px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: g.is_active ? '#F0FDF4' : '#F9FAFB', color: g.is_active ? '#15803D' : '#9CA3AF' }}>
                        {g.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── EMPLOYEES ─── */}
      {activeTab === 'Employees' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Employees</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{guardsList.length} employees · {activeEmployees} active</p>
            </div>
            <Link href="/admin/add-guard" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '7px 16px', background: '#F97316', color: '#fff', borderRadius: '7px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>
                + Add Employee
              </div>
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Employee', 'Job Title', 'Location', 'Employee ID', 'Status', 'QR', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guardsList.map((g, i) => (
                <tr key={g.id} style={{ borderBottom: i < guardsList.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                  {editingId === g.id ? (
                    <>
                      <td style={{ padding: '10px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input value={editFirst} onChange={e => setEditFirst(e.target.value)} style={{ width: '80px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                          <input value={editLast} onChange={e => setEditLast(e.target.value)} style={{ width: '80px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '10px 20px' }}>
                        <input value={editJob} onChange={e => setEditJob(e.target.value)} placeholder="Job title" style={{ width: '120px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                      </td>
                      <td style={{ padding: '10px 20px' }}>
                        <input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Location" style={{ width: '120px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                      </td>
                      <td style={{ padding: '10px 20px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>{g.id.slice(0, 8)}…</td>
                      <td style={{ padding: '10px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: g.is_active ? '#F0FDF4' : '#F9FAFB', color: g.is_active ? '#15803D' : '#9CA3AF' }}>
                          {g.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <a href={`/api/qr/${g.id}`} target="_blank" style={{ fontSize: '11.5px', color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>Download QR</a>
                          <a href={`/guard-card/${g.id}`} target="_blank" style={{ fontSize: '11.5px', color: '#6B7280', textDecoration: 'none' }}>Print Card</a>
                        </div>
                      </td>
                      <td style={{ padding: '10px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => saveEdit(g.id)} disabled={saving} style={{ padding: '6px 12px', background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? '…' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)} style={{ padding: '6px 12px', background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '12px 20px' }}>
                        <Link href={`/admin/employees/${g.id}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A0A0A' }}>{g.first_name} {g.last_name}</span>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6B7280' }}>{g.job_title || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6B7280' }}>{g.location || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>{g.id.slice(0, 8)}…</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: g.is_active ? '#F0FDF4' : '#F9FAFB', color: g.is_active ? '#15803D' : '#9CA3AF' }}>
                          {g.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <a href={`/api/qr/${g.id}`} target="_blank" style={{ fontSize: '11.5px', color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>Download QR</a>
                          <a href={`/guard-card/${g.id}`} target="_blank" style={{ fontSize: '11.5px', color: '#6B7280', textDecoration: 'none' }}>Print Card</a>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => startEdit(g)} style={{ padding: '6px 12px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => toggleActive(g)} style={{ padding: '6px 12px', background: g.is_active ? '#FEF2F2' : '#F0FDF4', color: g.is_active ? '#B91C1C' : '#15803D', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                            {g.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── TRANSACTIONS ─── */}
      {activeTab === 'Transactions' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Transactions</h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{transactions.length} transactions · {completedTx.length} completed</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Date', 'Employee', 'Amount', 'Reference', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No transactions yet.</td></tr>
              ) : transactions.map((tx, i) => {
                const g = guardsList.find(g => g.id === tx.guard_id)
                const s = statusStyle(tx.payment_status)
                return (
                  <tr key={tx.id} style={{ borderBottom: i < transactions.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>{new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 500, color: '#111827' }}>{g ? `${g.first_name} ${g.last_name}` : '—'}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(tx.amount)}</td>
                    <td style={{ padding: '13px 24px', fontSize: '11.5px', color: '#9CA3AF', fontFamily: 'monospace' }}>{tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '—'}</td>
                    <td style={{ padding: '13px 24px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── REPORTS ─── */}
      {activeTab === 'Reports' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }}>
            <button onClick={exportCSV} style={{ padding: '8px 18px', background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Export CSV</button>
            <button onClick={() => window.print()} style={{ padding: '8px 18px', background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Print</button>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Payout Summary — {company.name}</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>fee = MIN(R150, gross donations)</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Employee', 'Transactions', 'Gross Donations', 'ScanTippr Fee', 'Net Amount'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guardTotals.map((g, i) => (
                  <tr key={g.id} style={{ borderBottom: i < guardTotals.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{g.first_name} {g.last_name}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{g.txCount}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(g.gross)}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(g.fee)}</td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(g.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#FAFAFA', borderTop: '2px solid #E5E7EB' }}>
                  <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>Total</td>
                  <td style={{ padding: '13px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{guardTotals.reduce((s, g) => s + g.txCount, 0)}</td>
                  <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(guardTotals.reduce((s, g) => s + g.gross, 0))}</td>
                  <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 700, color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(guardTotals.reduce((s, g) => s + g.fee, 0))}</td>
                  <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(guardTotals.reduce((s, g) => s + g.net, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ─── QR CARDS ─── */}
      {activeTab === 'QR Cards' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {guardsList.filter(g => g.is_active).map(g => (
              <div key={g.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <img src={`/api/qr/${g.id}`} alt={`QR for ${g.first_name}`} style={{ width: '120px', height: '120px', marginBottom: '12px' }} />
                <p style={{ margin: '0 0 2px', fontSize: '13.5px', fontWeight: 600, color: '#0A0A0A' }}>{g.first_name} {g.last_name}</p>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9CA3AF' }}>{g.job_title || 'Employee'}</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <a href={`/api/qr/${g.id}`} target="_blank" style={{ padding: '6px 12px', background: '#F97316', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Download</a>
                  <a href={`/guard-card/${g.id}`} target="_blank" style={{ padding: '6px 12px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}>Print</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PAYOUTS ─── */}
      {activeTab === 'Payouts' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Payout History</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Monthly payout periods</p>
            </div>
            <Link href="/dashboard/payments" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '7px 16px', background: '#F97316', color: '#fff', borderRadius: '7px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>
                Manage Payouts
              </div>
            </Link>
          </div>
          {payoutPeriods.length === 0 ? (
            <div style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No payouts processed yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Period', 'Employees', 'Gross', 'Fees', 'Net Payout', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payoutPeriods.map((p, i) => {
                  const items = p.payout_line_items ?? []
                  const gross = items.reduce((s: number, li: any) => s + (li.gross_amount ?? 0), 0)
                  const fees = items.reduce((s: number, li: any) => s + (li.fee_amount ?? 0), 0)
                  const net = items.reduce((s: number, li: any) => s + (li.net_amount ?? 0), 0)
                  const s = statusStyle(p.net_payout_status)
                  return (
                    <tr key={p.id} style={{ borderBottom: i < payoutPeriods.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                      <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>{p.period_month}</td>
                      <td style={{ padding: '13px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{items.length}</td>
                      <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 600, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(gross)}</td>
                      <td style={{ padding: '13px 24px', fontSize: '13px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(fees)}</td>
                      <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(net)}</td>
                      <td style={{ padding: '13px 24px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── SETTINGS ─── */}
      {activeTab === 'Settings' && (
        <div style={{ maxWidth: '480px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '24px' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Company Details</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Company Name</label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#111827', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Logo URL</label>
              <input
                value={companyLogo}
                onChange={e => setCompanyLogo(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#111827', boxSizing: 'border-box', outline: 'none' }}
              />
              {companyLogo && (
                <img src={companyLogo} alt="Logo preview" style={{ marginTop: '10px', height: '40px', objectFit: 'contain', borderRadius: '6px' }} />
              )}
            </div>
            <button
              onClick={saveCompany}
              disabled={savingCompany}
              style={{
                padding: '10px 24px',
                background: companySaved ? '#15803D' : '#F97316',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {savingCompany ? 'Saving…' : companySaved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
