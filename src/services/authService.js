import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'nuvio_user';
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
    console.log("ACTIVATE NEURAL SEEDING PROTOCOL...");
    
    // 1. Initial Homework Tasks
    const starterTasks = [
      { user_id: userId, title: 'Explore Neural Hub', subject: 'Nuvio', due: 'Today', priority: 'High', completed: false },
      { user_id: userId, title: 'First Focus Session', subject: 'Meta', due: 'Soon', priority: 'Medium', completed: false }
    ];

    // 2. Starter Flashcard Decks
    const starterDecks = [
      { 
        user_id: userId, 
        title: 'Cognitive Science 101', 
        subject: 'Neural', 
        cards: [
          { front: 'What is neuroplasticity?', back: 'The brain\'s ability to reorganize itself by forming new neural connections.' },
          { front: 'Defined "Flow State"?', back: 'A mental state of operation in which a person performing an activity is fully immersed.' }
        ]
      }
    ];

    try {
      await Promise.all([
        supabase.from('tasks').insert(starterTasks),
        supabase.from('decks').insert(starterDecks)
      ]);
      console.log("SEEDING COMPLETE. NEURAL CLOUD POPULATED.");
    } catch (err) {
      console.error("Seeding interference detected:", err);
    }
  },

  syncProfile: async (user) => {
    if (!user) return;
    console.log("NEURAL IDENTITY SYNC INITIATED FOR:", user.email);
    
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
        console.log("CREATING NEW NEURAL IDENTITY... ADMIN STATUS:", isAdminEmail);
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Neural Student',
          avatar_emoji: '⚡',
          level: 1,
          xp: 0,
          era_tokens: 500,
          role: isAdminEmail ? 'admin' : 'student',
          onboarding_completed: true
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
      
      // Dispatch update event
      window.dispatchEvent(new CustomEvent('nuvio_stats_update', { 
        detail: JSON.parse(localStorage.getItem(STORAGE_KEY)) 
      }));
    } catch (err) {
      console.error("Supabase Profile Sync Error:", err);
    }
  },

  // --- REDACTED: DANGEROUS BACKDOORS REMOVED FOR PRODUCTION ---
  // promoteToAdmin and injectWealth are now disabled at the neural level.

  validateStreak: async () => {
    const user = authService.me();
    if (!user || !user.last_activity_date) return;

    const last = new Date(user.last_activity_date);
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);

    if (diffHours > 48) {
      // Streak Lost (Tier 1: Loss Aversion)
      console.log("NEURAL STREAK TERMINATED. RESETTING TO 1.");
      await authService.updateMe({ streak: 1 });
      return { status: 'reset', lostDays: Math.floor(diffHours / 24) };
    } else if (diffHours > 24 && now.getDate() !== last.getDate()) {
      // New Day, increment streak
      await authService.updateMe({ streak: (user.streak || 0) + 1 });
      return { status: 'increment' };
    }
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
    delete sanitizedData.xp;
    delete sanitizedData.level;
    delete sanitizedData.era_tokens;

    const updated = { ...current, ...sanitizedData };
    
    // Save locally for speed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updated }));
    window.dispatchEvent(new CustomEvent('nuvio_sync_pulse', { detail: { syncing: true } }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...sanitizedData, last_activity_date: new Date().toISOString() })
        .eq('id', current.id);
      
      if (error) throw error;
    } catch (err) {
      console.error("NEURAL CLOUD SYNC FAILURE:", err.message);
    } finally {
      window.dispatchEvent(new CustomEvent('nuvio_sync_pulse', { detail: { syncing: false } }));
    }

    return updated;
  },

  addTokens: async (amount) => {
    if (amount === 0) return;
    const user = authService.me();
    if (!user) return;

    // Switch to Atomic RPC for currency
    const { data, error } = await supabase.rpc('rpc_add_tokens', { amount_to_add: amount });
    
    if (!error && data.success) {
      const updated = { ...user, era_tokens: data.new_balance };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updated }));
      return updated;
    }
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
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: profile || data.user }));
    return profile || data.user;
  },

  signInWithGoogle: async () => {
    // Dynamically calculate redirect to maintain path structure in both local and live envs
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: null }));
    window.location.href = '/nuvio/';
  }
};
