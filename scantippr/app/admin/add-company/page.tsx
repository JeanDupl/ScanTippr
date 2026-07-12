'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddCompanyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [subaccount, setSubaccount] = useState('')
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
      paystack_subaccount_code: subaccount.trim() || null,
      logo_url,
    })

    router.push('/admin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ margin: '0 0 1.5rem', fontSize: '22px', color: '#1a2b3c' }}>
          Add company
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Company name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ABC Security"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Payment subaccount code <span style={{ color: '#b0bec5' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={subaccount}
            onChange={(e) => setSubaccount(e.target.value)}
            placeholder="e.g. ACCT_xxxxxxxxxx"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Company logo <span style={{ color: '#b0bec5' }}>(optional)</span>
          </label>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px', borderRadius: '8px', border: '1px solid #e0e8f0' }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ fontSize: '14px', color: '#6b7f90' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/admin" style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: '1px solid #e0e8f0', background: '#fff',
            fontSize: '15px', color: '#6b7f90', textAlign: 'center', textDecoration: 'none',
          }}>
            Cancel
          </a>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              background: '#1a3a5c', color: '#fff', fontSize: '15px',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Add company'}
          </button>
        </div>
      </div>
    </div>
  )
}