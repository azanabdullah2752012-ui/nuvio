import React from 'react';
import { Check, Clock, Calendar, Sparkles, Heart } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const TAG_STYLES = {
  Faith: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  Academics: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  Health: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  Routine: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
  School: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  Study: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  Building: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
  Growth: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
  Rest: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  Family: 'text-orange-300 bg-orange-500/10 border-orange-500/20'
};

const TodayRoutine = ({ dateKey = getTodayKey(), accentColor }) => {
  const routineType = journalStorage.getRoutineType(dateKey);
  const template = journalStorage.getRoutineTemplate(routineType);
  const routineLogs = journalStorage.getRoutineLog(dateKey);

  const completedCount = template.filter(item => routineLogs[item.id]).length;
  const progressPercent = Math.round((completedCount / template.length) * 100);

  const handleToggle = (itemId) => {
    journalStorage.toggleRoutineItem(dateKey, itemId);
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-4">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Today's Routine</h2>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-400">
              {routineType}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Built around your prayer times, study blocks, and family rest.
          </p>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-medium text-zinc-200">
              {completedCount} / {template.length}
            </span>
            <span className="text-[11px] text-zinc-500 ml-1">({progressPercent}%)</span>
          </div>
          <div className="w-20 h-2 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.06]">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: `${progressPercent}%`, 
                backgroundColor: accentColor 
              }}
            />
          </div>
        </div>
      </div>

      {/* Routine Items List */}
      <div className="space-y-2">
        {template.map((item) => {
          const isDone = !!routineLogs[item.id];
          const isRestOrFamily = item.tag === 'Rest' || item.tag === 'Family';

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`group flex items-start sm:items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isDone 
                  ? 'bg-white/[0.02] border-white/[0.05] opacity-65' 
                  : 'bg-[#14171d]/60 border-white/[0.08] hover:border-white/[0.16] hover:bg-[#14171d]'
              }`}
            >
              {/* Left: Checkbox + Time + Label */}
              <div className="flex items-start sm:items-center gap-3">
                <button
                  type="button"
                  aria-label={`Toggle ${item.label}`}
                  className={`w-5 h-5 mt-0.5 sm:mt-0 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    isDone 
                      ? 'border-transparent text-white' 
                      : 'border-white/[0.2] bg-transparent hover:border-white/[0.4]'
                  }`}
                  style={isDone ? { backgroundColor: accentColor } : {}}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 min-w-[75px]">
                      {item.time}
                    </span>
                    <span className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                      {item.label}
                    </span>
                  </div>

                  {isRestOrFamily && !isDone && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 italic mt-0.5 sm:hidden">
                      <Heart className="w-2.5 h-2.5 text-rose-400/80" /> Rest is not wasted time
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Category Tag */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {isRestOrFamily && !isDone && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-zinc-500 italic">
                    <Heart className="w-3 h-3 text-rose-400/80" /> Rest is not wasted time
                  </span>
                )}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${TAG_STYLES[item.tag] || 'text-zinc-400 bg-white/[0.05] border-white/[0.08]'}`}>
                  {item.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayRoutine;
