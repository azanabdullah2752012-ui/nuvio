import React, { useState, useEffect } from 'react';
import { 
  Shield, Zap, Award, Sparkles, AlertTriangle, 
  Calendar, Flame, TrendingUp, Check, Star 
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import DisciplinePage from './DisciplinePage';
import WeeklyReviewPage from './WeeklyReviewPage';
import WinsPage from './WinsPage';

const TABS = [
  { id: 'discipline', label: 'Discipline & Creed', icon: Shield },
  { id: 'heatmap', label: '30-Day Consistency Heatmap', icon: Flame },
  { id: 'review', label: 'Weekly Reviews', icon: Sparkles },
  { id: 'wins', label: 'Small Wins Vault', icon: Award }
];

const DisciplineHub = () => {
  const [activeTab, setActiveTab] = useState('discipline');
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [activityDays, setActivityDays] = useState(journalStorage.getPast30DaysActivity());

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
      setActivityDays(journalStorage.getPast30DaysActivity());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const totalActiveDays = activityDays.filter(d => d.level > 0).length;

  return (
    <div className="space-y-7 text-left max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Mindset, Systems & Momentum
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Discipline & Review Hub
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Eliminate procrastination, review your weeks without self-delusion, and build an unbroken chain of consistency.
        </p>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playPop();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Icon 
                className="w-4 h-4 shrink-0" 
                style={isActive ? { color: accentColor } : {}}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'discipline' && <DisciplinePage />}

        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <div className="journal-card p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    30-Day Momentum Matrix
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Visual record of your daily habits, study sprints, and routines held
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--text-primary)]">
                    {totalActiveDays} / 30 Days Active
                  </div>
                  <span className="text-xs text-amber-400 font-semibold font-mono">
                    {Math.round((totalActiveDays / 30) * 100)}% Consistency
                  </span>
                </div>
              </div>

              {/* GitHub-Style 30-Day Grid */}
              <div className="space-y-2">
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                  {activityDays.map((day) => {
                    const levelColors = [
                      'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)]',
                      'bg-emerald-950/60 border-emerald-800/40 text-emerald-400',
                      'bg-emerald-800/80 border-emerald-600/50 text-white',
                      'bg-emerald-600 border-emerald-500 text-white',
                      'bg-emerald-400 border-emerald-300 text-black shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                    ];

                    return (
                      <div
                        key={day.dateKey}
                        className={`h-14 rounded-xl border p-2 flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer ${
                          levelColors[day.level] || levelColors[0]
                        }`}
                        title={`${day.dateKey}: ${day.habitsDone} habits, ${day.focusMins}m focus`}
                      >
                        <span className="text-[10px] font-mono font-bold opacity-75">
                          {day.dayNum}
                        </span>
                        <span className="text-[9px] font-mono opacity-90 truncate">
                          {day.score > 0 ? `${day.score} pts` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 text-[11px] text-[var(--text-muted)] font-mono">
                  <span>Less Active</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]" />
                    <span className="w-2.5 h-2.5 rounded bg-emerald-950/60" />
                    <span className="w-2.5 h-2.5 rounded bg-emerald-800/80" />
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                  </div>
                  <span>High Lock-In</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && <WeeklyReviewPage />}

        {activeTab === 'wins' && <WinsPage />}
      </div>

    </div>
  );
};

export default DisciplineHub;
