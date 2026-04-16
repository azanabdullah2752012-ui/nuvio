import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Trophy, Zap, MessageSquare, X } from 'lucide-react';

const MiniProfileCard = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="w-full max-w-md nv-card !bg-bg-card border-4 !border-nuvio-purple-500 shadow-nb pointer-events-auto relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-nuvio-purple-500/10 blur-3xl rounded-full" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center p-8 border-b-2 border-white/5">
          <div className="w-24 h-24 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-5xl border-4 border-black shadow-nb-small mb-6">
            {user.avatar_emoji || '👤'}
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{user.full_name || 'Scholar'}</h2>
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-nuvio-purple-500/20 rounded-full border border-nuvio-purple-500/30">
            <Shield className="w-3 h-3 text-nuvio-purple-400" />
            <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">Rank: Pulse Guard</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 divide-x divide-y divide-white/5 border-b-2 border-white/5">
          <div className="p-6 flex flex-col items-center gap-2">
            <Zap className="w-5 h-5 text-nuvio-yellow" />
            <div className="text-xl font-black text-white">{user.xp?.toLocaleString()}</div>
            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Total XP</div>
          </div>
          <div className="p-6 flex flex-col items-center gap-2">
            <Trophy className="w-5 h-5 text-nuvio-orange" />
            <div className="text-xl font-black text-white">{user.level || 1}</div>
            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Sync Level</div>
          </div>
          <div className="p-6 flex flex-col items-center gap-2">
            <Target className="w-5 h-5 text-nuvio-cyan" />
            <div className="text-xl font-black text-white">{user.streak || 1}</div>
            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Day Streak</div>
          </div>
          <div className="p-6 flex flex-col items-center gap-2">
            <MessageSquare className="w-5 h-5 text-nuvio-blue" />
            <div className="text-xl font-black text-white">42</div>
            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Endorsements</div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-4">
          <button className="flex-1 nv-btn-primary py-4 text-[10px] uppercase tracking-widest bg-nuvio-cyan border-nuvio-cyan hover:bg-white">
            Send Message
          </button>
          <button className="flex-1 nv-btn-secondary py-4 text-[10px] uppercase tracking-widest">
            Compare Specs
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniProfileCard;
