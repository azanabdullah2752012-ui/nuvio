import { authService } from './authService';
import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';

// ─────────────────────────────────────────────────────────────
// 52 ACHIEVEMENTS  (Bronze / Silver / Gold tier rewards)
// ─────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  // ── Level / XP Milestones ──────────────────────────────────
  { id: 'scholar_initiate',   category: 'rank',     tier: 'bronze', icon: '🎓', title: 'Scholar Initiate',    desc: 'Reach Level 2',            stat: 'level',                    target: 2,     xp: 50,  coins: 25 },
  { id: 'first_steps',        category: 'rank',     tier: 'bronze', icon: '🌱', title: 'First Steps',         desc: 'Reach Level 5',            stat: 'level',                    target: 5,     xp: 50,  coins: 25 },
  { id: 'level_10',           category: 'rank',     tier: 'silver', icon: '🔥', title: 'Double Digits',       desc: 'Reach Level 10',           stat: 'level',                    target: 10,    xp: 100, coins: 50 },
  { id: 'level_20',           category: 'rank',     tier: 'gold',   icon: '💎', title: 'Elite Scholar',       desc: 'Reach Level 20',           stat: 'level',                    target: 20,    xp: 250, coins: 100 },
  { id: 'level_30',           category: 'rank',     tier: 'gold',   icon: '🌟', title: 'Legend Ascendant',    desc: 'Reach Level 30',           stat: 'level',                    target: 30,    xp: 500, coins: 200 },
  { id: 'xp_1k',              category: 'rank',     tier: 'bronze', icon: '⚡', title: 'XP Collector',        desc: 'Earn 1,000 total XP',      stat: 'xp',                       target: 1000,  xp: 50,  coins: 25 },
  { id: 'xp_5k',              category: 'rank',     tier: 'silver', icon: '🔋', title: 'XP Hoarder',          desc: 'Earn 5,000 total XP',      stat: 'xp',                       target: 5000,  xp: 100, coins: 50 },
  { id: 'xp_10k',             category: 'rank',     tier: 'gold',   icon: '🏆', title: 'XP Legend',           desc: 'Earn 10,000 total XP',     stat: 'xp',                       target: 10000, xp: 250, coins: 100 },

  // ── Streak ─────────────────────────────────────────────────
  { id: 'streak_3',           category: 'streak',   tier: 'bronze', icon: '🔥', title: 'On a Roll',           desc: 'Study 3 days in a row',    stat: 'streak',                   target: 3,     xp: 50,  coins: 25 },
  { id: 'consistency_king',   category: 'streak',   tier: 'silver', icon: '👑', title: 'Consistency King',    desc: 'Study 7 days in a row',    stat: 'streak',                   target: 7,     xp: 100, coins: 50 },
  { id: 'streak_14',          category: 'streak',   tier: 'silver', icon: '🗓️', title: 'Fortnight Fighter',   desc: 'Study 14 days in a row',   stat: 'streak',                   target: 14,    xp: 150, coins: 75 },
  { id: 'streak_30',          category: 'streak',   tier: 'gold',   icon: '💫', title: 'Monthly Devotee',     desc: 'Study 30 days in a row',   stat: 'streak',                   target: 30,    xp: 500, coins: 200 },

  // ── Focus Sessions ─────────────────────────────────────────
  { id: 'focus_first',        category: 'focus',    tier: 'bronze', icon: '🎯', title: 'First Focus',         desc: 'Complete your first focus session',  stat: 'stats_focus_sessions', target: 1,  xp: 50,  coins: 25 },
  { id: 'focus_5',            category: 'focus',    tier: 'bronze', icon: '⏱️', title: 'Focus Starter',       desc: 'Complete 5 focus sessions',          stat: 'stats_focus_sessions', target: 5,  xp: 75,  coins: 30 },
  { id: 'study_warrior',      category: 'focus',    tier: 'silver', icon: '⚔️', title: 'Study Warrior',       desc: 'Complete 10 focus sessions',         stat: 'stats_focus_sessions', target: 10, xp: 100, coins: 50 },
  { id: 'focus_25',           category: 'focus',    tier: 'silver', icon: '🧠', title: 'Deep Worker',         desc: 'Complete 25 focus sessions',         stat: 'stats_focus_sessions', target: 25, xp: 150, coins: 75 },
  { id: 'focus_champion',     category: 'focus',    tier: 'gold',   icon: '🏅', title: 'Focus Champion',      desc: 'Complete 50 focus sessions',         stat: 'stats_focus_sessions', target: 50, xp: 250, coins: 100 },

  // ── Flashcards ─────────────────────────────────────────────
  { id: 'flash_10',           category: 'flashcard',tier: 'bronze', icon: '🃏', title: 'Flash Starter',       desc: 'Review 10 flashcards',    stat: 'stats_flashcards_reviewed', target: 10,  xp: 50,  coins: 25 },
  { id: 'flash_50',           category: 'flashcard',tier: 'bronze', icon: '📖', title: 'Flash Learner',       desc: 'Review 50 flashcards',    stat: 'stats_flashcards_reviewed', target: 50,  xp: 75,  coins: 30 },
  { id: 'flash_100',          category: 'flashcard',tier: 'silver', icon: '📚', title: 'Flash Pro',           desc: 'Review 100 flashcards',   stat: 'stats_flashcards_reviewed', target: 100, xp: 100, coins: 50 },
  { id: 'flash_250',          category: 'flashcard',tier: 'silver', icon: '📜', title: 'Flash Expert',        desc: 'Review 250 flashcards',   stat: 'stats_flashcards_reviewed', target: 250, xp: 150, coins: 75 },
  { id: 'flashcard_master',   category: 'flashcard',tier: 'gold',   icon: '🎴', title: 'Flashcard Master',    desc: 'Review 500 flashcards',   stat: 'stats_flashcards_reviewed', target: 500, xp: 250, coins: 100 },

  // ── Quiz ───────────────────────────────────────────────────
  { id: 'quiz_first',         category: 'quiz',     tier: 'bronze', icon: '❓', title: 'First Answer',        desc: 'Answer 1 question correctly',   stat: 'stats_quizzes_correct', target: 1,   xp: 50,  coins: 25 },
  { id: 'quiz_10',            category: 'quiz',     tier: 'bronze', icon: '🧩', title: 'Quiz Rookie',         desc: 'Answer 10 questions correctly', stat: 'stats_quizzes_correct', target: 10,  xp: 75,  coins: 30 },
  { id: 'quiz_25',            category: 'quiz',     tier: 'silver', icon: '🎲', title: 'Quiz Enthusiast',     desc: 'Answer 25 questions correctly', stat: 'stats_quizzes_correct', target: 25,  xp: 100, coins: 50 },
  { id: 'quiz_50',            category: 'quiz',     tier: 'silver', icon: '🧠', title: 'Quiz Expert',         desc: 'Answer 50 questions correctly', stat: 'stats_quizzes_correct', target: 50,  xp: 150, coins: 75 },
  { id: 'quiz_champion',      category: 'quiz',     tier: 'gold',   icon: '🏆', title: 'Quiz Champion',       desc: 'Answer 100 questions correctly',stat: 'stats_quizzes_correct', target: 100, xp: 250, coins: 100 },

  // ── Math ───────────────────────────────────────────────────
  { id: 'math_1',             category: 'math',     tier: 'bronze', icon: '➕', title: 'Math Initiate',       desc: 'Complete 1 Math activity',   stat: 'stats_math_completed', target: 1,  xp: 50,  coins: 25 },
  { id: 'math_3',             category: 'math',     tier: 'bronze', icon: '📐', title: 'Math Apprentice',     desc: 'Complete 3 Math activities', stat: 'stats_math_completed', target: 3,  xp: 75,  coins: 30 },
  { id: 'math_conqueror',     category: 'math',     tier: 'silver', icon: '📏', title: 'Math Conqueror',      desc: 'Complete 5 Math activities', stat: 'stats_math_completed', target: 5,  xp: 100, coins: 50 },
  { id: 'math_15',            category: 'math',     tier: 'silver', icon: '🔢', title: 'Math Expert',         desc: 'Complete 15 Math activities',stat: 'stats_math_completed', target: 15, xp: 150, coins: 75 },
  { id: 'math_master',        category: 'math',     tier: 'gold',   icon: '🏆', title: 'Math Master',         desc: 'Complete 30 Math activities',stat: 'stats_math_completed', target: 30, xp: 250, coins: 100 },

  // ── Science ────────────────────────────────────────────────
  { id: 'science_1',          category: 'science',  tier: 'bronze', icon: '🔬', title: 'Science Cadet',       desc: 'Complete 1 Science activity',   stat: 'stats_science_completed', target: 1,  xp: 50,  coins: 25 },
  { id: 'science_3',          category: 'science',  tier: 'bronze', icon: '🧫', title: 'Science Apprentice',  desc: 'Complete 3 Science activities', stat: 'stats_science_completed', target: 3,  xp: 75,  coins: 30 },
  { id: 'science_scholar',    category: 'science',  tier: 'silver', icon: '🧪', title: 'Science Scholar',     desc: 'Complete 5 Science activities', stat: 'stats_science_completed', target: 5,  xp: 100, coins: 50 },
  { id: 'science_15',         category: 'science',  tier: 'silver', icon: '⚗️', title: 'Science Expert',      desc: 'Complete 15 Science activities',stat: 'stats_science_completed', target: 15, xp: 150, coins: 75 },
  { id: 'science_master',     category: 'science',  tier: 'gold',   icon: '🔭', title: 'Science Master',      desc: 'Complete 30 Science activities',stat: 'stats_science_completed', target: 30, xp: 250, coins: 100 },

  // ── Social Studies ─────────────────────────────────────────
  { id: 'social_1',           category: 'social',   tier: 'bronze', icon: '🗺️', title: 'History Initiate',    desc: 'Complete 1 Social Studies activity',   stat: 'stats_social_completed', target: 1,  xp: 50,  coins: 25 },
  { id: 'social_5',           category: 'social',   tier: 'bronze', icon: '🌍', title: 'Geography Explorer',  desc: 'Complete 5 Social Studies activities',  stat: 'stats_social_completed', target: 5,  xp: 75,  coins: 30 },
  { id: 'social_15',          category: 'social',   tier: 'silver', icon: '🏛️', title: 'Social Scholar',      desc: 'Complete 15 Social Studies activities', stat: 'stats_social_completed', target: 15, xp: 150, coins: 75 },
  { id: 'social_30',          category: 'social',   tier: 'gold',   icon: '👑', title: 'Social Conqueror',    desc: 'Complete 30 Social Studies activities', stat: 'stats_social_completed', target: 30, xp: 250, coins: 100 },

  // ── Homework ───────────────────────────────────────────────
  { id: 'homework_first',     category: 'homework', tier: 'bronze', icon: '📝', title: 'Homework Hero',       desc: 'Complete your first homework task',  stat: 'stats_homework_completed', target: 1,  xp: 50,  coins: 25 },
  { id: 'homework_10',        category: 'homework', tier: 'silver', icon: '📋', title: 'Assignment Ace',      desc: 'Complete 10 homework tasks',         stat: 'stats_homework_completed', target: 10, xp: 100, coins: 50 },
  { id: 'homework_50',        category: 'homework', tier: 'gold',   icon: '🥇', title: 'Homework Legend',     desc: 'Complete 50 homework tasks',         stat: 'stats_homework_completed', target: 50, xp: 250, coins: 100 },

  // ── Boss Victories ─────────────────────────────────────────
  { id: 'boss_first',         category: 'boss',     tier: 'silver', icon: '⚔️', title: 'Boss Slayer',         desc: 'Defeat your first boss',   stat: 'stats_boss_defeated', target: 1, xp: 200, coins: 100 },
  { id: 'boss_3',             category: 'boss',     tier: 'silver', icon: '🐉', title: 'Dragon Tamer',        desc: 'Defeat 3 bosses',          stat: 'stats_boss_defeated', target: 3, xp: 300, coins: 150 },
  { id: 'boss_5',             category: 'boss',     tier: 'gold',   icon: '🗡️', title: 'Monster Hunter',      desc: 'Defeat 5 bosses',          stat: 'stats_boss_defeated', target: 5, xp: 400, coins: 200 },
  { id: 'boss_all',           category: 'boss',     tier: 'gold',   icon: '🏆', title: 'Boss Master',         desc: 'Defeat all 8 bosses',      stat: 'stats_boss_defeated', target: 8, xp: 1000, coins: 500 },

  // ── Quests ─────────────────────────────────────────────────
  { id: 'quest_first',        category: 'quest',    tier: 'bronze', icon: '📌', title: 'Quest Starter',       desc: 'Complete your first quest',  stat: 'stats_quests_completed', target: 1,  xp: 50,  coins: 25 },
  { id: 'quest_10',           category: 'quest',    tier: 'silver', icon: '🗺️', title: 'Quest Runner',        desc: 'Complete 10 quests',         stat: 'stats_quests_completed', target: 10, xp: 100, coins: 50 },
  { id: 'quest_50',           category: 'quest',    tier: 'gold',   icon: '🏆', title: 'Quest Champion',      desc: 'Complete 50 quests',         stat: 'stats_quests_completed', target: 50, xp: 250, coins: 100 },
];

