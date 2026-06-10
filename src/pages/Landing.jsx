import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, Globe, Users, Zap, CheckCircle2,
  Mail, Lock, Loader2, Sparkles, Trophy, Brain, Target,
  BookOpen, Star, Shield, TrendingUp, Gamepad2, ChevronRight,
  Flame, Clock
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
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
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try { await authService.signInWithGoogle(); }
    catch (err) { console.error(err); setLoading(false); }
  };

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.onboarding_completed) navigate('/dashboard');
      else navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginAsDemo();
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Rotating hex shapes */}
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
          onClick={() => setShowLoginForm(true)}
          className="nv-btn-secondary px-5 py-2.5 text-xs"
        >
          Sign In
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
          StudyVerse Alpha 2.0 — Now Live
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
          master CBSE curriculum, and climb global leaderboards — all in one platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mb-8"
        >
          <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="w-full flex flex-col sm:flex-row gap-4">
            <GoogleAuthButton onClick={handleGoogleSignIn} disabled={loading} />
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-nuvio-purple-400" />
              <span>Explore Demo</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Dev bypass */}
        {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            onClick={() => {
              const devProfile = {
                id: 'dev-guest-id', email: 'azanabdullah27.5.2012@gmail.com',
                full_name: 'Dev Guest', avatar_emoji: '🛠️', level: 9, xp: 999,
                era_tokens: 5000, role: 'admin', grade_level: '9th',
                onboarding_completed: true, last_activity_date: new Date().toISOString()
              };
              localStorage.setItem('acadevance_user', JSON.stringify(devProfile));
              window.dispatchEvent(new CustomEvent('acadevance_auth_change', { detail: devProfile }));
              navigate('/dashboard');
            }}
            className="w-full max-w-md py-3.5 px-8 border border-nuvio-purple-500/40 bg-nuvio-purple-500/08 hover:bg-nuvio-purple-500/15 text-nuvio-purple-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            style={{ background: 'rgba(168,85,247,0.06)' }}
          >
            ⚡ Enter Developer Sandbox (Local Bypass)
          </motion.button>
        )}

        {/* Trustmarks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-6 flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" />No credit card</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" />100% free beta</span>
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-nuvio-cyan" />Secure auth</span>
        </motion.div>

        {/* Badge ticker */}
        <div className="w-full max-w-5xl mt-12">
          <BadgeTicker />
        </div>
      </main>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section ref={statsRef} className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="nv-divider mb-8 mx-auto max-w-xs" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3"
              style={{ background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Built for serious students
          </h2>
          <p className="text-text-muted text-sm font-medium">Numbers that speak for themselves</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center">
          <StatCard icon={Users} value={1200} label="Active Learners" color="bg-nuvio-purple-500/80" delay={0.1} started={countersStarted} />
          <StatCard icon={Zap} value={48000} label="XP Earned Today" color="bg-nuvio-yellow/80" delay={0.15} started={countersStarted} />
          <StatCard icon={Trophy} value={320} label="Boss Raids Won" color="bg-nuvio-cyan/80" delay={0.2} started={countersStarted} />
          <StatCard icon={Brain} value={9600} label="Flashcards Reviewed" color="bg-nuvio-green/80" delay={0.25} started={countersStarted} />
          <StatCard icon={Flame} value={87} label="Day Streak Record" color="bg-nuvio-red/80" delay={0.3} started={countersStarted} />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="nv-divider mb-8 mx-auto max-w-xs" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4"
              style={{ background: 'linear-gradient(135deg, #ffffff 30%, #67e8f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Everything you need
          </h2>
          <p className="text-text-muted text-sm font-medium max-w-lg mx-auto leading-relaxed">
            A complete academic ecosystem built around proven learning science and addictive game design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
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
            Join thousands of students already turning study time into the most productive — and fun — part of their day.
          </p>
          <button
            onClick={() => setShowLoginForm(true)}
            className="nv-btn-primary mx-auto"
          >
            Start for Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-text-muted text-[11px] font-black uppercase tracking-widest">
            No credit card required · Free during beta
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

      {/* ── LOGIN MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showLoginForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLoginForm(false)}
              className="absolute inset-0"
              style={{ background: 'rgba(2,3,8,0.85)', backdropFilter: 'blur(24px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              className="nv-card w-full max-w-md p-10 space-y-8 relative z-10"
            >
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter"
                    style={{ background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Welcome Back
                </h2>
                <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleCredentialLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="nv-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="nv-input pl-12"
                      placeholder="student@acadevance.app"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="nv-label">Password</label>
                    <button type="button" className="text-[10px] uppercase font-black text-nuvio-purple-400 hover:text-nuvio-purple-300">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="nv-input pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && <div className="text-nuvio-red text-[10px] font-black uppercase text-center">{error}</div>}

                <button type="submit" disabled={loading} className="nv-btn-primary w-full mt-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                </button>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-nuvio-purple-400" />
                  <span>Try Demo Account</span>
                </button>
              </form>

              <div className="nv-divider" />

              <div className="text-center">
                <button onClick={() => setShowLoginForm(false)}
                  className="text-xs font-black text-text-muted uppercase hover:text-text-primary transition-colors">
                  Back to Landing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
