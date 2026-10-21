import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Clock, X } from 'lucide-react';

const MiniProfileCard = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="w-full max-w-sm bg-white border border-[#e5e1d5] rounded-2xl shadow-[0_8px_32px_rgba(27,59,43,0.08)] pointer-events-auto relative overflow-hidden text-left">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-[#f5f3ec] rounded-lg text-[#827f76] hover:text-[#1a1917] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-3xl shadow-sm mb-4">
            {user.avatar_emoji || '🎓'}
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a1917]">{user.full_name || 'Scholar'}</h2>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-[#f5f3ec] rounded-full border border-[#e5e1d5]">
            <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
              CBSE Class {user.grade || '9'} Student
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 divide-x divide-[#e5e1d5] border-t border-[#e5e1d5] bg-[#fbfbfa]">
          <div className="p-4 flex flex-col items-center gap-1 text-center">
            <BookOpen className="w-4 h-4 text-[#1b3b2b]" />
            <div className="text-lg font-serif font-bold text-[#1a1917]">Verified</div>
            <div className="text-[9px] font-mono text-[#827f76] uppercase tracking-wider">Study Record</div>
          </div>
          <div className="p-4 flex flex-col items-center gap-1 text-center">
            <Target className="w-4 h-4 text-[#1b3b2b]" />
            <div className="text-lg font-serif font-bold text-[#1a1917]">{user.streak || 1} Days</div>
            <div className="text-[9px] font-mono text-[#827f76] uppercase tracking-wider">Active Streak</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniProfileCard;
