import React, { useState, useEffect } from 'react';
import { Sliders, Download, Upload, Check, Moon, Sun, Shield, RefreshCw } from 'lucide-react';
import { journalStorage, ACCENT_PRESETS } from '../services/journalStorage';

const SettingsPage = () => {
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [theme, setTheme] = useState(journalStorage.getTheme());
  const [customHex, setCustomHex] = useState(accentColor);
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    journalStorage.applyAccentColor(accentColor);
    journalStorage.applyTheme(theme);
  }, [accentColor, theme]);

  const handleColorChange = (hex) => {
    setAccentColor(hex);
    setCustomHex(hex);
    journalStorage.setAccentColor(hex);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    journalStorage.setTheme(newTheme);
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
    <div className="space-y-8 text-left max-w-3xl mx-auto pb-16">
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Settings & Privacy
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Customize your appearance tokens and manage your local data backups.
        </p>
      </div>

      {/* Theme Preference */}
      <div className="journal-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Theme Mode
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)]'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Dark Theme (Default)</span>
          </button>

          <button
            onClick={() => handleThemeChange('light')}
            className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-medium transition-all ${
              theme === 'light'
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)]'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme</span>
          </button>
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="journal-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Accent Colour
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Default: #024899 (Kaiser Sapphire). Changes rings, checkboxes, and active tabs instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => handleColorChange(preset.hex)}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-medium)] transition-all text-xs font-medium text-[var(--text-primary)]"
            >
              <span 
                className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: preset.hex }}
              />
              <span className="truncate">{preset.name}</span>
              {accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                <Check className="w-3.5 h-3.5 ml-auto text-emerald-400 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Hex Input */}
        <div className="flex items-center gap-3 pt-2 max-w-sm">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-10 h-10 rounded-xl bg-transparent border border-[var(--border-subtle)] cursor-pointer"
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
            className="flex-1 px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Local Storage & Backup */}
      <div className="journal-card p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
            <Shield className="w-4 h-4" />
            100% Client-Side Privacy Guarantee
          </div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Backup & Data Export
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Zero cloud accounts, zero tracking. All your habit records and routine entries are saved strictly in your device's browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors"
          >
            <Download className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Download JSON Backup</span>
          </button>

          <label className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Restore from JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-3 text-center text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
