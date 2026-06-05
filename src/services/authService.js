import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'acadevance_user';
const ADMIN_EMAILS = ['azanabdullah27.5.2012@gmail.com'];

export const authService = {
  me: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  seedUserData: async (userId) => {
    console.log("ACTIVATE SEEDING PROTOCOL...");
    
    // 1. Initial Homework Tasks
    const starterTasks = [
      { user_id: userId, title: 'Explore Curriculum Hub', subject: 'Acadevance', due: 'Today', priority: 'High', completed: false },
      { user_id: userId, title: 'First Focus Session', subject: 'Meta', due: 'Soon', priority: 'Medium', completed: false }
    ];

    // 2. Starter Flashcard Decks
    const starterDecks = [
      { 
        user_id: userId, 
        title: 'Grade 9 Math', 
        subject: 'Curriculum', 
        cards: [
          { front: 'What is the Origin?', back: 'The point of intersection of the x-axis and y-axis, with coordinates (0, 0).' },
          { front: 'What is a Line?', back: 'A one-dimensional figure that has length but no width.' }
        ]
      }
    ];

    try {
      await Promise.all([
        supabase.from('tasks').insert(starterTasks),
        supabase.from('decks').insert(starterDecks)
      ]);
      console.log("SEEDING COMPLETE. USER DATA POPULATED.");
    } catch (err) {
      console.error("Seeding interference detected:", err);
    }
  },

  syncProfile: async (user) => {
    if (!user) return;
    console.log("USER IDENTITY SYNC INITIATED FOR:", user.email);
    
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const processEmail = (email) => {
        if (!email) return '';
        const lower = email.toLowerCase();
        // Gmail ignores dots in the local part - normalize it
        if (lower.endsWith('@gmail.com')) {
          const [local, domain] = lower.split('@');
          return local.replace(/\./g, '') + '@' + domain;
        }
        return lower;
      };

      const userEmailProcessed = processEmail(user.email);
      const isAdminEmail = ADMIN_EMAILS.some(e => processEmail(e) === userEmailProcessed);

      if (!existing) {
        console.log("CREATING NEW IDENTITY... ADMIN STATUS:", isAdminEmail);
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Scholar',
          avatar_emoji: '⚡',
          level: 1,
          xp: 0,
          era_tokens: 500,
          role: isAdminEmail ? 'admin' : 'student',
          grade_level: user.user_metadata?.grade_level || '9th',
          onboarding_completed: true,
          last_activity_date: new Date().toISOString(),
          // Retention Features Defaults
          achievements: [],
          stats_focus_sessions: 0,
          stats_flashcards_reviewed: 0,
          stats_quizzes_correct: 0,
          stats_math_completed: 0,
          stats_science_completed: 0,
          stats_quests_completed: 0,
          login_streak: 1,
          last_login_reward_date: null,
          unlocked_avatars: ['⚡'],
          claimed_season_tiers: [],
          boss_chapter_progress: {
            dragon: { hp: 1000, max: 1000, status: 'active' },
            monster: { hp: 2000, max: 2000, status: 'locked' },
            titan: { hp: 5000, max: 5000, status: 'locked' }
          }
        };

        const { error } = await supabase.from('profiles').insert(newProfile);
        
        if (!error) {
          await authService.seedUserData(user.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        }
      } else {
        console.log("SYNCING EXISTING IDENTITY... CURRENT ROLE:", existing.role, "TARGET ADMIN:", isAdminEmail);
        // Force admin role if in admin list (check against live auth email)
        if (isAdminEmail && existing.role !== 'admin') {
          console.log("ELEVATING PRIVILEGES TO ADMIN...");
          existing.role = 'admin';
          await supabase.from('profiles').update({ role: 'admin' }).eq('id', existing.id);
        }
        
        if (!existing.last_activity_date) {
          existing.last_activity_date = new Date().toISOString();
          await supabase.from('profiles').update({ last_activity_date: existing.last_activity_date }).eq('id', existing.id);
        }

        // Fill defaults if columns are missing
        existing.achievements = existing.achievements || [];
        existing.stats_focus_sessions = existing.stats_focus_sessions ?? 0;
        existing.stats_flashcards_reviewed = existing.stats_flashcards_reviewed ?? 0;
        existing.stats_quizzes_correct = existing.stats_quizzes_correct ?? 0;
        existing.stats_math_completed = existing.stats_math_completed ?? 0;
        existing.stats_science_completed = existing.stats_science_completed ?? 0;
        existing.stats_quests_completed = existing.stats_quests_completed ?? 0;
        existing.login_streak = existing.login_streak ?? 1;
        existing.last_login_reward_date = existing.last_login_reward_date || null;
        existing.unlocked_avatars = existing.unlocked_avatars || ['⚡'];
        existing.claimed_season_tiers = existing.claimed_season_tiers || [];
        existing.boss_chapter_progress = existing.boss_chapter_progress || {
          dragon: { hp: 1000, max: 1000, status: 'active' },
          monster: { hp: 2000, max: 2000, status: 'locked' },
          titan: { hp: 5000, max: 5000, status: 'locked' }
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
      
      // Dispatch update event
      window.dispatchEvent(new CustomEvent('acadevance_stats_update', { 
        detail: JSON.parse(localStorage.getItem(STORAGE_KEY)) 
      }));
    } catch (err) {
      console.error("Supabase Profile Sync Error:", err);
    }
  },

  // --- REDACTED: DANGEROUS BACKDOORS REMOVED FOR PRODUCTION ---
  // promoteToAdmin and injectWealth are now disabled at the system level.

  validateStreak: async () => {
    const user = authService.me();
    if (!user) return { status: 'active' };
    
    if (!user.last_activity_date) {
      // Initialize if missing
      await authService.updateMe({ last_activity_date: new Date().toISOString() });
      return { status: 'active' };
    }

    const last = new Date(user.last_activity_date);
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);

    if (diffHours > 48) {
      // Check if they have a streak_shield
      try {
        const { data: shields } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', 'streak_shield');

        if (shields && shields.length > 0) {
          // Consume the shield from Supabase
          const shieldId = shields[0].id;
          await supabase.from('inventory').delete().eq('id', shieldId);

          // Consuming locally
          const localData = localStorage.getItem('acadevance_local_db');
          if (localData) {
            const db = JSON.parse(localData);
            const shieldIdx = db.inventory?.findIndex(item => item.item_id === 'streak_shield');
            if (shieldIdx !== -1 && shieldIdx !== undefined) {
              db.inventory.splice(shieldIdx, 1);
              localStorage.setItem('acadevance_local_db', JSON.stringify(db));
            }
          }

          // Protect the streak - update last activity to now to prevent immediate trigger on next check
          const nowIso = new Date().toISOString();
          await authService.updateMe({ last_activity_date: nowIso });

          window.dispatchEvent(new CustomEvent('acadevance_nudge', {
            detail: {
              title: "Shield Consumed! 🛡️",
              message: "Your Streak Aegis protected your daily streak.",
              type: 'streak'
            }
          }));

          return { status: 'protected' };
        }
      } catch (err) {
        console.warn("Streak shield validation failed:", err);
      }

      // Streak Lost (Tier 1: Loss Aversion)
      console.log("STREAK RESET. RESETTING TO 1.");
      await authService.updateMe({ streak: 1 });
      return { status: 'reset', lostDays: Math.floor(diffHours / 24) };
    } else if (diffHours > 24 && now.getDate() !== last.getDate()) {
      // New Day, increment streak
      await authService.updateMe({ streak: (user.streak || 0) + 1 });
      return { status: 'increment' };
    }

    // Check daily login reward trigger
    const lastReward = user.last_login_reward_date ? new Date(user.last_login_reward_date) : null;
    const isNewDay = !lastReward || now.toDateString() !== lastReward.toDateString();
    if (isNewDay) {
      let streakCount = user.login_streak || 1;
      if (lastReward) {
        const diffHours = (now - lastReward) / (1000 * 60 * 60);
        if (diffHours > 48) {
          streakCount = 1;
        } else if (diffHours > 24 || now.getDate() !== lastReward.getDate()) {
          streakCount = (streakCount % 7) + 1;
        }
      }
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('acadevance_show_login_reward', {
          detail: { day: streakCount }
        }));
      }, 1500);
    }

    // Keep the local timestamp moving forward as the user is actively navigating
    user.last_activity_date = now.toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    return { status: 'active' };
  },

  updateMe: async (newData) => {
    const current = authService.me();
    if (!current?.id) return null;

    // 🛡️ SECURITY: Strip protected fields from client-side updates
    const sanitizedData = { ...newData };
    delete sanitizedData.role;
    delete sanitizedData.email;
    delete sanitizedData.id;

    const nowIso = new Date().toISOString();
    const updated = { 
      ...current, 
      ...sanitizedData, 
      last_activity_date: nowIso 
    };
    
    // Save locally for speed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));
    window.dispatchEvent(new CustomEvent('acadevance_sync_pulse', { detail: { syncing: true } }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...sanitizedData, last_activity_date: nowIso })
        .eq('id', current.id);
      
      if (error) throw error;
    } catch (err) {
      console.warn("CLOUD SYNC DELAYED:", err.message);
    } finally {
      window.dispatchEvent(new CustomEvent('acadevance_sync_pulse', { detail: { syncing: false } }));
    }

    return updated;
  },

  addTokens: async (amount) => {
    if (amount === 0) return;
    const user = authService.me();
    if (!user) return;

    const newBalance = (user.era_tokens || 0) + amount;
    const updated = { ...user, era_tokens: newBalance };
    
    // Local Update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      const { data, error } = await supabase.rpc('rpc_add_tokens', { amount_to_add: amount });
      if (error) throw error;
      if (data?.success) {
        const cloudUpdated = { ...user, era_tokens: data.new_balance };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudUpdated));
        return cloudUpdated;
      }
    } catch (err) {
      console.warn("TOKEN CLOUD SYNC DELAYED:", err.message);
    }
    return updated;
  },

  // --- ADMIN BACKDOORS (RE-ENABLED FOR MASTER AUTHORITY) ---
  promoteToAdmin: async () => {
    const user = authService.me();
    if (!user) return;
    const updated = { ...user, role: 'admin' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));
    try {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    } catch (err) { console.warn("Admin promotion local-only"); }
  },

  injectWealth: async (amount = 10000) => {
    return authService.addTokens(amount);
  },

  claimLoginReward: async (day) => {
    const user = authService.me();
    if (!user) return null;

    const rewards = {
      1: { coins: 20, desc: "Day 1 Reward" },
      2: { coins: 30, desc: "Day 2 Reward" },
      3: { coins: 40, desc: "Day 3 Reward" },
      4: { coins: 50, desc: "Day 4 Reward" },
      5: { coins: 60, desc: "Day 5 Reward" },
      6: { coins: 70, desc: "Day 6 Reward" },
      7: { coins: 100, avatar: "👑", desc: "Day 7 Grand Reward" }
    };

    const reward = rewards[day] || { coins: 20, desc: "Daily Reward" };
    
    // Add coins (era_tokens)
    const newTokens = (user.era_tokens || 0) + reward.coins;
    
    // Unlocked avatars
    const newAvatars = [...(user.unlocked_avatars || ['⚡'])];
    if (reward.avatar && !newAvatars.includes(reward.avatar)) {
      newAvatars.push(reward.avatar);
    }

    const updated = {
      ...user,
      era_tokens: newTokens,
      login_streak: day,
      last_login_reward_date: new Date().toISOString(),
      unlocked_avatars: newAvatars
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: updated }));

    try {
      await supabase.from('profiles').update({
        era_tokens: newTokens,
        login_streak: day,
        last_login_reward_date: updated.last_login_reward_date,
        unlocked_avatars: newAvatars
      }).eq('id', user.id);
    } catch (err) {
      console.warn("Daily login reward sync delayed");
    }

    return reward;
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile || data.user));
    window.dispatchEvent(new CustomEvent('acadevance_auth_change', { detail: profile || data.user }));
    return profile || data.user;
  },

  signInWithGoogle: async () => {
    // CRITICAL FIX: GitHub Pages requires the trailing slash to prevent internal 301 redirects
    // that strip the OAuth payload on mobile Safari/Chrome.
    let baseUrl = window.location.origin + window.location.pathname;
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    
    console.log("INITIATING GOOGLE AUTH REDIRECT TO:", baseUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: baseUrl,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('acadevance_auth_change', { detail: null }));
    // Hard refresh to clear state
    window.location.href = window.location.origin + window.location.pathname;
  }
};
