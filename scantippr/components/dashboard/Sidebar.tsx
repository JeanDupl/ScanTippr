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
}

export default function Sidebar({ mode = 'light' }: SidebarProps) {
  const pathname = usePathname()
  const isDark = mode === 'dark'

  return (
    <aside
      className={`w-64 flex flex-col justify-between h-screen sticky top-0 border-r transition-colors ${
        isDark
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-zinc-200'
      }`}
    >
      <div>
        <div className={`p-6 border-b flex items-center gap-3 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <h2 className={`font-bold leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              ScanTippr
            </h2>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? isDark
                      ? 'bg-brand text-white font-semibold'
                      : 'bg-brand-light text-brand font-semibold'
                    : isDark
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? isDark ? 'text-white' : 'text-brand'
                      : isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
              isDark
                ? 'text-zinc-400 hover:text-red-400 hover:bg-red-950/40'
                : 'text-zinc-500 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className={`w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}