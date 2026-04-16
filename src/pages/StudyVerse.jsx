import React from 'react';
import { 
  Gamepad2, Sword, Map, Trophy, 
  Sparkles, ChevronRight, Zap, Target,
  Cpu, Rocket, Brain, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyVerse = () => {
  const games = [
    { 
      id: 'neural-trivia', 
      name: 'Neural Trivia', 
      icon: Brain, 
      color: 'from-nuvio-purple-400 to-nuvio-purple-600', 
      tag: 'NEW',
      desc: 'Test your knowledge limits in a fast-paced MCQ gauntlet powered by Nova AI.',
      stats: 'AI-Generated Content',
      path: '/trivia-game',
      active: true,
      image: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: 'boss-raid', 
      name: 'World Boss Raid', 
      icon: Sword, 
      color: 'from-nuvio-red to-orange-600', 
      tag: 'LIVE EVENT',
      desc: 'Join the global cluster to defeat the Procrastination Dragon. High-stakes rewards.',
      stats: 'Massive Multiplayer',
      path: '/boss-raid',
      active: true,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: 'leaderboard', 
      name: 'Elite Rankings', 
      icon: Trophy, 
      color: 'from-nuvio-yellow to-orange-400', 
      tag: 'RANKED',
      desc: 'Compare your academic firepower against the elite top 1% of the StudyVerse.',
      stats: 'Global Sync',
      path: '/leaderboard',
      active: true,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-16 pb-32 nv-page-transition">
      <header className="text-center space-y-8 relative py-12">
        <div className="absolute inset-0 bg-nuvio-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="w-16 h-16 bg-nuvio-purple-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-nuvio-purple-500/20">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <div className="text-left pr-4">
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Arcade Sector</h1>
             <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mt-1">Nuvio StudyVerse 2.0</p>
          </div>
        </motion.div>
        
        <p className="max-w-xl mx-auto text-text-secondary font-medium text-lg leading-relaxed relative z-10">
          Neural-linked educational simulations. Convert your concentrated academic energy into global rankings and XP.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => { if(game.active) window.location.hash = game.path }}
            className={`
              nv-card p-0 border-white/5 bg-[#12121e] hover:bg-[#161625] transition-all cursor-pointer group relative overflow-hidden flex flex-col h-[550px] shadow-2xl
              ${!game.active && 'opacity-50 grayscale cursor-not-allowed'}
            `}
          >
            {/* Game Poster Image */}
            <div className="h-[45%] w-full relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] to-transparent z-10" />
               <img 
                 src={game.image} 
                 alt={game.name}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
               />
               <div className={`absolute top-6 left-6 px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest z-20 bg-gradient-to-r ${game.color} shadow-lg shadow-black/20`}>
                 {game.tag}
               </div>
            </div>

            <div className="p-10 flex flex-col justify-between flex-1 relative z-20 -mt-10">
               <div className="space-y-6">
                  <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-2xl shadow-indigo-500/10`}>
                    <game.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-nuvio-purple-400 transition-colors uppercase">{game.name}</h3>
                    <p className="text-sm text-text-muted mt-4 leading-relaxed font-bold uppercase tracking-wide h-12 overflow-hidden text-ellipsis">
                      {game.desc}
                    </p>
                  </div>
               </div>

               <div className="flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Status Report</span>
                    <div className="text-xs font-black text-white uppercase flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-nuvio-green animate-pulse" />
                       {game.stats}
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:${game.color} group-hover:text-white transition-all shadow-xl`}>
                    <ChevronRight className="w-7 h-7" />
                  </div>
               </div>
            </div>

            {/* Glowing Accent */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r ${game.color} blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* Global Status Footer */}
      <footer className="max-w-5xl mx-auto bg-white/[0.01] border border-white/5 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-around gap-12 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nuvio-purple-500 via-nuvio-blue to-nuvio-purple-500" />
         
         <div className="text-center md:text-left space-y-2">
            <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.4em]">Global Network</div>
            <div className="text-2xl font-black text-white uppercase">4.2k active nodes</div>
         </div>

         <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
               <Zap className="w-6 h-6 text-nuvio-yellow mb-2" />
               <span className="text-[9px] font-black text-text-muted uppercase">Turbo Active</span>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="flex flex-col items-center">
               <Flame className="w-6 h-6 text-nuvio-orange mb-2" />
               <span className="text-[9px] font-black text-text-muted uppercase">Hot Streak</span>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="flex flex-col items-center">
               <ShieldCheck className="w-6 h-6 text-nuvio-green mb-2" />
               <span className="text-[9px] font-black text-text-muted uppercase">Verified Hub</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

// Internal icon hack for simplicity
const ShieldCheck = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default StudyVerse;
