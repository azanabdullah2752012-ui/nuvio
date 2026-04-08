import React from 'react';
import { 
  Users, Search, Filter, 
  ChevronRight, Sparkles, Star, 
  ShieldCheck, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const Classmates = () => {
  const classmates = [
    { name: 'Leo Flux', level: 25, mascot: '🦁', stage: 'Majestic', xp: 15400, online: true },
    { name: 'Sarah Spark', level: 18, mascot: '🦋', stage: 'Evolved', xp: 8200, online: true },
    { name: 'Dan Drift', level: 12, mascot: '🐢', stage: 'Starter', xp: 4500, online: false },
    { name: 'Luna Light', level: 30, mascot: '🦉', stage: 'Ancient', xp: 22000, online: true },
    { name: 'Finn Flow', level: 5, mascot: '🦊', stage: 'Starter', xp: 1200, online: false },
  ];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Ancient': return 'text-nuvio-orange bg-nuvio-orange/10';
      case 'Majestic': return 'text-nuvio-purple-400 bg-nuvio-purple-400/10';
      case 'Evolved': return 'text-nuvio-green bg-nuvio-green/10';
      default: return 'text-text-muted bg-white/5';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <Users className="w-8 h-8 text-nuvio-purple-400" />
            Classmates
          </h1>
          <p className="text-text-secondary text-sm">See who's study-grinding and how their mascots are evolving.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="bg-white/5 border border-border rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 ring-nuvio-purple-500 outline-none"
            />
          </div>
          <button className="p-2 bg-white/5 border border-border rounded-xl text-text-muted hover:text-text-primary transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classmates.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="nv-card p-0 overflow-hidden group hover:border-nuvio-purple-500/30 transition-all border-white/5"
          >
            <div className="p-6 bg-white/[0.02] border-b border-border flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-background-base border border-border flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                  {c.mascot}
                </div>
                {c.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-nuvio-green border-2 border-background-card rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white group-hover:text-nuvio-purple-400 transition-colors uppercase tracking-tight">{c.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] font-black text-nuvio-yellow">
                    <Star className="w-3 h-3 fill-nuvio-yellow" />
                    LVL {c.level}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStageColor(c.stage)}`}>
                    {c.stage} Stage
                  </span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{c.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-nuvio-blue" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Calculus League</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-nuvio-purple-400 transition-all">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text-primary transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Insight */}
      <div className="nv-card bg-nuvio-purple-500/5 border-nuvio-purple-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 bg-nuvio-purple-500/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-nuvio-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-text-primary mb-1">Mascot Lab</h3>
            <p className="text-sm text-text-secondary">Your mascot will evolve when you reach **Level 20**. Keep studying to unlock the next form!</p>
          </div>
          <button className="nv-btn-secondary px-8 border-nuvio-purple-500/30 text-nuvio-purple-400">Preview Evolutions</button>
        </div>
      </div>
    </div>
  );
};

export default Classmates;
