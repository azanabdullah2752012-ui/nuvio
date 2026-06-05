import { authService } from './authService';
import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';

const ACHIEVEMENTS = [
  { id: 'first_steps', title: 'First Steps 🎓', desc: 'Reach Level 5', stat: 'level', target: 5, icon: '🎓' },
  { id: 'study_warrior', title: 'Study Warrior ⚔️', desc: 'Complete 10 focus sessions', stat: 'stats_focus_sessions', target: 10, icon: '⚔️' },
  { id: 'flashcard_master', title: 'Flashcard Master 🃏', desc: 'Review 500 flashcards', stat: 'stats_flashcards_reviewed', target: 500, icon: '🃏' },
  { id: 'quiz_champion', title: 'Quiz Champion 🏆', desc: 'Answer 100 quiz questions correctly', stat: 'stats_quizzes_correct', target: 100, icon: '🏆' },
  { id: 'math_conqueror', title: 'Math Conqueror 📐', desc: 'Complete 5 Math-related activities', stat: 'stats_math_completed', target: 5, icon: '📐' },
  { id: 'science_scholar', title: 'Science Scholar 🧪', desc: 'Complete 5 Science-related activities', stat: 'stats_science_completed', target: 5, icon: '🧪' },
  { id: 'consistency_king', title: 'Consistency King 👑', desc: 'Reach a 7-day study streak', stat: 'streak', target: 7, icon: '👑' }
];

const RANKS = [
  { level: 30, title: 'Legend Scholar 🌟', class: 'from-amber-400 to-yellow-600 text-amber-300' },
  { level: 25, title: 'Grand Scholar 👑', class: 'from-purple-500 to-indigo-600 text-purple-300' },
  { level: 20, title: 'Master Scholar 🧙', class: 'from-nuvio-blue to-teal-500 text-cyan-300' },
  { level: 15, title: 'Knowledge Knight 🛡️', class: 'from-nuvio-red to-orange-500 text-rose-300' },
  { level: 10, title: 'Academic Explorer 🧭', class: 'from-nuvio-purple-500 to-pink-500 text-fuchsia-300' },
  { level: 5, title: 'Apprentice Scholar 📜', class: 'from-green-500 to-emerald-600 text-emerald-300' },
  { level: 1, title: 'Novice Scholar 🎓', class: 'from-slate-400 to-slate-600 text-slate-300' }
];

