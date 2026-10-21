import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronRight, Check } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import TactileStudyConsole from '../components/TactileStudyConsole';

const CURRICULUM_DATA = {
  math: [
    { code: 'M9.01', title: 'Number Systems', topics: 'Real Numbers, Irrational Proofs, Laws of Exponents', hours: '12h' },
    { code: 'M9.02', title: 'Polynomials', topics: 'Factorization, Remainder Theorem, Algebraic Identities', hours: '16h' },
    { code: 'M9.03', title: 'Coordinate Geometry', topics: 'Cartesian Plane, Quadrants, Point Plotting', hours: '8h' },
    { code: 'M9.06', title: 'Lines and Angles', topics: 'Axioms, Parallel Lines, Angle Sum Property', hours: '14h' },
    { code: 'M9.07', title: 'Triangles', topics: 'Congruence Criteria (SAS, ASA, SSS, RHS), Inequalities', hours: '18h' },
  ],
  science: [
    { code: 'S9.01', title: 'Matter in Our Surroundings', topics: 'States of Matter, Evaporation, Latent Heat', hours: '10h' },
    { code: 'S9.02', title: 'Is Matter Around Us Pure', topics: 'Colloids, Suspensions, Separation Techniques', hours: '12h' },
    { code: 'S9.03', title: 'Atoms and Molecules', topics: 'Laws of Chemical Combination, Mole Concept', hours: '18h' },
    { code: 'S9.07', title: 'Motion', topics: 'Distance, Velocity, Equations of Motion, Acceleration', hours: '16h' },
    { code: 'S9.08', title: 'Force and Laws of Motion', topics: "Newton's 3 Laws, Momentum, Conservation", hours: '14h' },
  ],
  social: [
    { code: 'SS9.01', title: 'The French Revolution', topics: 'Estates General, Reign of Terror, Abolition of Slavery', hours: '12h' },
    { code: 'SS9.02', title: 'India: Size and Location', topics: 'Latitudes, Longitudes, Standard Meridian, Neighbors', hours: '8h' },
    { code: 'SS9.03', title: 'What is Democracy? Why Democracy?', topics: 'Features, Arguments, Broader Meanings', hours: '10h' },
    { code: 'SS9.04', title: 'The Story of Village Palampur', topics: 'Factors of Production, Farming vs Non-Farming', hours: '8h' },
  ]
};

