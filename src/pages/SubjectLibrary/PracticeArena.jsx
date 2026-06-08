import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Zap, Trophy, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import './styles.css';

const PracticeArena = ({ questions, subject, onCorrectAnswer, playSound }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Game metrics
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions && questions[qIdx] ? questions[qIdx] : null;

  // Combo multiplier: increments every 3 consecutive correct answers
  const multiplier = 1 + Math.floor(streak / 3) * 0.5;

  const handleSubmit = (option) => {
    if (submitted) return;
    setSelectedOpt(option);
    setSubmitted(true);

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      // Calculate multiplier rewards
      const baseXP = 15;
      const baseCoins = 5;
      const addedXP = Math.round(baseXP * multiplier);
      const addedCoins = Math.round(baseCoins * multiplier);
      
      setXpEarned(prev => prev + addedXP);
      setCoinsEarned(prev => prev + addedCoins);
      
      // Award XP globally
      xpService.awardXp(addedXP, `Practice Streak ${nextStreak}x`);
      authService.addTokens(addedCoins);

      // Trigger hit combat and correct sound
      if (onCorrectAnswer) onCorrectAnswer(100);
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
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 }
      });
      // Increment quizzes correct stats
      gamificationService.incrementStat('stats_quizzes_correct', score);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto space-y-6"
    >
      {/* HUD Header Panel */}
      <div className="glass-panel px-5 py-4 flex items-center justify-between border border-white/10 shadow">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
          <Flame className={`w-4 h-4 text-rose-500 ${streak > 0 ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">
            {streak} Streak
          </span>
        </div>

        {/* Combo Multiplier indicator */}
        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">
            {multiplier.toFixed(1)}x Multiplier
          </span>
        </div>

        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Q {qIdx + 1} of {questions.length}
        </span>
      </div>

      {!currentQuestion ? (
        <div className="text-center p-8 bg-slate-900/30 border border-white/5 rounded-xl text-text-muted text-xs">
          No questions available in the practice bank.
        </div>
      ) : quizFinished ? (
        /* Summary Screen */
        <div className="glass-panel p-8 text-center space-y-6 border-purple-500/20 shadow-lg">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black uppercase text-white tracking-tight">Arena Completed!</h3>
          
          <div className="py-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Final Accuracy</span>
            <div className="text-5xl font-black text-purple-400 font-mono mt-1">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <span className="block text-xs font-semibold text-slate-400 mt-1">
              Solved {score} of {questions.length} questions correctly.
            </span>
          </div>

          <div className="bg-slate-950 p-4 border border-white/5 rounded-lg grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Total XP Gained</span>
              <strong className="text-md font-black text-purple-400">+{xpEarned} XP</strong>
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Coins Earned</span>
              <strong className="text-md font-black text-amber-400">+{coinsEarned} Coins</strong>
            </div>
          </div>

          <button
            onClick={() => {
              setQIdx(0);
              setSelectedOpt(null);
              setSubmitted(false);
              setStreak(0);
              setScore(0);
              setXpEarned(0);
              setCoinsEarned(0);
              setQuizFinished(false);
            }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-purple-500/25 transition-all"
          >
            Restart Arena
          </button>
        </div>
      ) : (
        /* Question Form card */
        <div className="space-y-6 text-left">
          
          {/* Question Card */}
          <div className="glass-panel p-6 md:p-8 space-y-4 relative overflow-hidden">
            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] font-black uppercase tracking-widest text-purple-400">
              NCERT recall test
            </span>
            <h3 className="text-sm md:text-base font-bold text-white leading-relaxed">
              {currentQuestion.q}
            </h3>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 gap-3">
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
                  className={`w-full p-4 border-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    isCorrectFeedback 
                      ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : isIncorrectFeedback
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : isSelected
                          ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                          : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-850 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrectFeedback && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-green-500 text-black px-2 py-0.5 rounded shadow shrink-0">
                        ✓ Correct
                      </span>
                    )}
                    {isIncorrectFeedback && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-rose-500 text-black px-2 py-0.5 rounded shadow shrink-0">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Correct feedback & explanations */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {currentQuestion.explanation && (
                <div className="p-4 bg-slate-900 border border-white/10 rounded-lg text-xs leading-relaxed text-slate-450 font-semibold shadow">
                  <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Concept Explanation
                  </span>
                  {currentQuestion.explanation}
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-purple-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {qIdx + 1 === questions.length ? 'Complete Arena 🏆' : 'Next Question ➔'}
              </button>
            </motion.div>
          )}

        </div>
      )}
    </motion.div>
  );
};

export default PracticeArena;
