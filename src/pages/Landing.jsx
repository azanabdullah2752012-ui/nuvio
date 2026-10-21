import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Clock, Library, Compass, ArrowUpRight, GraduationCap } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import TactileStudyConsole from '../components/TactileStudyConsole';

const CURRICULUM_DATA = {
  math: [
    { code: 'M9.01', title: 'Number Systems', topics: 'Real Numbers, Irrational Proofs, Laws of Exponents', hours: '12 Hours' },
    { code: 'M9.02', title: 'Polynomials', topics: 'Factorization, Remainder Theorem, Algebraic Identities', hours: '16 Hours' },
    { code: 'M9.03', title: 'Coordinate Geometry', topics: 'Cartesian Plane, Quadrants, Point Plotting', hours: '8 Hours' },
    { code: 'M9.06', title: 'Lines and Angles', topics: 'Axioms, Parallel Lines, Angle Sum Property', hours: '14 Hours' },
    { code: 'M9.07', title: 'Triangles', topics: 'Congruence Criteria (SAS, ASA, SSS, RHS), Inequalities', hours: '18 Hours' },
  ],
  science: [
    { code: 'S9.01', title: 'Matter in Our Surroundings', topics: 'States of Matter, Evaporation, Latent Heat', hours: '10 Hours' },
    { code: 'S9.02', title: 'Is Matter Around Us Pure', topics: 'Colloids, Suspensions, Separation Techniques', hours: '12 Hours' },
    { code: 'S9.03', title: 'Atoms and Molecules', topics: 'Laws of Chemical Combination, Mole Concept', hours: '18 Hours' },
    { code: 'S9.07', title: 'Motion', topics: 'Distance, Velocity, Equations of Motion, Acceleration', hours: '16 Hours' },
    { code: 'S9.08', title: 'Force and Laws of Motion', topics: "Newton's 3 Laws, Momentum, Conservation", hours: '14 Hours' },
  ],
  social: [
    { code: 'SS9.01', title: 'The French Revolution', topics: 'Estates General, Reign of Terror, Abolition of Slavery', hours: '12 Hours' },
    { code: 'SS9.02', title: 'India: Size and Location', topics: 'Latitudes, Longitudes, Standard Meridian, Neighbors', hours: '8 Hours' },
    { code: 'SS9.03', title: 'What is Democracy? Why Democracy?', topics: 'Constitutional Features, Democratic Rationale', hours: '10 Hours' },
    { code: 'SS9.04', title: 'The Story of Village Palampur', topics: 'Factors of Production, Farming & Capital Organization', hours: '8 Hours' },
  ]
};