// ─────────────────────────────────────────────────────────────
// 8 SCHOLAR RANKS
// ─────────────────────────────────────────────────────────────
export const RANKS = [
  { level: 35, title: 'Grand Scholar 👑',       class: 'from-amber-300 to-yellow-500 text-amber-200',      glow: 'shadow-amber-500/50' },
  { level: 30, title: 'Legend Scholar 🌟',       class: 'from-amber-400 to-yellow-600 text-amber-300',      glow: 'shadow-yellow-500/40' },
  { level: 25, title: 'Master Scholar 🧙',       class: 'from-purple-500 to-indigo-600 text-purple-300',    glow: 'shadow-purple-500/40' },
  { level: 20, title: 'Elite Scholar 💎',        class: 'from-cyan-400 to-teal-500 text-cyan-300',          glow: 'shadow-cyan-500/40' },
  { level: 15, title: 'Knowledge Knight 🛡️',     class: 'from-rose-500 to-orange-500 text-rose-300',        glow: 'shadow-rose-500/40' },
  { level: 10, title: 'Academic Explorer 🧭',    class: 'from-fuchsia-500 to-pink-500 text-fuchsia-300',    glow: 'shadow-fuchsia-500/40' },
  { level: 5,  title: 'Apprentice Scholar 📜',   class: 'from-green-500 to-emerald-600 text-emerald-300',   glow: 'shadow-emerald-500/40' },
  { level: 1,  title: 'Scholar Initiate 🎓',     class: 'from-slate-400 to-slate-600 text-slate-300',       glow: 'shadow-slate-500/30' },
];

