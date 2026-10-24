import React, { useState, useEffect } from 'react';
import { Volume2, Terminal, Sparkles, Activity } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

const UniversalHeader = () => {
  const [soundMode, setSoundMode] = useState('none');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cycleSound = () => {
    if (soundMode === 'none') {
      soundEngine.playRain(0.04);
      setSoundMode('rain');
    } else if (soundMode === 'rain') {
      soundEngine.playBrownNoise(0.05);
      setSoundMode('brown');
    } else if (soundMode === 'brown') {
      soundEngine.play40HzBinaural(0.07);
      setSoundMode('binaural');
    } else {
      soundEngine.stop();
      setSoundMode('none');
    }
  };

  return (
    <header className="sticky top-0 z-40 h-13 w-full border-b border-white/[0.08] bg-[#08090a]/90 backdrop-blur-md px-5 sm:px-8 flex items-center justify-between font-sans">
      {/* Left: Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
            KAISER<span className="text-zinc-500 font-mono text-xs font-normal">/</span>OS
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.08]">
          <span className="font-mono text-[11px] text-zinc-400">POLARIS HOUSE</span>
          <span className="text-zinc-600 font-mono">•</span>
          <span className="font-mono text-[11px] text-emerald-400">GCIS IX-C</span>
        </div>
      </div>

      {/* Right: Audio Engine & Clock */}
      <div className="flex items-center gap-3">
        {/* Ambient Sound Stream */}
        <button
          onClick={cycleSound}
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-1.5 ${
            soundMode !== 'none'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.15]'
          }`}
          title="Toggle ambient focus audio"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>
            {soundMode === 'none' ? 'Audio Off' : 
             soundMode === 'rain' ? '🌧️ Rain' : 
             soundMode === 'brown' ? '☕ Brown Noise' : '⚡ 40Hz Tone'}
          </span>
        </button>

        {/* Live Precision Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] font-mono text-xs text-zinc-400">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>{timeStr || '00:00:00'}</span>
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
