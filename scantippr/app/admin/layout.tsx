'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_GROUPS = [
  {
    heading: null,
    items: [{ label: 'Dashboard', href: '/admin', exact: true, icon: DashboardIcon }],
  },
  {
    heading: 'Management',
    items: [
      { label: 'Companies', href: '/admin/companies', exact: false, icon: CompaniesIcon },
      { label: 'Employees', href: '/admin/employees', exact: false, icon: EmployeesIcon },
    ],
  },
  {
    heading: 'Payments',
    items: [
      { label: 'Transactions', href: '/admin/transactions', exact: false, icon: TransactionsIcon },
      { label: 'Payouts', href: '/admin/payouts', exact: false, icon: PayoutsIcon },
    ],
  },
  {
    heading: 'Reporting',
    items: [
      { label: 'Reports', href: '/admin/reports', exact: false, icon: ReportsIcon },
    ],
  },
]

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}
function CompaniesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function EmployeesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function TransactionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  )
}
function PayoutsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  )
}
function ReportsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: '#F4F5F7' }}>

      {/* Sidebar */}
      <aside style={{
        width: '232px',
        minWidth: '232px',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        borderRight: '1px solid #1a1a1a',
      }}>

        {/* Top orange accent bar */}
        <div style={{ height: '3px', background: '#F97316', flexShrink: 0 }} />

        {/* Wordmark */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1c1c1c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', background: '#F97316',
              borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.2px' }}>ScanTippr</div>
              <div style={{ color: '#3d3d3d', fontSize: '10px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '2px' }}>
              {group.heading && (
                <p style={{
                  color: '#2e2e2e',
                  fontSize: '10px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '16px 24px 6px',
                  margin: 0,
                }}>
                  {group.heading}
                </p>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 24px',
                      color: active ? '#fff' : '#606060',
                      background: active ? 'rgba(249,115,22,0.1)' : 'transparent',
                      borderLeft: active ? '2px solid #F97316' : '2px solid transparent',
                      fontSize: '13.5px',
                      fontWeight: active ? 500 : 400,
                      transition: 'all 0.12s ease',
                      cursor: 'pointer',
                    }}>
                      <span style={{ color: active ? '#F97316' : '#404040', flexShrink: 0 }}>
                        <Icon />
                      </span>
                      {item.label}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1c', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/admin/add-company" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '9px 16px',
              background: '#F97316', color: '#fff',
              borderRadius: '8px', fontSize: '12.5px', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '-0.1px',
            }}>
              + Add Company
            </div>
          </Link>
          <Link href="/admin/add-guard" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '9px 16px',
              background: '#1a1a1a', color: '#888',
              border: '1px solid #252525',
              borderRadius: '8px', fontSize: '12.5px', fontWeight: 500,
              cursor: 'pointer',
            }}>
              + Add Employee
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
