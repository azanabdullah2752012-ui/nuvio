import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Trash2, 
  ChevronLeft, Brain, 
  CheckCircle2, BookMarked,
  ArrowRight, RotateCcw, Check, X,
  Layers, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const DEFAULT_DECKS = [
  {
    id: 'deck-science-9',
    title: 'Class 9 Science: Laws of Motion',
    subject: 'Science',
    cards: [
      { front: 'State Newton’s First Law of Motion.', back: 'An object remains in a state of rest or uniform motion in a straight line unless acted upon by an external unbalanced force.' },
      { front: 'What is the mathematical formulation of Newton’s Second Law?', back: 'F = m × a (Force = mass × acceleration). SI unit is Newton (N) or kg·m/s².' },
      { front: 'Define Inertia and its relationship with mass.', back: 'Inertia is the natural tendency of an object to resist a change in its state of rest or motion. Mass is the measure of inertia.' },
      { front: 'State Newton’s Third Law of Motion with an example.', back: 'To every action, there is an equal and opposite reaction. Example: When firing a bullet, the gun recoils backward.' }
    ]
  },
  {
    id: 'deck-math-9',
    title: 'Class 9 Mathematics: Coordinate Geometry',
    subject: 'Mathematics',
    cards: [
      { front: 'What are the names of the horizontal and vertical axes in the Cartesian plane?', back: 'The horizontal line is called the X-axis (Abscissa); the vertical line is the Y-axis (Ordinate).' },
      { front: 'What are the coordinates of the origin?', back: '(0, 0) — the intersection point of the X and Y axes.' },
      { front: 'In which quadrant does the point (-3, 5) lie?', back: 'Quadrant II (where x is negative and y is positive).' },
      { front: 'What is the y-coordinate of any point lying on the x-axis?', back: 'Zero (0). Any point on the x-axis has coordinates (x, 0).' }
    ]
  }
];

