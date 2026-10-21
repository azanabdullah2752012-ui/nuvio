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
      className="max-w-xl mx-auto space-y-6 text-center text-left"
    >
      {/* Chapter Completed Banner */}
      <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl relative overflow-hidden text-left shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
              NCERT Syllabus Complete
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#1a1917]">
              {chapter?.title} Verified
            </h2>
          </div>
        </div>

        <p className="text-[#52504a] text-xs leading-relaxed">
          All core concepts, worked problem sets, and recall benchmarks for this unit have been systematically registered in your academic study record.
        </p>
      </div>

      {/* Academic Metrics Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 border border-[#e5e1d5] bg-white rounded-xl text-left shadow-sm">
          <div className="flex items-center gap-1.5 text-[#827f76] text-[10px] font-mono uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#1b3b2b]" /> Concepts
          </div>
          <div className="text-xl font-serif font-bold text-[#1b3b2b]">100%</div>
          <span className="text-[9px] text-[#827f76] font-mono">Curriculum Covered</span>
        </div>

        <div className="p-4 border border-[#e5e1d5] bg-white rounded-xl text-left shadow-sm">
          <div className="flex items-center gap-1.5 text-[#827f76] text-[10px] font-mono uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-[#1b3b2b]" /> Recall
          </div>
          <div className="text-xl font-serif font-bold text-[#1b3b2b]">Verified</div>
          <span className="text-[9px] text-[#827f76] font-mono">Arena Cleared</span>
        </div>

        <div className="p-4 border border-[#e5e1d5] bg-white rounded-xl text-left shadow-sm">
          <div className="flex items-center gap-1.5 text-[#827f76] text-[10px] font-mono uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-[#1b3b2b]" /> Status
          </div>
          <div className="text-xl font-serif font-bold text-[#1b3b2b]">Ready</div>
          <span className="text-[9px] text-[#827f76] font-mono">Next Module</span>
        </div>
      </div>

      {/* Return Action */}
      <div className="p-5 bg-white border border-[#e5e1d5] rounded-xl flex items-center justify-between shadow-sm">
        <div className="text-left">
          <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Syllabus Directory</span>
          <h5 className="text-xs font-serif font-bold text-[#1a1917]">Return to Subject Overview</h5>
        </div>
        <button
          onClick={onReturn}
          className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-[10px] font-bold rounded-lg shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterCompletion;
