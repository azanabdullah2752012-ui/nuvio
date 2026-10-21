import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, CheckSquare, Clock, Calendar, 
  Zap, Compass, Moon, ShieldCheck, Heart, 
  Volume2, Wind, Sliders, Sun
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import TactileStudyConsole from '../components/TactileStudyConsole';
import { soundEngine } from '../services/soundEngine';

const Landing = () => {
  const navigate = useNavigate();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleDemoAudio = () => {
    if (isPlayingAudio) {
      soundEngine.stop();
      setIsPlayingAudio(false);
    } else {
      soundEngine.play40HzBinaural(0.08);
      setIsPlayingAudio(true);
    }
  };

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
              NUVIO
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#e5e1d5] text-[#827f76] rounded bg-[#f5f3ec] uppercase font-bold">
              Universal Life OS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-[#52504a]">
            <a href="#circadian" className="hover:text-black transition-colors">01 / Circadian Stream</a>
            <a href="#radar" className="hover:text-black transition-colors">02 / Energy Radar</a>
            <a href="#audio" className="hover:text-black transition-colors">03 / 40Hz Audio Lab</a>
          </nav>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Open Life Desk</span>
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
              <span>OFFLINE BIOLOGICAL ARCHITECTURE // ZERO AI SLOP</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#1a1917] mb-6 leading-[1.05]">
              Stop using to-do lists. <br />
              <span className="text-[#1b3b2b] italic">Run on biological rhythm.</span>
            </h1>

            <p className="max-w-xl text-[#52504a] text-base md:text-lg font-normal leading-relaxed mb-8">
              A real life operating system built around how the human brain actually focuses: 90-minute ultradian bouts, built-in 40Hz gamma beats, an interactive Wheel of Life radar, and Cal Newport's 60-second shutdown ritual.
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mb-10 font-mono text-left">
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">TIMELINE</div>
                <div className="text-xs font-serif font-bold text-[#1b3b2b]">24H CIRCADIAN STREAM</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">RADAR</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">CANVAS WHEEL OF LIFE</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">AUDIO LAB</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">40HZ BINAURAL BEATS</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Life Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={toggleDemoAudio}
                className="w-full sm:w-auto px-6 py-4 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white text-[#1a1917] font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-[#1b3b2b]" />
                <span>{isPlayingAudio ? 'Stop 40Hz Audio' : 'Test 40Hz Gamma Audio'}</span>
              </button>
            </div>
          </div>

          {/* Right: Signature Tactile Focus Resonator */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <TactileStudyConsole />
          </div>

        </div>
      </section>

      {/* ── SECTION 01: THE 24H CIRCADIAN STREAM ──────────────────── */}
      <section id="circadian" className="relative z-10 border-t border-[#e5e1d5] bg-[#f4f1ea]/50 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
              01 // CHRONOBIOLOGY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917]">
              The 24-Hour Circadian Stream
            </h2>
            <p className="text-xs sm:text-sm text-[#52504a] max-w-xl">
              Linear to-do lists dump 50 tasks in your face. NUVIO groups your day into circadian biological gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8a4b16]/10 text-[#8a4b16] flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                06:30 Sunlight & Cortisol Anchor
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Log natural sky viewing, 500ml water, and delay caffeine 90 minutes so adenosine clears naturally without an afternoon crash.
              </p>
            </div>

            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b3b2b]/10 text-[#1b3b2b] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                08:30 Maker Peak & The Daily Highlight
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Run your 90-minute ultradian bout exclusively on your #1 anchor task. Zero fragmented meetings during peak morning cognition.
              </p>
            </div>

            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#244e6b]/10 text-[#244e6b] flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                11:30 NSDR & Breath Pacer
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Downshift autonomic arousal with the animated Physiological Sigh breath pacer: two quick inhales through the nose, one extended exhale through the mouth.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: THE WHEEL OF LIFE RADAR ───────────────────── */}
      <section id="radar" className="relative z-10 border-t border-[#e5e1d5] bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
              02 // HOLISTIC RADAR CANVAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917]">
              Interactive Wheel of Life Radar
            </h2>
            <p className="text-xs sm:text-sm text-[#52504a] max-w-xl">
              An interactive 8-dimensional geometry canvas that catches hidden drag and generates 7-day rebalance prescriptions.
            </p>
          </div>

          <div className="p-8 border border-[#e5e1d5] rounded-3xl bg-[#faf9f6] flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-4 max-w-md">
              <div className="font-mono text-xs uppercase tracking-wider text-[#1b3b2b] font-bold">
                Dynamic Polygon Geometry
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1a1917]">
                Never let one pillar destroy your life.
              </h3>
              <p className="text-xs sm:text-sm text-[#52504a] leading-relaxed">
                Tune Craft, Vitality, Mind, Tribe, Finances, Environment, Play, and Purpose with live sliders. The radar reveals asymmetrical burnout patterns and tells you what to stop doing.
              </p>
              <button
                onClick={() => navigate('/wheel')}
                className="px-5 py-2.5 bg-[#1b3b2b] text-white font-mono text-xs uppercase font-bold rounded-xl"
              >
                Launch Radar Engine
              </button>
            </div>

            <div className="w-48 h-48 rounded-full border-4 border-[#1b3b2b]/20 bg-white flex items-center justify-center font-serif text-3xl font-bold text-[#1b3b2b] shadow-sm">
              88/100
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-[#e5e1d5] bg-[#fbfbfa] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-[#827f76]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-serif font-bold text-sm text-[#1a1917]">NUVIO LIFE OS</span>
            <span>—</span>
            <span>Biological cadence, 40Hz audio & life balance</span>
          </div>

          <div className="text-[11px]">
            No AI Slop • Real Web Audio • Pure Offline Performance
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
