'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ThemeDrawer from '@/components/dashboard/ThemeDrawer';
import { 
  Palette, 
  Users, 
  QrCode, 
  Download, 
  Printer, 
  ArrowUpRight 
} from 'lucide-react';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  
  // Theme state with correct HEX formatting (#FF5A00)
  const [theme, setTheme] = useState({
    primary: '#FF5A00',
    light: '#FFF0E6'
  });

  const handleUpdateTheme = (primaryColor: string, lightColor?: string) => {
    const computedLight = lightColor || `${primaryColor}15`;
    const updated = { primary: primaryColor, light: computedLight };
    setTheme(updated);

    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand-primary', primaryColor);
      document.documentElement.style.setProperty('--brand-primary-light', computedLight);
    }
  };

  const handleResetTheme = () => {
    handleUpdateTheme('#FF5A00', '#FFF0E6');
  };

  return (
    <div className="flex min-h-screen bg-zinc-100/60 font-sans text-zinc-900">
      {/* 1. Sidebar Component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Welcome back, Security Plus 👋</h1>
            <p className="text-sm text-zinc-500">Here is what is happening with your tips today.</p>
          </div>

          <button
            onClick={() => setIsThemeOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm font-semibold text-zinc-700 hover:border-zinc-300 transition-all shadow-sm cursor-pointer"
          >
            <Palette className="w-4 h-4 text-brand" />
            <span>Customize Theme</span>
          </button>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Tips (Month)</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +12.5% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900">R24,850.00</h2>
            <p className="text-xs text-zinc-400 mt-2">342 total transactions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tips Today</span>
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900">R1,340.00</h2>
            <p className="text-xs text-zinc-400 mt-2">17 tips received today</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Employees</span>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900">48</h2>
            <p className="text-xs text-zinc-400 mt-2">2 currently offline</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Scans</span>
              <QrCode className="w-4 h-4 text-zinc-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-900">1,523</h2>
            <p className="text-xs text-zinc-400 mt-2">Across all active QR codes</p>
          </div>
        </div>

        {/* Performers & QR Code Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-900 text-lg">Top Performers This Month</h3>
              <button className="text-xs font-semibold text-brand hover:underline">View All Employees →</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand font-bold flex items-center justify-center text-sm">
                    TM
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Themba Mokoena</h4>
                    <p className="text-xs text-zinc-500">Security Officer</p>
                  </div>
                </div>
                <span className="font-extrabold text-zinc-900">R920</span>
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand font-bold flex items-center justify-center text-sm">
                    LN
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Lerato Nkosi</h4>
                    <p className="text-xs text-zinc-500">Gate Guard</p>
                  </div>
                </div>
                <span className="font-extrabold text-zinc-900">R740</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-zinc-900 text-lg mb-1">Company Master QR</h3>
              <p className="text-xs text-zinc-500 mb-6">Scan to tip the team directly</p>
              
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-mono text-xs">
                  [ QR CODE ]
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-2.5 rounded-xl font-semibold text-xs shadow-sm hover:opacity-90 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition-all">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Theme Drawer Component */}
      <ThemeDrawer
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        currentTheme={theme}
        updateTheme={handleUpdateTheme}
        resetTheme={handleResetTheme}
      />
    </div>
  );
}