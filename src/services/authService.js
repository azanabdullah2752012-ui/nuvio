import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'acadevance_user';

const getDefaultProfile = () => ({
  id: 'scholar-local-01',
  email: 'scholar@local.dev',
  full_name: 'Alex Scholar',
  avatar_emoji: '⚡',
  level: 5,
  xp: 1450,
  era_tokens: 2500,
  role: 'admin',
  grade_level: '9th',
  onboarding_completed: true,
  last_activity_date: new Date().toISOString(),
  streak: 3,
  achievements: ['scholar_initiate', 'first_steps', 'focus_first', 'streak_3'],
  stats_focus_sessions: 6,
  stats_flashcards_reviewed: 42,
  stats_quizzes_correct: 28,
  stats_math_completed: 8,
  stats_science_completed: 6,
  stats_social_completed: 4,
  stats_homework_completed: 5,
  stats_boss_defeated: 1,
  stats_quests_completed: 4,
  login_streak: 3,
  last_login_reward_date: new Date().toISOString(),
  unlocked_avatars: ['⚡', '🎓', '🚀', '🧠', '👑', '🔥'],
  claimed_season_tiers: [1],
  boss_chapter_progress: {
    dragon:    { hp: 350, max: 1000,  status: 'active',  claimed: false },
    algebra:   { hp: 2500, max: 2500,  status: 'locked',  claimed: false },
    geometry:  { hp: 4000, max: 4000,  status: 'locked',  claimed: false },
    cell:      { hp: 1500, max: 1500,  status: 'active',  claimed: false },
    motion:    { hp: 3000, max: 3000,  status: 'locked',  claimed: false },
    atom:      { hp: 5000, max: 5000,  status: 'locked',  claimed: false },
    empire:    { hp: 2000, max: 2000,  status: 'active',  claimed: false },
    leviathan: { hp: 6000, max: 6000,  status: 'locked',  claimed: false },
  }
});

export const authService = {
  me: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Malformed user data in localStorage:", e);
    }
    const defaultUser = getDefaultProfile();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    } catch (e) {}
    return defaultUser;
  },

  getSession: async () => {
    const user = authService.me();
    return { user, access_token: 'local-session-token' };
  },

  seedUserData: async (userId) => {
    return true;
  },

  syncProfile: async (user) => {
    if (!user) return authService.me();
    const current = authService.me();
    const updated = { ...current, ...user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));
    return updated;
  },

  validateStreak: async () => {
    const user = authService.me();
    if (!user) return { status: 'active' };

    const last = new Date(user.last_activity_date || Date.now());
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);

    if (diffHours > 48) {
      // Keep streak alive locally or reset gracefully
      await authService.updateMe({ streak: 1, last_activity_date: now.toISOString() });
      return { status: 'reset', lostDays: 1 };
    } else if (diffHours > 20 && now.getDate() !== last.getDate()) {
      const nextStreak = (user.streak || 1) + 1;
      await authService.updateMe({ streak: nextStreak, last_activity_date: now.toISOString() });
      return { status: 'increment' };
    }
    return { status: 'active' };
  },

  updateMe: async (updates) => {
    const user = authService.me();
    if (!user) return null;

    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));
    window.dispatchEvent(new CustomEvent('acadevance_auth_change', { detail: updated }));
    return updated;
  },

  addTokens: async (amount) => {
    const user = authService.me();
    if (!user) return null;
    const newTokens = (user.era_tokens || 0) + amount;
    return authService.updateMe({ era_tokens: newTokens });
  },

  promoteToAdmin: async () => {
    const user = authService.me();
    if (!user) return;
    return authService.updateMe({ role: 'admin' });
  },

  injectWealth: async (amount = 10000) => {
    return authService.addTokens(amount);
  },

  claimLoginReward: async (day) => {
    const user = authService.me();
    if (!user) return null;

    const rewards = {
      1: { coins: 25,  desc: 'Day 1 — Welcome Back!',    label: '25 Coins' },
      2: { coins: 50,  desc: 'Day 2 — Keep it up!',      label: '50 Coins' },
      3: { coins: 75,  desc: 'Day 3 — On a roll!',       label: '75 Coins' },
      4: { coins: 100, desc: 'Day 4 — Halfway there!',   label: '100 Coins' },
      5: { coins: 0,   avatar: '🧙', xp: 100, desc: 'Day 5 — Wizard Avatar Unlocked!', label: '🧙 Wizard Avatar + 100 XP' },
      6: { coins: 150, desc: 'Day 6 — Almost there!',    label: '150 Coins' },
      7: { coins: 500, avatar: '🌌', xp: 500, desc: 'Day 7 — EPIC REWARD!', label: '500 Coins + 🌌 Nebula Avatar + 500 XP' },
    };

    const reward = rewards[day] || { coins: 25, desc: 'Daily Reward', label: '25 Coins' };
    const newTokens = (user.era_tokens || 0) + (reward.coins || 0);
    const newXp = (user.xp || 0) + (reward.xp || 0);

    const newAvatars = [...(user.unlocked_avatars || ['⚡'])];
    if (reward.avatar && !newAvatars.includes(reward.avatar)) {
      newAvatars.push(reward.avatar);
    }

    const updated = await authService.updateMe({
      era_tokens: newTokens,
      xp: newXp,
      login_streak: day,
      last_login_reward_date: new Date().toISOString(),
      unlocked_avatars: newAvatars,
    });

    return reward;
  },

  loginAsDemo: async () => {
    return authService.me();
  },

  login: async () => {
    return authService.me();
  },

  signInWithGoogle: async () => {
    return authService.me();
  },

  logout: async () => {
    // Reset local data back to pristine default instead of broken redirect
    const defaultUser = getDefaultProfile();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: defaultUser }));
    window.dispatchEvent(new CustomEvent('acadevance_auth_change', { detail: defaultUser }));
    return defaultUser;
  }
};
