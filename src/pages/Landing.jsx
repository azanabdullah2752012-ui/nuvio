import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, CheckCircle2,
  BookOpen, Star, Shield, TrendingUp, ChevronRight
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import SignatureStudyNexus from '../components/SignatureStudyNexus';

/* ── Animated counter hook (graceful fallback if reduced motion) ─ */
const useCounter = (target, duration = 1600, start = false) => {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!start) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
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

/* ── Stat Card (Parallel baseline anchors & content visible by default) ── */
const StatCard = ({ value, suffix = '', label, sub, started }) => {
  const count = useCounter(value, 1600, started);
  return (
    <div className="nv-card flex flex-col justify-between p-6 h-full border border-white/[0.07] bg-slate-950/60 rounded-2xl">
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
          {count.toLocaleString()}{suffix}
        </span>
      </div>
      <div className="text-[12px] font-bold text-white uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-[11px] text-text-muted font-medium mt-auto">
        {sub}
      </div>
    </div>
  );
};

/* ── Bespoke Feature Card (Bespoke marks, zero kitchen-sink clutter) ── */
const FeatureCard = ({ number, title, desc, tag, accentColor }) => (
  <div className="nv-card flex flex-col justify-between p-7 rounded-2xl border border-white/[0.07] bg-slate-950/50 transition-colors duration-200 hover:border-nuvio-purple-500/40">
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted font-mono">
          PHASE // {number}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10"
          style={{ color: accentColor, background: `${accentColor}10` }}
        >
          {tag}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed font-normal">
        {desc}
      </p>
    </div>
    <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-semibold text-text-muted">
      <span>CBSE Grade 9 Aligned</span>
      <span className="text-white flex items-center gap-1">
        Active Matrix <ChevronRight className="w-3 h-3 text-nuvio-purple-400" />
      </span>
    </div>
  </div>
);

