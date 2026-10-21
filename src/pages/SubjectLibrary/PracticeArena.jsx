import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Flame, RotateCcw, Target, Check, X, ArrowRight } from 'lucide-react';
import './styles.css';

const PracticeArena = ({ questions = [], subject, playSound }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Academic Practice Metrics
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions && questions[qIdx] ? questions[qIdx] : null;

  const handleSubmit = (option) => {
    if (submitted) return;
    setSelectedOpt(option);
    setSubmitted(true);

    const isCorrect = option === currentQuestion?.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (playSound) playSound('correct');
    } else {
      setStreak(0);
      if (playSound) playSound('incorrect');
    }
  };

  const handleNext = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setQuizFinished(true);
      if (playSound) playSound('complete');
    }
  };

  const handleRestart = () => {
    setQIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setStreak(0);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto space-y-6 font-sans"
    >
      {/* Header Panel */}
      <div className="p-4 border border-white/10 bg-[#0d0f14] rounded-xl flex items-center justify-between">
        {/* Streak Indicator */}
        <div className="flex items-center gap-2 bg-[#ff4625]/10 border border-[#ff4625]/20 px-3 py-1.5 rounded-lg">
          <Flame className={`w-3.5 h-3.5 text-[#ff4625] ${streak > 0 ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold">
            {streak} Recall Streak
          </span>
        </div>

        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          Question {qIdx + 1} of {questions.length}
        </span>
      </div>

      {!currentQuestion ? (
        <div className="text-center p-8 bg-[#0d0f14] border border-white/10 rounded-xl text-zinc-400 text-xs">
          No practice questions registered for this chapter.
        </div>
      ) : quizFinished ? (
        /* Summary Screen */
        <div className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#ff4625]/10 border border-[#ff4625]/20 text-[#ff4625] flex items-center justify-center mx-auto">
            <Target className="w-7 h-7" />
          </div>
          
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Practice Session Complete</span>
            <h3 className="text-2xl font-bold uppercase text-white font-clash mt-1">
              NCERT Knowledge Check
            </h3>
          </div>
          
          <div className="p-4 bg-[#08090b] border border-white/5 rounded-xl">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Accuracy Ratio</span>
            <div className="text-4xl font-bold text-white font-clash mt-1">
              {Math.round((score / (questions.length || 1)) * 100)}%
            </div>
            <span className="block text-xs font-mono text-zinc-400 mt-1">
              Solved {score} of {questions.length} accurately
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Question Set</span>
          </button>
        </div>
      ) : (
        /* Question Form card */
        <div className="space-y-4 text-left">
          
          {/* Question Card */}
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625]">
              CBSE Multiple Choice Check
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQuestion.q}
            </h3>
          </div>

          {/* Options grid */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOpt === opt;
              const isCorrectAnswer = opt === currentQuestion.answer;
              const isCorrectFeedback = submitted && isCorrectAnswer;
              const isIncorrectFeedback = submitted && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={oIdx}
                  disabled={submitted}
                  onClick={() => handleSubmit(opt)}
                  className={`w-full p-4 border rounded-xl text-xs font-sans text-left transition-all flex items-center justify-between ${
                    isCorrectFeedback 
                      ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                      : isIncorrectFeedback
                      ? 'bg-rose-500/10 border-rose-500 text-white'
                      : 'bg-[#0d0f14] border-white/5 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrectFeedback && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isIncorrectFeedback && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {submitted && (
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-white text-black font-mono uppercase tracking-widest text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-zinc-200"
              >
                <span>{qIdx + 1 < questions.length ? 'Next Question' : 'View Session Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PracticeArena;