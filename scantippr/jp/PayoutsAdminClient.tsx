'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const statusStyle = (status: string) => {
  if (status === 'complete' || status === 'paid') return { bg: '#F0FDF4', color: '#15803D', label: 'Paid' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  if (status === 'not_due') return { bg: '#F3F4F6', color: '#6B7280', label: 'Not Due' }
  if (status === 'pending') return { bg: '#FFFBEB', color: '#B45309', label: 'Pending' }
  return { bg: '#F3F4F6', color: '#6B7280', label: status ?? '—' }
}

export default function PayoutsAdminClient({
  periods,
  companies,
}: {
  periods: any[]
  companies: any[]
}) {
  const [companyFilter, setCompanyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => periods.filter(p => {
    const inCompany = companyFilter === 'all' || p.company_id === companyFilter
    const inStatus = statusFilter === 'all' || p.net_payout_status === statusFilter
    const inSearch = !search || p.companyName.toLowerCase().includes(search.toLowerCase()) || p.period_month.includes(search)
    return inCompany && inStatus && inSearch
  }), [periods, companyFilter, statusFilter, search])

  const totalGross = filtered.reduce((s, p) => s + p.gross, 0)
  const totalFee = filtered.reduce((s, p) => s + p.fee, 0)
  const totalNet = filtered.reduce((s, p) => s + p.net, 0)

  return (
    <div style={{ padding: '36px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Payments
          </p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>
            Payouts
          </h1>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Payout Periods', value: filtered.length, sub: 'across all companies' },
          { label: 'Total Gross', value: fmtCurrency(totalGross), sub: 'before fees', color: '#15803D' },
          { label: 'Total Fees', value: fmtCurrency(totalFee), sub: 'ScanTippr revenue', color: '#B45309' },
          { label: 'Total Net', value: fmtCurrency(totalNet), sub: 'paid to employees', color: '#1D4ED8', accent: true },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '10px', padding: '18px 20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#F97316' }} />
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {card.label}
            </p>
            <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: (card as any).color ?? '#0A0A0A', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>
              {card.value}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company or period..."
              style={{ padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', width: '220px', outline: 'none' }}
            />
          </div>
          <select
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
          >
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
          >
            <option value="all">All Statuses</option>
            <option value="complete">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="not_due">Not Due</option>
          </select>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', marginLeft: 'auto' }}>
            {filtered.length} {filtered.length === 1 ? 'period' : 'periods'}
          </p>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Period', 'Company', 'Employees', 'Gross', 'Fee', 'Net Payout', 'Status', ''].map(h => (
                <th key={h} style={{
                  padding: '10px 24px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 600, color: '#9CA3AF',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  borderBottom: '1px solid #F3F4F6',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  No payout periods found.
                </td>
              </tr>
            ) : filtered.map((p, i) => {
              const s = statusStyle(p.net_payout_status)
              const isExpanded = expanded === p.id
              const items = p.payout_line_items ?? []
              return (
                <>
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #F9FAFB', cursor: items.length > 0 ? 'pointer' : 'default' }}
                    onClick={() => items.length > 0 && setExpanded(isExpanded ? null : p.id)}
                  >
                    <td style={{ padding: '14px 24px', fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>
                      {p.period_month}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <Link
                        href={`/admin/companies/${p.company_id}?tab=payouts`}
                        onClick={e => e.stopPropagation()}
                        style={{ textDecoration: 'none', fontSize: '13px', color: '#374151', fontWeight: 500 }}
                      >
                        {p.companyName}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>
                      {p.employeeCount}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCurrency(p.gross)}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCurrency(p.fee)}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCurrency(p.net)}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                        fontSize: '11.5px', fontWeight: 600,
                        background: s.bg, color: s.color,
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '12px', color: '#9CA3AF' }}>
                      {items.length > 0 && (isExpanded ? '▲' : '▼')}
                    </td>
                  </tr>

                  {/* Expanded line items */}
                  {isExpanded && items.length > 0 && (
                    <tr key={`${p.id}-expanded`} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td colSpan={8} style={{ padding: '0 24px 16px 48px', background: '#FAFAFA' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                          <thead>
                            <tr>
                              {['Employee', 'Gross', 'Fee', 'Net'].map(h => (
                                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((li: any) => (
                              <tr key={li.id}>
                                <td style={{ padding: '7px 12px', color: '#374151', fontWeight: 500 }}>
                                  {li.guard_first_name ?? ''} {li.guard_last_name ?? ''}
                                </td>
                                <td style={{ padding: '7px 12px', color: '#15803D', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(li.gross_amount ?? 0)}</td>
                                <td style={{ padding: '7px 12px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(li.fee_amount ?? 0)}</td>
                                <td style={{ padding: '7px 12px', color: '#1D4ED8', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(li.net_amount ?? 0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>

          {/* Totals footer */}
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ background: '#FAFAFA', borderTop: '2px solid #E5E7EB' }}>
                <td colSpan={3} style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>
                  Totals ({filtered.length} periods)
                </td>
                <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalGross)}</td>
                <td style={{ padding: '13px 24px', fontSize: '13px', fontWeight: 700, color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalFee)}</td>
                <td style={{ padding: '13px 24px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalNet)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
