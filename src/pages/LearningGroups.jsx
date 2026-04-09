import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Plus, 
  ChevronRight, Star, ShieldCheck, 
  TrendingUp, MessageSquare, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';

const LearningGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const user = authService.me();

  useEffect(() => {
    const allGroups = [
      { id: 'g1', name: 'Calculus Kings', subject: 'Math', members: 124, active: true, level: 'Advanced' },
      { id: 'g2', name: 'Biology Bandits', subject: 'Science', members: 89, active: true, level: 'Intermediate' },
      { id: 'g3', name: 'History Heroes', subject: 'Humanities', members: 56, active: false, level: 'Beginner' },
      { id: 'g4', name: 'Physics Phantoms', subject: 'Science', members: 312, active: true, level: 'Elite' },
    ];
    setGroups(allGroups);

    const saved = dataService.list('my_groups');
    setMyGroups(saved.map(s => s.groupId));
  }, []);

  const toggleJoin = (groupId) => {
    if (myGroups.includes(groupId)) {
      dataService.delete('my_groups', groupId);
      setMyGroups(myGroups.filter(id => id !== groupId));
    } else {
      dataService.create('my_groups', { id: groupId, groupId });
      setMyGroups([...myGroups, groupId]);
    }
  };

  return (
    <div className="space-y-10 pb-20 nv-page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Squad Hub</h1>
          <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-1 opacity-70">Collaborative intelligence clusters</p>
        </div>
        <button className="nv-btn-primary gap-3 px-8 h-14 uppercase tracking-widest text-xs">
          <Plus className="w-5 h-5" /> New Group
        </button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-sm focus:border-nuvio-purple-500 outline-none transition-all shadow-inner"
          placeholder="Search clusters by name or subject..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map((group) => {
          const isJoined = myGroups.includes(group.id);
          return (
            <motion.div 
              key={group.id}
              whileHover={{ y: -6 }}
              className="nv-card p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nuvio-purple-500/5 blur-[80px] pointer-events-none" />
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-[24px] bg-background-base border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner">
                    {group.subject === 'Math' ? '📐' : group.subject === 'Science' ? '🧪' : '📜'}
                  </div>
                  {group.active && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-nuvio-green/10 text-nuvio-green border border-nuvio-green/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <TrendingUp className="w-3 h-3" /> Live Now
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{group.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4" /> {group.members} Sages
                    </span>
                    <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest bg-nuvio-purple-500/5 px-2 py-0.5 rounded-md">
                      {group.level} Tier
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => toggleJoin(group.id)}
                  className={`flex-1 h-14 rounded-2xl border transition-all uppercase tracking-widest text-[10px] font-black ${isJoined ? 'bg-nuvio-red/10 border-nuvio-red/20 text-nuvio-red hover:bg-nuvio-red/20' : 'bg-white/5 border-white/10 text-text-primary hover:bg-white/10'}`}
                >
                  {isJoined ? 'Exit Group' : 'Engage'}
                </button>
                <button 
                  onClick={() => navigate('/messages')}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-text-muted hover:text-white"
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tutoring */}
      <div className="nv-card bg-[#1a1a24] border-nuvio-purple-500/30 p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-nuvio-purple-600/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 shadow-inner">
            <Star className="w-12 h-12 text-nuvio-yellow fill-nuvio-yellow/20" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Elite Tutoring</h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl font-bold opacity-70">Unlock exclusive 1-on-1 sessions with Verified Sages by reaching Level 20 or joining an Elite Group.</p>
          </div>
          <button 
            onClick={() => {
              if (user?.level < 20 && !user?.god_mode) {
                alert("DENIED: Absolute authority or Level 20 status required for Elite Tutoring.");
              } else {
                setShowApplyModal(true);
              }
            }}
            className={`px-12 h-16 shadow-2xl uppercase tracking-widest text-xs rounded-2xl font-black transition-all ${
              (user?.level >= 20 || user?.god_mode) 
                ? 'bg-nuvio-purple-500 text-white hover:bg-nuvio-purple-600 shadow-nuvio-purple-500/20' 
                : 'bg-white/5 text-text-muted border border-white/10 cursor-not-allowed'
            }`}
          >
            {user?.god_mode ? 'Divine Entry' : 'Apply Now'}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-base/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="nv-card max-w-md w-full p-12 text-center space-y-8 border-nuvio-purple-500/30 shadow-2xl"
            >
              <div className="w-20 h-20 bg-nuvio-green/10 rounded-[32px] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-nuvio-green" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Application Sent</h3>
                <p className="text-sm text-text-muted font-bold">Our Sages will review your academic patterns and notify you within 24 hours.</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="nv-btn-primary w-full h-14">Return to Hub</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningGroups;
