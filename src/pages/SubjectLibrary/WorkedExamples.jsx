import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, CheckCircle, Lightbulb, Compass, Award } from 'lucide-react';
import './styles.css';

const WorkedExamples = ({ examples }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0); // number of steps revealed (0 to 4)
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
      <div className="text-center space-y-1 mb-8">
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase">
          Step 4: Solved Applications
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-2">
          Worked Examples
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Analyze board-aligned problems. Reveal working steps sequentially.
        </p>
      </div>

      {!currentExample ? (
        <div className="text-center p-8 bg-slate-900/30 border border-white/5 rounded-xl text-text-muted text-xs">
          No solved examples available for this chapter.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Example Selector header */}
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4 border border-white/10 rounded-lg shadow">
            <button
              disabled={activeIdx === 0}
              onClick={handlePrevExample}
              className="px-3 py-1.5 border border-white/10 bg-slate-850 hover:bg-slate-800 disabled:opacity-35 text-[9px] font-black uppercase tracking-wider rounded text-slate-350"
            >
              ◀ Prev Example
            </button>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Example {activeIdx + 1} of {examples.length} ({currentExample.level})
            </span>
            <button
              disabled={activeIdx + 1 === examples.length}
              onClick={handleNextExample}
              className="px-3 py-1.5 border border-white/10 bg-slate-850 hover:bg-slate-800 disabled:opacity-35 text-[9px] font-black uppercase tracking-wider rounded text-slate-350"
            >
              Next Example ▶
            </button>
          </div>

          {/* Problem Display Card */}
          <div className="glass-panel p-6 md:p-8 space-y-4 text-left border-purple-500/10">
            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/25 rounded text-[8px] font-black uppercase tracking-widest text-purple-400">
              {currentExample.title || "Practice Question"}
            </span>
            <h3 className="text-lg font-black text-white leading-relaxed">
              {currentExample.problem}
            </h3>

            {/* Hint toggler */}
            <div className="pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded text-[8px] font-black uppercase tracking-widest transition-all ${
                  showHint 
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]' 
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" /> {showHint ? "Hide Hint" : "Get a Hint"}
              </button>
              
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 bg-yellow-500/5 border border-yellow-500/15 text-slate-350 rounded-lg text-xs leading-relaxed font-semibold"
                  >
                    <strong>Clue:</strong> {currentExample.hint || "Identify key values first, write down the corresponding formula, and solve for the unknown parameter step-by-step."}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Step Reveals Path */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">
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
                        className="glass-panel p-5 border border-white/10 flex items-start gap-4 shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-[9px] font-black shrink-0">
                          {sIdx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            Step {sIdx + 1}
                          </span>
                          <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                            {stepText}
                          </p>
                        </div>
                      </motion.div>
                    ) : sIdx === visibleSteps ? (
                      /* Next click-to-reveal button placeholder */
                      <button
                        onClick={revealNextStep}
                        className="w-full p-5 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-purple-500/20 rounded-xl text-left text-xs font-black uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-all flex items-center justify-between"
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
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg text-xs font-bold text-green-400 text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Problem Derivation Completed!
              </div>
            )}
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default WorkedExamples;
