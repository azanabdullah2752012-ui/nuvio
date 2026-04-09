import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Play, 
  MoreVertical, Edit3, Trash2, 
  ChevronLeft, Sparkles, Brain, 
  RotateCcw, CheckCircle2, XCircle,
  Save, X, BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';

const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('library'); // library, study, create
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, tricky: 0 });
  
  // New Deck State
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
      console.error("Cloud deck sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id) => {
    try {
      await dataService.delete('decks', id);
      setDecks(decks.filter(d => d.id !== id));
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
      setTimeout(() => setCurrentCardIdx(currentCardIdx + 1), 250);
    } else {
      const gainedXp = (stats.mastered + (isMastered ? 1 : 0)) * 10;
      xpService.awardXp(gainedXp, `Studied ${selectedDeck.title}`);
      setView('library');
      setSelectedDeck(null);
    }
  };

  const saveNewDeck = async () => {
    if (!newDeck.title || newDeck.cards.some(c => !c.front || !c.back)) {
      alert("Please fill in all fields!");
      return;
    }
    setLoading(true);
    try {
      const created = await dataService.create('decks', newDeck);
      setDecks([...decks, created]);
      setView('library');
      setNewDeck({ title: '', subject: 'General', cards: [{ front: '', back: '' }] });
    } catch (err) {
      console.error("Cloud save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'library') {
    return (
      <div className="space-y-10 pb-20 nv-page-transition">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Flashcards</h1>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">Personal Study Vault</p>
          </div>
          <button onClick={() => setView('create')} className="nv-btn-primary gap-3 px-8 h-14 uppercase tracking-widest text-xs">
            <Plus className="w-5 h-5" /> New Deck
          </button>
        </div>

        {decks.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10">
            <BookMarked className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-secondary">Your vault is empty</h3>
            <p className="text-sm text-text-muted mt-2">Create your first deck to start mastering subjects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {decks.map((deck) => (
              <motion.div key={deck.id} whileHover={{ y: -8 }} className="nv-card flex flex-col justify-between p-10 relative overflow-hidden group">
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-nuvio-purple-500/10 flex items-center justify-center text-nuvio-purple-400 font-black text-2xl">
                      {deck.subject.charAt(0)}
                    </div>
                    <button onClick={() => deleteDeck(deck.id)} className="p-3 bg-white/5 rounded-xl text-text-muted hover:text-nuvio-red transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{deck.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">{deck.subject}</span>
                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{deck.cards.length} Cards</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => startStudy(deck)} className="mt-10 nv-btn-secondary w-full py-5 text-xs font-black uppercase tracking-widest gap-3">
                  <Play className="w-4 h-4 fill-current" /> Study Deck
                </button>
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
      <div className="max-w-2xl mx-auto space-y-10 pb-20 nv-page-transition">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('library')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white"><ChevronLeft className="w-6 h-6" /></button>
          <div className="text-center">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Studying: {selectedDeck.title}</span>
            <div className="text-xl font-black text-white">{currentCardIdx + 1} / {selectedDeck.cards.length}</div>
          </div>
          <div className="w-14" />
        </div>

        <div className="perspective-2000 h-[400px]">
          <motion.div 
            animate={{ rotateY: isFlipped ? 180 : 0 }} 
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)} 
            className="relative w-full h-full preserve-3d cursor-pointer"
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden nv-card border-2 border-white/10 bg-[#16161a] flex flex-col items-center justify-center p-12 text-center">
              <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest mb-8">QUESTION</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">{currentCard.front}</h2>
              <div className="mt-12 text-[9px] font-black text-text-muted uppercase tracking-widest animate-pulse">Click to Reveal</div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden nv-card bg-[#1a1a24] border-2 border-nuvio-purple-500/30 flex flex-col items-center justify-center p-12 text-center" 
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-[10px] font-black text-nuvio-green uppercase tracking-widest mb-8">ANSWER</span>
              <p className="text-xl font-bold text-white leading-relaxed">{currentCard.back}</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6 h-20">
          <button onClick={() => handleNext(false)} className="nv-btn-secondary bg-nuvio-red/5 border-nuvio-red/20 text-nuvio-red hover:bg-nuvio-red/10 text-xs font-black uppercase tracking-widest gap-3">
            <XCircle className="w-6 h-6" /> Still Tricky
          </button>
          <button onClick={() => handleNext(true)} className="nv-btn-primary bg-nuvio-green hover:bg-nuvio-green/90 text-xs font-black uppercase tracking-widest gap-3">
            <CheckCircle2 className="w-6 h-6" /> Mastered
          </button>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-20 nv-page-transition">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('library')} className="p-4 bg-white/5 rounded-2xl text-white"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Create New Deck</h1>
        </div>

        <div className="nv-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="nv-label">Deck Title</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-nuvio-purple-500 outline-none" 
              placeholder="e.g. Ancient Greek History"
              value={newDeck.title}
              onChange={(e) => setNewDeck({...newDeck, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="nv-label">Subject</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-nuvio-purple-500 outline-none" 
              placeholder="e.g. Humanities"
              value={newDeck.subject}
              onChange={(e) => setNewDeck({...newDeck, subject: e.target.value})}
            />
          </div>

          <div className="space-y-4 pt-6">
            <label className="nv-label">Cards</label>
            {newDeck.cards.map((card, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <input 
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-nuvio-purple-500 text-sm" 
                  placeholder="Front (Question)"
                  value={card.front}
                  onChange={(e) => {
                    const updated = [...newDeck.cards];
                    updated[idx].front = e.target.value;
                    setNewDeck({...newDeck, cards: updated});
                  }}
                />
                <textarea 
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-nuvio-purple-500 text-sm resize-none" 
                  placeholder="Back (Answer)"
                  value={card.back}
                  onChange={(e) => {
                    const updated = [...newDeck.cards];
                    updated[idx].back = e.target.value;
                    setNewDeck({...newDeck, cards: updated});
                  }}
                />
              </div>
            ))}
            <button 
              onClick={() => setNewDeck({...newDeck, cards: [...newDeck.cards, { front: '', back: '' }]})}
              className="w-full py-4 text-xs font-black text-nuvio-purple-400 uppercase tracking-widest border border-dashed border-nuvio-purple-500/30 rounded-2xl hover:bg-nuvio-purple-500/5 transition-all"
            >
              + Add Another Card
            </button>
          </div>
        </div>

        <button onClick={saveNewDeck} className="nv-btn-primary w-full h-16 text-sm font-black uppercase tracking-widest">
           Save Module
        </button>
      </div>
    );
  }

  return null;
};

export default Flashcards;
