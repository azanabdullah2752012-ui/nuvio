import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Target, Smile, Star, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import './styles.css';

const MasteryChallenge = ({ questions, playSound, onComplete }) => {
  const [active, setActive] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [confidence, setConfidence] = useState(null); // 'unsure' | 'partial' | 'sure'
  const [submitted, setSubmitted] = useState(false);

  // Challenge tracking
  const [score, setScore] = useState(0);
  const [confidenceLogs, setConfidenceLogs] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [challengeFinished, setChallengeFinished] = useState(false);

  const timerRef = useRef(null);
  const currentQuestion = questions && questions[qIdx] ? questions[qIdx] : null;

  useEffect(() => {
    if (active && !challengeFinished) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [active, challengeFinished]);

  const handleStart = () => {
    setActive(true);
    setQIdx(0);
    setSelectedOpt(null);
    setConfidence(null);
    setSubmitted(false);
    setScore(0);
    setConfidenceLogs([]);
    setSeconds(0);
    setChallengeFinished(false);
  };

  const handleSubmit = (option) => {
    if (submitted || !confidence) return;
    setSelectedOpt(option);
    setSubmitted(true);

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (playSound) playSound('correct');
    } else {
      if (playSound) playSound('incorrect');
    }

    setConfidenceLogs(prev => [...prev, confidence]);
  };

  const handleNext = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setConfidence(null);
      setSubmitted(false);
    } else {
      setChallengeFinished(true);
      clearInterval(timerRef.current);
      if (playSound) playSound('complete');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
      if (onComplete) onComplete(score);
    }
  };

  // Resolve final rating
  const getRating = (acc) => {
    if (acc === 100) return { title: "Grand Master 👑", color: "text-amber-400 glow-text-purple", bg: "bg-amber-400/10 border-amber-400" };
    if (acc >= 80) return { title: "Gold Scholar 🥇", color: "text-yellow-400 glow-text-cyan", bg: "bg-yellow-400/10 border-yellow-400" };
    if (acc >= 60) return { title: "Silver Knight 🥈", color: "text-slate-350", bg: "bg-slate-400/10 border-slate-400" };
    return { title: "Bronze Scout 🥉", color: "text-amber-600", bg: "bg-amber-700/10 border-amber-700" };
  };

  const accuracy = Math.round((score / questions.length) * 100) || 0;
  const avgConfidence = (() => {
    if (confidenceLogs.length === 0) return 0;
    const scores = confidenceLogs.map(c => c === 'sure' ? 100 : c === 'partial' ? 60 : 20);
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / confidenceLogs.length);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="text-center space-y-1 mb-8">
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase">
          Step 7: Final Masterclass Test
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-2">
          Mastery Challenge
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Final verification arena. Test all concepts under live diagnostic limits.
        </p>
      </div>

      {!active ? (
        /* Welcome card */
        <div className="glass-panel p-8 text-center space-y-6 border-purple-500/20 shadow-lg">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase text-white tracking-tight">Unlock Mastery Rating</h3>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold max-w-sm mx-auto">
              This challenge evaluates accuracy, speed, and confidence. Answer all questions to claim your medal.
            </p>
          </div>

          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-400 font-mono">
            <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-cyan-400" /> Live Timer</div>
            <div className="flex items-center gap-1"><Target className="w-4 h-4 text-purple-400" /> Confidence rating</div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-purple-500/25 transition-all active:scale-95"
          >
            Start Challenge ⚔️
          </button>
        </div>
      ) : !currentQuestion || challengeFinished ? (
        /* Final Results Medals */
        <div className="glass-panel p-8 text-center space-y-6 border-purple-500/20 shadow-lg">
          <div className="space-y-1">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Medal Earned</span>
            <h3 className={`text-3xl font-black uppercase tracking-tight ${getRating(accuracy).color}`}>
              {getRating(accuracy).title}
            </h3>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-white/10 p-4 rounded-lg">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span>
              <strong className="text-lg font-black text-purple-400 font-mono">{accuracy}%</strong>
            </div>
            
            <div className="bg-slate-900 border border-white/10 p-4 rounded-lg">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Time Taken</span>
              <strong className="text-lg font-black text-cyan-400 font-mono">{seconds}s</strong>
            </div>

            <div className="bg-slate-900 border border-white/10 p-4 rounded-lg">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
              <strong className="text-lg font-black text-green-400 font-mono">{avgConfidence}%</strong>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleStart}
              className="flex-1 py-3.5 border border-white/10 bg-slate-800 text-slate-350 hover:text-white font-black uppercase tracking-widest text-[9px] rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        /* Live Question */
        <div className="space-y-6 text-left">
          {/* Diagnostic live timer panel */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 border border-white/10 rounded-lg">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Live Challenge Timer
            </span>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-black font-mono">
              <Clock className="w-4 h-4 animate-spin" /> {seconds}s
            </div>
          </div>

          {/* Question card */}
          <div className="glass-panel p-6 md:p-8 space-y-4">
            <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-[8px] font-black uppercase tracking-widest text-yellow-400">
              Mixed syllabus concept check
            </span>
            <h3 className="text-sm md:text-base font-bold text-white leading-relaxed">
              {currentQuestion.q}
            </h3>
          </div>

          {/* Options list */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOpt === opt;
              const isCorrectAnswer = opt === currentQuestion.answer;
              const isCorrectFeedback = submitted && isCorrectAnswer;
              const isIncorrectFeedback = submitted && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={oIdx}
                  disabled={submitted || !confidence}
                  onClick={() => handleSubmit(opt)}
                  className={`w-full p-4 border-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    isCorrectFeedback
                      ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : isIncorrectFeedback
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : isSelected
                          ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                          : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-850 hover:border-white/10 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrectFeedback && <span className="text-[9px] font-black uppercase text-green-400 bg-black px-2 py-0.5 rounded border border-black shadow">✓ Correct</span>}
                    {isIncorrectFeedback && <span className="text-[9px] font-black uppercase text-rose-400 bg-black px-2 py-0.5 rounded border border-black shadow">✗ Incorrect</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence Slider (Locks option clicking until confidence is selected) */}
          {!submitted && (
            <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">
                Rate your confidence level to unlock choice buttons
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'unsure', label: '🔴 Unsure', rating: 20 },
                  { id: 'partial', label: '🟡 Guessing', rating: 60 },
                  { id: 'sure', label: '🟢 100% Sure', rating: 100 }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setConfidence(item.id)}
                    className={`py-2 text-[9px] font-black uppercase border rounded transition-all ${
                      confidence === item.id 
                        ? 'bg-purple-500 text-black border-transparent shadow' 
                        : 'bg-slate-950 border-white/5 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                {qIdx + 1 === questions.length ? 'Calculate Medal 🏆' : 'Next Question ➔'}
              </button>
            </motion.div>
          )}

        </div>
      )}
    </motion.div>
  );
};

export default MasteryChallenge;
