import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Heart, Star, Cloud, MousePointer2 } from 'lucide-react';

import MiniProfileCard from './MiniProfileCard';

// --- PARTICLE SYSTEM ---
const ParticleBurst = ({ x, y, onComplete }) => {
  const [particles] = useState(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    ix: x,
    iy: y,
    tx: x + (Math.random() - 0.5) * 200,
    ty: y + (Math.random() - 0.5) * 200,
    size: Math.random() * 10 + 10,
    rot: Math.random() * 360
  })));

  return (
    <AnimatePresence>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.ix, y: p.iy, opacity: 1, scale: 0.5 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 1.5, rotate: p.rot }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
          className="fixed pointer-events-auto z-[9999] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('nuvio_particle_bonus', { detail: { x: p.tx, y: p.ty } }));
          }}
        >
          <Zap className="w-4 h-4 text-nuvio-yellow fill-nuvio-yellow drop-shadow-[0_0_10px_rgba(255,165,2,0.8)]" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// --- REACTION PICKER ---
const ReactionPicker = ({ x, y, onSelect }) => {
  const emojis = ['🔥', '💡', '🚀', '💯', '⭐️', '🎯'];
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed z-[10000] bg-black border-2 border-nuvio-purple-500 p-2 flex gap-2 shadow-nb pointer-events-auto"
      style={{ top: y - 50, left: x - 50 }}
    >
      {emojis.map(e => (
        <button 
          key={e} 
          onClick={() => onSelect(e)}
          className="hover:bg-white/10 p-1 text-lg transition-transform hover:scale-125"
        >
          {e}
        </button>
      ))}
    </motion.div>
  );
};

const InteractionSystem = () => {
  const [bursts, setBursts] = useState([]);
  const [hoverReaction, setHoverReaction] = useState(null);
  const [reactions, setFloatingReactions] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [easterEggs, setEasterEggs] = useState([]);

  useEffect(() => {
    // Generate an easter egg occasionally
    const eggInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance per interval
        const id = Date.now();
        setEasterEggs(prev => [...prev, {
          id,
          x: Math.random() * (window.innerWidth - 100) + 50,
          y: Math.random() * (window.innerHeight - 100) + 50,
          type: Math.random() > 0.5 ? 'zap' : 'star'
        }]);
      }
    }, 60000); // Check every minute

    const handleStatsUpdate = (e) => {
      // Trigger burst on significant XP gain
      if (e.detail?.last_gain > 0) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        setBursts(prev => [...prev, { id: Date.now(), x, y }]);
      }
    };

    const handleParticleBonus = (e) => {
      // Logic for bonus XP awarded in Plan
      if (e.detail?.type === 'reaction') {
        addFloatingReaction(e.detail.emoji, e.detail.x, e.detail.y);
        return;
      }
      import('../services/xpService').then(({ xpService }) => {
        xpService.awardXp(10, 'Neural Reflex');
      });
    };

    const handleProfileTrigger = (e) => {
      setActiveProfile(e.detail.user);
    };

    window.addEventListener('nuvio_stats_update', handleStatsUpdate);
    window.addEventListener('nuvio_particle_bonus', handleParticleBonus);
    window.addEventListener('nuvio_open_profile', handleProfileTrigger);
    
    return () => {
      clearInterval(eggInterval);
      window.removeEventListener('nuvio_stats_update', handleStatsUpdate);
      window.removeEventListener('nuvio_particle_bonus', handleParticleBonus);
      window.removeEventListener('nuvio_open_profile', handleProfileTrigger);
    };
  }, []);

  const addFloatingReaction = (emoji, x, y) => {
    const id = Date.now();
    setFloatingReactions(prev => [...prev, { id, emoji, x, y }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 4000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {bursts.map(b => (
        <ParticleBurst key={b.id} x={b.x} y={b.y} onComplete={() => setBursts(prev => prev.filter(p => p.id !== b.id))} />
      ))}

      {/* Easter Eggs */}
      <AnimatePresence>
        {easterEggs.map(egg => (
           <motion.div
             key={egg.id}
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             exit={{ scale: 0 }}
             onClick={() => {
               window.dispatchEvent(new CustomEvent('nuvio_particle_bonus', { detail: { x: egg.x, y: egg.y } }));
               setEasterEggs(prev => prev.filter(e => e.id !== egg.id));
             }}
             className="fixed pointer-events-auto cursor-pointer p-3 bg-nuvio-purple-500/20 rounded-full border border-nuvio-purple-500/40 hover:bg-nuvio-purple-500 transition-all opacity-40 hover:opacity-100"
             style={{ top: egg.y, left: egg.x }}
           >
             {egg.type === 'zap' ? <Zap className="w-4 h-4 text-nuvio-yellow" /> : <Sparkles className="w-4 h-4 text-nuvio-cyan" />}
           </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Reactions */}
      <AnimatePresence>
        {reactions.map(r => (
          <motion.div
            key={r.id}
            initial={{ x: r.x, y: r.y, opacity: 1, scale: 1 }}
            animate={{ y: r.y - 300, opacity: 0, x: r.x + (Math.random() - 0.5) * 100 }}
            transition={{ duration: 4, ease: "linear" }}
            className="fixed text-4xl"
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {activeProfile && (
          <MiniProfileCard user={activeProfile} onClose={() => setActiveProfile(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionSystem;
