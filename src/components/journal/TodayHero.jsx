import React from 'react';
import { 
  Clock, CheckSquare, Flame, Sparkles, ChevronRight, 
  Calendar, Coffee, Heart, CheckCircle2, ArrowRight
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Peaceful night';
};

const TodayHero = ({ dateKey = getTodayKey(), accentColor }) => {
  const routineType = journalStorage.getRoutineType(dateKey);
  const routineTemplate = journalStorage.getRoutineTemplate(routineType);
  const routineLogs = journalStorage.getRoutineLog(dateKey);
  const nextInfo = journalStorage.getNextRoutineInfo(dateKey);

  // Calculations for Stat Cards
  const completedRoutine = routineTemplate.filter(r => routineLogs[r.id]).length;
  const routinePercent = Math.round((completedRoutine / routineTemplate.length) * 100);

  const priorities = journalStorage.getPriorities(dateKey);
  const completedPriorities = priorities.filter(p => p.completed && p.text.trim().length > 0).length;
  const totalPriorities = 3;

  const habits = journalStorage.getHabits();
  const habitLog = journalStorage.getHabitLog(dateKey);
  const isRestDay = habitLog.isRestDay;
  const completedHabits = isRestDay 
    ? habits.length 
    : habits.filter(h => habitLog?.completed?.[h.id]).length;

  // Overall Day Score Calculation
  const totalActions = routineTemplate.length + totalPriorities + habits.length;
  const completedActions = completedRoutine + completedPriorities + completedHabits;
  const overallDayPercent = Math.round((completedActions / totalActions) * 100);

  // Circular Ring SVG math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallDayPercent / 100) * circumference;

  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      
      {/* ── TOP HERO HEADER: GREETING + RING + NEXT UP CARD ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Greeting & Big Date (7 cols) */}
        <div className="lg:col-span-7 journal-card p-6 sm:p-7 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                  {routineType} Routine
                </span>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  Class IX-C GCIS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                {getGreeting()}, Kaiser
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {formattedDate}
              </p>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center gap-3 self-start sm:self-center bg-[var(--bg-surface-elevated)] px-3.5 py-2.5 rounded-2xl border border-[var(--border-subtle)]">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-[var(--border-subtle)]"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={accentColor}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <span className="absolute font-bold text-xs text-[var(--text-primary)]">
                  {overallDayPercent}%
                </span>
              </div>

              <div className="text-left">
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  Day Progress
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {completedActions} of {totalActions} tasks
                </div>
              </div>
            </div>
          </div>

          {/* Gentle Motto (Shown once, not on every row) */}
          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Faith, family, and rest are essential — rest is never wasted time.</span>
          </div>
        </div>

        {/* Right: Dynamic "Next Up" Routine Card (5 cols) */}
        <div className="lg:col-span-5 journal-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Routine Radar
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                {nextInfo.currentTimeFormatted}
              </span>
            </div>

            {/* End of day state */}
            {nextInfo.isDayComplete ? (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Day Complete
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Wind down, dinner & sleep
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  All routine blocks for today are cleared. Recharge well for tomorrow's Fajr.
                </p>
              </div>
            ) : nextInfo.activeBlock ? (
              /* Active Block Happening Now */
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400">
                    Happening Right Now
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                  {nextInfo.activeBlock.label}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="font-mono">{nextInfo.activeBlock.time}</span>
                  <span>•</span>
                  <span>{nextInfo.activeBlock.tag}</span>
                </div>

                {nextInfo.nextBlock && (
                  <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Next: {nextInfo.nextBlock.label}
                    </span>
                    <span className="font-mono text-[11px]">{nextInfo.nextBlock.time}</span>
                  </div>
                )}
              </div>
            ) : nextInfo.nextBlock ? (
              /* Next upcoming block */
              <div className="pt-2 space-y-1">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  Next Scheduled Block
                </span>
                <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                  {nextInfo.nextBlock.label}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span className="font-mono">{nextInfo.nextBlock.time}</span>
                  <span>•</span>
                  <span>{nextInfo.nextBlock.tag}</span>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Routine Ready
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Follow your schedule checklist below.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{routineType === 'weekend' ? 'Weekend schedule' : 'Weekday school schedule'}</span>
            <span className="text-[var(--text-secondary)] font-medium">
              {completedRoutine} of {routineTemplate.length} done
            </span>
          </div>
        </div>

      </div>

      {/* ── ROW OF 3 CLEAN STAT CARDS ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Routine */}
        <div className="journal-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Routine Blocks
            </span>
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: `${accentColor}26`, color: accentColor }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {completedRoutine} <span className="text-sm font-normal text-[var(--text-muted)]">/ {routineTemplate.length}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {routinePercent}% of day's flow completed
            </p>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${routinePercent}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        {/* Card 2: Priorities */}
        <div className="journal-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Daily Priorities
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {completedPriorities} <span className="text-sm font-normal text-[var(--text-muted)]">/ {totalPriorities}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Must-ship focus targets
            </p>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${(completedPriorities / totalPriorities) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 3: Habits */}
        <div className="journal-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Core Habits
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {isRestDay ? (
                <span className="flex items-center gap-1.5 text-amber-400 text-xl">
                  <Coffee className="w-5 h-5" /> Rest Day
                </span>
              ) : (
                <>
                  {completedHabits} <span className="text-sm font-normal text-[var(--text-muted)]">/ {habits.length}</span>
                </>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {isRestDay ? 'Streaks held safely today' : 'Consistency without guilt'}
            </p>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-amber-400 transition-all duration-300"
              style={{ width: isRestDay ? '100%' : `${(completedHabits / habits.length) * 100}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default TodayHero;
