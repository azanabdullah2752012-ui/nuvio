import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, Flame, Target, Sparkles, 
  Award, BookOpen, Sliders, Moon, Sun, Shield, 
  RefreshCw, X, Compass, DollarSign, Type, Heart
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

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
    const next = theme === 'dark' ? 'light' : 'dark';
    journalStorage.setTheme(next);
    setTheme(next);
  };

  const handleRoutineToggle = () => {
    const next = routineType === 'weekday' ? 'weekend' : 'weekday';
    journalStorage.setRoutineTypeOverride(getTodayKey(), next);
    setRoutineType(next);
  };

  const dailyLinks = [
    { to: '/', label: 'Today Command Hub', icon: Calendar },
    { to: '/discipline', label: 'Discipline Board', icon: Shield },
    { to: '/routine', label: 'Routine Timeline', icon: Clock },
    { to: '/habits', label: 'Habit Tracker', icon: Flame },
    { to: '/prayer', label: 'Prayer & Sunnah', icon: Compass }
  ];

  const academicLinks = [
    { to: '/formulas', label: 'JEE Formula Vault', icon: BookOpen },
    { to: '/goals', label: 'Goals & Marks', icon: Target },
    { to: '/mistakes', label: 'Mistake Notebook', icon: BookOpen },
    { to: '/spelling', label: 'Spelling Precision', icon: Type }
  ];

  const studioLinks = [
    { to: '/pickle-corp', label: 'Pickle Corp Ledger', icon: DollarSign },
    { to: '/wins', label: 'Small Wins Vault', icon: Award },
    { to: '/review', label: 'Weekly Review', icon: Sparkles }
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
        {/* Top: Identity & Navigation */}
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
                <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Journal</h1>
                <p className="text-xs text-[var(--text-muted)]">Kaiser • Grade 9</p>
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

          {/* Routine Mode Switcher */}
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

          {/* Group 1: Daily Cockpit */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 block mb-1">
              Daily Cockpit
            </span>
            {dailyLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon 
                      className="w-4 h-4 shrink-0" 
                      style={isActive ? { color: accentColor } : {}}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Group 2: Academic & JEE Mastery */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 block mb-1">
              Academic & JEE Mastery
            </span>
            {academicLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon 
                      className="w-4 h-4 shrink-0" 
                      style={isActive ? { color: accentColor } : {}}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Group 3: Studio & Reviews */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 block mb-1">
              Studio & Reflection
            </span>
            {studioLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon 
                      className="w-4 h-4 shrink-0" 
                      style={isActive ? { color: accentColor } : {}}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom: Settings & Theme Toggle */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-1.5 shrink-0 mt-4">
          <NavLink
            to="/settings"
            onClick={onClose}
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
              <span className="capitalize">{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Toggle</span>
          </button>

          <div className="px-3 py-1.5 text-[10px] text-[var(--text-muted)] flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Local & Private</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
