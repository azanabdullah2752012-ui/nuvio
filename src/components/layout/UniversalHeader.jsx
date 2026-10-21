import React, { useState, useEffect } from 'react';
import { Menu, Timer, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniversalHeader = ({ onMenuClick, user }) => {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 h-[56px] w-full border-b border-white/[0.08] px-5 flex items-center justify-between"
      style={{
        background: 'rgba(9, 10, 13, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="p-1.5 hover:bg-white/5 rounded transition-colors text-text-secondary hover:text-white"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Masthead Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/dashboard')}
        >
          <span className="w-2.5 h-2.5 bg-brand-vermilion rounded-none" />
          <span className="font-display font-bold text-base tracking-wider text-white">
            ACADEVANCE
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-text-muted px-1.5 py-0.5 border border-white/10 rounded">
            CLASS 9
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Fast Jump: Focus Timer */}
        <button
          onClick={() => navigate('/focus-timer')}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 border border-white/10 hover:border-white/25 rounded text-text-secondary hover:text-white transition-colors"
          title="Launch Focus Session"
        >
          <Timer className="w-3.5 h-3.5 text-brand-vermilion" />
          <span className="text-[11px] font-bold">FOCUS TIMER</span>
        </button>

        {/* Fast Jump: Curriculum */}
        <button
          onClick={() => navigate('/curriculum')}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 border border-white/10 hover:border-white/25 rounded text-text-secondary hover:text-white transition-colors"
          title="Browse Curriculum"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-bold">SYLLABUS</span>
        </button>

        {/* Scholar Avatar (links to settings) */}
        <div
          onClick={() => navigate('/profile')}
          className="w-7 h-7 rounded bg-[#171a22] flex items-center justify-center text-sm border border-white/15 overflow-hidden cursor-pointer hover:border-brand-vermilion transition-colors"
          title="Scholar Settings"
        >
          {user?.avatar_emoji || '⚡'}
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
