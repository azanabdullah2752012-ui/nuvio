import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Play, Clock, Sparkles, Volume2, Shield } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

const Landing = () => {
  const navigate = useNavigate();
  const [demoChecked, setDemoChecked] = useState(false);
  const [demoHabit, setDemoHabit] = useState([true, true, false, true, false]);

  const handleToggleDemo = () => {
    soundEngine.playPop();
    setDemoChecked(!demoChecked);
  };

  const handleToggleHabit = (idx) => {
    soundEngine.playPop();
    const updated = [...demoHabit];
    updated[idx] = !updated[idx];
    setDemoHabit(updated);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#1d1d1f] font-sans selection:bg-[#1b3b2b] selection:text-white text-left">
      
      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-[#eceae3] bg-[#fbfbfa]/90 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b2b]" />
          <span className="font-serif font-bold text-lg tracking-tight text-[#1d1d1f]">
            NUVIO
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2 bg-[#1b3b2b] hover:bg-[#28553e] text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>Open Today</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 pt-20 sm:pt-28 pb-32 space-y-20">
        
        {/* Headline & Mission */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f3ef] border border-[#e8e6df] text-[11px] font-mono uppercase tracking-wider text-[#8e8d8a]">
            <span>Option A // Tactile Human Minimalism</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1d1d1f] tracking-tight leading-[1.1]">
            A calmer way to <br />
            <span className="text-[#1b3b2b] italic">live your days.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#545350] font-normal leading-relaxed">
            No endless guilt lists. No bloated databases or biological lecturing. Just the single most important task of your day, a quiet habit loop, and distraction-free zen focus.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 bg-[#1b3b2b] hover:bg-[#28553e] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>Start Your Day</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#8e8d8a] font-mono">
              100% Offline • Free & Private
            </span>
          </div>
        </div>

        {/* ── LIVE INTERACTIVE THINGS-3 SPECIMEN CARD ──────────────── */}
        <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#e5e3db] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between border-b border-[#f4f3ef] pb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-[#8e8d8a]">
              Interactive Specimen // Try clicking below
            </span>
            <span className="text-[11px] font-mono text-[#1b3b2b] bg-[#f4f7f4] px-2.5 py-0.5 rounded-full border border-[#1b3b2b]/20">
              Live Preview
            </span>
          </div>

          {/* The Big One Demo */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#c78216] font-bold flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span>Today's Big One</span>
            </div>

            <div 
              onClick={handleToggleDemo}
              className="p-4 rounded-2xl bg-[#fbfbfa] border border-[#e8e6df] flex items-center gap-3.5 cursor-pointer hover:border-[#1b3b2b] transition-all"
            >
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                  demoChecked
                    ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white'
                    : 'border-[#c7c5bc]'
                }`}
              >
                {demoChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <div className={`text-base sm:text-lg font-serif text-[#1d1d1f] ${
                demoChecked ? 'line-through text-[#8e8d8a]' : 'font-medium'
              }`}>
                Ship the core product architecture without distractions
              </div>
            </div>
          </div>

          {/* Habit Dots Demo */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8e8d8a] font-bold">
              Daily Anchors (Click to complete)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { emoji: '☀️', label: 'Morning Sun' },
                { emoji: '💧', label: '2L Water' },
                { emoji: '📖', label: '30m Read' },
                { emoji: '🏃', label: 'Workout' },
                { emoji: '🌙', label: 'Sleep 11pm' }
              ].map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleToggleHabit(i)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    demoHabit[i]
                      ? 'bg-[#f4f7f4] border-[#1b3b2b]/30 text-[#1b3b2b]'
                      : 'bg-[#fbfbfa] border-[#e8e6df] text-[#545350]'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>{h.emoji}</span>
                    <span className="text-[10px] font-mono font-bold">✓</span>
                  </div>
                  <div className="text-[11px] font-medium truncate mt-1">
                    {h.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── THE 3 CORE PILLARS (Why it feels good) ───────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="space-y-2">
            <div className="font-serif font-bold text-lg text-[#1d1d1f]">
              1. The Big One
            </div>
            <p className="text-xs text-[#545350] leading-relaxed">
              Never drown in 50 items again. Every morning highlights exactly ONE non-negotiable priority that makes today a win.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-serif font-bold text-lg text-[#1d1d1f]">
              2. Zen Focus
            </div>
            <p className="text-xs text-[#545350] leading-relaxed">
              One click drops your screen into pure stillness. Quiet timer, gentle rain or brown noise, and zero tabs pulling your attention.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-serif font-bold text-lg text-[#1d1d1f]">
              3. 20-Second Close
            </div>
            <p className="text-xs text-[#545350] leading-relaxed">
              When work ends, execute the 20-second shutdown. Pick tomorrow's Big One, shut your laptop, and enjoy your evening with zero guilt.
            </p>
          </div>
        </div>

      </main>

      {/* ── MINIMAL FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-[#eceae3] py-10 px-6 sm:px-12 text-xs font-mono text-[#8e8d8a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>NUVIO // Tactile Calm Productivity</div>
        <div>Zero tracking • Zero subscriptions • Pure craftsmanship</div>
      </footer>

    </div>
  );
};

export default Landing;
