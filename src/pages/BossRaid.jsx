import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Zap, Coins, Lock, ChevronRight, Trophy, Star } from 'lucide-react';
import { authService } from '../services/authService';
import { gamificationService, BOSSES, DEFAULT_BOSS_PROGRESS } from '../services/gamificationService';
import { notificationService } from '../services/notificationService';
import confetti from 'canvas-confetti';

const SUBJECT_META = {
  math:    { label: 'Mathematics',     color: 'from-blue-500 to-cyan-400',    glow: 'shadow-blue-500/30',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400'    },
  science: { label: 'Science',         color: 'from-green-500 to-emerald-400', glow: 'shadow-green-500/30',   bg: 'bg-green-500/10',   border: 'border-green-500/30',   text: 'text-green-400'   },
  social:  { label: 'Social Studies',  color: 'from-purple-500 to-pink-400',   glow: 'shadow-purple-500/30',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400'  },
};

const BossCard = ({ boss, progress, onClaim, isSelected, onSelect }) => {
  const bossProgress = progress[boss.id] || { hp: boss.hp, max: boss.hp, status: 'locked', claimed: false };
  const meta = SUBJECT_META[boss.subject];
  const isLocked   = bossProgress.status === 'locked';
  const isDefeated = bossProgress.hp <= 0 && !bossProgress.claimed;
  const isClaimed  = bossProgress.claimed || bossProgress.status === 'defeated';
  const hpPct = Math.max(0, (bossProgress.hp / bossProgress.max) * 100);

  return (
    <motion.div
      layout
      onClick={() => !isLocked && onSelect(boss.id)}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? `${meta.bg} ${meta.border} shadow-xl ${meta.glow}`
          : isLocked
            ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed grayscale'
            : isClaimed
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
      }`}
    >
      {/* Chain number badge */}
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-text-muted">
        {boss.chain + 1}
      </div>

      <div className="flex items-center gap-4">
        {/* Emoji */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${meta.bg} border ${meta.border} flex-shrink-0`}>
          {isLocked ? '🔒' : boss.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${meta.text}`}>{meta.label}</div>
          <h3 className={`text-sm font-black uppercase tracking-tight truncate ${isLocked ? 'text-text-muted' : 'text-white'}`}>
            {boss.name}
          </h3>

          {/* HP bar */}
          {!isLocked && !isClaimed && (
            <div className="mt-2">
              <div className="flex justify-between text-[9px] text-text-muted font-black mb-1">
                <span>HP</span>
                <span>{bossProgress.hp.toLocaleString()} / {bossProgress.max.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    hpPct > 50 ? 'from-red-500 to-rose-400' :
                    hpPct > 25 ? 'from-orange-500 to-amber-400' : 'from-red-800 to-red-600'
                  }`}
                  animate={{ width: `${hpPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {isClaimed && (
            <div className="mt-2 text-[10px] font-black text-green-400 uppercase tracking-widest">✓ Defeated & Claimed</div>
          )}
          {isDefeated && (
            <div className="mt-2 text-[10px] font-black text-amber-400 uppercase tracking-widest animate-pulse">⚡ Claim Reward!</div>
          )}
          {isLocked && (
            <div className="mt-2 text-[10px] font-black text-text-muted uppercase tracking-widest">Defeat previous boss to unlock</div>
          )}
        </div>
      </div>

      {/* Rewards preview */}
      {!isLocked && (
        <div className="flex gap-3 mt-4 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1 text-[10px] font-black text-amber-400">
            <Zap className="w-3 h-3" /> +{boss.rewards.xp} XP
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black text-yellow-400">
            <Coins className="w-3 h-3" /> +{boss.rewards.coins} Coins
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black text-purple-400">
            <Star className="w-3 h-3" /> {boss.rewards.badge} Badge
          </span>
        </div>
      )}

      {/* Claim button overlay */}
      {isDefeated && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={e => { e.stopPropagation(); onClaim(boss.id); }}
          className={`mt-4 w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest bg-gradient-to-r ${meta.color} text-white shadow-lg`}
        >
          ⚔️ Claim Victory Rewards
        </motion.button>
      )}
    </motion.div>
  );
};

const BossRaid = () => {
  const [user, setUser] = useState(authService.me());
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [damageInput, setDamageInput] = useState('');
  const [loading, setLoading] = useState(false);

  const progress = { ...DEFAULT_BOSS_PROGRESS, ...(user?.boss_chapter_progress || {}) };

  useEffect(() => {
    const handleUpdate = (e) => {
      setUser(e.detail);
    };
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  const subjectGroups = ['math', 'science', 'social'];

  const handleDealDamage = async (subject) => {
    const dmg = parseInt(damageInput);
    if (!dmg || dmg <= 0 || loading) return;
    setLoading(true);
    try {
      const result = await gamificationService.dealDamage(subject, dmg);
      if (result) {
        setUser(result.updated);
        setDamageInput('');
        if (result.defeated) {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: ['#f59e0b', '#ef4444', '#8b5cf6'] });
        }
      } else {
        notificationService.send('No Active Boss', 'No active boss found for that subject!', 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (bossId) => {
    setLoading(true);
    try {
      const result = await gamificationService.claimBossReward(bossId);
      if (result) {
        setUser(result.updated);
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ['#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'] });
        notificationService.send(
          '🏆 Rewards Claimed!',
          `+${result.rewards.xp} XP, +${result.rewards.coins} Coins${result.unlockedNext ? `, and the next boss has been unlocked!` : ''}`,
          'success'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedBossData = BOSSES.find(b => b.id === selectedBoss);
  const selectedBossProg = progress[selectedBoss];

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <Swords className="w-8 h-8 text-rose-400" />
          Academic Boss Raids
        </h1>
        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">
          Defeat chapter bosses by completing academic activities — {BOSSES.filter(b => progress[b.id]?.status === 'defeated' || progress[b.id]?.claimed).length} / {BOSSES.length} Bosses Vanquished
        </p>
      </div>

      {/* ─── How to deal damage ─── */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">⚡ Deal Damage Manually (or complete activities to deal it automatically)</p>
        <div className="flex gap-3 flex-wrap">
          {subjectGroups.map(sub => {
            const meta = SUBJECT_META[sub];
            const activeBossId = BOSSES.filter(b => b.subject === sub).find(b => progress[b.id]?.status === 'active')?.id;
            const activeBoss = BOSSES.find(b => b.id === activeBossId);
            if (!activeBoss) return null;
            return (
              <div key={sub} className={`flex-1 min-w-[180px] p-4 rounded-xl ${meta.bg} border ${meta.border}`}>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${meta.text}`}>{meta.label}</div>
                <div className="text-sm font-black text-white mb-3">{activeBoss.emoji} {activeBoss.name}</div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="DMG"
                    min="1"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-white/40 w-20"
                    value={damageInput}
                    onChange={e => setDamageInput(e.target.value)}
                  />
                  <button
                    onClick={() => handleDealDamage(sub)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-gradient-to-r ${meta.color} text-white disabled:opacity-50`}
                  >
                    Attack!
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Boss Groups ─── */}
      {subjectGroups.map(sub => {
        const meta = SUBJECT_META[sub];
        const subjectBosses = BOSSES.filter(b => b.subject === sub);
        const defeatedCount = subjectBosses.filter(b => progress[b.id]?.claimed || progress[b.id]?.status === 'defeated').length;

        return (
          <div key={sub} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-px flex-1 bg-gradient-to-r ${meta.color} opacity-30`} />
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black uppercase tracking-widest ${meta.text}`}>{meta.label}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${meta.bg} ${meta.text}`}>
                  {defeatedCount}/{subjectBosses.length} Defeated
                </span>
              </div>
              <div className={`h-px flex-1 bg-gradient-to-l ${meta.color} opacity-30`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectBosses.map(boss => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  progress={progress}
                  onClaim={handleClaim}
                  isSelected={selectedBoss === boss.id}
                  onSelect={setSelectedBoss}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* ─── Boss Detail Panel ─── */}
      <AnimatePresence>
        {selectedBossData && selectedBossProg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-40 px-4"
          >
            <div className={`rounded-2xl bg-background-card border ${SUBJECT_META[selectedBossData.subject].border} p-6 shadow-2xl backdrop-blur-xl`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedBossData.emoji}</span>
                  <div>
                    <div className={`text-[9px] font-black uppercase tracking-widest ${SUBJECT_META[selectedBossData.subject].text}`}>
                      {SUBJECT_META[selectedBossData.subject].label} Boss
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{selectedBossData.name}</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedBoss(null)} className="text-text-muted hover:text-white text-sm font-black transition-colors">✕</button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-text-muted font-black mb-1">
                  <span>Boss HP</span>
                  <span>{selectedBossProg.hp?.toLocaleString()} / {selectedBossProg.max?.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400"
                    animate={{ width: `${Math.max(0, (selectedBossProg.hp / selectedBossProg.max) * 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              <div className="flex gap-4 text-[10px] font-black">
                <span className="text-amber-400 flex items-center gap-1"><Zap className="w-3 h-3" /> +{selectedBossData.rewards.xp} XP</span>
                <span className="text-yellow-400 flex items-center gap-1"><Coins className="w-3 h-3" /> +{selectedBossData.rewards.coins} Coins</span>
                <span className="text-purple-400 flex items-center gap-1"><Star className="w-3 h-3" /> {selectedBossData.rewards.badge} Badge</span>
                {selectedBossData.unlocks && (
                  <span className="text-text-muted flex items-center gap-1 ml-auto">
                    Unlocks next <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BossRaid;
