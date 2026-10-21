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
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Active Retrieval / Spaced Repetition Decks
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Flashcard Decks
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Self-testing mnemonic cards designed for rapid NCERT definitions, theorems, and formula retrieval.
          </p>
        </div>

        {view === 'library' ? (
          <button
            onClick={() => setView('create')}
            className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)] self-start sm:self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Deck</span>
          </button>
        ) : (
          <button
            onClick={() => { setView('library'); setSelectedDeck(null); }}
            className="px-4 py-2.5 bg-[#f5f3ec] hover:bg-[#ede9de] border border-[#e5e1d5] rounded-lg font-mono text-xs uppercase tracking-wider text-[#52504a] hover:text-[#1a1917] transition-colors flex items-center gap-2 self-start sm:self-end"
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
          <div className="flex items-center justify-between text-xs font-mono text-[#52504a] border-b border-[#e5e1d5] pb-4">
            <div>
              <span className="text-[#1a1917] font-bold">{selectedDeck.title}</span>
              <span className="text-[#1b3b2b] ml-2 font-semibold">({selectedDeck.subject})</span>
            </div>
            <div>
              Card {Math.min(currentCardIdx + 1, selectedDeck.cards.length)} of {selectedDeck.cards.length}
            </div>
          </div>

          {isStudyComplete ? (
            /* Study Completion Card */
            <div className="p-10 border border-[#e5e1d5] bg-white rounded-2xl text-center space-y-6 shadow-[0_4px_20px_rgba(27,59,43,0.04)]">
              <div className="w-14 h-14 rounded-full bg-[#1b3b2b]/10 border border-[#1b3b2b]/20 text-[#1b3b2b] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#827f76]">Session Concluded</span>
                <h3 className="text-2xl font-serif font-bold text-[#1a1917] mt-1">
                  Active Retrieval Complete
                </h3>
              </div>
              <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl max-w-sm mx-auto grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#827f76]">Retained</span>
                  <div className="text-2xl font-serif font-bold text-[#1b3b2b]">{score.remembered}</div>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#827f76]">Needs Review</span>
                  <div className="text-2xl font-serif font-bold text-[#a46a29]">{score.review}</div>
                </div>
              </div>
              <button
                onClick={() => startStudy(selectedDeck)}
                className="px-6 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 mx-auto shadow-sm"
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
                className="min-h-[280px] p-8 border border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/30 rounded-2xl cursor-pointer transition-all flex flex-col justify-between select-none relative shadow-[0_4px_20px_rgba(27,59,43,0.04)]"
              >
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#827f76]">
                  <span>{isFlipped ? 'Answer / Explanation' : 'Prompt / Query'}</span>
                  <span className="text-[#1b3b2b]">Click anywhere to flip</span>
                </div>

                <div className="py-8 text-center">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1917] leading-relaxed">
                    {isFlipped 
                      ? selectedDeck.cards[currentCardIdx]?.back 
                      : selectedDeck.cards[currentCardIdx]?.front}
                  </h3>
                </div>

                <div className="text-center font-mono text-[10px] text-[#827f76] uppercase tracking-widest">
                  {isFlipped ? 'Click to view prompt' : 'Click to unveil answer'}
                </div>
              </div>

              {/* Evaluation Buttons (Enabled when flipped) */}
              {isFlipped && (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  <button
                    onClick={() => handleCardFeedback(false)}
                    className="p-4 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] text-[#a46a29] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Needs More Review</span>
                  </button>

                  <button
                    onClick={() => handleCardFeedback(true)}
                    className="p-4 border border-[#1b3b2b]/30 bg-[#1b3b2b]/5 hover:bg-[#1b3b2b]/10 text-[#1b3b2b] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm font-bold"
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
      {/* VIEW: CREATE DECK */}
      {view === 'create' && (
        <form onSubmit={handleSaveDeck} className="max-w-2xl mx-auto space-y-8">
          <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl shadow-[0_4px_20px_rgba(27,59,43,0.04)] space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#1a1917]">Construct Mnemonic Deck</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">Deck Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Science Chapter 9 Formulas"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-sm text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">Subject</label>
                <select
                  value={newDeck.subject}
                  onChange={(e) => setNewDeck({ ...newDeck, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-xs font-mono uppercase text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
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
            <div className="space-y-4 pt-4 border-t border-[#e5e1d5]">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[#52504a] font-bold">
                  Card Pairs ({newDeck.cards.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddCardInput}
                  className="text-xs font-mono uppercase text-[#1b3b2b] hover:text-[#26523c] flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Card</span>
                </button>
              </div>

              {newDeck.cards.map((card, idx) => (
                <div key={idx} className="p-4 border border-[#e5e1d5] bg-[#fbfbfa] rounded-xl space-y-3">
                  <div className="text-[10px] font-mono text-[#827f76] uppercase">Card #{idx + 1}</div>
                  <input
                    type="text"
                    required
                    placeholder="Front: Concept or question prompt"
                    value={card.front}
                    onChange={(e) => handleCardInputChange(idx, 'front', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e1d5] rounded-md text-xs text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Back: Accurate definition or explanation"
                    value={card.back}
                    onChange={(e) => handleCardInputChange(idx, 'back', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e1d5] rounded-md text-xs text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
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
              className="p-6 border border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/40 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-56 group relative shadow-[0_2px_12px_rgba(27,59,43,0.03)]"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#1b3b2b] font-bold bg-[#1b3b2b]/10 px-2 py-0.5 rounded">
                  {deck.subject || 'Curriculum'}
                </span>
                <button
                  onClick={(e) => deleteDeck(deck.id, e)}
                  className="p-1.5 text-[#827f76] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Deck"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1a1917] group-hover:text-[#1b3b2b] transition-colors line-clamp-2">
                  {deck.title}
                </h3>
                <span className="font-mono text-[10px] text-[#827f76] mt-2 block">
                  {deck.cards?.length || 0} retrieval cards
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e5e1d5] text-xs text-[#52504a] font-mono">
                <span>Start Review</span>
                <ArrowRight className="w-4 h-4 text-[#827f76] group-hover:text-[#1b3b2b] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Flashcards;