import React, { useState, useEffect } from 'react';
import { 
  Flame, Check, Plus, Coffee, Sparkles, AlertCircle, 
  Trash2, Dumbbell, BookOpen, Target, TrendingUp, Sun 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const CATEGORY_COLORS = {
  Faith: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Health: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Academics: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  Growth: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  General: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
};

const HabitTracker = ({ dateKey = getTodayKey(), accentColor }) => {
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

  return (
    <div className="journal-card p-5 sm:p-6 space-y-5">
      {/* Header & Rest Day Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Habit Tracker</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Build consistency without guilt. Rest days protect your streaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Weekly Rest Day Option */}
          <button
            onClick={handleToggleRestDay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isRestDay
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-[#14171d] border-white/[0.08] hover:border-white/[0.16] text-zinc-400 hover:text-zinc-200'
            }`}
            title="Mark today as a Rest Day to protect your streaks"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>{isRestDay ? 'Rest Day Active ☕' : 'Mark Rest Day'}</span>
          </button>

          {/* Add Habit Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>
      </div>

      {/* Rest Day Active Banner */}
      {isRestDay && (
        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Today is marked as your Rest Day. Take time with family and recharge — streaks are safely held.</span>
          </div>
          <button 
            onClick={handleToggleRestDay}
            className="text-[11px] underline hover:text-amber-200 ml-2"
          >
            Undo
          </button>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const streakInfo = journalStorage.getHabitStreak(habit.id);
          const isDoneToday = isRestDay || !!habitLog?.completed?.[habit.id];

          return (
            <div
              key={habit.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                isDoneToday
                  ? 'bg-white/[0.02] border-white/[0.06]'
                  : 'bg-[#14171d]/60 border-white/[0.08] hover:border-white/[0.14]'
              }`}
            >
              {/* Left: Checkbox + Habit Info */}
              <div 
                onClick={() => !isRestDay && handleToggleHabit(habit.id)}
                className={`flex items-start sm:items-center gap-3 cursor-pointer select-none flex-1 ${
                  isRestDay ? 'cursor-default' : ''
                }`}
              >
                <button
                  type="button"
                  disabled={isRestDay}
                  aria-label={`Toggle habit ${habit.name}`}
                  className={`w-5 h-5 mt-0.5 sm:mt-0 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    isDoneToday
                      ? 'border-transparent text-white'
                      : 'border-white/[0.2] bg-transparent hover:border-white/[0.4]'
                  }`}
                  style={isDoneToday ? { backgroundColor: accentColor } : {}}
                >
                  {isDoneToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs sm:text-sm font-medium ${isDoneToday ? 'text-zinc-300' : 'text-zinc-100'}`}>
                      {habit.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.General}`}>
                      {habit.category}
                    </span>
                  </div>

                  {habit.description && (
                    <p className="text-[11px] text-zinc-500">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Streak & Catch Up Pill */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                {/* Missed Day Non-Shaming Message */}
                {streakInfo.needsCatchUp && !isRestDay && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Get back on track
                  </span>
                )}

                {/* Streak Counter */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
                  <Flame className={`w-3.5 h-3.5 ${streakInfo.currentStreak > 0 ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <span className="font-semibold">{streakInfo.currentStreak}</span>
                  <span className="text-zinc-500 text-[11px]">streak</span>
                </div>

                {/* Delete button (only for non-initial habits or subtle) */}
                <button
                  onClick={(e) => handleDeleteHabit(habit.id, e)}
                  className="text-zinc-600 hover:text-rose-400 p-1 rounded transition-colors"
                  title="Delete habit"
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
            className="bg-[#0e1013] border border-white/[0.12] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-semibold text-white">Add New Habit</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. Read 15 mins before bed"
                  className="w-full px-3 py-2 bg-[#14171d] border border-white/[0.08] focus:border-white/[0.2] rounded-xl text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14171d] border border-white/[0.08] focus:border-white/[0.2] rounded-xl text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="Academics">Academics</option>
                  <option value="Faith">Faith</option>
                  <option value="Health">Health</option>
                  <option value="Growth">Growth</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Description / Motivation (Optional)
                </label>
                <input
                  type="text"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="e.g. Keep mind sharp and decompress"
                  className="w-full px-3 py-2 bg-[#14171d] border border-white/[0.08] focus:border-white/[0.2] rounded-xl text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white"
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