export const gamificationService = {
  getAchievements: () => ACHIEVEMENTS,

  getRank: (level) => {
    return RANKS.find(r => level >= r.level) || RANKS[RANKS.length - 1];
  },

  incrementStat: async (statName, amount = 1) => {
    const user = authService.me();
    if (!user) return null;

    const currentVal = user[statName] || 0;
    const newVal = currentVal + amount;
    
    const updated = {
      ...user,
      [statName]: newVal
    };

    // Trigger achievement evaluation
    const newlyUnlocked = [];
    const existingAchievements = user.achievements || [];
    
    ACHIEVEMENTS.forEach(ach => {
      if (!existingAchievements.includes(ach.id)) {
        const valueToCheck = ach.stat === 'level' ? updated.level : 
                             ach.stat === 'streak' ? updated.streak : 
                             updated[ach.stat] || 0;
                             
        if (valueToCheck >= ach.target) {
          newlyUnlocked.push(ach);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...existingAchievements, ...newlyUnlocked.map(a => a.id)];
      updated.achievements = updatedAchievements;

      newlyUnlocked.forEach(ach => {
        notificationService.send(
          "Achievement Unlocked! 🎉",
          `You earned the "${ach.title}" badge: ${ach.desc}!`,
          "success"
        );
        window.dispatchEvent(new CustomEvent('acadevance_notification', {
          detail: { title: "Achievement Unlocked! 🎉", message: `You earned the "${ach.title}" badge!`, type: 'success' }
        }));
      });
    }

    localStorage.setItem('acadevance_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({
        [statName]: newVal,
        achievements: updated.achievements
      }).eq('id', user.id);
    } catch (err) {
      console.warn(`Stat ${statName} increment sync delayed`);
    }

    return updated;
  },

  checkAchievements: async (user) => {
    if (!user) return;
    const newlyUnlocked = [];
    const existingAchievements = user.achievements || [];

    ACHIEVEMENTS.forEach(ach => {
      if (!existingAchievements.includes(ach.id)) {
        const valueToCheck = ach.stat === 'level' ? user.level : 
                             ach.stat === 'streak' ? user.streak : 
                             user[ach.stat] || 0;
                             
        if (valueToCheck >= ach.target) {
          newlyUnlocked.push(ach);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...existingAchievements, ...newlyUnlocked.map(a => a.id)];
      const updated = { ...user, achievements: updatedAchievements };
      
      localStorage.setItem('acadevance_user', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

      newlyUnlocked.forEach(ach => {
        notificationService.send(
          "Achievement Unlocked! 🎉",
          `You earned the "${ach.title}" badge: ${ach.desc}!`,
          "success"
        );
      });

      try {
        await supabase.from('profiles').update({ achievements: updatedAchievements }).eq('id', user.id);
      } catch (err) {
        console.warn("Achievements sync delayed");
      }
    }
  },

  // Duolingo-style June Season Pass Milestones
  getSeasonMilestones: () => [
    { tier: 1, title: 'June Scout', questsReq: 5, xpReq: 0, reward: { coins: 100, desc: '100 Academy Coins' } },
    { tier: 2, title: 'Quest Cadet', questsReq: 15, xpReq: 500, reward: { coins: 200, desc: '200 Academy Coins' } },
    { tier: 3, title: 'Study Explorer', questsReq: 30, xpReq: 1000, reward: { coins: 300, desc: '300 Academy Coins' } },
    { tier: 4, title: 'Focus Sentinel', questsReq: 40, xpReq: 1500, reward: { coins: 400, desc: '400 Academy Coins' } },
    { tier: 5, title: 'Vanguard Scholar', questsReq: 50, xpReq: 2000, reward: { avatar: '🌌', desc: 'Exclusive Nebula Avatar Badge' } }
  ],

  dealDamage: async (subject, amount) => {
    const user = authService.me();
    if (!user) return null;

    const progress = { ...(user.boss_chapter_progress || {
      dragon: { hp: 1000, max: 1000, status: 'active' },
      monster: { hp: 2000, max: 2000, status: 'locked' },
      titan: { hp: 5000, max: 5000, status: 'locked' }
    }) };

    let bossKey = null;
    let bossName = "";
    
    // Map subjects to bosses
    const subLower = subject.toLowerCase();
    if (subLower.includes('math') && progress.dragon.status === 'active') {
      bossKey = 'dragon';
      bossName = 'Number Systems Dragon 🐉';
    } else if (subLower.includes('science') && progress.monster.status === 'active') {
      bossKey = 'monster';
      bossName = 'Matter Monster 🧪';
    } else if ((subLower.includes('social') || subLower.includes('geo') || subLower.includes('history') || subLower.includes('civic') || subLower.includes('pol')) && progress.titan.status === 'active') {
      bossKey = 'titan';
      bossName = 'Geography Titan 🌎';
    }

    if (!bossKey) return null;

    const boss = progress[bossKey];
    if (boss.hp <= 0) return null; // already defeated, waiting for claim

    const newHp = Math.max(0, boss.hp - amount);
    boss.hp = newHp;

    const updated = {
      ...user,
      boss_chapter_progress: progress
    };

    let defeated = false;
    if (newHp === 0 && boss.status === 'active') {
      defeated = true;
      notificationService.send(
        "Boss Defeated! ⚔️",
        `You defeated the ${bossName}! Head to Boss Raid to claim rewards.`,
        "success"
      );
    } else {
      window.dispatchEvent(new CustomEvent('acadevance_notification', {
        detail: { title: "Hit! 💥", message: `Dealt -${amount} DMG to ${bossName}`, type: 'info' }
      }));
    }

    localStorage.setItem('acadevance_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({
        boss_chapter_progress: progress
      }).eq('id', user.id);
    } catch (err) {
      console.warn("Boss damage sync delayed");
    }

    return { updated, defeated, damage: amount, bossName };
  }
};
