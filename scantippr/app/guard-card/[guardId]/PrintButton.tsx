'use client'

export default function PrintButton() {
  return (
    <>
      <button
        onClick={() => window.print()}
        className="no-print"
        style={{
          marginTop: '2rem',
          padding: '12px 32px',
          background: '#1a3a5c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Print card
      </button>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #guard-card {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}