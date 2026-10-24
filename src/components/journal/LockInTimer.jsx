import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Brain, CloudRain, Coffee } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { journalStorage, getTodayKey } from '../../services/journalStorage';

const LockInTimer = ({ accentColor }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(45);
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [targetLabel, setTargetLabel] = useState('JEE Math Problem Set');
  const [soundMode, setSoundMode] = useState('none');

  const todayMinutes = journalStorage.getTodayFocusMinutes();

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            soundEngine.playBell(528);
            journalStorage.logFocusSession(selectedMinutes, targetLabel);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedMinutes, targetLabel]);

  const handleStart = () => {
    soundEngine.playPop();
    setIsRunning(true);
  };

  const handlePause = () => {
    soundEngine.playPop();
    setIsRunning(false);
  };

  const handleReset = () => {
    soundEngine.playPop();
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const setPreset = (mins, label) => {
    soundEngine.playPop();
    setIsRunning(false);
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
    setTargetLabel(label);
  };

  const toggleSound = (mode) => {
    soundEngine.playPop();
    if (soundMode === mode) {
      soundEngine.stop();
      setSoundMode('none');
    } else {
      soundEngine.stop();
      if (mode === 'rain') soundEngine.playRain(0.04);
      if (mode === 'brown') soundEngine.playBrownNoise(0.05);
      if (mode === 'binaural') soundEngine.play40HzBinaural(0.06);
      setSoundMode(mode);
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = Math.round(((selectedMinutes * 60 - secondsLeft) / (selectedMinutes * 60)) * 100);

  return (
    <div className="journal-card p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" style={{ color: accentColor }} />
          <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
            Lock-In Focus Chamber
          </h2>
        </div>

        <div className="text-xs font-mono text-[var(--text-secondary)]">
          Today: <span className="font-semibold text-[var(--text-primary)]">{todayMinutes}m</span> locked in
        </div>
      </div>

      {/* Target Selector & Presets */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreset(25, 'Quick Pomodoro')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedMinutes === 25 
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)] font-semibold' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            25m Sprint
          </button>
          <button
            onClick={() => setPreset(45, 'JEE Math Equations Drill')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedMinutes === 45 
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)] font-semibold' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            45m JEE Math
          </button>
          <button
            onClick={() => setPreset(60, 'Product Code Build')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedMinutes === 60 
                ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)] font-semibold' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            60m Build
          </button>
        </div>

        {/* Ambient Sound Stream Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleSound('rain')}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundMode === 'rain' 
                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="Gentle Rain Audio"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleSound('brown')}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundMode === 'brown' 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="Brown Noise"
          >
            <Coffee className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleSound('binaural')}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundMode === 'binaural' 
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' 
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="40Hz Binaural Beats"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
            Target Focus
          </span>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {targetLabel}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {timeFormatted}
          </div>

          <div className="flex items-center gap-1.5">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm hover:opacity-90"
              >
                <Pause className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-sm hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
};

export default LockInTimer;