// ─────────────────────────────────────────────────────────────
// 8 SUBJECT BOSSES  (3 Math, 3 Science, 2 Social Studies)
// Sequential unlock per subject (defeat boss N to unlock N+1)
// ─────────────────────────────────────────────────────────────
export const BOSSES = [
  // Math ─────────────────────────────────────────────────────
  { id: 'dragon',    subject: 'math',    name: 'Number Systems Dragon',  emoji: '🐉', hp: 1000,  rewards: { xp: 200,  coins: 100, badge: '🐉' }, unlocks: 'algebra',  chain: 0 },
  { id: 'algebra',   subject: 'math',    name: 'Algebra Titan',           emoji: '🔺', hp: 2500,  rewards: { xp: 400,  coins: 200, badge: '🔺' }, unlocks: 'geometry', chain: 1 },
  { id: 'geometry',  subject: 'math',    name: 'Geometry Warden',         emoji: '🔷', hp: 4000,  rewards: { xp: 600,  coins: 300, badge: '🔷' }, unlocks: null,       chain: 2 },
  // Science ──────────────────────────────────────────────────
  { id: 'cell',      subject: 'science', name: 'Cell Beast',              emoji: '🦠', hp: 1500,  rewards: { xp: 250,  coins: 125, badge: '🦠' }, unlocks: 'motion',   chain: 0 },
  { id: 'motion',    subject: 'science', name: 'Motion Colossus',         emoji: '⚡', hp: 3000,  rewards: { xp: 500,  coins: 250, badge: '⚡' }, unlocks: 'atom',     chain: 1 },
  { id: 'atom',      subject: 'science', name: 'Atom King',               emoji: '☢️', hp: 5000,  rewards: { xp: 800,  coins: 400, badge: '☢️' }, unlocks: null,       chain: 2 },
  // Social Studies ───────────────────────────────────────────
  { id: 'empire',    subject: 'social',  name: 'Empire Conqueror',        emoji: '🏛️', hp: 2000,  rewards: { xp: 350,  coins: 175, badge: '🏛️' }, unlocks: 'leviathan',chain: 0 },
  { id: 'leviathan', subject: 'social',  name: 'Geography Leviathan',     emoji: '🌊', hp: 6000,  rewards: { xp: 1000, coins: 500, badge: '🌊' }, unlocks: null,       chain: 1 },
];

