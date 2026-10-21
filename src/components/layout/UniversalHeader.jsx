import React, { useState } from 'react';
import { Menu, Timer, Sun, Compass, Zap, Volume2, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { soundEngine } from '../../services/soundEngine';

const UniversalHeader = ({ onMenuClick, user }) => {
  const navigate = useNavigate();
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const toggleSound = () => {
    if (isPlayingSound) {
      soundEngine.stop();
      setIsPlayingSound(false);
    } else {
      soundEngine.play40HzBinaural(0.08);
      setIsPlayingSound(true);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 h-[56px] w-full border-b border-[#e5e1d5] px-5 sm:px-8 flex items-center justify-between"
      style={{
        background: 'rgba(251, 251, 250, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="p-1.5 hover:bg-[#f2efe6] rounded-md transition-colors text-[#52504a] hover:text-[#1a1917]"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Masthead Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/dashboard')}
        >
          <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
          <span className="font-serif font-bold text-base tracking-tight text-[#1a1917]">
            NUVIO
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#827f76] px-1.5 py-0.5 border border-[#e5e1d5] bg-[#f5f3ec] rounded font-bold uppercase">
            LIFE OS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 font-mono text-xs">
        {/* Fast Jump: Circadian Stream */}
        <button
          onClick={() => navigate('/circadian')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="24h Circadian Biological Stream"
        >
          <Sun className="w-3.5 h-3.5 text-[#8a4b16]" />
          <span className="text-[11px] font-semibold tracking-wider">CIRCADIAN</span>
        </button>

        {/* Fast Jump: Wheel of Life */}
        <button
          onClick={() => navigate('/wheel')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="Wheel of Life Radar"
        >
          <Compass className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">RADAR</span>
        </button>

        {/* Fast Jump: 40Hz Audio Focus Quick Switch */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all shadow-xs ${
            isPlayingSound 
              ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' 
              : 'border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] text-[#52504a]'
          }`}
          title="Toggle 40Hz Binaural Beats (Huberman Focus Protocol)"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold tracking-wider">
            {isPlayingSound ? '40HZ ON' : '40HZ BEATS'}
          </span>
        </button>

        {/* Fast Jump: Chronometer */}
        <button
          onClick={() => navigate('/focus-timer')}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="90m Ultradian Chronometer"
        >
          <Timer className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">FOCUS</span>
        </button>

        {/* User Moniker & Avatar */}
        <div
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-[#f4f1ea] flex items-center justify-center text-sm border border-[#e0dcce] overflow-hidden cursor-pointer hover:border-[#1b3b2b] transition-colors shadow-xs ml-1"
          title="Life OS Settings"
        >
          {user?.avatar_emoji || '⚡'}
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
