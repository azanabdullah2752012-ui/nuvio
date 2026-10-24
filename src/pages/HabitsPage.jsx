import React, { useState, useEffect } from 'react';
import { Flame, Coffee, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import HabitTracker from '../components/journal/HabitTracker';

const HabitsPage = () => {
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
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-16">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Focus on continuous consistency. A missed day is just an invitation to get back on track.
          </p>
        </div>

        {/* Date Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-[var(--border-subtle)] rounded-xl p-1 bg-[var(--bg-surface-elevated)]">
            <button
              onClick={() => changeDate(-1)}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[var(--text-primary)] px-2">
              {dateKey}
            </span>
            <button
              onClick={() => changeDate(1)}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={jumpToToday}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Habit Tracker Component */}
      <HabitTracker 
        dateKey={dateKey} 
        accentColor={accentColor} 
        isFullPage={true} 
      />
    </div>
  );
};

export default HabitsPage;
