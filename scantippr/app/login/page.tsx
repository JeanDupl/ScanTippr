'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Attempting sign-in with:', email)

      const authPromise = supabase.auth.signInWithPassword({ email, password })
      
      // Fallback timeout to prevent infinite loading state
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign-in request timed out. Please check your Supabase credentials.')), 10000)
      )

      const { data, error }: any = await Promise.race([authPromise, timeoutPromise])

      if (error) {
        console.error('Supabase Auth Error:', error)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data?.session) {
        console.log('Sign-in successful, setting cookies...')
        const maxAge = 60 * 60 * 24 * 7 // 7 days
        document.cookie = `sb_access_token=${data.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `sb_user_id=${data.user.id}; path=/; max-age=${maxAge}; SameSite=Lax`

        window.location.href = '/dashboard'
      } else {
        setError('No session returned. Please check your credentials.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login Exception:', err)
      setError(err.message || 'An unexpected error occurred during sign in.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: '#FF5A00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '22px', fontWeight: 700, color: '#fff' }}>S</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>ScanTippr</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Sign in to your company portal</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '11px', background: loading ? '#ffa570' : '#FF5A00', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '1.5rem' }}>
          Powered by ScanTippr • Secure login
        </p>
      </div>
    </main>
  )
}
