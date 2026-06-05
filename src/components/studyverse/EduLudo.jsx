import React, { useState, useEffect } from 'react';
import { Dice5, Trophy, Zap, AlertCircle, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../../services/gameService';

const PATH_COORDS = [
  { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, // Left arm top
  { r: 4, c: 5 }, { r: 3, c: 5 }, { r: 2, c: 5 }, { r: 1, c: 5 }, // Top arm left
  { r: 1, c: 6 }, // Top arm center
  { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, // Top arm right
  { r: 5, c: 8 }, { r: 5, c: 9 }, { r: 5, c: 10 }, { r: 5, c: 11 }, // Right arm top
  { r: 6, c: 11 }, // Right arm center
  { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }, { r: 7, c: 8 }, // Right arm bottom
  { r: 8, c: 7 }, { r: 9, c: 7 }, { r: 10, c: 7 }, { r: 11, c: 7 }, // Bottom arm right
  { r: 11, c: 6 }, // Bottom arm center
  { r: 11, c: 5 }, { r: 10, c: 5 }, { r: 9, c: 5 }, { r: 8, c: 5 }, // Bottom arm left
  { r: 7, c: 4 }, { r: 7, c: 3 }, { r: 7, c: 2 }, { r: 7, c: 1 }, // Left arm bottom
  { r: 6, c: 1 } // Left arm center
];

const EduLudo = ({ players = [], turn, onLog, onQuiz, activeSubject, onNextTurn }) => {
  const [tokens, setTokens] = useState(players.map(p => ({ pos: -1, player: p }))); // -1 = Home
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    setTokens(players.map(p => ({ pos: -1, player: p })));
  }, [players]);

  // --- BOT LOGIC ---
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
  const TRACK_LENGTH = 36;
  const LAUNCH_POINTS = [0, 9, 27, 18]; // P1 (Purple), P2 (Green), P3 (Blue), P4 (Yellow)

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Animate roll
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDice(roll);
      setIsRolling(false);

      const currentPlayerToken = tokens[turn];
      
      // 1. Check if in Home
      if (currentPlayerToken.pos === -1) {
        onLog(`${players[turn].name} needs launch authorization...`, 'sys');
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
          onLog(`${players[turn].name} advancing ${roll} nodes.`, 'game');
          moveToken(turn, newPos);
        }
        onNextTurn();
      }
    }, 600);
  };

  const moveToken = (playerIdx, newPos) => {
    const nextTokens = [...tokens];
    nextTokens[playerIdx].pos = newPos;
    setTokens(nextTokens);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl nv-page-transition">
      <div className="grid grid-cols-11 grid-rows-11 w-full aspect-square border border-white/10 bg-background-card/30 rounded-3xl p-3 gap-2 relative shadow-2xl">
        
        {/* DYNAMIC HOMES */}
        {tokens.map((t, i) => {
           const gridClasses = [
             'col-start-1 col-end-5 row-start-1 row-end-5',
             'col-start-8 col-end-12 row-start-1 row-end-5',
             'col-start-1 col-end-5 row-start-8 row-end-12',
             'col-start-8 col-end-12 row-start-8 row-end-12'
           ][i % 4];
           
           const colorTheme = [
             { bg: 'from-nuvio-purple-500/10 to-nuvio-purple-500/5', border: 'border-nuvio-purple-500/20 shadow-[0_0_15px_rgba(130,88,255,0.05)]' },
             { bg: 'from-nuvio-green/10 to-nuvio-green/5', border: 'border-nuvio-green/20 shadow-[0_0_15px_rgba(46,213,115,0.05)]' },
             { bg: 'from-nuvio-blue/10 to-nuvio-blue/5', border: 'border-nuvio-blue/20 shadow-[0_0_15px_rgba(30,144,255,0.05)]' },
             { bg: 'from-nuvio-yellow/10 to-nuvio-yellow/5', border: 'border-nuvio-yellow/20 shadow-[0_0_15px_rgba(255,165,2,0.05)]' }
           ][i % 4];

           return (
             <div key={i} className={`${gridClasses} bg-gradient-to-br ${colorTheme.bg} border ${colorTheme.border} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-xs opacity-20 font-black tracking-widest">HOME</div>
                {t.pos === -1 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                    style={{ backgroundColor: t.player.color }}
                  >
                    {t.player.icon || '👤'}
                  </motion.div>
                )}
             </div>
           );
        })}

        {/* PATH TRACK TILES */}
        {PATH_COORDS.map((coord, idx) => {
           const occupants = tokens.filter(t => t.pos === idx);
           
           let tileBorder = 'border-white/5 bg-white/5 hover:bg-white/10';
           if (idx === 0) tileBorder = 'border-nuvio-purple-500/30 bg-nuvio-purple-500/5 shadow-[0_0_10px_rgba(130,88,255,0.1)]';
           else if (idx === 9) tileBorder = 'border-nuvio-green/30 bg-nuvio-green/5 shadow-[0_0_10px_rgba(46,213,115,0.1)]';
           else if (idx === 27) tileBorder = 'border-nuvio-blue/30 bg-nuvio-blue/5 shadow-[0_0_10px_rgba(30,144,255,0.1)]';
           else if (idx === 18) tileBorder = 'border-nuvio-yellow/30 bg-nuvio-yellow/5 shadow-[0_0_10px_rgba(255,165,2,0.1)]';

           return (
             <div 
               key={idx}
               style={{ gridColumn: coord.c, gridRow: coord.r }}
               className={`flex items-center justify-center relative rounded-lg border transition-all ${tileBorder}`}
             >
               <span className="text-[7px] font-bold text-text-muted absolute top-0.5 left-1">0{idx}</span>
               <div className="flex -space-x-1.5 z-10">
                 {occupants.map(occ => (
                   <motion.div
                     layoutId={`ludo-token-${occ.player.id}`}
                     key={occ.player.id}
                     className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center text-xs shadow-lg font-bold"
                     style={{ backgroundColor: occ.player.color }}
                   >
                     {occ.player.icon}
                   </motion.div>
                 ))}
               </div>
             </div>
           );
        })}

        {/* Center Goal Sector */}
        <div className="col-start-5 col-end-8 row-start-5 row-end-8 bg-background-card/65 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center z-10 p-2 shadow-2xl relative">
           <div className="text-[9px] font-black text-nuvio-cyan uppercase tracking-widest mb-1.5">Portal Goal</div>
           <div className="flex flex-wrap gap-1 justify-center">
             {tokens.filter(t => t.pos === -2).map((occ) => (
                <motion.div 
                  layoutId={`ludo-token-${occ.player.id}`}
                  key={occ.player.id}
                  className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center text-xs shadow-lg font-bold"
                  style={{ backgroundColor: occ.player.color }}
                >
                  {occ.player.icon}
                </motion.div>
             ))}
           </div>
        </div>

        {/* Center Control Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
           <div className="bg-background-card/90 backdrop-blur-2xl px-8 py-6 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto flex flex-col items-center gap-4">
             <div className="text-[9px] font-black text-nuvio-cyan uppercase tracking-widest">Training Simulator</div>
             <div className="flex items-center gap-4">
                <motion.div 
                  animate={isRolling ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl font-black text-white"
                >
                   {dice}
                </motion.div>
                <button 
                  onClick={handleRoll}
                  disabled={players[turn]?.isBot || isRolling}
                  className="h-14 px-6 rounded-xl border border-nuvio-red/30 bg-nuvio-red/15 hover:bg-nuvio-red/25 text-nuvio-red hover:text-white font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,71,87,0.1)] active:scale-95 disabled:opacity-50"
                >
                  Roll <Dice5 className="w-4 h-4" />
                </button>
             </div>
           </div>
        </div>
      </div>

      <div className="flex gap-8">
         <div className="rounded-2xl border border-nuvio-purple-500/20 bg-nuvio-purple-500/10 px-6 py-4 flex items-center gap-4 shadow-lg backdrop-blur-md">
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
