import { authService } from './authService';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000,
  15000, 20000, 26000, 33000, 41000, 50000, 60000, 71000, 83000, 96000
];

const HISTORY_KEY = 'nuvio_xp_history';

export const xpService = {
  getLevel: (xp) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        if (i === LEVEL_THRESHOLDS.length - 1) {
          const extraXp = xp - LEVEL_THRESHOLDS[i];
          return 20 + Math.floor(extraXp / 15000);
        }
        return i + 1;
      }
    }
    return 1;
  },

  getNextLevelXp: (level) => {
    if (level < 20) return LEVEL_THRESHOLDS[level];
    return LEVEL_THRESHOLDS[19] + (level - 19) * 15000;
  },

  getHistory: () => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  awardXp: (amount, reason) => {
    const user = authService.me();
    if (!user) return null;

    const newXp = (user.xp || 0) + amount;
    const newLevel = xpService.getLevel(newXp);
    const leveledUp = newLevel > (user.level || 1);
    
    // Tokens: 1 Token per 10 XP
    const tokensEarned = Math.floor(amount / 10);

    const updatedUser = authService.updateMe({
      xp: newXp,
      level: newLevel,
      weekly_xp: (user.weekly_xp || 0) + amount,
      era_tokens: (user.era_tokens || 0) + tokensEarned
    });

    // Save history
    const history = xpService.getHistory();
    history.push({
      id: Math.random().toString(36).substr(2, 9),
      amount,
      reason,
      timestamp: new Date().toISOString(),
      balance: newXp
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-100)));

    // Emit event for UI components to refresh
    window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updatedUser }));

    // Realization: Sync Peers
    import('./peerService').then(({ peerService }) => {
      peerService.syncPeers(newXp);
    });

    return { updatedUser, leveledUp, amount, reason };
  },

  getTotalXp: () => {
    return authService.me()?.xp || 0;
  }
};
