import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import TodayRoutine from '../components/journal/TodayRoutine';

const RoutinePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateKey, setDateKey] = useState(getTodayKey(new Date()));
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [routineType, setRoutineType] = useState(journalStorage.getRoutineType(dateKey));

  const todayKey = getTodayKey(new Date());
  const isToday = dateKey === todayKey;

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
      setRoutineType(journalStorage.getRoutineType(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    window.addEventListener('journal_theme_change', (e) => setAccentColor(journalStorage.getAccentColor()));
    return () => {
      window.removeEventListener('journal_data_update', handleUpdate);
      window.removeEventListener('journal_theme_change', (e) => setAccentColor(journalStorage.getAccentColor()));
    };
  }, [dateKey]);

  const changeDate = (days) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + days);
    setCurrentDate(nextDate);
    setDateKey(getTodayKey(nextDate));
    setRoutineType(journalStorage.getRoutineType(getTodayKey(nextDate)));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setDateKey(getTodayKey(now));
    setRoutineType(journalStorage.getRoutineType(getTodayKey(now)));
  };

  const toggleScheduleMode = () => {
    const nextType = routineType === 'weekday' ? 'weekend' : 'weekday';
    journalStorage.setRoutineTypeOverride(dateKey, nextType);
    setRoutineType(nextType);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-16">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Routine Schedule
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Built strictly around your prayer times, classes, and family rest.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Switch Weekday / Weekend */}
          <button
            onClick={toggleScheduleMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="capitalize">{routineType} Schedule</span>
          </button>

          {/* Date Picker */}
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

      {/* Routine Timeline */}
      <TodayRoutine 
        dateKey={dateKey} 
        accentColor={accentColor} 
        isFullPage={true} 
      />

      {/* Grounding Reminder */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <Heart className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          Remember: School, faith, and family time are non-negotiable foundations. Rest days and breaks are productive, never wasted time.
        </span>
      </div>
    </div>
  );
};

export default RoutinePage;
