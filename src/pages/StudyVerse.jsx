import React from 'react';
import { 
  Gamepad2, Sword, Map, Trophy, 
  Sparkles, ChevronRight, Zap, Target 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Internal icon hack for simplicity
const Skull = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1V11a4 4 0 1 0-8 0v10a1 1 0 0 0 1 1h6z"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M12 15h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>
);

const StudyVerse = () => {
  const gameCards = [
    { 
      id: 'boss-raid', 
      name: 'World Boss Raid', 
      icon: Skull, 
      color: 'bg-nuvio-red', 
      desc: 'Join the cluster to defeat the procrastination dragon.', 
      path: '/boss-raid',
      stats: 'Global Event'
    },
    { 
      id: 'knowledge-map', 
      name: 'Neural Topology', 
      icon: Map, 
      color: 'bg-nuvio-purple-500', 
      desc: 'Explore your cognitive growth across academic nodes.', 
      path: '/knowledge-map',
      stats: 'Real-time Mapping'
    },
    { 
      id: 'leaderboard', 
      name: 'Elite Rankings', 
      icon: Trophy, 
      color: 'bg-nuvio-yellow', 
      desc: 'See where you stand in the global student cluster.', 
      path: '/leaderboard',
      stats: 'Sync Active'
    }
  ];

  return (
    <div className="space-y-12 pb-20 pt-4">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-nuvio-purple-500/10 rounded-full border border-nuvio-purple-500/20 mb-4">
          <Gamepad2 className="w-12 h-12 text-nuvio-purple-400" />
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Study Verse</h1>
        <p className="text-text-secondary font-medium max-w-xl mx-auto">The high-fidelity gaming sector of Nuvio. Transform your academic energy into power.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gameCards.map((card, i) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => window.location.hash = card.path}
            className="nv-card p-0 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden h-[400px] flex flex-col"
          >
            <div className={`absolute top-0 left-0 w-full h-2 ${card.color}`} />
            
            <div className="p-10 flex flex-col h-full">
              <div className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white mb-8 shadow-2xl`}>
                <card.icon className="w-8 h-8" />
              </div>

              <div className="space-y-4 flex-1">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{card.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">{card.desc}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-3 h-3" /> {card.stats}
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${card.color} blur-[100px] opacity-10`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudyVerse;
