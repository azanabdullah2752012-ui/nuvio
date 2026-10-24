import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Sun, Moon, Sliders } from 'lucide-react';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { journalStorage } from '../../services/journalStorage';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(journalStorage.getTheme());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  useEffect(() => {
    journalStorage.applyTheme(theme);
    journalStorage.applyAccentColor(accentColor);
  }, [theme, accentColor]);

  useEffect(() => {
    const handleUpdate = () => {
      setTheme(journalStorage.getTheme());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_theme_change', handleUpdate);
    window.addEventListener('journal_data_update', handleUpdate);
    return () => {
      window.removeEventListener('journal_theme_change', handleUpdate);
      window.removeEventListener('journal_data_update', handleUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    journalStorage.setTheme(next);
    setTheme(next);
  };

  const handleColorChange = (hex) => {
    journalStorage.setAccentColor(hex);
    setAccentColor(hex);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex font-sans antialiased">
      {/* Left Sidebar (Desktop fixed, Mobile off-canvas) */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile / Tablet Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: accentColor }}
              >
                J
              </div>
              <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">
                Journal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              title="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Primary Page Canvas (Generous width, full responsiveness) */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
          <Outlet />
        </main>
      </div>

      {/* Global Settings & Backup Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        accentColor={accentColor}
        onColorChange={handleColorChange}
      />
    </div>
  );
};

export default Layout;
