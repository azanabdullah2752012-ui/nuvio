import React from 'react';
import { 
  Award, Star, Zap, Flame, 
  Target, GraduationCap, Trophy, 
  ShieldCheck, CheckCircle2, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const badges = [
    { id: 1, title: 'Early Bird', desc: 'Complete a study goal before 8:00 AM.', icon: Zap, color: 'bg-nuvio-yellow', unlocked: true, date: 'Mar 15, 2026' },
    { id: 2, title: 'Flame Keeper', desc: 'Maintain a 7-day study streak.', icon: Flame, color: 'bg-nuvio-orange', unlocked: true, date: 'Mar 20, 2026' },
    { id: 3, title: 'Subject Master', desc: 'Reach Level 10 in any subject.', icon: GraduationCap, color: 'bg-nuvio-purple-500', unlocked: true, date: 'Apr 02, 2026' },
    { id: 4, title: 'Social Scholar', desc: 'Join your first learning group.', icon: Target, color: 'bg-nuvio-blue', unlocked: false },
    { id: 5, title: 'Boss Slayer', desc: 'Participate in a winning Boss Raid.', icon: Trophy, color: 'bg-nuvio-red', unlocked: false },
    { id: 6, title: 'Nova\'s Favorite', desc: 'Chat with Nova AI 50 times.', icon: Star, color: 'bg-nuvio-green', unlocked: false },
    { id: 7, title: 'Verified Sage', desc: 'Link your student ID.', icon: ShieldCheck, color: 'bg-nuvio-blue', unlocked: false },
    { id: 8, title: 'Perfect Week', desc: 'Full study goals for 7 days.', icon: CheckCircle2, color: 'bg-nuvio-green', unlocked: false },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center justify-center p-3 bg-nuvio-yellow/10 rounded-2xl mb-2 ring-1 ring-nuvio-yellow/20">
          <Award className="w-8 h-8 text-nuvio-yellow" />
        </div>
        <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Achievements</h1>
        <p className="text-text-secondary">Track your milestones and collect unique badges to show off on your profile.</p>
        
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="text-center">
            <div className="text-2xl font-black text-text-primary">3 / 8</div>
            <div className="nv-label">BADGES EARNED</div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-black text-nuvio-yellow">37.5%</div>
            <div className="nv-label">COMPLETION</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`
              nv-card group relative p-8 flex flex-col items-center text-center gap-4 transition-all
              ${badge.unlocked 
                ? 'border-nuvio-yellow/20 hover:border-nuvio-yellow/40 hover:bg-nuvio-yellow/[0.02]' 
                : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
              }
            `}
          >
            {/* Locked Overlay */}
            {!badge.unlocked && (
              <div className="absolute top-4 right-4 text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
            )}

            <div className={`
              w-20 h-20 rounded-[32px] flex items-center justify-center shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6
              ${badge.color} ${badge.unlocked ? 'shadow-yellow-500/10' : 'bg-slate-700'}
            `}>
              <badge.icon className={`w-10 h-10 ${badge.unlocked ? 'text-white' : 'text-slate-400'}`} />
            </div>

            <div>
              <h3 className="text-lg font-black text-text-primary mb-1">{badge.title}</h3>
              <p className="text-xs text-text-muted font-bold leading-tight">{badge.desc}</p>
            </div>

            {badge.unlocked && (
              <div className="mt-2 px-3 py-1 bg-nuvio-yellow/10 rounded-full">
                <span className="text-[10px] font-black text-nuvio-yellow uppercase tracking-widest">
                  Earned {badge.date}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Hero Achievement Section */}
      <div className="nv-card bg-gradient-to-r from-nuvio-purple-600/10 to-nuvio-blue/10 border-nuvio-purple-500/20">
        <div className="flex flex-col md:flex-row items-center gap-10 p-6 md:p-10">
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center ring-4 ring-white/5">
              <Trophy className="w-12 h-12 text-nuvio-yellow" />
            </div>
            <div className="absolute -top-2 -right-2 bg-nuvio-orange text-white text-[10px] font-black px-2 py-1 rounded-lg">MYSTERY</div>
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">The Ultimate Goal</h3>
            <p className="text-sm text-white/70 max-w-lg">
              Unlock all core subject badges to earn the **Master of Nuvio** title and a permanent 10% XP boost for your profile.
            </p>
          </div>
          <button className="nv-btn-primary px-8 whitespace-nowrap">Check Progress</button>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
