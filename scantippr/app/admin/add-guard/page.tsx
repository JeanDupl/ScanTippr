'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddGuardPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('companies').select('id, name').then(({ data }) => {
      if (data) setCompanies(data)
    })
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !companyId) return
    setSaving(true)

    let photo_url = null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `photo-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('guard-photos')
        .upload(filename, photoFile, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from('guard-photos').getPublicUrl(filename)
        photo_url = data.publicUrl
      }
    }

    await supabase.from('guards').insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      job_title: jobTitle.trim() || null,
      company_id: companyId,
      photo_url,
      is_active: true,
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
          Add employee
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            First name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g. John"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Last name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g. Smith"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Job title <span style={{ color: '#b0bec5' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Security Officer, Petrol Attendant, Waiter"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Company
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e8f0', fontSize: '15px',
              boxSizing: 'border-box', background: '#fff',
            }}
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Employee photo <span style={{ color: '#b0bec5' }}>(optional)</span>
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Photo preview"
              style={{
                width: '80px', height: '80px', objectFit: 'cover',
                marginBottom: '8px', borderRadius: '50%',
                border: '2px solid #e0e8f0',
              }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
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
            {saving ? 'Saving...' : 'Add employee'}
          </button>
        </div>
      </div>
    </div>
  )
}