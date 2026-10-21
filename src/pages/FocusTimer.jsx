import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, 
  Coffee, Brain, Clock, 
  CheckCircle2, ArrowRight, Volume2, VolumeX,
  Plus, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const PRESETS = [
  { label: 'Pomodoro', minutes: 25, type: 'focus', desc: 'Standard 25m sprint' },
  { label: 'Deep Sprint', minutes: 50, type: 'focus', desc: 'Extended 50m block' },
  { label: 'Short Break', minutes: 5, type: 'break', desc: '5m cognitive reset' },
  { label: 'Long Break', minutes: 15, type: 'break', desc: '15m recovery buffer' }
];

const FocusTimer = () => {
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [subjectTag, setSubjectTag] = useState('Mathematics');
  const [sessions, setSessions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchSessions = async () => {
    try {
      const list = await dataService.list('focus_sessions');
      if (list && Array.isArray(list)) {
        const sorted = [...list].sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at));
        setSessions(sorted.slice(0, 6));
      }
    } catch (e) {
      console.warn("Could not load focus sessions:", e);
    }
  };

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, mode, targetMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(targetMinutes * 60);
  };

  const selectPreset = (preset) => {
    setIsActive(false);
    setMode(preset.type);
    setTargetMinutes(preset.minutes);
    setTimeLeft(preset.minutes * 60);
  };

  const handleComplete = async () => {
    setIsActive(false);
    playChime();

    if (mode === 'focus') {
      const sessionData = {
        duration_minutes: targetMinutes,
        subject: subjectTag,
        completed_at: new Date().toISOString()
      };

      try {
        await dataService.create('focus_sessions', sessionData);
        fetchSessions();
      } catch (err) {
        console.warn("Session logging delayed:", err);
      }

      notificationService.send(
        "Focus Block Concluded",
        `Completed ${targetMinutes} minutes of focused study on ${subjectTag}. Take a breather!`,
        "success"
      );
      
      // Auto-switch to break
      setMode('break');
      setTargetMinutes(5);
      setTimeLeft(5 * 60);
    } else {
      notificationService.send("Recess Finished", "Ready for your next study sprint?", "info");
      setMode('focus');
      setTargetMinutes(25);
      setTimeLeft(25 * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const totalSeconds = targetMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  // Circular gauge coordinates (radius = 120, circumference = 2 * PI * 120 ≈ 753.98)
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Cognitive Ergonomics / Deep Work Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Focus Chronometer
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Structured interval training for NCERT curriculum mastery. Eliminate cognitive drift with high-precision focus sprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-lg border font-mono text-xs transition-colors flex items-center gap-2 ${
              soundEnabled ? 'border-white/20 bg-white/5 text-white' : 'border-white/10 text-zinc-500'
            }`}
            title="Toggle Audio Cues"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ff4625]" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] uppercase tracking-wider">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONSOLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT / CENTER: CIRCULAR CHRONOMETER */}
        <div className="lg:col-span-7 p-8 sm:p-12 border border-white/10 bg-[#0d0f14] rounded-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          
          {/* Subtle architectural crosshairs */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-[1px] bg-white top-1/2 absolute" />
            <div className="h-full w-[1px] bg-white left-1/2 absolute" />
          </div>

          {/* Mode Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#08090b] border border-white/10 rounded-full z-10">
            <span className={`w-2 h-2 rounded-full ${mode === 'focus' ? 'bg-[#ff4625] animate-pulse' : 'bg-emerald-400'}`} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">
              {mode === 'focus' ? 'Active Focus Sprint' : 'Restorative Recess'}
            </span>
          </div>

          {/* SVG Circular Chronometer Dial */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center z-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
              {/* Dial Track */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-white/5"
                strokeWidth="8"
                fill="none"
              />
              {/* Dial Progress Arc */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className={mode === 'focus' ? 'stroke-[#ff4625]' : 'stroke-emerald-400'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>

            {/* Central Time Display */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white select-none">
                {formattedTime}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 mt-2">
                Target: {targetMinutes}m · {subjectTag}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-4 z-10">
            <button
              onClick={resetTimer}
              className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-all active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTimer}
              className={`px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                isActive 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                  : 'bg-[#ff4625] hover:bg-[#ff5738] text-white border border-transparent'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isActive ? 'Pause Block' : 'Initiate Session'}</span>
            </button>
          </div>

          {/* Subject Directives */}
          <div className="flex items-center gap-2 pt-2 z-10 flex-wrap justify-center">
            {['Mathematics', 'Science', 'English', 'General Revision'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectTag(sub)}
                className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all border ${
                  subjectTag === sub
                    ? 'border-[#ff4625] bg-[#ff4625]/10 text-white font-bold'
                    : 'border-white/5 bg-[#08090b] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: PRESETS & SESSION HISTORY */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* INTERVAL PRESETS */}
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
                Interval Presets
              </span>
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((p) => {
                const isSelected = targetMinutes === p.minutes && mode === p.type;
                return (
                  <button
                    key={p.label}
                    onClick={() => selectPreset(p)}
                    className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-[#ff4625] bg-[#ff4625]/10 text-white'
                        : 'border-white/5 bg-[#08090b] hover:border-white/15 text-zinc-300'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-clash text-sm font-bold uppercase">{p.label}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{p.minutes}m</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 leading-tight">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SESSION LOGS */}
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
                Completed Sprints
              </span>
              <span className="font-mono text-[10px] text-zinc-500">{sessions.length} logged</span>
            </div>

            {sessions.length === 0 ? (
              <div className="p-6 border border-white/5 bg-[#08090b] rounded-xl text-center text-zinc-500 font-mono text-xs">
                No focus blocks logged today. Complete a session to populate records.
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((sess, idx) => (
                  <div
                    key={sess.id || idx}
                    className="p-3 border border-white/5 bg-[#08090b] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#ff4625]" />
                      <div>
                        <span className="text-white font-bold block">{sess.subject || 'Deep Study'}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {sess.duration_minutes || 25} minutes duration
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400 bg-white/5 px-2 py-1 rounded">
                      {sess.completed_at ? new Date(sess.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default FocusTimer;