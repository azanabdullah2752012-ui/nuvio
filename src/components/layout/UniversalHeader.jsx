import React from 'react';
import { Menu, Timer, CheckSquare, Calendar, Compass, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversalHeader = ({ onMenuClick, user }) => {
  const navigate = useNavigate();

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
        {/* Fast Jump: Compass */}
        <button
          onClick={() => navigate('/dashboard')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="Daily Compass"
        >
          <Compass className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">COMPASS</span>
        </button>

        {/* Fast Jump: Actions */}
        <button
          onClick={() => navigate('/homework')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="Life Directives"
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">ACTIONS</span>
        </button>

        {/* Fast Jump: Calendar */}
        <button
          onClick={() => navigate('/calendar')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="Life Calendar"
        >
          <Calendar className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">CALENDAR</span>
        </button>

        {/* Fast Jump: Focus Timer */}
        <button
          onClick={() => navigate('/focus-timer')}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-[#52504a] hover:text-[#1a1917] transition-colors shadow-xs"
          title="Launch Focus Session"
        >
          <Timer className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">CHRONOMETER</span>
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
