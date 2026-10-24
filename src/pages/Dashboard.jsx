import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, RotateCcw, 
  CheckCircle2, Flame, Sparkles, Coffee 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
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
    window.addEventListener('journal_theme_change', (e) => setAccentColor(e.detail));
    return () => {
      window.removeEventListener('journal_data_update', handleUpdate);
      window.removeEventListener('journal_theme_change', (e) => setAccentColor(e.detail));
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

  // Date formatted strings
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Calculate quick summary metrics for today
  const routineType = journalStorage.getRoutineType(dateKey);
  const routineTemplate = journalStorage.getRoutineTemplate(routineType);
  const routineLogs = journalStorage.getRoutineLog(dateKey);
  const completedRoutine = routineTemplate.filter(r => routineLogs[r.id]).length;

  const priorities = journalStorage.getPriorities(dateKey);
  const completedPriorities = priorities.filter(p => p.completed && p.text.trim().length > 0).length;

  const habits = journalStorage.getHabits();
  const habitLog = journalStorage.getHabitLog(dateKey);
  const completedHabits = habitLog.isRestDay 
    ? habits.length 
    : habits.filter(h => habitLog?.completed?.[h.id]).length;

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto pb-12">
      
      {/* ── TOP DATE BAR & SUMMARY TELEMETRY ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0e1013] border border-white/[0.08]">
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeDate(-1)}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-zinc-400 hover:text-white transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => changeDate(1)}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-[#14171d] hover:bg-[#1a1e26] text-zinc-400 hover:text-white transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {formattedDate}
              </h1>
              {isToday && (
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Grade 9 • {routineType.toUpperCase()} SCHEDULE
            </p>
          </div>

          {!isToday && (
            <button
              onClick={jumpToToday}
              className="ml-auto md:ml-2 text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded border border-white/[0.08] bg-[#14171d]"
            >
              Back to Today
            </button>
          )}
        </div>

        {/* Quick Progress Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-zinc-400">Routine:</span>
            <span className="text-zinc-200 font-semibold">{completedRoutine}/{routineTemplate.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">Priorities:</span>
            <span className="text-zinc-200 font-semibold">{completedPriorities}/3</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Habits:</span>
            <span className="text-zinc-200 font-semibold">
              {habitLog.isRestDay ? 'Rest ☕' : `${completedHabits}/${habits.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN BALANCED LAYOUT ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Today's 3 Priorities & Daily Routine */}
        <div className="lg:col-span-7 space-y-6">
          <TodayPriorities dateKey={dateKey} accentColor={accentColor} />
          <TodayRoutine dateKey={dateKey} accentColor={accentColor} />
        </div>

        {/* Right Column (5 cols): Habit Tracker & Daily Reflection */}
        <div className="lg:col-span-5 space-y-6">
          <HabitTracker dateKey={dateKey} accentColor={accentColor} />
          <DailyReflection dateKey={dateKey} accentColor={accentColor} />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
