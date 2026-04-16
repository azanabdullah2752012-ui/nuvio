import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, AlertCircle } from 'lucide-react';

const NeuralComms = () => {
  const [nudge, setNudge] = useState(null);

  useEffect(() => {
    // Listen for system nudges
    const handleNudge = (e) => {
      setNudge(e.detail);
      setTimeout(() => setNudge(null), 8000);
    };

    window.addEventListener('nuvio_neural_nudge', handleNudge);
    return () => window.removeEventListener('nuvio_neural_nudge', handleNudge);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-[100] pointer-events-none">
      <AnimatePresence>
        {nudge && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-[350px] bg-black border-4 border-nuvio-purple-500 shadow-nb p-6 pointer-events-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <Brain className="w-20 h-20" />
            </div>
            
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500 flex items-center justify-center text-black shrink-0">
                  {nudge.type === 'streak' ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest leading-none">Neural Transmission</div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{nudge.title}</h4>
                  <p className="text-[11px] text-text-secondary font-medium leading-relaxed">{nudge.message}</p>
               </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
               <button 
                 onClick={() => setNudge(null)}
                 className="flex-1 py-2 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
               >
                 Dismiss
               </button>
               <button 
                 className="flex-1 py-2 bg-nuvio-purple-500 text-black text-[9px] font-black uppercase tracking-widest shadow-nb-small active:translate-y-1 active:shadow-none transition-all"
               >
                 Acknowledge
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralComms;
