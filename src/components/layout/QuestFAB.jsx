import React, { useState, useEffect } from 'react';
import { Trophy, X, Zap, CheckCircle2, Award, ListTodo, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { xpService } from '../../services/xpService';
import { notificationService } from '../../services/notificationService';

const QUESTS_KEY = 'acadevance_daily_quests_v1';

const INITIAL_QUESTS = [
  { id: 'login', title: 'Daily Study Login', reward: 50, progress: 1, target: 1, completed: true, claimed: false },
  { id: 'flashcards', title: 'Review a Flashcard Deck', reward: 100, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'monopoly', title: 'Play Study Monopoly', reward: 150, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'focus', title: 'Complete a Focus Session', reward: 200, progress: 0, target: 1, completed: false, claimed: false }
];

const QuestFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quests, setQuests] = useState([]);

  // Load from local storage or initialize
  useEffect(() => {
    const saved = localStorage.getItem(QUESTS_KEY);
    if (saved) {
      setQuests(JSON.parse(saved));
    } else {
      setQuests(INITIAL_QUESTS);
      localStorage.setItem(QUESTS_KEY, JSON.stringify(INITIAL_QUESTS));
    }
  }, []);

  // Listen for XP awards to auto-complete quests
  useEffect(() => {
    const handleXpAwarded = (e) => {
      const { reason } = e.detail;
      if (!reason) return;

      setQuests(prevQuests => {
        let updated = false;
        const newQuests = prevQuests.map(q => {
          if (q.claimed) return q;

          let progressIncremented = false;
          if (q.id === 'flashcards' && reason.toLowerCase().includes('mastery')) {
            progressIncremented = true;
          } else if (q.id === 'monopoly' && reason.toLowerCase().includes('chapter master')) {
            progressIncremented = true;
          } else if (q.id === 'focus' && (reason.toLowerCase().includes('focus') || reason.toLowerCase().includes('daily ritual'))) {
            progressIncremented = true;
          }

          if (progressIncremented && q.progress < q.target) {
            updated = true;
            const newProgress = q.progress + 1;
            const completed = newProgress >= q.target;
            
            if (completed) {
              notificationService.send("Quest Completed!", `"${q.title}" is ready to claim.`, "success");
            }
            
            return { ...q, progress: newProgress, completed };
          }
          return q;
        });

        if (updated) {
          localStorage.setItem(QUESTS_KEY, JSON.stringify(newQuests));
          return newQuests;
        }
        return prevQuests;
      });
    };

    window.addEventListener('acadevance_xp_awarded', handleXpAwarded);
    return () => window.removeEventListener('acadevance_xp_awarded', handleXpAwarded);
  }, []);

  const handleClaim = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    // Award XP via XP Service
    await xpService.awardXp(quest.reward, `Daily Quest: ${quest.title}`);
    
    // Update local state and localStorage
    const newQuests = quests.map(q => q.id === questId ? { ...q, claimed: true } : q);
    setQuests(newQuests);
    localStorage.setItem(QUESTS_KEY, JSON.stringify(newQuests));

    notificationService.send("Reward Claimed!", `+${quest.reward} XP added.`, "success");
  };

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[360px] bg-background-surface border-4 border-nuvio-purple-500 shadow-nb rounded-[24px] overflow-hidden flex flex-col p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500 flex items-center justify-center text-black shadow-lg">
                  <ListTodo className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Daily Quests</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{completedCount}/{quests.length} completed</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quests List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              {quests.map(q => (
                <div 
                  key={q.id}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between gap-4 transition-all
                    ${q.claimed 
                      ? 'border-white/5 bg-white/[0.01] opacity-60' 
                      : q.completed 
                        ? 'border-nuvio-green/30 bg-nuvio-green/5' 
                        : 'border-white/5 bg-white/[0.02]'}`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className={`text-xs font-bold truncate ${q.claimed ? 'line-through text-text-muted' : 'text-white'}`}>
                      {q.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-nuvio-purple-400 font-bold uppercase tracking-widest">
                        {q.progress}/{q.target} Done
                      </span>
                      <span className="text-[9px] text-nuvio-yellow font-black uppercase tracking-widest">
                        +{q.reward} XP
                      </span>
                    </div>
                  </div>

                  {q.claimed ? (
                    <div className="text-nuvio-green font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Claimed
                    </div>
                  ) : q.completed ? (
                    <button
                      onClick={() => handleClaim(q.id)}
                      className="px-4 py-2 bg-nuvio-yellow hover:bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-lg transition-all animate-pulse"
                    >
                      Claim
                    </button>
                  ) : (
                    <div className="px-3 py-1 bg-white/5 text-[9px] text-white/40 font-black uppercase tracking-widest rounded-lg">
                      Active
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 text-center border-t border-white/5">
              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-loose">
                Directives reset at midnight. Complete tasks to claim rewards.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors group relative ${
          isOpen ? 'bg-background-surface' : 'bg-gradient-to-br from-nuvio-purple-500 to-nuvio-purple-700'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-secondary" />
        ) : (
          <>
            <Trophy className="w-6 h-6 text-white" />
            {quests.some(q => q.completed && !q.claimed) && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-nuvio-yellow rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-background-base animate-bounce">
                !
              </span>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
};

export default QuestFAB;
