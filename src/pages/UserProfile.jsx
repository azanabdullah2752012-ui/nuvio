import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageSquare, Star, Zap,
  Flame, Trophy, Shield, GraduationCap, Target,
  Users, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import { xpService } from '../services/xpService';

const getStageLabel = (level) => {
  if (level >= 25) return { label: 'Ancient', color: 'text-nuvio-orange bg-nuvio-orange/10 border-nuvio-orange/20' };
  if (level >= 15) return { label: 'Majestic', color: 'text-nuvio-purple-400 bg-nuvio-purple-400/10 border-nuvio-purple-400/20' };
  if (level >= 8) return { label: 'Evolved', color: 'text-nuvio-green bg-nuvio-green/10 border-nuvio-green/20' };
  return { label: 'Starter', color: 'text-text-muted bg-white/5 border-white/10' };
};

const StatCard = ({ icon: Icon, label, value, color, percent }) => (
  <div className="nv-card p-5 flex flex-col justify-between border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{label}</span>
        <div className="text-xl font-black text-white mt-0.5">{value}</div>
      </div>
      <div className="p-2 rounded-xl bg-white/5 text-text-muted group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, percent)}%` }} />
    </div>
  </div>
);

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.me();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // If viewing own profile, redirect to /profile
    if (userId === currentUser?.id) {
      navigate('/profile', { replace: true });
      return;
    }
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (userId?.startsWith('mock-')) {
        const mockProfilesList = [
          { id: 'mock-aarav', full_name: 'Aarav Sharma', avatar_emoji: '🦁', level: 12, xp: 4250, grade_level: '9th', streak: 4, achievements: ['first_steps', 'quest_master'], updated_at: new Date().toISOString(), stats_focus_sessions: 5, stats_flashcards_reviewed: 42, stats_boss_defeated: 1, stats_quests_completed: 6 },
          { id: 'mock-diya', full_name: 'Diya Patel', avatar_emoji: '🦊', level: 26, xp: 15400, grade_level: '9th', streak: 15, achievements: ['first_steps', 'boss_slayer', 'legendary'], updated_at: new Date().toISOString(), stats_focus_sessions: 24, stats_flashcards_reviewed: 310, stats_boss_defeated: 8, stats_quests_completed: 25 },
          { id: 'mock-ishaan', full_name: 'Ishaan Verma', avatar_emoji: '🐼', level: 7, xp: 850, grade_level: '9th', streak: 0, achievements: ['first_steps'], updated_at: new Date(Date.now() - 3600000).toISOString(), stats_focus_sessions: 1, stats_flashcards_reviewed: 10, stats_boss_defeated: 0, stats_quests_completed: 2 },
          { id: 'mock-ananya', full_name: 'Ananya Iyer', avatar_emoji: '🦄', level: 18, xp: 9200, grade_level: '9th', streak: 8, achievements: ['first_steps', 'speed_demon'], updated_at: new Date(Date.now() - 7200000).toISOString(), stats_focus_sessions: 11, stats_flashcards_reviewed: 125, stats_boss_defeated: 3, stats_quests_completed: 12 },
          { id: 'mock-kabir', full_name: 'Kabir Mehta', avatar_emoji: '🐨', level: 3, xp: 200, grade_level: '9th', streak: 2, achievements: [], updated_at: new Date().toISOString(), stats_focus_sessions: 0, stats_flashcards_reviewed: 4, stats_boss_defeated: 0, stats_quests_completed: 0 }
        ];
        const match = mockProfilesList.find(p => p.id === userId);
        if (match) {
          setProfile(match);
          const allAchs = gamificationService.getAchievements().map(ach => ({
            ...ach,
            unlocked: (match.achievements || []).includes(ach.id),
          }));
          setAchievements(allAchs.filter(a => a.unlocked).slice(0, 6));
          setStats({ percentile: 15, rankTitle: gamificationService.getRank(match.level || 1).title });
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_emoji, level, xp, grade_level, streak, achievements, updated_at, stats_focus_sessions, stats_flashcards_reviewed, stats_boss_defeated, stats_quests_completed')
        .eq('id', userId)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data);

      // Build achievements list
      const allAchs = gamificationService.getAchievements().map(ach => ({
        ...ach,
        unlocked: (data.achievements || []).includes(ach.id),
      }));
      setAchievements(allAchs.filter(a => a.unlocked).slice(0, 6));

      // Compute rank
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, xp')
        .order('xp', { ascending: false });

      let percentile = 50;
      if (allProfiles) {
        const idx = allProfiles.findIndex(p => p.id === userId);
        if (idx !== -1) percentile = Math.max(1, Math.round(((idx + 1) / allProfiles.length) * 100));
      }

      const rankTitle = gamificationService.getRank(data.level || 1).title;
      setStats({ percentile, rankTitle });
    } catch (e) {
      console.warn('Failed to load profile:', e);
      setNotFound(true);
    }
    setLoading(false);
  };

  const handleMessage = () => {
    if (!profile) return;
    navigate('/messages', { state: { openDm: profile } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest animate-pulse">Loading Scholar...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-6 text-center">
        <div className="text-6xl">🔮</div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Scholar Not Found</h2>
          <p className="text-text-secondary text-sm mt-2">This profile doesn't exist or has been removed.</p>
        </div>
        <button
          onClick={() => navigate('/classmates')}
          className="nv-btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classmates
        </button>
      </div>
    );
  }

  const xpForNext = xpService.getNextLevelXp(profile.level || 1);
  const xpPercent = Math.min(100, Math.floor(((profile.xp || 0) / xpForNext) * 100));
  const stage = getStageLabel(profile.level || 1);
  const isOnline = profile.updated_at > new Date(Date.now() - 15 * 60 * 1000).toISOString();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-nuvio-purple-600/10 via-background-card/90 to-background-card/50 p-8 shadow-2xl"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-nuvio-purple-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-nuvio-blue/8 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-[40px] bg-black/40 border-4 border-nuvio-purple-500/20 flex items-center justify-center text-6xl shadow-2xl">
              {profile.avatar_emoji || '👤'}
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-nuvio-green border-2 border-background-card rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                {profile.full_name || 'Scholar'}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tight border ${stage.color}`}>
                  {stage.label} Stage
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-text-muted rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Grade {profile.grade_level || '9th'} CBSE
                </span>
                {isOnline && (
                  <span className="px-3 py-1 bg-nuvio-green/10 border border-nuvio-green/20 text-nuvio-green rounded-xl text-[9px] font-black uppercase tracking-widest">
                    ● Online
                  </span>
                )}
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-text-secondary">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-nuvio-yellow fill-nuvio-yellow" />
                  Level {profile.level || 1}
                </span>
                <span className="text-white">{(profile.xp || 0).toLocaleString()} XP</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-nuvio-purple-500 via-nuvio-blue to-nuvio-green rounded-full"
                />
              </div>
            </div>

            {/* Message Button */}
            <div className="flex justify-center sm:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMessage}
                className="flex items-center gap-2 px-6 py-3 bg-nuvio-purple-500 hover:bg-nuvio-purple-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-nuvio-purple-500/30 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <StatCard
          icon={Flame}
          label="Study Streak"
          value={`${profile.streak || 0} Days`}
          color="bg-nuvio-orange"
          percent={Math.min(100, ((profile.streak || 0) / 7) * 100)}
        />
        <StatCard
          icon={Zap}
          label="Focus Sessions"
          value={profile.stats_focus_sessions || 0}
          color="bg-nuvio-green"
          percent={Math.min(100, (profile.stats_focus_sessions || 0) * 5)}
        />
        <StatCard
          icon={Trophy}
          label="Boss Raids Won"
          value={profile.stats_boss_defeated || 0}
          color="bg-nuvio-red"
          percent={Math.min(100, (profile.stats_boss_defeated || 0) * 10)}
        />
        <StatCard
          icon={Target}
          label="Quests Done"
          value={profile.stats_quests_completed || 0}
          color="bg-nuvio-blue"
          percent={Math.min(100, (profile.stats_quests_completed || 0) * 5)}
        />
        <StatCard
          icon={Shield}
          label="Academic Rank"
          value={stats?.rankTitle || '—'}
          color="bg-nuvio-yellow"
          percent={stats ? 100 - stats.percentile : 50}
        />
        <StatCard
          icon={Users}
          label="Flashcards"
          value={(profile.stats_flashcards_reviewed || 0).toLocaleString()}
          color="bg-nuvio-purple-500"
          percent={Math.min(100, (profile.stats_flashcards_reviewed || 0) / 2)}
        />
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nuvio-green" />
            Unlocked Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className="nv-card p-4 flex items-center gap-3 border-white/5 bg-white/[0.01] border-l-4 border-l-nuvio-green/50"
              >
                <span className="text-3xl">{ach.icon}</span>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">{ach.title}</p>
                  <p className="text-[10px] text-text-muted font-medium">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
