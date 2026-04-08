import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  User, Settings, Award, BarChart3, 
  Share2, Shield, Bell, Moon, Sun, 
  Lock, LogOut, ChevronRight, Key,
  Camera, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { aiService } from '../services/aiService';

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    full_name: user?.full_name || '', 
    email: user?.email || '',
    avatar_emoji: user?.avatar_emoji || '👤'
  });

  const handleSave = () => {
    const updated = authService.updateMe(editData);
    setUser(updated);
    setIsEditing(false);
  };

  const handleLogout = () => {
    authService.logout();
  };

  const menuItems = [
    { icon: BarChart3, label: 'Stats' },
    { icon: Award, label: 'Achievements' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Profile Header */}
      <div className="nv-card p-10 bg-gradient-to-br from-nuvio-purple-600/20 via-background-card to-background-card border-nuvio-purple-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <User className="w-40 h-40" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-background-base border-4 border-nuvio-purple-500/30 flex items-center justify-center text-6xl shadow-2xl transition-transform group-hover:scale-105">
              {editData.avatar_emoji}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 rounded-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-4 max-w-sm">
                <input 
                  value={editData.full_name}
                  onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl font-black text-white outline-none focus:border-nuvio-purple-500"
                />
                <input 
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-text-muted outline-none focus:border-nuvio-purple-500"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">{user?.full_name}</h1>
                <p className="text-text-muted font-bold lowercase tracking-tight mt-1">{user?.email}</p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-nuvio-purple-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-nuvio-purple-500/20">
                Level {user?.level}
              </span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-text-muted rounded-full text-xs font-black uppercase tracking-widest">
                Student
              </span>
              <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                {isEditing ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Edit3 className="w-3.5 h-3.5" /> Edit Profile</>}
              </button>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-3xl font-black text-nuvio-yellow">{user?.era_tokens?.toLocaleString()}</div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Era Tokens</div>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="flex items-center gap-6 border-b border-border">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`
              pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative
              ${activeTab === item.label ? 'text-nuvio-purple-400' : 'text-text-muted hover:text-text-primary'}
            `}
          >
            {item.label}
            {activeTab === item.label && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-nuvio-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'Stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { label: 'Calculus Mastery', val: '74%', color: 'bg-nuvio-blue' },
                { label: 'Study Streak', val: `${user?.streak || 1} Days`, color: 'bg-nuvio-orange' },
                { label: 'Weekly XP', val: (user?.weekly_xp || 0).toLocaleString(), color: 'bg-nuvio-green' },
                { label: 'Groups Joined', val: '4', color: 'bg-nuvio-purple-500' },
                { label: 'Boss Raids', val: '12 Wins', color: 'bg-nuvio-red' },
                { label: 'Insights Rank', val: 'Top 5%', color: 'bg-nuvio-yellow' },
              ].map((stat, i) => (
                <div key={i} className="nv-card p-6 flex items-center justify-between border-white/5">
                  <div>
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-xl font-black text-text-primary">{stat.val}</div>
                  </div>
                  <div className={`w-2 h-10 rounded-full ${stat.color}`} />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`nv-card aspect-square flex flex-col items-center justify-center gap-4 text-center ${i > 3 ? 'opacity-30 grayscale' : ''}`}>
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">🏆</div>
                  <div className="text-[10px] font-black text-text-primary uppercase tracking-tight">Badge {i}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* AI Key Card */}
              <div className="nv-card border-nuvio-purple-500/30 bg-nuvio-purple-500/5 p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500/20 flex items-center justify-center">
                    <Key className="w-5 h-5 text-nuvio-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">OpenRouter API Key</h3>
                    <p className="text-xs text-text-muted">Enter your key to enable real Nova AI capabilities.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    defaultValue={aiService.getKey() || ''}
                    placeholder="sk-or-v1-..."
                    className="flex-1 bg-background-base border border-border rounded-xl px-4 py-2 text-xs focus:ring-1 ring-nuvio-purple-500 outline-none"
                    onBlur={(e) => aiService.setKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handleLogout} className="nv-card w-full flex items-center justify-between p-6 hover:bg-nuvio-red/10 border-white/5 group transition-all text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-nuvio-red/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-nuvio-red" />
                    </div>
                    <div>
                      <div className="font-bold text-nuvio-red text-base">Sign Out</div>
                      <div className="text-xs text-nuvio-red/50">End your current study session</div>
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

const Edit3 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

export default Profile;
