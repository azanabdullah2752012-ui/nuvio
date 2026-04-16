import React, { useState, useEffect } from 'react';
import { 
  Brain, Trophy, Timer, 
  ChevronRight, RotateCcw, Sparkles, 
  Zap, AlertCircle, CheckCircle2, XCircle,
  ArrowLeft, Star, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const TriviaGame = () => {
  const [gameState, setGameState] = useState('config'); // config, loading, playing, results
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
  const [timeLeft, setTimeLeft] = useState(20);
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetchContext();
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !feedback) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && !feedback) {
      handleAnswer(null); // Time out counts as wrong
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback]);

  const fetchContext = async () => {
    const list = await dataService.list('decks');
    setDecks(list);
  };

  const generateQuestions = async (topic) => {
    setGameState('loading');
    const prompt = `Generate 5 challenging Multiple Choice Questions (MCQs) for a student study game on the topic: "${topic || 'General Science and History'}".
    Format the response as a valid JSON array of objects. 
    Each object must have:
    - question: string
    - options: array of 4 strings
    - correctIndex: number (0-3)
    - explanation: string (short context)
    Return ONLY the JSON array. Don't include markdown formatting or backticks.`;

    try {
      const response = await aiService.chat(prompt);
      // Strip any accidental markdown if AI includes it
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        setGameState('playing');
        setCurrentIdx(0);
        setScore(0);
        setStreak(0);
        setFeedback(null);
        setTimeLeft(20);
      } else {
        throw new Error("Invalid format received from Neural Core.");
      }
    } catch (err) {
      console.error("Neural Extraction Error:", err);
      notificationService.send("Neural Error", "Nova failed to generate the matrix. Defaulting to backup protocol.", "error");
      setGameState('config');
    }
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
        setGameState('results');
        const finalXp = score * 2;
        xpService.awardXp(finalXp, `Neural Trivia Mastery: ${subject || 'General'}`);
        notificationService.send("Session Complete", `Gained +${finalXp} XP across neural nodes.`, "success");
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
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Neural Trivia</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">Acquire Intelligence. Deploy Knowledge.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="nv-card p-10 space-y-8 bg-white/[0.01]">
              <div className="w-16 h-16 rounded-2xl bg-nuvio-purple-500 flex items-center justify-center text-white shadow-xl shadow-nuvio-purple-500/20">
                <Brain className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Manual Selection</h2>
                 <p className="text-xs text-text-muted font-bold uppercase tracking-widest leading-relaxed">Enter a specific target subject for the Neural Core to generate questions about.</p>
                 <input 
                   className="nv-input mt-4" 
                   placeholder="e.g. Ancient Rome, Calculus, Periodic Table..."
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && generateQuestions(subject)}
                 />
                 <button 
                   onClick={() => generateQuestions(subject)}
                   className="nv-btn-primary w-full h-16 uppercase tracking-widest text-xs mt-6"
                 >
                   Initialize Simulation
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Contextual Memory Decks</h3>
              <div className="space-y-4">
                 {decks.map(deck => (
                    <button 
                      key={deck.id}
                      onClick={() => { setSubject(deck.title); generateQuestions(deck.title); }}
                      className="w-full nv-card p-6 flex items-center justify-between border-white/5 hover:border-nuvio-purple-400 group transition-all"
                    >
                       <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 font-black group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all">
                            {deck.subject?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white uppercase tracking-tight">{deck.title}</div>
                            <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{deck.cards.length} Core Nodes</div>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
                    </button>
                 ))}
                 {decks.length === 0 && (
                    <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-30">
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">No Decks Synchronized</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 nv-page-transition">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full"
          />
          <Brain className="w-12 h-12 text-nuvio-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-4">
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Synthesizing Simulation</h2>
           <p className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em] animate-bounce">Neural Core Deployment Active...</p>
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
                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Node {currentIdx + 1} / {questions.length}</span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight truncate max-w-[200px]">{subject || 'General'}</h3>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="text-center">
                 <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Time</div>
                 <div className={`text-2xl font-black ${timeLeft < 5 ? 'text-nuvio-red animate-pulse' : 'text-white'}`}>
                   {timeLeft}s
                 </div>
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
           <h2 className="text-3xl font-black text-white leading-tight mb-12 border-l-4 border-nuvio-purple-500 pl-8">
             {q.question}
           </h2>

           <div className="grid grid-cols-1 gap-6">
              {q.options.map((option, idx) => {
                const isCorrect = idx === q.correctIndex;
                const isSelected = feedback && idx === q.correctIndex;
                const isWrong = feedback && !isCorrect;

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
                       <span className={`text-lg font-black transition-colors ${!feedback ? 'text-white' : isCorrect ? 'text-nuvio-green' : 'text-text-muted'}`}>
                         {option}
                       </span>
                       {feedback && isCorrect && <CheckCircle2 className="w-8 h-8 text-nuvio-green" />}
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
                  className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-6 border-l-4 border-l-nuvio-blue"
                >
                   <div className="w-12 h-12 rounded-xl bg-nuvio-blue/10 flex items-center justify-center text-nuvio-blue">
                     <Target className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <div className="text-[9px] font-black text-nuvio-blue uppercase tracking-widest mb-1">Intelligence Protocol</div>
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
           <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Intelligence Secured</h1>
           <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em]">Simulation Session Disconnected</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="nv-card p-10 text-center border-white/5 bg-gradient-to-br from-nuvio-purple-500/10 to-transparent">
              <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest mb-2">Neural XP</div>
              <div className="text-5xl font-black text-white">+{score * 2}</div>
           </div>
           <div className="nv-card p-10 text-center border-white/5 bg-gradient-to-br from-nuvio-yellow/10 to-transparent">
              <div className="text-[10px] font-black text-nuvio-yellow uppercase tracking-widest mb-2">Best Streak</div>
              <div className="text-5xl font-black text-white">{bestStreak}</div>
           </div>
        </div>

        <button 
          onClick={() => setGameState('config')}
          className="nv-btn-primary w-full h-20 text-sm font-black uppercase tracking-[0.3em] gap-4"
        >
          <RotateCcw className="w-6 h-6" /> Reboot Simulation
        </button>

        <button 
          onClick={() => window.location.hash = '/study-verse'}
          className="w-full text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors"
        >
          Exit to Arcade Sector
        </button>
      </div>
    );
  }

  return null;
};

export default TriviaGame;
