'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const statusStyle = (status: string) => {
  if (status === 'complete' || status === 'completed') return { bg: '#F0FDF4', color: '#15803D', label: 'Completed' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  return { bg: '#FFFBEB', color: '#B45309', label: status ?? 'Pending' }
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ padding: '2px 8px', fontSize: '11px', background: copied ? '#F0FDF4' : '#F3F4F6', color: copied ? '#15803D' : '#6B7280', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function OverflowMenu({ onDeactivate, isActive }: { onDeactivate: () => void, isActive: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '8px 12px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', lineHeight: 1 }}>
        ···
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '160px', overflow: 'hidden' }}>
          <button
            onClick={() => { onDeactivate(); setOpen(false) }}
            style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', color: isActive ? '#B91C1C' : '#15803D', fontWeight: 500, cursor: 'pointer' }}
          >
            {isActive ? 'Deactivate Employee' : 'Activate Employee'}
          </button>
        </div>
      )}
    </div>
  )
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
  const [editEmail, setEditEmail] = useState(guard.email ?? '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(guard.photo_url ?? null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loginStatus, setLoginStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle')
  const [loginError, setLoginError] = useState<string | null>(null)

  const createLogin = async () => {
    if (!guard.email) { setLoginError('No email address on file for this employee.'); return }
    setLoginStatus('creating')
    setLoginError(null)
    try {
      const res = await fetch('/api/create-guard-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardId: guard.id, email: guard.email, companyId: guard.company_id }),
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.error || 'Failed to create login'); setLoginStatus('error') }
      else setLoginStatus('success')
    } catch { setLoginError('Could not connect. Please try again.'); setLoginStatus('error') }
  }

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
    await supabase.from('guards').update({
      first_name: editFirst.trim(), last_name: editLast.trim(),
      job_title: editJob.trim() || null, location: editLocation.trim() || null, photo_url,
      email: editEmail.trim() || null,
    }).eq('id', guard.id)
    setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleActive = async () => {
    const newStatus = !isActive
    const res = await fetch('/api/toggle-guard', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guardId: guard.id, isActive: newStatus }),
    })
    if (res.ok) setIsActive(newStatus)
  }

  const displayName = `${editFirst} ${editLast}`
  const completedTx = transactions.filter(tx => tx.payment_status === 'complete' || tx.payment_status === 'completed')
  const truncatedId = guard.id.substring(0, 18) + '\u2026'
  const createdAt = guard.created_at ? new Date(guard.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '\u2014'

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {photoPreview ? (
            <img src={photoPreview} alt={displayName} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F97316', boxShadow: '0 0 0 3px rgba(249,115,22,0.15)' }} />
          ) : (
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FFF7ED', border: '3px solid #F97316', boxShadow: '0 0 0 3px rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: '#F97316' }}>
              {guard.first_name.charAt(0)}
            </div>
          )}
          <span style={{ position: 'absolute', bottom: 2, right: 2, width: '12px', height: '12px', borderRadius: '50%', background: isActive ? '#22C55E' : '#9CA3AF', border: '2px solid #fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>{displayName}</h1>
          <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#6B7280' }}>
            {guard.job_title || 'Employee'}{company ? ` \u00b7 ${company.name}` : ''}{guard.location ? ` \u00b7 ${guard.location}` : ''}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6B7280' }}>
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px', color: '#9CA3AF' }}>ID </span>
              <span style={{ fontFamily: 'monospace' }}>{truncatedId}</span>
              <CopyButton value={guard.id} />
            </span>
            {guard.email && (
              <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
                <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px', color: '#9CA3AF' }}>Email </span>
                {guard.email}
              </span>
            )}
            <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px', color: '#9CA3AF' }}>Status </span>
              <span style={{ color: isActive ? '#15803D' : '#9CA3AF', fontWeight: 600 }}>{isActive ? 'Active' : 'Inactive'}</span>
            </span>
            <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px', color: '#9CA3AF' }}>Created </span>
              {createdAt}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button onClick={() => setEditing(!editing)} style={{ padding: '8px 18px', background: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {editing ? 'Cancel' : 'Edit Employee'}
          </button>
          <OverflowMenu onDeactivate={toggleActive} isActive={isActive} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Donations', value: fmtCurrency(totalDonations), color: '#0A0A0A' },
          { label: 'This Month', value: fmtCurrency(thisMonth), color: '#0A0A0A' },
          { label: 'ScanTippr Fee', value: fmtCurrency(fee), color: '#B45309' },
          { label: 'Net Amount', value: fmtCurrency(net), color: '#0A0A0A' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: card.color, fontVariantNumeric: 'tabular-nums' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        {/* LEFT COLUMN: edit form + transactions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {editing && (
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #F97316', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>Edit Employee Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={labelStyle}>First Name</label><input value={editFirst} onChange={e => setEditFirst(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Last Name</label><input value={editLast} onChange={e => setEditLast(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Job Title</label><input value={editJob} onChange={e => setEditJob(e.target.value)} placeholder="e.g. Car Guard" style={inputStyle} /></div>
                <div><label style={labelStyle}>Location</label><input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="e.g. Gate 1" style={inputStyle} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Email</label><input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="e.g. john@email.com" style={inputStyle} type="email" /></div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Photo <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF7ED', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#F97316' }}>{guard.first_name.charAt(0)}</div>
                  )}
                  <label style={{ padding: '7px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                    {photoFile ? photoFile.name : 'Choose photo\u2026'}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={saveEdit} disabled={saving} style={{ padding: '9px 24px', background: saved ? '#15803D' : '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving\u2026' : saved ? '\u2713 Saved' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setPhotoFile(null); setPhotoPreview(guard.photo_url ?? null) }} style={{ padding: '9px 16px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Transaction History</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} \u00b7 {completedTx.length} completed</p>
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
                      <td style={{ padding: '12px 24px', fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>{tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '\u2014'}</td>
                      <td style={{ padding: '12px 24px' }}><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: dashboard access + qr code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#0A0A0A' }}>Dashboard Access</p>
            <p style={{ margin: '0 0 14px', fontSize: '11.5px', color: '#9CA3AF' }}>
              {loginStatus === 'success' ? 'Login created — employee will receive a password setup email.' : 'Give this employee access to their personal dashboard.'}
            </p>
            {loginError && <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#B91C1C' }}>{loginError}</p>}
            <button
              onClick={createLogin}
              disabled={loginStatus === 'creating' || loginStatus === 'success'}
              style={{
                width: '100%', padding: '9px 14px', background: loginStatus === 'success' ? '#15803D' : '#F97316',
                color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600,
                cursor: loginStatus === 'creating' || loginStatus === 'success' ? 'not-allowed' : 'pointer', opacity: loginStatus === 'creating' ? 0.7 : 1,
              }}
            >
              {loginStatus === 'creating' ? 'Creating Login…' : loginStatus === 'success' ? '✓ Login Created' : 'Create Login'}
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: '#0A0A0A' }}>Employee QR Code</p>
            <p style={{ margin: '0 0 14px', fontSize: '11.5px', color: '#9CA3AF' }}>Linked to {guard.first_name} {guard.last_name}</p>
            <img src={`/api/qr/${guard.id}`} alt="QR Code" style={{ width: '130px', height: '130px', marginBottom: '14px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href={`/guard-card/${guard.id}`} target="_blank" style={{ display: 'block', padding: '8px 14px', background: '#F97316', color: '#fff', borderRadius: '7px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Print Card</a>
              <a href={`/api/qr/${guard.id}`} target="_blank" style={{ display: 'block', padding: '8px 14px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', textDecoration: 'none' }}>Download QR</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
