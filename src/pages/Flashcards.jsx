import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Trash2, 
  ChevronLeft, Sparkles, Brain, 
  CheckCircle2, XCircle, BookMarked, Layers,
  X, ArrowRight, Zap, Orbit, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const SubjectIcon = ({ subject, className = "w-6 h-6" }) => {
  const s = subject?.toLowerCase() || '';
  if (s.includes('math')) return <Zap className={className} />; // Use Zap for math in flashcards for variety
  if (s.includes('sci')) return <Orbit className={className} />;
  if (s.includes('hist') || s.includes('human')) return <BookMarked className={className} />;
  if (s.includes('lang') || s.includes('write')) return <Brain className={className} />;
  if (s.includes('lit')) return <Layers className={className} />;
  if (s.includes('exam') || s.includes('test')) return <Zap className={className} />;
  return <Database className={className} />;
};

const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('library');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, tricky: 0 });
  const [newDeck, setNewDeck] = useState({ title: '', subject: 'General', cards: [{ front: '', back: '' }] });

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    setLoading(true);
    try {
      const list = await dataService.list('decks');
      setDecks(list);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id) => {
    try {
      await dataService.delete('decks', id);
      setDecks(decks.filter(d => d.id !== id));
      notificationService.send("Vault Cleared", "Neural deck successfully purged.", "info");
    } catch (err) {}
  };

  const startStudy = (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIdx(0);
    setStats({ mastered: 0, tricky: 0 });
    setIsFlipped(false);
    setView('study');
  };

  const handleNext = (isMastered) => {
    if (isMastered) setStats(prev => ({ ...prev, mastered: prev.mastered + 1 }));
    else setStats(prev => ({ ...prev, tricky: prev.tricky + 1 }));

    if (selectedDeck?.cards && currentCardIdx < selectedDeck.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIdx(currentCardIdx + 1), 300);
    } else if (selectedDeck?.cards) {
      const totalMastered = stats.mastered + (isMastered ? 1 : 0);
      const gainedXp = totalMastered * 15;
      
      xpService.awardXp(gainedXp, `Mastery: ${selectedDeck.title}`);
      notificationService.send("Session Complete", `Gained +${gainedXp} XP.`, "success");
      
      setView('library');
      setSelectedDeck(null);
    }
  };

  const saveNewDeck = async () => {
    if (!newDeck.title || newDeck.cards.some(c => !c.front || !c.back)) {
      notificationService.send("Error", "All cards require a front and back.", "error");
      return;
    }
    setLoading(true);
    try {
      const created = await dataService.create('decks', newDeck);
      setDecks([created, ...decks]);
      setView('library');
      setNewDeck({ title: '', subject: 'General', cards: [{ front: '', back: '' }] });
      notificationService.send("Deck Compiled", `"${newDeck.title}" secured in vault.`, "success");
    } catch (err) {
      console.error("Deck Save Error:", err);
      notificationService.send("System Error", `Save failed: ${err?.message || 'Unknown error'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'library') {
    return (
      <div className="space-y-12 pb-32 nv-page-transition px-4 sm:px-8 max-w-7xl mx-auto">
        <header className="relative flex flex-col md:flex-row items-end justify-between gap-10 border-b-[6px] border-white/10 pb-12 mb-16 mt-8">
          <div className="absolute top-0 right-10 w-96 h-96 bg-nuvio-blue/20 blur-[120px] pointer-events-none rounded-full" />
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-4 bg-black border-[3px] border-nuvio-blue shadow-[6px_6px_0_#3B82F6] px-6 py-2 transform -skew-x-6">
              <Database className="w-6 h-6 text-nuvio-blue" />
              <span className="text-sm font-black text-white uppercase tracking-widest">Neural Storage</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-nuvio-blue uppercase tracking-tighter leading-none filter drop-shadow-lg">
              Mnemonic <br /> Vault
            </h1>
          </div>
          <button 
            onClick={() => setView('create')}
            className="relative overflow-hidden group bg-nuvio-blue px-10 py-5 rounded-2xl flex items-center gap-4 border border-white/20 shadow-xl shadow-nuvio-blue/30 hover:scale-105 transition-all active:scale-95 z-10"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-6 h-6 text-black relative z-10" />
            <span className="text-xs font-black text-black uppercase tracking-[0.2em] relative z-10">Construct Deck</span>
          </button>
        </header>

        {decks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 border-4 border-dashed border-white/5 text-center rounded-[40px] bg-black/40 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
            
            {/* 3D Data Cube Graphic */}
            <div className="relative w-48 h-48 mb-12 perspective-1000">
               <motion.div 
                 animate={{ rotateY: 360, rotateX: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 relative mx-auto"
                 style={{ transformStyle: 'preserve-3d' }}
               >
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ transform: 'translateZ(48px)' }} />
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
                 <div className="absolute inset-0 border-2 border-nuvio-blue bg-nuvio-blue/10" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
               </motion.div>
            </div>

            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">Vault Cold</h3>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-12 relative z-10">No cognitive modules detected in neural storage.</p>
            
            <button onClick={() => setView('create')} className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] relative z-10">
              Initialize First Deck
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {decks.filter(d => d).map((deck) => (
                <motion.div 
                  key={deck.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex flex-col justify-between p-8 bg-[#0d0d12] border-2 border-white/5 hover:border-nuvio-blue/40 rounded-[32px] transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-nuvio-blue/10 blur-3xl rounded-full group-hover:bg-nuvio-blue/20 transition-all" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-[20px] bg-black border-2 border-white/10 flex items-center justify-center text-nuvio-blue group-hover:bg-nuvio-blue group-hover:text-black group-hover:border-nuvio-blue transition-all shadow-lg">
                        <SubjectIcon subject={deck.subject} className="w-8 h-8" />
                      </div>
                      <button 
                        onClick={() => deleteDeck(deck.id)}
                        className="p-3 bg-black border-2 border-white/5 hover:border-nuvio-red text-white/20 hover:text-nuvio-red hover:bg-nuvio-red/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-4">{deck.title}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                         <span className="px-3 py-1.5 bg-nuvio-blue/10 border border-nuvio-blue/20 text-[10px] font-black text-nuvio-blue uppercase tracking-widest rounded-lg">{deck.subject}</span>
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3" /> {deck.cards?.length || 0} Cards</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
                     <button 
                       onClick={() => startStudy(deck)}
                       className="w-full py-5 bg-white/5 hover:bg-nuvio-blue text-white hover:text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all"
                     >
                       <Play className="w-4 h-4" /> Commence
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  if (view === 'study' && selectedDeck) {
    const currentCard = selectedDeck.cards[currentCardIdx];
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4 sm:px-8 mt-12">
        <header className="flex items-center justify-between bg-black p-6 rounded-3xl border-2 border-white/5 shadow-2xl">
          <button 
            onClick={() => setView('library')}
            className="p-4 bg-white/5 border-2 border-transparent hover:border-white/10 rounded-xl text-white hover:bg-white/10 transition-all group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-center flex-1 px-8">
            <span className="text-[10px] font-black text-nuvio-cyan uppercase tracking-[0.4em] block mb-3">Syncing: {selectedDeck.title}</span>
            <div className="flex items-center gap-6">
               <div className="text-xs font-black text-white px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                 {currentCardIdx + 1} <span className="text-white/30 mx-2">/</span> {selectedDeck.cards.length}
               </div>
               <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-nuvio-blue to-nuvio-cyan"
                   initial={{ width: 0 }}
                   animate={{ width: `${((currentCardIdx + 1) / selectedDeck.cards.length) * 100}%` }}
                 />
               </div>
            </div>
          </div>
          <div className="w-16" />
        </header>

        <div className="perspective-2000 h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentCardIdx}
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-[#0a0a0f] border-4 border-white/5 rounded-[40px] p-16 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden group-hover:border-nuvio-blue/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-nuvio-blue/5 to-transparent pointer-events-none" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/5 border border-white/10 text-[10px] font-black text-white/50 uppercase tracking-[0.3em] rounded-xl flex items-center gap-3">
                    <Orbit className="w-4 h-4 animate-spin-slow" /> Front
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight max-w-2xl relative z-10">
                    {currentCard?.front || ''}
                  </h2>
                  <div className="absolute bottom-10 flex flex-col items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-6 h-6 text-nuvio-blue animate-pulse" />
                    <span className="text-[9px] font-black text-nuvio-blue uppercase tracking-[0.3em]">Tap to flip</span>
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden bg-[#0d1218] border-4 border-nuvio-green/30 rounded-[40px] p-16 flex flex-col items-center justify-center text-center shadow-[0_0_80px_rgba(74,222,128,0.15)] overflow-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-nuvio-green/10 to-transparent pointer-events-none" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-nuvio-green/10 border border-nuvio-green/20 text-[10px] font-black text-nuvio-green uppercase tracking-[0.3em] rounded-xl flex items-center gap-3">
                    <Brain className="w-4 h-4" /> Solution
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl relative z-10">
                    {currentCard?.back || ''}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-6 h-24">
          <button 
            onClick={() => handleNext(false)} 
            className="flex items-center justify-center gap-4 bg-black border-4 border-nuvio-red/20 hover:border-nuvio-red hover:bg-nuvio-red/10 text-nuvio-red text-sm font-black uppercase tracking-[0.2em] rounded-[24px] transition-all active:scale-95"
          >
            <XCircle className="w-8 h-8" /> Retry
          </button>
          <button 
            onClick={() => handleNext(true)} 
            className="flex items-center justify-center gap-4 bg-nuvio-green border-4 border-nuvio-green hover:bg-transparent text-black hover:text-nuvio-green text-sm font-black uppercase tracking-[0.2em] rounded-[24px] transition-all shadow-[0_0_40px_rgba(74,222,128,0.3)] hover:shadow-none active:scale-95"
          >
            <CheckCircle2 className="w-8 h-8" /> Mastered
          </button>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4 sm:px-8 mt-12">
        <header className="flex items-center gap-8 bg-black p-6 rounded-3xl border-2 border-white/5 shadow-2xl">
          <button onClick={() => setView('library')} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all border border-transparent hover:border-white/10">
             <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Deck Constructor</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mt-2">Initialize new memory block</p>
          </div>
        </header>

        <div className="space-y-8">
          <div className="bg-[#0a0a0f] border-2 border-white/5 rounded-[32px] p-10 space-y-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Deck Designation</label>
                <input 
                  className="w-full bg-black border-2 border-white/10 rounded-xl px-6 py-5 text-xl font-black text-white outline-none focus:border-nuvio-blue transition-colors placeholder:text-white/10 uppercase" 
                  placeholder="E.G. PHYSICS 101"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({...newDeck, title: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Sector Label</label>
                <input 
                  className="w-full bg-black border-2 border-white/10 rounded-xl px-6 py-5 text-xl font-black text-nuvio-blue outline-none focus:border-nuvio-blue transition-colors placeholder:text-nuvio-blue/20 uppercase" 
                  placeholder="E.G. SCIENCE"
                  value={newDeck.subject}
                  onChange={(e) => setNewDeck({...newDeck, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t-2 border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-4">
                  <Layers className="w-6 h-6 text-nuvio-cyan" /> 
                  Card Units <span className="bg-white/10 px-3 py-1 rounded-md text-xs">{newDeck.cards.length}</span>
                </h3>
              </div>
              
              <div className="space-y-8">
                <AnimatePresence>
                  {newDeck.cards.map((card, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={idx} 
                      className="group relative p-8 bg-black border-2 border-white/5 hover:border-nuvio-blue/30 rounded-[24px] transition-all space-y-6"
                    >
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-nuvio-blue text-xs font-black flex items-center justify-center text-black border-4 border-[#0a0a0f] shadow-lg">
                         {idx + 1}
                      </div>
                      {newDeck.cards.length > 1 && (
                        <button 
                          onClick={() => {
                            const updated = newDeck.cards.filter((_, i) => i !== idx);
                            setNewDeck({...newDeck, cards: updated});
                          }}
                          className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-[#0a0a0f] border-2 border-white/10 hover:border-nuvio-red text-white/30 hover:text-nuvio-red hover:bg-nuvio-red/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <div className="space-y-6 pl-4">
                        <input 
                          className="w-full bg-transparent border-b-2 border-white/5 hover:border-white/20 py-4 outline-none focus:border-nuvio-blue text-2xl font-black text-white placeholder:text-white/10 transition-colors" 
                          placeholder="FRONT (QUESTION)"
                          value={card.front}
                          onChange={(e) => {
                            const updated = [...newDeck.cards];
                            updated[idx].front = e.target.value;
                            setNewDeck({...newDeck, cards: updated});
                          }}
                        />
                        <textarea 
                          className="w-full bg-transparent border-b-2 border-white/5 hover:border-white/20 py-4 outline-none focus:border-nuvio-green text-xl font-bold text-nuvio-green placeholder:text-nuvio-green/20 resize-none min-h-[80px] transition-colors" 
                          placeholder="BACK (SOLUTION)"
                          value={card.back}
                          onChange={(e) => {
                            const updated = [...newDeck.cards];
                            updated[idx].back = e.target.value;
                            setNewDeck({...newDeck, cards: updated});
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setNewDeck({...newDeck, cards: [...newDeck.cards, { front: '', back: '' }]})}
                className="w-full py-8 text-xs font-black text-white/40 hover:text-white uppercase tracking-[0.3em] border-4 border-dashed border-white/5 hover:border-white/20 rounded-[24px] hover:bg-white/5 transition-all flex items-center justify-center gap-4 mt-8"
              >
                <Plus className="w-6 h-6" /> Add Card
              </button>
            </div>
          </div>

          <button 
            onClick={saveNewDeck}
            className="w-full h-24 bg-nuvio-blue text-black hover:bg-white text-lg font-black uppercase tracking-[0.3em] rounded-[32px] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-4 group active:scale-95"
          >
            Deploy to Vault <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Flashcards;
