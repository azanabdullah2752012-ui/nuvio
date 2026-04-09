import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Database, Globe, 
  Settings, TrendingUp, AlertCircle, 
  BarChart3, Activity, Trash2, Zap, Coins,
  MessageSquare, BrainCircuit, Clock, PenTool,
  Lock, Unlock, ChevronRight, Save, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { peerService } from '../services/peerService';
import { notificationService } from '../services/notificationService';
import { aiService } from '../services/aiService';
import { supabase } from '../lib/supabase';

const Admin = () => {
  const [user, setUser] = useState(authService.me());
  const [activeTab, setActiveTab] = useState('overview');
  const [entityCounts, setEntityCounts] = useState({
    tasks: 0, decks: 0, groups: 0, xp: 0, tokens: 0, peerCount: 0
  });

  // State for Architect (Peers)
  const [peers, setPeers] = useState([]);
  const [editingPeerId, setEditingPeerId] = useState(null);

  // State for Broadcast
  const [broadcast, setBroadcast] = useState({ title: '', message: '', type: 'info' });

  // State for AI Core
  const [systemPrompt, setSystemPrompt] = useState("You are Nova, the AI tutor for the Nuvio gamified learning platform...");

  useEffect(() => {
    refreshStats();
  }, [user]);

  const refreshStats = async () => {
    // In global cloud mode, we fetch totals from Supabase tables
    const taskCount = (await dataService.list('tasks')).length;
    const deckCount = (await dataService.list('decks')).length;
    const statsUser = authService.me();
    
    // For peers, we fetch from the dedicated peers table
    const { data: p, error } = await supabase.from('peers').select('*');
    if (p) setPeers(p);
    
    const totalPeerXp = (p || []).reduce((sum, p) => sum + p.xp, 0);
    const counts = {
      tasks: taskCount + ((p?.length || 0) * 3),
      decks: deckCount + ((p?.length || 0) * 2),
      groups: 12, // Static for now
      xp: (statsUser?.xp ?? 0) + totalPeerXp,
      tokens: (statsUser?.era_tokens ?? 0) + (totalPeerXp / 10),
      peerCount: (p?.length || 0)
    };
    setEntityCounts(counts);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'broadcast', name: 'Comms', icon: MessageSquare },
    { id: 'governance', name: 'Governance', icon: ShieldAlert },
    { id: 'aicore', name: 'AI Core', icon: BrainCircuit }
  ];

  return (
    <div className="space-y-10 pb-32 nv-page-transition">
      {/* Divine Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 bg-nuvio-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-nuvio-purple-500/20">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            Divine Authority
          </h1>
          <p className="text-text-secondary font-bold uppercase text-[10px] tracking-[0.3em] mt-2 opacity-60">Omniscience Level 9 Access Granted</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user?.god_mode ? 'bg-nuvio-red/10 border-nuvio-red/20 text-nuvio-red' : 'bg-white/5 border-white/10 text-text-muted'}`}>
            {user?.god_mode ? 'God Mode Active' : 'Normal Authority'}
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <Activity className="w-5 h-5 text-nuvio-green animate-pulse" />
            <span className="text-sm font-black text-white uppercase tracking-widest">{user?.full_name}</span>
          </div>
        </div>
      </div>

      {/* Authority Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white/10 text-white border-b-2 border-nuvio-purple-500' 
                : 'text-text-muted hover:bg-white/5'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-nuvio-purple-400' : ''}`} />
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Global Learners', val: (entityCounts.peerCount || 0) + 1, icon: Users, color: 'text-nuvio-blue' },
                  { label: 'Memory Cubes', val: entityCounts.decks || 0, icon: Database, color: 'text-nuvio-green' },
                  { label: 'Cluster XP', val: (entityCounts.xp || 0).toLocaleString(), icon: TrendingUp, color: 'text-nuvio-yellow' },
                  { label: 'Network Tokens', val: (entityCounts.tokens || 0).toLocaleString(), icon: Coins, color: 'text-nuvio-purple-400' },
                ].map((stat, i) => (
                  <div key={i} className="nv-card p-6 border-white/5 bg-white/[0.02]">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                    <div className="text-3xl font-black text-white">{stat.val}</div>
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="nv-card p-8 border-white/5">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Database Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['tasks', 'decks', 'my_groups'].map(entity => (
                     <div key={entity} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{entity}</div>
                        <div className="text-2xl font-black text-white">{dataService.list(entity).length} Local Records</div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architect' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Social Architect</h3>
                <button 
                  onClick={() => peerService.initializePeers() && refreshStats()}
                  className="nv-btn-secondary px-6 py-3 text-[10px]"
                >
                  Regenerate Entire Social Class
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {peers.map(peer => (
                  <div key={peer.id} className="nv-card p-6 border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{peer.avatar_emoji}</div>
                      <div>
                        <div className="text-sm font-black text-white uppercase">{peer.full_name}</div>
                        <div className="text-[10px] text-text-muted font-bold">LVL {peer.level} · {peer.xp} XP</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newName = prompt("Enter new name:", peer.full_name);
                        if (newName) {
                          peerService.updatePeer(peer.id, { full_name: newName });
                          refreshStats();
                        }
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <PenTool className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="max-w-2xl mx-auto nv-card p-10 space-y-8 border-white/5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Broadcast Beacon</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="nv-label">Alert Title</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-nuvio-purple-500"
                    placeholder="E.g. System Maintenance"
                    value={broadcast.title}
                    onChange={e => setBroadcast({...broadcast, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="nv-label">Alert Message</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-nuvio-purple-500 h-32 resize-none"
                    placeholder="Describe the system event..."
                    value={broadcast.message}
                    onChange={e => setBroadcast({...broadcast, message: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   {['info', 'warning', 'celebration'].map(type => (
                     <button 
                        key={type}
                        onClick={() => setBroadcast({...broadcast, type})}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${broadcast.type === type ? 'bg-nuvio-purple-600 border-nuvio-purple-400 text-white' : 'bg-white/5 border-white/10 text-text-muted'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
                <button 
                  onClick={() => {
                    notificationService.send(broadcast.title, broadcast.message, broadcast.type);
                    alert("BROADCAST SENT TO WEB CONTEXT");
                    setBroadcast({ title: '', message: '', type: 'info' });
                  }}
                  className="nv-btn-primary w-full h-16 uppercase tracking-widest text-xs"
                >
                  Push Global Alert
                </button>
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="nv-card p-8 border-nuvio-red/20 bg-nuvio-red/5 space-y-8">
                 <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Lock className="w-6 h-6 text-nuvio-red" /> Privilege Bypasses
                 </h3>
                 <div className="space-y-4">
                    <button 
                      onClick={() => {
                        authService.toggleGodMode();
                        setUser(authService.me());
                      }}
                      className={`w-full py-6 rounded-2xl border flex items-center justify-between px-8 transition-all ${user?.god_mode ? 'bg-nuvio-red text-white border-nuvio-red shadow-lg shadow-nuvio-red/20' : 'bg-white/5 border-white/10 text-text-muted'}`}
                    >
                      <div className="text-left">
                        <div className="font-black uppercase tracking-widest text-[10px]">God Mode</div>
                        <div className="text-[9px] opacity-70">Bypass Level & Token requirements globally</div>
                      </div>
                      {user?.god_mode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </button>
                 </div>
              </div>

              <div className="nv-card p-8 border-nuvio-yellow/20 bg-nuvio-yellow/5 space-y-8">
                 <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Zap className="w-6 h-6 text-nuvio-yellow" /> Wealth Generator
                 </h3>
                 <button 
                    onClick={() => {
                      authService.injectWealth();
                      setUser(authService.me());
                    }}
                    className="w-full py-6 rounded-2xl bg-nuvio-yellow border border-nuvio-yellow/20 text-background-dark font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                 >
                   <Coins className="w-5 h-5" /> Inject 1,000,000 Tokens & Max Level
                 </button>
              </div>

              <div className="nv-card p-8 border-white/5 bg-white/[0.02] col-span-full">
                 <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                   <Trash2 className="w-6 h-6 text-nuvio-red" /> Final Danger Zone
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <button onClick={() => {
                      if(confirm("Wipe everything?")) { localStorage.clear(); window.location.reload(); }
                    }} className="nv-btn-secondary bg-nuvio-red/10 text-nuvio-red border-nuvio-red/20 h-16">Total System Wipe</button>
                    <button onClick={() => refreshStats()} className="nv-btn-secondary h-16">Force Sync Database</button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'aicore' && (
            <div className="nv-card p-10 space-y-8 border-white/5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">AI Central Intelligence Core</h3>
              <div className="space-y-6">
                <div className="p-6 bg-nuvio-purple-500/5 border border-nuvio-purple-500/20 rounded-2xl">
                   <p className="text-xs text-nuvio-purple-300 font-bold uppercase tracking-widest mb-4">Master System Prompt (Nova's Soul)</p>
                   <textarea 
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-6 text-nuvio-purple-200 text-sm font-mono h-64 outline-none focus:border-nuvio-purple-500/50"
                      value={systemPrompt}
                      onChange={e => setSystemPrompt(e.target.value)}
                   />
                </div>
                <div className="flex gap-4">
                   <button className="nv-btn-primary flex-1 h-14 uppercase tracking-widest text-[10px]">Update Neural Paths</button>
                   <button className="nv-btn-secondary px-10 h-14 uppercase tracking-widest text-[10px]">Reset to Default</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'temporal' && (
            <div className="nv-card p-10 border-white/5 bg-nuvio-blue/5 flex flex-col items-center text-center space-y-8">
               <div className="w-24 h-24 bg-nuvio-blue/20 rounded-full flex items-center justify-center">
                  <Clock className="w-12 h-12 text-nuvio-blue animate-[spin_10s_linear_infinite]" />
               </div>
               <div className="space-y-4">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight">Temporal Projection Hub</h3>
                 <p className="text-text-muted text-sm max-w-md mx-auto">Fast-forward system time to simulate streak resets, daily quest generation, and long-term cohort analytics.</p>
               </div>
               <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <button className="nv-btn-secondary border-nuvio-blue/30 text-nuvio-blue hover:bg-nuvio-blue hover:text-white h-16 uppercase tracking-widest text-[10px]">Advance 24 Hours</button>
                  <button className="nv-btn-secondary border-nuvio-blue/30 text-nuvio-blue hover:bg-nuvio-blue hover:text-white h-16 uppercase tracking-widest text-[10px]">Jump to Finals Week</button>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Admin;
