import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Award, BarChart3, 
  Shield, LogOut, Camera, Save, 
  Coins, Zap, Trophy, Flame, 
  Target, GraduationCap, Users, ShieldAlert,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    full_name: user?.full_name || '', 
    email: user?.email || '',
    avatar_emoji: user?.avatar_emoji || '👤'
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('acadevance_learning_preferences');
    return saved ? JSON.parse(saved) : { goal: '30m', streakShield: true, sounds: true };
  });

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('acadevance_learning_preferences', JSON.stringify(updated));
    notificationService.send("Preferences Updated", "Your study preferences have been saved.", "success");
  };

  const handleSave = async () => {
    const updated = await authService.updateMe(editData);
    if (updated) {
      setUser(updated);
    }
    setIsEditing(false);
    notificationService.send("Profile Updated", "Your scholar profile details have been synced.", "success");
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const menuItems = [
    { icon: BarChart3, label: 'Stats' },
    { icon: Trophy, label: 'Achievements' },
    { icon: Settings, label: 'Settings' },
  ];

  const availableEmojis = [
    '👤', '🎓', '🚀', '⚡', '🧠', '📚', '🏆', '🎨', '🧪', '💻', 
    '🪐', '🧬', '🛡️', '👾', '🦁', '🦖', '🐼', '🦊', '🦉', '🔥'
  ];

  // Progression calculation
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpNeededForNextLevel = currentLevel * 500;
  const xpPercent = Math.min(100, Math.floor((currentXp / xpNeededForNextLevel) * 100));

  // Custom gamified achievements
  const achievementsList = [
    { id: 'math_whiz', title: 'Calculus Conqueror', desc: 'Achieve 75% or higher Calculus mastery', icon: '📐', criteria: 75, current: 74, unlocked: false },
    { id: 'streak_sentry', title: 'Streak Sentinel', desc: 'Maintain a study streak of 7 days or more', icon: '🔥', criteria: 7, current: user?.streak || 1, unlocked: (user?.streak || 1) >= 7 },
    { id: 'focus_titan', title: 'Focus Overlord', desc: 'Log a total of 10 completed focus sessions', icon: '⚡', criteria: 10, current: 3, unlocked: false },
    { id: 'uno_champ', title: 'Uno Legend', desc: 'Win 5 matches of Subject Uno', icon: '🃏', criteria: 5, current: 5, unlocked: true },
    { id: 'monopoly_king', title: 'Monopoly Mogul', desc: 'Claim 10 tiles in Study Monopoly board', icon: '🎲', criteria: 10, current: 12, unlocked: true },
    { id: 'boss_slayer', title: 'Boss Slayer', desc: 'Defeat a Term End Exam Boss raid', icon: '⚔️', criteria: 1, current: 1, unlocked: true }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6">
      {/* 🔮 PREMIUM PROFILE CARD */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-nuvio-purple-600/15 via-background-card/90 to-background-card/50 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-nuvio-purple-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-nuvio-blue/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12">
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[48px] bg-black/40 border-4 border-nuvio-purple-500/30 flex items-center justify-center text-6xl sm:text-7xl shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-nuvio-purple-400">
                {editData.avatar_emoji}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/70 rounded-[48px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Inline Avatar selector when editing */}
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-64 bg-black/60 border border-white/10 rounded-2xl p-3 mt-2 shadow-inner"
                >
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2 text-center">Select Scholar Crest</label>
                  <div className="grid grid-cols-5 gap-2 max-h-[120px] overflow-y-auto custom-scrollbar p-1">
                    {availableEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setEditData({ ...editData, avatar_emoji: emoji })}
                        className={`text-2xl p-1.5 rounded-xl hover:bg-white/10 transition-colors ${editData.avatar_emoji === emoji ? 'bg-nuvio-purple-500/30 border border-nuvio-purple-500' : 'border border-transparent'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Information & Progression */}
          <div className="flex-1 w-full space-y-6 text-center lg:text-left">
            <div>
              {isEditing ? (
                <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Scholar Name</label>
                  <input 
                    value={editData.full_name}
                    onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xl font-bold text-white outline-none focus:border-nuvio-purple-500 transition-colors"
                  />
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mt-2">Email Address</label>
                  <input 
                    value={editData.email}
                    disabled
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-3 text-sm text-text-muted outline-none cursor-not-allowed"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter flex items-center justify-center lg:justify-start gap-3">
                    {user?.full_name}
                    <GraduationCap className="w-8 h-8 text-nuvio-purple-400 hidden sm:inline" />
                  </h1>
                  <p className="text-sm text-text-secondary font-medium tracking-tight">{user?.email}</p>
                </div>
              )}
            </div>

            {/* Badges / Roles info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-nuvio-purple-600 to-nuvio-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nuvio-purple-500/20">
                Level {currentLevel}
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest">
                {user?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'SCHOLAR'}
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-nuvio-green rounded-xl text-[10px] font-black uppercase tracking-widest font-mono">
                9th Grade CBSE
              </span>
              <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
              >
                {isEditing ? <><Save className="w-3.5 h-3.5" /> Commit Changes</> : <><Settings className="w-3.5 h-3.5" /> Modify Profile</>}
              </button>
            </div>

            {/* Level progression bar */}
            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-secondary">
                <span>XP Progression</span>
                <span className="text-white">{currentXp} / {xpNeededForNextLevel} XP</span>
              </div>
              <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-nuvio-purple-500 via-nuvio-blue to-nuvio-green rounded-full relative"
                >
                  <span className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
                Earn {xpNeededForNextLevel - currentXp} more XP by completing quests and study modules to level up!
              </p>
            </div>
          </div>

          {/* Tokens Box */}
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center min-w-[180px] shadow-inner shrink-0 relative group hover:border-nuvio-yellow/40 transition-colors">
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-nuvio-yellow animate-ping" />
            <Coins className="w-8 h-8 text-nuvio-yellow mb-2 animate-bounce" />
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{user?.era_tokens?.toLocaleString()}</span>
            <span className="text-[9px] font-black text-nuvio-yellow uppercase tracking-widest mt-2">Era Tokens</span>
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-1">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`
              pb-4 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2
              ${activeTab === item.label ? 'text-nuvio-purple-400' : 'text-text-muted hover:text-white'}
            `}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            {activeTab === item.label && (
              <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-[3px] bg-nuvio-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 📑 TAB CONTENT */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'Stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { label: 'Calculus Mastery', val: '74%', color: 'bg-nuvio-blue', sub: 'Chapter Master status', percent: 74, icon: Target },
                { label: 'Study Streak', val: `${user?.streak || 1} Days`, color: 'bg-nuvio-orange', sub: 'Consecutive activity logs', percent: 14, icon: Flame },
                { label: 'Weekly XP', val: (user?.weekly_xp || 0).toLocaleString() + ' XP', color: 'bg-nuvio-green', sub: 'Target: 1,000 XP/week', percent: Math.min(100, Math.floor(((user?.weekly_xp || 0) / 1000) * 100)), icon: Zap },
                { label: 'Groups Joined', val: '4', color: 'bg-nuvio-purple-500', sub: 'Active study clusters', percent: 80, icon: Users },
                { label: 'Boss Raids', val: '12 Wins', color: 'bg-nuvio-red', sub: 'Exams conquered', percent: 100, icon: Trophy },
                { label: 'Academic Rank', val: 'Sentinel I', color: 'bg-nuvio-yellow', sub: 'Top 5% of global cohort', percent: 95, icon: GraduationCap },
              ].map((stat, i) => (
                <div key={i} className="nv-card p-6 flex flex-col justify-between border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{stat.label}</span>
                      <div className="text-2xl font-black text-white mt-1">{stat.val}</div>
                      <span className="text-[10px] text-text-secondary mt-1 block">{stat.sub}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 text-text-muted group-hover:text-white transition-colors">
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Subtle bar indicator */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color}`} style={{ width: `${stat.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievementsList.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`nv-card p-6 border-white/5 bg-gradient-to-br flex flex-col justify-between h-[180px] transition-all relative
                    ${achievement.unlocked 
                      ? 'from-background-card to-background-card border-l-4 border-l-nuvio-green/60' 
                      : 'from-background-card/50 to-background-card/30 opacity-40 grayscale border-l-4 border-l-text-muted/40'}`}
                >
                  <div className="flex gap-4">
                    <div className="text-4xl p-2 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{achievement.title}</h4>
                      <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">{achievement.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-text-muted">
                      <span>Progress</span>
                      <span>{achievement.current} / {achievement.criteria}</span>
                    </div>
                    <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${achievement.unlocked ? 'bg-nuvio-green' : 'bg-text-muted'}`} 
                        style={{ width: `${Math.min(100, Math.floor((achievement.current / achievement.criteria) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  {achievement.unlocked ? (
                    <span className="absolute top-4 right-4 bg-nuvio-green/20 text-nuvio-green border border-nuvio-green/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Unlocked</span>
                  ) : (
                    <span className="absolute top-4 right-4 bg-white/5 text-text-muted border border-white/5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Locked</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Learning Preferences Settings Card */}
              <div className="nv-card border-nuvio-purple-500/20 bg-nuvio-purple-500/5 p-8 relative overflow-hidden rounded-[24px]">
                <div className="absolute right-0 top-0 p-8 opacity-5">
                  <Settings className="w-32 h-32 text-nuvio-purple-500" />
                </div>
                
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-nuvio-purple-400" /> Learning Preferences
                </h3>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-8">Customize your daily study metrics and rewards system</p>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                    <div>
                      <div className="text-base font-black text-white">Daily Study Target</div>
                      <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Your target focus time per day</div>
                    </div>
                    <div className="flex gap-2">
                      {['15m', '30m', '60m', '90m'].map(g => (
                        <button
                          key={g}
                          onClick={() => handlePreferenceChange('goal', g)}
                          className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${preferences.goal === g ? 'bg-nuvio-purple-500 border-nuvio-purple-500 text-white shadow-lg shadow-nuvio-purple-500/20' : 'border-white/10 text-text-muted hover:text-white'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                    <div>
                      <div className="text-base font-black text-white">Streak Protection</div>
                      <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Auto-consume Streak Shield on missed days</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('streakShield', !preferences.streakShield)}
                      className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${preferences.streakShield ? 'bg-nuvio-green/10 border-nuvio-green text-nuvio-green' : 'border-white/10 text-text-muted hover:text-white'}`}
                    >
                      {preferences.streakShield ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="text-base font-black text-white">UI Sound Effects</div>
                      <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Trigger feedback clicks & progression chimes</div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('sounds', !preferences.sounds)}
                      className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${preferences.sounds ? 'bg-nuvio-purple-500/10 border-nuvio-purple-500 text-nuvio-purple-400' : 'border-white/10 text-text-muted hover:text-white'}`}
                    >
                      {preferences.sounds ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Log out section */}
              <div className="space-y-4">
                <button 
                  onClick={handleLogout} 
                  className="nv-card w-full flex items-center justify-between p-6 hover:bg-nuvio-red/10 border-white/5 hover:border-nuvio-red/20 group transition-all text-left rounded-[24px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-nuvio-red/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <LogOut className="w-5 h-5 text-nuvio-red" />
                    </div>
                    <div>
                      <div className="font-black text-nuvio-red text-base uppercase tracking-tight">Sign Out</div>
                      <div className="text-[10px] text-nuvio-red/50 uppercase tracking-widest mt-0.5">End your current study session</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
