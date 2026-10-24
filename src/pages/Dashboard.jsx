import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import TodayHero from '../components/journal/TodayHero';
import TodayPriorities from '../components/journal/TodayPriorities';
import TodayRoutine from '../components/journal/TodayRoutine';
import HabitTracker from '../components/journal/HabitTracker';
import DailyReflection from '../components/journal/DailyReflection';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateKey, setDateKey] = useState(getTodayKey(new Date()));
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [refreshKey, setRefreshKey] = useState(0);

  const todayKey = getTodayKey(new Date());
  const isToday = dateKey === todayKey;

  useEffect(() => {
    const handleUpdate = () => {
      setRefreshKey(prev => prev + 1);
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
    <div className="space-y-8 text-left pb-16">
      
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

        <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateKey}</span>
        </div>
      </div>

      {/* ── STAGE (B): TODAY HERO & STAT CARDS ─────────────────────── */}
      <TodayHero dateKey={dateKey} accentColor={accentColor} />

      {/* ── 2-COLUMN BALANCED WORKSPACE ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column (7 cols): Priorities & Routine */}
        <div className="lg:col-span-7 space-y-7">
          <div id="priorities">
            <TodayPriorities dateKey={dateKey} accentColor={accentColor} />
          </div>
          <div id="routine">
            <TodayRoutine dateKey={dateKey} accentColor={accentColor} />
          </div>
        </div>

        {/* Right Column (5 cols): Habits & Reflection */}
        <div className="lg:col-span-5 space-y-7">
          <div id="habits">
            <HabitTracker dateKey={dateKey} accentColor={accentColor} />
          </div>
          <DailyReflection dateKey={dateKey} accentColor={accentColor} />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
