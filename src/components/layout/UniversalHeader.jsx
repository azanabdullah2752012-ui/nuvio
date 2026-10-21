import React from 'react';
import { Menu, Timer, BookOpen } from 'lucide-react';
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
          className="p-1.5 hover:bg-[#f2efe6] rounded-md transition-colors text-zinc-700 hover:text-black"
          title="Open Academic Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Masthead Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/dashboard')}
        >
          <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
          <span className="font-display font-bold text-base tracking-tight text-[#1a1917]">
            ACADEVANCE
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-zinc-500 px-1.5 py-0.5 border border-[#e5e1d5] bg-[#f5f3ec] rounded">
            CLASS 9
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Fast Jump: Focus Timer */}
        <button
          onClick={() => navigate('/focus-timer')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-zinc-700 hover:text-black transition-colors shadow-sm"
          title="Launch Focus Session"
        >
          <Timer className="w-3.5 h-3.5 text-[#1b3b2b]" />
          <span className="text-[11px] font-semibold tracking-wider">FOCUS TIMER</span>
        </button>

        {/* Fast Jump: Curriculum */}
        <button
          onClick={() => navigate('/curriculum')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#e5e1d5] bg-white hover:bg-[#f7f5ee] rounded-md text-zinc-700 hover:text-black transition-colors shadow-sm"
          title="Browse Curriculum"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#162744]" />
          <span className="text-[11px] font-semibold tracking-wider">SYLLABUS</span>
        </button>

        {/* Scholar Avatar (links to settings) */}
        <div
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-[#f4f1ea] flex items-center justify-center text-sm border border-[#e0dcce] overflow-hidden cursor-pointer hover:border-[#1b3b2b] transition-colors shadow-sm"
          title="Scholar Settings"
        >
          {user?.avatar_emoji || '📖'}
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;