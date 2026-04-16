import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Zap, 
  Search, Shield, Star, Sparkles,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const LearningGroups = () => {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeers();
  }, []);

  const fetchPeers = async () => {
    setLoading(true);
    // 1. Fetch all available groups (clusters)
    const { data: clusters } = await supabase
      .from('groups')
      .select('*')
      .order('member_count', { ascending: false });
    
    // 2. Fetch my memberships
    const { data: myMemberships } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', authService.me().id);

    const joinedIds = new Set(myMemberships?.map(m => m.group_id) || []);

    if (clusters && clusters.length > 0) {
      setPeers(clusters.map(c => ({
        ...c,
        joined: joinedIds.has(c.id)
      })));
    } else {
      // Fallback: If no groups exist, show active individual nodes (profiles)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', authService.me().id)
        .limit(10);
      setPeers(profiles || []);
    }
    setLoading(false);
  };

  const joinGroup = async (groupId) => {
    const user = authService.me();
    try {
      await supabase.from('group_memberships').insert([{
        user_id: user.id,
        group_id: groupId
      }]);
      notificationService.send("Cluster Sync", "Neural link established with group.", "success");
      fetchPeers(); // Refresh
    } catch (e) {
      console.error("Join failed:", e);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Users className="w-10 h-10 text-nuvio-blue" />
            Social Clusters
          </h1>
          <p className="text-text-secondary font-medium mt-1">Real-time sync with global academic collectives.</p>
        </div>
        <button className="nv-btn-primary px-8 gap-3 bg-nuvio-blue hover:bg-nuvio-blue/80 shadow-xl shadow-nuvio-blue/20">
           <UserPlus className="w-5 h-5" /> Join Cluster
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {peers.map((peer, i) => (
            <motion.div 
              key={peer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nv-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group border-l-4 border-l-nuvio-blue/30"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-4xl shadow-inner relative">
                  {peer.avatar_emoji || '👤'}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-nuvio-green rounded-full border-4 border-background-card flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">Lvl {peer.level}</div>
                  <div className="text-[10px] font-black text-nuvio-blue uppercase tracking-widest">Active Node</div>
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{peer.full_name || 'Incognito Hero'}</h3>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Academic Rank: Sentinel I</p>
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-white uppercase tracking-tighter">History</div>
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-white uppercase tracking-tighter">Math</div>
                 </div>

                 <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                    Initiate Duo Study
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="py-20 text-center animate-pulse">
          <Sparkles className="w-10 h-10 text-nuvio-blue mx-auto mb-4" />
          <p className="text-xs font-black text-text-muted uppercase tracking-widest">Syncing with global clusters...</p>
        </div>
      )}
    </div>
  );
};

export default LearningGroups;
