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
export default function EmployeeProfileClient({ guard, company, transactions, totalDonations, thisMonth, fee, net }: { guard: any, company: any, transactions: any[], totalDonations: number, thisMonth: number, fee: number, net: number }) {
  const [isActive, setIsActive] = useState(guard.is_active)
  const [editing, setEditing] = useState(false)
  const [editFirst, setEditFirst] = useState(guard.first_name)
  const [editLast, setEditLast] = useState(guard.last_name)
  const [editJob, setEditJob] = useState(guard.job_title ?? '')
  const [editLocation, setEditLocation] = useState(guard.location ?? '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(guard.photo_url ?? null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)) }
  }
  const saveEdit = async () => {
    setSaving(true)
    let photo_url = guard.photo_url
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `photo-${guard.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('guard-photos').upload(filename, photoFile, { upsert: true })
      if (!uploadError) {
        const { data } = supabase.storage.from('guard-photos').getPublicUrl(filename)
        photo_url = data.publicUrl
      }
    }
    await supabase.from('guards').update({ first_name: editFirst.trim(), last_name: editLast.trim(), job_title: editJob.trim() || null, location: editLocation.trim() || null, photo_url }).eq('id', guard.id)
    setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }
  const toggleActive = async () => {
    const newStatus = !isActive
    const res = await fetch('/api/toggle-guard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guardId: guard.id, isActive: newStatus }) })
    if (res.ok) setIsActive(newStatus)
  }
  const displayName = `${editFirst} ${editLast}`
  const completedTx = transactions.filter(tx => tx.payment_status === 'complete')
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600 as const, color: '#374151', marginBottom: '5px' }
  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <Link href="/admin/companies" style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>Companies</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        {company && <Link href={`/admin/companies/${company.id}`} style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>{company.name}</Link>}
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{displayName}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        {photoPreview ? (
          <img src={photoPreview} alt={displayName} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F97316' }} />
        ) : (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF7ED', border: '3px solid #F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#F97316' }}>{guard.first_name.charAt(0)}</div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.3px' }}>{displayName}</h1>
          <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#6B7280' }}>{guard.job_title || 'Employee'}{company ? ` · ${company.name}` : ''}{guard.location ? ` · ${guard.location}` : ''}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: isActive ? '#F0FDF4' : '#F9FAFB', color: isActive ? '#15803D' : '#9CA3AF' }}>{isActive ? 'Active' : 'Inactive'}</span>
          <button onClick={() => setEditing(!editing)} style={{ padding: '8px 16px', background: editing ? '#F3F4F6' : '#4B5563', color: editing ? '#374151' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{editing ? 'Cancel' : 'Edit Employee'}</button>
          <button onClick={toggleActive} style={{ padding: '8px 16px', background: '#4B5563', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{isActive ? 'Deactivate' : 'Activate'}</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Donations', value: fmtCurrency(totalDonations), color: '#15803D' },
          { label: 'This Month', value: fmtCurrency(thisMonth), color: '#1D4ED8' },
          { label: 'ScanTippr Fee', value: fmtCurrency(fee), color: '#B45309' },
          { label: 'Net Amount', value: fmtCurrency(net), color: '#0A0A0A' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#F97316' }} />
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: card.color, fontVariantNumeric: 'tabular-nums' }}>{card.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {editing && (
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #F97316', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>Edit Employee Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={labelStyle}>First Name</label><input value={editFirst} onChange={e => setEditFirst(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Last Name</label><input value={editLast} onChange={e => setEditLast(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Job Title</label><input value={editJob} onChange={e => setEditJob(e.target.value)} placeholder="e.g. Car Guard" style={inputStyle} /></div>
                <div><label style={labelStyle}>Location</label><input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Gate 1" style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Photo <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }} />
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FFF7ED', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#F97316' }}>{guard.first_name.charAt(0)}</div>
                  )}
                  <label style={{ padding: '8px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                    {photoFile ? photoFile.name : 'Choose photo…'}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={saveEdit} disabled={saving} style={{ padding: '9px 24px', background: saved ? '#15803D' : '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}</button>
                <button onClick={() => { setEditing(false); setPhotoFile(null); setPhotoPreview(guard.photo_url ?? null) }} style={{ padding: '9px 16px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
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
                      <td style={{ padding: '12px 24px', fontSize: '13px', color: '#6B7280' }}>{new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td style={{ padding: '12px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(tx.amount)}</td>
                      <td style={{ padding: '12px 24px', fontSize: '11.5px', color: '#9CA3AF', fontFamily: 'monospace' }}>{tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '—'}</td>
                      <td style={{ padding: '12px 24px' }}><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Details</p>
            {[
              { label: 'Employee ID', value: guard.id, mono: true },
              { label: 'Location', value: guard.location || '—' },
              { label: 'Company', value: company?.name || '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: '12px', color: '#111827', fontWeight: 500, fontFamily: row.mono ? 'monospace' : 'inherit', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>QR Code</p>
            <img src={`/api/qr/${guard.id}`} alt="QR Code" style={{ width: '120px', height: '120px', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <a href={`/api/qr/${guard.id}`} target="_blank" style={{ padding: '6px 14px', background: '#F97316', color: '#fff', borderRadius: '7px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Download</a>
              <a href={`/guard-card/${guard.id}`} target="_blank" style={{ padding: '6px 14px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '12px', textDecoration: 'none' }}>Print Card</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
