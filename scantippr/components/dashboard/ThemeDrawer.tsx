import React, { useState } from 'react';
import { Palette, X, RotateCcw, Sun, Moon, Loader2 } from 'lucide-react';

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentTheme: { primary: string; light: string };
  sidebarMode: 'light' | 'dark';
  updateTheme: (primary: string, light?: string) => void;
  updateSidebarMode: (mode: 'light' | 'dark') => void;
  resetTheme: () => void;
}

export default function ThemeDrawer({
  isOpen,
  onClose,
  companyId,
  currentTheme,
  sidebarMode,
  updateTheme,
  updateSidebarMode,
  resetTheme,
}: ThemeDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    { name: 'ScanTippr Orange', primary: '#FF5A00', light: '#FFF0E6' },
    { name: 'Ocean Blue', primary: '#0A4A87', light: '#EBF3FA' },
    { name: 'Forest Green', primary: '#059669', light: '#ECFDF5' },
    { name: 'Royal Purple', primary: '#7C3AED', light: '#F5F3FF' },
    { name: 'Charcoal Dark', primary: '#18181B', light: '#F4F4F5' },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/save-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          brand_primary: currentTheme.primary,
          brand_light: currentTheme.light,
          sidebar_mode: sidebarMode,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save theme');

      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-zinc-200 shadow-2xl p-6 z-50 flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-zinc-900">Customize Theme</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Presets */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateTheme(preset.primary, preset.light)}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: preset.primary }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Custom Hex Color Picker */}
        <div className="mb-6 space-y-4">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Custom Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentTheme.primary}
              onChange={(e) => updateTheme(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-200"
            />
            <input
              type="text"
              value={currentTheme.primary}
              onChange={(e) => updateTheme(e.target.value)}
              className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg font-mono text-sm text-zinc-800"
            />
          </div>
        </div>

        {/* Light / Dark Sidebar Toggle */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
            Sidebar Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSidebarMode('light')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                sidebarMode === 'light'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button
              onClick={() => updateSidebarMode('dark')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                sidebarMode === 'dark'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-4">{error}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-zinc-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
        <button
          onClick={resetTheme}
          className="w-full flex items-center justify-center gap-2 text-zinc-500 py-2 rounded-xl text-xs hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
        </button>
      </div>
    </div>
  );
}