import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Target, BookOpen, 
  ChevronRight, ArrowUpRight, Flame,
  Clock, Star, Sparkles, Coins, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [activity, setActivity] = useState([]);
  const [peers, setPeers] = useState([]);
  const [counts, setCounts] = useState({ tasks: 0, decks: 0 });
  const [loading, setLoading] = useState(true);
  const [nextMilestone, setNextMilestone] = useState({ label: 'Level 2', remaining: 100 });
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const navigate = useNavigate();

  const [cloudActive, setCloudActive] = useState(false);

  useEffect(() => {
    // Sync with global state
    const handleUpdate = (e) => {
      setUser(e.detail);
      calculateMilestone(e.detail.xp, e.detail.level);
    };

    const handleCloudStatus = (e) => setCloudActive(e.detail.active);
    
    window.addEventListener('acadevance_stats_update', handleUpdate);
    window.addEventListener('acadevance_cloud_status', handleCloudStatus);
    fetchDashboardData();

    return () => {
      window.removeEventListener('acadevance_stats_update', handleUpdate);
      window.removeEventListener('acadevance_cloud_status', handleCloudStatus);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const currentUser = authService.me();
      const [tasks, decks, history] = await Promise.all([
        dataService.list('tasks'),
        dataService.list('decks'),
        xpService.getHistory()
      ]);

      if (currentUser?.id) {
        const { data: topPeers } = await supabase
          .from('profiles')
          .select('full_name, level, xp')
          .neq('id', currentUser.id)
          .order('level', { ascending: false })
          .limit(4);

        if (topPeers) {
          setPeers(topPeers.map(p => ({
            name: p.full_name,
            action: `reached Level ${p.level}`,
            time: 'Active'
          })));
        }
      }

      setCounts({
        tasks: tasks.filter(t => !t.completed).length,
        decks: decks.length
      });
      
      if (topPeers.data) {
        setPeers(topPeers.data.map(p => ({
          name: p.full_name,
          action: `reached Level ${p.level}`,
          time: 'Active'
        })));
      }

      setActivity((history || []).slice(0, 5));
      calculateMilestone(currentUser?.xp || 0, currentUser?.level || 1);
    } catch (err) {
      console.error("Dashboard cloud sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMilestone = (xp, level) => {
    const nextXp = xpService.getNextLevelXp(level);
    setNextMilestone({
      label: `Level ${level + 1}`,
      remaining: nextXp - (xp || 0)
    });
  };

  // --- HOLD SYSTEM LOGIC ---
  useEffect(() => {
    let interval;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            handleHoldComplete();
            return 0;
          }
          return prev + 2;
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding]);

  const handleHoldComplete = () => {
    setIsHolding(false);
    notificationService.send("Neural Surge", "Tasks synchronized. Gained +10 Focus Energy.", "success");
    xpService.awardXp(10, 'Daily Ritual');
    navigate('/homework');
  };

  const emitReaction = (emoji, e) => {
    const x = e.clientX;
    const y = e.clientY;
    window.dispatchEvent(new CustomEvent('acadevance_particle_bonus', { detail: { emoji, x, y, type: 'reaction' } }));
  };

  const tasksCount = counts.tasks;
  const decksCount = counts.decks;

  return (
    <div className="space-y-10 pb-20 nv-page-transition">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">My Dashboard</h1>
          <p className="text-text-secondary font-medium mt-1">
            Welcome back, <span className="text-nuvio-purple-400 font-black">{user?.full_name}</span>. What are we focusing on today?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500 ${cloudActive ? 'bg-nuvio-green/10 border-nuvio-green/30 text-nuvio-green' : 'bg-nuvio-red/10 border-nuvio-red/30 text-nuvio-red'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cloudActive ? 'bg-nuvio-green animate-pulse' : 'bg-nuvio-red'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{cloudActive ? 'Cloud Active' : 'Offline Mode'}</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Coins className="w-5 h-5 text-nuvio-yellow" />
            <span className="text-xl font-black text-white tabular-nums">{user?.era_tokens?.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* 🏛️ CBSE QUICK START / CONTINUE LEARNING */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                  <Clock className="w-3 h-3" /> System Synchronized
               </div>
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                  Ready to conquer <br /> <span className="text-blue-200">{user?.grade_level || '9th'} Grade?</span>
               </h1>
               <p className="text-blue-100 text-sm font-medium opacity-80 max-w-md">Your CBSE curriculum is live. Pick up exactly where you left off in your NCERT journey.</p>
            </div>
            <button 
              onClick={() => navigate('/curriculum')}
              className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
               Continue Learning <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total XP', val: user?.xp?.toLocaleString(), icon: Zap, color: 'text-nuvio-yellow', bg: 'bg-nuvio-yellow/10' },
          { label: 'Focus Streak', val: `${user?.streak || 1} Days`, icon: Flame, color: 'text-nuvio-orange', bg: 'bg-nuvio-orange/10', burning: (user?.streak > 3) },
          { label: 'Active Tasks', val: tasksCount, icon: Target, color: 'text-nuvio-purple-400', bg: 'bg-nuvio-purple-400/10' },
          { label: 'Memory Decks', val: decksCount, icon: BookOpen, color: 'text-nuvio-blue', bg: 'bg-nuvio-blue/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`nv-card p-8 border-white/5 flex flex-col justify-between group transition-all relative overflow-hidden ${stat.burning ? 'border-nuvio-red/40 shadow-[0_0_20px_rgba(255,50,50,0.1)]' : ''}`}
          >
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.burning ? 'animate-bounce' : ''}`}>
                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
               {stat.burning && <span className="text-[10px] font-black text-nuvio-red uppercase tracking-widest animate-pulse">Critical</span>}
            </div>
            <div className="mt-8">
               <div className="text-3xl font-black text-white tracking-tight">{stat.val}</div>
               <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="nv-card p-10 border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nuvio-purple-500/5 blur-[100px] pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
              <div className="space-y-6 flex-1 w-full">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-nuvio-purple-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-nuvio-purple-500/20">
                     {user?.level}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Academic Rank: Sentinel</h3>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{nextMilestone.remaining.toLocaleString()} XP to {nextMilestone.label}</p>
                   </div>
                </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((user?.xp || 0) / xpService.getNextLevelXp(user?.level || 1)) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-nuvio-purple-500 to-nuvio-blue"
                    />
                  </div>
                </div>
              </div>
            </div>

          <div className="nv-card p-0 border-white/5 overflow-hidden">
             <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Star className="w-4 h-4 text-nuvio-purple-400" /> Recent Activity
                </h3>
             </div>
             <div className="divide-y divide-white/5">
                {activity.length === 0 ? (
                  <div className="p-12 text-center text-text-muted font-bold uppercase text-[10px] tracking-widest opacity-50 italic">No activity recorded yet...</div>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="p-6 px-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all">
                             <Zap className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="font-black text-white uppercase tracking-tight text-sm">{item.reason}</div>
                             <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleTimeString()}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-nuvio-green font-black text-sm">+{item.amount} XP</span>
                          <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="nv-card !bg-black border-2 border-white/5 p-8 space-y-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Social Matrix</h3>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-nuvio-green animate-ping" />
                    <span className="text-[9px] font-black text-nuvio-green uppercase tracking-widest">Global Sync</span>
                 </div>
              </div>
              <div className="space-y-6">
                 {peers.map((peer, i) => (
                    <div 
                      key={i} 
                      className="group/peer flex gap-4 items-start border-l-2 border-white/5 pl-4 py-3 hover:border-nuvio-cyan transition-all relative cursor-pointer"
                    >
                       <div className="flex-1">
                          <div className="text-xs font-black text-white uppercase group-hover/peer:text-nuvio-cyan transition-colors">{peer.name}</div>
                          <div className="text-[10px] text-text-muted font-bold capitalize">{peer.action}</div>
                       </div>
                       <div className="text-[9px] text-white/20 font-black">{peer.time}</div>
                       
                       <div className="absolute right-0 top-0 opacity-0 group-hover/peer:opacity-100 transition-opacity flex gap-1 bg-black border border-white/10 p-1 rounded-lg">
                          {['🔥', '🚀', '💯'].map(e => (
                            <button key={e} onClick={(ev) => emitReaction(e, ev)} className="hover:scale-125 transition-transform">{e}</button>
                          ))}
                       </div>
                    </div>
                 ))}
                 {peers.length === 0 && (
                    <div className="py-10 text-center text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 italic">Searching for scholars...</div>
                 )}
              </div>
           </div>
           
           <div className="nv-card bg-nuvio-purple-500/10 border-nuvio-purple-500/20 p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500 flex items-center justify-center text-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Focus Guide</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Sync your latest academic rituals. finishing tasks will help you earn a <span className="text-nuvio-purple-300">Reward Boost</span>.
              </p>
              <div className="relative pt-4">
                <button 
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => setIsHolding(false)}
                  onMouseLeave={() => setIsHolding(false)}
                  className={`w-full nv-btn-primary py-5 text-[10px] uppercase tracking-[0.3em] font-black relative overflow-hidden transition-all active:scale-95 ${isHolding ? 'brightness-125' : ''}`}
                >
                  <div className="absolute inset-0 bg-white/10 origin-left transition-transform duration-75" style={{ transform: `scaleX(${holdProgress / 100})` }} />
                  <span className="relative z-10">{isHolding ? 'Focusing...' : 'Hold to Sync Tasks'}</span>
                </button>
                <div className="flex justify-center mt-2">
                   <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Ritual Status: {holdProgress}% Authorized</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
