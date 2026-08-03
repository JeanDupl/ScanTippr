import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  QrCode, 
  CreditCard, 
  Settings,
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Employees', icon: Users, id: 'employees' },
  { name: 'Reports', icon: BarChart3, id: 'reports' },
  { name: 'QR Cards', icon: QrCode, id: 'qr-cards' },
  { name: 'Payments', icon: CreditCard, id: 'payments' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <h2 className="font-bold text-zinc-900 leading-tight">ScanTippr</h2>
            <p className="text-xs text-zinc-400">Business Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-light text-brand font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-zinc-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5 text-zinc-400 group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}