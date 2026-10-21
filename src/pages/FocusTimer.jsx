import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, 
  Coffee, Brain, Clock, 
  CheckCircle2, ArrowRight, Volume2, VolumeX,
  Zap, Compass, Sparkles, Wind, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService, PILLARS } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const PRESETS = [
  { 
    id: 'ultradian-90', 
    label: '90m Ultradian', 
    minutes: 90, 
    type: 'focus', 
    badge: 'Huberman Peak',
    desc: 'Full 90-minute biological focus cycle. Optimal for neuroplasticity and deep creative synthesis.' 
  },
  { 
    id: 'sprint-50', 
    label: '50m Deep Sprint', 
    minutes: 50, 
    type: 'focus', 
    badge: 'Standard Deep',
    desc: 'Uninterrupted maker block. Zero tabs, zero phone, single directive execution.' 
  },
  { 
    id: 'admin-25', 
    label: '25m Quick Pomodoro', 
    minutes: 25, 
    type: 'focus', 
    badge: 'Logistics',
    desc: 'Rapid execution for admin, emails, logistics, and cleaning up shallow tasks.' 
  },
  { 
    id: 'nsdr-15', 
    label: '15m NSDR / Reset', 
    minutes: 15, 
    type: 'break', 
    badge: 'Panoramic Rest',
    desc: 'Non-Sleep Deep Rest. Relax eyes into panoramic vision. Double inhale, long exhale.' 
  },
  { 
    id: 'micro-5', 
    label: '5m Micro Buffer', 
    minutes: 5, 
    type: 'break', 
    badge: 'Hydrate',
    desc: 'Step away from screen. Stand up, drink water, reset posture.' 
  }
];

const FocusTimer = () => {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [targetMinutes, setTargetMinutes] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [selectedPillar, setSelectedPillar] = useState('Craft');
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
        setSessions(sorted.slice(0, 5));
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
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
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
    setSelectedPreset(preset);
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
        pillar: selectedPillar,
        completed_at: new Date().toISOString()
      };

      try {
        await dataService.create('focus_sessions', sessionData);
        fetchSessions();
      } catch (err) {
        console.warn("Session logging delayed:", err);
      }

      notificationService.send(
        "Ultradian Bout Completed",
        `Concluded ${targetMinutes} minutes on ${selectedPillar}. Now execute a 15-minute NSDR / panoramic recovery break!`,
        "success"
      );
    } else {
      notificationService.send(
        "Recovery Cycle Complete",
        `Nervous system restored. Ready for your next high-leverage block.`,
        "info"
      );
    }
  };

  // Time format calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Huberman Ultradian Chronometer // Deep Work Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Focus Chronometer
          </h1>
          <p className="text-[#52504a] text-xs sm:text-sm mt-1 max-w-xl">
            Human neuroplasticity and cognitive output naturally operate on 90-minute cycles. Structure deep execution with scientific recovery intervals.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white rounded-xl text-[#52504a] flex items-center gap-2 text-xs font-mono self-start sm:self-auto"
          title="Toggle completion sound chime"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1b3b2b]" /> : <VolumeX className="w-4 h-4 text-[#827f76]" />}
          <span className="text-[10px] uppercase font-bold">{soundEnabled ? 'Chime On' : 'Muted'}</span>
        </button>
      </header>

      {/* ── PRESET CADENCE SELECTOR ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PRESETS.map((p) => {
          const isSelected = selectedPreset.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => selectPreset(p)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected 
                  ? 'border-[#1b3b2b] bg-[#f4f7f4] ring-1 ring-[#1b3b2b] shadow-xs' 
                  : 'border-[#e5e1d5] bg-white hover:border-[#827f76]'
              }`}
            >
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#1b3b2b] font-bold">
                {p.badge}
              </div>
              <div className="font-serif font-bold text-sm text-[#1a1917] mt-0.5">
                {p.label}
              </div>
              <div className="text-[10px] text-[#827f76] line-clamp-1 mt-1">
                {p.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── MAIN CHRONOMETER CHASSIS ─────────────────────────────────── */}
      <div className="p-8 sm:p-12 border border-[#e5e1d5] bg-white rounded-3xl shadow-[0_4px_30px_rgba(27,59,43,0.05)] text-center relative overflow-hidden">
        
        {/* Pillar Tag Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#827f76] font-bold">
            Target Pillar:
          </span>
          <div className="flex items-center gap-1.5 bg-[#fbfbfa] border border-[#e5e1d5] p-1 rounded-xl">
            {PILLARS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                  selectedPillar === p.id 
                    ? 'bg-[#1b3b2b] text-white' 
                    : 'text-[#827f76] hover:text-[#1a1917]'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Digital Chronometer Display */}
        <div className="my-6">
          <div className="font-mono font-bold text-7xl sm:text-8xl md:text-9xl text-[#1a1917] tracking-tight tabular-nums select-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          <div className="text-xs font-mono text-[#827f76] uppercase tracking-widest mt-3">
            {mode === 'focus' ? '⚡ Active Focus Window' : '🌿 Recovery / NSDR Reset'}
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full max-w-md mx-auto bg-[#f0ece1] h-1.5 rounded-full overflow-hidden my-6">
          <div 
            className="h-full bg-[#1b3b2b] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Guided Recovery / Focus Guidance */}
        {mode === 'break' && (
          <div className="max-w-md mx-auto p-4 border border-[#d4c39e] bg-[#fbf8f0] rounded-xl text-left space-y-1 mb-6 text-xs text-[#52504a]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8a4b16] font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>Panoramic Gaze & Physiological Sigh</span>
            </div>
            <p>
              Relax your ocular focal point. Look far into the distance or peripheral edges. Inhale twice through the nose, then complete a slow, extended exhale through the mouth to lower autonomic arousal.
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={resetTimer}
            className="p-3.5 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white rounded-2xl text-[#52504a] hover:text-[#1a1917] transition-all"
            title="Reset interval"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-8 py-4 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-sm font-bold rounded-2xl shadow-[0_4px_16px_rgba(27,59,43,0.25)] active:scale-95 transition-all flex items-center gap-3"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isActive ? 'Pause Interval' : 'Engage Focus'}</span>
          </button>
        </div>

      </div>

      {/* ── RECENT COMPLETED BOUTS ─────────────────────────────────── */}
      <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1a1917]">
            Recent Deep Bouts
          </div>
          <span className="font-mono text-[10px] text-[#827f76]">
            {sessions.length} logged bouts
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-xs font-mono text-[#827f76] py-3 text-center">
            No focus blocks logged yet. Complete your first 90-minute bout!
          </div>
        ) : (
          <div className="divide-y divide-[#f0ece1]">
            {sessions.map((s, idx) => (
              <div key={s.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1b3b2b]" />
                  <span className="font-serif font-bold text-[#1a1917]">
                    {s.duration_minutes || 25}m Deep Bout
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#f4f1ea] text-[#52504a]">
                    {s.pillar || 'Craft'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#827f76]">
                  {(s.completed_at || s.created_at || '').substring(0, 16).replace('T', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default FocusTimer;
