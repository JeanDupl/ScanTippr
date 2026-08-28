'use client'
import { useState } from 'react'
import Link from 'next/link'

type Company = {
  id: string
  name: string
  logo_url: string | null
  created_at: string
  activeEmployees: number
  totalEmployees: number
  totalDonations: number
  thisMonth: number
}

const fmtCurrency = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CompaniesClient({ companies }: { companies: Company[] }) {
  const [search, setSearch] = useState('')

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '36px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Management
          </p>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.4px' }}>
            Companies
          </h1>
        </div>
        <Link href="/admin/add-company" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '9px 20px',
            background: '#F97316', color: '#fff',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            boxShadow: '0 1px 4px rgba(249,115,22,0.3)', cursor: 'pointer',
          }}>
            + Add Company
          </div>
        </Link>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        {[
          { label: 'Total Companies', value: companies.length },
          { label: 'Total Employees', value: companies.reduce((s, c) => s + c.totalEmployees, 0) },
          { label: 'Total Donations', value: fmtCurrency(companies.reduce((s, c) => s + c.totalDonations, 0)) },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: '10px', padding: '14px 20px',
            border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            minWidth: '160px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search + table */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: '1px solid #E5E7EB', borderRadius: '8px',
                fontSize: '13px', color: '#111827', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
            {filtered.length} {filtered.length === 1 ? 'company' : 'companies'}
          </p>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Company', 'Employees', 'Total Donations', 'This Month', 'Status', 'Actions'].map(h => (
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
                <td colSpan={6} style={{ padding: '56px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  {search ? `No companies matching "${search}"` : 'No companies yet. Add your first company to get started.'}
                </td>
              </tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #F3F4F6' }} />
                    ) : (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '6px',
                        background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: '#9CA3AF',
                      }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#111827' }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#9CA3AF' }}>
                        Since {new Date(c.created_at).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 24px', fontSize: '13px', color: '#374151' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{c.activeEmployees}</span>
                  {c.totalEmployees !== c.activeEmployees && (
                    <span style={{ color: '#9CA3AF' }}> / {c.totalEmployees}</span>
                  )}
                  <span style={{ color: '#9CA3AF', fontSize: '12px' }}> active</span>
                </td>
                <td style={{ padding: '14px 24px', fontSize: '13.5px', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtCurrency(c.totalDonations)}
                </td>
                <td style={{ padding: '14px 24px', fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtCurrency(c.thisMonth)}
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '11.5px', fontWeight: 600,
                    background: '#F0FDF4', color: '#15803D',
                  }}>
                    Active
                  </span>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/companies/${c.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        padding: '6px 14px',
                        background: '#F97316', color: '#fff',
                        borderRadius: '7px', fontSize: '12.5px', fontWeight: 600,
                        cursor: 'pointer',
                      }}>
                        View
                      </div>
                    </Link>
                    <Link href={`/admin/companies/${c.id}?tab=settings`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        padding: '6px 14px',
                        background: '#F9FAFB', color: '#6B7280',
                        border: '1px solid #E5E7EB',
                        borderRadius: '7px', fontSize: '12.5px', fontWeight: 500,
                        cursor: 'pointer',
                      }}>
                        Edit
                      </div>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
