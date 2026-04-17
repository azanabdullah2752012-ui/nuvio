import React, { useState, useEffect } from 'react';
import { ShieldAlert, Target, Trash2, Zap, AlertTriangle, UserMinus, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { notificationService } from '../../services/notificationService';

const NeuralSentinel = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [intervening, setIntervening] = useState(false);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 10000); // 10-second oversight
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    const { data } = await supabase.from('view_suspicious_activity').select('*');
    if (data) setThreats(data);
    setLoading(false);
  };

  const executeIntervention = async (userId, action, reason = 'Neural Breach Detected') => {
    setIntervening(true);
    try {
      const { data, error } = await supabase.rpc('rpc_admin_user_action', {
        target_user_id: userId,
        action_type: action,
        reason: reason
      });

      if (!error) {
        notificationService.send("Divine Intervention", `Action ${action} executed successfully.`, "success");
        fetchThreats();
        setSelectedThreat(null);
      } else {
        notificationService.send("Authority Failure", error.message, "error");
      }
    } catch (err) {
      console.error("Intervention failure:", err);
    } finally {
      setIntervening(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 🔮 THE WATCH LIST */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-nuvio-red" /> Anomaly Detection
              </h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Real-time flagging of economic and social breaches</p>
           </div>
           <button onClick={fetchThreats} className="p-2 hover:bg-white/10 rounded-lg transition-all text-text-muted">
              <RefreshCw className="w-4 h-4" />
           </button>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-20 animate-pulse text-[10px] font-black uppercase text-nuvio-red tracking-[0.3em]">Scanning Neural Pathways...</div>
          ) : threats.length === 0 ? (
             <div className="nv-card p-12 text-center border-nuvio-green/20 bg-nuvio-green/5">
                <ShieldAlert className="w-10 h-10 text-nuvio-green mx-auto mb-4 opacity-50" />
                <p className="text-xs font-black text-nuvio-green uppercase tracking-widest">Neural Ecosystem Stable. No Breaches Detected.</p>
             </div>
          ) : threats.map(target => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={target.user_id}
              onClick={() => setSelectedThreat(target)}
              className={`nv-card p-6 border-nuvio-red/20 bg-nuvio-red/5 hover:bg-nuvio-red/10 cursor-pointer transition-all border-l-4 ${selectedThreat?.user_id === target.user_id ? 'border-l-nuvio-red scale-[1.02]' : 'border-l-transparent'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-nuvio-red/20 rounded-xl flex items-center justify-center text-nuvio-red">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase">{target.full_name}</div>
                    <div className="text-[9px] text-nuvio-red font-black uppercase tracking-widest mt-1">Risk Score: HIGH</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">{target.total_xp.toLocaleString()} XP</div>
                  <div className="text-[8px] font-black text-text-muted uppercase tracking-widest font-mono">{target.entry_count} Logs / 10m</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🏛️ INTERVENTION CONSOLE */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Intervention Console</h3>
        <div className={`nv-card p-8 border-white/5 bg-white/[0.02] h-full ${!selectedThreat ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
           {selectedThreat ? (
             <div className="space-y-8">
                <div className="text-center">
                   <div className="w-20 h-20 bg-nuvio-red/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-nuvio-red/20">
                      <Target className="w-10 h-10 text-nuvio-red animate-pulse" />
                   </div>
                   <h4 className="text-lg font-black text-white uppercase">{selectedThreat.full_name}</h4>
                   <p className="text-[10px] text-text-muted font-bold truncate">{selectedThreat.user_id}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                   <button 
                     onClick={() => executeIntervention(selectedThreat.user_id, 'BAN')}
                     disabled={intervening}
                     className="nv-btn-secondary border-nuvio-red/20 text-nuvio-red hover:bg-nuvio-red hover:text-white py-4 text-[10px] uppercase font-black tracking-widest"
                   >
                     Mortal Ban (Lock Profile)
                   </button>
                   <button 
                     onClick={() => executeIntervention(selectedThreat.user_id, 'RESET_XP')}
                     disabled={intervening}
                     className="nv-btn-secondary border-nuvio-yellow/20 text-nuvio-yellow hover:bg-nuvio-yellow hover:text-black py-4 text-[10px] uppercase font-black tracking-widest"
                   >
                     Reset Progress (Purge XP)
                   </button>
                   <button 
                     onClick={() => setSelectedThreat(null)}
                     className="nv-btn-secondary border-white/10 text-white py-4 text-[10px] uppercase font-black tracking-widest"
                   >
                     De-escalate
                   </button>
                </div>

                <div className="p-4 bg-nuvio-red/20 rounded-xl border border-nuvio-red/30">
                   <p className="text-[9px] font-black text-nuvio-red uppercase tracking-widest leading-loose">
                     CAUTION: All interventions are cryptographically audited and irreversible without master authority.
                   </p>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <Search className="w-12 h-12 text-text-muted mb-4 opacity-20" />
                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Select an identity to initiate authority protocol</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NeuralSentinel;
