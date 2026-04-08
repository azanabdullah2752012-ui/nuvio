import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, Play, Pause, 
  RotateCcw, Coffee, Zap, 
  Award, Bell, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { xpService } from '../services/xpService';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break
  const [totalMinutes, setTotalMinutes] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (mode === 'focus') setTotalMinutes(prev => prev + (1/60));
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, mode]);

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      xpService.awardXp(50, 'Completed Focus Session');
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
    // Simulation: Play sound
    console.log("Timer Complete!");
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <Timer className="w-10 h-10 text-nuvio-blue" />
            Hyper-Focus
          </h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2 opacity-60">Optimizing cognitive output</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <Zap className="w-5 h-5 text-nuvio-yellow" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-text-muted uppercase leading-none">Total Focused Today</span>
                 <span className="text-sm font-black text-white leading-none mt-1">{Math.floor(totalMinutes)}m</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Timer Control */}
        <div className="lg:col-span-2 nv-card p-12 flex flex-col items-center justify-center relative overflow-hidden space-y-10">
          <div className="absolute inset-0 bg-nuvio-blue/5 blur-3xl rounded-full" />
          
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" cy="50%" r="48%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                className="text-white/5" 
              />
              <motion.circle 
                cx="50%" cy="50%" r="48%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeDasharray="100 100"
                strokeLinecap="round"
                className="text-nuvio-blue" 
                style={{ 
                  pathLength: progress / 100,
                  transition: { duration: 0.5 }
                }}
              />
            </svg>
            
            <div className="text-center z-10">
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] mb-2">{mode} session</div>
              <div className="text-7xl md:text-8xl font-black text-white tabular-nums tracking-tighter">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={resetTimer}
              className="p-5 bg-white/5 border border-white/10 rounded-3xl text-text-muted hover:text-white transition-all shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={toggleTimer}
              className={`
                w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all scale-110
                ${isRunning ? 'bg-nuvio-orange text-white ring-4 ring-nuvio-orange/20' : 'bg-nuvio-blue text-white ring-4 ring-nuvio-blue/20'}
              `}
            >
              {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
            </button>
            <button className="p-5 bg-white/5 border border-white/10 rounded-3xl text-text-muted hover:text-white transition-all shadow-lg">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Rewards & Stats */}
        <div className="space-y-6">
          <div className="nv-card p-8 border-nuvio-blue/20 bg-nuvio-blue/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nuvio-blue/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-nuvio-blue" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Active Bounty</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Complete this 25-minute focus session without switching tabs to earn <span className="text-white font-black">+50 XP</span> and <span className="text-nuvio-blue font-black">5 Era Tokens</span>.
            </p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-nuvio-blue" style={{ width: '45%' }} />
            </div>
          </div>

          <div className="nv-card p-0 border-white/5 overflow-hidden">
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Recent Sessions</h3>
              <Bell className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Calculus Study', time: '25:00', xp: '+50' },
                { label: 'Short Break', time: '05:00', xp: '+0' },
                { label: 'History Essay', time: '12:45', xp: '+20' },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-text-primary">{session.label}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase">{session.time}</div>
                  </div>
                  <div className="text-[10px] font-black text-nuvio-green">{session.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
