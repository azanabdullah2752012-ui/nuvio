import { authService } from './authService';
import { notificationService } from './notificationService';

export const rewardService = {
  // Variable Reward (Tier 2: Slot Machine Psychology)
  triggerNeuralDrop: async () => {
    const chance = Math.random();
    
    // 10% chance for a Critical Drop
    if (chance < 0.10) {
      const type = Math.random() > 0.5 ? 'Tokens' : 'XP';
      const amount = type === 'Tokens' ? 200 : 500;
      
      const user = authService.me();
      if (!user) return null;

      console.log(`CRITICAL NEURAL DROP: +${amount} ${type}`);
      
      const updateData = type === 'Tokens' 
        ? { era_tokens: (user.era_tokens || 0) + amount }
        : { xp: (user.xp || 0) + amount };

      await authService.updateMe(updateData);
      
      notificationService.send(
        "CRITICAL DROP", 
        `Nova detected a neural surge! +${amount} ${type} secured.`, 
        "success"
      );

      return { type, amount };
    }
    
    return null;
  }
};