const Landing = () => {
  const [activeSubject, setActiveSubject] = useState('math');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-[#1a1917] relative bg-[#fbfbfa] font-sans selection:bg-[#1b3b2b] selection:text-white">
      
      {/* Warm Parchment Background with Subtle Illumination */}
      <AnimatedBackground />

      {/* ── TOP MASTHEAD ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#e5e1d5] bg-[#fbfbfa]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
            <span className="font-display font-bold text-lg tracking-tight text-[#1a1917]">
              ACADEVANCE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#e5e1d5] text-zinc-500 rounded bg-[#f5f3ec]">
              CLASS 9 CBSE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-zinc-600">
            <a href="#focus" className="hover:text-black transition-colors">01 / Focus Cadence</a>
            <a href="#syllabus" className="hover:text-black transition-colors">02 / Syllabus Matrix</a>
            <a href="#pedagogy" className="hover:text-black transition-colors">03 / Active Recall</a>
          </nav>

          <button
            onClick={() => navigate('/dashboard')}
            className="nv-btn-primary"
          >
            <span>Open Workstation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left: Academic Manifesto & Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-[#e5e1d5] bg-white text-[11px] font-mono uppercase tracking-[0.15em] text-[#1b3b2b] mb-6 rounded shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b3b2b]" />
              <span>OFFLINE-FIRST // CBSE ACADEMIC DISCIPLINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-[#1a1917] mb-6 leading-[1.05]">
              The Scholar’s <br />
              <span className="text-[#1b3b2b] italic">Reading Room.</span>
            </h1>

            <p className="max-w-xl text-zinc-600 text-base md:text-lg font-normal leading-relaxed mb-8">
              Designed for secondary students who approach syllabus mastery with calm, deliberate craft. Structured NCERT chapter breakdowns, evidence-backed spaced repetition, and tactile cognitive focus pacing.
            </p>

            {/* Academic Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-10 font-mono text-left">
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">CURRICULUM</div>
                <div className="text-xs font-bold text-[#1a1917]">NCERT CLASS 9</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">METHOD</div>
                <div className="text-xs font-bold text-[#1b3b2b]">ACTIVE RECALL</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">INTERVAL</div>
                <div className="text-xs font-bold text-[#162744]">LEITNER BOXES</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">STATE</div>
                <div className="text-xs font-bold text-zinc-700">100% OFFLINE</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="nv-btn-primary w-full sm:w-auto text-sm px-8 py-3.5 shadow-md"
              >
                <span>Enter Academic Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/curriculum')}
                className="nv-btn-secondary w-full sm:w-auto text-sm px-6 py-3.5"
              >
                <span>Browse Syllabus Outline</span>
              </button>
            </div>
          </div>

          {/* Right: Signature Resonator Focal Artifact */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <TactileStudyConsole />
          </div>

        </div>
      </section>

      {/* ── SECTION 02: SYLLABUS DIRECTORY ─────────────────────── */}
      <section id="syllabus" className="relative z-10 border-t border-[#e5e1d5] bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1b3b2b] font-bold block mb-2">
                02 // OFFICIAL NCERT SYLLABUS INDEX
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1a1917] tracking-tight">
                Class 9 Curriculum Directory
              </h2>
            </div>

            {/* Subject Selector Tabs */}
            <div className="flex p-1 bg-[#f4f1ea] border border-[#e5e1d5] rounded-lg">
              {[
                { id: 'math', label: 'Mathematics' },
                { id: 'science', label: 'Science' },
                { id: 'social', label: 'Social Science' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubject(tab.id)}
                  className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                    activeSubject === tab.id
                      ? 'bg-white text-[#1b3b2b] font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapters Table Matrix */}
          <div className="border border-[#e5e1d5] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-[#f8f6f0] border-b border-[#e5e1d5] font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-3 px-6">Unit Code</th>
                  <th className="py-3 px-6">Chapter Title</th>
                  <th className="py-3 px-6 hidden sm:table-cell">Key Conceptual Focus</th>
                  <th className="py-3 px-6 text-right">Pacing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebe7dc] bg-white">
                {CURRICULUM_DATA[activeSubject].map((item) => (
                  <tr key={item.code} className="hover:bg-[#fcfbf7] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-[#1b3b2b] font-bold">{item.code}</td>
                    <td className="py-4 px-6 font-semibold text-[#1a1917]">{item.title}</td>
                    <td className="py-4 px-6 text-zinc-600 text-xs hidden sm:table-cell">{item.topics}</td>
                    <td className="py-4 px-6 font-mono text-xs text-zinc-500 text-right">{item.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── SECTION 03: PEDAGOGY & PRINCIPLES ──────────────────── */}
      <section id="pedagogy" className="relative z-10 border-t border-[#e5e1d5] bg-[#fbfbfa] py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1b3b2b] font-bold block mb-2">
              03 // COGNITIVE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1a1917] tracking-tight">
              Three Pillars of Academic Retention
            </h2>
            <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
              Every tool inside Acadevance is grounded in proven cognitive science research to transform passive reading into permanent conceptual mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#e5e1d5] bg-white rounded-xl shadow-xs space-y-4">
              <span className="font-mono text-xs font-bold text-[#1b3b2b] bg-[#f4f7f5] px-2.5 py-1 rounded">
                PILLAR 01
              </span>
              <h3 className="font-display font-bold text-xl text-[#1a1917]">
                Active Memory Retrieval
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                Testing yourself by retrieving information from memory actively builds durable neural circuits rather than the false confidence of re-reading textbook chapters.
              </p>
            </div>

            <div className="p-8 border border-[#e5e1d5] bg-white rounded-xl shadow-xs space-y-4">
              <span className="font-mono text-xs font-bold text-[#162744] bg-[#f0f4fa] px-2.5 py-1 rounded">
                PILLAR 02
              </span>
              <h3 className="font-display font-bold text-xl text-[#1a1917]">
                Leitner Spaced Repetition
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                Cards migrate between compounding intervals—1 day, 3 days, 7 days, and 14 days—systematically intercepting the Ebbinghaus forgetting curve before decay occurs.
              </p>
            </div>

            <div className="p-8 border border-[#e5e1d5] bg-white rounded-xl shadow-xs space-y-4">
              <span className="font-mono text-xs font-bold text-[#a46a29] bg-[#faf3e8] px-2.5 py-1 rounded">
                PILLAR 03
              </span>
              <h3 className="font-display font-bold text-xl text-[#1a1917]">
                Pomodoro Focus Sprints
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                Time-boxed 25-minute cognitive sprints followed by strict 5-minute pauses maintain peak cerebral glucose levels and eliminate academic burnout.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#e5e1d5] bg-white py-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#1b3b2b] rounded-sm" />
            <span className="font-bold text-[#1a1917] font-display text-sm tracking-tight">ACADEVANCE</span>
            <span>· CBSE Class 9 Academic Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <span>OFFLINE PERSISTENCE READY</span>
            <span>·</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#1b3b2b] hover:underline font-bold"
            >
              Launch Dashboard →
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;