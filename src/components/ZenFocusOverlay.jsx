import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { dataService } from '../services/dataService';

const PRESETS = [
  { label: '25m Sprint', minutes: 25 },
  { label: '50m Deep Block', minutes: 50 },
  { label: '90m Ultradian', minutes: 90 },
  { label: '5m Reset', minutes: 5 }
];

const ZenFocusOverlay = ({ isOpen, onClose, taskTitle, onCompleteSession }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundMode, setSoundMode] = useState('none'); // 'none' | 'rain' | 'brown' | 'binaural'
  const timerRef = useRef(null);

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
  }, [isActive, selectedMinutes]);

  const handleFinish = () => {
    setIsActive(false);
    soundEngine.stop();
    setSoundMode('none');
    soundEngine.playBell(528);
    dataService.logFocusSession(selectedMinutes);
    if (onCompleteSession) onCompleteSession(selectedMinutes);
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
    setTimeLeft(selectedMinutes * 60);
    soundEngine.stop();
    setSoundMode('none');
  };

  const selectPreset = (mins) => {
    setIsActive(false);
    soundEngine.stop();
    setSoundMode('none');
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-[#fbfbfa] flex flex-col justify-between p-6 sm:p-12 animate-fadeIn font-sans selection:bg-[#1b3b2b] selection:text-white">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1b3b2b] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#8e8d8a]">
            Zen Focus
          </span>
        </div>

        {/* Ambient Sound Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f0eee6] rounded-2xl border border-[#e8e6df]">
          <button
            onClick={() => toggleSound('rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              soundMode === 'rain' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#8e8d8a] hover:text-[#1d1d1f]'
            }`}
          >
            🌧️ Rain
          </button>
          <button
            onClick={() => toggleSound('brown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              soundMode === 'brown' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#8e8d8a] hover:text-[#1d1d1f]'
            }`}
          >
            ☕ Brown Noise
          </button>
          <button
            onClick={() => toggleSound('binaural')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              soundMode === 'binaural' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#8e8d8a] hover:text-[#1d1d1f]'
            }`}
          >
            ⚡ 40Hz
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#f0eee6] text-[#8e8d8a] hover:text-[#1d1d1f] transition-colors"
          title="Exit Zen mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Focus Center */}
      <div className="max-w-xl mx-auto w-full text-center space-y-8 my-auto">
        
        {/* Active Task Prompt */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8e8d8a]">
            Current Directive
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#1d1d1f] max-w-md mx-auto line-clamp-2">
            {taskTitle || "Undistracted Single-Task Execution"}
          </h2>
        </div>

        {/* Big Apple-Style Minimal Timer */}
        <div className="relative py-4">
          <div className="text-8xl sm:text-9xl font-mono font-light tracking-tight text-[#1d1d1f] select-none tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          {/* Subtle Progress Arc */}
          <div className="w-48 sm:w-64 h-1 bg-[#ebe9e1] rounded-full mx-auto mt-6 overflow-hidden">
            <div 
              className="h-full bg-[#1b3b2b] transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              onClick={() => selectPreset(p.minutes)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                selectedMinutes === p.minutes 
                  ? 'bg-[#1b3b2b] text-white shadow-xs font-medium' 
                  : 'bg-white border border-[#e8e6df] text-[#8e8d8a] hover:border-[#1d1d1f] hover:text-[#1d1d1f]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-full bg-white border border-[#e8e6df] text-[#8e8d8a] hover:text-[#1d1d1f] hover:border-[#1d1d1f] transition-all"
            title="Reset interval"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-10 py-4 bg-[#1b3b2b] hover:bg-[#28553e] text-white font-sans text-sm font-semibold rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2.5"
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isActive ? 'Pause' : 'Focus'}</span>
          </button>
        </div>

      </div>

      {/* Subtle Footer Quote */}
      <div className="text-center max-w-sm mx-auto text-[11px] text-[#8e8d8a] font-sans">
        "Concentration is the secret of strength." — Ralph Waldo Emerson
      </div>

    </div>
  );
};

export default ZenFocusOverlay;
