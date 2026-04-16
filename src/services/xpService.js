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
    if (amount <= 0) return null;
    const user = authService.me();
    if (!user) return null;

    const category = reason.toLowerCase().includes('quiz') || reason.toLowerCase().includes('bingo') || reason.toLowerCase().includes('ludo') || reason.toLowerCase().includes('uno') ? 'game' : 
                     reason.toLowerCase().includes('streak') ? 'streak' : 
                     reason.toLowerCase().includes('task') || reason.toLowerCase().includes('planner') ? 'task' : 'social';

    try {
      // 🚀 ATOMIC SYNC: One call to handle Profile + Logs + Level Calculation
      const { data, error } = await supabase.rpc('rpc_award_xp', {
        amount_to_add: amount,
        award_reason: reason,
        award_category: category
      });

      if (error || !data.success) throw error || new Error(data.message);

      const updatedUser = data.profile;
      const leveledUp = data.leveled_up;

      // 1. Sync Local State
      localStorage.setItem('nuvio_user', JSON.stringify(updatedUser));
      
      // 2. Emit events for UI
      window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: updatedUser }));
      
      if (leveledUp) {
        window.dispatchEvent(new CustomEvent('nuvio_notification', { 
          detail: { title: "Neural Ascension", message: `Reached Level ${updatedUser.level}!`, type: 'success' } 
        }));
      }

      return { updatedUser, leveledUp, amount, reason };
    } catch (err) {
      console.error("NEURAL XP SYNC FAILURE:", err);
      return null;
    }
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
