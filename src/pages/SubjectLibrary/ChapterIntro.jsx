import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, AlertCircle, Compass, Target, GraduationCap } from 'lucide-react';
import './styles.css';

const ChapterIntro = ({ chapter, subject, grade, onStart }) => {
  // Parse stats
  const difficulty = chapter.difficulty || "Medium";
  const duration = chapter.studyTime || "35 mins";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Hero Glass Card Banner */}
      <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
        {/* Dynamic ambient color glow blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black tracking-widest text-cyan-400 uppercase">
              Class {grade} {subject}
            </span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> NCERT Syllabus
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              {chapter.title}
            </h1>
            <p className="text-slate-350 text-sm md:text-base max-w-2xl leading-relaxed font-semibold">
              {chapter.summary}
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Estimated Time</span>
              <span className="text-sm font-black text-green-400 uppercase flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4" /> {duration}
              </span>
            </div>
            
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Difficulty Level</span>
              <span className="text-sm font-black text-yellow-400 uppercase flex items-center gap-1 mt-0.5">
                <Sparkles className="w-4 h-4 text-yellow-400" /> {difficulty}
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Subject Area</span>
              <span className="text-sm font-black text-purple-400 uppercase block truncate mt-0.5">
                {subject}
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Academic Grade</span>
              <span className="text-sm font-black text-cyan-400 uppercase block mt-0.5">
                Class {grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Details Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why this matters card */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-purple-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-md font-black uppercase text-white tracking-wide">Why This Chapter Matters</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            {chapter.whyItMatters || "This chapter forms the cornerstone of advanced study in this discipline, helping you structure logical arguments, solve complex equations, and interpret physical properties of matter in daily applications."}
          </p>
        </div>

        {/* Real world apps card */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Target className="w-5 h-5" />
            <h3 className="text-md font-black uppercase text-white tracking-wide">Real-World Applications</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            {chapter.realWorld || "From plotting coordinate pathways in GPS systems and designing video game characters to engineering stable structures, these core concepts are actively applied in technology, data science, and modern development."}
          </p>
        </div>

        {/* Learning outcomes card */}
        <div className="glass-panel p-6 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5 text-green-400">
            <GraduationCap className="w-5 h-5" />
            <h3 className="text-md font-black uppercase text-white tracking-wide">Learning Outcomes</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 font-semibold leading-relaxed">
            {chapter.recap?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-white/5 p-3 rounded-md border border-white/5">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{item.replace(/\*\*/g, '')}</span>
              </li>
            )) || (
              <>
                <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-md border border-white/5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Master fundamental definitions and terminology.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-md border border-white/5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Solve progressive application questions with accuracy.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Start Button Container */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStart}
          className="flex items-center gap-2.5 px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" /> Start Learning Quest
        </button>
      </div>
    </motion.div>
  );
};

export default ChapterIntro;
