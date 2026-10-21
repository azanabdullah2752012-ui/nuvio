import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Copy, BookOpen } from 'lucide-react';
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide Drawer content */}
      <div className="relative w-full max-w-md h-full bg-[#fbfbfa] border-l border-[#e5e1d5] p-6 md:p-8 shadow-2xl flex flex-col justify-between z-10 text-[#1a1917]">
        <div className="space-y-5 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e5e1d5] pb-4">
            <div className="flex items-center gap-2 text-[#1b3b2b]">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-serif font-bold text-[#1a1917]">Formula Reference</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 bg-white border border-[#e5e1d5] hover:bg-[#ede9de] text-[#52504a] hover:text-[#1a1917] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827f76]" />
            <input
              type="text"
              placeholder="Search equations and topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e1d5] text-xs font-sans placeholder:text-[#827f76] focus:border-[#1b3b2b] focus:outline-none rounded-xl transition-all shadow-sm"
            />
          </div>

          {/* Formulas listing */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[#827f76] text-xs font-mono uppercase">
                No matching formulas found.
              </div>
            ) : (
              filtered.map((item, idx) => (
                <div key={idx} className="bg-white border border-[#e5e1d5] p-4 rounded-xl space-y-2 relative overflow-hidden group shadow-sm">
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#1b3b2b] tracking-wider">
                    {item.chapterTitle}
                  </span>
                  <div className="bg-[#fbfbfa] p-3 rounded-lg font-mono text-xs text-[#1a1917] border border-[#e5e1d5] select-all leading-normal">
                    {item.formula}
                  </div>
                  <button
                    onClick={() => onCopy(item.formula)}
                    className="absolute top-3.5 right-3.5 p-1.5 bg-white border border-[#e5e1d5] rounded-md hover:bg-[#ede9de] text-[#52504a] hover:text-[#1a1917] transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Copy formula"
                  >
                    {copiedFormula === item.formula ? <Check className="w-3.5 h-3.5 text-[#1b3b2b]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="pt-4 border-t border-[#e5e1d5] text-center text-[10px] text-[#827f76] font-mono uppercase tracking-wider">
          Equations sourced from NCERT curriculum standards.
        </div>
      </div>
    </div>
  );
};

export default CheatsheetDrawer;
