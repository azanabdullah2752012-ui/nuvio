import React, { useState, useEffect } from 'react';
import { 
  Sword, Shield, Zap, Heart, 
  Trophy, AlertCircle, Timer, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const BossRaid = () => {
  const [gameState, setGameState] = useState('lobby'); 
  const [bossHp, setBossHp] = useState(10000);
  const [totalParticipants, setTotalParticipants] = useState(1);
  const [playerHp, setPlayerHp] = useState(100);
  const [loading, setLoading] = useState(true);

  const BOSS_NAME = "The procrastination dragon 🐉";
  const MAX_BOSS_HP = 10000;

  useEffect(() => {
    fetchGlobalStatus();
  }, []);

  const fetchGlobalStatus = async () => {
    setLoading(true);
    // boss hp is linked to (total users * 1000) - total collective xp
    const { data: profiles } = await supabase.from('profiles').select('xp');
    
    if (profiles) {
      const totalXp = profiles.reduce((sum, p) => sum + (p.xp || 0), 0);
      const participantCount = profiles.length;
      
      const currentHp = Math.max(0, MAX_BOSS_HP - (totalXp % MAX_BOSS_HP));
      setBossHp(currentHp);
      setTotalParticipants(participantCount);
    }
    setLoading(false);
  };

  const startRaid = () => {
    setGameState('fighting');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {gameState === 'lobby' && (
        <div className="nv-card bg-gradient-to-br from-nuvio-red/20 to-background-card p-12 text-center space-y-8 border-nuvio-red/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-nuvio-red/50" />
          
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-nuvio-red/20 rounded-full flex items-center justify-center animate-pulse">
              <Sword className="w-16 h-16 text-nuvio-red" />
            </div>
            <div className="absolute -top-4 -right-4 bg-nuvio-orange p-3 rounded-2xl shadow-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Cluster Boss Raid</h1>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              Academic energy is surging! Join <span className="text-white font-bold">{totalParticipants} students</span> in defeating **{BOSS_NAME}**. Damage is dealt as you earn XP in the roadmap!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto py-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-white">{bossHp.toLocaleString()}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">DRAGON HP</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-nuvio-purple-400">{totalParticipants}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">HEROES</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-nuvio-orange">WEEKLY</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">CYCLE</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-lg font-black text-nuvio-green">500</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">REWARD Tokens</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 max-w-md mx-auto">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(bossHp / MAX_BOSS_HP) * 100}%` }}
                className="h-full bg-gradient-to-r from-nuvio-red to-nuvio-orange"
              />
            </div>
            <p className="text-[10px] font-black text-nuvio-red uppercase tracking-[0.2em] animate-pulse">Boss HP Linked to Global XP Cache 🛰️</p>
          </div>

          <div className="pt-6">
             <button onClick={() => window.location.hash = '/homework'} className="nv-btn-primary px-12 py-4 h-16 text-xl shadow-2xl shadow-nuvio-red/30 bg-nuvio-red hover:bg-nuvio-red/80">
               EARN XP TO ATTACK
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BossRaid;
