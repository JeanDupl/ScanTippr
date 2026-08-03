import React from 'react';
import { Palette, X, RotateCcw } from 'lucide-react';

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: { primary: string; light: string };
  updateTheme: (primary: string, light?: string) => void;
  resetTheme: () => void;
}

export default function ThemeDrawer({ 
  isOpen, 
  onClose, 
  currentTheme, 
  updateTheme, 
  resetTheme 
}: ThemeDrawerProps) {
  if (!isOpen) return null;

  const presets = [
    { name: 'ScanTippr Orange', primary: '#FF5A00', light: '#FFF0E6' },
    { name: 'Ocean Blue', primary: '#0A4A87', light: '#EBF3FA' },
    { name: 'Forest Green', primary: '#059669', light: '#ECFDF5' },
    { name: 'Royal Purple', primary: '#7C3AED', light: '#F5F3FF' },
    { name: 'Charcoal Dark', primary: '#18181B', light: '#F4F4F5' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-zinc-200 shadow-2xl p-6 z-50 flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
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
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-zinc-100">
        <button 
          onClick={onClose} 
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm hover:opacity-90 transition-opacity"
        >
          Save Theme
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