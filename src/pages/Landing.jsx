import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, Clock, Calendar, Zap, Compass, Moon, ShieldCheck, Heart } from 'lucide-react';
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
              NUVIO
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#e5e1d5] text-[#827f76] rounded bg-[#f5f3ec] uppercase font-bold">
              Universal Life OS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-[#52504a]">
            <a href="#protocols" className="hover:text-black transition-colors">01 / Biological Protocols</a>
            <a href="#pillars" className="hover:text-black transition-colors">02 / The 4 Pillars</a>
            <a href="#shutdown" className="hover:text-black transition-colors">03 / Evening Shutdown</a>
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
              <span>CIRCADIAN PRODUCTIVITY // OFFLINE-FIRST ARCHITECTURE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#1a1917] mb-6 leading-[1.05]">
              Master Your Days with <br />
              <span className="text-[#1b3b2b] italic">Biological Cadence.</span>
            </h1>

            <p className="max-w-xl text-[#52504a] text-base md:text-lg font-normal leading-relaxed mb-8">
              A distraction-free operating system built for creators, professionals, and life optimizers. Grounded in the proven protocols of Dr. Andrew Huberman, Dan Koe, and Cal Newport: 90-minute ultradian focus bouts, 4 life pillars, and zero evening guilt.
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mb-10 font-mono text-left">
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">CADENCE</div>
                <div className="text-xs font-serif font-bold text-[#1b3b2b]">90M ULTRADIAN BOUTS</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">BALANCE</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">THE 4 LIFE PILLARS</div>
              </div>
              <div className="p-3.5 border border-[#e5e1d5] bg-white rounded-xl shadow-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#827f76] mb-1 font-bold">CLOSURE</div>
                <div className="text-xs font-serif font-bold text-[#1a1917]">60S SHUTDOWN RITUAL</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Life Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Signature Tactile Console */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <TactileStudyConsole />
          </div>

        </div>
      </section>

      {/* ── SECTION 01: BIOLOGICAL PROTOCOLS ─────────────────────── */}
      <section id="protocols" className="relative z-10 border-t border-[#e5e1d5] bg-[#f4f1ea]/50 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
              01 // SCIENTIFIC FOCUS ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917]">
              Built Around Human Neurobiology
            </h2>
            <p className="text-xs sm:text-sm text-[#52504a] max-w-xl">
              Generic to-do apps treat humans like infinite linear machines. NUVIO respects biological rhythms and neuroplasticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b3b2b]/10 text-[#1b3b2b] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                Huberman 90m Ultradian Bouts
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Concentration naturally operates on 90-minute waves. High-intensity execution followed by deliberate 15-minute panoramic rest or NSDR resets.
              </p>
            </div>

            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8a4b16]/10 text-[#8a4b16] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                Jake Knapp's Daily Highlight
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Stop drowning in 50-item task backlogs. Pick the single highest-leverage directive for your day and protect your morning Maker block.
              </p>
            </div>

            <div className="p-7 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3a354c]/10 text-[#3a354c] flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                Cal Newport Evening Shutdown
              </h3>
              <p className="text-xs text-[#52504a] leading-relaxed">
                Combat the Zeigarnik effect. A structured 60-second closing ritual that safekeeps incomplete work and allows genuine psychological freedom.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: THE 4 LIFE PILLARS ───────────────────────── */}
      <section id="pillars" className="relative z-10 border-t border-[#e5e1d5] bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
              02 // HOLISTIC LIFE BALANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917]">
              The 4 Non-Negotiable Pillars
            </h2>
            <p className="text-xs sm:text-sm text-[#52504a] max-w-xl">
              Dan Koe's universal framework: true sustainable achievement requires investing daily across all four dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 border border-[#e5e1d5] rounded-2xl bg-[#faf9f6] space-y-2">
              <div className="text-2xl">💼</div>
              <h3 className="font-serif font-bold text-base text-[#1a1917]">Craft & Leverage</h3>
              <p className="text-xs text-[#52504a]">
                High-leverage output, coding, writing, digital assets, and core business creation.
              </p>
            </div>

            <div className="p-6 border border-[#e5e1d5] rounded-2xl bg-[#faf9f6] space-y-2">
              <div className="text-2xl">⚡</div>
              <h3 className="font-serif font-bold text-base text-[#1a1917]">Vitality & Body</h3>
              <p className="text-xs text-[#52504a]">
                Morning sunlight, compound resistance, hydration, clean nutrition, and restorative sleep.
              </p>
            </div>

            <div className="p-6 border border-[#e5e1d5] rounded-2xl bg-[#faf9f6] space-y-2">
              <div className="text-2xl">🧠</div>
              <h3 className="font-serif font-bold text-base text-[#1a1917]">Mind & Clarity</h3>
              <p className="text-xs text-[#52504a]">
                Offline reading, stillness, NSDR, panoramic walks, and zero cheap dopamine.
              </p>
            </div>

            <div className="p-6 border border-[#e5e1d5] rounded-2xl bg-[#faf9f6] space-y-2">
              <div className="text-2xl">🤝</div>
              <h3 className="font-serif font-bold text-base text-[#1a1917]">Tribe & Connection</h3>
              <p className="text-xs text-[#52504a]">
                Family presence, deep friendships, undistracted meals, and meaningful relationships.
              </p>
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
            <span>Offline-first biological productivity</span>
          </div>

          <div className="text-[11px]">
            Calm, unbloated, distraction-free execution.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
