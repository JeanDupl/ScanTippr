'use client'
import { useState, useMemo } from 'react'

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const statusStyle = (status: string) => {
  if (status === 'complete') return { bg: '#F0FDF4', color: '#15803D', label: 'Complete' }
  if (status === 'failed') return { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' }
  return { bg: '#FFFBEB', color: '#B45309', label: status ?? 'Pending' }
}

export default function TransactionsClient({ transactions, guards, companies }: { transactions: any[], guards: any[], companies: any[] }) {
  const today = new Date().toISOString().split('T')[0]
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [from, setFrom] = useState(firstOfMonth)
  const [to, setTo] = useState(today)
  const [companyFilter, setCompanyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const guardName = (id: string) => {
    const g = guards.find(g => g.id === id)
    return g ? `${g.first_name} ${g.last_name}` : '—'
  }
  const companyName = (id: string) => companies.find(c => c.id === id)?.name ?? '—'

  const filtered = useMemo(() => transactions.filter(tx => {
    const date = tx.created_at.split('T')[0]
    const inRange = date >= from && date <= to
    const inCompany = companyFilter === 'all' || tx.company_id === companyFilter
    const inStatus = statusFilter === 'all' || tx.payment_status === statusFilter
    const name = guardName(tx.guard_id).toLowerCase()
    const inSearch = !search || name.includes(search.toLowerCase()) || companyName(tx.company_id).toLowerCase().includes(search.toLowerCase())
    return inRange && inCompany && inStatus && inSearch
  }), [transactions, from, to, companyFilter, statusFilter, search])

  const total = filtered.filter(tx => tx.payment_status === 'complete').reduce((s, tx) => s + (tx.amount ?? 0), 0)

  const exportCSV = () => {
    const rows = [
      ['Date', 'Employee', 'Company', 'Amount', 'Reference', 'Status'],
      ...filtered.map(tx => [
        new Date(tx.created_at).toLocaleDateString('en-ZA'),
        guardName(tx.guard_id),
        companyName(tx.company_id),
        tx.amount.toFixed(2),
        tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '',
        tx.payment_status ?? '',
      ]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `transactions-${from}-to-${to}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payments</p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>Transactions</h1>
        </div>
        <button onClick={exportCSV} style={{ padding: '9px 20px', background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          Export CSV
        </button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        {[
          { label: 'Filtered Transactions', value: filtered.length },
          { label: 'Completed Amount', value: fmtCurrency(total) },
          { label: 'Completed Count', value: filtered.filter(tx => tx.payment_status === 'complete').length },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '10px', padding: '14px 20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', minWidth: '160px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {/* Filters */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', width: '200px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
          </div>
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="all">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', marginLeft: 'auto' }}>{filtered.length} results</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Date', 'Employee', 'Company', 'Amount', 'Reference', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No transactions match the current filters.</td></tr>
            ) : filtered.map((tx, i) => {
              const s = statusStyle(tx.payment_status)
              return (
                <tr key={tx.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                  <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6B7280', fontVariantNumeric: 'tabular-nums' }}>{new Date(tx.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13.5px', fontWeight: 500, color: '#111827' }}>{guardName(tx.guard_id)}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6B7280' }}>{companyName(tx.company_id)}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(tx.amount)}</td>
                  <td style={{ padding: '12px 20px', fontSize: '11.5px', color: '#9CA3AF', fontFamily: 'monospace' }}>{tx.ozow_payment_id ?? tx._deprecated_paystack_reference ?? '—'}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
