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
  }, [turn, activeSubject]);

  function generateBoard() {
    const concepts = ["Atom", "Cell", "Energy", "DNA", "Force", "Gravity", "Light", "Heat", "Acid", "Base", "Element", "Matter", "Solid", "Liquid", "Gas", "Molecules", "Plasma", "Neutron", "Proton", "Electron", "Bond", "Reaction", "Mass", "Volume", "Density"];
    // Shuffle
    return concepts.sort(() => Math.random() - 0.5);
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

    // Use Nova AI to verify if the clicked tile answers the prompt
    // For the demo, we check if the tile value is part of the correct option text or vice versa
    const correctAns = currentPrompt.options[currentPrompt.a].toLowerCase();
    const isCorrect = correctAns.includes(tileVal.toLowerCase()) || tileVal.toLowerCase().includes(correctAns.slice(0, 3));

    if (isCorrect) {
      onLog(`${players[turn].name} locked the glow: ${tileVal}`, 'success');
      const newLocked = [...lockedTiles];
      newLocked[turn].push(tileIdx);
      setLockedTiles(newLocked);
      
      if (checkWin(newLocked[turn])) {
        setWinner(players[turn]);
        onLog(`${players[turn].name} achieved NEURAL BINGO! +500 XP.`, 'success');
        gameService.awardPlayer(turn, 500, "Trivia Bingo Victory");
      } else {
        onNextTurn();
      }
    } else {
      onLog(`Heuristic mismatch. Node remains offline.`, 'error');
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
      <div className="w-full max-w-2xl nv-card !bg-black border-4 !border-nuvio-blue shadow-nb flex items-center gap-8 p-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-2 h-full bg-nuvio-blue" />
         <div className="w-16 h-16 bg-nuvio-blue/10 rounded-2xl flex items-center justify-center text-nuvio-blue animate-pulse">
            <HelpCircle className="w-10 h-10" />
         </div>
         <div className="flex-1 space-y-2">
            <div className="text-[10px] font-black text-nuvio-blue uppercase tracking-widest">Active Host Prompt</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
               {currentPrompt?.q || "Initializing..."}
            </h2>
         </div>
      </div>

      {/* 5x5 Grid */}
      <div className="grid grid-cols-5 gap-3 p-4 bg-black border-4 border-black relative">
         {boards[turn].map((tile, idx) => {
           const isLocked = lockedTiles[turn].includes(idx);
           return (
              <motion.button 
                key={idx}
                whileHover={!isLocked ? { scale: 1.1, zIndex: 10 } : {}}
                whileTap={!isLocked ? { scale: 0.9 } : {}}
                onClick={() => handleTileClick(idx)}
                className={`
                   w-24 h-24 sm:w-28 sm:h-28 border-4 border-black transition-all flex items-center justify-center p-3 text-center
                   ${isLocked ? 'bg-nuvio-green text-black font-black shadow-[0_0_30px_rgba(46,213,115,0.4)]' : 'bg-[#121418] text-white/40 hover:text-white hover:bg-[#1a1c22]'}
                `}
              >
                 <span className={`text-[11px] font-black uppercase tracking-tight leading-none ${isLocked ? 'text-black' : ''}`}>
                    {tile}
                 </span>
              </motion.button>
           );
         })}
      </div>

      {/* Player Stats Bar */}
      <div className="flex gap-6">
         {players.map((p, i) => (
            <div key={i} className={`px-4 py-2 border-2 border-black flex items-center gap-3 ${turn === i ? 'bg-white text-black shadow-nb-small' : 'bg-black/40 opacity-40'}`}>
               <span className="text-sm">{p.icon}</span>
               <span className="text-[10px] font-black uppercase">{lockedTiles[i].length} nodes</span>
            </div>
         ))}
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center space-y-8"
           >
              <div className="w-32 h-32 bg-nuvio-yellow rounded-full flex items-center justify-center text-6xl shadow-[0_0_100px_rgba(255,165,2,0.5)]">
                 <Trophy className="w-16 h-16 text-black" />
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter">BINGO SECURED</h1>
              <div className="text-3xl font-black text-nuvio-yellow uppercase tracking-widest">{winner.name} Wins</div>
              <button 
                onClick={() => window.location.reload()}
                className="nv-btn-primary h-20 px-12 text-sm"
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
