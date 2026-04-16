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

// --- GAME COMPONENTS ---
import EduLudo from '../components/studyverse/EduLudo';
import SubjectUno from '../components/studyverse/SubjectUno';
import TriviaBingo from '../components/studyverse/TriviaBingo';

// --- QUESTION BANK ---
const QUESTION_BANK = gameService.QUESTION_BANK;

// --- MULTIPLAYER SETUP ---
const INITIAL_PLAYERS = [
  { id: 1, name: "You (Scholar)", color: "#8258ff", kp: 0, xp: 0, pos: 0, icon: "⚡", isBot: false },
  { id: 2, name: "Leo Vance", color: "#2ed573", kp: 0, xp: 0, pos: 0, icon: "☄️", isBot: true },
  { id: 3, name: "Maya Chen", color: "#1e90ff", kp: 0, xp: 0, pos: 0, icon: "🦄", isBot: true },
  { id: 4, name: "Sam Rivers", color: "#ffa502", kp: 0, xp: 0, pos: 0, icon: "🌟", isBot: true }
];

const StudyVerse = () => {
  const [currentTab, setCurrentTab] = useState('Monopoly');
  const [activeSubject, setActiveSubject] = useState('Science');
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
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
    setTurn(prev => (prev + 1) % 4);
  };

  // --- AI SENTINEL ENGINE ---
  useEffect(() => {
    const activePlayer = players[turn];
    if (isSolo && activePlayer.isBot && !showQuiz && !isBotThinking) {
      triggerBotSequence();
    }
  }, [turn, isSolo, showQuiz, isBotThinking]);

  const triggerBotSequence = () => {
    setIsBotThinking(true);
    addLog(`${players[turn].name} is analyzing tiles...`, 'sys');
    
    // 1. Roll Move
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDice(roll);
      const newPos = (players[turn].pos + roll) % 20;
      const newPlayers = [...players];
      newPlayers[turn].pos = newPos;
      setPlayers(newPlayers);
      addLog(`${players[turn].name} rolled ${roll} and engaged Sector ${newPos}.`, 'game');

      // 2. Simulated Quiz Result (80% Success Rate)
      setTimeout(() => {
        const success = Math.random() < 0.8;
        if (success) {
          addLog(`${players[turn].name} synchronized the Focus Node.`, 'success');
          newPlayers[turn].kp += 50;
          setPlayers(newPlayers);
          
          // Trigger ambient particles for bot wins too
          window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: { last_gain: 1 } }));
        } else {
          addLog(`${players[turn].name} failed neural verification.`, 'error');
        }
        
        setIsBotThinking(false);
        // Only Monopoly uses main loop turn logic, others handle locally
        if (currentTab === 'Monopoly') nextTurn(); 
      }, 1000);
    }, 1000); // Faster roll logic
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
        ]).catch(e => console.error("Neural Matrix Sync Error:", e));
      }
      
      notificationService.send("Node Secured", "KP +50 awarded.", "success");
      if (window.quiz_callback) window.quiz_callback(true);
    } else {
      addLog(`${players[turn].name} failed neural verification.`, 'error');
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
      <div className="relative w-full aspect-square border-4 border-black bg-black p-2 grid grid-cols-6 grid-rows-6 gap-2">
        {tiles.map((_, i) => {
          // Manual geometry for Monopoly perimeter
          let row, col;
          if (i < 6) { row = 0; col = i; }
          else if (i < 10) { row = i - 5; col = 5; }
          else if (i < 16) { row = 5; col = 15 - i; }
          else { row = 20 - i; col = 0; }

          const occupants = players.filter(p => p.pos === i);

          return (
            <div 
              key={i} 
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
              className={`border-[3px] border-black flex items-center justify-center relative transition-all ${i % 5 === 0 ? 'bg-nuvio-red' : 'bg-white/10'}`}
            >
              <span className="text-[10px] font-black text-black/20 absolute top-1 left-1">0{i}</span>
              <div className="flex -space-x-2">
                {occupants.map(p => (
                  <motion.div 
                    layoutId={`player-${p.id}`}
                    key={p.id} 
                    className="w-8 h-8 rounded-sm border-2 border-black flex items-center justify-center text-xs shadow-nb-small"
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
        <div className="col-start-2 col-end-6 row-start-2 row-end-6 bg-[#16181d] border-4 border-black flex flex-col items-center justify-center text-center p-8">
           <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.4em] mb-4">Central Matrix</div>
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Monopoly</h2>
           <div className="mt-8 flex items-center gap-6">
              <div className="w-20 h-20 border-4 border-black bg-white flex items-center justify-center text-5xl font-black text-black shadow-nb">
                 {dice}
              </div>
              <button 
                onClick={handleRoll}
                className="nv-btn-primary !bg-nuvio-yellow h-20 px-10 group"
              >
                Roll <Dice5 className="w-8 h-8 group-hover:rotate-180 transition-transform" />
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
           <div className="nv-card !bg-nuvio-purple-500 !text-black !shadow-[8px_8px_0_#000]">
              <div className="flex items-center gap-3">
                 <Gamepad2 className="w-8 h-8" />
                 <h2 className="text-2xl font-black tracking-tighter uppercase">Study Arcade</h2>
              </div>
           </div>

           {/* Subject Switcher */}
           <div className="nv-card space-y-4">
              <div className="nv-label tracking-widest text-[#F7F4EF60]">Subject Area</div>
              <div className="grid grid-cols-1 gap-3">
                 {['Math', 'Science', 'Social'].map(s => {
                    // Logic: Pulse if it's the "suggested" subject (random for demo or based on logic)
                    const isNeglected = (s === 'Social' && activeSubject !== 'Social'); 
                    return (
                      <button 
                        key={s}
                        onClick={() => setActiveSubject(s)}
                        className={`
                          px-6 py-3 border-[3px] border-black text-left font-black uppercase tracking-widest text-xs transition-all 
                          ${activeSubject === s ? 'bg-nuvio-cyan text-black shadow-nb-small' : 'bg-white/5 opacity-50'}
                          ${isNeglected ? 'nv-pulse-attention' : ''}
                        `}
                      >
                        {s} Module
                      </button>
                    );
                 })}
              </div>
           </div>

            {/* Turn Indicator */}
            <div className="nv-card !bg-nuvio-yellow !text-black border-black border-4 shadow-nb-small">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Active Player</div>
                    <div className="text-lg font-black uppercase tracking-tighter leading-none">{players[turn].name}</div>
                 </div>
                 <div className="w-12 h-12 bg-black flex items-center justify-center text-2xl">{players[turn].icon}</div>
              </div>
           </div>

           {/* Player Grid */}
           <div className="nv-card space-y-6">
              <div className="flex items-center justify-between nv-label">
                 <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Live Leaderboard</div>
                 <button 
                  onClick={() => setIsSolo(!isSolo)}
                  className={`text-[9px] px-2 py-0.5 border border-black font-black uppercase tracking-widest transition-all ${isSolo ? 'bg-nuvio-cyan text-black' : 'bg-white/5 opacity-50'}`}
                 >
                   {isSolo ? 'Solo Mode' : 'Group Mode'}
                 </button>
              </div>
              <div className="space-y-3">
                 {players.map(p => (
                    <div key={p.id} className={`flex items-center justify-between p-3 border-2 border-black ${turn === players.indexOf(p) ? 'bg-nuvio-purple-500/20 border-nuvio-purple-500 shadow-[4px_4px_0_#000]' : 'bg-black/20 opacity-70'}`}>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center border-2 border-black" style={{ backgroundColor: p.color }}>{p.icon}</div>
                          <span className="text-[11px] font-black uppercase tracking-tight">{p.name} {p.isBot && isSolo && "(AI)"}</span>
                       </div>
                       <div className="text-[10px] font-bold text-nuvio-cyan">KP {p.kp}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Activity Feed */}
           <div className="nv-card flex-1 space-y-4 overflow-hidden">
              <div className="flex items-center gap-2 nv-label"><History className="w-4 h-4" /> Activity Feed</div>
              <div className="space-y-3 font-mono text-[10px] uppercase overflow-y-auto max-h-[200px] pr-2 scrollbar-none">
                 {activity.map((a, i) => (
                   <div key={i} className={`p-2 border-l-4 ${a.type === 'error' ? 'border-nuvio-red bg-nuvio-red/5' : a.type === 'success' ? 'border-nuvio-green bg-nuvio-green/5' : 'border-nuvio-blue bg-white/5'}`}>
                      <span className="text-text-muted mr-2">{a.time}</span>
                      <span className={a.type === 'success' ? 'text-nuvio-green' : a.type === 'error' ? 'text-nuvio-red' : 'text-white'}>{a.t}</span>
                   </div>
                 ))}
              </div>
           </div>
        </aside>

        {/* WORKSPACE (Stage) */}
        <main className="flex-1 flex flex-col gap-8">
           {/* Topbar Tabs */}
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
              {['Monopoly', 'Edu Ludo', 'Subject Uno', 'Trivia Bingo'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`flex-none px-8 py-5 border-[3px] border-black font-black uppercase tracking-widest text-[11px] transition-all ${currentTab === tab ? 'bg-white text-black shadow-nb translate-y-[-4px]' : 'bg-black text-text-muted'}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* The Stage */}
           <div className="flex-1 bg-[#121418] border-[3px] border-black shadow-nb flex items-center justify-center p-8 overflow-hidden relative">
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
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Allocating Neural Capacity for {currentTab}</p>
                </div>
              )}

              {/* Quiz Overlay */}
              <AnimatePresence>
                 {showQuiz && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-8 sm:p-20"
                   >
                     <motion.div 
                       initial={{ scale: 0.9, rotate: -2 }}
                       animate={{ scale: 1, rotate: 0 }}
                       className="nv-card !bg-[#2ed573] !text-black w-full max-w-2xl border-4 !shadow-[20px_20px_0_#000]"
                     >
                        <div className="flex justify-between items-start mb-10">
                           <div className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">Focus Check</div>
                           <div className="text-2xl font-black">Subject: {activeSubject}</div>
                        </div>
                        <h2 className="text-3xl font-black mb-12 border-b-4 border-black pb-8">{activeQuiz.q}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {activeQuiz.options.map((opt, i) => (
                             <button
                               key={i}
                               onClick={() => submitQuiz(i)}
                               className="p-6 bg-black text-white text-left font-bold uppercase tracking-wide border-2 border-black hover:bg-[#101114] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]"
                             >
                                <span className="text-nuvio-cyan mr-3">[{i + 1}]</span> {opt}
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
