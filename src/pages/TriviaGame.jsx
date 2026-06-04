import React, { useState, useEffect } from 'react';
import { 
  Brain, Trophy, Timer, 
  ChevronRight, RotateCcw, 
  Zap, CheckCircle2,
  ArrowLeft, Target, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { CURRICULUM_DATA } from '../services/curriculumData';

// Build a flat question bank from CBSE curriculum data
const buildQuestionBank = () => {
  const questions = [];
  Object.entries(CURRICULUM_DATA).forEach(([grade, subjects]) => {
    Object.entries(subjects).forEach(([subject, data]) => {
      (data.chapters || []).forEach(chapter => {
        (chapter.qna || []).forEach(item => {
          if (item.q && item.a) {
            questions.push({
              question: item.q,
              answer: item.a,
              subject,
              chapter: chapter.title,
              grade,
            });
          }
        });
      });
    });
  });
  return questions;
};

const ALL_QUESTIONS = buildQuestionBank();

// Generate MCQ options from a correct answer using other answers as distractors
const generateMCQ = (correctItem, allItems) => {
  const distractors = allItems
    .filter(q => q.answer !== correctItem.answer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(q => q.answer.length > 80 ? q.answer.substring(0, 80) + '...' : q.answer);

  const correctAnswer = correctItem.answer.length > 80
    ? correctItem.answer.substring(0, 80) + '...'
    : correctItem.answer;

  const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    question: correctItem.question,
    options,
    correctIndex,
    explanation: correctItem.answer,
    subject: correctItem.subject,
    chapter: correctItem.chapter,
  };
};

const getQuestionsForTopic = (topic, count = 5) => {
  const pool = topic
    ? ALL_QUESTIONS.filter(q =>
        q.subject.toLowerCase().includes(topic.toLowerCase()) ||
        q.chapter.toLowerCase().includes(topic.toLowerCase())
      )
    : ALL_QUESTIONS;

  const source = pool.length >= count ? pool : ALL_QUESTIONS;
  const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(item => generateMCQ(item, source));
};

const SUBJECTS = ['Mathematics', 'Science', 'English'];

const TriviaGame = () => {
  const [gameState, setGameState] = useState('config');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [decks, setDecks] = useState([]);

  useEffect(() => { fetchDecks(); }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !feedback) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && !feedback) {
      handleAnswer(null);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback]);

  const fetchDecks = async () => {
    const list = await dataService.list('decks');
    setDecks(list);
  };

  const startGame = (topic = '') => {
    const qs = getQuestionsForTopic(topic, 5);
    if (qs.length === 0) {
      notificationService.send('No Questions Found', 'Try a different subject or topic.', 'error');
      return;
    }
    setQuestions(qs);
    setSubject(topic);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setTimeLeft(20);
    setGameState('playing');
  };

  const handleAnswer = (idx) => {
    const correct = idx === questions[currentIdx].correctIndex;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      const timeBonus = Math.floor(timeLeft / 2);
      const points = 10 + timeBonus;
      setScore(prev => prev + points);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setFeedback(null);
        setTimeLeft(20);
      } else {
        const finalXp = score * 2 + (correct ? 20 : 0);
        xpService.awardXp(finalXp, `Trivia Mastery: ${subject || 'General CBSE'}`);
        notificationService.send('Round Complete! 🏆', `Gained +${finalXp} XP for your trivia session.`, 'success');
        setGameState('results');
      }
    }, 2000);
  };

  if (gameState === 'config') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 nv-page-transition">
        <header className="flex items-center gap-8">
          <button onClick={() => window.location.hash = '/study-verse'} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all border border-white/5">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">CBSE Trivia</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">Test Your Curriculum Knowledge. Earn XP.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Subject Selection */}
          <div className="nv-card p-10 space-y-8 bg-white/[0.01]">
            <div className="w-16 h-16 rounded-2xl bg-nuvio-purple-500 flex items-center justify-center text-white shadow-xl shadow-nuvio-purple-500/20">
              <Brain className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Pick a Subject</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest leading-relaxed">Choose a CBSE subject to generate questions from the curriculum.</p>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {SUBJECTS.map(s => (
                  <button
                    key={s}
                    onClick={() => startGame(s)}
                    className="nv-card flex items-center gap-4 p-5 border-white/5 hover:border-nuvio-purple-500/40 group transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 font-black group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all text-lg">
                      {s === 'Mathematics' ? '📐' : s === 'Science' ? '🔬' : '📖'}
                    </div>
                    <span className="font-black text-white uppercase tracking-tight text-sm">{s}</span>
                    <ChevronRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-white transition-colors" />
                  </button>
                ))}
                <button
                  onClick={() => startGame('')}
                  className="nv-card flex items-center gap-4 p-5 border-nuvio-purple-500/20 bg-nuvio-purple-500/5 hover:border-nuvio-purple-500/60 group transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500/20 flex items-center justify-center text-nuvio-purple-400 font-black text-lg">🎲</div>
                  <span className="font-black text-nuvio-purple-300 uppercase tracking-tight text-sm">Random Mix</span>
                  <ChevronRight className="w-4 h-4 text-nuvio-purple-400 ml-auto group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Decks */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">From Your Flashcard Decks</h3>
            <div className="space-y-4">
              {decks.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => startGame(deck.title)}
                  className="w-full nv-card p-6 flex items-center justify-between border-white/5 hover:border-nuvio-purple-400 group transition-all"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 font-black group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{deck.title}</div>
                      <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{deck.cards?.length || 0} Cards</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
                </button>
              ))}
              {decks.length === 0 && (
                <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-30">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">No Flashcard Decks Yet</p>
                  <p className="text-[8px] text-text-muted mt-1">Create decks in Flashcards to use them here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const q = questions[currentIdx];
    return (
      <div className="max-w-3xl mx-auto space-y-12 pb-32 nv-page-transition">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white">
              <Brain className="w-8 h-8 text-nuvio-purple-400" />
            </div>
            <div>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Question {currentIdx + 1} / {questions.length}</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight truncate max-w-[200px]">{q.subject || 'General'}</h3>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Time</div>
              <div className={`text-2xl font-black ${timeLeft < 5 ? 'text-nuvio-red animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Streak</div>
              <div className="text-2xl font-black text-nuvio-yellow flex items-center gap-2">
                <Zap className="w-5 h-5 fill-nuvio-yellow" /> {streak}
              </div>
            </div>
          </div>
        </header>

        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="nv-card p-12 border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent relative shadow-2xl"
        >
          {q.chapter && (
            <div className="text-[9px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em] mb-4">
              📚 {q.chapter}
            </div>
          )}
          <h2 className="text-2xl font-black text-white leading-tight mb-12 border-l-4 border-nuvio-purple-500 pl-8">
            {q.question}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {q.options.map((option, idx) => {
              const isCorrect = idx === q.correctIndex;
              return (
                <button
                  key={idx}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(idx)}
                  className={`
                    w-full p-8 rounded-[24px] border-2 text-left transition-all relative group
                    ${!feedback ? 'bg-white/5 border-white/5 hover:border-nuvio-purple-500/50 hover:bg-white/[0.08]' :
                      isCorrect ? 'bg-nuvio-green/20 border-nuvio-green text-nuvio-green shadow-[0_0_40px_rgba(34,197,94,0.1)]' :
                      'bg-white/5 border-white/5 opacity-40'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-black transition-colors ${!feedback ? 'text-white' : isCorrect ? 'text-nuvio-green' : 'text-text-muted'}`}>
                      {option}
                    </span>
                    {feedback && isCorrect && <CheckCircle2 className="w-7 h-7 text-nuvio-green flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-8 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-6 border-l-4 border-l-nuvio-blue"
              >
                <div className="w-10 h-10 rounded-xl bg-nuvio-blue/10 flex items-center justify-center text-nuvio-blue">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-black text-nuvio-blue uppercase tracking-widest mb-1">Explanation</div>
                  <p className="text-sm font-medium text-text-secondary leading-relaxed">{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="max-w-2xl mx-auto space-y-12 pb-32 nv-page-transition mt-12">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-nuvio-yellow rounded-[40px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-yellow-500/20 rotate-12">
            <Trophy className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Round Complete!</h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em]">CBSE Knowledge Test Finished</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="nv-card p-10 text-center border-white/5 bg-gradient-to-br from-nuvio-purple-500/10 to-transparent">
            <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest mb-2">XP Earned</div>
            <div className="text-5xl font-black text-white">+{score * 2}</div>
          </div>
          <div className="nv-card p-10 text-center border-white/5 bg-gradient-to-br from-nuvio-yellow/10 to-transparent">
            <div className="text-[10px] font-black text-nuvio-yellow uppercase tracking-widest mb-2">Best Streak</div>
            <div className="text-5xl font-black text-white">{bestStreak}</div>
          </div>
        </div>

        <button
          onClick={() => setGameState('config')}
          className="nv-btn-primary w-full h-20 text-sm font-black uppercase tracking-[0.3em] gap-4 flex items-center justify-center"
        >
          <RotateCcw className="w-6 h-6" /> Play Again
        </button>

        <button
          onClick={() => window.location.hash = '/study-verse'}
          className="w-full text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors"
        >
          Back to StudyVerse
        </button>
      </div>
    );
  }

  return null;
};

export default TriviaGame;