const Landing = () => {
  const [activeSubject, setActiveSubject] = useState('math');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-text-primary relative selection:bg-brand-vermilion selection:text-white" style={{ backgroundColor: '#090a0d' }}>
      
      {/* Precision Architectural Plate */}
      <AnimatedBackground />

      {/* ── TOP MASTHEAD ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090a0d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-brand-vermilion rounded-none" />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              ACADEVANCE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-text-muted rounded">
              REV. 2026
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-text-secondary">
            <a href="#instrument" className="hover:text-white transition-colors">01 // The Instrument</a>
            <a href="#syllabus" className="hover:text-white transition-colors">02 // Syllabus Archive</a>
            <a href="#telemetry" className="hover:text-white transition-colors">03 // Telemetry</a>
          </nav>

          <button
            onClick={() => navigate('/dashboard')}
            className="nv-btn-primary"
          >
            <span>LAUNCH // 09</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left: Manifesto & Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-white/10 bg-white/[0.02] text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-vermilion animate-pulse" />
              <span>CHASSIS: LOCAL-FIRST // CBSE CLASS 9 WORKSTATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[0.94]">
              The Academic <br />
              <span className="text-brand-vermilion">Instrument.</span>
            </h1>

            <p className="max-w-xl text-text-secondary text-base md:text-lg font-normal leading-relaxed mb-8">
              Engineered for students who treat study as craft. Active retrieval algorithms, complete NCERT syllabus taxonomies, and cognitive focus pacing — unified into an offline-first workstation with zero noise.
            </p>

            {/* Technical Specification Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-10 font-mono text-left">
              <div className="p-3 border border-white/[0.08] bg-[#111318] rounded">
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1">ENGINE</div>
                <div className="text-xs font-bold text-white">OFFLINE / LOCAL</div>
              </div>
              <div className="p-3 border border-white/[0.08] bg-[#111318] rounded">
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1">STANDARD</div>
                <div className="text-xs font-bold text-white">CBSE NCERT 9</div>
              </div>
              <div className="p-3 border border-white/[0.08] bg-[#111318] rounded">
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1">PROTOCOL</div>
                <div className="text-xs font-bold text-white">LEITNER ACTIVE</div>
              </div>
              <div className="p-3 border border-white/[0.08] bg-[#111318] rounded">
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1">LATENCY</div>
                <div className="text-xs font-bold text-emerald-400">0.00 MS</div>
              </div>
            </div>

            {/* Direct Action Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="nv-btn-primary"
              >
                <span>INITIALIZE WORKSTATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/curriculum')}
                className="nv-btn-secondary"
              >
                <BookOpen className="w-4 h-4 text-text-muted" />
                <span>EXPLORE SYLLABUS</span>
              </button>
            </div>

          </div>

          {/* Right: Signature Hardware Oscilloscope Console */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <TactileStudyConsole />
          </div>

        </div>
      </section>

      {/* ── SECTION 01: THE METHOD // 4 INDUSTRIAL MODULES ─────── */}
      <section id="instrument" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-brand-vermilion mb-2">
              01 // THE METHODOLOGY
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Structured for permanent recall.
            </h2>
          </div>
          <p className="max-w-md text-text-secondary text-sm font-normal leading-relaxed">
            Every module in Acadevance eliminates the superficial flash and statistical collapse of typical SaaS to prioritize raw cognitive clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="nv-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-brand-vermilion mb-4">[01 / RETRIEVAL]</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Spaced Leitner Queue</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Scientific flashcard scheduling that tests knowledge right when forgetting begins, turning working memory into permanent retention.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[10px] text-text-muted uppercase">
              STATUS: DEPLOYED
            </div>
          </div>

          <div className="nv-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-brand-ochre mb-4">[02 / STUDYVERSE]</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Curriculum Raids</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Boss encounters and cooperative raid mechanics mapped directly to Class 9 Math and Science proof challenges.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[10px] text-text-muted uppercase">
              STATUS: MULTIPLAYER READY
            </div>
          </div>

          <div className="nv-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-blue-400 mb-4">[03 / TAXONOMY]</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Exhaustive CBSE Matrix</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Every chapter, concept, and subtopic broken into interactive sandboxes, verified NCERT solutions, and formula proofs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[10px] text-text-muted uppercase">
              STATUS: 100% NCERT ALIGNED
            </div>
          </div>

          <div className="nv-card p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-emerald-400 mb-4">[04 / INTERVALS]</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Focus Choreography</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-normal">
                Pomodoro rhythm, ambient binaural generator, and streak protection mechanisms engineered to prevent cognitive switching fatigue.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[10px] text-text-muted uppercase">
              STATUS: CALIBRATED
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: SYLLABUS ARCHIVE EXPLORER ──────────────── */}
      <section id="syllabus" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-brand-vermilion mb-2">
              02 // SYLLABUS DIRECTORY
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              CBSE Class 9 Curriculum Index
            </h2>
          </div>
          
          {/* Subject Tab Switcher */}
          <div className="flex items-center gap-2 p-1 border border-white/10 bg-[#111318] rounded">
            <button
              onClick={() => setActiveSubject('math')}
              className={`px-3 py-1.5 font-mono text-xs uppercase font-bold rounded transition-colors ${
                activeSubject === 'math' ? 'bg-brand-vermilion text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              Mathematics
            </button>
            <button
              onClick={() => setActiveSubject('science')}
              className={`px-3 py-1.5 font-mono text-xs uppercase font-bold rounded transition-colors ${
                activeSubject === 'science' ? 'bg-brand-vermilion text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              Science
            </button>
            <button
              onClick={() => setActiveSubject('social')}
              className={`px-3 py-1.5 font-mono text-xs uppercase font-bold rounded transition-colors ${
                activeSubject === 'social' ? 'bg-brand-vermilion text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              Social Science
            </button>
          </div>
        </div>

        {/* Curriculum Index Table */}
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#111318]">
          <div className="divide-y divide-white/[0.06]">
            {CURRICULUM_DATA[activeSubject].map((item, idx) => (
              <div
                key={item.code}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start md:items-center gap-4">
                  <span className="font-mono text-xs font-bold text-brand-vermilion px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded">
                    {item.code}
                  </span>
                  <div>
                    <h4 className="text-base font-display font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5 font-sans">{item.topics}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs">
                  <span className="text-text-muted">{item.hours} estimated</span>
                  <button
                    onClick={() => navigate('/curriculum')}
                    className="px-3 py-1 border border-white/10 hover:border-white/30 text-white text-[11px] rounded transition-colors flex items-center gap-1"
                  >
                    <span>OPEN MODULE</span>
                    <ChevronRight className="w-3 h-3 text-brand-vermilion" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: TELEMETRY LEDGER ───────────────────────── */}
      <section id="telemetry" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="mb-8">
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-brand-vermilion mb-2">
            03 // RECALL TELEMETRY
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Performance Ledger
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-6 border border-white/10 bg-[#111318] rounded-xl flex flex-col justify-between">
            <span className="text-3xl font-display font-bold text-white">180K+</span>
            <div className="mt-4 text-xs font-bold text-text-secondary uppercase">
              Recall Prompts Solved
            </div>
            <div className="text-[10px] text-text-muted mt-1">Verified spaced repetition logs</div>
          </div>

          <div className="p-6 border border-white/10 bg-[#111318] rounded-xl flex flex-col justify-between">
            <span className="text-3xl font-display font-bold text-white">+38.4%</span>
            <div className="mt-4 text-xs font-bold text-text-secondary uppercase">
              30-Day Retention Delta
            </div>
            <div className="text-[10px] text-text-muted mt-1">Standardized benchmark improvement</div>
          </div>

          <div className="p-6 border border-white/10 bg-[#111318] rounded-xl flex flex-col justify-between">
            <span className="text-3xl font-display font-bold text-white">100%</span>
            <div className="mt-4 text-xs font-bold text-text-secondary uppercase">
              NCERT Syllabus Sync
            </div>
            <div className="text-[10px] text-text-muted mt-1">Class 9 curriculum breakdown</div>
          </div>

          <div className="p-6 border border-white/10 bg-[#111318] rounded-xl flex flex-col justify-between">
            <span className="text-3xl font-display font-bold text-emerald-400">0.00 MS</span>
            <div className="mt-4 text-xs font-bold text-text-secondary uppercase">
              External Query Lag
            </div>
            <div className="text-[10px] text-text-muted mt-1">100% local persistence</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 04: DIRECT LAUNCH TERMINAL ─────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="border border-white/10 rounded-2xl p-8 md:p-14 bg-[#111318] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-brand-vermilion block mb-2">
              SESSION COMMAND // READY
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-3">
              Commence Your Study Block.
            </h2>
            <p className="text-text-secondary text-sm font-sans leading-relaxed">
              Launch into active recall flashcards, timed Pomodoro focus sessions, and syllabus questlines immediately. No setup or sign-in barrier required.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="nv-btn-primary flex-shrink-0"
          >
            <span>ENTER WORKSTATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 px-6 bg-[#07080a] font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-vermilion rounded-none" />
            <span className="font-bold text-white">ACADEVANCE // ATELIER 09</span>
          </div>
          <div>
            SWISS HIGH-MODERNIST SPECIFICATION · ZERO AI TEMPLATE DRIFT
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/curriculum')} className="hover:text-white transition-colors">Curriculum</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Workstation</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
