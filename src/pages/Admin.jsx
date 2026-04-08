import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Database, Globe, 
  Settings, TrendingUp, AlertCircle, 
  BarChart3, Activity, Trash2, Zap, Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { peerService } from '../services/peerService';

const Admin = () => {
  const [user, setUser] = useState(authService.me());
  const [entityCounts, setEntityCounts] = useState({
    tasks: 0,
    decks: 0,
    groups: 0,
    xp: 0,
    tokens: 0,
    peerCount: 0
  });
  const [grantAmount, setGrantAmount] = useState(100);

  useEffect(() => {
    const peers = peerService.getPeers();
    const totalPeerXp = peers.reduce((sum, p) => sum + p.xp, 0);
    const totalPeerTasks = peers.reduce((sum, p) => sum + (p.level * 3), 0);

    const counts = {
      tasks: dataService.list('tasks').length + totalPeerTasks,
      decks: dataService.list('decks').length + (peers.length * 2),
      groups: dataService.list('my_groups').length + 12,
      xp: (user?.xp ?? 0) + totalPeerXp,
      tokens: (user?.era_tokens ?? 0) + (totalPeerXp / 10),
      peerCount: peers.length
    };
    setEntityCounts(counts);
  }, [user]);

  const handleSeed = () => {
    const demoDecks = [
      { name: "Organic Chemistry", subject: "Science", cards: [{ front: "C6H12O6", back: "Glucose" }] },
      { name: "World History", subject: "History", cards: [{ front: "1789", back: "French Revolution" }] }
    ];
    demoDecks.forEach(d => dataService.create('decks', d));
    alert("System Seeded with Core Modules!");
    setUser(authService.me());
  };

  const handleGrant = (type) => {
    if (type === 'XP') {
      xpService.awardXp(grantAmount, 'Admin Grant');
      setUser(authService.me());
    } else {
      authService.updateMe({ era_tokens: (user?.era_tokens || 0) + grantAmount });
      setUser(authService.me());
      window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: authService.me() }));
    }
  };

  const handleResetData = () => {
    if (window.confirm("ARE YOU SURE? This will wipe all tasks and flashcards.")) {
      localStorage.removeItem('nuvio_entity_tasks');
      localStorage.removeItem('nuvio_entity_decks');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10 pb-20 nv-page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 bg-nuvio-red rounded-2xl flex items-center justify-center shadow-lg shadow-nuvio-red/20">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            Authority Hub
          </h1>
          <p className="text-text-secondary font-bold uppercase text-[10px] tracking-[0.3em] mt-2 opacity-60">Real-time system override active</p>
        </div>
        <div className="flex items-center gap-3 bg-nuvio-red/10 border border-nuvio-red/20 px-6 py-3 rounded-2xl">
          <Activity className="w-5 h-5 text-nuvio-red animate-pulse" />
          <span className="text-sm font-black text-nuvio-red uppercase tracking-widest">Live: {user?.full_name}</span>
        </div>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Global Learners', val: (entityCounts.peerCount || 0) + 1, icon: Users, color: 'text-nuvio-blue' },
          { label: 'Memory Cubes', val: entityCounts.decks || 0, icon: Database, color: 'text-nuvio-green' },
          { label: 'Cluster XP', val: (entityCounts.xp || 0).toLocaleString(), icon: TrendingUp, color: 'text-nuvio-yellow' },
          { label: 'Network Tokens', val: (entityCounts.tokens || 0).toLocaleString(), icon: Coins, color: 'text-nuvio-purple-400' },
        ].map((stat, i) => (
          <motion.div key={i} className="nv-card p-6 border-white/5 bg-white/[0.02]">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
            <div className="text-3xl font-black text-white">{stat.val}</div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Injector */}
        <div className="nv-card p-8 space-y-8 border-white/5">
           <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <Zap className="w-6 h-6 text-nuvio-yellow fill-nuvio-yellow/20" /> Resource Injection
           </h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="nv-label">Inject Amount</label>
                 <input 
                   type="number" 
                   value={grantAmount}
                   onChange={(e) => setGrantAmount(parseInt(e.target.value))}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-nuvio-purple-500 outline-none" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => handleGrant('XP')} className="nv-btn-primary h-16 uppercase tracking-widest text-[10px]">Grant XP</button>
                 <button onClick={() => handleGrant('Tokens')} className="nv-btn-secondary h-16 uppercase tracking-widest text-[10px] bg-nuvio-yellow/10 text-nuvio-yellow border-nuvio-yellow/20">Grant Tokens</button>
              </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="nv-card p-8 space-y-8 border-nuvio-red/20 bg-nuvio-red/5">
           <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <AlertCircle className="w-6 h-6 text-nuvio-red" /> Danger Zone
           </h3>
           <div className="space-y-4">
              <button 
                onClick={handleResetData}
                className="w-full py-5 rounded-2xl bg-nuvio-red/10 border border-nuvio-red/30 text-nuvio-red font-black uppercase tracking-widest text-[10px] hover:bg-nuvio-red hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Trash2 className="w-5 h-5" /> Burn Database (Reset)
              </button>
              <button 
                 onClick={handleSeed}
                 className="w-full py-5 rounded-2xl bg-nuvio-blue/10 border border-nuvio-blue/30 text-nuvio-blue font-black uppercase tracking-widest text-[10px] hover:bg-nuvio-blue hover:text-white transition-all"
              >
                Seed System Content
              </button>
              <button 
                 onClick={() => {
                   peerService.resetPeers();
                   window.location.reload();
                 }} 
                 className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-text-secondary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
              >
                Re-initialize Peer Engine
              </button>
           </div>
        </div>
      </div>

      {/* Raw Browser */}
      <div className="nv-card p-0 border-white/5 overflow-hidden">
         <div className="p-6 bg-white/[0.02] border-b border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Data Explorer</h3>
         </div>
         <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {['tasks', 'decks', 'my_groups'].map(entity => (
                 <div key={entity} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">EntityType: {entity}</div>
                    <div className="text-2xl font-black text-white">{dataService.list(entity).length} Records</div>
                    <button className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest hover:underline">Download JSON</button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Admin;
