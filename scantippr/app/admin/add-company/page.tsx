'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddCompanyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSaving(true)

    let logo_url = null

    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const filename = `logo-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filename, logoFile, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from('company-logos').getPublicUrl(filename)
        logo_url = data.publicUrl
      }
    }

    await supabase.from('companies').insert({
      name: name.trim(),
      logo_url,
    })

    router.push('/admin')
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600 as const, color: '#374151', marginBottom: '5px' }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <Link href="/admin/companies" style={{ textDecoration: 'none', fontSize: '13px', color: '#9CA3AF' }}>Companies</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Add Company</span>
      </div>

      <h1 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 700, color: '#0A0A0A' }}>Add Company</h1>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Company Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
            placeholder="e.g. My Security Company"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Logo <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain', border: '2px solid #E5E7EB' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#FFF7ED', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏢</div>
            )}
            <label style={{ padding: '7px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
              {logoFile ? logoFile.name : 'Choose logo…'}
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim()}
            style={{ padding: '9px 24px', background: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Creating…' : 'Create Company'}
          </button>
          <Link href="/admin/companies" style={{ textDecoration: 'none' }}>
            <button type="button" style={{ padding: '9px 16px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
