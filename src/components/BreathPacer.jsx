import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Wind, Heart, Eye } from 'lucide-react';

const BreathPacer = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState('Inhale 1'); // 'Inhale 1' (deep nose) | 'Inhale 2' (top-off) | 'Exhale' (mouth)
  const [instruction, setInstruction] = useState('Inhale deeply through your nose...');
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    let timeoutId;
    const runCycle = () => {
      // Step 1: Deep Inhale (2.8s)
      setPhase('Inhale 1');
      setInstruction('Deep inhale through nose...');
      
      timeoutId = setTimeout(() => {
        // Step 2: Quick Top-off Inhale (1.2s)
        setPhase('Inhale 2');
        setInstruction('Sharp top-off inhale (fill lungs completely)...');
        
        timeoutId = setTimeout(() => {
          // Step 3: Long Exhale (6.0s)
          setPhase('Exhale');
          setInstruction('Long, slow, complete exhale through mouth...');
          
          timeoutId = setTimeout(() => {
            setCycleCount(c => c + 1);
            runCycle();
          }, 6000);
        }, 1200);
      }, 2800);
    };

    runCycle();
    return () => clearTimeout(timeoutId);
  }, [isRunning]);

  // Visual circle scale based on phase
  const getScale = () => {
    if (phase === 'Inhale 1') return 1.4;
    if (phase === 'Inhale 2') return 1.6;
    return 1.0;
  };

  const getTransitionDuration = () => {
    if (phase === 'Inhale 1') return 2.8;
    if (phase === 'Inhale 2') return 1.2;
    return 6.0;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn text-left">
      <div className="bg-[#fbfbfa] border border-[#e5e1d5] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#e5e1d5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1b3b2b]/10 text-[#1b3b2b] flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#827f76] font-bold">
                Huberman Protocol // Autonomic Downshift
              </div>
              <div className="font-serif font-bold text-base text-[#1a1917]">
                The Physiological Sigh Pacer
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-[#827f76] hover:text-[#1a1917]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Animated Breathing Visual */}
        <div className="py-12 flex flex-col items-center justify-center relative">
          
          {/* Outer Breathing Halo */}
          <motion.div
            animate={{ 
              scale: getScale(),
              opacity: phase === 'Exhale' ? 0.35 : 0.85
            }}
            transition={{ 
              duration: getTransitionDuration(), 
              ease: phase === 'Exhale' ? 'easeOut' : 'easeInOut' 
            }}
            className="w-48 h-48 rounded-full border-2 border-[#1b3b2b] bg-[#1b3b2b]/10 flex items-center justify-center relative shadow-[0_0_40px_rgba(27,59,43,0.15)]"
          >
            <motion.div
              animate={{ scale: phase === 'Exhale' ? 0.7 : 1.15 }}
              transition={{ duration: getTransitionDuration(), ease: 'easeInOut' }}
              className="w-28 h-28 rounded-full bg-[#1b3b2b] text-white flex flex-col items-center justify-center shadow-inner"
            >
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                {phase}
              </span>
            </motion.div>
          </motion.div>

          {/* Current Instruction Text */}
          <div className="mt-8 text-center space-y-1">
            <div className="font-serif font-bold text-lg text-[#1a1917]">
              {instruction}
            </div>
            <div className="text-xs font-mono text-[#827f76]">
              Cycles completed: <span className="font-bold text-[#1b3b2b]">{cycleCount}</span> (Recommended: 3 to 5)
            </div>
          </div>
        </div>

        {/* Protocol Educational Card */}
        <div className="p-4 rounded-xl border border-[#d4c39e] bg-[#fbf8f0] text-xs text-[#52504a] space-y-1">
          <div className="font-mono text-[10px] uppercase font-bold text-[#8a4b16] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Why this works</span>
          </div>
          <p>
            Two quick inhales reinflate collapsed alveoli in the lungs. The extended exhale maximally offloads carbon dioxide, dropping heart rate and autonomic arousal in seconds.
          </p>
        </div>

        {/* Control Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d5] pt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Pause Pacer' : 'Resume Pacer'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white rounded-xl text-xs font-mono text-[#52504a]"
          >
            Finished Reset
          </button>
        </div>

      </div>
    </div>
  );
};

export default BreathPacer;
