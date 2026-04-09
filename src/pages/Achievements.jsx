import React, { useState, useEffect } from 'react';
import { 
  Award, Star, Zap, Target, 
  Flame, Book, Trophy, CheckCircle2,
  Lock, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const Achievements = () => {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.me();

  const achievementList = [
    { id: 'first_session', name: 'Neural Awakening', icon: Zap, color: 'text-nuvio-blue', desc: 'Complete your first cloud focus session.' },
    { id: 'streak_3', name: 'Burning Ambition', icon: Flame, color: 'text-nuvio-orange', desc: 'Maintain a 3-day study streak.' },
    { id: 'deck_master', name: 'Memory Architect', icon: Book, color: 'text-nuvio-purple-400', desc: 'Create 5 custom memory decks.' },
    { id: 'rank_explorer', name: 'Rank Challenger', icon: Trophy, color: 'text-nuvio-yellow', desc: 'Reach Level 5 in the global cluster.' },
    { id: 'social_node', name: 'Social Pulse', icon: Sparkles, color: 'text-nuvio-green', desc: 'Broadcast your first message to the cluster.' },
  ];

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from('achievements_unlocked')
      .select('achievement_id')
      .eq('user_id', user.id);
    if (data) setUnlocked(data.map(a => a.achievement_id));
    setLoading(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center justify-center gap-4">
          <Award className="w-12 h-12 text-nuvio-yellow" />
          Neural Achievements
        </h1>
        <p className="text-text-secondary font-medium max-w-lg mx-auto">Verified milestones saved to your permanent academic record in the cloud.</p>
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{unlocked.length} / {achievementList.length}</div>
            <div className="text-[10px] text-text-muted uppercase font-black tracking-widest">Unlocked</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-nuvio-yellow">{Math.round((unlocked.length / achievementList.length) * 100)}%</div>
            <div className="text-[10px] text-text-muted uppercase font-black tracking-widest">Completion</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievementList.map((ach, i) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <motion.div 
              key={ach.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`nv-card p-10 border-white/5 relative group ${!isUnlocked ? 'opacity-40 grayscale' : 'border-nuvio-yellow/20 bg-nuvio-yellow/5'}`}
            >
              {isUnlocked && (
                <div className="absolute top-6 right-6 p-2 bg-nuvio-yellow rounded-xl shadow-lg shadow-nuvio-yellow/20">
                  <CheckCircle2 className="w-4 h-4 text-background-dark" />
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110 ${ach.color}`}>
                <ach.icon className="w-10 h-10" />
                {!isUnlocked && <Lock className="absolute -bottom-2 -right-2 w-6 h-6 p-1.5 bg-background-card border border-white/10 rounded-full text-text-muted" />}
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{ach.name}</h3>
                <p className="text-sm font-medium text-text-muted leading-relaxed">{ach.desc}</p>
              </div>

              {isUnlocked && (
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-nuvio-yellow uppercase tracking-[0.2em]">
                  <Sparkles className="w-3 h-3" /> VERIFIED CLOUD SYNC
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
