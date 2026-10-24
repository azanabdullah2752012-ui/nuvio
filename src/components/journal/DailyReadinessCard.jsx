import React, { useState, useEffect } from 'react';
import { Droplet, Check, ShieldCheck, Moon, Briefcase, Plus, Minus } from 'lucide-react';
import { journalStorage, getTodayKey } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const DailyReadinessCard = ({ dateKey = getTodayKey(), accentColor }) => {
  const [water, setWater] = useState(journalStorage.getWaterCount(dateKey));
  const [bagChecks, setBagChecks] = useState(journalStorage.getBagPackChecks(dateKey));

  useEffect(() => {
    const handleUpdate = () => {
      setWater(journalStorage.getWaterCount(dateKey));
      setBagChecks(journalStorage.getBagPackChecks(dateKey));
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const handleWaterClick = (idx) => {
    soundEngine.playPop(300 + idx * 30);
    const newCount = idx + 1 === water ? idx : idx + 1;
    journalStorage.setWaterCount(dateKey, newCount);
  };

  const handleToggleBag = (id) => {
    soundEngine.playPop();
    journalStorage.toggleBagPackCheck(dateKey, id);
    const updated = journalStorage.getBagPackChecks(dateKey);
    const allDone = updated.every(c => c.completed);
    if (allDone) {
      soundEngine.playBell(587);
    }
  };

  const bagDoneCount = bagChecks.filter(c => c.completed).length;
  const allBagDone = bagDoneCount === bagChecks.length;

  return (
    <div className="journal-card p-6 space-y-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      
      {/* ── HYDRATION TRACKER ────────────────────────────────────────── */}
      <div className="space-y-3 pb-5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Daily Hydration
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
            {water} / 8 Glasses <span className="text-[var(--text-muted)]">({(water * 0.3).toFixed(1)}L / 2.4L)</span>
          </span>
        </div>

        {/* 8 Interactive Glass Buttons */}
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => {
            const isFilled = i < water;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleWaterClick(i)}
                className={`h-11 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sm'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-medium)]'
                }`}
                title={`Glass ${i + 1}`}
              >
                <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-sky-400 text-sky-400' : 'text-[var(--text-muted)]'}`} />
                <span className="text-[9px] font-mono mt-0.5">{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NIGHTLY SCHOOL BAG & FAJR READINESS ───────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Nightly School Bag & Fajr Readiness
            </h3>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            allBagDone ? 'bg-emerald-500/10 text-emerald-400' : 'text-[var(--text-muted)]'
          }`}>
            {bagDoneCount}/{bagChecks.length} Packed
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Pack before sleeping at 20:30 so the 07:50 AM bus morning has zero panic
        </p>

        {/* Checklist Rows */}
        <div className="space-y-2 pt-1">
          {bagChecks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleBag(item.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer select-none transition-colors ${
                item.completed
                  ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] text-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    item.completed ? 'border-transparent text-white' : 'border-[var(--border-medium)]'
                  }`}
                  style={item.completed ? { backgroundColor: accentColor } : {}}
                >
                  {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className={`text-xs ${item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)] font-medium'}`}>
                  {item.label}
                </span>
              </div>

              {item.completed && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                  Ready
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DailyReadinessCard;