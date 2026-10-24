import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, Sparkles, Clock, Calendar, Heart } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const SUNNAH_PRAYERS = [
  { id: 'tahajjud', name: 'Tahajjud (Night Prayer)', timing: 'Last third of night before Fajr' },
  { id: 'duha', name: 'Salat al-Duha (Forenoon)', timing: 'Mid-morning (approx 08:30 - 11:30)' },
  { id: 'witr', name: 'Salat al-Witr', timing: 'After Isha before sleeping' }
];

const PrayerPage = () => {
  const [dateKey, setDateKey] = useState(getTodayKey());
  const [prayerLog, setPrayerLog] = useState(journalStorage.getPrayerLog(dateKey));
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [currentTime, setCurrentTime] = useState('');

  const prayers = journalStorage.getPrayerTimes();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setPrayerLog(journalStorage.getPrayerLog(dateKey));
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  const handleToggle = (prayerKey) => {
    soundEngine.playPop();
    journalStorage.togglePrayer(dateKey, prayerKey);
  };

  const fardhCompletedCount = prayers.filter(p => prayerLog[p.id]).length;
  const sunnahCompletedCount = SUNNAH_PRAYERS.filter(s => prayerLog[s.id]).length;

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider">
              Chennai, India (IST)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Prayer Radar & Sunnah Tracker
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Faith is your foundation. Keep your 5 daily prayers anchored to your schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-right">
            <span className="text-[11px] font-mono text-[var(--text-muted)] block">
              Current Time
            </span>
            <span className="text-lg font-mono font-bold text-[var(--text-primary)]">
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="journal-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">5 Daily Obligatory (Fardh)</span>
            <span className="font-bold text-[var(--text-primary)]">{fardhCompletedCount} / 5</span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(fardhCompletedCount / 5) * 100}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        <div className="journal-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">Sunnah & Voluntary Prayers</span>
            <span className="font-bold text-amber-400">{sunnahCompletedCount} / 3</span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-amber-400 transition-all duration-300"
              style={{ width: `${(sunnahCompletedCount / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Daily Prayers List */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          The 5 Daily Prayers (Chennai Schedule)
        </h2>

        <div className="space-y-2.5">
          {prayers.map((prayer) => {
            const isDone = !!prayerLog[prayer.id];
            const Icon = prayer.icon === 'Sun' ? Sun : Moon;

            return (
              <div
                key={prayer.id}
                onClick={() => handleToggle(prayer.id)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer select-none group ${
                  isDone
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] opacity-85'
                    : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    aria-label={`Toggle ${prayer.name}`}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'border-transparent text-white'
                        : 'border-[var(--border-medium)] bg-transparent'
                    }`}
                    style={isDone ? { backgroundColor: accentColor } : {}}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-semibold ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                        {prayer.name}
                      </span>
                      {prayer.id === 'fajr' && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Routine Anchor
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[var(--text-secondary)]">
                    ~ {prayer.time}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunnah Prayers */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Sunnah & Night Prayers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUNNAH_PRAYERS.map((sunnah) => {
            const isDone = !!prayerLog[sunnah.id];

            return (
              <div
                key={sunnah.id}
                onClick={() => handleToggle(sunnah.id)}
                className={`journal-card p-4 space-y-2 cursor-pointer transition-all ${
                  isDone
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'hover:border-[var(--border-medium)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {sunnah.name}
                  </span>
                  <div 
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone ? 'bg-amber-500 border-transparent text-white' : 'border-[var(--border-medium)]'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {sunnah.timing}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PrayerPage;
