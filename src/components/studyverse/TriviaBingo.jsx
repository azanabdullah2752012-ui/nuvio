import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Trophy, Zap, RefreshCw, X } from 'lucide-react';
import { xpService } from '../../services/xpService';

const TriviaBingo = ({ onWin, onClose }) => {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    // Generate 5x5 board
    const subjects = ['Math', 'Science', 'History', 'Art', 'Geo'];
    const newBoard = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      subject: subjects[i % 5],
      marked: i === 12, // Free space in middle
      isFree: i === 12
    }));
    setBoard(newBoard);
  }, []);

  const checkWin = (currentBoard) => {
    const lines = [
      // Rows
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      // Cols
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      // Diagonals
      [0,6,12,18,24], [4,8,12,16,20]
    ];
    
    return lines.some(line => line.every(idx => currentBoard[idx].marked));
  };

  const handleCellClick = (cell) => {
    if (cell.marked) return;
    setSelectedCell(cell);
    setCurrentQuiz({
      q: `Identify the correct property of ${cell.subject}.`,
      options: ['Option A', 'Option B', 'Correct Answer', 'Option D'],
      a: 'Correct Answer'
    });
    setShowQuiz(true);
  };

  const handleAnswer = (opt) => {
    setShowQuiz(false);
    if (opt === currentQuiz.a) {
      const newBoard = board.map(c => c.id === selectedCell.id ? { ...c, marked: true } : c);
      setBoard(newBoard);
      if (checkWin(newBoard)) {
        setWon(true);
        xpService.awardXp(500, 'Trivia Bingo Victory');
      } else {
        xpService.awardXp(20, 'Square Marked');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background-base/90 backdrop-blur-md">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8 relative">
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-text-muted hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Trivia Bingo</h2>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest">Connect 5 squares to win 500 XP</p>
        </div>

        <div className="grid grid-cols-5 gap-3 w-full max-w-2xl aspect-square">
          {board.map((cell) => (
            <motion.button
              key={cell.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(cell)}
              className={`
                aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all group
                ${cell.marked 
                  ? 'bg-nuvio-purple-500 border-nuvio-purple-400 shadow-lg shadow-nuvio-purple-500/20' 
                  : 'bg-white/5 border-white/5 hover:border-nuvio-purple-500/30'}
              `}
            >
              {cell.isFree ? (
                <Star className="w-8 h-8 text-white animate-pulse" />
              ) : cell.marked ? (
                <Zap className="w-6 h-6 text-white" />
              ) : (
                <div className="text-center">
                  <div className="text-[10px] font-black text-text-muted uppercase mb-1 group-hover:text-nuvio-purple-400">{cell.subject}</div>
                  <HelpCircle className="w-5 h-5 text-text-muted opacity-30 mx-auto" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Quiz Overlay */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[60] flex items-center justify-center p-6">
               <div className="absolute inset-0 bg-background-base/80" />
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} 
                 animate={{ scale: 1, y: 0 }}
                 className="nv-card w-full max-w-md p-10 space-y-8 relative z-10 border-nuvio-purple-500/30"
               >
                 <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-nuvio-purple-500/10 rounded-2xl mx-auto flex items-center justify-center">
                     <HelpCircle className="w-8 h-8 text-nuvio-purple-400" />
                   </div>
                   <h3 className="text-xl font-black text-white uppercase">{currentQuiz.q}</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                   {currentQuiz.options.map(opt => (
                     <button 
                       key={opt} 
                       onClick={() => handleAnswer(opt)}
                       className="w-full nv-btn-secondary py-4 text-xs font-black uppercase tracking-widest hover:bg-nuvio-purple-500/10 hover:border-nuvio-purple-500/30"
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               </motion.div>
            </motion.div>
          )}

          {won && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 z-[70] flex items-center justify-center">
               <div className="nv-card p-12 text-center space-y-6 bg-nuvio-purple-500 shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                 <Trophy className="w-20 h-20 text-nuvio-yellow mx-auto" />
                 <div>
                   <h2 className="text-4xl font-black text-white uppercase">Bingo!</h2>
                   <p className="text-white/80 font-bold">+500 XP Earned</p>
                 </div>
                 <button onClick={onWin} className="nv-btn-secondary bg-white text-black py-4 px-10">Claim & Exit</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Star = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

export default TriviaBingo;
