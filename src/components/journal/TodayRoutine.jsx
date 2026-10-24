import React from 'react';
import { Check, Clock, Calendar, Heart, ArrowRight } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const CATEGORY_DOT_COLORS = {
  Faith: 'var(--cat-faith)',
  Academics: 'var(--cat-academics)',
  Health: 'var(--cat-health)',
  Routine: 'var(--cat-routine)',
  School: 'var(--cat-academics)',
  Study: 'var(--cat-growth)',
  Building: 'var(--cat-growth)',
  Growth: 'var(--cat-growth)',
  Rest: 'var(--cat-rest)',
  Family: 'var(--cat-family)'
};

const TodayRoutine = ({ dateKey = getTodayKey(), accentColor, isFullPage = false }) => {
  const routineType = journalStorage.getRoutineType(dateKey);
  const template = journalStorage.getRoutineTemplate(routineType);
  const routineLogs = journalStorage.getRoutineLog(dateKey);
  const nextInfo = journalStorage.getNextRoutineInfo(dateKey);

  const completedCount = template.filter(item => routineLogs[item.id]).length;
  const progressPercent = Math.round((completedCount / template.length) * 100);

  const handleToggle = (itemId) => {
    journalStorage.toggleRoutineItem(dateKey, itemId);
  };

  return (
    <div className="journal-card p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              {isFullPage ? 'Daily Routine Timeline' : "Today's Routine Timeline"}
            </h2>
            <span className="text-xs font-medium uppercase px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {routineType}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Times on left • Active block illuminated • Click any item to check off
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {completedCount} / {template.length}
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-1.5">({progressPercent}%)</span>
          </div>
          <div className="w-24 h-2 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Connected Timeline */}
      <div className="relative pl-2 sm:pl-4 space-y-3">
        {/* Continuous background vertical connector line */}
        <div className="absolute top-4 bottom-4 left-[21px] sm:left-[29px] w-[2px] bg-[var(--border-subtle)]" />

        {template.map((item, index) => {
          const isDone = !!routineLogs[item.id];
          const isCurrent = nextInfo.activeBlock?.id === item.id;
          const dotColor = CATEGORY_DOT_COLORS[item.tag] || 'var(--cat-routine)';

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`relative flex items-center gap-4 sm:gap-6 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group ${
                isCurrent
                  ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] shadow-sm'
                  : isDone
                    ? 'bg-[var(--bg-surface-elevated)]/40 border-[var(--border-subtle)] opacity-55'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {/* Timeline Node on the connector line */}
              <div className="relative z-10 shrink-0">
                <button
                  type="button"
                  aria-label={`Toggle ${item.label}`}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isDone
                      ? 'border-transparent text-white'
                      : isCurrent
                        ? 'border-[var(--accent-primary)] bg-[var(--bg-surface)] shadow-[0_0_8px_var(--accent-glow)]'
                        : 'border-[var(--border-medium)] bg-[var(--bg-surface)] group-hover:border-[var(--text-muted)]'
                  }`}
                  style={isDone ? { backgroundColor: accentColor } : {}}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <span 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                  ) : null}
                </button>
              </div>

              {/* Left Time Column (Clear readable text, 14px) */}
              <div className="w-24 sm:w-28 shrink-0">
                <span className={`text-xs sm:text-sm font-medium ${isCurrent ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {item.time}
                </span>
                {isCurrent && (
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Now
                  </span>
                )}
              </div>

              {/* Block Content (Label + Category Dot) */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                <span className={`text-sm sm:text-base font-medium truncate ${
                  isDone 
                    ? 'line-through text-[var(--text-muted)]' 
                    : isCurrent
                      ? 'text-[var(--text-primary)] font-semibold'
                      : 'text-[var(--text-primary)]'
                }`}>
                  {item.label}
                </span>

                {/* Category Tiny Dot + Label (No boxed chip) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span 
                    className="cat-dot" 
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    {item.tag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayRoutine;
