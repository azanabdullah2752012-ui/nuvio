import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, CheckCircle2, Star, Zap, Coins } from 'lucide-react';
import { authService } from '../services/authService';
import { ACHIEVEMENTS } from '../services/gamificationService';

const CATEGORIES = [
  { id: 'all',      label: 'All',         emoji: '🏆' },
  { id: 'rank',     label: 'Rank',        emoji: '⭐' },
  { id: 'streak',   label: 'Streak',      emoji: '🔥' },
  { id: 'focus',    label: 'Focus',       emoji: '🎯' },
  { id: 'flashcard',label: 'Flashcards',  emoji: '🃏' },
  { id: 'quiz',     label: 'Quiz',        emoji: '❓' },
  { id: 'math',     label: 'Math',        emoji: '📐' },
  { id: 'science',  label: 'Science',     emoji: '🧪' },
  { id: 'social',   label: 'Social',      emoji: '🗺️' },
  { id: 'homework', label: 'Homework',    emoji: '📝' },
  { id: 'boss',     label: 'Boss Raids',  emoji: '⚔️' },
  { id: 'quest',    label: 'Quests',      emoji: '📌' },
];

const TIER_STYLES = {
  gold:   { bg: 'from-amber-500/20 to-yellow-500/10',  border: 'border-amber-500/40',  badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',  label: 'Gold',   glow: 'shadow-amber-500/20'  },
  silver: { bg: 'from-slate-400/20 to-slate-500/10',   border: 'border-slate-400/30',  badge: 'bg-slate-400/20 text-slate-300 border border-slate-400/30',   label: 'Silver', glow: 'shadow-slate-400/20'  },
  bronze: { bg: 'from-orange-700/20 to-amber-900/10',  border: 'border-orange-600/30', badge: 'bg-orange-700/20 text-orange-400 border border-orange-600/30', label: 'Bronze', glow: 'shadow-orange-700/20' },
};

const Achievements = () => {
  const [user, setUser] = useState(authService.me());
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAch, setSelectedAch] = useState(null);

  useEffect(() => {
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  const earned = new Set(user?.achievements || []);
  const filtered = activeCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory);

  const earnedCount = ACHIEVEMENTS.filter(a => earned.has(a.id)).length;
  const totalCount  = ACHIEVEMENTS.length;

  // Progress of displayed category
  const catEarned = filtered.filter(a => earned.has(a.id)).length;

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Trophy className="w-8 h-8 text-amber-400" />
            Achievements
          </h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">
            {earnedCount} / {totalCount} Unlocked &mdash; Your Academic Legacy
          </p>
        </div>

        {/* Global progress ring */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="32" fill="none"
              stroke="url(#achGold)"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - earnedCount / totalCount)}`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="achGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-white">{Math.round(earnedCount / totalCount * 100)}%</span>
          </div>
        </div>
      </div>

      {/* ─── Category Filter ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          const catTotal = cat.id === 'all' ? totalCount : ACHIEVEMENTS.filter(a => a.category === cat.id).length;
          const catDone  = cat.id === 'all' ? earnedCount : ACHIEVEMENTS.filter(a => a.category === cat.id && earned.has(a.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-black/20' : 'bg-white/10'}`}>
                {catDone}/{catTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Category Progress Bar ─── */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
          animate={{ width: `${catEarned / Math.max(filtered.length, 1) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* ─── Achievement Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ach, i) => {
            const isEarned = earned.has(ach.id);
            const ts = TIER_STYLES[ach.tier] || TIER_STYLES.bronze;

            return (
              <motion.div
                key={ach.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.02, duration: 0.25 }}
                onClick={() => setSelectedAch(ach)}
                className={`relative cursor-pointer rounded-2xl bg-gradient-to-br ${ts.bg} border ${ts.border} p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${ts.glow} ${
                  isEarned ? 'shadow-lg' : 'opacity-60 grayscale-[40%]'
                }`}
              >
                {/* Earned glow overlay */}
                {isEarned && (
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-400/30 pointer-events-none" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    isEarned ? 'bg-white/10' : 'bg-white/5'
                  }`}>
                    {ach.icon}
                    {isEarned && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {!isEarned && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${ts.badge}`}>
                        {ts.label}
                      </span>
                    </div>
                    <h3 className={`text-sm font-black uppercase tracking-tight truncate ${isEarned ? 'text-white' : 'text-text-muted'}`}>
                      {ach.title}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{ach.desc}</p>
                  </div>
                </div>

                {/* Reward footer */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                    <Zap className="w-3 h-3" /> +{ach.xp} XP
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-yellow-400">
                    <Coins className="w-3 h-3" /> +{ach.coins} Coins
                  </div>
                  {isEarned && (
                    <span className="ml-auto text-[10px] font-black text-green-400 uppercase tracking-widest">✓ Earned</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selectedAch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedAch(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl bg-background-card border ${TIER_STYLES[selectedAch.tier].border} p-8 shadow-2xl`}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-2">{selectedAch.icon}</div>
                <div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${TIER_STYLES[selectedAch.tier].badge}`}>
                    {TIER_STYLES[selectedAch.tier].label} Achievement
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedAch.title}</h2>
                <p className="text-text-muted text-sm">{selectedAch.desc}</p>

                <div className="flex gap-4 justify-center mt-6">
                  <div className="px-4 py-3 bg-white/5 rounded-2xl text-center">
                    <div className="text-xl font-black text-amber-400">+{selectedAch.xp}</div>
                    <div className="text-[9px] text-text-muted font-black uppercase tracking-widest">XP Reward</div>
                  </div>
                  <div className="px-4 py-3 bg-white/5 rounded-2xl text-center">
                    <div className="text-xl font-black text-yellow-400">+{selectedAch.coins}</div>
                    <div className="text-[9px] text-text-muted font-black uppercase tracking-widest">Coins</div>
                  </div>
                </div>

                <div className={`mt-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest ${
                  earned.has(selectedAch.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-text-muted'
                }`}>
                  {earned.has(selectedAch.id) ? '✓ Achievement Earned!' : '🔒 Not yet earned'}
                </div>

                <button
                  onClick={() => setSelectedAch(null)}
                  className="mt-2 w-full py-3 bg-white/5 rounded-2xl text-text-muted text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
