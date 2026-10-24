import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const DisciplineSummaryCard = ({ dateKey = getTodayKey(), accentColor }) => {
  const [checks, setChecks] = useState(journalStorage.getDisciplineChecks(dateKey));
  const realityLines = journalStorage.getRealityCheckLines();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setChecks(journalStorage.getDisciplineChecks(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const completedCount = checks.filter(c => c.completed).length;
  const percent = Math.round((completedCount / checks.length) * 100);

  return (
    <div className="journal-card p-6 space-y-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Discipline Standard
          </h3>
        </div>

        <Link
          to="/discipline"
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 font-medium transition-colors"
        >
          <span>Open Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Score Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">5 Daily Standards</span>
          <span className="font-mono font-bold text-[var(--text-primary)]">
            {completedCount} / {checks.length} Locked In ({percent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Quote Banner */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-amber-400">
          <Zap className="w-3 h-3" />
          <span>Daily Reality Check</span>
        </div>
        <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed italic">
          "{realityLines[quoteIndex % realityLines.length]}"
        </p>
      </div>

      <div className="pt-1">
        <Link
          to="/discipline"
          className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Read When Procrastinating</span>
        </Link>
      </div>
    </div>
  );
};

export default DisciplineSummaryCard;