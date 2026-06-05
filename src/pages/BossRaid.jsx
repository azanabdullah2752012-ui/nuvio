import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Heart, Trophy, Lock, CheckCircle2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const BOSSES = [
  {
    key: 'dragon',
    name: 'Number Systems Dragon 🐉',
    subject: 'Math',
    desc: 'Breathes decimal flames. Requires active recall in Mathematics to conquer.',
    maxHp: 1000,
    reward: { coins: 300, xp: 200 },
    icon: '🐉',
    color: 'from-nuvio-red to-nuvio-orange'
  },
  {
    key: 'monster',
    name: 'Matter Monster 🧪',
    subject: 'Science',
    desc: 'Formed from chaotic elements. Explores scientific queries to dissolve its form.',
    maxHp: 2000,
    reward: { coins: 600, xp: 400 },
    icon: '🧪',
    color: 'from-nuvio-purple-500 to-pink-500'
  },
  {
    key: 'titan',
    name: 'Geography Titan 🌎',
    subject: 'Social Studies',
    desc: 'An ancient mountain colossal. Master global geography and history to bring it down.',
    maxHp: 5000,
    reward: { coins: 1000, xp: 800 },
    icon: '🌎',
    color: 'from-nuvio-blue to-teal-500'
  }
];

const BossRaid = () => {
  const [user, setUser] = useState(authService.me());
  const [bossProgress, setBossProgress] = useState({
    dragon: { hp: 1000, max: 1000, status: 'active' },
    monster: { hp: 2000, max: 2000, status: 'locked' },
    titan: { hp: 5000, max: 5000, status: 'locked' }
  });

  useEffect(() => {
    const currentUser = authService.me();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.boss_chapter_progress) {
        setBossProgress(currentUser.boss_chapter_progress);
      }
    }

    const handleUpdate = (e) => {
      setUser(e.detail);
      if (e.detail.boss_chapter_progress) {
        setBossProgress(e.detail.boss_chapter_progress);
      }
    };
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  const handleClaimBounty = async (bossKey) => {
    const boss = BOSSES.find(b => b.key === bossKey);
    const state = bossProgress[bossKey];
    if (!boss || !state || state.hp > 0 || state.status !== 'active') return;

    // Award Bounty
    await xpService.awardXp(boss.reward.xp, `Defeated Boss: ${boss.name}`);
    await authService.addTokens(boss.reward.coins);

    // Update progress
    const updatedProgress = { ...bossProgress };
    updatedProgress[bossKey].status = 'defeated';

    // Unlock next boss
    if (bossKey === 'dragon') {
      updatedProgress.monster.status = 'active';
    } else if (bossKey === 'monster') {
      updatedProgress.titan.status = 'active';
    }

    setBossProgress(updatedProgress);
    await authService.updateMe({ boss_chapter_progress: updatedProgress });

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    notificationService.send(
      "Bounty Claimed! 💰",
      `Received +${boss.reward.coins} Coins and +${boss.reward.xp} XP! Next chapter boss unlocked.`,
      "success"
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <Sword className="w-10 h-10 text-nuvio-red" />
          Academic Boss Raids
        </h1>
        <p className="text-text-secondary font-medium mt-1">
          Study to deal damage to massive chapter bosses and claim legendary loot.
        </p>
      </header>

      {/* Boss Lists */}
      <div className="space-y-6">
        {BOSSES.map((boss) => {
          const state = bossProgress[boss.key] || { hp: boss.maxHp, max: boss.maxHp, status: 'locked' };
          const hpPercent = Math.min(100, (state.hp / boss.maxHp) * 100);
          
          const isActive = state.status === 'active';
          const isDefeated = state.status === 'defeated';
          const isLocked = state.status === 'locked';

          return (
            <div
              key={boss.key}
              className={`nv-card p-8 bg-white/[0.01] border-white/5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative overflow-hidden transition-all
                ${isDefeated ? 'opacity-65 border-white/5' : isActive ? 'border-nuvio-red/35 shadow-lg shadow-nuvio-red/5 bg-nuvio-red/[0.01]' : 'opacity-50 border-white/5'}
              `}
            >
              {isDefeated && (
                <div className="absolute top-0 right-0 bg-nuvio-green/20 text-nuvio-green text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl border-l border-b border-white/5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Defeated
                </div>
              )}

              {/* Boss Info */}
              <div className="flex items-start sm:items-center gap-6 flex-1 min-w-0">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 border transition-all
                  ${isDefeated ? 'bg-white/5 border-white/5' : isActive ? 'bg-nuvio-red/10 border-nuvio-red/25 text-white animate-pulse' : 'bg-white/5 border-white/5 text-text-muted'}
                `}>
                  {isLocked ? <Lock className="w-8 h-8 text-text-muted/50" /> : boss.icon}
                </div>

                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded bg-white/5 text-text-muted tracking-wider">{boss.subject}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight truncate">{boss.name}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-lg font-semibold">{boss.desc}</p>
                  
                  {!isLocked && (
                    <div className="space-y-1.5 pt-2 max-w-md">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase text-text-muted tracking-wider">
                        <span>Boss HP</span>
                        <span>{state.hp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${hpPercent}%` }}
                          className={`h-full rounded-full bg-gradient-to-r ${boss.color}`}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 shrink-0">
                {isLocked ? (
                  <div className="px-6 py-3.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 justify-center">
                    <Lock className="w-4 h-4" /> Locked
                  </div>
                ) : isDefeated ? (
                  <div className="px-6 py-3.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-nuvio-green uppercase tracking-[0.2em] flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-nuvio-green" /> Conquered
                  </div>
                ) : state.hp === 0 ? (
                  <button
                    onClick={() => handleClaimBounty(boss.key)}
                    className="px-8 py-4 bg-nuvio-yellow hover:bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-nuvio-yellow/25 transition-all animate-pulse flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" /> Claim Bounty
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.hash = '/subject-library'}
                    className="px-8 py-4 bg-nuvio-red hover:bg-white hover:text-black text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-nuvio-red/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Study to Attack
                  </button>
                )}
                
                {!isLocked && (
                  <div className="text-center text-[8px] font-bold text-text-muted uppercase tracking-wider mt-1">
                    Loot: +{boss.reward.coins} Coins & +{boss.reward.xp} XP
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BossRaid;
