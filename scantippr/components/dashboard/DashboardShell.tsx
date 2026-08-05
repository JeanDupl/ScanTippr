'use client'
import { useState, useCallback } from 'react'
import { Palette } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeDrawer from './ThemeDrawer'

const DEFAULT_THEME = { primary: '#FF5A00', light: '#FFF0E6' }

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState(DEFAULT_THEME)

  const updateTheme = useCallback((primary: string, light?: string) => {
    const newLight = light ?? `${primary}26`
    setTheme({ primary, light: newLight })
    document.documentElement.style.setProperty('--brand-primary', primary)
    document.documentElement.style.setProperty('--brand-primary-light', newLight)
  }, [])

  const signOut = () => {
    document.cookie = 'sb_access_token=; path=/; max-age=0'
    document.cookie = 'sb_user_id=; path=/; max-age=0'
    window.location.href = '/login'
  }

  const resetTheme = useCallback(() => {
    updateTheme(DEFAULT_THEME.primary, DEFAULT_THEME.light)
    setTheme(DEFAULT_THEME)
  }, [updateTheme])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-zinc-900">ScanTippr</h1>
<div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <Palette className="w-4 h-4" />
              Customize theme
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        <main className="flex-1 p-8">{children}</main>
      </div>
      <ThemeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentTheme={theme}
        updateTheme={updateTheme}
        resetTheme={resetTheme}
      />
    </div>
  )
}