const Flashcards = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('library'); // 'library' | 'study' | 'create'
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ remembered: 0, review: 0 });
  const [newDeck, setNewDeck] = useState({ title: '', subject: 'Science', cards: [{ front: '', back: '' }] });

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    setLoading(true);
    try {
      const list = await dataService.list('decks');
      if (list && list.length > 0) {
        setDecks(list);
      } else {
        // Seed initial NCERT decks
        setDecks(DEFAULT_DECKS);
        for (const d of DEFAULT_DECKS) {
          await dataService.create('decks', d);
        }
      }
    } catch (err) {
      setDecks(DEFAULT_DECKS);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id, e) => {
    e?.stopPropagation();
    try {
      await dataService.delete('decks', id);
      setDecks(decks.filter(d => d.id !== id));
      notificationService.send("Deck Removed", "Study deck excised from storage.", "info");
    } catch (err) {
      console.warn("Delete deck error:", err);
    }
  };

  const startStudy = (deck) => {
    setSelectedDeck(deck);
    setCurrentCardIdx(0);
    setScore({ remembered: 0, review: 0 });
    setIsFlipped(false);
    setView('study');
  };

  const handleCardFeedback = (remembered) => {
    if (remembered) {
      setScore(prev => ({ ...prev, remembered: prev.remembered + 1 }));
    } else {
      setScore(prev => ({ ...prev, review: prev.review + 1 }));
    }

    if (selectedDeck?.cards && currentCardIdx < selectedDeck.cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIdx(prev => prev + 1);
    } else {
      // Completed all cards in deck
      notificationService.send(
        "Deck Concluded",
        `Reviewed ${selectedDeck.cards.length} cards in ${selectedDeck.title}.`,
        "success"
      );
    }
  };

  const handleAddCardInput = () => {
    setNewDeck(prev => ({
      ...prev,
      cards: [...prev.cards, { front: '', back: '' }]
    }));
  };

  const handleCardInputChange = (index, field, value) => {
    const updatedCards = [...newDeck.cards];
    updatedCards[index][field] = value;
    setNewDeck(prev => ({ ...prev, cards: updatedCards }));
  };

  const handleSaveDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.title.trim() || newDeck.cards.some(c => !c.front.trim() || !c.back.trim())) {
      notificationService.send("Validation Error", "All cards require both a prompt and an explanation.", "error");
      return;
    }

    try {
      const created = await dataService.create('decks', newDeck);
      setDecks(prev => [created, ...prev]);
      setView('library');
      setNewDeck({ title: '', subject: 'Science', cards: [{ front: '', back: '' }] });
      notificationService.send("Deck Created", `Deck "${created.title}" ready for spaced review.`, "success");
    } catch (err) {
      notificationService.send("Creation Error", "Could not commit new deck.", "error");
    }
  };

  const isStudyComplete = selectedDeck?.cards && currentCardIdx >= selectedDeck.cards.length - 1 && (score.remembered + score.review) >= selectedDeck.cards.length;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Active Recall / Spaced Repetition Console
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Flashcard Decks
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Self-testing mnemonic cards designed for rapid NCERT definitions, theorems, and formula retrieval.
          </p>
        </div>

        {view === 'library' ? (
          <button
            onClick={() => setView('create')}
            className="px-5 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm self-start sm:self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Deck</span>
          </button>
        ) : (
          <button
            onClick={() => { setView('library'); setSelectedDeck(null); }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors flex items-center gap-2 self-start sm:self-end"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Decks</span>
          </button>
        )}
      </header>

      {/* VIEW: STUDY MODE */}
      {view === 'study' && selectedDeck && (
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-4">
            <div>
              <span className="text-white font-bold">{selectedDeck.title}</span>
              <span className="text-[#ff4625] ml-2">({selectedDeck.subject})</span>
            </div>
            <div>
              Card {Math.min(currentCardIdx + 1, selectedDeck.cards.length)} of {selectedDeck.cards.length}
            </div>
          </div>

          {isStudyComplete ? (
            /* Study Completion Card */
            <div className="p-10 border border-white/10 bg-[#0d0f14] rounded-2xl text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Session Concluded</span>
                <h3 className="text-2xl font-bold uppercase text-white font-clash mt-1">
                  Active Retrieval Complete
                </h3>
              </div>
              <div className="p-4 bg-[#08090b] border border-white/5 rounded-xl max-w-sm mx-auto grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-[9px] font-mono uppercase text-zinc-500">Retained</span>
                  <div className="text-2xl font-bold text-emerald-400 font-clash">{score.remembered}</div>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-zinc-500">Needs Review</span>
                  <div className="text-2xl font-bold text-rose-400 font-clash">{score.review}</div>
                </div>
              </div>
              <button
                onClick={() => startStudy(selectedDeck)}
                className="px-6 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat Deck</span>
              </button>
            </div>
          ) : (
            /* Active Interactive Flip Card */
            <div className="space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[280px] p-8 border border-white/10 bg-[#0d0f14] hover:border-white/20 rounded-2xl cursor-pointer transition-all flex flex-col justify-between select-none relative"
              >
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500">
                  <span>{isFlipped ? 'Answer / Reference' : 'Prompt / Question'}</span>
                  <span>Click anywhere to flip</span>
                </div>

                <div className="py-8 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-sans leading-relaxed">
                    {isFlipped 
                      ? selectedDeck.cards[currentCardIdx]?.back 
                      : selectedDeck.cards[currentCardIdx]?.front}
                  </h3>
                </div>

                <div className="text-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  {isFlipped ? 'Tap to view prompt' : 'Tap to unveil answer'}
                </div>
              </div>

              {/* Evaluation Buttons (Enabled when flipped) */}
              {isFlipped && (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  <button
                    onClick={() => handleCardFeedback(false)}
                    className="p-4 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Needs More Review</span>
                  </button>

                  <button
                    onClick={() => handleCardFeedback(true)}
                    className="p-4 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Retrieved Accurately</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VIEW: CREATE DECK */}
      {view === 'create' && (
        <form onSubmit={handleSaveDeck} className="max-w-2xl mx-auto space-y-8">
          <div className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <h2 className="font-clash text-xl font-bold uppercase text-white">Construct Mnemonic Deck</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">Deck Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Science Chapter 9 Formulas"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff4625]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">Subject</label>
                <select
                  value={newDeck.subject}
                  onChange={(e) => setNewDeck({ ...newDeck, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:border-[#ff4625]"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            {/* Dynamic Card Fields */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
                  Card Pairs ({newDeck.cards.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddCardInput}
                  className="text-xs font-mono uppercase text-[#ff4625] hover:text-[#ff5738] flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Card</span>
                </button>
              </div>

              {newDeck.cards.map((card, idx) => (
                <div key={idx} className="p-4 border border-white/5 bg-[#08090b] rounded-xl space-y-3">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Card #{idx + 1}</div>
                  <input
                    type="text"
                    required
                    placeholder="Front: Concept or question prompt"
                    value={card.front}
                    onChange={(e) => handleCardInputChange(idx, 'front', e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-md text-xs text-white focus:outline-none focus:border-[#ff4625]"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Back: Accurate definition or explanation"
                    value={card.back}
                    onChange={(e) => handleCardInputChange(idx, 'back', e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-md text-xs text-white focus:outline-none focus:border-[#ff4625]"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all"
            >
              Commit Deck to Storage
            </button>
          </div>
        </form>
      )}

      {/* VIEW: LIBRARY */}
      {view === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => startStudy(deck)}
              className="p-6 border border-white/10 bg-[#0d0f14] hover:border-[#ff4625]/40 hover:bg-[#12151c] rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-56 group relative"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625] font-bold bg-[#ff4625]/10 px-2 py-0.5 rounded">
                  {deck.subject || 'Curriculum'}
                </span>
                <button
                  onClick={(e) => deleteDeck(deck.id, e)}
                  className="p-1.5 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Deck"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-clash text-lg font-bold text-white uppercase group-hover:text-[#ff4625] transition-colors line-clamp-2">
                  {deck.title}
                </h3>
                <span className="font-mono text-[10px] text-zinc-500 mt-2 block">
                  {deck.cards?.length || 0} retrieval cards
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <span>Start Review</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ff4625] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Flashcards;