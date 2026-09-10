'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setStatus('saving')
    setError(null)
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setStatus('error') }
    else { setStatus('done'); setTimeout(() => { window.location.href = '/login' }, 2000) }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/Icon.png" alt="ScanTippr" style={{ width: '64px', height: '64px', borderRadius: '12px', margin: '0 auto 1rem', display: 'block', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Set your password</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Choose a password for your ScanTippr account</p>
        </div>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', color: '#15803D', fontWeight: 600 }}>✓ Password set! Redirecting to login…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#dc2626' }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'saving'}
              style={{ width: '100%', padding: '11px', background: status === 'saving' ? '#ffa570' : '#FF5A00', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: status === 'saving' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'saving' ? 'Saving…' : 'Set Password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
