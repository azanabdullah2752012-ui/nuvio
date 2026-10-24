import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Sliders, Download, Upload, 
  Calendar, Coffee, Moon, Sun, Check, RefreshCw 
} from 'lucide-react';
import { journalStorage, ACCENT_PRESETS, getTodayKey } from '../../services/journalStorage';

const UniversalHeader = () => {
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [showSettings, setShowSettings] = useState(false);
  const [routineType, setRoutineType] = useState(journalStorage.getRoutineType());
  const [customHex, setCustomHex] = useState(accentColor);
  const [importStatus, setImportStatus] = useState('');

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  useEffect(() => {
    journalStorage.applyAccentColor(accentColor);
  }, [accentColor]);

  useEffect(() => {
    const handleUpdate = () => {
      setRoutineType(journalStorage.getRoutineType());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    window.addEventListener('journal_theme_change', (e) => setAccentColor(e.detail));
    return () => {
      window.removeEventListener('journal_data_update', handleUpdate);
      window.removeEventListener('journal_theme_change', (e) => setAccentColor(e.detail));
    };
  }, []);

  const handleRoutineToggle = () => {
    const nextType = routineType === 'weekday' ? 'weekend' : 'weekday';
    journalStorage.setRoutineTypeOverride(getTodayKey(), nextType);
    setRoutineType(nextType);
  };

  const handleColorChange = (hex) => {
    setAccentColor(hex);
    setCustomHex(hex);
    journalStorage.setAccentColor(hex);
  };

  const handleExport = () => {
    journalStorage.exportAllData();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = journalStorage.importAllData(content);
        if (res.success) {
          setImportStatus('Data restored successfully!');
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Failed to import: ' + res.error);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-white/[0.08] bg-[#08090a]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: App Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              J
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-white">Journal</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                • Kaiser
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/[0.08] text-xs font-mono text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Right: Routine Mode Switcher + Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Weekday / Weekend Quick Toggle */}
          <button
            onClick={handleRoutineToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-xs font-mono transition-all text-zinc-300"
            title="Click to toggle between Weekday and Weekend schedule"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="capitalize">{routineType}</span>
            <RefreshCw className="w-3 h-3 text-zinc-500 hover:text-zinc-300 ml-0.5" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-zinc-400 hover:text-white transition-colors"
            title="Theme & Backup Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="bg-[#0e1013] border border-white/[0.12] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-semibold text-white">Journal Settings</h3>
                <p className="text-xs text-zinc-400">Personalize accent color and backup your data</p>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-zinc-500 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Accent Color Section */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Accent Colour (Default: #024899)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => handleColorChange(preset.hex)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-white/[0.08] bg-[#14171d] hover:border-white/[0.2] transition-all text-xs text-zinc-300"
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="truncate">{preset.name}</span>
                    {accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                      <Check className="w-3 h-3 ml-auto text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Hex Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border border-white/[0.1] cursor-pointer"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      handleColorChange(e.target.value);
                    }
                  }}
                  placeholder="#024899"
                  className="flex-1 px-3 py-1.5 bg-[#14171d] border border-white/[0.08] rounded-lg text-xs font-mono text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Backup & Data Privacy Section */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Local Data & Privacy
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    100% stored in your browser. Zero cloud, zero tracking.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-xs font-medium text-zinc-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Export Backup</span>
                </button>

                <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-xs font-medium text-zinc-200 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Import Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <div className="p-2 text-center text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  {importStatus}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalHeader;
