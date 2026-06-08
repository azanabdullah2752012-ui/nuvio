import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Lightbulb, Compass, Award, Star } from 'lucide-react';
import CartesianPlotter from './Sandboxes/CartesianPlotter';
import MotionSimulator from './Sandboxes/MotionSimulator';
import NarrativeMap from './Sandboxes/NarrativeMap';
import CellExplorer from './Sandboxes/CellExplorer';
import AtomExplorer from './Sandboxes/AtomExplorer';
import HeronExplorer from './Sandboxes/HeronExplorer';
import './styles.css';

const LearningBlocks = ({ subject, chapter }) => {
  const sLower = subject.toLowerCase();
  const cTitle = chapter.title.toLowerCase();

  // Pick visual block
  const renderInteractiveBlock = () => {
    if (cTitle.includes('cell')) {
      return <CellExplorer />;
    }
    if (cTitle.includes('atom')) {
      return <AtomExplorer />;
    }
    if (cTitle.includes('heron')) {
      return <HeronExplorer />;
    }
    if (sLower.includes('math') || cTitle.includes('geometry') || cTitle.includes('algebra')) {
      return <CartesianPlotter />;
    }
    if (cTitle.includes('motion') || cTitle.includes('force') || sLower.includes('phys')) {
      return <MotionSimulator />;
    }
    if (sLower.includes('english') || cTitle.includes(' grandmother') || cTitle.includes('read')) {
      return <NarrativeMap />;
    }

    // Default Fallback: Civilization Timeline Sandbox (For Social Science & general topics)
    return (
      <div className="bg-slate-950 p-6 border border-white/10 rounded-xl space-y-6 text-left shadow-lg">
        <div className="text-center space-y-1">
          <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
            Syllabus Explorer
          </span>
          <h4 className="text-sm font-black uppercase text-white">Interactive Concept Timeline</h4>
          <p className="text-slate-400 text-[10px] font-semibold">
            Follow the chronological sequence of topics inside this NCERT module.
          </p>
        </div>

        <div className="relative pl-6 border-l border-white/10 space-y-6 py-2">
          {chapter.keyIdeas?.map((idea, idx) => (
            <div key={idx} className="relative">
              {/* Dot stop indicator */}
              <div className="absolute w-4 h-4 rounded-full bg-slate-900 border border-white/20 left-[-31px] top-1 flex items-center justify-center text-[7px] text-purple-400 font-black">
                {idx + 1}
              </div>
              <div className="space-y-1 bg-slate-900 p-4 border border-white/5 rounded shadow-sm hover:border-purple-500/20 transition-colors">
                <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                  Timeline Milestone
                </span>
                <h5 className="text-xs font-black text-white uppercase">{idea.split(':')[0] || `Key Concept ${idx + 1}`}</h5>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">{idea.split(':')[1] || idea}</p>
              </div>
            </div>
          )) || (
            <div className="text-slate-400 text-xs text-center py-6 italic font-bold">
              Reviewing general timeline nodes.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center space-y-1 mb-8">
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase">
          Step 3: Laboratory Sandbox
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-2">
          Interactive Learning Block
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Engage directly with core formulas, simulations, and narrative visual graphs.
        </p>
      </div>

      <div className="space-y-6">
        {renderInteractiveBlock()}

        {/* Diagnostic Hint Badge */}
        <div className="glass-panel p-5 flex items-start gap-3.5 border border-white/10">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 shadow">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="text-xs font-black uppercase text-white tracking-wide">
              Active Experiment Instructions
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              Observe outputs by tweaking parameters. Active observation primes your memory pathways, achieving up to 2.5x higher recall scores when answering tests in the Practice Arena.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningBlocks;
