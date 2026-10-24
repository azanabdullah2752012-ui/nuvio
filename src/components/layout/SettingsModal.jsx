import React, { useState } from 'react';
import { Download, Upload, Check, X, Shield, Sliders } from 'lucide-react';
import { journalStorage, ACCENT_PRESETS } from '../../services/journalStorage';

const SettingsModal = ({ isOpen, onClose, accentColor, onColorChange }) => {
  const [customHex, setCustomHex] = useState(accentColor);
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Journal Settings</h3>
            <p className="text-xs text-[var(--text-muted)]">Theme customization & private local backup</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent Color Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block">
            Accent Colour (Default: #024899)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => {
                  onColorChange(preset.hex);
                  setCustomHex(preset.hex);
                }}
                className="flex items-center gap-2 p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-medium)] transition-all text-xs text-[var(--text-primary)]"
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
              onChange={(e) => {
                onColorChange(e.target.value);
                setCustomHex(e.target.value);
              }}
              className="w-8 h-8 rounded-lg bg-transparent border border-[var(--border-subtle)] cursor-pointer"
            />
            <input
              type="text"
              value={customHex}
              onChange={(e) => {
                setCustomHex(e.target.value);
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                  onColorChange(e.target.value);
                }
              }}
              placeholder="#024899"
              className="flex-1 px-3 py-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Local Backup Section */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Local Data & Privacy
            </h4>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Everything is stored strictly on your device. Export a JSON backup anytime.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Export Backup</span>
            </button>

            <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
