import React, { useState, useEffect } from 'react';
import { Layers, Zap, Brain, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../../services/gameService';

const SubjectUno = ({ players, turn, onLog, onQuiz, activeSubject, onNextTurn }) => {
  const [hands, setHands] = useState(players.map(() => generateHand()));
  const [discardPile, setDiscardPile] = useState([generateCard()]);
  const [selectedCard, setSelectedCard] = useState(null);

  // --- BOT LOGIC (Solo Mode) ---
  useEffect(() => {
    const isBot = players[turn]?.isBot;
    if (isBot) {
      const timer = setTimeout(() => {
        handleBotDecision();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [turn, players]);

  const handleBotDecision = () => {
    const hand = hands[turn];
    const topCard = discardPile[0];
    
    // 1. Look for a natural match
    const matchIdx = hand.findIndex(c => c.color === topCard.color || c.val === topCard.val);
    
    if (matchIdx !== -1) {
      handlePlayCard(matchIdx);
    } else {
      // 2. Try to "Solve" a mismatch (80% confidence)
      const success = Math.random() < 0.8;
      if (success) {
        onLog(`${players[turn].name} logic-matched a card via override.`, 'success');
        executePlay(0); // Just play the first card
      } else {
        onLog(`${players[turn].name} semantic chain broke. Drawing card.`, 'error');
        const newHands = [...hands];
        newHands[turn].push(generateCard());
        setHands(newHands);
        onNextTurn();
      }
    }
  };

  function generateCard() {
    const concepts = gameService.QUESTION_BANK[activeSubject] || gameService.QUESTION_BANK.Science;
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

    // SEMANTIC LINK LOGIC (Simplified for demo: same color or same value)
    if (card.color === topCard.color || card.val === topCard.val) {
      onLog(`${players[turn].name} established a Semantic Link: ${card.val}`, 'success');
      executePlay(cardIdx);
    } else {
      onLog(`Semantic Mismatch. Neural Penalty required.`, 'sys');
      onQuiz({
        difficulty: 'Medium',
        callback: (correct) => {
          if (correct) {
            onLog(`Logic override success. Card forced into matrix.`, 'success');
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
      onLog(`${players[turn].name} ACHIEVED SEMANTIC UNITY! +300 XP.`, 'success');
      gameService.awardPlayer(turn, 300, "Subject Uno Victory", "uno");
    }
    onNextTurn();
  };

  return (
    <div className="w-full max-w-5xl h-full flex flex-col items-center justify-between py-8 space-y-12 nv-page-transition">
      
      {/* Discard Pile (Neural Matrix) */}
      <div className="relative flex items-center justify-center h-48 w-full">
         <AnimatePresence mode="popLayout">
            <motion.div 
               key={discardPile[0].val}
               initial={{ scale: 0, rotate: -45 }}
               animate={{ scale: 1, rotate: 0 }}
               className={`w-40 h-56 ${discardPile[0].color} border-4 border-black shadow-nb flex flex-col items-center justify-center p-6 text-center absolute`}
            >
               <div className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-4">Neural Node</div>
               <div className="text-xl font-black text-black uppercase leading-tight">{discardPile[0].val}</div>
               <Brain className="w-10 h-10 text-black/20 mt-6" />
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Current Hand */}
      <div className="w-full space-y-8">
         <div className="flex items-center justify-between border-b-4 border-black pb-4 px-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center text-2xl" style={{ backgroundColor: players[turn].color }}>
                  {players[turn].icon}
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{players[turn].name}'s Hand</h3>
                  <p className="text-[10px] font-black text-nuvio-cyan uppercase tracking-widest">Constructing Semantic Chain...</p>
               </div>
            </div>
            <div className="flex gap-2">
               {Array.from({ length: hands[turn].length }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-nuvio-purple-500 rounded-full border border-black shadow-nb-small" />
               ))}
            </div>
         </div>

         <div className="flex flex-wrap justify-center gap-6">
            {hands[turn].map((card, idx) => (
               <motion.button 
                  key={idx}
                  whileHover={{ y: -20, scale: 1.05 }}
                  onClick={() => handlePlayCard(idx)}
                  className={`w-32 h-44 ${card.color} border-4 border-black shadow-nb p-4 flex flex-col justify-between items-center text-left group`}
               >
                  <div className="text-[9px] font-black text-black/40 uppercase tracking-widest self-start">Card</div>
                  <div className="text-sm font-black text-black uppercase leading-tight text-center">{card.val}</div>
                  <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-black/10 group-hover:bg-black group-hover:text-white transition-all self-end">
                     <ChevronRight className="w-5 h-5" />
                  </div>
               </motion.button>
            ))}
         </div>
      </div>

      {/* Game Footer Indicators */}
      <div className="flex gap-10">
         <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-nuvio-yellow" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Multiplier: 1.5x</span>
         </div>
         <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-nuvio-red" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Penalty Threshold: 3</span>
         </div>
      </div>
    </div>
  );
};

export default SubjectUno;
