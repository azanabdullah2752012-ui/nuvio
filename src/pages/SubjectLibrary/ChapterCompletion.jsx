import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, ArrowRight, Star, RefreshCw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import './styles.css';

const ChapterCompletion = ({ chapter, subject, onReturn }) => {
  useEffect(() => {
    // Show confetti on mount
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#06b6d4', '#22c55e']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#06b6d4', '#22c55e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-xl mx-auto space-y-6 text-center"
    >
      {/* Trophy and Chapter Completed Banner */}
      <div className="glass-panel p-8 space-y-4 border-green-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-bounce" />
        
        <div className="space-y-1 relative z-10">
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black tracking-widest text-green-400 uppercase">
            Quest Completed!
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-3">
            {chapter.title} Complete!
          </h2>
          <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
            Congratulations! You have successfully completed this NCERT module and unlocked new quests.
          </p>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-5 border border-white/5 space-y-1 shadow">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Medal Rewards</span>
          <strong className="text-2xl font-black text-purple-400 font-mono">+120 XP</strong>
        </div>

        <div className="glass-panel p-5 border border-white/5 space-y-1 shadow">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Loot Coins</span>
          <strong className="text-2xl font-black text-amber-400 font-mono">+40 Coins</strong>
        </div>
      </div>

      {/* Unlocked Badges Panel */}
      <div className="glass-panel p-6 space-y-4 text-left border border-white/10 shadow">
        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Unlocked Badges & Achievements
        </span>

        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 flex-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl shrink-0 shadow">
              🏆
            </div>
            <div>
              <h5 className="text-[11px] font-black text-white uppercase leading-none">Syllabus Slayer</h5>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Defeated this chapter's milestones</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 flex-1">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl shrink-0 shadow">
              🔥
            </div>
            <div>
              <h5 className="text-[11px] font-black text-white uppercase leading-none">Active Recall Ace</h5>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Unveiled all worked example paths</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Next steps */}
      <div className="glass-panel p-5 bg-green-500/5 border border-green-500/15 text-left flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="block text-[8px] font-black text-green-400 uppercase tracking-widest">Next Chapter Unlocked</span>
          <h5 className="text-xs font-black text-white uppercase tracking-tight">Ready for Next Quest stop</h5>
        </div>
        <button
          onClick={onReturn}
          className="px-5 py-3.5 bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-widest text-[9px] rounded-lg transition-all shadow flex items-center gap-1.5 active:scale-95"
        >
          Next stop <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterCompletion;
