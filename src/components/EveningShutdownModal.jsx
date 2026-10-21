import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ArrowRight, Moon, 
  Sparkles, Check, AlertCircle, Sun, Calendar
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const EveningShutdownModal = ({ isOpen, onClose, tasks, onCompleteShutdown }) => {
  const [step, setStep] = useState(1); // 1: Wins, 2: Rollover, 3: Tomorrow's Highlight, 4: Complete
  const [tomorrowHighlight, setTomorrowHighlight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const completedToday = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3); // A4
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    playChime();

    // If user provided a highlight for tomorrow, create it as tomorrow's highlight
    if (tomorrowHighlight.trim()) {
      await dataService.create('tasks', {
        title: tomorrowHighlight.trim(),
        pillar: 'Craft',
        energy: 'Deep 90m',
        due: 'Tomorrow',
        priority: 'High',
        isHighlight: true,
        completed: false
      });
    }

    await dataService.recordShutdown({
      completedCount: completedToday.length,
      pendingCount: pendingTasks.length,
      tomorrowHighlight: tomorrowHighlight.trim() || 'Pre-scheduled tasks'
    });

    setStep(4);
    setIsSubmitting(false);

    if (onCompleteShutdown) {
      onCompleteShutdown();
    }
  };

  const handleClose = () => {
    setStep(1);
    setTomorrowHighlight('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#fbfbfa] border border-[#e5e1d5] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden font-sans text-left"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#e5e1d5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1b3b2b]/10 text-[#1b3b2b] flex items-center justify-center text-sm">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#827f76] font-bold">
                Cal Newport Protocol
              </div>
              <div className="font-serif font-bold text-base text-[#1a1917]">
                The 60-Second Evening Shutdown
              </div>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-[#827f76] hover:text-[#1a1917] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: AUDIT TODAY'S WINS */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1b3b2b] font-bold">
                  Step 1 of 3 // Close The Mental Ledger
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1a1917]">
                  Today's Completed Directives ({completedToday.length})
                </h3>
                <p className="text-xs text-[#52504a]">
                  Acknowledge what you moved forward. Eliminate the Zeigarnik effect by recognizing your progress.
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-[#e5e1d5] rounded-xl p-3 bg-white">
                {completedToday.length === 0 ? (
                  <div className="text-xs text-[#827f76] font-mono text-center py-4">
                    No completed tasks recorded yet today. Let's reset cleanly for tomorrow.
                  </div>
                ) : (
                  completedToday.map(t => (
                    <div key={t.id} className="flex items-center gap-2.5 text-xs text-[#1a1917] py-1 border-b border-[#f4f1ea] last:border-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1b3b2b] shrink-0" />
                      <span className="line-through text-[#827f76] truncate">{t.title}</span>
                      <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#f4f1ea] text-[#52504a]">
                        {t.pillar || 'Craft'}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CLEAR UNFINISHED GUILT */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1b3b2b] font-bold">
                  Step 2 of 3 // Unburden The Slate
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1a1917]">
                  Pending Items ({pendingTasks.length})
                </h3>
                <p className="text-xs text-[#52504a]">
                  Unfinished tasks are safely kept in your backlog. Do not carry work anxiety into your evening.
                </p>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-2 pr-1 border border-[#e5e1d5] rounded-xl p-3 bg-white">
                {pendingTasks.length === 0 ? (
                  <div className="text-xs text-[#1b3b2b] font-mono text-center py-4">
                    ✨ Your queue is 100% clear. Masterful execution today!
                  </div>
                ) : (
                  pendingTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between text-xs py-1 border-b border-[#f4f1ea] last:border-0">
                      <span className="truncate max-w-[340px] text-[#52504a]">{t.title}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f4f1ea] text-[#827f76]">
                        Deferred
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#827f76] hover:text-[#1a1917]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <span>Lock Tomorrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TOMORROW'S DAILY HIGHLIGHT */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1b3b2b] font-bold">
                  Step 3 of 3 // Hormozi Night-Before Rule
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1a1917]">
                  Tomorrow's Single Anchor Highlight
                </h3>
                <p className="text-xs text-[#52504a]">
                  What is the #1 non-negotiable directive that will move the needle tomorrow morning?
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={tomorrowHighlight}
                  onChange={(e) => setTomorrowHighlight(e.target.value)}
                  placeholder="e.g. 90m deep work on core product release..."
                  className="w-full px-4 py-3 bg-white border border-[#e5e1d5] rounded-xl text-sm focus:outline-none focus:border-[#1b3b2b] font-serif placeholder:font-sans placeholder:text-xs"
                  autoFocus
                />
                <div className="text-[10px] font-mono text-[#827f76]">
                  Planning this tonight eliminates morning hesitation so you execute immediately upon waking.
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-mono text-[#827f76] hover:text-[#1a1917]"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  <span>Schedule Shutdown, Complete.</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CLOSING PHRASE & FREEDOM */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1b3b2b] text-white flex items-center justify-center text-2xl shadow-md">
                ✓
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#1b3b2b] font-bold">
                  RITUAL EXECUTED
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1a1917]">
                  "Schedule Shutdown, Complete."
                </h3>
                <p className="text-xs text-[#52504a] max-w-sm mx-auto leading-relaxed">
                  Your work is safely catalogued. Close your laptop, step away from screens, and restore your mind with your tribe and restful sleep.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#f4f1ea] hover:bg-[#e8e4d9] text-[#1a1917] font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all"
                >
                  Close Workstation
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default EveningShutdownModal;
