import React, { useState, useEffect } from 'react';
import { PenTool, Check, Sparkles } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const DailyReflection = ({ dateKey = getTodayKey(), accentColor }) => {
  const [reflection, setReflection] = useState(journalStorage.getDailyReflection(dateKey));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setReflection(journalStorage.getDailyReflection(dateKey));
  }, [dateKey]);

  const handleChange = (e) => {
    const val = e.target.value;
    setReflection(val);
    journalStorage.saveDailyReflection(dateKey, val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-zinc-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">Today's Reflection & Small Wins</h2>
        </div>

        {isSaved && (
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved locally
          </span>
        )}
      </div>

      <p className="text-xs text-zinc-400">
        One thing you shipped, a math concept unlocked, or a win from today. (Stored purely in your browser).
      </p>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={3}
          value={reflection}
          onChange={handleChange}
          placeholder="e.g. Cleared 6 word problems by writing the equations first. Rested with family in the evening..."
          className="w-full p-3.5 bg-[#14171d]/60 border border-white/[0.08] focus:border-white/[0.2] focus:bg-[#14171d] rounded-xl text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all resize-y"
        />
      </div>
    </div>
  );
};

export default DailyReflection;
