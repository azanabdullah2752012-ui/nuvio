import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, BookOpen, Rocket, Shield, 
  Sliders, Moon, Sun, RefreshCw, X 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const Sidebar = ({ isOpen, onClose }) => {
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
    soundEngine.playPop();
    const next = theme === 'dark' ? 'light' : 'dark';
    journalStorage.setTheme(next);
    setTheme(next);
  };

  const handleRoutineToggle = () => {
    soundEngine.playPop();
    const next = routineType === 'weekday' ? 'weekend' : 'weekday';
    journalStorage.setRoutineTypeOverride(getTodayKey(), next);
    setRoutineType(next);
  };

  // The 5 Master Pillars
  const masterHubs = [
    { 
      to: '/', 
      exact: true,
      label: 'Today Command Hub', 
      subtitle: 'Cockpit & Focus Chamber', 
      icon: Calendar 
    },
    { 
      to: '/schedule', 
      label: 'Schedule & Prayers', 
      subtitle: 'Routine & Chennai Radar', 
      icon: Clock 
    },
    { 
      to: '/academics', 
      label: 'Academic & JEE Forge', 
      subtitle: 'Goals, Study Log & Formulas', 
      icon: BookOpen 
    },
    { 
      to: '/projects', 
      label: 'Projects & Builds', 
      subtitle: 'Active Ship & Dev Log', 
      icon: Rocket 
    },
    { 
      to: '/discipline', 
      label: 'Discipline Board', 
      subtitle: '5 Standards, Rules & Reset', 
      icon: Shield 
    }
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
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col justify-between p-4 sm:p-5 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-transform duration-200 ease-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                J
              </div>
              <div>
                <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Journal OS</h1>
                <p className="text-xs text-[var(--text-muted)]">Kaiser • Class IX-C</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              window.dispatchEvent(new CustomEvent('journal_open_palette'));
            }}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">⌘</span>
              <span>Quick Actions</span>
            </span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Schedule Switcher */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium block">
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

          {/* 5 Master Hub Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 block mb-1">
              Command Hubs
            </span>
            {masterHubs.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? (location.pathname === '/' || location.pathname === '/today')
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    soundEngine.playPop();
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] font-bold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-[var(--accent-subtle)]' : 'bg-transparent'
                      }`}
                      style={isActive ? { color: accentColor } : {}}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0 ml-2" 
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Settings, Theme & Privacy Badge */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1.5 shrink-0 mt-4">
          <NavLink
            to="/settings"
            onClick={() => {
              soundEngine.playPop();
              if (onClose) onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
              <span>Settings & Privacy</span>
            </div>
          </NavLink>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="capitalize">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Toggle</span>
          </button>

          <div className="px-3 py-1.5 text-[10px] text-[var(--text-muted)] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Private Local Storage</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
