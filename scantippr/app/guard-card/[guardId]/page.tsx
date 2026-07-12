import { createClient } from '@supabase/supabase-js'
import PrintButton from './PrintButton'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function GuardCardPage({
  params,
}: {
  params: Promise<{ guardId: string }>
}) {
  const { guardId } = await params
  const { data: guard } = await supabase
    .from('guards')
    .select('*, companies(name, logo_url)')
    .eq('id', guardId)
    .single()

  if (!guard) {
    return <p style={{ padding: '2rem' }}>Guard not found.</p>
  }

  const qrUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/qr/${guardId}`
  const company = (guard.companies as { name: string; logo_url: string | null })
  const companyName = company?.name ?? 'ScanTippr'

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
          padding: '14px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          {company?.logo_url && (
            <img
              src={company.logo_url}
              alt={companyName}
              style={{
                height: '36px',
                objectFit: 'contain',
                maxWidth: '120px',
              }}
            />
          )}
          <p style={{
            margin: 0,
            fontSize: '12px',
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
          padding: '20px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Guard name */}
          <p style={{
            margin: 0,
            fontSize: '25px',
            fontWeight: 600,
            color: '#1a2b3c',
            textAlign: 'center',
          }}>
            {guard.first_name} {guard.last_name}
          </p>

          {/* Job title */}
          {guard.job_title && (
            <p style={{
              margin: '-4px 0 0 0',
              fontSize: '15px',
              color: '#495864',
              textAlign: 'center',
            }}>
              {guard.job_title}
            </p>
          )}

          <div style={{ width: '100%', height: '1px', background: '#e0e8f0' }} />

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 600, color: '#495864' }}>
              Scan the QR code below to show your appreciation.
            </p>
          </div>

          {/* QR Code */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '10px',
            border: '0.5px solid #e0e8f0',
          }}>
            <img
              src={qrUrl}
              alt={`QR code for ${guard.first_name} ${guard.last_name}`}
              width={220}
              height={220}
            />
          </div>

          {/* Thank you */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#495864' }}>
              Thank you for your support!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#1a3a5c',
          padding: '10px 20px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '15px', color: '#7ab3d9', fontWeight: 600 }}>
            www.scantippr.co.za
          </p>
        </div>
      </div>

      {/* Print button */}
      <PrintButton />
    </div>
  )
}