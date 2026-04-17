import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2, ShieldOff, Send, Activity, UserX, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { notificationService } from '../../services/notificationService';

const SocialMatrix = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcast, setBroadcast] = useState('');
  const [filter, setFilter] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchLatest();

    // 🚀 MASTER STREAM: Listen to ALL message inserts for real-time monitoring
    const channel = supabase
      .channel('admin_oversight')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [payload.new, ...prev.slice(0, 49)]); // Keep last 50
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchLatest = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles:sender_id(full_name, avatar_emoji)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setMessages(data);
    setLoading(false);
  };

  const deleteMessage = async (msgId) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', msgId);
      if (!error) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
        notificationService.send("Cleanup Success", "Message purged from neural net.", "info");
      }
    } catch (e) { console.error(e); }
  };

  const sendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcast.trim()) return;

    const { error } = await supabase.from('messages').insert([{
      sender_id: (await supabase.auth.getUser()).data.user.id,
      recipient_id: '00000000-0000-0000-0000-000000000000', // System Broadcast
      content: `[DIVINE BROADCAST] ${broadcast}`
    }]);

    if (!error) {
      setBroadcast('');
      notificationService.send("Broadcast Dispatched", "System message synced to all nodes.", "success");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 📡 THE LIVE STREAM */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <Activity className="w-6 h-6 text-nuvio-purple-400" /> Neural Stream
              </h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Real-time unmasked monitoring of global communications</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="text-[10px] font-black text-nuvio-green animate-pulse uppercase">Live Sync</div>
              <ShieldOff className="w-4 h-4 text-text-muted" />
           </div>
        </div>

        <div className="nv-card p-0 border-white/5 bg-white/[0.01] flex flex-col h-[600px] overflow-hidden">
           <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl group relative"
                  >
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                           <div className="text-xl">{msg.profiles?.avatar_emoji || '👤'}</div>
                           <div>
                              <div className="text-[10px] font-black text-white uppercase tracking-tighter">
                                {msg.profiles?.full_name || 'Incognito Entity'}
                              </div>
                              <p className="text-sm font-medium text-text-primary mt-1 leading-relaxed">{msg.content}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-nuvio-red/10 text-nuvio-red rounded-lg hover:bg-nuvio-red hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* 🔮 BROADCAST TERMINAL */}
      <div className="space-y-6">
         <h3 className="text-xl font-black text-white uppercase tracking-tight">System Terminal</h3>
         <div className="nv-card p-8 border-white/5 bg-white/[0.02] space-y-8">
            <form onSubmit={sendBroadcast} className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Global Broadcast Pulse</label>
                  <textarea 
                    value={broadcast}
                    onChange={e => setBroadcast(e.target.value)}
                    placeholder="Input divine transmission..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-nuvio-purple-500 resize-none transition-all placeholder:text-text-muted/30"
                  />
               </div>
               <button 
                 type="submit"
                 className="nv-btn-primary w-full h-14 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
               >
                 <Send className="w-4 h-4" /> Dispatch Packet
               </button>
            </form>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Global Intervention</h4>
               <button className="w-full py-4 bg-nuvio-red/10 border border-nuvio-red/20 text-nuvio-red rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-nuvio-red hover:text-white transition-all">
                  <UserX className="w-4 h-4" /> Force Global Mute (Safety Protocol)
               </button>
            </div>

            <div className="p-4 bg-nuvio-purple-500/10 rounded-xl border border-nuvio-purple-500/20 flex gap-3">
               <AlertCircle className="w-5 h-5 text-nuvio-purple-400 mt-0.5" />
               <p className="text-[9px] font-bold text-nuvio-purple-300 leading-relaxed uppercase tracking-widest">
                 System broadcasts are pinned to the top of all active student pods and bypass local notification filters.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SocialMatrix;
