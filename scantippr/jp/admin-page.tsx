import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const revalidate = 0

export default async function AdminDashboard() {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

  const [
    { count: totalCompanies },
    { count: activeEmployees },
    { data: allTx },
    { data: recentTx },
    { data: guards },
    { data: companies },
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('guards').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('transactions').select('amount, created_at, payment_status'),
    supabase.from('transactions')
      .select('id, amount, created_at, guard_id, company_id, payment_status')
      .order('created_at', { ascending: false })
      .limit(12),
    supabase.from('guards').select('id, first_name, last_name'),
    supabase.from('companies').select('id, name'),
  ])

  const completedTx = allTx?.filter(tx => tx.payment_status === 'complete') ?? []
  const totalDonations = completedTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const thisMonthTx = completedTx.filter(tx => tx.created_at >= firstOfMonth)
  const lastMonthTx = completedTx.filter(tx => tx.created_at >= firstOfLastMonth && tx.created_at < firstOfMonth)
  const thisMonthTotal = thisMonthTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const lastMonthTotal = lastMonthTx.reduce((s, tx) => s + (tx.amount ?? 0), 0)
  const monthGrowth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : null

  const guardName = (id: string) => {
    const g = guards?.find(g => g.id === id)
    return g ? `${g.first_name} ${g.last_name}` : '—'
  }
  const companyName = (id: string) => companies?.find(c => c.id === id)?.name ?? '—'

  const statusStyle = (status: string) => {
    if (status === 'complete') return { bg: '#F0FDF4', color: '#15803D', label: 'Complete' }
    if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
    return { bg: '#FFFBEB', color: '#B45309', label: status ?? 'Pending' }
  }

  const fmtCurrency = (n: number) =>
    'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ padding: '36px 40px', maxWidth: '1200px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Platform Overview
          </p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>
            Dashboard
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
          {now.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          {
            label: 'Total Companies', value: totalCompanies ?? 0, href: '/admin/companies',
            sub: 'registered on platform', accent: false,
          },
          {
            label: 'Active Employees', value: activeEmployees ?? 0, href: '/admin/employees',
            sub: 'across all companies', accent: false,
          },
          {
            label: 'Total Donations', value: fmtCurrency(totalDonations), href: '/admin/reports',
            sub: 'all time, completed', accent: true,
          },
          {
            label: 'This Month',
            value: fmtCurrency(thisMonthTotal),
            href: '/admin/transactions',
            sub: monthGrowth !== null
              ? `${monthGrowth >= 0 ? '+' : ''}${monthGrowth.toFixed(1)}% vs last month`
              : 'current month',
            accent: false,
            growthPositive: monthGrowth !== null ? monthGrowth >= 0 : null,
          },
        ].map((card) => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '22px 24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, border-color 0.15s',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {card.accent && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: '#F97316',
                }} />
              )}
              <p style={{ margin: '0 0 10px', fontSize: '11.5px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {card.label}
              </p>
              <p style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
                {card.value}
              </p>
              <p style={{
                margin: 0, fontSize: '12px',
                color: (card as any).growthPositive === true ? '#15803D' : (card as any).growthPositive === false ? '#B91C1C' : '#9CA3AF',
                fontWeight: (card as any).growthPositive !== null ? 600 : 400,
              }}>
                {card.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        {[
          { label: '+ Add Company', href: '/admin/add-company', primary: true },
          { label: '+ Add Employee', href: '/admin/add-guard', primary: false },
          { label: 'View All Companies', href: '/admin/companies', primary: false },
          { label: 'Reports', href: '/admin/reports', primary: false },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '8px 18px',
              background: a.primary ? '#F97316' : '#fff',
              color: a.primary ? '#fff' : '#374151',
              border: a.primary ? 'none' : '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: a.primary ? '0 1px 4px rgba(249,115,22,0.3)' : '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              {a.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent transactions */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid #F3F4F6',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0A0A0A' }}>Recent Transactions</h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Latest activity across the platform</p>
          </div>
          <Link href="/admin/transactions" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '12.5px', color: '#F97316', fontWeight: 600, cursor: 'pointer' }}>
              View all →
            </div>
          </Link>
        </div>

        {!recentTx || recentTx.length === 0 ? (
          <div style={{ padding: '56px', textAlign: 'center' }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>No transactions recorded yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Date', 'Employee', 'Company', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '10px 24px',
                    textAlign: 'left',
                    fontSize: '11px', fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    borderBottom: '1px solid #F3F4F6',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTx?.map((tx, i) => {
                const s = statusStyle(tx.payment_status)
                return (
                  <tr key={tx.id} style={{ borderBottom: i < (recentTx.length - 1) ? '1px solid #F9FAFB' : 'none' }}>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      {guardName(tx.guard_id)}
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: '13px', color: '#6B7280' }}>
                      {companyName(tx.company_id)}
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCurrency(tx.amount)}
                    </td>
                    <td style={{ padding: '13px 24px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '11.5px', fontWeight: 600,
                        background: s.bg, color: s.color,
                      }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
