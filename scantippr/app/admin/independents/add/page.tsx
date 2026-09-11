'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddIndependentPage() {
  const router = useRouter()
  const [form, setForm] = useState({ first_name: '', last_name: '', job_title: '', email: '', phone: '', location: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.email) { setError('First name, last name and email are required'); return }
    setSaving(true); setError(null)

    try {
      // Upload photo if provided
      let photo_url = null
      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const filename = `photo-ind-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('guard-photos').upload(filename, photoFile, { upsert: true })
        if (!uploadError) {
          const { data } = supabase.storage.from('guard-photos').getPublicUrl(filename)
          photo_url = data.publicUrl
        }
      }

      // Create guard record with no company_id
      const res = await fetch('/api/add-independent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photo_url }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create independent'); setSaving(false); return }

      router.push(`/admin/independents/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setSaving(false)
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600 as const, color: '#374151', marginBottom: '5px' }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <Link href="/admin/independents" style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>Independents</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Add Independent</span>
      </div>

      <h1 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 700, color: '#0A0A0A' }}>Add Independent</h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>First Name *</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} style={inputStyle} placeholder="e.g. John" /></div>
          <div><label style={labelStyle}>Last Name *</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} style={inputStyle} placeholder="e.g. Smith" /></div>
          <div><label style={labelStyle}>Job Title</label><input value={form.job_title} onChange={e => set('job_title', e.target.value)} style={inputStyle} placeholder="e.g. Car Guard" /></div>
          <div><label style={labelStyle}>Cell Number</label><input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="e.g. 082 123 4567" /></div>
          <div><label style={labelStyle}>Location</label><input value={form.location} onChange={e => set('location', e.target.value)} style={inputStyle} placeholder="e.g. Waterfront Spur" /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="e.g. john@email.com" /></div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Photo <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF7ED', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#F97316' }}>👤</div>
            )}
            <label style={{ padding: '7px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
              {photoFile ? photoFile.name : 'Choose photo…'}
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={saving} style={{ padding: '9px 24px', background: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Creating…' : 'Create Independent'}
          </button>
          <Link href="/admin/independents" style={{ textDecoration: 'none' }}>
            <button type="button" style={{ padding: '9px 16px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