/* ── Main Landing Page ──────────────────────────────────────── */
const Landing = () => {
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      number: '01',
      title: 'Spaced Recall Engine',
      desc: 'Active retrieval algorithms dynamically schedule topic reinforcement at the precise biological inflection point of memory decay.',
      tag: 'Algorithmic',
      accentColor: '#06b6d4'
    },
    {
      number: '02',
      title: 'Multivariable StudyVerse',
      desc: 'Multiplayer boss encounters and cooperative curriculum raids mapped to real CBSE Math and Science problem sets.',
      tag: 'Game Theory',
      accentColor: '#a855f7'
    },
    {
      number: '03',
      title: 'Exhaustive CBSE Matrix',
      desc: 'Complete Chapter → Topic → Subtopic syllabus breakdown with interactive sandboxes, verified NCERT proofs, and formula vaults.',
      tag: 'Curriculum',
      accentColor: '#10b981'
    },
    {
      number: '04',
      title: 'State Telemetry & Rank',
      desc: 'Real-time telemetry tracking XP burn rates, streak integrity, focus intervals, and competitive ERA tier standings.',
      tag: 'Analytics',
      accentColor: '#f59e0b'
    },
    {
      number: '05',
      title: 'Focus Staging Protocol',
      desc: 'Binaural soundscapes and Pomodoro intervals structured to minimize cognitive switching fatigue during rigorous study blocks.',
      tag: 'Cognition',
      accentColor: '#3b82f6'
    },
    {
      number: '06',
      title: 'Peer Guild Networks',
      desc: 'Secure local study channels, peer accountability groups, and shared flashcard repositories for continuous collaboration.',
      tag: 'Social',
      accentColor: '#f43f5e'
    }
  ];

  return (
    <div className="min-h-screen text-text-primary overflow-x-hidden relative" style={{ background: '#07080b' }}>

      {/* Authored continuous background plate with directional top-left rake & micro-grain */}
      <AnimatedBackground variant="hero" />

      {/* ── TOP NAV ───────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto border-b border-white/[0.06] bg-[#07080b]/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black uppercase tracking-wider text-white">
            ACADEVANCE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-text-muted">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <button onClick={() => navigate('/curriculum')} className="hover:text-white transition-colors">Curriculum</button>
          <button onClick={() => navigate('/study-verse')} className="hover:text-white transition-colors">StudyVerse</button>
          <button onClick={() => navigate('/leaderboard')} className="hover:text-white transition-colors">Rankings</button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="nv-btn-primary"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* ── COMPOSED ASYMMETRIC HERO (Fold Ownership: 1440x900 desktop deliberate framing) ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(86vh-80px)]">
          
          {/* Left Hero Column: Brand Narrative & Confident Direct Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Offline Engine Active // CBSE Grade 9</span>
            </div>

            {/* Editorial Signature Display H1 (Cabinet Grotesk) */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.94] mb-6 text-white">
              The autonomous <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nuvio-purple-400 via-white to-nuvio-cyan">
                study matrix.
              </span>
            </h1>

            {/* Unambiguous High-Density Copy */}
            <p className="max-w-xl text-text-secondary text-base md:text-lg font-normal leading-relaxed mb-8">
              Acadevance synthesizes spaced repetition, syllabus mastery, and game-theoretic challenge loops into a single local-first learning workstation. Zero external server lag. Zero barrier to entry.
            </p>

            {/* Confident Action Buttons (WCAG AA Contrast) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={() => navigate('/dashboard')}
                className="nv-btn-primary text-xs"
              >
                <span>Enter Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/curriculum')}
                className="nv-btn-secondary text-xs"
              >
                <BookOpen className="w-4 h-4 text-nuvio-cyan" />
                <span>Explore CBSE Hub</span>
              </button>
            </div>

            {/* Trustmarks with Real Metrics */}
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-text-muted pt-2 border-t border-white/[0.06] w-full">
              <span className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Local Persistence
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                NCERT Certified
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <Shield className="w-3.5 h-3.5 text-nuvio-cyan" />
                Zero Latency
              </span>
            </div>
          </div>

          {/* Right Hero Column: Signature Focal Artifact (Mathematical Study Nexus) */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="w-full max-w-[520px] rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-xl p-2 relative shadow-2xl">
              <SignatureStudyNexus />
            </div>
          </div>

        </div>
      </main>

      {/* ── PARALLEL STATS LEDGER ─────────────────────────────── */}
      <section ref={statsRef} className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={24000} suffix="+" label="Active Scholars" sub="Global academic cohorts" started={countersStarted} />
          <StatCard value={180000} suffix="+" label="Questions Cleared" sub="Spaced recall cards verified" started={countersStarted} />
          <StatCard value={94} suffix="%" label="Syllabus Retention" sub="Standardized 30-day recall" started={countersStarted} />
          <StatCard value={100} suffix="%" label="Offline Availability" sub="Zero external database dependency" started={countersStarted} />
        </div>
      </section>

      {/* ── STRUCTURED FEATURES GRID ───────────────────────────── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-nuvio-purple-400 font-mono mb-2">
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Engineered for academic retention.
            </h2>
          </div>
          <p className="max-w-md text-text-muted text-sm leading-relaxed">
            Every module in Acadevance is constructed around verified cognitive psychology principles rather than passive consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM ACTION BANNER ───────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="nv-card p-10 md:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/60 to-nuvio-purple-950/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-nuvio-cyan block mb-2">
              INSTANT LOCAL INITIALIZATION
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-3">
              Ready to begin your study block?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Open your dashboard to immediately begin active recall flashcards, timed focus sessions, and curriculum questlines.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="nv-btn-primary text-xs flex-shrink-0"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-6 bg-[#07080b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="font-black uppercase tracking-wider text-xs text-text-secondary">
              Acadevance Systems
            </span>
          </div>
          <div className="text-[11px] font-medium text-text-muted">
            Designed under pols.dev anti-slop & BraveBrand craftsmanship standards.
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
            <button onClick={() => navigate('/curriculum')} className="hover:text-white transition-colors">Curriculum</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">App</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
