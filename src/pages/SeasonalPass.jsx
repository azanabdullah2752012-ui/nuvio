import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import { notificationService } from '../services/notificationService';

const SeasonalPass = () => {
  const [user, setUser] = useState(authService.me());
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    setUser(authService.me());
    setMilestones(gamificationService.getSeasonMilestones());

    const handleUpdate = () => {
      setUser(authService.me());
    };
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  if (!user) return null;

  const currentQuests = user.stats_quests_completed || 0;
  const currentXp = user.xp || 0;
  const claimedTiers = user.claimed_season_tiers || [];

  const handleClaim = async (milestone) => {
    if (claimedTiers.includes(milestone.tier)) return;

    // Verify they actually meet requirements
    if (currentQuests < milestone.questsReq || currentXp < milestone.xpReq) {
      notificationService.send("Locked", "You do not meet the requirements for this tier yet.", "error");
      return;
    }

    // Process reward
    let rewardText = "";
    const updatedAvatars = [...(user.unlocked_avatars || ['⚡'])];
    let newTokens = user.era_tokens || 0;

    if (milestone.reward.coins) {
      newTokens += milestone.reward.coins;
      rewardText = `+${milestone.reward.coins} Academy Coins`;
      await authService.addTokens(milestone.reward.coins);
    } else if (milestone.reward.avatar) {
      if (!updatedAvatars.includes(milestone.reward.avatar)) {
        updatedAvatars.push(milestone.reward.avatar);
      }
      rewardText = `Unlocked exclusive ${milestone.reward.avatar} avatar!`;
    }

    // Update claimed tiers
    const nextClaimedTiers = [...claimedTiers, milestone.tier];
    
    await authService.updateMe({
      claimed_season_tiers: nextClaimedTiers,
      unlocked_avatars: updatedAvatars
    });

    notificationService.send("Milestone Claimed! 🎉", rewardText, "success");
    window.dispatchEvent(new CustomEvent('acadevance_notification', {
      detail: { title: "Reward Claimed! 📅", message: rewardText, type: 'success' }
    }));
  };

  // Calculate overall seasonal progress percentage
  const maxQuests = 50;
  const questPercent = Math.min(100, (currentQuests / maxQuests) * 100);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Calendar className="w-10 h-10 text-nuvio-cyan" />
            June Season Pass
          </h1>
          <p className="text-text-secondary font-medium mt-1">
            Complete daily directives and earn XP to unlock exclusive premium rewards.
          </p>
        </div>

        <div className="nv-card bg-gradient-to-r from-nuvio-cyan/10 to-nuvio-purple-500/10 border-white/5 py-4 px-6 flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-nuvio-cyan font-black uppercase tracking-wider">June Season Active</div>
            <div className="text-lg font-black text-white">{currentQuests} Quests Completed</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-nuvio-cyan/10 flex items-center justify-center border border-nuvio-cyan/20">
            <Sparkles className="w-6 h-6 text-nuvio-cyan" />
          </div>
        </div>
      </header>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="nv-card p-6 bg-white/[0.01] border-white/5 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted tracking-widest">
            <span>Directives (Quests) Target</span>
            <span>{currentQuests} / 50</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${questPercent}%` }}
              className="h-full bg-nuvio-cyan"
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="nv-card p-6 bg-white/[0.01] border-white/5 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted tracking-widest">
            <span>XP target (2,000 XP)</span>
            <span>{currentXp.toLocaleString()} / 2,000 XP</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (currentXp / 2000) * 100)}%` }}
              className="h-full bg-nuvio-purple-500"
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Milestones Track */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Reward Milestones</h2>
        
        <div className="space-y-4">
          {milestones.map((m) => {
            const hasCompletedQuests = currentQuests >= m.questsReq;
            const hasCompletedXp = currentXp >= m.xpReq;
            const isUnlocked = hasCompletedQuests && hasCompletedXp;
            const isClaimed = claimedTiers.includes(m.tier);

            return (
              <motion.div
                key={m.tier}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`nv-card p-6 bg-white/[0.01] border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all
                  ${isClaimed ? 'opacity-65 border-white/5' : isUnlocked ? 'border-nuvio-cyan/30 shadow-lg shadow-nuvio-cyan/5 bg-nuvio-cyan/[0.01]' : 'border-white/5'}
                `}
              >
                {/* Milestone Info */}
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0 border
                    ${isClaimed ? 'bg-white/5 border-white/5 text-text-muted' : isUnlocked ? 'bg-nuvio-cyan/10 border-nuvio-cyan/20 text-nuvio-cyan shadow-xl shadow-nuvio-cyan/5' : 'bg-white/5 border-white/5 text-text-muted'}
                  `}>
                    {m.reward.avatar || '🎁'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/5 text-text-muted">Tier {m.tier}</span>
                      <h4 className="text-base font-black text-white uppercase tracking-tight">{m.title}</h4>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">Reward: <span className="font-bold text-white">{m.reward.desc}</span></p>
                    <div className="flex gap-4 mt-2 text-[9px] font-bold text-text-muted uppercase tracking-wider">
                      <span className={hasCompletedQuests ? 'text-nuvio-cyan' : ''}>Quests: {currentQuests}/{m.questsReq}</span>
                      {m.xpReq > 0 && <span className={hasCompletedXp ? 'text-nuvio-purple-400' : ''}>XP: {currentXp.toLocaleString()}/{m.xpReq.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>

                {/* Claim Button / Status */}
                <div>
                  {isClaimed ? (
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-nuvio-green" /> Claimed
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleClaim(m)}
                      className="w-full md:w-auto px-8 py-3 bg-nuvio-cyan hover:bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-nuvio-cyan/25 transition-all animate-pulse"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 justify-center">
                      <Lock className="w-4 h-4" /> Locked
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeasonalPass;
