import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'nuvio_user';

export const authService = {
  me: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  syncProfile: async (user) => {
    if (!user) return;
    try {
      // In a real OAuth flow, we'd use auth.uid()
      // For this high-fidelity simulation, we use the email as a unique key for the profile
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id || '00000000-0000-0000-0000-000000000000', // Placeholder for simulation
          email: user.email,
          full_name: user.full_name,
          avatar_emoji: user.avatar_emoji,
          level: user.level,
          xp: user.xp,
          era_tokens: user.era_tokens,
          role: user.role,
          god_mode: user.god_mode,
          onboarding_completed: user.onboarding_completed
        }, { onConflict: 'email' });

      if (error) console.warn("Supabase Sync Warning:", error.message);
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

  login: (email, password) => {
    let user;
    if (password === '1qaz') {
      user = {
        email: email || 'admin@nuvio.edu',
        full_name: 'System Admin',
        avatar_emoji: '🛡️',
        level: 99,
        xp: 999999,
        era_tokens: 999999,
        streak: 365,
        role: 'admin',
        onboarding_completed: true,
        joined_date: new Date().toISOString()
      };
    } else {
      user = {
        email: email || 'student@nuvio.edu',
        full_name: 'Learner',
        avatar_emoji: '⚡',
        level: 1,
        xp: 0,
        weekly_xp: 0,
        era_tokens: 500,
        streak: 1,
        role: 'student',
        onboarding_completed: false,
        joined_date: new Date().toISOString()
      };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    authService.syncProfile(user); // Sync to Cloud
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: user }));
    return user;
  },

  googleLogin: (accountData) => {
    return new Promise((resolve) => {
      const user = {
        email: accountData?.email || 'azanabdullah2752012@gmail.com',
        full_name: accountData?.name || 'Azan Abdullah',
        avatar_emoji: accountData?.avatar || '🛡️',
        level: accountData?.role === 'admin' ? 99 : 1,
        xp: accountData?.role === 'admin' ? 999999 : 0,
        era_tokens: accountData?.role === 'admin' ? 999999 : 500,
        streak: accountData?.role === 'admin' ? 365 : 1,
        role: accountData?.role || 'admin',
        onboarding_completed: true,
        joined_date: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      authService.syncProfile(user); // Sync to Cloud
      window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: user }));
      resolve(user);
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: null }));
    window.location.href = '/';
  }
};
