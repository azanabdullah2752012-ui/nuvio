import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Check, Sparkles, ArrowRight } from 'lucide-react';
import { dataService } from '../services/dataService';
import { soundEngine } from '../services/soundEngine';

const EveningCloseModal = ({ isOpen, onClose, highlightTask, onComplete }) => {
  const [tomorrowHighlight, setTomorrowHighlight] = useState('');
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleFinish = (e) => {
    e.preventDefault();
    soundEngine.playBell(528);
    dataService.recordEveningClose(tomorrowHighlight);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setTomorrowHighlight('');
      onComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fadeIn text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white border border-[#e8e6df] rounded-3xl w-full max-w-md p-7 sm:p-8 shadow-2xl relative font-sans"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#8e8d8a] hover:text-[#1d1d1f] rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!done ? (
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f4f3ef] flex items-center justify-center text-[#1d1d1f]">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#8e8d8a] font-bold">
                  20-Second Evening Close
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1d1d1f]">
                  Shut down for the evening
                </h3>
              </div>
            </div>

            {/* Today's Highlight Review */}
            {highlightTask && (
              <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e8e6df] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8e8d8a]">Today's Big One:</span>
                <div className="text-xs font-serif text-[#1d1d1f] flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                    highlightTask.completed ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' : 'border-[#8e8d8a]'
                  }`}>
                    {highlightTask.completed && '✓'}
                  </span>
                  <span className={highlightTask.completed ? 'line-through text-[#8e8d8a]' : 'font-medium'}>
                    {highlightTask.title}
                  </span>
                </div>
              </div>
            )}

            {/* Tomorrow's One Thing */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#1d1d1f]">
                What is the single most important thing tomorrow?
              </label>
              <input
                type="text"
                autoFocus
                value={tomorrowHighlight}
                onChange={(e) => setTomorrowHighlight(e.target.value)}
                placeholder="e.g. Write newsletter draft, complete investor deck..."
                className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e8e6df] rounded-2xl text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1b3b2b] transition-colors"
              />
              <p className="text-[11px] text-[#8e8d8a]">
                Locking this tonight means you wake up with zero decision fatigue.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#28553e] text-white font-sans text-xs font-semibold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Close the Day</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1b3b2b] text-white flex items-center justify-center text-xl shadow-sm">
              ✓
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1d1d1f]">
              Day Complete.
            </h3>
            <p className="text-xs text-[#8e8d8a] max-w-xs mx-auto">
              Your mind is clear. Step away from the screen, enjoy your evening, and rest well.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EveningCloseModal;
