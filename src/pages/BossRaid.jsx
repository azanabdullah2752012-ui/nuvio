import React, { useState, useEffect } from 'react';
import { 
  Sword, Shield, Zap, Heart, 
  Trophy, AlertCircle, Timer, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const BossRaid = () => {
  const [gameState, setGameState] = useState('lobby'); // lobby, fighting, victory, defeat
  const [bossHp, setBossHp] = useState(1000);
  const [playerHp, setPlayerHp] = useState(100);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [damageDealt, setDamageDealt] = useState(0);

  const BOSS_NAME = "The procrastination dragon 🐉";
  const TOTAL_BOSS_HP = 1000;

  const quizzes = [
    { q: "What is the capital of logic?", a: "Reason", options: ["Reason", "Chaos", "Faith", "Emotion"] },
    { q: "Solve for X: 2x + 5 = 15", a: "5", options: ["2", "5", "10", "15"] },
    { q: "Which element has symbol 'Au'?", a: "Gold", options: ["Silver", "Gold", "Copper", "Iron"] },
  ];

  useEffect(() => {
    let timer;
    if (gameState === 'fighting' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'fighting') {
      handleAttack(null); // Time out = miss
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startRaid = () => {
    setGameState('fighting');
    setBossHp(TOTAL_BOSS_HP);
    setPlayerHp(100);
    setDamageDealt(0);
    nextQuestion();
  };

  const nextQuestion = () => {
    const q = quizzes[Math.floor(Math.random() * quizzes.length)];
    setCurrentQuiz(q);
    setTimeLeft(10);
  };

  const handleAttack = (option) => {
    if (option === currentQuiz.a) {
      const dmg = Math.floor(Math.random() * 50) + 100;
      const newHp = Math.max(0, bossHp - dmg);
      setBossHp(newHp);
      setDamageDealt(prev => prev + dmg);
      if (newHp === 0) {
        setGameState('victory');
        confetti({ particleCount: 150, spread: 100 });
      } else {
        nextQuestion();
      }
    } else {
      const dmg = 20;
      const newHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newHp);
      if (newHp === 0) {
        setGameState('defeat');
      } else {
        nextQuestion();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {gameState === 'lobby' && (
        <div className="nv-card bg-gradient-to-br from-nuvio-purple-600/30 to-background-card p-12 text-center space-y-8 border-nuvio-purple-500/20">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-nuvio-red/20 rounded-full flex items-center justify-center animate-pulse">
              <Sword className="w-16 h-16 text-nuvio-red" />
            </div>
            <div className="absolute -top-4 -right-4 bg-nuvio-orange p-3 rounded-2xl shadow-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Weekly Boss Raid</h1>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              Team up with your class to take down the **{BOSS_NAME}**. Correct answers deal damage. Failed answers hurt the team!
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto py-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-border">
              <div className="text-lg font-black text-white">2.4k</div>
              <div className="text-[10px] font-black text-text-muted uppercase">Health</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-border">
              <div className="text-lg font-black text-nuvio-purple-400">12</div>
              <div className="text-[10px] font-black text-text-muted uppercase">Heroes</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-border">
              <div className="text-lg font-black text-nuvio-yellow">1h 42m</div>
              <div className="text-[10px] font-black text-text-muted uppercase">Ends in</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-border">
              <div className="text-lg font-black text-nuvio-green">500</div>
              <div className="text-[10px] font-black text-text-muted uppercase">XP Reward</div>
            </div>
          </div>
          <button onClick={startRaid} className="nv-btn-primary px-12 py-4 h-16 text-xl shadow-2xl shadow-nuvio-purple-500/30">
            ENTER BATTLE
          </button>
        </div>
      )}

      {gameState === 'fighting' && (
        <div className="space-y-12">
          {/* Battle Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Boss Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-black text-nuvio-red uppercase tracking-widest mb-1">WEEKLY BOSS</div>
                  <h2 className="text-2xl font-black text-text-primary uppercase">{BOSS_NAME}</h2>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-text-primary truncate">{bossHp} / {TOTAL_BOSS_HP} HP</span>
                </div>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(bossHp / TOTAL_BOSS_HP) * 100}%` }}
                  className="h-full bg-gradient-to-r from-nuvio-red to-nuvio-orange"
                />
              </div>
            </div>

            {/* Your Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-nuvio-purple-500 flex items-center justify-center text-white">👤</div>
                  <h2 className="text-lg font-black text-text-primary">Azan (You)</h2>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-text-primary truncate">{playerHp} / 100 HP</span>
                </div>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${playerHp}%` }}
                  className="h-full bg-nuvio-green"
                />
              </div>
            </div>
          </div>

          {/* Quiz Area */}
          <div className="nv-card bg-background-card/50 border-white/5 max-w-xl mx-auto p-10 space-y-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 font-black transition-colors ${timeLeft < 3 ? 'text-nuvio-red animate-pulse' : 'text-text-muted'}`}>
              <Timer className="inline-block w-4 h-4 mr-1 mb-1" /> {timeLeft}s
            </div>
            
            <div className="text-center space-y-2">
              <div className="nv-label">CHALLENGE QUESTION</div>
              <h3 className="text-2xl font-black text-white">{currentQuiz?.q}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuiz?.options.map(opt => (
                <button 
                  key={opt}
                  onClick={() => handleAttack(opt)}
                  className="nv-btn-secondary py-6 text-sm hover:bg-white/5 active:scale-95 transition-all text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(gameState === 'victory' || gameState === 'defeat') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="nv-card p-20 text-center space-y-8 border-nuvio-purple-500/30"
        >
          <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-6xl ${gameState === 'victory' ? 'bg-nuvio-green/20' : 'bg-nuvio-red/20'}`}>
            {gameState === 'victory' ? '🏆' : '💀'}
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">
              {gameState === 'victory' ? 'VICTORY!' : 'DEFEATED'}
            </h2>
            <p className="text-text-secondary text-lg">
              {gameState === 'victory' 
                ? `You dealt ${damageDealt} total damage and helped conquer the dragon!` 
                : "The dragon was too strong this time. Review your notes and try again!"}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <div className="nv-card bg-white/5 px-10 py-4 flex flex-col items-center">
              <div className="text-3xl font-black text-text-primary">+{gameState === 'victory' ? '500' : '50'}</div>
              <div className="nv-label">XP EARNED</div>
            </div>
            <div className="nv-card bg-white/5 px-10 py-4 flex flex-col items-center">
              <div className="text-3xl font-black text-nuvio-yellow">+{gameState === 'victory' ? '100' : '10'}</div>
              <div className="nv-label">TOKENS</div>
            </div>
          </div>

          <button onClick={() => setGameState('lobby')} className="nv-btn-secondary px-10">Return to Lobby</button>
        </motion.div>
      )}
    </div>
  );
};

export default BossRaid;
