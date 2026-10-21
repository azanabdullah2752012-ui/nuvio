import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Star, Zap, Clock, BookOpen, Brain, Check } from 'lucide-react';
import './styles.css';

const RevisionSuite = ({ chapter, subject }) => {
  const [subTab, setSubTab] = useState('notes');
  const [bookmarks, setBookmarks] = useState({});
  const [leitnerStates, setLeitnerStates] = useState({});
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('acadevance_revision_bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }

      const storedLeitner = localStorage.getItem('acadevance_leitner_states');
      if (storedLeitner) {
        setLeitnerStates(JSON.parse(storedLeitner));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleBookmark = (key, text, type) => {
    const updated = { ...bookmarks };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = { text, type, chapter: chapter?.title, subject };
    }
    setBookmarks(updated);
    localStorage.setItem('acadevance_revision_bookmarks', JSON.stringify(updated));
  };

  const getBookmarkKey = (type, index) => {
    return `${subject}_${chapter?.title}_${type}_${index}`;
  };

  const setCardLeitnerState = (cardIndex, state) => {
    const key = `${subject}_${chapter?.title}_card_${cardIndex}`;
    const updated = { ...leitnerStates, [key]: state };
    setLeitnerStates(updated);
    localStorage.setItem('acadevance_leitner_states', JSON.stringify(updated));
  };

  const activeBookmarks = Object.entries(bookmarks).filter(([_, item]) => 
    item.subject === subject && item.chapter === chapter?.title
  );

  const cards = chapter?.flashcards || [];
  const currentCardKey = `${subject}_${chapter?.title}_card_${cardIdx}`;
  const currentLeitnerState = leitnerStates[currentCardKey] || null;

  const activeMasteryScore = (() => {
    if (cards.length === 0) return 0;
    let totalScore = 0;
    cards.forEach((_, idx) => {
      const key = `${subject}_${chapter?.title}_card_${idx}`;
      const state = leitnerStates[key];
      if (state === 'mastered') totalScore += 100;
      else if (state === 'partial') totalScore += 50;
      else if (state === 'unsure') totalScore += 10;
    });
    return Math.round(totalScore / cards.length);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-6 text-left"
    >
      <div className="text-center space-y-1 mb-6">
        <span className="px-3 py-1 bg-[#ede9de] border border-[#d8d4c7] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase">
          Step 6: Revision Suite
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1917] mt-2">
          Study & Recall Suite
        </h2>
        <p className="text-[#52504a] text-xs">
          Access NCERT summaries, formulas, and flashcards. Bookmark key items for quick review.
        </p>
      </div>

      {/* Revision Sub-Tabs */}
      <div className="flex bg-[#f5f3ec] p-1.5 border border-[#e5e1d5] rounded-xl shadow-sm max-w-md mx-auto justify-between overflow-x-auto no-scrollbar">
        {[
          { id: 'notes', label: 'Summary', icon: BookOpen },
          { id: 'flashcards', label: 'Flashcards', icon: Zap },
          { id: 'formulas', label: 'Formulas', icon: Clock },
          { id: 'bookmarks', label: `Saved (${activeBookmarks.length})`, icon: Bookmark }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              subTab === tab.id 
                ? 'bg-[#1b3b2b] text-white shadow-sm font-bold' 
                : 'text-[#52504a] hover:text-[#1a1917]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content panel based on sub-tab */}
      <div className="pt-2 text-left">
        <AnimatePresence mode="wait">
          
          {/* Summary notes sub-tab */}
          {subTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {chapter?.keyIdeas?.map((idea, idx) => {
                const key = getBookmarkKey('note', idx);
                const isBookmarked = !!bookmarks[key];
                return (
                  <div key={idx} className="bg-white p-5 border border-[#e5e1d5] rounded-xl flex items-start justify-between gap-4 hover:border-[#1b3b2b]/30 transition-all shadow-sm">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
                        Concept Note {idx + 1}
                      </span>
                      <p className="text-xs text-[#1a1917] leading-relaxed">
                        {idea}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(key, idea, 'Note')}
                      className="text-[#827f76] hover:text-[#1b3b2b] p-1.5 shrink-0 transition-colors"
                      title={isBookmarked ? "Remove bookmark" : "Bookmark note"}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-[#1b3b2b]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                );
              }) || (
                <div className="text-[#827f76] text-xs font-mono uppercase text-center py-8">No summaries found.</div>
              )}
            </motion.div>
          )}

          {/* Flashcards player sub-tab */}
          {subTab === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto space-y-6"
            >
              {(cards.length === 0) ? (
                <div className="text-center p-8 bg-white border border-[#e5e1d5] rounded-xl text-[#827f76] text-xs font-mono uppercase">
                  No flashcards available for this chapter.
                </div>
              ) : (
                <>
                  {/* Memory Recall HUD and Statistics */}
                  <div className="flex items-center justify-between bg-white border border-[#e5e1d5] p-4 rounded-xl shadow-sm">
                    <div className="text-left space-y-0.5">
                      <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Card Deck</span>
                      <strong className="block text-sm font-mono font-bold text-[#1a1917]">Card {cardIdx + 1} of {cards.length}</strong>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#f5f3ec] border border-[#e5e1d5] px-3.5 py-1.5 rounded-lg">
                      <Brain className="w-4 h-4 text-[#1b3b2b]" />
                      <div className="text-[10px] text-left">
                        <span className="block font-mono uppercase tracking-wider text-[#827f76]">Active Recall</span>
                        <strong className="block font-mono text-[#1b3b2b] font-bold text-xs">{activeMasteryScore}% Mastered</strong>
                      </div>
                    </div>
                  </div>

                  {/* 3D Flapper Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full h-56 perspective-1000 cursor-pointer"
                  >
                    <div
                      className="relative w-full h-full preserve-3d transition-transform duration-500"
                      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Front Card */}
                      <div
                        className="absolute inset-0 backface-hidden bg-white border border-[#e5e1d5] rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">Question</span>
                          {currentLeitnerState && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f5f3ec] border border-[#e5e1d5] text-[#1b3b2b]">
                              {currentLeitnerState}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1a1917] text-center leading-snug px-4">
                          {cards[cardIdx].front}
                        </h4>
                        <span className="text-[10px] text-[#827f76] text-center font-mono uppercase tracking-wider">
                          Click card to flip
                        </span>
                      </div>

                      {/* Back Card */}
                      <div
                        className="absolute inset-0 backface-hidden bg-[#f5f3ec] border border-[#d8d4c7] rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">Answer</span>
                        <p className="text-xs md:text-sm text-[#1a1917] text-center leading-relaxed px-4">
                          {cards[cardIdx].back}
                        </p>
                        <span className="text-[10px] text-[#827f76] text-center font-mono uppercase tracking-wider">
                          Click to view question
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Leitner Spaced-Repetition Feedback Buttons */}
                  <div className="p-4 bg-white border border-[#e5e1d5] rounded-xl space-y-2.5 shadow-sm">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76] text-center">
                      Rate Active Recall
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'unsure', label: 'Unsure', style: 'hover:bg-[#fdf2f2] text-[#8e2424] border-[#e5e1d5]' },
                        { id: 'partial', label: 'Review', style: 'hover:bg-[#fef9ee] text-[#85570e] border-[#e5e1d5]' },
                        { id: 'mastered', label: 'Mastered', style: 'hover:bg-[#f5f3ec] text-[#1b3b2b] border-[#e5e1d5]' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardLeitnerState(cardIdx, item.id);
                          }}
                          className={`py-2 text-[10px] font-mono uppercase font-bold border rounded-lg transition-all flex items-center justify-center gap-1 ${
                            currentLeitnerState === item.id 
                              ? 'bg-[#1b3b2b] text-white border-transparent shadow-sm'
                              : `bg-white ${item.style}`
                          }`}
                        >
                          {currentLeitnerState === item.id && <Check className="w-3.5 h-3.5" />}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex justify-between items-center pt-1">
                    <button
                      disabled={cardIdx === 0}
                      onClick={() => {
                        setCardIdx(prev => prev - 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] disabled:opacity-30 rounded-lg text-xs font-mono uppercase text-[#52504a] hover:text-[#1a1917] transition-colors"
                    >
                      ◀ Back
                    </button>

                    <button
                      onClick={() => {
                        const key = getBookmarkKey('flashcard', cardIdx);
                        const cardText = `${cards[cardIdx].front} -> ${cards[cardIdx].back}`;
                        toggleBookmark(key, cardText, 'Card');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] rounded-lg text-xs font-mono uppercase text-[#52504a] hover:text-[#1a1917] transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-[#1b3b2b]" /> Bookmark
                    </button>

                    <button
                      disabled={cardIdx + 1 === cards.length}
                      onClick={() => {
                        setCardIdx(prev => prev + 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] disabled:opacity-30 rounded-lg text-xs font-mono uppercase text-[#52504a] hover:text-[#1a1917] transition-colors"
                    >
                      Next ▶
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Formulas Sheet sub-tab */}
          {subTab === 'formulas' && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {chapter?.formulas?.map((formula, idx) => {
                const key = getBookmarkKey('formula', idx);
                const isBookmarked = !!bookmarks[key];
                return (
                  <div key={idx} className="bg-white p-5 border border-[#e5e1d5] rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-[#1b3b2b]/30 transition-colors">
                    <div className="space-y-1.5 flex-1">
                      <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
                        Formula Card {idx + 1}
                      </span>
                      <div className="bg-[#fbfbfa] px-4 py-2.5 border border-[#e5e1d5] rounded-lg text-xs font-mono text-[#1a1917] select-all">
                        {formula}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(key, formula, 'Formula')}
                      className="text-[#827f76] hover:text-[#1b3b2b] p-1.5 shrink-0 transition-colors"
                      title={isBookmarked ? "Remove bookmark" : "Bookmark formula"}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-[#1b3b2b]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                );
              }) || (
                <div className="text-[#827f76] text-xs font-mono uppercase text-center py-8">
                  No formulas found for this chapter.
                </div>
              )}
            </motion.div>
          )}

          {/* Bookmarks sub-tab */}
          {subTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {activeBookmarks.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#e5e1d5] rounded-xl text-[#827f76] text-xs font-mono uppercase">
                  No Bookmarks Saved in this Chapter.
                </div>
              ) : (
                activeBookmarks.map(([bKey, bItem]) => (
                  <div key={bKey} className="bg-white p-5 border border-[#e5e1d5] rounded-xl flex items-start justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-[#f5f3ec] border border-[#e5e1d5] rounded text-[10px] font-mono font-bold uppercase tracking-wider text-[#1b3b2b]">
                        Saved: {bItem.type}
                      </span>
                      <p className="text-xs text-[#1a1917] leading-relaxed mt-1">
                        {bItem.text}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(bKey, bItem.text, bItem.type)}
                      className="text-[#1b3b2b] p-1.5 shrink-0"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default RevisionSuite;
