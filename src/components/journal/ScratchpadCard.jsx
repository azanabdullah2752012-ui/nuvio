import React, { useState, useEffect } from 'react';
import { Terminal, Check } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';

const ScratchpadCard = () => {
  const [content, setContent] = useState(journalStorage.getScratchpad());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setContent(journalStorage.getScratchpad());
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    journalStorage.saveScratchpad(val);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
            Live Math & Code Scratchpad
          </h2>
        </div>
        {isSaved && (
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Auto-saved
          </span>
        )}
      </div>

      <textarea
        rows={4}
        value={content}
        onChange={handleChange}
        placeholder="// Quick equations, variables, algorithms, or code notes..."
        className="w-full p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl font-mono text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all resize-y leading-relaxed"
      />
    </div>
  );
};

export default ScratchpadCard;
