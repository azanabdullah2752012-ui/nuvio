import React, { useState, useEffect } from 'react';
import { Target, Zap, Trophy, HelpCircle, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../../services/gameService';

const TriviaBingo = ({ players, turn, onLog, activeSubject, onNextTurn }) => {
  const [boards, setBoards] = useState(players.map(() => generateBoard()));
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [lockedTiles, setLockedTiles] = useState(players.map(() => []));
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    generateNewPrompt();
    
    // --- BOT LOGIC (Solo Mode) ---
    const isBot = players[turn]?.isBot;
    if (isBot && !winner) {
      const timer = setTimeout(() => {
        handleBotDecision();
      }, 1500); // Faster bot transitions
      return () => clearTimeout(timer);
    }
  }, [turn, activeSubject, winner]);

  const handleBotDecision = () => {
    const board = boards[turn];
    const correctAns = currentPrompt.options[currentPrompt.a].toLowerCase();
    
    // Bots now scan for the exact correct answer node
    const matchIdx = board.findIndex(tile => tile.toLowerCase() === correctAns);
    
    if (matchIdx !== -1 && !lockedTiles[turn].includes(matchIdx)) {
      handleTileClick(matchIdx);
    } else {
      onNextTurn();
    }
  };

  function generateBoard() {
    const subjectPool = gameService.QUESTION_BANK[activeSubject] || gameService.QUESTION_BANK.Science;
    // Map options and specific keywords into board tiles
    const concepts = subjectPool.flatMap(q => {
      const correct = q.options[q.a];
      return [correct, ...q.options.filter(o => o !== correct).slice(0, 1)];
    });
    
    // Fill up to 25 tiles with interesting academic terms if pool is small
    const fallback = ["Atom", "Cell", "Gravity", "Link", "Data", "Node", "Flux", "Core"];
    while (concepts.length < 25) {
      concepts.push(fallback[Math.floor(Math.random() * fallback.length)]);
    }

    return concepts.sort(() => Math.random() - 0.5).slice(0, 25);
  }

  function generateNewPrompt() {
    const subjectPool = gameService.QUESTION_BANK[activeSubject] || gameService.QUESTION_BANK.Science;
    const q = subjectPool[Math.floor(Math.random() * subjectPool.length)];
    setCurrentPrompt(q);
  }

  const handleTileClick = (tileIdx) => {
    if (winner) return;

    const tileVal = boards[turn][tileIdx];
    const isAlreadyLocked = lockedTiles[turn].includes(tileIdx);
    
    if (isAlreadyLocked) return;

    // Strict Answer Verification (No more 'Demo' heuristics)
    const correctAns = currentPrompt.options[currentPrompt.a].toLowerCase();
    const isCorrect = tileVal.toLowerCase() === correctAns;

    if (isCorrect) {
      onLog(`${players[turn].name} locked node: ${tileVal}`, 'success');
      const newLocked = [...lockedTiles];
      newLocked[turn].push(tileIdx);
      setLockedTiles(newLocked);
      
      if (checkWin(newLocked[turn])) {
        setWinner(players[turn]);
        onLog(`${players[turn].name} ACHIEVED BINGO!`, 'success');
        gameService.awardPlayer(turn, 500, "Trivia Bingo Victory", "bingo");
      } else {
        onNextTurn();
      }
    } else {
      onLog(`Logical rejection. Node ${tileVal} is offline.`, 'error');
      onNextTurn();
    }
  };

  const checkWin = (indices) => {
    const winPatterns = [
      // Rows
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      // Cols
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      // Diagonals
      [0,6,12,18,24], [4,8,12,16,20]
    ];
    return winPatterns.some(pattern => pattern.every(idx => indices.includes(idx)));
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-10 py-6 nv-page-transition overflow-hidden">
      
      {/* Current Prompt Panel */}
      <div className="w-full max-w-2xl rounded-3xl border border-nuvio-blue/20 bg-background-card/45 backdrop-blur-2xl flex items-center gap-6 p-6 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1.5 h-full bg-nuvio-blue" />
         <div className="w-14 h-14 bg-nuvio-blue/15 border border-nuvio-blue/30 rounded-2xl flex items-center justify-center text-nuvio-blue animate-pulse">
            <HelpCircle className="w-8 h-8" />
         </div>
         <div className="flex-1 space-y-1">
            <div className="text-[9px] font-black text-nuvio-blue uppercase tracking-widest">Active Host Prompt</div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
               {currentPrompt?.q || "Initializing..."}
            </h2>
         </div>
      </div>

      {/* 5x5 Grid */}
      <div className="grid grid-cols-5 gap-3 p-4 bg-background-card/30 border border-white/10 rounded-2xl shadow-2xl relative">
         {boards[turn].map((tile, idx) => {
           const isLocked = lockedTiles[turn].includes(idx);
           return (
              <motion.button 
                key={idx}
                whileHover={!isLocked ? { scale: 1.08, zIndex: 10 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => handleTileClick(idx)}
                className={`
                   w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border transition-all flex items-center justify-center p-3 text-center
                   ${isLocked ? 'bg-gradient-to-br from-nuvio-green/25 to-nuvio-green/5 border-nuvio-green/45 text-nuvio-green font-black shadow-[0_0_20px_rgba(46,213,115,0.2)]' : 'border-white/5 bg-white/5 text-text-secondary/60 hover:text-white hover:bg-white/10 hover:border-white/10'}
                `}
              >
                 <span className={`text-[11px] font-black uppercase tracking-tight leading-none ${isLocked ? 'text-nuvio-green' : ''}`}>
                    {tile}
                 </span>
              </motion.button>
           );
         })}
      </div>

      {/* Player Stats Bar */}
      <div className="flex gap-6">
         {players.map((p, i) => (
            <div key={i} className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-3 ${turn === i ? 'bg-white/10 border-white/20 text-white shadow-lg backdrop-blur-md' : 'border-white/5 bg-white/5 opacity-50 text-text-secondary'}`}>
               <span className="text-sm">{p.icon}</span>
               <span className="text-[10px] font-black uppercase">{lockedTiles[i].length} nodes</span>
            </div>
         ))}
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="absolute inset-0 bg-background-base/85 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center space-y-8 rounded-2xl"
           >
              <div className="w-28 h-28 bg-nuvio-yellow/20 border border-nuvio-yellow/30 rounded-full flex items-center justify-center text-nuvio-yellow shadow-[0_0_50px_rgba(255,165,2,0.25)] animate-bounce">
                 <Trophy className="w-12 h-12 text-nuvio-yellow" />
              </div>
              <div className="text-center space-y-2">
                 <h1 className="text-5xl font-black text-white uppercase tracking-tighter">BINGO SECURED</h1>
                 <div className="text-2xl font-black text-nuvio-yellow uppercase tracking-widest">{winner.name} Wins</div>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="h-16 px-10 rounded-2xl border border-nuvio-yellow/30 bg-nuvio-yellow/15 hover:bg-nuvio-yellow/25 text-nuvio-yellow hover:text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,165,2,0.1)] active:scale-95"
              >
                Reboot Matrix
              </button>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TriviaBingo;
