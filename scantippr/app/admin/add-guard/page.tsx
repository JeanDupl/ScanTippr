import { createClient } from '@supabase/supabase-js'
import { addGuard } from '../actions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AddGuardPage() {
  const { data: companies } = await supabase.from('companies').select('id, name')

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
          Add guard
        </h1>

        <form action={addGuard}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
              First name
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="e.g. John"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
              Last name
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="e.g. Smith"
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
              Company
            </label>
            <select
              name="companyId"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e0e8f0',
                fontSize: '15px',
                boxSizing: 'border-box',
                background: '#fff',
              }}
            >
              <option value="">Select a company</option>
              {companies?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/admin" style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e0e8f0',
              background: '#fff',
              fontSize: '15px',
              color: '#6b7f90',
              textAlign: 'center',
              textDecoration: 'none',
            }}>
              Cancel
            </a>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#1a3a5c',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add guard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}