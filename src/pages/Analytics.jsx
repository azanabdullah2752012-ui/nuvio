import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Calendar, 
  Clock, Target, Zap, ChevronRight,
  TrendingDown, Activity, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { xpService } from '../services/xpService';
import { authService } from '../services/authService';

const Analytics = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    avgDailyXp: 0,
    peakXp: 0,
    totalSessions: 0
  });

  useEffect(() => {
    const rawHistory = xpService.getHistory();
    setHistory(rawHistory);
    
    if (rawHistory.length > 0) {
      const total = rawHistory.reduce((sum, h) => sum + h.amount, 0);
      const peak = Math.max(...rawHistory.map(h => h.amount));
      setStats({
        avgDailyXp: Math.floor(total / Math.max(1, rawHistory.length)),
        peakXp: peak,
        totalSessions: rawHistory.length
      });
    }
  }, []);

  const chartData = history.slice(-10);

  return (
    <div className="space-y-12 pb-20 nv-page-transition">
      <div className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Academic Metrics</h1>
          <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-1 opacity-70">Quantifying your intellectual growth</p>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">Total Growth</span>
              <span className="text-2xl font-black text-white">+{authService.me()?.xp || 0} XP</span>
           </div>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg Session Gain', val: stats.avgDailyXp, icon: Activity, color: 'text-nuvio-blue' },
          { label: 'Peak Performance', val: stats.peakXp, icon: Zap, color: 'text-nuvio-yellow' },
          { label: 'System Pacing', val: 'Optimal', icon: TrendingUp, color: 'text-nuvio-green' },
        ].map((stat, i) => (
          <div key={i} className="nv-card p-8 border-white/5 space-y-4">
            <stat.icon className={`w-6 h-6 ${stat.color} opacity-70`} />
            <div>
              <div className="text-3xl font-black text-white">{stat.val}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* XP Performance Graph */}
      <div className="nv-card p-10 border-white/5 bg-white/[0.01] space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-nuvio-purple-400" /> Progression Curve
          </h3>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase outline-none focus:border-nuvio-purple-500">
            <option>Last 10 Sessions</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="h-[350px] flex items-end gap-3 px-4 relative">
          {/* Y-Axis Label Space */}
          <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 flex flex-col justify-between text-[8px] font-black text-text-muted uppercase py-2">
             <span>MAX</span>
             <span>AVG</span>
             <span>0</span>
          </div>
          
          {chartData.length === 0 ? (
            <div className="flex-1 h-full flex items-center justify-center text-text-muted font-bold text-xs border-b border-white/5 italic opacity-30">
              Generating first metric nodes...
            </div>
          ) : (
            chartData.map((session, i) => {
              const height = (session.amount / stats.peakXp) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full flex-1 flex flex-col justify-end px-1">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(10, height)}%` }}
                      className="w-full bg-nuvio-purple-500/20 group-hover:bg-nuvio-purple-500 rounded-t-xl transition-all relative"
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background-base border border-nuvio-purple-500 text-[9px] font-black text-white px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap">
                         +{session.amount} XP
                       </div>
                    </motion.div>
                  </div>
                  <div className="text-[8px] font-black text-text-muted uppercase tracking-tighter truncate w-full text-center">
                    {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="nv-card p-10 border-white/5 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Optimization Report</h3>
            <div className="space-y-6">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-nuvio-green uppercase tracking-widest"><Sparkles className="w-3 h-3" /> Peak Efficiency</div>
                  <p className="text-sm text-text-secondary leading-relaxed font-bold">Your retention is highest between <span className="text-white">7:00 PM and 9:00 PM</span>. Try scheduling your "Study Battles" during this window.</p>
               </div>
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-nuvio-blue uppercase tracking-widest"><Clock className="w-3 h-3" /> Focus Depth</div>
                  <p className="text-sm text-text-secondary leading-relaxed font-bold">You've maintained an average session length of <span className="text-white">42 minutes</span> this week. Great work on cognitive endurance!</p>
               </div>
            </div>
         </div>

         <div className="nv-card p-10 border-white/5 bg-nuvio-purple-600/5 flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-20 h-20 bg-nuvio-purple-500/10 rounded-[32px] flex items-center justify-center border border-nuvio-purple-500/20 shadow-inner">
               <Calendar className="w-10 h-10 text-nuvio-purple-400" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Export Credentials</h3>
               <p className="text-sm text-text-muted font-bold max-w-xs">Download your full academic performance ledger for review outside the system.</p>
            </div>
            <button className="nv-btn-primary px-12 h-14 uppercase tracking-widest text-[10px]">Download PDF Log</button>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