// Default boss_chapter_progress schema
export const DEFAULT_BOSS_PROGRESS = {
  dragon:    { hp: 1000, max: 1000,  status: 'active',   claimed: false },
  algebra:   { hp: 2500, max: 2500,  status: 'locked',   claimed: false },
  geometry:  { hp: 4000, max: 4000,  status: 'locked',   claimed: false },
  cell:      { hp: 1500, max: 1500,  status: 'active',   claimed: false },
  motion:    { hp: 3000, max: 3000,  status: 'locked',   claimed: false },
  atom:      { hp: 5000, max: 5000,  status: 'locked',   claimed: false },
  empire:    { hp: 2000, max: 2000,  status: 'active',   claimed: false },
  leviathan: { hp: 6000, max: 6000,  status: 'locked',   claimed: false },
};

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENT REWARD HELPER
// ─────────────────────────────────────────────────────────────
const applyAchievementRewards = (user, achievements) => {
  let totalXp = user.xp || 0;
  let totalCoins = user.tokens || 0;
  achievements.forEach(ach => {
    totalXp += (ach.xp || 0);
    totalCoins += (ach.coins || 0);
  });
  return { ...user, xp: totalXp, tokens: totalCoins };
};

// ─────────────────────────────────────────────────────────────
// SERVICE EXPORT
// ─────────────────────────────────────────────────────────────
export const gamificationService = {
  getAchievements: () => ACHIEVEMENTS,
  getRank: (level) => RANKS.find(r => level >= r.level) || RANKS[RANKS.length - 1],
  getBosses: () => BOSSES,
  getDefaultBossProgress: () => ({ ...DEFAULT_BOSS_PROGRESS }),

  // ── Increment a stat and check for new achievements ─────────
  incrementStat: async (statName, amount = 1) => {
    const user = authService.me();
    if (!user) return null;

    const currentVal = user[statName] || 0;
    const newVal = currentVal + amount;

    const updated = { ...user, [statName]: newVal };
    const existingAchievements = user.achievements || [];
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(ach => {
      if (!existingAchievements.includes(ach.id)) {
        const valueToCheck = updated[ach.stat] || 0;
        if (valueToCheck >= ach.target) {
          newlyUnlocked.push(ach);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const withRewards = applyAchievementRewards(updated, newlyUnlocked);
      withRewards.achievements = [...existingAchievements, ...newlyUnlocked.map(a => a.id)];
      Object.assign(updated, withRewards);

      newlyUnlocked.forEach(ach => {
        const tierLabel = ach.tier === 'gold' ? '🥇' : ach.tier === 'silver' ? '🥈' : '🥉';
        notificationService.send(
          `Achievement Unlocked! ${tierLabel}`,
          `${ach.icon} "${ach.title}" — +${ach.xp} XP, +${ach.coins} Coins!`,
          'success'
        );
        window.dispatchEvent(new CustomEvent('acadevance_notification', {
          detail: { title: `Achievement Unlocked! ${tierLabel}`, message: `${ach.icon} "${ach.title}"`, type: 'success' }
        }));
      });
    }

    localStorage.setItem('acadevance_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({
        [statName]: newVal,
        achievements: updated.achievements,
        xp: updated.xp,
        tokens: updated.tokens,
      }).eq('id', user.id);
    } catch (err) {
      console.warn(`Stat ${statName} increment sync delayed`);
    }

    return updated;
  },

  // ── Full achievement pass (called on login / profile load) ──
  checkAchievements: async (user) => {
    if (!user) return;
    const newlyUnlocked = [];
    const existingAchievements = user.achievements || [];

    ACHIEVEMENTS.forEach(ach => {
      if (!existingAchievements.includes(ach.id)) {
        const valueToCheck = user[ach.stat] || 0;
        if (valueToCheck >= ach.target) {
          newlyUnlocked.push(ach);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      const withRewards = applyAchievementRewards(user, newlyUnlocked);
      withRewards.achievements = [...existingAchievements, ...newlyUnlocked.map(a => a.id)];
      Object.assign(user, withRewards);

      localStorage.setItem('acadevance_user', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: user }));

      newlyUnlocked.forEach(ach => {
        notificationService.send(
          'Achievement Unlocked! 🎉',
          `${ach.icon} "${ach.title}": ${ach.desc}`,
          'success'
        );
      });

      try {
        await supabase.from('profiles').update({
          achievements: user.achievements,
          xp: user.xp,
          tokens: user.tokens,
        }).eq('id', user.id);
      } catch (err) {
        console.warn('Achievements sync delayed');
      }
    }
  },

  // ── Season Pass milestones ───────────────────────────────────
  getSeasonMilestones: () => [
    { tier: 1, title: 'June Scout',       questsReq: 5,  xpReq: 0,    reward: { coins: 100,  desc: '100 Academy Coins' } },
    { tier: 2, title: 'Quest Cadet',      questsReq: 15, xpReq: 500,  reward: { coins: 200,  desc: '200 Academy Coins' } },
    { tier: 3, title: 'Study Explorer',   questsReq: 30, xpReq: 1000, reward: { coins: 300,  desc: '300 Academy Coins' } },
    { tier: 4, title: 'Focus Sentinel',   questsReq: 40, xpReq: 1500, reward: { coins: 400,  desc: '400 Academy Coins' } },
    { tier: 5, title: 'Vanguard Scholar', questsReq: 50, xpReq: 2000, reward: { avatar: '🌌', desc: 'Exclusive Nebula Avatar Badge' } },
  ],

  // ── Deal damage to a boss (subject-mapped) ──────────────────
  dealDamage: async (subject, amount) => {
    const user = authService.me();
    if (!user) return null;

    const progress = { ...DEFAULT_BOSS_PROGRESS, ...(user.boss_chapter_progress || {}) };
    const subLower = subject.toLowerCase();

    // Map subject string → active boss id
    let bossId = null;
    const mathSubjects   = ['math', 'algebra', 'geometry', 'arithmetic', 'trigon', 'calculus', 'statistic'];
    const sciSubjects    = ['science', 'physics', 'chemistry', 'biology', 'bio', 'chem', 'phys'];
    const socialSubjects = ['social', 'history', 'geography', 'geo', 'civic', 'political', 'economics'];

    // Find the first active boss in the matching subject chain
    if (mathSubjects.some(s => subLower.includes(s))) {
      bossId = ['dragon', 'algebra', 'geometry'].find(id => progress[id]?.status === 'active') || null;
    } else if (sciSubjects.some(s => subLower.includes(s))) {
      bossId = ['cell', 'motion', 'atom'].find(id => progress[id]?.status === 'active') || null;
    } else if (socialSubjects.some(s => subLower.includes(s))) {
      bossId = ['empire', 'leviathan'].find(id => progress[id]?.status === 'active') || null;
    }

    if (!bossId || !progress[bossId]) return null;

    const bossData = BOSSES.find(b => b.id === bossId);
    const boss = progress[bossId];
    if (boss.hp <= 0) return null;

    boss.hp = Math.max(0, boss.hp - amount);

    const updated = { ...user, boss_chapter_progress: progress };
    let defeated = false;

    if (boss.hp === 0) {
      defeated = true;
      notificationService.send(
        'Boss Defeated! ⚔️',
        `You defeated the ${bossData?.emoji} ${bossData?.name}! Head to Boss Raid to claim rewards.`,
        'success'
      );
    } else {
      window.dispatchEvent(new CustomEvent('acadevance_notification', {
        detail: { title: `Hit! 💥`, message: `Dealt -${amount} DMG to ${bossData?.emoji} ${bossData?.name}`, type: 'info' }
      }));
    }

    localStorage.setItem('acadevance_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({ boss_chapter_progress: progress }).eq('id', user.id);
    } catch (err) {
      console.warn('Boss damage sync delayed');
    }

    return { updated, defeated, damage: amount, bossId, bossName: `${bossData?.emoji} ${bossData?.name}` };
  },

  // ── Claim boss defeat rewards + unlock next boss ─────────────
  claimBossReward: async (bossId) => {
    const user = authService.me();
    if (!user) return null;

    const progress = { ...DEFAULT_BOSS_PROGRESS, ...(user.boss_chapter_progress || {}) };
    const bossData = BOSSES.find(b => b.id === bossId);
    if (!bossData || progress[bossId]?.hp !== 0 || progress[bossId]?.claimed) return null;

    // Mark claimed + unlock the next boss in the chain
    progress[bossId].claimed = true;
    progress[bossId].status = 'defeated';
    if (bossData.unlocks && progress[bossData.unlocks]) {
      progress[bossData.unlocks].status = 'active';
    }

    const rewards = bossData.rewards;
    let updated = {
      ...user,
      boss_chapter_progress: progress,
      xp: (user.xp || 0) + rewards.xp,
      tokens: (user.tokens || 0) + rewards.coins,
      stats_boss_defeated: (user.stats_boss_defeated || 0) + 1,
    };

    // Check boss-related achievements
    const existingAchievements = user.achievements || [];
    const newlyUnlocked = ACHIEVEMENTS.filter(ach =>
      ach.category === 'boss' &&
      !existingAchievements.includes(ach.id) &&
      (updated.stats_boss_defeated || 0) >= ach.target
    );
    if (newlyUnlocked.length > 0) {
      updated.achievements = [...existingAchievements, ...newlyUnlocked.map(a => a.id)];
      newlyUnlocked.forEach(ach => {
        notificationService.send(`Achievement Unlocked! 🥇`, `${ach.icon} "${ach.title}"`, 'success');
      });
    }

    localStorage.setItem('acadevance_user', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({
        boss_chapter_progress: progress,
        xp: updated.xp,
        tokens: updated.tokens,
        stats_boss_defeated: updated.stats_boss_defeated,
        achievements: updated.achievements,
      }).eq('id', user.id);
    } catch (err) {
      console.warn('Boss claim sync delayed');
    }

    return { updated, rewards, unlockedNext: bossData.unlocks };
  },
};
