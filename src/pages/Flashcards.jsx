import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Play, 
  MoreVertical, Edit3, Trash2, 
  ChevronLeft, Sparkles, Brain, 
  RotateCcw, CheckCircle2, XCircle,
  Save, X, BookMarked, Layers,
  Trophy, Star, ArrowRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('library'); // library, study, create
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
    } catch (err) {
      console.error("Mnemonic Vault Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id) => {
    try {
      await dataService.delete('decks', id);
      setDecks(decks.filter(d => d.id !== id));
      notificationService.send("Vault Cleared", "Neural deck successfully purged.", "info");
    } catch (err) {
      console.error("Cloud delete failed:", err);
    }
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

    if (currentCardIdx < selectedDeck.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIdx(currentCardIdx + 1), 300);
    } else {
      const totalMastered = stats.mastered + (isMastered ? 1 : 0);
      const gainedXp = totalMastered * 15; // 15 XP per mastered card
      const baseTokens = totalMastered * 5; // 5 Era Tokens per mastered card
      
      xpService.awardXp(gainedXp, `Mastery: ${selectedDeck.title}`);
      notificationService.send("Session Complete", `Gained +${gainedXp} XP and ${baseTokens} Tokens.`, "success");
      
      setView('library');
      setSelectedDeck(null);
    }
  };

  const saveNewDeck = async () => {
    if (!newDeck.title || newDeck.cards.some(c => !c.front || !c.back)) {
      notificationService.send("Error", "All cards must have a front and back.", "error");
      return;
    }
    setLoading(true);
    try {
      const created = await dataService.create('decks', newDeck);
      setDecks([created, ...decks]);
      setView('library');
      setNewDeck({ title: '', subject: 'General', cards: [{ front: '', back: '' }] });
      notificationService.send("New Deck Added", `"${newDeck.title}" added to your study arsenal.`, "success");
    } catch (err) {
      console.error("Cloud save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'library') {
    return (
      <div className="space-y-10 pb-20 nv-page-transition">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-10 rounded-[32px] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nuvio-blue/5 blur-[100px] pointer-events-none" />
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Mnemonic Vault</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-nuvio-blue" />
              Preserving {decks.length} Neural Modules
            </p>
          </div>
          <button 
            onClick={() => setView('create')}
            className="nv-btn-primary gap-4 px-10 h-16 uppercase tracking-widest text-xs shadow-xl shadow-nuvio-purple-500/20"
          >
            <Plus className="w-6 h-6" /> Construct New Deck
          </button>
        </header>

        {decks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <BookMarked className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Your vault is clean</h3>
            <p className="text-sm text-text-muted mt-2 max-w-xs text-center leading-relaxed">No study modules detected in the cloud. Initialize your first deck to begin active recall.</p>
            <button onClick={() => setView('create')} className="mt-8 text-xs font-black text-nuvio-purple-400 uppercase tracking-widest hover:text-nuvio-purple-300">
               + Create Module 01
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {decks.map((deck) => (
              <motion.div 
                key={deck.id} 
                layout
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="nv-card p-10 flex flex-col justify-between relative group hover:border-nuvio-purple-500/30 transition-all border-white/5"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center text-nuvio-purple-400 font-black text-3xl group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all shadow-inner">
                      {deck.subject?.charAt(0) || 'D'}
                    </div>
                    <button 
                      onClick={() => deleteDeck(deck.id)}
                      className="p-3 bg-white/5 rounded-xl text-text-muted hover:text-nuvio-red hover:bg-nuvio-red/10 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-sm">{deck.title}</h3>
                    <div className="flex items-center gap-4 mt-4">
                       <span className="px-3 py-1 bg-nuvio-purple-500/10 border border-nuvio-purple-500/20 text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest rounded-full">{deck.subject}</span>
                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5"><Layers className="w-3 h-3" /> {deck.cards.length} Cards</span>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5">
                   <button 
                     onClick={() => startStudy(deck)}
                     className="nv-btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest gap-4 group/btn"
                   >
                     <Play className="w-4 h-4 text-nuvio-blue fill-nuvio-blue group-hover/btn:translate-x-0.5 transition-transform" /> 
                     Commence Session
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'study' && selectedDeck) {
    const currentCard = selectedDeck.cards[currentCardIdx];
    return (
      <div className="max-w-3xl mx-auto space-y-12 pb-24 nv-page-transition">
        <header className="flex items-center justify-between">
          <button 
            onClick={() => setView('library')}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="text-center">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-2">Neural Link: {selectedDeck.title}</span>
            <div className="flex items-center gap-4">
               <div className="text-xs font-black text-white px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                 {currentCardIdx + 1} / {selectedDeck.cards.length}
               </div>
               <div className="flex-1 h-1.5 w-48 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-nuvio-purple-500"
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
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 10 }}
              className="relative w-full h-full cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 backface-hidden nv-card bg-[#0d0d12] border-2 border-white/5 p-16 flex flex-col items-center justify-center text-center shadow-2xl"
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-nuvio-purple-500/10 border border-nuvio-purple-500/20 text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest rounded-full">
                    TRANSMISSION FRONT
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-normal max-w-lg">
                    {currentCard.front}
                  </h2>
                  <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-8 h-8 text-nuvio-yellow animate-pulse" />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Click to reveal solution</span>
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden nv-card bg-[#12121e] border-2 border-nuvio-purple-500/40 p-16 flex flex-col items-center justify-center text-center shadow-[0_0_60px_rgba(168,85,247,0.15)]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-nuvio-green/10 border border-nuvio-green/20 text-[10px] font-black text-nuvio-green uppercase tracking-widest rounded-full">
                    NEURAL SOLUTION
                  </div>
                  <p className="text-2xl font-bold text-white leading-relaxed max-w-lg">
                    {currentCard.back}
                  </p>
                  <div className="absolute bottom-12 flex items-center gap-3">
                     <Brain className="w-8 h-8 text-nuvio-green" />
                     <span className="text-[10px] font-black text-nuvio-green uppercase tracking-widest">Knowledge Decrypted</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-8 h-24">
          <button 
            onClick={() => handleNext(false)} 
            className="nv-btn-secondary border-nuvio-red/20 bg-nuvio-red/5 text-nuvio-red hover:bg-nuvio-red/10 text-xs font-black uppercase tracking-[0.2em] gap-4"
          >
            <XCircle className="w-6 h-6" /> Require Sync
          </button>
          <button 
            onClick={() => handleNext(true)} 
            className="nv-btn-primary bg-nuvio-green hover:bg-nuvio-green/90 text-xs font-black uppercase tracking-[0.2em] gap-4 shadow-xl shadow-nuvio-green/10"
          >
            <CheckCircle2 className="w-6 h-6" /> Mastery Confirmed
          </button>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="max-w-3xl mx-auto space-y-12 pb-24 nv-page-transition">
        <header className="flex items-center gap-8">
          <button onClick={() => setView('library')} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all border border-white/5">
             <ChevronLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Construct Module</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">Expanding Neural Capacity</p>
          </div>
        </header>

        <div className="space-y-8">
          <div className="nv-card p-10 space-y-10 border-white/5 bg-white/[0.01]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="nv-label">Deck Identifier</label>
                <input 
                  className="nv-input bg-background-dark/50" 
                  placeholder="e.g. Astrophysics 101"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({...newDeck, title: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="nv-label">Subject Label</label>
                <input 
                  className="nv-input bg-background-dark/50 text-nuvio-purple-400" 
                  placeholder="e.g. Science"
                  value={newDeck.subject}
                  onChange={(e) => setNewDeck({...newDeck, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="nv-label">Unit Transmission ({newDeck.cards.length})</label>
              </div>
              
              <div className="space-y-6">
                {newDeck.cards.map((card, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx} 
                    className="group relative p-8 bg-white/5 rounded-[24px] border border-white/5 hover:border-nuvio-purple-500/20 transition-all space-y-6 shadow-inner"
                  >
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-nuvio-purple-500 text-[10px] font-black flex items-center justify-center text-white border-4 border-background-base">
                       {idx + 1}
                    </div>
                    {newDeck.cards.length > 1 && (
                      <button 
                        onClick={() => {
                          const updated = newDeck.cards.filter((_, i) => i !== idx);
                          setNewDeck({...newDeck, cards: updated});
                        }}
                        className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white/10 hover:bg-nuvio-red text-text-muted hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="space-y-4">
                      <input 
                        className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-nuvio-purple-400 text-lg font-black text-white placeholder:text-white/10" 
                        placeholder="Front - Input Question"
                        value={card.front}
                        onChange={(e) => {
                          const updated = [...newDeck.cards];
                          updated[idx].front = e.target.value;
                          setNewDeck({...newDeck, cards: updated});
                        }}
                      />
                      <textarea 
                        className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-nuvio-green/30 text-base font-medium text-text-secondary placeholder:text-white/10 resize-none min-h-[60px]" 
                        placeholder="Back - Input Solution"
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
              </div>

              <button 
                onClick={() => setNewDeck({...newDeck, cards: [...newDeck.cards, { front: '', back: '' }]})}
                className="w-full py-8 text-[11px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em] border-2 border-dashed border-nuvio-purple-500/20 rounded-[28px] hover:bg-nuvio-purple-500/5 transition-all flex items-center justify-center gap-4 hover:border-nuvio-purple-500/40"
              >
                <Plus className="w-6 h-6" /> Inject Card Slot
              </button>
            </div>
          </div>

          <button 
            onClick={saveNewDeck}
            className="nv-btn-primary w-full h-20 text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-nuvio-purple-500/30 group"
          >
            Archive to Vault <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Flashcards;
