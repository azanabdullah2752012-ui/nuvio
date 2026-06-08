import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice5, Sparkles, Trophy, 
  Target, GraduationCap, Zap,
  X, CheckCircle2, ChevronRight, Bot, Loader2
} from 'lucide-react';
import { xpService } from '../../services/xpService';
import { dataService } from '../../services/dataService';
import { CURRICULUM_DATA } from '../../services/curriculumData';

const MonopolyBoard = ({ onWin }) => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [aiPosition, setAiPosition] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [board, setBoard] = useState([]);
  const [ownedTiles, setOwnedTiles] = useState({}); // { index: 'player' | 'ai' }
  const [turn, setTurn] = useState('player'); // 'player' | 'ai'
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  useEffect(() => {
    const tiles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      label: i === 0 ? 'START' : `Subject Hub ${i}`,
      color: i % 4 === 0 ? 'bg-nuvio-purple-500' : i % 4 === 1 ? 'bg-nuvio-blue' : i % 4 === 2 ? 'bg-nuvio-green' : 'bg-nuvio-orange',
      subject: i % 4 === 0 ? 'Math' : i % 4 === 1 ? 'Science' : i % 4 === 2 ? 'Humanities' : 'Language'
    }));
    setBoard(tiles);
  }, []);

  const fetchQuestion = async () => {
    const decks = dataService.list('decks');
    
    // If user has flashcards, use them
    if (decks.length > 0) {
      const randomDeck = decks[Math.floor(Math.random() * decks.length)];
      if (randomDeck.cards && randomDeck.cards.length > 0) {
        const card = randomDeck.cards[Math.floor(Math.random() * randomDeck.cards.length)];
        
        const correct = String(card.back).trim();
        const distractors = new Set();
        
        // 1. If it's a number, make numeric offsets
        const num = parseFloat(correct);
        if (!isNaN(num) && String(num) === correct) {
          distractors.add(String(num + 1));
          distractors.add(String(num - 1));
          distractors.add(String(num * 2));
          distractors.add(String(num + 2));
        } else {
          // If it contains a number pattern
          const numMatch = correct.match(/(-?\d+(?:\.\d+)?)/);
          if (numMatch) {
            const originalNumStr = numMatch[1];
            const originalNum = parseFloat(originalNumStr);
            const offsets = [originalNum + 1, originalNum - 1, originalNum * 2, originalNum + 2];
            offsets.forEach(offset => {
              const formatted = Number.isInteger(offset) ? String(offset) : offset.toFixed(1);
              const replaced = correct.replace(originalNumStr, formatted);
              if (replaced !== correct) {
                distractors.add(replaced);
              }
            });
          }
        }
        
        // 2. Add other cards' answers from the same deck
        randomDeck.cards.forEach(c => {
          if (c.back && c.back.trim() !== correct && c.back.trim().length < 80) {
            distractors.add(c.back.trim());
          }
        });
        
        // 3. Fallbacks
        const fallbacks = [
          "Not covered in current lesson plan.",
          "Requires further experimental verification.",
          "Depends on standard textbook axioms.",
          "None of the mentioned statements.",
          "Value depends on context parameters."
        ];
        let idx = 0;
        while (distractors.size < 3 && idx < fallbacks.length) {
          const val = fallbacks[idx];
          if (val !== correct) distractors.add(val);
          idx++;
        }
        
        distractors.delete(correct);
        const opts = [correct, ...Array.from(distractors).slice(0, 3)].sort(() => Math.random() - 0.5);

        return {
          q: card.front,
          a: card.back,
          opts: opts,
          subject: randomDeck.title || randomDeck.name || 'Flashcard'
        };
      }
    }

    // Fallback: Pick a random Q&A from static CURRICULUM_DATA
    try {
      const grades = Object.keys(CURRICULUM_DATA);
      const randomGrade = grades[Math.floor(Math.random() * grades.length)];
      const subjects = Object.keys(CURRICULUM_DATA[randomGrade]);
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const chapters = CURRICULUM_DATA[randomGrade][randomSubject].chapters;
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
      
      let item = null;
      if (randomChapter.qna && randomChapter.qna.length > 0) {
        item = randomChapter.qna[Math.floor(Math.random() * randomChapter.qna.length)];
      } else if (randomChapter.flashcards && randomChapter.flashcards.length > 0) {
        const fc = randomChapter.flashcards[Math.floor(Math.random() * randomChapter.flashcards.length)];
        item = { q: fc.front, a: fc.back };
      }

      if (item) {
        const correct = String(item.a).trim();
        const allAnswers = [];
        chapters.forEach(ch => {
          if (ch.qna) ch.qna.forEach(q => allAnswers.push(q.a));
          if (ch.flashcards) ch.flashcards.forEach(f => allAnswers.push(f.back));
        });
        
        const distractors = new Set();
        
        // 1. If it's a number, make numeric offsets
        const num = parseFloat(correct);
        if (!isNaN(num) && String(num) === correct) {
          distractors.add(String(num + 1));
          distractors.add(String(num - 1));
          distractors.add(String(num * 2));
          distractors.add(String(num + 2));
        } else {
          // If it contains a number pattern
          const numMatch = correct.match(/(-?\d+(?:\.\d+)?)/);
          if (numMatch) {
            const originalNumStr = numMatch[1];
            const originalNum = parseFloat(originalNumStr);
            const offsets = [originalNum + 1, originalNum - 1, originalNum * 2, originalNum + 2];
            offsets.forEach(offset => {
              const formatted = Number.isInteger(offset) ? String(offset) : offset.toFixed(1);
              const replaced = correct.replace(originalNumStr, formatted);
              if (replaced !== correct) {
                distractors.add(replaced);
              }
            });
          }
        }
        
        // 2. Add other answers from the same chapter/subject
        allAnswers.forEach(ans => {
          if (ans && ans.trim() !== correct && ans.trim().length < 80) {
            distractors.add(ans.trim());
          }
        });
        
        // 3. Fallbacks
        const fallbacks = [
          "It is a constant of the coordinate space.",
          "Cannot be determined under current definitions.",
          "Value remains conserved globally.",
          "None of the mentioned statements.",
          "Both statements are true depending on parameters."
        ];
        let idx = 0;
        while (distractors.size < 3 && idx < fallbacks.length) {
          const val = fallbacks[idx];
          if (val !== correct) distractors.add(val);
          idx++;
        }
        
        distractors.delete(correct);
        const opts = [correct, ...Array.from(distractors).slice(0, 3)].sort(() => Math.random() - 0.5);

        return {
          q: item.q,
          a: item.a,
          opts: opts,
          subject: randomSubject
        };
      }
    } catch (e) {
      console.error("Static question extraction failed:", e);
    }
    
    return { q: "What is 2+2?", a: "4", opts: ["3", "4", "5", "6"], subject: "Math" };
  };

  const handleAiTurn = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const newPos = (aiPosition + roll) % board.length;
      setAiPosition(newPos);
      setIsRolling(false);
      
      // AI "Luck"
      if (newPos !== 0 && !ownedTiles[newPos]) {
        if (Math.random() > 0.45) {
          setOwnedTiles(prev => ({ ...prev, [newPos]: 'ai' }));
        }
      }
      setTurn('player');
    }, 1500);
  };

  const rollDice = async () => {
    if (isRolling || turn !== 'player') return;
    setIsRolling(true);
    
    // Simultaneous dice roll and question fetching
    const [quiz] = await Promise.all([
      fetchQuestion(),
      new Promise(r => setTimeout(r, 1200))
    ]);
    
    const roll = Math.floor(Math.random() * 6) + 1;
    const newPos = (playerPosition + roll) % board.length;
    setPlayerPosition(newPos);
    setIsRolling(false);
    
    if (newPos !== 0 && !ownedTiles[newPos]) {
      setCurrentQuiz(quiz);
      setShowQuiz(true);
    } else {
      setTurn('ai');
      handleAiTurn();
    }
  };

  const handleAnswer = (opt) => {
    setShowQuiz(false);
    if (opt === currentQuiz.a) {
      setOwnedTiles(prev => ({ ...prev, [playerPosition]: 'player' }));
      xpService.awardXp(120, `Chapter Master: ${board[playerPosition].label}`);
    }
    setTurn('ai');
    handleAiTurn();
  };

  return (
    <div className="relative aspect-square w-full max-w-4xl mx-auto flex items-center justify-center nv-page-transition">
      {/* Board Layout (Same as before but with real markers) */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2">
        {board.map((tile, i) => {
          let posClass = "";
          if (i < 6) posClass = `col-start-${i+1} row-start-1`;
          else if (i < 10) posClass = `col-start-6 row-start-${i-4}`;
          else if (i < 15) posClass = `col-start-${16-i} row-start-6`;
          else posClass = `col-start-1 row-start-${21-i}`;

          return (
            <div key={i} className={`
              ${posClass} nv-card p-1 flex flex-col items-center justify-center border-2 transition-all duration-500 relative
              ${playerPosition === i || aiPosition === i ? 'border-white scale-105 z-20' : 'border-white/5'}
              ${ownedTiles[i] === 'player' ? 'ring-2 ring-nuvio-purple-400 bg-nuvio-purple-400/5' : ''}
              ${ownedTiles[i] === 'ai' ? 'ring-2 ring-nuvio-orange bg-nuvio-orange/5' : ''}
            `}>
              <div className={`w-full h-1 rounded-full mb-1 ${tile.color}`} />
              <div className="flex gap-1 mt-1">
                {playerPosition === i && (
                  <motion.div layoutId="player" className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg text-[10px]">👨‍🎓</motion.div>
                )}
                {aiPosition === i && (
                  <motion.div layoutId="ai" className="w-5 h-5 bg-nuvio-orange rounded-full flex items-center justify-center shadow-lg text-[10px]">🎓</motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center UI */}
      <div className="z-10 bg-background-card/90 backdrop-blur-3xl rounded-[48px] p-12 text-center border border-white/5 space-y-6 shadow-2xl">
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Study Monopoly</h3>
        <div className="flex items-center justify-center gap-4">
           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${turn === 'player' ? 'bg-nuvio-purple-500 text-white' : 'text-text-muted'}`}>You</div>
           <div className="w-2 h-2 rounded-full bg-white/10" />
           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${turn === 'ai' ? 'bg-nuvio-orange text-white' : 'text-text-muted'}`}>Study Rival</div>
        </div>
        
        <div className="pt-4 relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rollDice}
            disabled={isRolling || showQuiz || turn !== 'player'}
            className="w-24 h-24 rounded-[32px] bg-nuvio-purple-500 flex items-center justify-center shadow-2xl shadow-nuvio-purple-500/30 group mx-auto disabled:opacity-50"
          >
            {isRolling ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : <Dice5 className="w-10 h-10 text-white" />}
          </motion.button>
          {isRolling && <div className="absolute top-1/2 left-full ml-4 text-[9px] font-black text-nuvio-purple-400 uppercase tracking-widest whitespace-nowrap">Consulting Decks...</div>}
        </div>
      </div>

      {/* Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-base/90 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="nv-card w-full max-w-md p-12 space-y-8 relative z-10 border-nuvio-purple-500/30">
               <div className="text-center space-y-4">
                 <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em]">{currentQuiz.subject} Challenge</div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{currentQuiz.q}</h3>
               </div>
               
               <div className="space-y-3">
                 {currentQuiz.opts.map(opt => (
                   <button 
                     key={opt} 
                     onClick={() => handleAnswer(opt)}
                     className="w-full nv-btn-secondary py-5 text-sm font-black uppercase tracking-widest text-left px-8 hover:bg-nuvio-purple-500/10 hover:border-nuvio-purple-500/30"
                   >
                     {opt}
                   </button>
                 ))}
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonopolyBoard;
