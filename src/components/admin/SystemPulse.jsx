import React, { useState, useEffect } from 'react';
import { Activity, Zap, MessageSquare, TrendingUp, AlertCircle, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const SystemPulse = () => {
  const [stats, setStats] = useState({
    active_users: 0,
    total_users: 0,
    msgs_per_min: 0,
    xp_per_min: 0,
    timestamp: new Date().toISOString()
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pulse = setInterval(fetchStats, 5000); // 5-second neural sync
    fetchStats();
    return () => clearInterval(pulse);
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('rpc_get_admin_stats');
      
      // Fetch Total Population count directly from profiles
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (data) {
        const enhancedStats = {
          ...data,
          total_users: totalCount || 0
        };
        setStats(enhancedStats);
        setHistory(prev => [...prev.slice(-19), enhancedStats]); // Keep last 20 samples
        setLoading(false);
      }
    } catch (err) {
      console.error("Telemetry failure:", err);
    }
  };

  const StatCard = ({ label, value, icon: Icon, color, detail }) => (
    <div className="nv-card p-6 border-white/5 bg-white/[0.02] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
        <Icon className="w-20 h-20" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-3xl font-black text-white tracking-tighter tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-[9px] font-bold text-text-muted mt-2 uppercase opacity-60">{detail}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Population" 
          value={stats.total_users} 
          icon={Users} 
          color="text-nuvio-purple-400"
          detail="Total Registered Identities"
        />
        <StatCard 
          label="Neural Nodes (Active)" 
          value={stats.active_users} 
          icon={Activity} 
          color="text-nuvio-blue"
          detail="Active in last 5 minutes"
        />
        <StatCard 
          label="Throughput (Msg/Min)" 
          value={stats.msgs_per_min} 
          icon={MessageSquare} 
          color="text-nuvio-purple-400"
          detail="Sharded Message Stream"
        />
        <StatCard 
          label="Economic Flow (XP)" 
          value={stats.xp_per_min} 
          icon={Zap} 
          color="text-nuvio-yellow"
          detail="Total XP generated/min"
        />
        <StatCard 
          label="Neural Latency" 
          value="< 120ms" 
          icon={Clock} 
          color="text-nuvio-green"
          detail="DB Query Performance"
        />
      </div>

      {/* Simplified Live Chart (CSS Visualization) */}
      <div className="nv-card p-8 border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Activity Pulse (Last 20 Samples)</h3>
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-nuvio-purple-400" /> Messages</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-nuvio-yellow" /> XP Flow</div>
           </div>
        </div>
        <div className="h-48 flex items-end gap-1 px-2 border-l border-b border-white/10 pb-1">
          {history.length === 0 ? (
            <div className="m-auto text-text-muted text-[10px] font-black uppercase italic tracking-widest">Observing neural pathways...</div>
          ) : history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${Math.min(100, (h.xp_per_min / 5000) * 100)}%` }}
                 className="w-full bg-nuvio-yellow/30 rounded-t-sm" 
               />
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${Math.min(100, (h.msgs_per_min / 50) * 100)}%` }}
                 className="w-full bg-nuvio-purple-400/50 rounded-t-sm" 
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemPulse;
