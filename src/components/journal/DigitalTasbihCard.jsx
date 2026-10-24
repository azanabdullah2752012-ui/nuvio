import React, { useState, useEffect } from 'react';
import { Compass, RotateCcw, Sparkles, Volume2, Check } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const PHRASES = [
  { key: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', translit: 'SubhanAllah', meaning: 'Glory be to Allah', target: 33 },
  { key: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', translit: 'Alhamdulillah', meaning: 'All praise is due to Allah', target: 33 },
  { key: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', translit: 'Allahu Akbar', meaning: 'Allah is the Greatest', target: 34 },
  { key: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', translit: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah', target: 33 },
  { key: 'lailahaillallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', translit: 'La ilaha illallah', meaning: 'There is no god but Allah', target: 33 }
];

const DigitalTasbihCard = ({ accentColor }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [counts, setCounts] = useState(journalStorage.getTasbihCounts());

  useEffect(() => {
    const handleUpdate = () => {
      setCounts(journalStorage.getTasbihCounts());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const currentPhrase = PHRASES[selectedIdx];
  const currentCount = counts[currentPhrase.key] || 0;
  const target = currentPhrase.target;
  const cycles = Math.floor(currentCount / target);
  const currentCycleProgress = currentCount % target;
  const progressPercent = Math.min(100, Math.round((currentCycleProgress / target) * 100));

  const handleTap = () => {
    const nextVal = journalStorage.incrementTasbih(currentPhrase.key);
    // Tactile sound
    if (nextVal % target === 0) {
      soundEngine.playBell(587); // Celebration chime at 33
    } else {
      soundEngine.playPop(340 + (nextVal % target) * 5); // Micro pitch climb
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    soundEngine.playPop();
    journalStorage.resetTasbih(currentPhrase.key);
  };

  return (
    <div className="journal-card p-6 space-y-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Digital Tasbih & Dhikr Counter
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Tactile counter with audio feedback • 33 beads per round
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
          title="Reset current counter"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Phrase Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {PHRASES.map((p, idx) => {
          const isActive = idx === selectedIdx;
          return (
            <button
              key={p.key}
              onClick={() => {
                soundEngine.playPop();
                setSelectedIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--text-primary)] font-bold'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {p.translit}
            </button>
          );
        })}
      </div>

      {/* Big Tactile Click Area */}
      <div 
        onClick={handleTap}
        className="p-8 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] hover:border-[var(--accent-primary)] cursor-pointer select-none transition-all flex flex-col items-center justify-center text-center space-y-3 group active:scale-[0.98] shadow-inner"
      >
        <div className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] tracking-wide">
          {currentPhrase.arabic}
        </div>

        <div className="space-y-0.5">
          <div className="text-sm font-bold text-[var(--text-primary)]">
            {currentPhrase.translit}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {currentPhrase.meaning}
          </div>
        </div>

        {/* Big Counter Value */}
        <div className="pt-2">
          <div className="text-5xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
            {currentCycleProgress}
            <span className="text-sm font-sans text-[var(--text-muted)] font-normal ml-1">
              / {target}
            </span>
          </div>
          {cycles > 0 && (
            <div className="text-xs font-mono text-emerald-400 mt-1 font-semibold">
              ✓ {cycles} full round{cycles > 1 ? 's' : ''} completed ({currentCount} total)
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-emerald-400 rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors pt-1">
          Tap anywhere in the box to count
        </p>
      </div>
    </div>
  );
};

export default DigitalTasbihCard;