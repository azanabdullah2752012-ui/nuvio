import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, Flame, Sliders, 
  Sun, Moon, Shield, RefreshCw, X 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const Sidebar = ({ isOpen, onClose, onOpenSettings }) => {
  const [theme, setTheme] = useState(journalStorage.getTheme());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [routineType, setRoutineType] = useState(journalStorage.getRoutineType());
  const location = useLocation();

  useEffect(() => {
    journalStorage.applyTheme(theme);
    journalStorage.applyAccentColor(accentColor);
  }, [theme, accentColor]);

  useEffect(() => {
    const handleUpdate = () => {
      setTheme(journalStorage.getTheme());
      setAccentColor(journalStorage.getAccentColor());
      setRoutineType(journalStorage.getRoutineType());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    window.addEventListener('journal_theme_change', handleUpdate);
    return () => {
      window.removeEventListener('journal_data_update', handleUpdate);
      window.removeEventListener('journal_theme_change', handleUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    journalStorage.setTheme(next);
    setTheme(next);
  };

  const handleRoutineToggle = () => {
    const next = routineType === 'weekday' ? 'weekend' : 'weekday';
    journalStorage.setRoutineTypeOverride(getTodayKey(), next);
    setRoutineType(next);
  };

  const navLinks = [
    { to: '/', label: 'Today', icon: Calendar },
    { to: '/routine', label: 'Routine Schedule', icon: Clock },
    { to: '/habits', label: 'Habit Tracker', icon: Flame },
    { to: '/settings', label: 'Settings & Backup', icon: Sliders }
  ];

  return (
    <>
      {/* Mobile/iPad Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col justify-between p-5 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Identity & Navigation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                J
              </div>
              <div>
                <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Journal</h1>
                <p className="text-xs text-[var(--text-muted)]">Kaiser • Grade 9</p>
              </div>
            </div>

            {/* Close button on mobile/iPad */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Routine Mode Switcher */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium block">
                Schedule Mode
              </span>
              <span className="text-xs font-semibold capitalize text-[var(--text-primary)]">
                {routineType}
              </span>
            </div>
            <button
              onClick={handleRoutineToggle}
              className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
              title="Toggle Weekday / Weekend"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Links to Dedicated Pages */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      className="w-4 h-4" 
                      style={isActive ? { color: accentColor } : {}}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Theme Toggle & Privacy Tag */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="capitalize">{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">Toggle</span>
          </button>

          {/* Private Local Storage Badge */}
          <div className="px-3.5 py-2 text-[11px] text-[var(--text-muted)] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Local & Private</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
