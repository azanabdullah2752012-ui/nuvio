import { supabase } from '../lib/supabase';
import { authService } from './authService';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000,
  15000, 20000, 26000, 33000, 41000, 50000, 60000, 71000, 83000, 96000
];

const HISTORY_KEY = 'nuvio_xp_history';
const BREAKDOWN_KEY = 'nuvio_xp_breakdown';

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

  getHistory: async () => {
    const user = authService.me();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('xp_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) return [];
    return data;
  },

  awardXp: async (amount, reason) => {
    const user = authService.me();
    if (!user) return null;

    const newXp = (user.xp || 0) + amount;
    const newLevel = xpService.getLevel(newXp);
    const leveledUp = newLevel > (user.level || 1);
    
    const category = reason.toLowerCase().includes('quiz') || reason.toLowerCase().includes('bingo') || reason.toLowerCase().includes('ludo') || reason.toLowerCase().includes('uno') ? 'game' : 
                     reason.toLowerCase().includes('streak') ? 'streak' : 
                     reason.toLowerCase().includes('task') || reason.toLowerCase().includes('planner') ? 'task' : 'social';

    const tokensEarned = Math.floor(amount / 10);

    // 1. Sync Profile (Xp, Level, Tokens)
    const updatedUser = await authService.updateMe({
      xp: newXp,
      level: newLevel,
      weekly_xp: (user.weekly_xp || 0) + amount,
      era_tokens: (user.era_tokens || 0) + tokensEarned
    });

    // 2. Persistent XP Log Entry
    try {
      await supabase.from('xp_logs').insert([{
        user_id: user.id,
        amount,
        reason,
        category
      }]);
    } catch (e) {
      console.error("Failed to log XP entry:", e);
    }

    // 3. Emit local event for UI snappiness
    window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updatedUser }));

    // 4. Peer Sync
    import('./peerService').then(({ peerService }) => {
      peerService.syncPeers(newXp);
    });

    return { updatedUser, leveledUp, amount, reason };
  },

  getTotalXp: () => {
    return authService.me()?.xp || 0;
  },

  getBreakdown: async () => {
    const user = authService.me();
    if (!user) return { game: 0, streak: 0, task: 0, social: 0 };

    const { data, error } = await supabase
      .from('xp_logs')
      .select('amount, category')
      .eq('user_id', user.id);

    if (error) return { game: 0, streak: 0, task: 0, social: 0 };

    return data.reduce((acc, curr) => {
       acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
       return acc;
    }, { game: 0, streak: 0, task: 0, social: 0 });
  }
};
