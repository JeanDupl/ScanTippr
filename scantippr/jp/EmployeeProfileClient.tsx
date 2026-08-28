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

const statusStyle = (status: string) => {
  if (status === 'complete') return { bg: '#F0FDF4', color: '#15803D', label: 'Complete' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  return { bg: '#FFFBEB', color: '#B45309', label: status ?? 'Pending' }
}

export default function EmployeeProfileClient({
  guard, company, transactions,
  totalDonations, thisMonth, fee, net,
}: {
  guard: any, company: any, transactions: any[],
  totalDonations: number, thisMonth: number, fee: number, net: number,
}) {
  const [isActive, setIsActive] = useState(guard.is_active)
  const [editing, setEditing] = useState(false)
  const [editFirst, setEditFirst] = useState(guard.first_name)
  const [editLast, setEditLast] = useState(guard.last_name)
  const [editJob, setEditJob] = useState(guard.job_title ?? '')
  const [editLocation, setEditLocation] = useState(guard.location ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveEdit = async () => {
    setSaving(true)
    await supabase.from('guards').update({
      first_name: editFirst.trim(),
      last_name: editLast.trim(),
      job_title: editJob.trim() || null,
      location: editLocation.trim() || null,
    }).eq('id', guard.id)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleActive = async () => {
    const newStatus = !isActive
    const res = await fetch('/api/toggle-guard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guardId: guard.id, isActive: newStatus }),
    })
    if (res.ok) setIsActive(newStatus)
  }

  const displayName = `${editFirst} ${editLast}`
  const completedTx = transactions.filter(tx => tx.payment_status === 'complete')

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <Link href="/admin/companies" style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>Companies</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        {company && <Link href={`/admin/companies/${company.id}`} style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>{company.name}</Link>}
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{displayName}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Identity card */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ background: '#0A0A0A', padding: '20px 24px 24px', textAlign: 'center' }}>
              {guard.photo_url ? (
                <img src={guard.photo_url} alt={displayName} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F97316', marginBottom: '12px' }} />
              ) : (
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#1a1a1a', border: '3px solid #F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 700, color: '#F97316', margin: '0 auto 12px' }}>
                  {guard.first_name.charAt(0)}
                </div>
              )}
              <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#fff' }}>{displayName}</h2>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#9CA3AF' }}>{guard.job_title || 'Employee'}</p>
              {company && <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>{company.name}</p>}
            </div>
            <div style={{ padding: '16px 24px' }}>
              {[
                { label: 'Employee ID', value: guard.id, mono: true },
                { label: 'Location', value: guard.location || '—' },
                { label: 'Status', value: isActive ? 'Active' : 'Inactive', badge: true, active: isActive },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>{row.label}</span>
                  {row.badge ? (
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: row.active ? '#F0FDF4' : '#F9FAFB', color: row.active ? '#15803D' : '#9CA3AF' }}>
                      {row.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12.5px', color: '#111827', fontWeight: 500, fontFamily: row.mono ? 'monospace' : 'inherit', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QR card */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 24px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>QR Code</p>
            <img src={`/api/qr/${guard.id}`} alt="QR Code" style={{ width: '140px', height: '140px', marginBottom: '14px' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <a href={`/api/qr/${guard.id}`} target="_blank" style={{ padding: '7px 16px', background: '#F97316', color: '#fff', borderRadius: '7px', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>Download QR</a>
              <a href={`/guard-card/${guard.id}`} target="_blank" style={{ padding: '7px 16px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '12.5px', textDecoration: 'none' }}>Print Card</a>
            </div>
          </div>

          {/* Actions card */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 24px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Actions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => setEditing(!editing)} style={{ padding: '9px 16px', background: editing ? '#F9FAFB' : '#0A0A0A', color: editing ? '#374151' : '#fff', border: editing ? '1px solid #E5E7EB' : 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                {editing ? 'Cancel Edit' : 'Edit Employee'}
              </button>
              <button onClick={toggleActive} style={{ padding: '9px 16px', background: isActive ? '#FEF2F2' : '#F0FDF4', color: isActive ? '#B91C1C' : '#15803D', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                {isActive ? 'Deactivate Employee' : 'Activate Employee'}
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Edit form */}
          {editing && (
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #F97316', boxShadow: '0 1px 3px rgba(249,115,22,0.1)', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>Edit Employee Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>First Name</label>
                  <input value={editFirst} onChange={e => setEditFirst(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Last Name</label>
                  <input value={editLast} onChange={e => setEditLast(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Job Title</label>
                  <input value={editJob} onChange={e => setEditJob(e.target.value)} placeholder="e.g. Car Guard" style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Location</label>
                  <input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Gate 1" style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={saveEdit} disabled={saving} style={{ padding: '9px 24px', background: saved ? '#15803D' : '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Donation summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Total Donations', value: fmtCurrency(totalDonations), color: '#15803D' },
              { label: 'This Month', value: fmtCurrency(thisMonth), color: '#1D4ED8' },
              { label: 'ScanTippr Fee', value: fmtCurrency(fee), color: '#B45309' },
              { label: 'Net Amount', value: fmtCurrency(net), color: '#0A0A0A' },
            ].map(card => (
              <div key={card.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: card.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Transaction history */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Transaction History</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{transactions.length} transactions · {completedTx.length} completed</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA' }}>
                  {['Date', 'Amount', 'Reference', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No transactions yet.</td></tr>
                ) : transactions.map((tx, i) => {
                  const s = statusStyle(tx.payment_status)
                  return (
                    <tr key={tx.id} style={{ borderBottom: i < transactions.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                      <td style={{ padding: '12px 24px', fontSize: '13px', color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>{new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td style={{ padding: '12px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(tx.amount)}</td>
                      <td style={{ padding: '12px 24px', fontSize: '11.5px', color: '#9CA3AF', fontFamily: 'monospace' }}>{tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '—'}</td>
                      <td style={{ padding: '12px 24px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
