import React, { useState, useEffect } from 'react';
import { Target, Check, Sparkles, CheckSquare } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const PLACEHOLDERS = [
  'Priority 1: e.g. Turn 10 word problems into algebraic equations (Math)',
  'Priority 2: e.g. NextTopper science revision notes & test prep',
  'Priority 3: e.g. Build next feature on active product / 20m workout'
];

const LABELS = [
  'Must-Ship Core Target',
  'Academic Problem Set',
  'Personal Discipline'
];

const TodayPriorities = ({ dateKey = getTodayKey(), accentColor }) => {
  const [priorities, setPriorities] = useState(journalStorage.getPriorities(dateKey));

  useEffect(() => {
    setPriorities(journalStorage.getPriorities(dateKey));
  }, [dateKey]);

  useEffect(() => {
    const handleUpdate = () => {
      setPriorities(journalStorage.getPriorities(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const handleTextChange = (index, value) => {
    journalStorage.updatePriority(dateKey, index, value);
    const updated = [...priorities];
    updated[index].text = value;
    setPriorities(updated);
  };

  const handleToggle = (index) => {
    journalStorage.togglePriority(dateKey, index);
  };

  const completedCount = priorities.filter(p => p.completed && p.text.trim().length > 0).length;

  return (
    <div className="journal-card p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              Today's 3 Priorities
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Focus purely on these 3 items • Check off as you finish
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {completedCount} / 3
          </span>
          <span className="text-xs text-[var(--text-muted)] ml-1">Completed</span>
        </div>
      </div>

      {/* 3 Roomy, Comfortable Input Rows */}
      <div className="space-y-3.5">
        {priorities.map((item, index) => {
          const isDone = item.completed;
          const hasText = item.text.trim().length > 0;

          return (
            <div 
              key={item.id || index}
              className={`flex items-start sm:items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                isDone 
                  ? 'bg-[var(--bg-surface-elevated)]/40 border-[var(--border-subtle)] opacity-70' 
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] focus-within:border-[var(--border-focus)] focus-within:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {/* Checkbox Button */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                disabled={!hasText}
                aria-label={`Toggle priority ${index + 1}`}
                className={`w-6 h-6 mt-0.5 sm:mt-0 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                  isDone 
                    ? 'border-transparent text-white shadow-sm' 
                    : hasText 
                      ? 'border-[var(--border-medium)] hover:border-emerald-400 bg-transparent cursor-pointer' 
                      : 'border-[var(--border-subtle)] cursor-not-allowed opacity-30'
                }`}
                style={isDone ? { backgroundColor: accentColor } : {}}
              >
                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              {/* Number and Label Indicator */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Priority #{index + 1}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {LABELS[index]}
                  </span>
                </div>

                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder={PLACEHOLDERS[index]}
                  className={`w-full bg-transparent border-none text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all ${
                    isDone ? 'line-through text-[var(--text-muted)]' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayPriorities;
