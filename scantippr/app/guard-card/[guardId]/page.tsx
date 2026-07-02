import { createClient } from '@supabase/supabase-js'
import PrintButton from './PrintButton'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function GuardCardPage({
  params,
}: {
  params: { guardId: string }
}) {
  const { data: guard } = await supabase
    .from('guards')
    .select('*, companies(name)')
    .eq('id', params.guardId)
    .single()

  if (!guard) {
    return <p style={{ padding: '2rem' }}>Guard not found.</p>
  }

  const qrUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/qr/${params.guardId}`
  const companyName = (guard.companies as { name: string })?.name ?? 'ScanTippr'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>

      {/* Card */}
      <div id="guard-card" style={{
        width: '105mm',
        minHeight: '148mm',
        background: '#f5f7fa',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}>

        {/* Header */}
        <div style={{
          background: '#1a3a5c',
          padding: '16px 20px',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#7ab3d9',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {companyName}
          </p>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>

          {/* Guard name */}
          <p style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: '#1a2b3c',
            textAlign: 'center',
          }}>
            {guard.first_name} {guard.last_name}
          </p>

          <div style={{ width: '100%', height: '1px', background: '#e0e8f0' }} />

          {/* QR Code */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '12px',
            border: '0.5px solid #e0e8f0',
          }}>
            <img
              src={qrUrl}
              alt={`QR code for ${guard.first_name} ${guard.last_name}`}
              width={160}
              height={160}
            />
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#1a2b3c' }}>
              Want to show appreciation?
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7f90' }}>
              Scan the QR code to send a tip
            </p>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          background: '#1a3a5c',
          padding: '10px 20px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#7ab3d9' }}>
            scantippr.co.za
          </p>
        </div>

      </div>

      {/* Print button */}
      <PrintButton />

    </div>
  )
}