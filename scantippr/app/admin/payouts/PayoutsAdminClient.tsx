'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const statusStyle = (status: string) => {
  if (status === 'complete' || status === 'paid') return { bg: '#F0FDF4', color: '#15803D', label: 'Paid' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  if (status === 'not_due') return { bg: '#F3F4F6', color: '#6B7280', label: 'Not Due' }
  if (status === 'pending') return { bg: '#FFFBEB', color: '#B45309', label: 'Pending' }
  return { bg: '#F3F4F6', color: '#6B7280', label: status ?? '—' }
}

// ── Initiate Payout Panel ─────────────────────────────────────────────────────

type InitiateState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'success'; summary: any }

function InitiatePayoutPanel({ companies }: { companies: any[] }) {
  const now = new Date()
  // Default to previous month (the natural payout period)
  const defaultMonth = now.getMonth() === 0 ? 12 : now.getMonth()
  const defaultYear  = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

  const [companyId, setCompanyId]         = useState('')
  const [periodMonth, setPeriodMonth]     = useState(defaultMonth)
  const [periodYear, setPeriodYear]       = useState(defaultYear)
  const [feeDisposalMode, setFeeDisposal] = useState('payout_to_scantippr')
  const [state, setState]                 = useState<InitiateState>({ phase: 'idle' })
  const [confirmed, setConfirmed]         = useState(false)

  const yearOptions = Array.from({ length: 4 }, (_, i) => now.getFullYear() - i)

  const canSubmit = companyId && confirmed && state.phase !== 'loading'

  async function handleInitiate() {
    if (!canSubmit) return
    setState({ phase: 'loading' })
    try {
      const res = await fetch('/api/admin/payouts/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, periodMonth, periodYear, feeDisposalMode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setState({ phase: 'error', message: data.error ?? 'Unknown error' })
        setConfirmed(false)
      } else {
        setState({ phase: 'success', summary: data.summary })
        setConfirmed(false)
        // Reset form
        setCompanyId('')
      }
    } catch (err) {
      setState({ phase: 'error', message: 'Network error — please try again' })
      setConfirmed(false)
    }
  }

  const selectedCompany = companies.find(c => c.id === companyId)

  const selectStyle: React.CSSProperties = {
    padding: '9px 12px', border: '1px solid #E5E7EB',
    borderRadius: '8px', fontSize: '13px', background: '#fff',
    outline: 'none', color: '#111827', width: '100%',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11.5px', fontWeight: 600,
    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em',
    marginBottom: '6px',
  }

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: '24px',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px', borderBottom: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0A0A0A' }}>Initiate Payout</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>Manually trigger a payout run for a company</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '16px', alignItems: 'end' }}>

          {/* Company */}
          <div>
            <label style={labelStyle}>Company</label>
            <select value={companyId} onChange={e => { setCompanyId(e.target.value); setState({ phase: 'idle' }); setConfirmed(false) }} style={selectStyle}>
              <option value="">Select a company…</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Month */}
          <div>
            <label style={labelStyle}>Month</label>
            <select value={periodMonth} onChange={e => { setPeriodMonth(Number(e.target.value)); setState({ phase: 'idle' }); setConfirmed(false) }} style={selectStyle}>
              {MONTH_NAMES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>

          {/* Year */}
          <div>
            <label style={labelStyle}>Year</label>
            <select value={periodYear} onChange={e => { setPeriodYear(Number(e.target.value)); setState({ phase: 'idle' }); setConfirmed(false) }} style={selectStyle}>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Fee Disposal */}
          <div>
            <label style={labelStyle}>Fee Disposal</label>
            <select value={feeDisposalMode} onChange={e => { setFeeDisposal(e.target.value); setState({ phase: 'idle' }); setConfirmed(false) }} style={selectStyle}>
              <option value="payout_to_scantippr">Pay out to ScanTippr</option>
              <option value="remain_in_float">Remain in float</option>
              <option value="pending_decision">Pending decision</option>
            </select>
          </div>
        </div>

        {/* Confirmation + button row */}
        {companyId && (
          <div style={{
            marginTop: '16px', padding: '14px 16px',
            background: '#FFFBF5', borderRadius: '8px', border: '1px solid #FED7AA',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#F97316', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.4 }}>
                I confirm: run payout for <strong>{selectedCompany?.name}</strong> —{' '}
                <strong>{MONTH_NAMES[periodMonth - 1]} {periodYear}</strong>{' '}
                (<strong>{feeDisposalMode === 'payout_to_scantippr' ? 'fee paid to ScanTippr' : feeDisposalMode === 'remain_in_float' ? 'fee stays in float' : 'fee decision pending'}</strong>).
                This cannot be undone.
              </span>
            </label>

            <button
              onClick={handleInitiate}
              disabled={!canSubmit}
              style={{
                padding: '9px 20px', borderRadius: '8px', border: 'none',
                background: canSubmit ? '#F97316' : '#E5E7EB',
                color: canSubmit ? '#fff' : '#9CA3AF',
                fontSize: '13px', fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap', transition: 'background 0.15s',
                minWidth: '140px',
              }}
            >
              {state.phase === 'loading' ? 'Initiating…' : 'Initiate Payout'}
            </button>
          </div>
        )}

        {/* Result feedback */}
        {state.phase === 'error' && (
          <div style={{
            marginTop: '12px', padding: '12px 16px', borderRadius: '8px',
            background: '#FEF2F2', border: '1px solid #FECACA',
            fontSize: '13px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {state.message}
          </div>
        )}

        {state.phase === 'success' && (
          <div style={{
            marginTop: '12px', padding: '14px 16px', borderRadius: '8px',
            background: '#F0FDF4', border: '1px solid #BBF7D0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803D' }}>
                Payout initiated — {state.summary.companyName} · {MONTH_NAMES[(state.summary.periodMonth ?? 1) - 1]} {state.summary.periodYear}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Employees', value: state.summary.employeeCount },
                { label: 'Gross', value: fmtCurrency(state.summary.totalGross ?? 0) },
                { label: 'Fee', value: fmtCurrency(state.summary.totalFee ?? 0) },
                { label: 'Net', value: fmtCurrency(state.summary.totalNet ?? 0) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ margin: '0 0 2px', fontSize: '10.5px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11.5px', color: '#6B7280' }}>
              Refresh the page to see the new period in the table below.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main client component ─────────────────────────────────────────────────────

export default function PayoutsAdminClient({
  periods,
  companies,
  availableYears,
}: {
  periods: any[]
  companies: any[]
  availableYears: number[]
}) {
  const [companyFilter, setCompanyFilter] = useState('all')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [monthFilter, setMonthFilter]     = useState('all')
  const [yearFilter, setYearFilter]       = useState('all')
  const [search, setSearch]               = useState('')
  const [expanded, setExpanded]           = useState<string | null>(null)

  const filtered = useMemo(() => periods.filter(p => {
    const inCompany = companyFilter === 'all' || p.recipient_id === companyFilter
    const inStatus  = statusFilter === 'all'  || p.net_payout_status === statusFilter
    const inMonth   = monthFilter === 'all'   || String(p.period_month) === monthFilter
    const inYear    = yearFilter === 'all'    || String(p.period_year) === yearFilter
    const inSearch  = !search || p.companyName.toLowerCase().includes(search.toLowerCase()) || p.periodLabel.toLowerCase().includes(search.toLowerCase())
    return inCompany && inStatus && inMonth && inYear && inSearch
  }), [periods, companyFilter, statusFilter, monthFilter, yearFilter, search])

  const totalGross = filtered.reduce((s, p) => s + p.gross, 0)
  const totalFee   = filtered.reduce((s, p) => s + p.fee, 0)
  const totalNet   = filtered.reduce((s, p) => s + p.net, 0)

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #E5E7EB',
    borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none',
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payments</p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>Payouts</h1>
        </div>
      </div>

      {/* Initiate Payout panel */}
      <InitiatePayoutPanel companies={companies} />

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Payout Periods', value: filtered.length,         sub: 'matching filters',    color: '#0A0A0A' },
          { label: 'Total Gross',    value: fmtCurrency(totalGross), sub: 'before fees',          color: '#15803D' },
          { label: 'Total Fees',     value: fmtCurrency(totalFee),   sub: 'ScanTippr revenue',    color: '#B45309' },
          { label: 'Total Net',      value: fmtCurrency(totalNet),   sub: 'paid to employees',    color: '#1D4ED8' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '10px', padding: '18px 20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#F97316' }} />
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
            <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: card.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>{card.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Payout periods table */}
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
      }}>
        {/* Filter bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ ...selectStyle, paddingLeft: '32px', width: '180px' }} />
          </div>
          <select value={monthFilter}   onChange={e => setMonthFilter(e.target.value)}   style={selectStyle}>
            <option value="all">All Months</option>
            {MONTH_NAMES.map((m, i) => <option key={i + 1} value={String(i + 1)}>{m}</option>)}
          </select>
          <select value={yearFilter}    onChange={e => setYearFilter(e.target.value)}    style={selectStyle}>
            <option value="all">All Years</option>
            {availableYears.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter}  onChange={e => setStatusFilter(e.target.value)}  style={selectStyle}>
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
              {['Period', 'Company', 'Type', 'Employees', 'Gross', 'Fee', 'Net Payout', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  No payout periods match the current filters.
                </td>
              </tr>
            ) : filtered.map((p) => {
              const s          = statusStyle(p.net_payout_status)
              const isExpanded = expanded === p.id
              const items      = p.payout_line_items ?? []
              return (
                <>
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #F9FAFB', cursor: items.length > 0 ? 'pointer' : 'default', background: isExpanded ? '#FFFBF5' : 'transparent' }}
                    onClick={() => items.length > 0 && setExpanded(isExpanded ? null : p.id)}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{p.periodLabel}</td>
                    <td style={{ padding: '14px 20px' }}>
                      {p.companyId ? (
                        <Link href={`/admin/companies/${p.companyId}?tab=payouts`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none', fontSize: '13px', color: '#374151', fontWeight: 500 }}>{p.companyName}</Link>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{p.companyName}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: p.recipient_type === 'company' ? '#EFF6FF' : '#F5F3FF', color: p.recipient_type === 'company' ? '#1D4ED8' : '#6D28D9' }}>
                        {p.recipient_type === 'company' ? 'Company' : 'Individual'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{p.employeeCount}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(p.gross)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(p.fee)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(p.net)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#9CA3AF' }}>{items.length > 0 && (isExpanded ? '▲' : '▼')}</td>
                  </tr>
                  {isExpanded && items.length > 0 && (
                    <tr key={`${p.id}-expanded`} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td colSpan={9} style={{ padding: '0 20px 16px 56px', background: '#FFFBF5' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                          <thead>
                            <tr>{['Employee', 'Gross', 'Fee', 'Net'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#9CA3AF', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {items.map((li: any) => (
                              <tr key={li.id}>
                                <td style={{ padding: '7px 12px', color: '#374151', fontWeight: 500 }}>{li.guard_first_name ?? ''} {li.guard_last_name ?? ''}</td>
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
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ background: '#FAFAFA', borderTop: '2px solid #E5E7EB' }}>
                <td colSpan={4} style={{ padding: '13px 20px', fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>Totals ({filtered.length} periods)</td>
                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalGross)}</td>
                <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: 700, color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalFee)}</td>
                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: 700, color: '#1D4ED8', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(totalNet)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
