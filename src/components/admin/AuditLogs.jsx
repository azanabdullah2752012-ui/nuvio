import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, User, Hammer, Settings, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const sub = supabase
      .channel('admin_logs_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_logs' }, () => {
        fetchLogs();
      })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('admin_logs')
      .select('*, profiles:admin_id(full_name, avatar_emoji)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setLogs(data);
    setLoading(false);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'BAN': return <ShieldCheck className="w-4 h-4 text-nuvio-red" />;
      case 'GRANT_XP': return <Hammer className="w-4 h-4 text-nuvio-blue" />;
      case 'CONFIG_CHANGE': return <Settings className="w-4 h-4 text-nuvio-yellow" />;
      default: return <Clock className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-nuvio-green" /> Master Audit Trail
        </h3>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Permanent cryptographic record of all authority actions</p>
      </div>

      <div className="nv-card p-0 border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black text-white uppercase tracking-widest">Timestamp</th>
                <th className="p-6 text-[10px] font-black text-white uppercase tracking-widest">Authority</th>
                <th className="p-6 text-[10px] font-black text-white uppercase tracking-widest">Action Protocol</th>
                <th className="p-6 text-[10px] font-black text-white uppercase tracking-widest">Target Entity</th>
                <th className="p-6 text-[10px] font-black text-white uppercase tracking-widest">Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {logs.map((log) => (
                 <motion.tr 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   key={log.id}
                   className="hover:bg-white/[0.02] transition-all"
                 >
                    <td className="p-6 text-[10px] font-mono text-text-muted whitespace-nowrap">
                       {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          <span className="text-sm">{log.profiles?.avatar_emoji}</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-tight">{log.profiles?.full_name || 'System Auto'}</span>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          {getIcon(log.action_type)}
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                            {log.action_type}
                          </span>
                       </div>
                    </td>
                    <td className="p-6 text-[10px] font-mono text-text-muted truncate max-w-[150px]">
                       {log.target_id}
                    </td>
                    <td className="p-6">
                       <p className="text-[10px] font-bold text-text-primary uppercase tracking-tighter opacity-75">{log.details}</p>
                    </td>
                 </motion.tr>
               ))}
               {logs.length === 0 && (
                 <tr>
                    <td colSpan="5" className="p-20 text-center">
                       <AlertCircle className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-20" />
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Neural Logs Empty. Awaiting first authority action.</p>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
