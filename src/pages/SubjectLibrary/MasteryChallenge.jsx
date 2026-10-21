import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import './styles.css';

const MasteryChallenge = ({ questions = [], playSound, onComplete }) => {
  const [active, setActive] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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

  const getRating = (acc) => {
    if (acc === 100) return { title: "Academic Distinction", desc: "Flawless score across all curriculum checkpoints." };
    if (acc >= 80) return { title: "High Honors", desc: "Thorough comprehension of subject standards." };
    if (acc >= 60) return { title: "Proficient", desc: "Sound foundational knowledge; minor review suggested." };
    return { title: "Needs Review", desc: "Revisit earlier chapter concepts to build confidence." };
  };

  const accuracy = Math.round((score / (questions.length || 1)) * 100) || 0;
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
      className="max-w-xl mx-auto space-y-6 text-left"
    >
      <div className="text-center space-y-1 mb-6">
        <span className="px-3 py-1 bg-[#ede9de] border border-[#d8d4c7] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase">
          Step 7: Mastery Verification
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1917] mt-2">
          Mastery Diagnostic
        </h2>
        <p className="text-[#52504a] text-xs">
          Comprehensive verification test under active timing and confidence ratings.
        </p>
      </div>

      {!active ? (
        /* Welcome card */
        <div className="bg-white border border-[#e5e1d5] rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-[#1a1917]">
              Evaluate Subject Proficiency
            </h3>
            <p className="text-xs text-[#52504a] leading-relaxed max-w-sm mx-auto">
              This diagnostic checks factual accuracy, problem-solving speed, and confidence calibration. Answer all questions to complete this chapter.
            </p>
          </div>

          <div className="flex justify-center gap-6 text-xs text-[#52504a] font-mono">
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#1b3b2b]" /> Diagnostic Timer</div>
            <div className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#1b3b2b]" /> Confidence Log</div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all active:scale-95"
          >
            Start Diagnostic Session
          </button>
        </div>
      ) : !currentQuestion || challengeFinished ? (
        /* Final Results */
        <div className="bg-white border border-[#e5e1d5] rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-widest font-bold">Diagnostic Result</span>
            <h3 className="text-2xl font-serif font-bold text-[#1b3b2b] mt-1">
              {getRating(accuracy).title}
            </h3>
            <p className="text-xs text-[#52504a]">{getRating(accuracy).desc}</p>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#fbfbfa] border border-[#e5e1d5] p-4 rounded-xl">
              <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider font-bold">Accuracy</span>
              <strong className="text-xl font-serif font-bold text-[#1b3b2b]">{accuracy}%</strong>
            </div>
            
            <div className="bg-[#fbfbfa] border border-[#e5e1d5] p-4 rounded-xl">
              <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider font-bold">Duration</span>
              <strong className="text-xl font-serif font-bold text-[#1a1917]">{seconds}s</strong>
            </div>

            <div className="bg-[#fbfbfa] border border-[#e5e1d5] p-4 rounded-xl">
              <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider font-bold">Confidence</span>
              <strong className="text-xl font-serif font-bold text-[#1a1917]">{avgConfidence}%</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="w-full py-3 border border-[#e5e1d5] bg-[#f5f3ec] hover:bg-[#ede9de] text-[#1a1917] font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic
            </button>
          </div>
        </div>
      ) : (
        /* Live Question */
        <div className="space-y-4 text-left">
          {/* Diagnostic live timer panel */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5 border border-[#e5e1d5] rounded-xl shadow-sm">
            <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-widest font-bold">
              Elapsed Time
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#1b3b2b] font-mono font-bold">
              <Clock className="w-4 h-4" /> {seconds}s
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white border border-[#e5e1d5] rounded-2xl p-6 md:p-8 space-y-3 shadow-sm">
            <span className="inline-block px-2.5 py-1 bg-[#f5f3ec] border border-[#e5e1d5] rounded text-[10px] font-mono font-bold uppercase tracking-widest text-[#1b3b2b]">
              Diagnostic Check
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1917] leading-relaxed">
              {currentQuestion.q}
            </h3>
          </div>

          {/* Options list */}
          <div className="grid grid-cols-1 gap-2.5">
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
                  className={`w-full p-4 border rounded-xl text-xs font-sans text-left transition-all ${
                    isCorrectFeedback
                      ? 'bg-[#f5f3ec] border-[#1b3b2b] text-[#1b3b2b] font-bold'
                      : isIncorrectFeedback
                        ? 'bg-[#fdf2f2] border-[#e07d7d] text-[#8e2424]'
                        : isSelected
                          ? 'bg-[#f5f3ec] border-[#1b3b2b] text-[#1b3b2b]'
                          : 'bg-white border-[#e5e1d5] text-[#1a1917] hover:border-[#1b3b2b]/40 hover:bg-[#fbfbfa] disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrectFeedback && <span className="text-[10px] font-mono font-bold text-[#1b3b2b]">✓ Correct</span>}
                    {isIncorrectFeedback && <span className="text-[10px] font-mono font-bold text-[#8e2424]">✗ Incorrect</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confidence Selector */}
          {!submitted && (
            <div className="p-4 bg-white border border-[#e5e1d5] rounded-xl space-y-2.5 shadow-sm">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76] text-center">
                Rate confidence before selecting an answer
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'unsure', label: 'Unsure', rating: 20 },
                  { id: 'partial', label: 'Moderate', rating: 60 },
                  { id: 'sure', label: 'Confident', rating: 100 }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setConfidence(item.id)}
                    className={`py-2 text-[10px] font-mono uppercase font-bold border rounded-lg transition-all ${
                      confidence === item.id 
                        ? 'bg-[#1b3b2b] text-white border-transparent shadow-sm' 
                        : 'bg-[#fbfbfa] border-[#e5e1d5] text-[#52504a] hover:text-[#1a1917]'
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
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <span>{qIdx + 1 === questions.length ? 'Finalize Diagnostic' : 'Next Question ➔'}</span>
              </button>
            </div>
          )}

        </div>
      )}
    </motion.div>
  );
};

export default MasteryChallenge;
