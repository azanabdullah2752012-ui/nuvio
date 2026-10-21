import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen } from 'lucide-react';
import CartesianPlotter from './Sandboxes/CartesianPlotter';
import MotionSimulator from './Sandboxes/MotionSimulator';
import NarrativeMap from './Sandboxes/NarrativeMap';
import CellExplorer from './Sandboxes/CellExplorer';
import AtomExplorer from './Sandboxes/AtomExplorer';
import HeronExplorer from './Sandboxes/HeronExplorer';
import Class6MathSandbox from './Sandboxes/Class6MathSandbox';
import Class6ScienceSandbox from './Sandboxes/Class6ScienceSandbox';
import './styles.css';

const LearningBlocks = ({ subject, chapter, grade = "9" }) => {
  const sLower = subject?.toLowerCase() || '';
  const cTitle = chapter?.title?.toLowerCase() || '';

  // Pick visual block
  const renderInteractiveBlock = () => {
    if (grade === "6" && sLower.includes('math')) {
      return <Class6MathSandbox chapterTitle={chapter?.title} activeConcept={null} />;
    }
    if (grade === "6" && sLower.includes('science')) {
      return <Class6ScienceSandbox chapterTitle={chapter?.title} activeConcept={null} />;
    }
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
    if (sLower.includes('english') || cTitle.includes('grandmother') || cTitle.includes('read')) {
      return <NarrativeMap />;
    }

    // Default Fallback: Concept Timeline Sandbox
    return (
      <div className="bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl space-y-6 text-left shadow-sm">
        <div className="text-center space-y-1">
          <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
            Syllabus Explorer
          </span>
          <h4 className="text-lg font-serif font-bold text-[#1a1917]">Concept Progression Sequence</h4>
          <p className="text-[#52504a] text-xs">
            Follow the chronological sequence of topics inside this NCERT module.
          </p>
        </div>

        <div className="relative pl-6 border-l-2 border-[#e5e1d5] space-y-5 py-2">
          {chapter?.keyIdeas?.map((idea, idx) => (
            <div key={idx} className="relative">
              {/* Dot stop indicator */}
              <div className="absolute w-5 h-5 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] left-[-35px] top-1 flex items-center justify-center text-[10px] text-[#1b3b2b] font-mono font-bold">
                {idx + 1}
              </div>
              <div className="space-y-1 bg-[#fbfbfa] p-4 border border-[#e5e1d5] rounded-xl shadow-sm hover:border-[#1b3b2b]/40 transition-colors">
                <span className="block text-[9px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
                  Checkpoint {idx + 1}
                </span>
                <h5 className="text-xs font-serif font-bold text-[#1a1917]">{idea.split(':')[0] || `Key Concept ${idx + 1}`}</h5>
                <p className="text-xs text-[#52504a] leading-relaxed mt-1">{idea.split(':')[1] || idea}</p>
              </div>
            </div>
          )) || (
            <div className="text-[#827f76] text-xs text-center py-6 italic font-mono uppercase">
              No timeline nodes available.
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
      <div className="text-center space-y-1 mb-6">
        <span className="px-3 py-1 bg-[#ede9de] border border-[#d8d4c7] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase">
          Step 3: Laboratory Sandbox
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1917] mt-2">
          Interactive Learning Block
        </h2>
        <p className="text-[#52504a] text-xs">
          Engage directly with core diagrams, simulations, and narrative visual graphs.
        </p>
      </div>

      <div className="space-y-6">
        {renderInteractiveBlock()}

        {/* Experiment Instructions Card */}
        <div className="bg-white p-5 rounded-xl flex items-start gap-3.5 border border-[#e5e1d5] shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] shrink-0">
            <Lightbulb className="w-4 h-4 text-[#1b3b2b]" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="text-xs font-serif font-bold text-[#1a1917]">
              Active Experiment Instructions
            </h4>
            <p className="text-xs text-[#52504a] leading-relaxed">
              Observe outputs by tweaking parameters. Active observation primes your memory pathways, helping solidify concepts for board exams and practice tests.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningBlocks;
