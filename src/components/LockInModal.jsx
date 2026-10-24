import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Check, Flame } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { dataService } from '../services/dataService';

const PRESETS = [
  { label: '25m Sprint', minutes: 25 },
  { label: '45m Deep Study', minutes: 45 },
  { label: '60m Forge Build', minutes: 60 },
  { label: '15m Reset', minutes: 15 }
];

const LockInModal = ({ isOpen, onClose, defaultMission, onComplete }) => {
  const [minutes, setMinutes] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundMode, setSoundMode] = useState('none'); // 'rain' | 'brown' | 'binaural' | 'none'
  const [missionLabel, setMissionLabel] = useState(defaultMission || 'Deep Lock-In Session');
  const timerRef = useRef(null);

  useEffect(() => {
    if (defaultMission) setMissionLabel(defaultMission);
  }, [defaultMission]);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      soundEngine.stop();
      setSoundMode('none');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, minutes]);

  const handleFinish = () => {
    setIsActive(false);
    soundEngine.stop();
    setSoundMode('none');
    soundEngine.playBell(528);
    dataService.logSession(minutes, missionLabel);
    if (onComplete) onComplete();
  };

  const toggleTimer = () => {
    const next = !isActive;
    setIsActive(next);
    if (!next) {
      soundEngine.stop();
      setSoundMode('none');
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    soundEngine.stop();
    setSoundMode('none');
  };

  const selectPreset = (m) => {
    setIsActive(false);
    soundEngine.stop();
    setSoundMode('none');
    setMinutes(m);
    setTimeLeft(m * 60);
  };

  const toggleSound = (mode) => {
    if (soundMode === mode) {
      soundEngine.stop();
      setSoundMode('none');
    } else {
      if (mode === 'rain') soundEngine.playRain(0.04);
      else if (mode === 'brown') soundEngine.playBrownNoise(0.05);
      else if (mode === 'binaural') soundEngine.play40HzBinaural(0.07);
      setSoundMode(mode);
    }
  };

  if (!isOpen) return null;

  const displayMins = Math.floor(timeLeft / 60);
  const displaySecs = timeLeft % 60;
  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1115]/90 backdrop-blur-md flex flex-col justify-between p-6 sm:p-12 animate-fadeIn font-sans text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold">
            LOCK-IN CHAMBER // ZERO DISTRACTIONS
          </span>
        </div>

        {/* Audio Lab */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => toggleSound('rain')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              soundMode === 'rain' ? 'bg-white text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🌧️ Rain
          </button>
          <button
            onClick={() => toggleSound('brown')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              soundMode === 'brown' ? 'bg-white text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ☕ Brown Noise
          </button>
          <button
            onClick={() => toggleSound('binaural')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              soundMode === 'binaural' ? 'bg-emerald-500 text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ 40Hz Focus
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="Exit lock-in"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Focus Center */}
      <div className="max-w-xl mx-auto w-full text-center space-y-8 my-auto">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            Target Objective
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white max-w-md mx-auto line-clamp-2">
            {missionLabel}
          </h2>
        </div>

        {/* Big Digital Timer Display */}
        <div className="space-y-4">
          <div className="text-8xl sm:text-9xl font-mono font-light tracking-tight text-white select-none tabular-nums">
            {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
          </div>

          <div className="w-64 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              onClick={() => selectPreset(p.minutes)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                minutes === p.minutes 
                  ? 'bg-emerald-500 text-black font-bold shadow-sm' 
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-sans text-sm font-bold rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isActive ? 'Pause' : 'Engage'}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center max-w-sm mx-auto text-xs font-mono text-zinc-500">
        "Waiting For Love" mindset • Build, Ship, Repeat.
      </div>

    </div>
  );
};

export default LockInModal;
