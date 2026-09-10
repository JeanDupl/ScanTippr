'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  QrCode,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Employees', icon: Users, href: '/dashboard/employees' },
  { name: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  { name: 'QR Cards', icon: QrCode, href: '/dashboard/qr-cards' },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/payments' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

interface SidebarProps {
  mode?: 'light' | 'dark'
  sidebarBg?: string
  sidebarText?: string
}

export default function Sidebar({ mode = 'light', sidebarBg, sidebarText }: SidebarProps) {
  const pathname = usePathname()
  const isDark = mode === 'dark'
  const customBg = sidebarBg
  const customText = sidebarText

  return (
    <aside
      className="w-64 flex flex-col justify-between h-screen sticky top-0 border-r transition-colors"
      style={{
        backgroundColor: customBg ?? (isDark ? '#18181B' : '#FFFFFF'),
        borderColor: isDark ? '#27272A' : '#E4E4E7',
      }}
    >
      <div>
        <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: isDark ? '#27272A' : '#E4E4E7' }}>
            <img src="/Icon.png" alt="ScanTippr" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <h2 className="font-bold leading-tight" style={{ color: customText ?? (isDark ? '#FFFFFF' : '#18181B') }}>
              ScanTippr
            </h2>
            <p className="text-xs" style={{ color: customText ? `${customText}99` : (isDark ? '#71717A' : '#71717A') }}>
              Business Portal
            </p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150"
                style={{
                  backgroundColor: isActive ? 'var(--brand-primary, #FF5A00)' : 'transparent',
                  color: isActive ? '#FFFFFF' : (customText ?? (isDark ? '#A1A1AA' : '#71717A')),
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? '#FFFFFF' : (customText ? `${customText}99` : (isDark ? '#71717A' : '#A1A1AA')) }}
                />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
        <form action="/api/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
            style={{ color: customText ? `${customText}99` : (isDark ? '#71717A' : '#71717A') }}
          >
            <LogOut className="w-5 h-5" style={{ color: customText ? `${customText}99` : (isDark ? '#71717A' : '#71717A') }} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}