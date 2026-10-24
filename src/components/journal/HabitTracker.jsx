import React, { useState, useEffect } from 'react';
import { 
  Flame, Check, Plus, Coffee, Sparkles, 
  Trash2, X, ChevronRight, Calendar 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const CATEGORY_DOT_COLORS = {
  Faith: 'var(--cat-faith)',
  Academics: 'var(--cat-academics)',
  Health: 'var(--cat-health)',
  Growth: 'var(--cat-growth)',
  General: 'var(--cat-routine)'
};

const HabitTracker = ({ dateKey = getTodayKey(), accentColor, isFullPage = false }) => {
  const [habits, setHabits] = useState(journalStorage.getHabits());
  const [habitLog, setHabitLog] = useState(journalStorage.getHabitLog(dateKey));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Academics');
  const [newHabitDesc, setNewHabitDesc] = useState('');

  const recentDays = journalStorage.getRecentDays(7);

  useEffect(() => {
    const handleUpdate = () => {
      setHabits(journalStorage.getHabits());
      setHabitLog(journalStorage.getHabitLog(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const handleToggleHabit = (habitId) => {
    journalStorage.toggleHabit(dateKey, habitId);
  };

  const handleToggleRestDay = () => {
    journalStorage.toggleRestDay(dateKey);
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    journalStorage.addHabit(newHabitName.trim(), newHabitCategory, newHabitDesc.trim());
    setNewHabitName('');
    setNewHabitDesc('');
    setShowAddModal(false);
  };

  const handleDeleteHabit = (id, e) => {
    e.stopPropagation();
    if (confirm('Remove this habit from your tracker?')) {
      journalStorage.deleteHabit(id);
    }
  };

  const isRestDay = habitLog.isRestDay;

  // Check if any habit needs catch-up (missed yesterday & not done today)
  const hasAnyMissedHabit = habits.some(h => {
    const streak = journalStorage.getHabitStreak(h.id);
    return streak.needsCatchUp;
  });

  return (
    <div className="journal-card p-6 sm:p-7 space-y-5">
      {/* Header & Rest Day Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              {isFullPage ? 'Habit Tracker & Consistency' : 'Habit Tracker'}
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Build consistency without guilt • Rest days protect your streaks
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Weekly Rest Day Option */}
          <button
            onClick={handleToggleRestDay}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
              isRestDay
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Mark today as a Rest Day to protect your streaks"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>{isRestDay ? 'Rest Day Active ☕' : 'Mark Rest Day'}</span>
          </button>

          {/* Add Habit Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] transition-colors"
          >
            <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Rest Day Active Banner */}
      {isRestDay && (
        <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 text-amber-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Today is marked as your Rest Day. Take time with family and recharge — streaks are safely held.</span>
          </div>
          <button 
            onClick={handleToggleRestDay}
            className="text-xs underline hover:text-amber-200 ml-3 shrink-0"
          >
            Undo
          </button>
        </div>
      )}

      {/* SINGLE Top "Get back on track" message (Only shown once at top when relevant, never repeated on rows!) */}
      {!isRestDay && hasAnyMissedHabit && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>A fresh start today — check off your habits to get right back on track. No guilt, just momentum.</span>
        </div>
      )}

      {/* Compact Habit Rows (Single line, no cramped word wrapping) */}
      <div className="space-y-2">
        {habits.map((habit) => {
          const streakInfo = journalStorage.getHabitStreak(habit.id);
          const isDoneToday = isRestDay || !!habitLog?.completed?.[habit.id];
          const dotColor = CATEGORY_DOT_COLORS[habit.category] || 'var(--cat-routine)';

          return (
            <div
              key={habit.id}
              onClick={() => !isRestDay && handleToggleHabit(habit.id)}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group ${
                isDoneToday
                  ? 'bg-[var(--bg-surface-elevated)]/40 border-[var(--border-subtle)] opacity-75'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {/* Left: Checkbox + Name + Dot + Description */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  disabled={isRestDay}
                  aria-label={`Toggle ${habit.name}`}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isDoneToday
                      ? 'border-transparent text-white'
                      : 'border-[var(--border-medium)] bg-transparent hover:border-[var(--text-muted)]'
                  }`}
                  style={isDoneToday ? { backgroundColor: accentColor } : {}}
                >
                  {isDoneToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm sm:text-base font-medium truncate ${
                      isDoneToday ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    }`}>
                      {habit.name}
                    </span>

                    {/* Tiny category dot (No boxed chip) */}
                    <span 
                      className="cat-dot" 
                      style={{ backgroundColor: dotColor }}
                      title={habit.category}
                    />
                    <span className="hidden sm:inline-block text-xs text-[var(--text-muted)]">
                      {habit.category}
                    </span>
                  </div>

                  {/* Single-line secondary description in smaller text */}
                  {habit.description && (
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Streak Counter + Delete */}
              <div className="flex items-center gap-4 shrink-0 pl-3">
                {/* 7-Day Mini Dots (Desktop view) */}
                {isFullPage && (
                  <div className="hidden md:flex items-center gap-1">
                    {recentDays.map((d) => {
                      const dayLogs = journalStorage.getHabitLog(d.dateKey);
                      const isDayDone = dayLogs.isRestDay || !!dayLogs.completed?.[habit.id];
                      return (
                        <span
                          key={d.dateKey}
                          className={`w-2 h-2 rounded-full ${
                            isDayDone 
                              ? 'bg-amber-400' 
                              : 'bg-[var(--border-subtle)]'
                          }`}
                          title={`${d.dateKey}: ${isDayDone ? 'Completed' : 'Not logged'}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  <Flame className={`w-4 h-4 ${streakInfo.currentStreak > 0 ? 'text-amber-400' : 'text-[var(--text-muted)]'}`} />
                  <span className={streakInfo.currentStreak > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                    {streakInfo.currentStreak}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-normal hidden sm:inline">
                    day streak
                  </span>
                </div>

                {/* Subtle Delete Button */}
                <button
                  onClick={(e) => handleDeleteHabit(habit.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                  title="Remove habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add New Habit</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. 15 mins book reading before sleep"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Category
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="Academics">Academics</option>
                  <option value="Faith">Faith</option>
                  <option value="Health">Health</option>
                  <option value="Growth">Growth</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
                  Note / Single-Line Motivation (Optional)
                </label>
                <input
                  type="text"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="e.g. Unwind mind and build vocabulary"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
