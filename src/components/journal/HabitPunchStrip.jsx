import React, { useState, useEffect } from 'react';
import { Flame, Check, Coffee, Sparkles } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const HabitPunchStrip = ({ dateKey = getTodayKey(), accentColor }) => {
  const [habits, setHabits] = useState(journalStorage.getHabits());
  const [habitLog, setHabitLog] = useState(journalStorage.getHabitLog(dateKey));

  useEffect(() => {
    const handleUpdate = () => {
      setHabits(journalStorage.getHabits());
      setHabitLog(journalStorage.getHabitLog(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const handleToggle = (id) => {
    soundEngine.playPop();
    journalStorage.toggleHabit(dateKey, id);
  };

  const handleToggleRest = () => {
    soundEngine.playPop();
    journalStorage.toggleRestDay(dateKey);
  };

  const isRestDay = habitLog.isRestDay;

  return (
    <div className="journal-card p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Daily Habit Punch-Strip
          </span>
        </div>

        <button
          onClick={handleToggleRest}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            isRestDay
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{isRestDay ? 'Rest Day Active ☕' : 'Mark Rest Day'}</span>
        </button>
      </div>

      {/* Horizontal Punch-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {habits.slice(0, 5).map((habit) => {
          const isDone = isRestDay || !!habitLog?.completed?.[habit.id];
          const streak = journalStorage.getHabitStreak(habit.id);

          return (
            <button
              key={habit.id}
              disabled={isRestDay}
              onClick={() => handleToggle(habit.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 select-none ${
                isDone
                  ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] truncate">
                  {habit.category}
                </span>
                <div 
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isDone 
                      ? 'border-transparent text-white' 
                      : 'border-[var(--border-medium)]'
                  }`}
                  style={isDone ? { backgroundColor: accentColor } : {}}
                >
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                <div className={`text-xs font-semibold truncate ${isDone ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {habit.name}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <Flame className={`w-3 h-3 ${streak.currentStreak > 0 ? 'text-amber-400' : 'text-[var(--text-muted)]'}`} />
                  <span>{streak.currentStreak}d streak</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitPunchStrip;
