import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, TrendingUp, 
  Crown, Star, Timer, Users, 
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { peerService } from '../services/peerService';

const Leaderboard = () => {
  const [user, setUser] = useState(authService.me());
  const [peers, setPeers] = useState([]);
  const [filter, setFilter] = useState('global'); // global | weekly

  useEffect(() => {
    // Combine real user with simulated peers
    const realUser = {
      ...user,
      id: 'me',
      isMe: true
    };
    
    const simulatedPeers = peerService.getPeers();
    const combined = [...simulatedPeers, realUser].sort((a, b) => b.xp - a.xp);
    setPeers(combined);

    // Listen for XP updates (when user earns XP in another tab or game)
    const handleUpdate = (e) => {
      const updatedUser = { ...e.detail, id: 'me', isMe: true };
      setUser(e.detail);
      const latestPeers = peerService.getPeers();
      const newCombined = [...latestPeers, updatedUser].sort((a, b) => b.xp - a.xp);
      setPeers(newCombined);
    };

    window.addEventListener('nuvio_stats_update', handleUpdate);
    return () => window.removeEventListener('nuvio_stats_update', handleUpdate);
  }, [user.xp]);

  const top3 = peers.slice(0, 3);
  const others = peers.slice(3);

  return (
    <div className="space-y-12 pb-20 nv-page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Academic Arena</h1>
          <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-1 opacity-70">Real-time competitive ranking</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
           {['global', 'weekly'].map(t => (
             <button 
               key={t}
               onClick={() => setFilter(t)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-nuvio-purple-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto pt-10">
        <AnimatePresence>
          {top3.map((player, i) => {
            const order = i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3';
            const height = i === 0 ? 'h-[280px]' : i === 1 ? 'h-[240px]' : 'h-[200px]';
            const color = i === 0 ? 'bg-nuvio-yellow' : i === 1 ? 'bg-nuvio-purple-400' : 'bg-nuvio-blue';
            
            return (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col items-center ${order}`}
              >
                <div className="relative mb-6">
                   <div className={`w-24 h-24 rounded-[32px] ${color}/20 flex items-center justify-center text-5xl border-2 ${color} shadow-2xl relative z-10 ${player.isMe ? 'ring-4 ring-white animate-pulse' : ''}`}>
                     {player.avatar_emoji || '⚡'}
                   </div>
                   {i === 0 && <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-nuvio-yellow animate-bounce" />}
                   <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-black text-xs border-4 border-background-base`}>
                     #{i + 1}
                   </div>
                </div>
                <div className={`w-full ${height} ${color}/10 rounded-t-[48px] border-t-4 border-x-4 ${color}/30 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm relative overflow-hidden group`}>
                   <div className={`absolute inset-0 ${color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate w-full px-4">{player.full_name}</h3>
                   <div className={`text-2xl font-black ${color} mt-2 tabular-nums`}>{player.xp.toLocaleString()}</div>
                   <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Total XP</div>
                   {player.isMe && <div className="mt-4 px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase text-white">IT'S YOU</div>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Leaderboard Table */}
      <div className="nv-card p-0 border-white/5 max-w-5xl mx-auto overflow-hidden shadow-2xl">
         <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Ranking List</h3>
            <span className="text-[10px] text-text-muted font-bold uppercase">Showing Top 20</span>
         </div>
         <div className="divide-y divide-white/5">
            {others.map((player, i) => (
              <motion.div 
                key={player.id}
                className={`p-6 px-10 flex items-center gap-8 hover:bg-white/[0.01] transition-all group ${player.isMe ? 'bg-nuvio-purple-500/5' : ''}`}
              >
                <div className="text-xs font-black text-text-muted w-8">#{i + 4}</div>
                <div className="w-12 h-12 rounded-[16px] bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {player.avatar_emoji || '👨‍🎓'}
                </div>
                <div className="flex-1">
                  <div className="font-black text-white uppercase tracking-tight flex items-center gap-2">
                    {player.full_name}
                    {player.isMe && <span className="bg-nuvio-purple-500 text-[8px] px-2 py-0.5 rounded text-white font-black">YOU</span>}
                  </div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Level {player.level} • {player.streak} day streak</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-white tabular-nums">{player.xp.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">XP</div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-white transition-all group-hover:translate-x-1" />
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
