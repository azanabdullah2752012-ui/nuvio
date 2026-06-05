import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { gamificationService } from '../services/gamificationService';

const Achievements = () => {
  const [user, setUser] = useState(authService.me());
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setUser(authService.me());
    setAchievements(gamificationService.getAchievements());

    const handleUpdate = () => {
      setUser(authService.me());
    };
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  if (!user) return null;

  const unlockedCount = user.achievements?.length || 0;
  const totalCount = achievements.length;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Award className="w-10 h-10 text-nuvio-purple-400" />
            Academy Badges
          </h1>
          <p className="text-text-secondary font-medium mt-1">
            Prove your academic excellence and claim prestigious ranks.
          </p>
        </div>
        
        <div className="nv-card bg-white/5 border-white/5 py-4 px-6 flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-black text-white">{unlockedCount} / {totalCount}</div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Unlocked</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-nuvio-purple-500/10 flex items-center justify-center border border-nuvio-purple-500/20">
            <Award className="w-6 h-6 text-nuvio-purple-400" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="nv-card p-6 bg-white/[0.01] border-white/5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">
          <span>Overall Unlocks</span>
          <span>{Math.round((unlockedCount / (totalCount || 1)) * 100)}%</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / (totalCount || 1)) * 100}%` }}
            className="h-full bg-gradient-to-r from-nuvio-purple-500 to-nuvio-cyan"
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = user.achievements?.includes(ach.id);
          
          // Calculate active progress towards target
          const value = ach.stat === 'level' ? user.level : 
                        ach.stat === 'streak' ? user.streak : 
                        user[ach.stat] || 0;
                        
          const progressPercent = Math.min(100, (value / ach.target) * 100);

          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -2 }}
              className={`nv-card p-8 border-white/5 bg-white/[0.01] transition-all flex items-start gap-6 relative overflow-hidden group
                ${isUnlocked ? 'hover:bg-white/[0.03]' : 'opacity-60'}
              `}
            >
              {isUnlocked && (
                <div className="absolute top-0 right-0 bg-nuvio-purple-500/25 text-nuvio-purple-300 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl border-l border-b border-white/5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-nuvio-purple-400" /> Earned
                </div>
              )}

              {/* Icon / Emblem */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border transition-all
                ${isUnlocked 
                  ? 'bg-nuvio-purple-500/10 border-nuvio-purple-500/20 text-white shadow-xl shadow-nuvio-purple-500/5' 
                  : 'bg-white/5 border-white/5 text-text-muted'
                }
              `}>
                {isUnlocked ? ach.icon : <Lock className="w-6 h-6 text-text-muted/60" />}
              </div>

              {/* Content */}
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight transition-colors
                    ${isUnlocked ? 'text-white' : 'text-text-muted'}
                  `}>
                    {ach.title}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">{ach.desc}</p>
                </div>

                {/* Progress bar for locked, or details for unlocked */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-text-muted tracking-wider">
                    <span>Progress</span>
                    <span>{value.toLocaleString()} / {ach.target.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500
                        ${isUnlocked ? 'bg-nuvio-purple-500' : 'bg-white/10'}
                      `}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
