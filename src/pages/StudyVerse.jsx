import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sword, Map, Trophy, 
  Sparkles, ChevronRight, Zap, Target,
  Cpu, Rocket, Brain, Flame, Users,
  Layers, Dice5, History, LayoutGrid,
  Command, Box, Coins, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { gameService } from '../services/gameService';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';

// --- GAME COMPONENTS ---
import EduLudo from '../components/studyverse/EduLudo';
import SubjectUno from '../components/studyverse/SubjectUno';
import TriviaBingo from '../components/studyverse/TriviaBingo';

// --- QUESTION BANK ---
const QUESTION_BANK = gameService.QUESTION_BANK;

// --- MULTIPLAYER SETUP ---
// --- MULTIPLAYER SETUP (Real-Only) ---
const getInitialPlayers = (user) => [
  { id: user.id, name: user.full_name || "You (Scholar)", color: "#8258ff", kp: 0, xp: 0, pos: 0, icon: user.avatar_emoji || "⚡", isBot: false },
];

const StudyVerse = () => {
  const [user, setUser] = useState(authService.me());
  const [currentTab, setCurrentTab] = useState('Monopoly');
  const [activeSubject, setActiveSubject] = useState('Science');
  const [players, setPlayers] = useState(getInitialPlayers(authService.me() || {}));
  const [turn, setTurn] = useState(0); // Player index
  const [activity, setActivity] = useState([{ t: 'System sequence initialized.', type: 'sys' }]);
  const [isSolo, setIsSolo] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [dice, setDice] = useState(1);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // --- ENGINE LOGIC ---
  const addLog = (text, type = 'sys') => {
    setActivity(prev => [{ t: text, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  const nextTurn = () => {
    if (players.length > 1) {
      setTurn(prev => (prev + 1) % players.length);
    }
  };

  // --- BOT OPPONENT ENGINE (Real Peers Only) ---
  useEffect(() => {
    const activePlayer = players[turn];
    if (!activePlayer) return;
    if (activePlayer.isBot && !showQuiz && !isBotThinking) {
      triggerBotSequence();
    }
  }, [turn, players, showQuiz, isBotThinking]);

  const triggerBotSequence = () => {
    // Ghost Logic Terminated. Bots only active in Training Simulation.
    if (!players[turn]?.isBot) return;
    setIsBotThinking(true);
    addLog(`${players[turn].name} is analyzing tiles...`, 'sys');
    
    // Bots now play using the same logic as real players
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDice(roll);
      const newPos = (players[turn].pos + roll) % 20;
      const newPlayers = [...players];
      newPlayers[turn].pos = newPos;
      setPlayers(newPlayers);
      addLog(`${players[turn].name} moved to Sector ${newPos}.`, 'game');
      
      setIsBotThinking(false);
      nextTurn();
    }, 1500);
  };

  const handleRoll = () => {
    if (showQuiz) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    addLog(`${players[turn].name} rolled a ${roll}.`, 'game');
    
    // Simulate board move
    const newPos = (players[turn].pos + roll) % 20;
    const newPlayers = [...players];
    newPlayers[turn].pos = newPos;
    setPlayers(newPlayers);

    // Trigger Quiz Intercept
    const subjectPool = QUESTION_BANK[activeSubject];
    const quiz = subjectPool[Math.floor(Math.random() * subjectPool.length)];
    setActiveQuiz(quiz);
    setShowQuiz(true);
  };

  const submitQuiz = async (idx) => {
    const isCorrect = idx === activeQuiz.a;
    setShowQuiz(false);
    
    if (isCorrect) {
      addLog(`${players[turn].name} passed the Quiz Intercept.`, 'success');
      const newPlayers = [...players];
      newPlayers[turn].kp += 50;
      newPlayers[turn].xp += 20;
      setPlayers(newPlayers);
      
      // If it's the main player (P1), sync to Cloud
      if (turn === 0) {
        const user = authService.me();
        
        // Atomic Production Sync
        Promise.all([
          authService.updateMe({
            knowledge_points: (user.knowledge_points || 0) + 50,
            era_tokens: (user.era_tokens || 0) + 10
          }),
          xpService.awardXp(20, `StudyVerse Monopoly: Node Secured`),
          supabase.from('game_matches').insert([{
             user_id: user.id,
             game_type: 'monopoly',
             result: 'move',
             kp_earned: 50,
             xp_earned: 20
          }])
        ]).catch(e => console.error("Study Matrix Sync Error:", e));
      }
      
      notificationService.send("Node Secured", "KP +50 awarded.", "success");
      if (window.quiz_callback) window.quiz_callback(true);
    } else {
      addLog(`${players[turn].name} failed question verification.`, 'error');
      notificationService.send("Logic Error", "Movement penalized.", "error");
      if (window.quiz_callback) window.quiz_callback(false);
    }
    
    window.quiz_callback = null;
    if (currentTab === 'Monopoly') nextTurn();
  };

  // --- SUB-COMPONENTS: BOARD RENDER ---
  const renderBoard = () => {
    const tiles = Array.from({ length: 20 });
    return (
      <div className="relative w-full aspect-square border border-white/10 bg-background-card/25 backdrop-blur-xl rounded-2xl p-3 grid grid-cols-6 grid-rows-6 gap-3 shadow-2xl">
        {tiles.map((_, i) => {
          // Manual geometry for Monopoly perimeter
          let row, col;
          if (i < 6) { row = 0; col = i; }
          else if (i < 10) { row = i - 5; col = 5; }
          else if (i < 16) { row = 5; col = 15 - i; }
          else { row = 20 - i; col = 0; }

          const occupants = players.filter(p => p.pos === i);
          
          let tileBg = 'bg-white/5 hover:bg-white/10';
          let borderGlow = 'border-white/5';
          if (i % 5 === 0) {
            tileBg = 'bg-gradient-to-br from-nuvio-red/20 to-nuvio-red/5';
            borderGlow = 'border-nuvio-red/30 shadow-[0_0_10px_rgba(255,71,87,0.15)]';
          } else if (i % 5 === 1) {
            tileBg = 'bg-gradient-to-br from-nuvio-blue/20 to-nuvio-blue/5';
            borderGlow = 'border-nuvio-blue/20';
          } else if (i % 5 === 2) {
            tileBg = 'bg-gradient-to-br from-nuvio-green/20 to-nuvio-green/5';
            borderGlow = 'border-nuvio-green/20';
          } else if (i % 5 === 3) {
            tileBg = 'bg-gradient-to-br from-nuvio-yellow/20 to-nuvio-yellow/5';
            borderGlow = 'border-nuvio-yellow/20';
          } else {
            tileBg = 'bg-gradient-to-br from-nuvio-purple-500/20 to-nuvio-purple-500/5';
            borderGlow = 'border-nuvio-purple-500/20';
          }

          return (
            <div 
              key={i} 
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
              className={`border rounded-xl flex flex-col items-center justify-center relative transition-all ${tileBg} ${borderGlow}`}
            >
              <span className="text-[10px] font-black text-text-muted absolute top-1.5 left-1.5">0{i}</span>
              <div className="flex -space-x-1.5">
                {occupants.map(p => (
                  <motion.div 
                    layoutId={`player-${p.id}`}
                    key={p.id} 
                    className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center text-xs shadow-lg font-bold"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.icon}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Center Arena */}
        <div className="col-start-2 col-end-6 row-start-2 row-end-6 bg-background-card/85 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-2xl">
           <div className="text-[10px] font-black text-nuvio-purple-400 tracking-[0.4em] mb-2">Central Matrix</div>
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-text-secondary to-white">Monopoly</h2>
           <div className="mt-8 flex items-center gap-6">
              <motion.div 
                animate={showQuiz ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-4xl font-black text-white shadow-inner backdrop-blur-md relative overflow-hidden"
              >
                 {dice}
              </motion.div>
              <button 
                onClick={handleRoll}
                className="h-20 px-10 rounded-2xl border border-nuvio-yellow/30 bg-nuvio-yellow/15 hover:bg-nuvio-yellow/25 text-nuvio-yellow hover:text-white font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,165,2,0.1)] hover:shadow-[0_0_30px_rgba(255,165,2,0.2)] active:scale-95 group"
              >
                Roll <Dice5 className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
              </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-bg-base text-text-primary nv-page-transition p-4 md:p-8">
      <div className="flex w-full gap-8">
        
        {/* SIDEBAR (30%) */}
        <aside className="hidden lg:flex flex-col w-[350px] gap-8">
           <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background-card/45 backdrop-blur-2xl p-6 shadow-xl flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-nuvio-purple-400" />
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Study Arcade</h2>
           </div>

           {/* Subject Switcher */}
           <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background-card/45 backdrop-blur-2xl p-6 shadow-xl space-y-4">
              <div className="nv-label tracking-widest text-text-secondary/55">Subject Area</div>
              <div className="grid grid-cols-1 gap-3">
                 {['Math', 'Science', 'Social'].map(s => {
                    const isNeglected = (s === 'Social' && activeSubject !== 'Social'); 
                    return (
                      <button 
                        key={s}
                        onClick={() => setActiveSubject(s)}
                        className={`
                          px-5 py-3 border rounded-xl font-bold uppercase tracking-wider text-xs transition-all 
                          ${activeSubject === s 
                            ? 'bg-nuvio-cyan/15 text-nuvio-cyan border-nuvio-cyan/30 shadow-[0_0_15px_rgba(88,244,255,0.1)]' 
                            : 'bg-white/5 text-text-secondary border-white/5 opacity-70 hover:opacity-100'}
                          ${isNeglected ? 'animate-pulse border-nuvio-yellow/30 bg-nuvio-yellow/5' : ''}
                        `}
                      >
                        {s} Module
                      </button>
                    );
                 })}
              </div>
           </div>

            {/* Turn Indicator */}
            <div className="relative overflow-hidden rounded-2xl border border-nuvio-yellow/20 bg-nuvio-yellow/5 backdrop-blur-2xl p-5 shadow-[0_0_20px_rgba(255,165,2,0.02)]">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="text-[10px] font-black uppercase tracking-widest text-nuvio-yellow/70">Active Player</div>
                     <div className="text-lg font-black uppercase tracking-tighter leading-none text-white">{players[turn]?.name || 'Unknown'}</div>
                  </div>
                  <div className="w-12 h-12 bg-nuvio-yellow/15 border border-nuvio-yellow/30 rounded-xl flex items-center justify-center text-2xl">{players[turn]?.icon || '⚡'}</div>
               </div>
            </div>

           {/* Player Grid */}
           <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background-card/45 backdrop-blur-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between nv-label">
                 <div className="flex items-center gap-2 text-text-secondary"><Users className="w-4 h-4 text-nuvio-purple-400" /> Live Leaderboard</div>
                 <button 
                  onClick={() => setIsSolo(!isSolo)}
                  className={`text-[9px] px-2.5 py-1 border rounded-md font-bold uppercase tracking-widest transition-all ${isSolo ? 'bg-nuvio-cyan/20 text-nuvio-cyan border-nuvio-cyan/30 shadow-[0_0_10px_rgba(88,244,255,0.15)]' : 'bg-white/5 border-white/5 text-text-muted hover:text-white'}`}
                 >
                   {isSolo ? 'Solo Mode' : 'Group Mode'}
                 </button>
              </div>
              <div className="space-y-3">
                 {players.map(p => (
                    <div 
                      key={p.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        turn === players.indexOf(p) 
                          ? 'bg-nuvio-purple-500/10 border-nuvio-purple-500/30 shadow-[0_0_15px_rgba(130,88,255,0.1)] text-white' 
                          : 'bg-white/5 border-white/5 opacity-70 text-text-secondary'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-lg text-lg" style={{ backgroundColor: p.color }}>{p.icon}</div>
                          <span className="text-[11px] font-black uppercase tracking-tight">{p.name} {p.isBot && isSolo && "(Rival)"}</span>
                       </div>
                       <div className="text-[10px] font-bold text-nuvio-cyan bg-nuvio-cyan/10 px-2 py-0.5 rounded-full border border-nuvio-cyan/20">KP {p.kp}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Activity Feed */}
           <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background-card/45 backdrop-blur-2xl p-6 shadow-xl flex-1 space-y-4 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 nv-label text-text-secondary"><History className="w-4 h-4 text-nuvio-purple-400" /> Activity Feed</div>
              <div className="space-y-2.5 font-mono text-[10px] uppercase overflow-y-auto max-h-[220px] pr-1 scrollbar-none flex-1">
                 {activity.map((a, i) => (
                   <div key={i} className={`p-2.5 rounded-xl border-l-2 ${a.type === 'error' ? 'border-nuvio-red bg-nuvio-red/5 text-nuvio-red' : a.type === 'success' ? 'border-nuvio-green bg-nuvio-green/5 text-nuvio-green' : 'border-nuvio-blue/20 bg-white/5 text-text-secondary'}`}>
                      <span className="opacity-40 mr-2">{a.time}</span>
                      <span className="font-semibold">{a.t}</span>
                   </div>
                 ))}
              </div>
           </div>
        </aside>

        {/* WORKSPACE (Stage) */}
        <main className="flex-1 flex flex-col gap-8">
           {/* Topbar Tabs */}
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {['Monopoly', 'Edu Ludo', 'Subject Uno', 'Trivia Bingo'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`flex-none px-6 py-4 rounded-xl border font-bold uppercase tracking-wider text-xs transition-all ${
                    currentTab === tab 
                      ? 'bg-white/10 text-white border-white/20 shadow-lg backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'bg-white/5 text-text-secondary border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* The Stage */}
           <div className="flex-1 bg-background-card/45 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl flex items-center justify-center p-8 overflow-hidden relative">
              {currentTab === 'Monopoly' ? renderBoard() : 
               currentTab === 'Edu Ludo' ? (
                 <EduLudo 
                    players={players} 
                    turn={turn} 
                    activeSubject={activeSubject}
                    onLog={addLog}
                    onQuiz={({ difficulty, callback }) => {
                      const pool = QUESTION_BANK[activeSubject];
                      setActiveQuiz(pool[Math.floor(Math.random() * pool.length)]);
                      setShowQuiz(true);
                      window.quiz_callback = callback;
                    }}
                    onNextTurn={nextTurn}
                 />
               ) : 
               currentTab === 'Subject Uno' ? (
                 <SubjectUno 
                    players={players} 
                    turn={turn} 
                    activeSubject={activeSubject}
                    onLog={addLog}
                    onQuiz={({ difficulty, callback }) => {
                      const pool = QUESTION_BANK[activeSubject];
                      setActiveQuiz(pool[Math.floor(Math.random() * pool.length)]);
                      setShowQuiz(true);
                      window.quiz_callback = callback;
                    }}
                    onNextTurn={nextTurn}
                 />
               ) : 
               currentTab === 'Trivia Bingo' ? (
                 <TriviaBingo 
                    players={players} 
                    turn={turn} 
                    activeSubject={activeSubject}
                    onLog={addLog}
                    onNextTurn={nextTurn}
                 />
               ) : (
                <div className="flex flex-col items-center justify-center opacity-30 space-y-6">
                   <Layers className="w-32 h-32" />
                   <h2 className="text-4xl font-black uppercase tracking-tighter">System Initializing</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Loading Study Station for {currentTab}</p>
                </div>
              )}

              {/* Quiz Overlay */}
              <AnimatePresence>
                 {showQuiz && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-background-base/80 backdrop-blur-xl z-50 flex items-center justify-center p-6 sm:p-12"
                   >
                     <motion.div 
                       initial={{ scale: 0.9, y: 15 }}
                       animate={{ scale: 1, y: 0 }}
                       exit={{ scale: 0.9, y: 15 }}
                       className="w-full max-w-2xl rounded-3xl border border-nuvio-green/20 bg-background-card/95 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col"
                     >
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                           <div className="bg-nuvio-green/20 text-nuvio-green border border-nuvio-green/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Focus Check</div>
                           <div className="text-sm font-bold text-text-secondary uppercase">Subject: {activeSubject}</div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 leading-snug">{activeQuiz.q}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {activeQuiz.options.map((opt, i) => (
                             <button
                               key={i}
                               onClick={() => submitQuiz(i)}
                               className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-left text-white font-medium transition-all active:scale-[0.98] flex items-center gap-3"
                             >
                                <span className="text-nuvio-cyan font-black">[{i + 1}]</span> {opt}
                             </button>
                           ))}
                        </div>
                     </motion.div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </main>
      </div>
    </div>
  );
};

export default StudyVerse;
