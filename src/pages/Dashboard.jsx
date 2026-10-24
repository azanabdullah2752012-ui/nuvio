import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Shield, Zap } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import TodayHero from '../components/journal/TodayHero';
import TodayPriorities from '../components/journal/TodayPriorities';
import HabitPunchStrip from '../components/journal/HabitPunchStrip';
import LockInTimer from '../components/journal/LockInTimer';
import EquationForge from '../components/journal/EquationForge';
import ActiveForgeCard from '../components/journal/ActiveForgeCard';
import IdeaVaultCard from '../components/journal/IdeaVaultCard';
import ScratchpadCard from '../components/journal/ScratchpadCard';
import DailyReflection from '../components/journal/DailyReflection';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateKey, setDateKey] = useState(getTodayKey(new Date()));
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  const todayKey = getTodayKey(new Date());
  const isToday = dateKey === todayKey;

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    window.addEventListener('journal_theme_change', (e) => setAccentColor(journalStorage.getAccentColor()));
    return () => {
      window.removeEventListener('journal_data_update', handleUpdate);
      window.removeEventListener('journal_theme_change', (e) => setAccentColor(journalStorage.getAccentColor()));
    };
  }, []);

  const changeDate = (days) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + days);
    setCurrentDate(nextDate);
    setDateKey(getTodayKey(nextDate));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setDateKey(getTodayKey(now));
  };

  return (
    <div className="space-y-7 text-left pb-16 max-w-7xl mx-auto">
      
      {/* ── TOP NAV / DATE CONTROLS ─────────────────────────────────── */}
      <div id="today" className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => changeDate(1)}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={jumpToToday}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              Back to Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/discipline"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-400 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Discipline Board</span>
          </Link>

          <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateKey}</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: TODAY HERO (GREETING, PROGRESS RING, NEXT UP, STATS) ── */}
      <TodayHero dateKey={dateKey} accentColor={accentColor} />

      {/* ── SECTION 2: TODAY'S 3 PRIORITIES ─────────────────────────── */}
      <TodayPriorities dateKey={dateKey} accentColor={accentColor} />

      {/* ── SECTION 3: 5-HABIT QUICK PUNCH-STRIP ─────────────────────── */}
      <HabitPunchStrip dateKey={dateKey} accentColor={accentColor} />

      {/* ── SECTION 4: LOCK-IN FOCUS CHAMBER (TIMER + AUDIO) ───────── */}
      <LockInTimer accentColor={accentColor} />

      {/* ── SECTION 5: 2-COLUMN BUILDER & MATH FORGE GRID ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (6 cols): Math Equation Forge + Scratchpad */}
        <div className="lg:col-span-6 space-y-6">
          <EquationForge accentColor={accentColor} />
          <ScratchpadCard />
        </div>

        {/* Right Column (6 cols): Active Shipping Forge + Idea Vault */}
        <div className="lg:col-span-6 space-y-6">
          <ActiveForgeCard accentColor={accentColor} />
          <IdeaVaultCard accentColor={accentColor} />
          <DailyReflection dateKey={dateKey} accentColor={accentColor} />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
