import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, X, ArrowRight, RotateCcw } from 'lucide-react';
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
      className="max-w-xl mx-auto space-y-6 font-sans text-left"
    >
      {/* Header Panel */}
      <div className="p-4 border border-[#e5e1d5] bg-white rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 bg-[#f5f3ec] border border-[#e5e1d5] px-3 py-1.5 rounded-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#1b3b2b] font-bold">
            {streak} In A Row
          </span>
        </div>

        <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-widest font-semibold">
          Question {qIdx + 1} of {questions.length}
        </span>
      </div>

      {!currentQuestion ? (
        <div className="text-center p-8 bg-white border border-[#e5e1d5] rounded-xl text-[#827f76] text-xs font-mono uppercase">
          No practice questions registered for this chapter.
        </div>
      ) : quizFinished ? (
        /* Summary Screen */
        <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] text-[#1b3b2b] flex items-center justify-center mx-auto">
            <Target className="w-7 h-7" />
          </div>
          
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#827f76] font-bold">
              Practice Session Complete
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#1a1917] mt-1">
              NCERT Knowledge Check
            </h3>
          </div>
          
          <div className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl max-w-sm mx-auto">
            <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-widest font-bold">
              Accuracy Ratio
            </span>
            <div className="text-4xl font-serif font-bold text-[#1b3b2b] mt-1">
              {Math.round((score / (questions.length || 1)) * 100)}%
            </div>
            <span className="block text-xs text-[#52504a] mt-1">
              Solved {score} of {questions.length} accurately
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Question Set</span>
          </button>
        </div>
      ) : (
        /* Question Form card */
        <div className="space-y-4 text-left">
          
          {/* Question Card */}
          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl space-y-3 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#1b3b2b] font-bold">
              Multiple Choice Exercise
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1917] leading-relaxed">
              {currentQuestion.q}
            </h3>
          </div>

          {/* Options grid */}
          <div className="space-y-2.5">
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
                      ? 'bg-[#f5f3ec] border-[#1b3b2b] text-[#1b3b2b] font-bold' 
                      : isIncorrectFeedback
                      ? 'bg-[#fdf2f2] border-[#e07d7d] text-[#8e2424]'
                      : 'bg-white border-[#e5e1d5] text-[#1a1917] hover:border-[#1b3b2b]/40 hover:bg-[#fbfbfa]'
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrectFeedback && <Check className="w-4 h-4 text-[#1b3b2b] shrink-0" />}
                  {isIncorrectFeedback && <X className="w-4 h-4 text-[#8e2424] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {submitted && (
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <span>{qIdx + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
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
