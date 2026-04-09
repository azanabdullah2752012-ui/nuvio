const STORAGE_KEY = 'nuvio_user';

export const authService = {
  me: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  updateMe: (newData) => {
    const current = authService.me();
    const updated = { ...current, ...newData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch event for UI and guards to sync
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
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: user }));
    return user;
  },

  googleLogin: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = authService.login('student@gmail.com', 'google_bypass');
        resolve(mockUser);
      }, 1500);
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('nuvio_auth_change', { detail: null }));
    window.location.href = '/';
  }
};
