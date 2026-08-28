'use client'
import { useState } from 'react'
import Link from 'next/link'

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function EmployeesClient({ guards, companies }: { guards: any[], companies: any[] }) {
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = guards.filter(g => {
    const name = `${g.first_name} ${g.last_name}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) || (g.location ?? '').toLowerCase().includes(search.toLowerCase())
    const matchCompany = companyFilter === 'all' || g.company_id === companyFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? g.is_active : !g.is_active)
    return matchSearch && matchCompany && matchStatus
  })

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Management</p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>Employees</h1>
        </div>
        <Link href="/admin/add-guard" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '9px 20px', background: '#F97316', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, boxShadow: '0 1px 4px rgba(249,115,22,0.3)', cursor: 'pointer' }}>
            + Add Employee
          </div>
        </Link>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        {[
          { label: 'Total Employees', value: guards.length },
          { label: 'Active', value: guards.filter(g => g.is_active).length },
          { label: 'Total Donations', value: fmtCurrency(guards.reduce((s, g) => s + g.totalDonations, 0)) },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '10px', padding: '14px 20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', minWidth: '160px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', color: '#374151', background: '#fff', outline: 'none' }}>
            <option value="all">All Companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', color: '#374151', background: '#fff', outline: 'none' }}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{filtered.length} employees</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Employee', 'Company', 'Job Title', 'Location', 'Total Donations', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No employees found.</td></tr>
            ) : filtered.map((g, i) => (
              <tr key={g.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                <td style={{ padding: '13px 20px' }}>
                  <Link href={`/admin/employees/${g.id}`} style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A0A0A' }}>{g.first_name} {g.last_name}</span>
                  </Link>
                </td>
                <td style={{ padding: '13px 20px', fontSize: '13px', color: '#6B7280' }}>{g.companyName}</td>
                <td style={{ padding: '13px 20px', fontSize: '13px', color: '#6B7280' }}>{g.job_title || '—'}</td>
                <td style={{ padding: '13px 20px', fontSize: '13px', color: '#6B7280' }}>{g.location || '—'}</td>
                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(g.totalDonations)}</td>
                <td style={{ padding: '13px 20px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: g.is_active ? '#F0FDF4' : '#F9FAFB', color: g.is_active ? '#15803D' : '#9CA3AF' }}>
                    {g.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <Link href={`/admin/employees/${g.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'inline-block', padding: '5px 12px', background: '#F97316', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View</div>
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
