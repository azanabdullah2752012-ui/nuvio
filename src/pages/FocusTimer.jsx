import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, 
  Settings, Coffee, Brain, 
  Trash2, ChevronRight, Zap, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break
  const [sessions, setSessions] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(5);
    if (data) setSessions(data);
  };

  const toggleTimer = () => {
    if (isActive) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              handleComplete();
              return 0;
            }
            setMinutes(m => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const handleComplete = async () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    
    if (mode === 'focus') {
      const xp = 150;
      const tokens = 30;
      const user = authService.me();

      // 1. Save to Cloud
      const { error } = await supabase.from('focus_sessions').insert([{
        user_id: user.id,
        duration_minutes: 25,
        xp_earned: xp,
        tokens_earned: tokens
      }]);

      if (!error) {
        // 2. Award XP & Tokens
        xpService.awardXP(xp, "Deep Focus Session Complete");
        authService.addTokens(tokens);
        fetchSessions();
        alert(`Focus Session Complete! Awarded ${xp} XP & ${tokens} Tokens! ⚡`);
      }
    }

    setMode(mode === 'focus' ? 'break' : 'focus');
    setMinutes(mode === 'focus' ? 5 : 25);
    setSeconds(0);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
      <div className="lg:col-span-2 space-y-8">
        <div className="nv-card p-12 text-center bg-gradient-to-br from-nuvio-purple-600/10 to-transparent border-nuvio-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-30">
            {mode === 'focus' ? <Brain className="w-12 h-12" /> : <Coffee className="w-12 h-12" />}
          </div>
          
          <div className="space-y-4 mb-10">
            <h1 className="text-xl font-black text-nuvio-purple-400 uppercase tracking-widest">{mode === 'focus' ? 'DEEP FOCUS ACTIVE' : 'RECHARGE BREAK'}</h1>
            <div className="text-[120px] font-black text-white leading-none tracking-tighter tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={resetTimer} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-text-muted hover:bg-white/10 transition-all">
              <RotateCcw className="w-8 h-8" />
            </button>
            <button onClick={toggleTimer} className="w-32 h-32 bg-nuvio-purple-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-nuvio-purple-500/30 hover:scale-105 active:scale-95 transition-all">
              {isActive ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
            </button>
            <button className="p-6 bg-white/5 border border-white/10 rounded-3xl text-text-muted hover:bg-white/10 transition-all">
              <Settings className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="nv-card p-8 space-y-6 border-white/5">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-nuvio-yellow" /> Neural Sessions
          </h3>
          <div className="space-y-4">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div>
                  <div className="text-xs font-black text-white uppercase">{s.duration_minutes}m Focus</div>
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                    {new Date(s.completed_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-nuvio-green">+{s.xp_earned} XP</div>
                  <div className="text-[10px] text-nuvio-yellow font-black">+{s.tokens_earned} T</div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="py-10 text-center opacity-30 italic text-xs uppercase font-bold tracking-widest">No cloud sessions detected...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
