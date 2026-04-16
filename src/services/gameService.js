import { notificationService } from './notificationService';
import { xpService } from './xpService';
import { authService } from './authService';
import { supabase } from '../lib/supabase';

export const gameService = {
  QUESTION_BANK: {
    Math: [
      { q: "What is 15 * 8 - 20?", options: ["100", "80", "120", "110"], a: 0, d: "Easy" },
      { q: "Solve for x: 3x + 12 = 33", options: ["5", "7", "9", "6"], a: 1, d: "Medium" },
      { q: "What is the square root of 225?", options: ["12", "15", "13", "16"], a: 1, d: "Easy" },
      { q: "A cube has a side length of 4. Volume?", options: ["16", "32", "64", "48"], a: 2, d: "Medium" }
    ],
    Science: [
      { q: "Chemical symbol for Gold?", options: ["Ag", "Au", "Pb", "Fe"], a: 1, d: "Easy" },
      { q: "Which planet is the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1, d: "Easy" },
      { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], a: 2, d: "Medium" },
      { q: "Speed of light in vacuum (km/s)?", options: ["150k", "300k", "500k", "1m"], a: 1, d: "Hard" }
    ],
    Social: [
      { q: "Who was the first US President?", options: ["Lincoln", "Jefferson", "Washington", "Adams"], a: 2, d: "Easy" },
      { q: "Year WW2 ended?", options: ["1918", "1945", "1950", "1939"], a: 1, d: "Easy" },
      { q: "Smallest continent?", options: ["Europe", "Australia", "Antarctica", "Africa"], a: 1, d: "Medium" },
      { q: "Capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Kyoto"], a: 2, d: "Medium" }
    ]
  },

  awardPlayer: async (playerIdx, amount, reason, gameType = 'arcade') => {
    // Only persist if it's Player 1 (Logged-in User)
    if (playerIdx === 0) {
      const user = authService.me();
      
      try {
        // Atomic Sync
        await Promise.all([
          authService.updateMe({
            knowledge_points: (user.knowledge_points || 0) + (amount * 2.5),
            era_tokens: (user.era_tokens || 0) + Math.floor(amount / 5)
          }),
          xpService.awardXp(amount, reason),
          supabase.from('game_matches').insert([{
            user_id: user.id,
            game_type: gameType,
            result: 'win',
            kp_earned: Math.floor(amount * 2.5),
            xp_earned: amount
          }])
        ]);
        
        notificationService.send("Neural Gain", `+${amount} XP Synchronized to cloud.`, "success");
      } catch (err) {
        console.error("StudyVerse Sync failure:", err);
      }
    }
  }
};
