import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, Clock, Calendar, ShieldCheck } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import TactileStudyConsole from '../components/TactileStudyConsole';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-[#1a1917] relative bg-[#fbfbfa] font-sans selection:bg-[#1b3b2b] selection:text-white">
      
      {/* Warm Parchment Background */}
      <AnimatedBackground />

      {/* ── TOP MASTHEAD ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#e5e1d5] bg-[#fbfbfa]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
            <span className="font-serif font-bold text-lg tracking-tight text-[#1a1917]">
              ACADEVANCE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#e5e1d5] text-[#827f76] rounded bg-[#f5f3ec] uppercase font-bold">
              Productivity Suite
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-[#52504a]">
            <a href="#features" className="hover:text-black transition-colors">01 / Core Tools</a>
            <a href="#workflow" className="hover:text-black transition-colors">02 / Study Flow</a>
          </nav>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <span>Open Workstation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left: Manifesto & Typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#e5e1d5] bg-white text-[10px] font-mono uppercase tracking-[0.15em] text-[#1b3b2b] mb-6 rounded-full shadow-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b3b2b]" />
              <span>OFFLINE-FIRST // MINIMALIST PRODUCTIVITY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#1a1917] mb-6 leading-[1.05]">
              Calm, Structured <br />
              <span className="text-[#1b3b2b] italic">Student Focus.</span>
            </h1>

            <p className="max-w-xl text-[#52504a] text-base md:text-lg font-normal leading-relaxed mb-8">
              A distraction-free productivity workstation built specifically for students. Organize your homework assignments, time-box focus sprints, and plan your academic calendar with clarity.
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mb-10 font-mono text-left">
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">TASKS</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">HOMEWORK QUEUE</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">CADENCE</div>
                <div className="text-xs font-serif font-bold text-[#1b3b2b]">POMODORO SPRINTS</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">PLANNING</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">ACADEMIC CALENDAR</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Signature Resonator Focal Artifact */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <TactileStudyConsole />
          </div>

        </div>
      </section>

      {/* ── SECTION 01: THREE ESSENTIAL TOOLS ─────────────────────── */}
      <section id="features" className="relative z-10 border-t border-[#e5e1d5] bg-white py-20 text-left">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1b3b2b] font-bold block mb-2">
              01 // CORE PRODUCTIVITY ARSENAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917] tracking-tight">
              Three Tools. Zero Clutter.
            </h2>
            <p className="text-[#52504a] text-sm mt-3 leading-relaxed">
              Every unnecessary social network, game mechanic, and bloated feature has been stripped away. You are left with only what directly improves your academic output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tool 1 */}
            <div className="p-8 border border-[#e5e1d5] bg-[#fbfbfa] rounded-2xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b]">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1a1917]">
                Tasks & Homework
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Log assignments by subject and deadline. Prioritize urgent tasks with clear visual cues and check off completed work.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="p-8 border border-[#e5e1d5] bg-[#fbfbfa] rounded-2xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1a1917]">
                Focus Interval Timer
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Structured 25-minute Pomodoro sprints and 50-minute deep work sessions with audio bell alerts to sustain cognitive stamina without burnout.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="p-8 border border-[#e5e1d5] bg-[#fbfbfa] rounded-2xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1a1917]">
                Academic Calendar
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Schedule study sessions, mock examinations, and project milestones in a clean monthly agenda with zero algorithmic distractions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#e5e1d5] bg-[#fbfbfa] py-12 text-xs font-mono text-[#827f76]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#1b3b2b] rounded-sm" />
            <span className="font-bold text-[#1a1917] font-serif text-sm">ACADEVANCE</span>
            <span>· Student Productivity Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <span>OFFLINE LOCAL STORAGE READY</span>
            <span>·</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#1b3b2b] hover:underline font-bold uppercase"
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
