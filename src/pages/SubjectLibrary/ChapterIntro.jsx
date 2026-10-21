import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, BookOpen, Target, GraduationCap } from 'lucide-react';
import './styles.css';

const ChapterIntro = ({ chapter, subject, grade, onStart }) => {
  const difficulty = chapter?.difficulty || "Standard";
  const duration = chapter?.studyTime || "35 mins";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-8 text-left"
    >
      {/* Chapter Masthead Card */}
      <div className="bg-white border border-[#e5e1d5] rounded-2xl p-8 md:p-10 shadow-[0_4px_24px_rgba(27,59,43,0.04)] relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-[#f5f3ec] border border-[#e5e1d5] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase">
            Class {grade} {subject}
          </span>
          <span className="px-3 py-1 bg-[#ede9de] border border-[#d8d4c7] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> NCERT Syllabus
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1917] leading-tight">
            {chapter?.title}
          </h1>
          <p className="text-[#52504a] text-sm md:text-base max-w-2xl leading-relaxed">
            {chapter?.summary}
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#e5e1d5]">
          <div className="bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76]">Estimated Time</span>
            <span className="text-sm font-serif font-bold text-[#1b3b2b] flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5" /> {duration}
            </span>
          </div>
          
          <div className="bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76]">Curriculum Level</span>
            <span className="text-sm font-serif font-bold text-[#1b3b2b] flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1b3b2b]" /> {difficulty}
            </span>
          </div>

          <div className="bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76]">Subject Discipline</span>
            <span className="text-sm font-serif font-bold text-[#1a1917] block truncate mt-1">
              {subject}
            </span>
          </div>

          <div className="bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76]">Board Grade</span>
            <span className="text-sm font-serif font-bold text-[#1a1917] block mt-1">
              Class {grade}
            </span>
          </div>
        </div>
      </div>

      {/* Structured Details Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why this matters card */}
        <div className="bg-white border border-[#e5e1d5] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#1b3b2b]">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-serif font-bold text-base text-[#1a1917]">Why This Chapter Matters</h3>
          </div>
          <p className="text-xs text-[#52504a] leading-relaxed">
            {chapter?.whyItMatters || "This chapter forms the cornerstone of advanced study in this discipline, helping you structure logical arguments, solve complex equations, and interpret physical properties of matter in daily applications."}
          </p>
        </div>

        {/* Real world apps card */}
        <div className="bg-white border border-[#e5e1d5] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#1b3b2b]">
            <Target className="w-4 h-4" />
            <h3 className="font-serif font-bold text-base text-[#1a1917]">Real-World Applications</h3>
          </div>
          <p className="text-xs text-[#52504a] leading-relaxed">
            {chapter?.realWorld || "From plotting coordinate pathways in GPS systems and designing engineering schematics to modeling real-world physical systems, these core concepts are actively applied in scientific inquiry."}
          </p>
        </div>

        {/* Learning outcomes card */}
        <div className="bg-white border border-[#e5e1d5] rounded-2xl p-6 md:col-span-2 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#1b3b2b]">
            <GraduationCap className="w-4 h-4" />
            <h3 className="font-serif font-bold text-base text-[#1a1917]">Expected Learning Outcomes</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#52504a] leading-relaxed">
            {chapter?.recap?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
                <span className="text-[#1b3b2b] font-bold mt-0.5">✓</span>
                <span className="text-[#1a1917]">{item.replace(/\*\*/g, '')}</span>
              </li>
            )) || (
              <>
                <li className="flex items-start gap-2.5 bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
                  <span className="text-[#1b3b2b] font-bold mt-0.5">✓</span>
                  <span className="text-[#1a1917]">Master fundamental NCERT definitions and terminology.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-[#fbfbfa] p-3.5 rounded-xl border border-[#e5e1d5]">
                  <span className="text-[#1b3b2b] font-bold mt-0.5">✓</span>
                  <span className="text-[#1a1917]">Solve progressive application questions with mathematical precision.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Start Button Container */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onStart}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" /> Begin Chapter Study
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterIntro;
