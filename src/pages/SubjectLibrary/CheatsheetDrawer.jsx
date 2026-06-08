import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Copy, Book } from 'lucide-react';
import './styles.css';

const CheatsheetDrawer = ({ isOpen, onClose, formulas, copiedFormula, onCopy }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = formulas.filter(f => 
    f.formula.toLowerCase().includes(search.toLowerCase()) ||
    f.chapterTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide Drawer content */}
      <div className="relative w-full max-w-md h-full bg-slate-950/95 border-l border-white/10 p-8 shadow-2xl flex flex-col justify-between z-10 text-white">
        <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Book className="w-5 h-5 animate-pulse" />
              <h3 className="text-lg font-black uppercase tracking-tight">Formulas Matrix</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search equations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-xs font-semibold placeholder:text-slate-500 focus:border-purple-500 focus:outline-none rounded-lg transition-all"
            />
          </div>

          {/* Formulas listing */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-left">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-semibold uppercase font-mono">
                No matching formulas found.
              </div>
            ) : (
              filtered.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/5 p-4 rounded-lg space-y-2 relative overflow-hidden group shadow">
                  <span className="block text-[8px] font-black uppercase text-purple-400 tracking-widest">
                    {item.chapterTitle}
                  </span>
                  <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-green-400 border border-white/5 select-all leading-normal">
                    {item.formula}
                  </div>
                  <button
                    onClick={() => onCopy(item.formula)}
                    className="absolute top-3.5 right-3.5 p-1.5 bg-slate-800 border border-white/10 rounded hover:bg-slate-700 hover:text-white text-slate-400 transition-all opacity-0 group-hover:opacity-100 shadow"
                  >
                    {copiedFormula === item.formula ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="pt-4 border-t border-white/5 text-center text-[9px] text-slate-500 font-black uppercase tracking-wider">
          Equations sourced from NCERT guidelines.
        </div>
      </div>
    </div>
  );
};

export default CheatsheetDrawer;
