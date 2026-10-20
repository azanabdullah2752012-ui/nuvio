import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, Globe, Users, Zap, CheckCircle2,
  Sparkles, Trophy, Brain, Target,
  BookOpen, Star, Shield, TrendingUp, Gamepad2, ChevronRight,
  Flame, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

/* ── Animated counter hook ─────────────────────────────────── */
const useCounter = (target, duration = 2000, start = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
};

/* ── Floating glass stat card ───────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, color, delay, started }) => {
  const count = useCounter(value, 2000, started);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="nv-card flex flex-col items-center gap-2 p-5 min-w-[140px]"
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="nv-stat-number text-3xl font-black">{count.toLocaleString()}+</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted text-center leading-tight">{label}</div>
    </motion.div>
  );
};

/* ── Feature card ───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="nv-card group cursor-default p-6"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} transition-transform duration-300 group-hover:scale-110`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-white font-black uppercase tracking-tight text-base mb-2">{title}</h3>
    <p className="text-text-muted text-sm font-medium leading-relaxed">{desc}</p>
  </motion.div>
);

/* ── Scrolling badge ticker ──────────────────────────────────── */
const BadgeTicker = () => {
  const badges = [
    '🔥 XP System', '⚡ Boss Raids', '🧠 Active Recall', '🎯 Spaced Repetition',
    '🏆 Leaderboards', '🎮 StudyVerse', '📚 CBSE Curriculum', '🚀 Journey Map',
    '💎 Seasonal Pass', '🌙 Focus Timer', '📝 Essay Forge', '🔔 Daily Missions'
  ];
  return (
    <div className="relative w-full overflow-hidden py-3 my-8">
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(to right, #020308, transparent)' }} />
      <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(to left, #020308, transparent)' }} />
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: [0, -1800] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...badges, ...badges].map((b, i) => (
          <span key={i} className="nv-pill px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0">
            {b}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ── Main Landing Page ──────────────────────────────────────── */
const Landing = () => {
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCountersStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Brain, title: 'Active Recall', desc: 'Quest-based flashcard journeys that encode concepts deeply into long-term memory.', color: 'bg-nuvio-purple-500/90', delay: 0.3 },
    { icon: Gamepad2, title: 'StudyVerse', desc: 'A multiplayer universe with boss raids, trivia battles, and cooperative challenges.', color: 'bg-nuvio-cyan/90', delay: 0.35 },
    { icon: Target, title: 'Spaced Repetition', desc: 'Leitner box algorithm that schedules reviews at the scientifically optimal moment.', color: 'bg-nuvio-blue/90', delay: 0.4 },
    { icon: TrendingUp, title: 'XP & Levels', desc: 'Every task, quiz, and session awards XP, pushing you up a global ranking ladder.', color: 'bg-nuvio-green/90', delay: 0.45 },
    { icon: BookOpen, title: 'CBSE Curriculum', desc: 'Full Chapter → Topic → Subtopic breakdown for all core 9th grade subjects.', color: 'bg-nuvio-yellow/90', delay: 0.5 },
    { icon: Trophy, title: 'Leaderboards', desc: 'Compete with peers school-wide and globally. Rise through the ERA rankings.', color: 'bg-nuvio-red/90', delay: 0.55 },
  ];

  return (
    <div className="min-h-screen text-text-primary overflow-x-hidden relative" style={{ background: 'var(--bg-base)' }}>

      {/* Rich animated background for landing */}
      <AnimatedBackground variant="hero" />

      {/* Extra hero-specific floating shapes */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '15%', right: '8%',
            width: 200, height: 200, opacity: 0.04,
            border: '1px solid rgba(168,85,247,0.8)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '20%', right: '10%',
            width: 120, height: 120, opacity: 0.06,
            border: '1px solid rgba(6,182,212,0.8)',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '60%', left: '5%',
            width: 80, height: 80, opacity: 0.05,
            background: 'rgba(236,72,153,0.4)',
            borderRadius: '16px',
            transform: 'rotate(45deg)',
          }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '20%', right: '15%',
            width: 60, height: 60, opacity: 0.06,
            border: '2px solid rgba(168,85,247,0.6)',
            borderRadius: '12px',
          }}
        />
      </div>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto"
        style={{
          background: 'rgba(2, 3, 8, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}>
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter"
                style={{ background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Acadevance
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
          {['Features', 'Games', 'Curriculum', 'Leaderboard'].map(l => (
            <a key={l} href="#" className="hover:text-text-primary transition-colors duration-200">{l}</a>
          ))}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="nv-btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
        >
          <span>Launch App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-16 flex flex-col items-center text-center">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="nv-pill inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-nuvio-green animate-pulse" />
          StudyVerse 2.0 — Local Engine Active
          <ChevronRight className="w-3 h-3 opacity-60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-black uppercase tracking-tighter leading-[0.88] mb-8 nv-shimmer-text"
        >
          Study like it&apos;s<br />
          a video game
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="max-w-2xl text-text-secondary text-base md:text-lg font-medium leading-relaxed mb-12"
        >
          Acadevance transforms your study sessions into epic quests. Earn XP, battle in boss raids, 
          master CBSE curriculum, and climb global leaderboards — all in one local, instant platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-nuvio-purple-600 to-nuvio-blue hover:from-nuvio-purple-500 hover:to-nuvio-cyan text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-nuvio-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter Acadevance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/curriculum')}
            className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-nuvio-cyan" />
            <span>Curriculum Hub</span>
          </button>
        </motion.div>

        {/* Trustmarks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-6 flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" />Instant Offline Access</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" />100% Free & Open</span>
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-nuvio-cyan" />Zero External DB Lag</span>
        </motion.div>

        {/* Badge ticker */}
        <div className="w-full max-w-5xl mt-12">
          <BadgeTicker />
        </div>
      </main>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section ref={statsRef} className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard icon={Users} value={24000} label="Active Scholars" color="bg-nuvio-purple-500/80" delay={0.1} started={countersStarted} />
          <StatCard icon={Zap} value={180000} label="Quests Cleared" color="bg-nuvio-cyan/80" delay={0.2} started={countersStarted} />
          <StatCard icon={Trophy} value={94} label="Grade Avg Boost %" color="bg-nuvio-green/80" delay={0.3} started={countersStarted} />
          <StatCard icon={Star} value={49} label="Rating / 50" color="bg-nuvio-yellow/80" delay={0.4} started={countersStarted} />
        </motion.div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="nv-pill inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-4">
            Core Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Built for Academic Dominance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="nv-card nv-card-glow p-10 md:p-16"
        >
          <div className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4"
              style={{ background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to level up?
          </h2>
          <p className="text-text-muted text-base font-medium mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of students turning study time into the most productive and fun part of their day.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="nv-btn-primary mx-auto"
          >
            Launch Dashboard <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-text-muted text-[11px] font-black uppercase tracking-widest">
            Instant Local Access · Zero External Services Required
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}>
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="font-black uppercase tracking-tight text-sm text-text-muted">Acadevance</span>
          </div>
          <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest">
            © 2026 Acadevance. Built for learners.
          </p>
          <div className="flex items-center gap-4 text-text-muted text-[11px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
