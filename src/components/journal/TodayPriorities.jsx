import React, { useState, useEffect } from 'react';
import { Target, Check, Sparkles } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

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
    <div className="journal-card p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Today's 3 Priorities</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Focus on what matters most. Keep it limited to 3 items.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-medium text-zinc-300">
            {completedCount} / 3 Completed
          </span>
        </div>
      </div>

      {/* 3 Priorities Slots */}
      <div className="space-y-3">
        {priorities.map((item, index) => {
          const isDone = item.completed;
          const hasText = item.text.trim().length > 0;

          return (
            <div 
              key={item.id || index}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isDone 
                  ? 'bg-white/[0.02] border-white/[0.05] opacity-75' 
                  : 'bg-[#14171d]/60 border-white/[0.08] focus-within:border-white/[0.2] focus-within:bg-[#14171d]'
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                disabled={!hasText}
                aria-label={`Toggle priority ${index + 1}`}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  isDone 
                    ? 'border-transparent text-white' 
                    : hasText 
                      ? 'border-white/[0.25] hover:border-white/[0.5] cursor-pointer' 
                      : 'border-white/[0.08] cursor-not-allowed opacity-30'
                }`}
                style={isDone ? { backgroundColor: accentColor } : {}}
              >
                {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              {/* Number Badge */}
              <span className="text-[11px] font-mono text-zinc-500 shrink-0 w-4">
                #{index + 1}
              </span>

              {/* Priority Input */}
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder={
                  index === 0 
                    ? 'e.g. Turn 10 word problems into equations (Math)' 
                    : index === 1 
                      ? 'e.g. NextTopper class notes & test revision' 
                      : 'e.g. Ship next feature on current product / 20m workout'
                }
                className={`flex-1 bg-transparent border-none text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none ${
                  isDone ? 'line-through text-zinc-400' : ''
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayPriorities;
