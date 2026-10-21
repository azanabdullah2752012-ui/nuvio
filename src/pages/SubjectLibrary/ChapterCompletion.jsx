import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, BookOpen, Clock, Target } from 'lucide-react';
import './styles.css';

const ChapterCompletion = ({ chapter, subject, onReturn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto space-y-6 text-center"
    >
      {/* Chapter Completed Banner */}
      <div className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl relative overflow-hidden text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ff4625]/10 border border-[#ff4625]/20 flex items-center justify-center text-[#ff4625]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff4625]">
              NCERT Syllabus Protocol
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-clash">
              {chapter.title} Verified
            </h2>
          </div>
        </div>

        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
          All core concepts, worked problem sets, and recall benchmarks for this unit have been systematically registered in your academic study record.
        </p>
      </div>

      {/* Academic Metrics Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 border border-white/10 bg-[#0d0f14] rounded-xl text-left">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#ff4625]" /> Concepts
          </div>
          <div className="text-lg font-bold text-white font-clash">100%</div>
          <span className="text-[9px] text-zinc-500 font-mono">Curriculum Covered</span>
        </div>

        <div className="p-4 border border-white/10 bg-[#0d0f14] rounded-xl text-left">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-[#ff4625]" /> Recall
          </div>
          <div className="text-lg font-bold text-white font-clash">Verified</div>
          <span className="text-[9px] text-zinc-500 font-mono">Arena Cleared</span>
        </div>

        <div className="p-4 border border-white/10 bg-[#0d0f14] rounded-xl text-left">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-[#ff4625]" /> Status
          </div>
          <div className="text-lg font-bold text-emerald-400 font-clash">Ready</div>
          <span className="text-[9px] text-zinc-500 font-mono">Next Module</span>
        </div>
      </div>

      {/* Return Action */}
      <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between">
        <div className="text-left">
          <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Syllabus Navigation</span>
          <h5 className="text-xs font-bold text-white uppercase font-clash">Return to Subject Overview</h5>
        </div>
        <button
          onClick={onReturn}
          className="px-5 py-2.5 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterCompletion;