import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, MessageSquare, 
  Sparkles, ShieldCheck, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(authService.me());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('public:group_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('group_messages')
      .select('*')
      .order('timestamp', { ascending: true })
      .limit(50);
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      user_id: user.id,
      content: newMessage,
    };

    const { error } = await supabase.from('group_messages').insert([msg]);
    if (!error) setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-background-card rounded-[32px] border border-border overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-nuvio-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">Global Student Cluster</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nuvio-green animate-pulse" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Live Sync Active</span>
            </div>
          </div>
        </div>
        <div className="flex -space-x-3">
           {['🦊', '🐼', '🐬', '🧠'].map((e, i) => (
             <div key={i} className="w-10 h-10 rounded-full bg-white/5 border-2 border-background-card flex items-center justify-center text-xl">{e}</div>
           ))}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-base/30">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.user_id === user.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[70%] p-4 rounded-3xl relative
                  ${isMe 
                    ? 'bg-nuvio-purple-500 text-white rounded-tr-none shadow-xl shadow-nuvio-purple-500/20' 
                    : 'bg-white/5 text-text-primary border border-white/5 rounded-tl-none'}
                `}>
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  <div className={`text-[8px] font-black uppercase mt-2 opacity-50 ${isMe ? 'text-white' : 'text-text-muted'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-white/[0.03] border-t border-white/5">
        <div className="relative">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Broadcast to the cluster..."
            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 pr-16 text-white placeholder:text-text-muted/50 outline-none focus:border-nuvio-purple-500 transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-nuvio-purple-500 rounded-xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Messages;
