import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const revalidate = 0

export default async function IndependentsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: independents } = await supabase
    .from('guards')
    .select('*')
    .is('company_id', null)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Management</p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>Independents</h1>
        </div>
        <Link href="/admin/independents/add" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '10px 20px', background: '#F97316', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            + Add Independent
          </div>
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>Independent workers</h2>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{independents?.length ?? 0} total</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Name', 'Job Title', 'Phone', 'Email', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!independents?.length ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No independents yet.</td></tr>
            ) : independents.map((ind, i) => (
              <tr key={ind.id} style={{ borderBottom: i < independents.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {ind.photo_url ? (
                      <img src={ind.photo_url} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF7ED', border: '1px solid #F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#F97316' }}>
                        {ind.first_name?.charAt(0)}
                      </div>
                    )}
                    <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#0A0A0A' }}>{ind.first_name} {ind.last_name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 24px', fontSize: '13px', color: '#6B7280' }}>{ind.job_title || '—'}</td>
                <td style={{ padding: '12px 24px', fontSize: '13px', color: '#6B7280' }}>{ind.phone || '—'}</td>
                <td style={{ padding: '12px 24px', fontSize: '13px', color: '#6B7280' }}>{ind.email || '—'}</td>
                <td style={{ padding: '12px 24px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: ind.is_active ? '#F0FDF4' : '#F4F4F5', color: ind.is_active ? '#15803D' : '#9CA3AF' }}>
                    {ind.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <Link href={`/admin/independents/${ind.id}`} style={{ textDecoration: 'none' }}>
                    <span style={{ padding: '6px 14px', background: '#F97316', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
