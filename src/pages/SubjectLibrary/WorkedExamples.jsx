import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, CheckCircle, Lightbulb } from 'lucide-react';
import './styles.css';

const WorkedExamples = ({ examples }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentExample = examples && examples[activeIdx] ? examples[activeIdx] : null;

  const handleNextExample = () => {
    if (activeIdx + 1 < examples.length) {
      setActiveIdx(prev => prev + 1);
      setVisibleSteps(0);
      setShowHint(false);
    }
  };

  const handlePrevExample = () => {
    if (activeIdx > 0) {
      setActiveIdx(prev => prev - 1);
      setVisibleSteps(0);
      setShowHint(false);
    }
  };

  const revealNextStep = () => {
    if (currentExample && visibleSteps < currentExample.solution.length) {
      setVisibleSteps(prev => prev + 1);
    }
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
          Step 4: Solved Applications
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1917] mt-2">
          Worked Examples
        </h2>
        <p className="text-[#52504a] text-xs">
          Analyze board-aligned problem solutions step-by-step.
        </p>
      </div>

      {!currentExample ? (
        <div className="text-center p-8 bg-white border border-[#e5e1d5] rounded-xl text-[#827f76] text-xs font-mono uppercase">
          No solved examples available for this chapter.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Example Selector header */}
          <div className="flex items-center justify-between bg-white px-5 py-3.5 border border-[#e5e1d5] rounded-xl shadow-sm">
            <button
              disabled={activeIdx === 0}
              onClick={handlePrevExample}
              className="px-3.5 py-1.5 border border-[#e5e1d5] bg-[#f5f3ec] hover:bg-[#ede9de] disabled:opacity-35 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg text-[#52504a] transition-colors"
            >
              ◀ Prev
            </button>
            <span className="text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-widest">
              Example {activeIdx + 1} of {examples.length} ({currentExample.level})
            </span>
            <button
              disabled={activeIdx + 1 === examples.length}
              onClick={handleNextExample}
              className="px-3.5 py-1.5 border border-[#e5e1d5] bg-[#f5f3ec] hover:bg-[#ede9de] disabled:opacity-35 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg text-[#52504a] transition-colors"
            >
              Next ▶
            </button>
          </div>

          {/* Problem Display Card */}
          <div className="bg-white border border-[#e5e1d5] rounded-2xl p-6 md:p-8 space-y-4 text-left shadow-sm">
            <span className="inline-block px-2.5 py-1 bg-[#f5f3ec] border border-[#e5e1d5] rounded text-[10px] font-mono font-bold uppercase tracking-widest text-[#1b3b2b]">
              {currentExample.title || "Practice Problem"}
            </span>
            <h3 className="text-lg md:text-xl font-serif font-bold text-[#1a1917] leading-relaxed">
              {currentExample.problem}
            </h3>

            {/* Hint toggler */}
            <div className="pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                  showHint 
                    ? 'bg-[#ede9de] border-[#d8d4c7] text-[#1b3b2b] font-bold' 
                    : 'bg-[#fbfbfa] border-[#e5e1d5] text-[#52504a] hover:text-[#1a1917]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" /> {showHint ? "Hide Hint" : "Reveal Solution Clue"}
              </button>
              
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 bg-[#fbfbfa] border border-[#e5e1d5] text-[#52504a] rounded-xl text-xs leading-relaxed"
                  >
                    <strong className="text-[#1a1917]">Clue:</strong> {currentExample.hint || "Identify key values first, write down the corresponding formula, and solve for the unknown parameter step-by-step."}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Step Reveals Path */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-mono font-bold uppercase text-[#827f76] tracking-widest border-b border-[#e5e1d5] pb-2">
              Step-by-Step Derivation
            </h4>

            {currentExample.solution.map((stepText, sIdx) => {
              const isRevealed = sIdx < visibleSteps;
              return (
                <div key={sIdx} className="relative">
                  <AnimatePresence>
                    {isRevealed ? (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-5 border border-[#e5e1d5] rounded-xl flex items-start gap-4 shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] text-xs font-serif font-bold shrink-0">
                          {sIdx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[9px] font-mono font-bold text-[#827f76] uppercase tracking-widest">
                            Step {sIdx + 1}
                          </span>
                          <p className="text-xs text-[#1a1917] leading-relaxed">
                            {stepText}
                          </p>
                        </div>
                      </motion.div>
                    ) : sIdx === visibleSteps ? (
                      <button
                        onClick={revealNextStep}
                        className="w-full p-4 bg-[#fbfbfa] hover:bg-white border border-dashed border-[#d8d4c7] hover:border-[#1b3b2b] rounded-xl text-left text-xs font-mono uppercase tracking-wider text-[#52504a] hover:text-[#1b3b2b] transition-all flex items-center justify-between"
                      >
                        <span>Reveal Step {sIdx + 1}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}

            {visibleSteps === currentExample.solution.length && (
              <div className="p-4 bg-[#f5f3ec] border border-[#1b3b2b]/30 rounded-xl text-xs font-serif font-bold text-[#1b3b2b] text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#1b3b2b]" /> Problem Derivation Completed
              </div>
            )}
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default WorkedExamples;
