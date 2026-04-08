import React, { useState } from 'react';
import { 
  Gamepad2, Users, User, Play, Sparkles, 
  ChevronRight, Trophy, Sword, LayoutGrid, Dice5
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MonopolyBoard from '../components/studyverse/MonopolyBoard';
import TriviaBingo from '../components/studyverse/TriviaBingo';

const StudyVerse = () => {
  const [view, setView] = useState('landing'); // landing, lobby, game
  const [gameMode, setGameMode] = useState(null);
  const [gameType, setGameType] = useState(null);

  const games = [
    { id: 'monopoly', title: 'Subject Monopoly', icon: '🎲', desc: 'Claim chapters and build your academic empire.', reward: '200 XP' },
    { id: 'bingo', title: 'Trivia Bingo', icon: '🔢', desc: 'Complete 5 in a row by identifying correct terms.', reward: '500 XP' },
    { id: 'ludo', title: 'Edu Ludo', icon: '🎯', desc: 'Race your tokens to the finish by answering quizzes.', reward: '150 XP' },
    { id: 'uno', title: 'Subject Uno', icon: '🃏', desc: 'Match colors and subjects to empty your hand.', reward: '150 XP' },
  ];

  const handleStartSolo = (game) => {
    setGameType(game);
    setView('game');
  };

  if (view === 'landing') {
    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 pt-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-nuvio-purple-500 to-nuvio-purple-700 flex items-center justify-center shadow-xl shadow-nuvio-purple-500/20 mb-4 animate-bounce">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter">StudyVerse</h1>
          <p className="text-text-secondary">Battle your friends or study bots in real-time academic games. Earn massive XP and dominate the leaderboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { id: 'host', title: 'Host Game', icon: Users, desc: 'Create a room and invite classmates', color: 'text-nuvio-purple-400', bg: 'bg-nuvio-purple-500/10' },
            { id: 'join', title: 'Join Game', icon: LayoutGrid, desc: 'Enter a 6-digit room code', color: 'text-nuvio-green', bg: 'bg-nuvio-green/10' },
            { id: 'solo', title: 'Solo Play', icon: User, desc: 'Play against Nova AI bots', color: 'text-nuvio-blue', bg: 'bg-nuvio-blue/10' },
          ].map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setGameMode(mode.id); setView('lobby'); }}
              className="nv-card flex flex-col items-center text-center gap-4 p-8 border-2 border-transparent hover:border-nuvio-purple-500/30 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl ${mode.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <mode.icon className={`w-8 h-8 ${mode.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-primary">{mode.title}</h3>
                <p className="text-sm text-text-muted font-bold leading-tight">{mode.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('landing')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-2xl font-black text-text-primary uppercase tracking-widest">{gameMode} Mode</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <div key={game.id} className="nv-card p-6 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <span className="text-5xl group-hover:scale-110 transition-transform">{game.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-text-primary">{game.title}</h3>
                  <p className="text-xs text-text-secondary max-w-[200px]">{game.desc}</p>
                  <div className="mt-2 text-[10px] font-bold text-nuvio-purple-400 bg-nuvio-purple-400/10 px-2 py-0.5 rounded-full w-fit uppercase">
                    Win {game.reward}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleStartSolo(game)}
                className="nv-btn-primary px-8"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'game') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        {gameType.id === 'monopoly' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('lobby')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-widest">{gameType.title}</h2>
              </div>
            </div>
            <MonopolyBoard onWin={() => setView('lobby')} />
          </div>
        ) : gameType.id === 'bingo' ? (
          <TriviaBingo onWin={() => setView('lobby')} onClose={() => setView('lobby')} />
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 text-center bg-background-card/50 rounded-[32px] border border-white/5 p-12">
            <div className="relative">
              <div className="w-24 h-24 bg-nuvio-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-nuvio-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-black text-white">{gameType.title} is being prepared...</h3>
            <p className="text-text-secondary text-sm">Trivia Bingo is now functional! Try it next.</p>
            <button onClick={() => setView('lobby')} className="nv-btn-secondary">Go Back</button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default StudyVerse;
