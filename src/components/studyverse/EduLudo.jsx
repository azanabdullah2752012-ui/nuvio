import React, { useState, useEffect } from 'react';
import { Dice5, Trophy, Zap, AlertCircle, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../../services/gameService';

const EduLudo = ({ players, turn, onLog, onQuiz, activeSubject, onNextTurn, onUpdatePlayers }) => {
  const [tokens, setTokens] = useState(players.map(p => ({ pos: -1, player: p }))); // -1 = Home
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  // --- BOT LOGIC (Solo Mode) ---
  useEffect(() => {
    const isBot = players[turn]?.isBot;
    if (isBot && !isRolling) {
      const timer = setTimeout(() => {
        handleRoll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [turn, players]);

  // Ludo Track Logic
  // 0-31: Perimeter track. Home launch targets specific indices.
  const TRACK_LENGTH = 32;
  const LAUNCH_POINTS = [0, 8, 16, 24]; // P1, P2, P3, P4

  const handleRoll = () => {
    if (isRolling) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    
    const currentPlayerToken = tokens[turn];
    
    // 1. Check if in Home
    if (currentPlayerToken.pos === -1) {
      onLog(`${players[turn].name} needs neural launch authorization...`, 'sys');
      onQuiz({
        difficulty: 'Easy',
        callback: (correct) => {
          if (correct) {
            onLog(`Launch sequence GO. ${players[turn].name} entering track.`, 'success');
            moveToken(turn, LAUNCH_POINTS[turn]);
          } else {
            onLog(`Launch failed. Protocol reset.`, 'error');
            onNextTurn();
          }
        }
      });
    } else {
      // 2. Already on track, move
      const newPos = currentPlayerToken.pos + roll;
      if (newPos >= TRACK_LENGTH) {
        onLog(`${players[turn].name} reached the goal! +200 XP.`, 'success');
        gameService.awardPlayer(turn, 200, "Edu Ludo Mastery");
        moveToken(turn, -2); // -2 = Finished
      } else {
        onLog(`${players[turn].name} advancing ${roll} neural nodes.`, 'game');
        moveToken(turn, newPos);
      }
      onNextTurn();
    }
  };

  const moveToken = (playerIdx, newPos) => {
    const nextTokens = [...tokens];
    nextTokens[playerIdx].pos = newPos;
    setTokens(nextTokens);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl nv-page-transition">
      <div className="grid grid-cols-11 grid-rows-11 w-full aspect-square border-4 border-black bg-black p-1 gap-1 relative perspective-2000">
        
        {/* HOMES */}
        <div className="col-start-1 col-end-5 row-start-1 row-end-5 bg-nuvio-purple-500 border-4 border-black flex items-center justify-center">
           {tokens[0].pos === -1 && <div className="text-4xl animate-bounce">🛡️</div>}
        </div>
        <div className="col-start-8 col-end-12 row-start-1 row-end-5 bg-nuvio-green border-4 border-black flex items-center justify-center">
           {tokens[1].pos === -1 && <div className="text-4xl animate-bounce">☄️</div>}
        </div>
        <div className="col-start-1 col-end-5 row-start-8 row-end-12 bg-nuvio-blue border-4 border-black flex items-center justify-center">
           {tokens[2].pos === -1 && <div className="text-4xl animate-bounce">🤖</div>}
        </div>
        <div className="col-start-8 col-end-12 row-start-8 row-end-12 bg-nuvio-yellow border-4 border-black flex items-center justify-center">
           {tokens[3].pos === -1 && <div className="text-4xl animate-bounce">🌟</div>}
        </div>

        {/* TRACK (Simplified cross pattern for visualization) */}
        {/* For a real Ludo board we'd map every single tile, but we'll use a high-fidelity visual abstraction */}
        <div className="col-start-5 col-end-8 row-start-5 row-end-8 bg-black/40 border-4 border-black flex items-center justify-center z-10">
           <div className="text-[10px] font-black text-white uppercase tracking-widest">Goal</div>
        </div>

        {/* Center Control */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
           <div className="bg-black/80 backdrop-blur-md p-10 border-4 border-nuvio-cyan shadow-nb pointer-events-auto">
             <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center text-4xl font-black text-black">
                   {dice}
                </div>
                <button 
                  onClick={handleRoll}
                  className="nv-btn-primary !bg-nuvio-red h-16 w-32"
                >
                  Dice <Dice5 className="w-6 h-6" />
                </button>
             </div>
           </div>
        </div>
        
        {/* Render Tokens on track */}
        {tokens.map((t, i) => (
          t.pos >= 0 && (
            <motion.div 
               layout
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               key={i} 
               className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs shadow-nb-small absolute z-[100]"
               style={{ 
                  backgroundColor: t.player.color,
                  top: `${45 + (t.player.id % 2 === 0 ? 10 : -10)}%`,
                  left: `${45 + (t.player.id > 2 ? 10 : -10)}%`
               }}
            >
               {t.player.icon}
            </motion.div>
          )
        ))}
      </div>

      <div className="flex gap-8">
         <div className="nv-card !py-4 flex items-center gap-4 bg-nuvio-purple-500/10 border-nuvio-purple-500/30">
            <Brain className="w-8 h-8 text-nuvio-purple-400" />
            <div>
               <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">Protocol</div>
               <div className="text-sm font-black text-white uppercase">Launch Quiz Active</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EduLudo;
