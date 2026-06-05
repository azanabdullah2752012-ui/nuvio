import React, { useState, useEffect } from 'react';
import { Layers, Zap, Brain, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../../services/gameService';

const getCardStyle = (bgColor) => {
  switch (bgColor) {
    case 'bg-nuvio-red':
      return { border: 'border-nuvio-red/30', glow: 'shadow-[0_0_15px_rgba(255,71,87,0.15)]', bg: 'bg-nuvio-red/10', text: 'text-nuvio-red', accent: 'bg-nuvio-red/20' };
    case 'bg-nuvio-green':
      return { border: 'border-nuvio-green/30', glow: 'shadow-[0_0_15px_rgba(46,213,115,0.15)]', bg: 'bg-nuvio-green/10', text: 'text-nuvio-green', accent: 'bg-nuvio-green/20' };
    case 'bg-nuvio-blue':
      return { border: 'border-nuvio-blue/30', glow: 'shadow-[0_0_15px_rgba(30,144,255,0.15)]', bg: 'bg-nuvio-blue/10', text: 'text-nuvio-blue', accent: 'bg-nuvio-blue/20' };
    case 'bg-nuvio-yellow':
      return { border: 'border-nuvio-yellow/30', glow: 'shadow-[0_0_15px_rgba(255,165,2,0.15)]', bg: 'bg-nuvio-yellow/10', text: 'text-nuvio-yellow', accent: 'bg-nuvio-yellow/20' };
    default:
      return { border: 'border-white/10', glow: '', bg: 'bg-white/5', text: 'text-white', accent: 'bg-white/10' };
  }
};

const SubjectUno = ({ players, turn, onLog, onQuiz, activeSubject, onNextTurn }) => {
  const [hands, setHands] = useState(players.map(() => generateHand()));
  const [discardPile, setDiscardPile] = useState([generateCard()]);

  // --- BOT LOGIC (Only in Training Simulation) ---
  useEffect(() => {
    const activePlayer = players[turn];
    if (activePlayer?.isBot) {
      const timer = setTimeout(() => {
        const hand = hands[turn];
        const topCard = discardPile[0];
        const matchIdx = hand.findIndex(c => c.color === topCard.color || c.val === topCard.val);
        
        if (matchIdx !== -1) {
          executePlay(matchIdx);
        } else {
          // No match, bot draws
          const newHands = [...hands];
          newHands[turn].push(generateCard());
          setHands(newHands);
          onNextTurn();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [turn, players]);

  function generateCard() {
    const items = ["Oxygen", "Glucose", "Mitochondria", "CO2", "H2O", "Sun", "DNA", "Energy", "Atom", "Cell"];
    const val = items[Math.floor(Math.random() * items.length)];
    const colors = ["bg-nuvio-red", "bg-nuvio-green", "bg-nuvio-blue", "bg-nuvio-yellow"];
    return { val, color: colors[Math.floor(Math.random() * colors.length)] };
  }

  function generateHand() {
    return Array.from({ length: 5 }, () => generateCard());
  }

  const handlePlayCard = (cardIdx) => {
    const card = hands[turn][cardIdx];
    const topCard = discardPile[0];

    // SEMANTIC LINK LOGIC (same color or same value)
    if (card.color === topCard.color || card.val === topCard.val) {
      onLog(`${players[turn].name} established a Semantic Link: ${card.val}`, 'success');
      executePlay(cardIdx);
    } else {
      onLog(`Semantic Mismatch. Challenge Penalty required.`, 'sys');
      onQuiz({
        difficulty: 'Medium',
        callback: (correct) => {
          if (correct) {
            onLog(`Override success. Card successfully played.`, 'success');
            executePlay(cardIdx);
          } else {
            onLog(`Override failed. Hand growth detected.`, 'error');
            const newHands = [...hands];
            newHands[turn].push(generateCard());
            setHands(newHands);
            onNextTurn();
          }
        }
      });
    }
  };

  const executePlay = (cardIdx) => {
    const card = hands[turn][cardIdx];
    setDiscardPile([card, ...discardPile]);
    
    const newHands = [...hands];
    newHands[turn].splice(cardIdx, 1);
    setHands(newHands);

    if (newHands[turn].length === 0) {
      onLog(`${players[turn].name} ACHIEVED SEMANTIC LINK! +300 XP.`, 'success');
      gameService.awardPlayer(turn, 300, "Subject Uno Victory", "uno");
    }
    onNextTurn();
  };

  return (
    <div className="w-full max-w-5xl h-full flex flex-col items-center justify-between py-8 space-y-12 nv-page-transition">
      
      {/* Discard Pile */}
      <div className="relative flex items-center justify-center h-56 w-full">
         <AnimatePresence mode="popLayout">
            {(() => {
               const style = getCardStyle(discardPile[0].color);
               return (
                 <motion.div 
                    key={discardPile[0].val}
                    initial={{ scale: 0.8, rotate: -30, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.8, rotate: 30, opacity: 0 }}
                    className={`w-40 h-56 rounded-3xl border ${style.border} ${style.bg} ${style.glow} flex flex-col items-center justify-center p-6 text-center absolute backdrop-blur-lg`}
                 >
                    <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">Top Card</div>
                    <div className="text-base font-black text-white uppercase leading-tight">{discardPile[0].val}</div>
                    <Brain className={`w-8 h-8 ${style.text} opacity-30 mt-6 animate-pulse`} />
                 </motion.div>
               );
            })()}
         </AnimatePresence>
      </div>

      {/* Current Hand */}
      <div className="w-full space-y-8">
         <div className="flex items-center justify-between border-b border-white/10 pb-4 px-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10 shadow-lg" style={{ backgroundColor: players[turn].color }}>
                  {players[turn].icon}
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{players[turn].name}'s Hand</h3>
                  <p className="text-[10px] font-black text-nuvio-cyan uppercase tracking-widest">Connecting Cards...</p>
               </div>
            </div>
            <div className="flex gap-1.5">
               {Array.from({ length: hands[turn].length }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-nuvio-purple-500 rounded-full border border-nuvio-purple-500/30 shadow-[0_0_8px_rgba(130,88,255,0.4)]" />
               ))}
            </div>
         </div>

         <div className="flex flex-wrap justify-center gap-6">
            {hands[turn].map((card, idx) => {
               const style = getCardStyle(card.color);
               return (
                 <motion.button 
                    key={idx}
                    whileHover={{ y: -15, scale: 1.05 }}
                    onClick={() => handlePlayCard(idx)}
                    className={`w-32 h-44 rounded-2xl border ${style.border} ${style.bg} ${style.glow} p-4 flex flex-col justify-between items-center text-left relative overflow-hidden backdrop-blur-md group`}
                 >
                    <div className="absolute top-2 left-2 text-[8px] font-black uppercase tracking-widest text-white/30">Card</div>
                    <div className="text-xs font-black uppercase leading-snug text-center text-white my-auto px-1">{card.val}</div>
                    <div className={`w-8 h-8 rounded-full border ${style.border} ${style.accent} flex items-center justify-center text-white group-hover:scale-110 transition-all self-end`}>
                       <ChevronRight className="w-4 h-4" />
                    </div>
                 </motion.button>
               );
            })}
         </div>
      </div>

      {/* Game Footer Indicators */}
      <div className="flex gap-10">
         <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-nuvio-yellow" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Active Multiplier: 1.5x</span>
         </div>
         <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-nuvio-red" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Penalty Threshold: 3</span>
         </div>
      </div>
    </div>
  );
};

export default SubjectUno;
