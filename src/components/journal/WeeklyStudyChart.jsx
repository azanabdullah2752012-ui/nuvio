import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';

const WeeklyStudyChart = ({ accentColor }) => {
  const [stats, setStats] = useState(journalStorage.getWeeklyStudyStats());

  useEffect(() => {
    const handleUpdate = () => {
      setStats(journalStorage.getWeeklyStudyStats());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const totalWeeklyHours = stats.reduce((acc, d) => acc + d.totalHours, 0).toFixed(1);
  const targetWeeklyHours = 14.0; // 2 hours/day (1h Study + 1h JEE)
  const percentOfTarget = Math.min(100, Math.round((totalWeeklyHours / targetWeeklyHours) * 100));

  // Max scale (at least 3 hours for scale)
  const maxHours = Math.max(3, ...stats.map(d => d.totalHours));

  return (
    <div className="journal-card p-6 space-y-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              7-Day Study & JEE Volume
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Target: 2.0 hrs daily (1h Actual Study + 1h JEE problem solving)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {totalWeeklyHours} / {targetWeeklyHours}h
            </span>
            <span className="text-xs text-sky-400 font-semibold ml-1.5">
              ({percentOfTarget}%)
            </span>
          </div>
        </div>
      </div>

      {/* Dual Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />
          <span className="text-[var(--text-secondary)]">1h Actual Study</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
          <span className="text-[var(--text-secondary)]">1h JEE Prep</span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
        {stats.map((day, idx) => {
          const heightPercent = Math.min(100, Math.round((day.totalHours / maxHours) * 100));
          const actualRatio = day.totalHours > 0 ? (day.actualMins / (day.actualMins + day.jeeMins)) : 0.5;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip / Hours Value */}
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                {day.totalHours > 0 ? `${day.totalHours}h` : '—'}
              </span>

              {/* Bar Container */}
              <div className="w-full max-w-[36px] bg-[var(--bg-surface)] rounded-t-lg overflow-hidden border border-[var(--border-subtle)] flex flex-col justify-end transition-all group-hover:border-[var(--border-medium)]" style={{ height: '110px' }}>
                <div 
                  className="w-full flex flex-col transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Actual Study portion (Sky) */}
                  <div 
                    className="w-full bg-sky-400"
                    style={{ flex: day.actualMins || (day.totalHours === 0 ? 0 : 1) }}
                  />
                  {/* JEE portion (Amber) */}
                  <div 
                    className="w-full bg-amber-400"
                    style={{ flex: day.jeeMins || 0 }}
                  />
                </div>
              </div>

              {/* Day Label */}
              <span className={`text-[11px] font-medium transition-colors ${
                day.isToday 
                  ? 'text-[var(--text-primary)] font-bold underline' 
                  : 'text-[var(--text-muted)]'
              }`}>
                {day.dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyStudyChart;