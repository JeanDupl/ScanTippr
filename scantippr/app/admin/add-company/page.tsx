import { addCompany } from '../actions'

export default function AddCompanyPage() {
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

        <form action={addCompany}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7f90', marginBottom: '6px' }}>
              Company name
            </label>
            <input
              name="name"
              type="text"
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
              name="subaccount"
              type="text"
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
              Add company
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}