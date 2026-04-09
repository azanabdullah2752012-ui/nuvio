import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Target, BookOpen, 
  ChevronRight, ArrowUpRight, Flame,
  Clock, Star, Sparkles, Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { dataService } from '../services/dataService';

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [activity, setActivity] = useState([]);
  const [counts, setCounts] = useState({ tasks: 0, decks: 0 });
  const [loading, setLoading] = useState(true);
  const [nextMilestone, setNextMilestone] = useState({ label: 'Level 2', remaining: 100 });

  useEffect(() => {
    // Sync with global state
    const handleUpdate = (e) => {
      setUser(e.detail);
      calculateMilestone(e.detail.xp, e.detail.level);
    };
    
    window.addEventListener('nuvio_stats_update', handleUpdate);
    fetchDashboardData();

    return () => window.removeEventListener('nuvio_stats_update', handleUpdate);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tasks, decks] = await Promise.all([
        dataService.list('tasks'),
        dataService.list('decks')
      ]);
      setCounts({
        tasks: tasks.filter(t => !t.completed).length,
        decks: decks.length
      });
      
      const history = xpService.getHistory().slice(-5).reverse();
      setActivity(history);
      calculateMilestone(user?.xp || 0, user?.level || 1);
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

  const tasksCount = counts.tasks;
  const decksCount = counts.decks;

  return (
    <div className="space-y-10 pb-20 nv-page-transition">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Command Center</h1>
          <p className="text-text-secondary font-medium mt-1">Ready for your next session, <span className="text-nuvio-purple-400 font-black">{user?.full_name}</span>?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Coins className="w-5 h-5 text-nuvio-yellow" />
            <span className="text-xl font-black text-white tabular-nums">{user?.era_tokens?.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total XP', val: user?.xp?.toLocaleString(), icon: Zap, color: 'text-nuvio-yellow', bg: 'bg-nuvio-yellow/10' },
          { label: 'Daily Streak', val: `${user?.streak || 1} Days`, icon: Flame, color: 'text-nuvio-orange', bg: 'bg-nuvio-orange/10' },
          { label: 'Pending Tasks', val: tasksCount, icon: Target, color: 'text-nuvio-purple-400', bg: 'bg-nuvio-purple-400/10' },
          { label: 'Memory Decks', val: decksCount, icon: BookOpen, color: 'text-nuvio-blue', bg: 'bg-nuvio-blue/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`nv-card p-8 border-white/5 flex flex-col justify-between group hover:border-${stat.color.split('-')[1]}/30 transition-all`}
          >
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-xl ${stat.bg}`}>
                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">Active</span>
            </div>
            <div className="mt-8">
               <div className="text-3xl font-black text-white tracking-tight">{stat.val}</div>
               <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progression */}
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

          {/* Real Activity Feed */}
          <div className="nv-card p-0 border-white/5 overflow-hidden">
             <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Star className="w-4 h-4 text-nuvio-purple-400" /> Recent Training Session
                </h3>
             </div>
             <div className="divide-y divide-white/5">
                {activity.length === 0 ? (
                  <div className="p-12 text-center text-text-muted font-bold uppercase text-[10px] tracking-widest opacity-50 italic">No recent transmission detected...</div>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="p-6 px-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all">
                             <Zap className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="font-black text-white uppercase tracking-tight text-sm">{item.reason}</div>
                             <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</div>
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

        {/* AI Recommendations */}
        <div className="space-y-6">
           <div className="nv-card bg-nuvio-purple-500/10 border-nuvio-purple-500/20 p-8 space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-nuvio-purple-400" /> Nova Insight
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {counts.tasks > 0 ? (
                  <>You have <span className="text-white font-bold">{counts.tasks} pending quests</span> in your roadmap. Completing these would provide a <span className="text-nuvio-purple-300 font-bold">critical XP boost</span> for your current rank.</>
                ) : (
                  <>Your roadmap is clear. Switching focus to your <span className="text-white font-bold">{counts.decks} memory decks</span> would optimize your long-term retention curves.</>
                )}
              </p>
              <button className="w-full nv-btn-primary py-4 text-[10px] uppercase tracking-widest">Acknowledge Quest</button>
           </div>
           
           {/* Sidebar small stats */}
           <div className="nv-card p-8 border-white/5 space-y-8">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5 pb-4">Global Network</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-nuvio-blue"><Trophy className="w-4 h-4" /></div>
                       <span className="text-xs font-black text-white uppercase">Rank</span>
                    </div>
                    <span className="text-xs font-black text-nuvio-blue">#12 / 20</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-nuvio-green"><Clock className="w-4 h-4" /></div>
                       <span className="text-xs font-black text-white uppercase">Study Time</span>
                    </div>
                    <span className="text-xs font-black text-nuvio-green">14.2h</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
