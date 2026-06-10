import React, { useState, useEffect } from 'react';
import {
  Users, Search, MessageSquare,
  ChevronRight, Star, ShieldCheck, Zap, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const getStageLabel = (level) => {
  if (level >= 25) return { label: 'Ancient', color: 'text-nuvio-orange bg-nuvio-orange/10' };
  if (level >= 15) return { label: 'Majestic', color: 'text-nuvio-purple-400 bg-nuvio-purple-400/10' };
  if (level >= 8) return { label: 'Evolved', color: 'text-nuvio-green bg-nuvio-green/10' };
  return { label: 'Starter', color: 'text-text-muted bg-white/5' };
};

const getMockClassmates = () => [
  {
    id: 'mock-aarav',
    full_name: 'Aarav Sharma',
    avatar_emoji: '🦁',
    level: 12,
    xp: 4250,
    grade_level: '9th',
    isOnline: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-diya',
    full_name: 'Diya Patel',
    avatar_emoji: '🦊',
    level: 26,
    xp: 15400,
    grade_level: '9th',
    isOnline: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-ishaan',
    full_name: 'Ishaan Verma',
    avatar_emoji: '🐼',
    level: 7,
    xp: 850,
    grade_level: '9th',
    isOnline: false,
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'mock-ananya',
    full_name: 'Ananya Iyer',
    avatar_emoji: '🦄',
    level: 18,
    xp: 9200,
    grade_level: '9th',
    isOnline: false,
    updated_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'mock-kabir',
    full_name: 'Kabir Mehta',
    avatar_emoji: '🐨',
    level: 3,
    xp: 200,
    grade_level: '9th',
    isOnline: true,
    updated_at: new Date().toISOString()
  }
];

const Classmates = () => {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'online'
  const currentUser = authService.me();
  const navigate = useNavigate();
  const onlineThreshold = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_emoji, level, xp, grade_level, updated_at')
        .neq('id', currentUser?.id || '')
        .order('xp', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const enriched = data.map(p => ({
          ...p,
          isOnline: p.updated_at > onlineThreshold,
        }));
        setClassmates(enriched);
      } else {
        setClassmates(getMockClassmates());
      }
    } catch (e) {
      console.warn('Failed to fetch classmates:', e);
      setClassmates(getMockClassmates());
    }
    setLoading(false);
  };

  const handleMessage = (classmate) => {
    navigate('/messages', { state: { openDm: classmate } });
  };

  const handleViewProfile = (classmate) => {
    navigate(`/profile/${classmate.id}`);
  };

  const filtered = classmates.filter(c => {
    const matchesSearch = c.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'online' && c.isOnline);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <Users className="w-8 h-8 text-nuvio-purple-400" />
            Classmates
          </h1>
          <p className="text-text-secondary text-sm">
            {loading ? 'Loading scholars...' : `${classmates.length} scholars in your school`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="bg-white/5 border border-border rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 ring-nuvio-purple-500 outline-none text-white"
            />
          </div>

          {/* Online filter */}
          <button
            onClick={() => setFilter(f => f === 'all' ? 'online' : 'all')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all
              ${filter === 'online'
                ? 'bg-nuvio-green/10 border-nuvio-green/30 text-nuvio-green'
                : 'bg-white/5 border-border text-text-muted hover:text-white'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'online' ? 'bg-nuvio-green animate-pulse' : 'bg-text-muted'}`} />
            {filter === 'online' ? 'Online' : 'All'}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="nv-card p-6 border-white/5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Users className="w-16 h-16 text-text-muted/30" />
          <div>
            <p className="text-lg font-black text-text-muted uppercase tracking-tight">
              {search ? 'No scholars found' : 'No classmates yet'}
            </p>
            <p className="text-sm text-text-muted/60 mt-1">
              {search ? 'Try a different search term' : 'Invite friends to join Nuvio!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => {
            const stage = getStageLabel(c.level || 1);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="nv-card p-0 overflow-hidden group hover:border-nuvio-purple-500/30 transition-all border-white/5"
              >
                {/* Card Top */}
                <div className="p-6 bg-white/[0.02] border-b border-border flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-background-base border border-border flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {c.avatar_emoji || '👤'}
                    </div>
                    {c.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-nuvio-green border-2 border-background-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-white group-hover:text-nuvio-purple-400 transition-colors uppercase tracking-tight truncate">
                        {c.full_name || 'Scholar'}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] font-black text-nuvio-yellow shrink-0">
                        <Star className="w-3 h-3 fill-nuvio-yellow" />
                        LVL {c.level || 1}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${stage.color}`}>
                        {stage.label} Stage
                      </span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        {(c.xp || 0).toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-nuvio-blue" />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                      Grade {c.grade_level || '9th'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Message DM */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMessage(c)}
                      title={`Message ${c.full_name}`}
                      className="p-2.5 rounded-xl bg-nuvio-purple-500/10 hover:bg-nuvio-purple-500/20 border border-nuvio-purple-500/20 text-nuvio-purple-400 hover:text-nuvio-purple-300 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </motion.button>

                    {/* View Profile */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewProfile(c)}
                      title={`View ${c.full_name}'s profile`}
                      className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-text-muted hover:text-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats Banner */}
      {!loading && classmates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="nv-card bg-nuvio-purple-500/5 border-nuvio-purple-500/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 bg-nuvio-purple-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <UserCheck className="w-8 h-8 text-nuvio-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">
                {classmates.filter(c => c.isOnline).length} Scholars Online Right Now
              </h3>
              <p className="text-sm text-text-secondary">
                Click the <MessageSquare className="w-3 h-3 inline" /> icon to start a private conversation or <ChevronRight className="w-3 h-3 inline" /> to view their full profile.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Zap className="w-4 h-4 text-nuvio-yellow" />
              <span className="text-xs font-black text-nuvio-yellow uppercase tracking-widest">
                {classmates.length} Total Scholars
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Classmates;
