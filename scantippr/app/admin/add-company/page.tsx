'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddCompanyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [subaccount, setSubaccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Company name is required.')
      return
    }
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase
      .from('companies')
      .insert({ name: name.trim(), paystack_subaccount_code: subaccount.trim() })

    setLoading(false)

    if (dbError) {
      setError(dbError.message)
    } else {
      router.push('/admin')
    }
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
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e8f0',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
            Payment subaccount code <span style={{ color: '#b0bec5' }}>(optional for now)</span>
          </label>
          <input
            type="text"
            value={subaccount}
            onChange={(e) => setSubaccount(e.target.value)}
            placeholder="e.g. ACCT_xxxxxxxxxx"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e8f0',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e0e8f0',
              background: '#fff',
              fontSize: '15px',
              cursor: 'pointer',
              color: '#6b7f90',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: '#1a3a5c',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Add company'}
          </button>
        </div>
      </div>
    </div>
  )
}