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

      const userEmail = (user.email || '').toLowerCase();
      const isAdminEmail = ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail);

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

  updateMe: (newData) => {
    const current = authService.me();
    const updated = { ...current, ...newData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Cloud Sync
    authService.syncProfile(updated);

    // Dispatch events
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: updated }));
    window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updated }));
    return updated;
  },

  toggleGodMode: () => {
    const user = authService.me();
    if (!user) return;
    const newState = !user.god_mode;
    return authService.updateMe({ god_mode: newState });
  },

  injectWealth: () => {
    const user = authService.me();
    if (!user) return;
    return authService.updateMe({ 
      era_tokens: (user.era_tokens || 0) + 1000000,
      xp: (user.xp || 0) + 50000,
      level: 20
    });
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
