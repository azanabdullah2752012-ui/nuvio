import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Star, Zap, Clock, BookOpen, Brain, Sparkles, Check } from 'lucide-react';
import './styles.css';

const RevisionSuite = ({ chapter, subject }) => {
  const [subTab, setSubTab] = useState('notes'); // 'notes' | 'flashcards' | 'formulas' | 'bookmarks'
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
      updated[key] = { text, type, chapter: chapter.title, subject };
    }
    setBookmarks(updated);
    localStorage.setItem('acadevance_revision_bookmarks', JSON.stringify(updated));
  };

  const getBookmarkKey = (type, index) => {
    return `${subject}_${chapter.title}_${type}_${index}`;
  };

  const setCardLeitnerState = (cardIndex, state) => {
    const key = `${subject}_${chapter.title}_card_${cardIndex}`;
    const updated = { ...leitnerStates, [key]: state };
    setLeitnerStates(updated);
    localStorage.setItem('acadevance_leitner_states', JSON.stringify(updated));
  };

  const activeBookmarks = Object.entries(bookmarks).filter(([_, item]) => 
    item.subject === subject && item.chapter === chapter.title
  );

  const cards = chapter.flashcards || [];
  const currentCardKey = `${subject}_${chapter.title}_card_${cardIdx}`;
  const currentLeitnerState = leitnerStates[currentCardKey] || null;

  // Calculate memory recall retention score (0-100%)
  const activeMasteryScore = (() => {
    if (cards.length === 0) return 0;
    let totalScore = 0;
    cards.forEach((_, idx) => {
      const key = `${subject}_${chapter.title}_card_${idx}`;
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
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center space-y-1 mb-8">
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase">
          Step 6: Recall suite
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-2">
          Revision Suite
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Access NCERT summaries, formulas, and flashcard cards. Bookmark items for fast lookups.
        </p>
      </div>

      {/* Revision Sub-Tabs */}
      <div className="flex bg-slate-900 p-1.5 border border-white/10 rounded-lg shadow max-w-md mx-auto justify-between overflow-x-auto no-scrollbar">
        {[
          { id: 'notes', label: 'Summary', icon: BookOpen },
          { id: 'flashcards', label: 'Flashcards', icon: Zap },
          { id: 'formulas', label: 'Formulas', icon: Clock },
          { id: 'bookmarks', label: `Saved (${activeBookmarks.length})`, icon: Bookmark }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
              subTab === tab.id 
                ? 'bg-purple-500 text-black shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content panel based on sub-tab */}
      <div className="pt-4 text-left">
        <AnimatePresence mode="wait">
          
          {/* Summary notes sub-tab */}
          {subTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {chapter.keyIdeas?.map((idea, idx) => {
                const key = getBookmarkKey('note', idx);
                const isBookmarked = !!bookmarks[key];
                return (
                  <div key={idx} className="glass-panel p-5 border border-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors shadow-sm">
                    <div className="space-y-1">
                      <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                        Concept Summary
                      </span>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                        {idea}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(key, idea, 'Note')}
                      className="text-slate-500 hover:text-yellow-400 p-1.5 shrink-0"
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-yellow-400" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                );
              }) || (
                <div className="text-slate-400 text-xs italic text-center">No summaries found.</div>
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
                <div className="text-center p-8 text-slate-500 text-xs">No cards.</div>
              ) : (
                <>
                  {/* Memory Recall HUD and Statistics */}
                  <div className="flex items-center justify-between bg-slate-900 border border-white/10 p-4 rounded-xl shadow-md">
                    <div className="text-left space-y-0.5">
                      <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Card Progress</span>
                      <strong className="block text-xs font-black text-white font-mono mt-1">Card {cardIdx + 1} of {cards.length}</strong>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 rounded-lg">
                      <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                      <div className="text-[9px] text-left">
                        <span className="block font-black text-purple-400 uppercase tracking-wider leading-none">Memory Recall</span>
                        <strong className="block font-mono text-white text-[11px] mt-0.5">{activeMasteryScore}% Retention</strong>
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
                        className="absolute inset-0 backface-hidden glass-panel p-6 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Question</span>
                          {currentLeitnerState && (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              currentLeitnerState === 'mastered' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                              currentLeitnerState === 'partial' ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' :
                              'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                            }`}>
                              {currentLeitnerState}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm md:text-base font-black text-white text-center leading-snug px-4">
                          {cards[cardIdx].front}
                        </h4>
                        <span className="text-[7px] text-slate-500 text-center font-bold uppercase tracking-wider">
                          Click card to flip
                        </span>
                      </div>

                      {/* Back Card */}
                      <div
                        className="absolute inset-0 backface-hidden glass-panel bg-slate-900 border-purple-500/20 p-6 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <span className="text-[8px] font-black text-green-400 uppercase tracking-widest font-mono">Answer</span>
                        <p className="text-xs md:text-sm font-semibold text-slate-200 text-center leading-relaxed px-4">
                          {cards[cardIdx].back}
                        </p>
                        <span className="text-[7px] text-slate-500 text-center font-bold uppercase tracking-wider">
                          Click to view question
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Leitner Spaced-Repetition Feedback Buttons (only clickable when card is revealed / flipped) */}
                  <div className="p-4 bg-slate-900/80 border border-white/5 rounded-xl space-y-3">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">
                      Evaluate active recall to progress Spacing boxes
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'unsure', label: '🔴 Unsure', style: 'hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400 border-rose-500/20 bg-rose-500/5' },
                        { id: 'partial', label: '🟡 Guessing', style: 'hover:bg-yellow-500/10 hover:border-yellow-500/30 text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
                        { id: 'mastered', label: '🟢 Mastered', style: 'hover:bg-green-500/10 hover:border-green-500/30 text-green-400 border-green-500/20 bg-green-500/5' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardLeitnerState(cardIdx, item.id);
                          }}
                          className={`py-2 text-[9px] font-black uppercase border rounded transition-all flex items-center justify-center gap-1 ${
                            currentLeitnerState === item.id 
                              ? 'bg-purple-500 text-black border-transparent shadow font-black scale-[1.03]'
                              : `bg-slate-950 border-white/5 text-slate-400 ${item.style}`
                          }`}
                        >
                          {currentLeitnerState === item.id && <Check className="w-3.5 h-3.5" />}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      disabled={cardIdx === 0}
                      onClick={() => {
                        setCardIdx(prev => prev - 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 border border-white/10 bg-slate-900 disabled:opacity-30 rounded text-[9px] font-black uppercase text-slate-400 hover:text-white"
                    >
                      ◀ Back
                    </button>

                    <button
                      onClick={() => {
                        const key = getBookmarkKey('flashcard', cardIdx);
                        const cardText = `${cards[cardIdx].front} -> ${cards[cardIdx].back}`;
                        toggleBookmark(key, cardText, 'Card');
                      }}
                      className="flex items-center gap-1 px-4 py-2 border border-white/10 bg-slate-900 rounded text-[9px] font-black uppercase text-yellow-400"
                    >
                      <Star className="w-3.5 h-3.5" /> Bookmark Card
                    </button>

                    <button
                      disabled={cardIdx + 1 === cards.length}
                      onClick={() => {
                        setCardIdx(prev => prev + 1);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2 border border-white/10 bg-slate-900 disabled:opacity-30 rounded text-[9px] font-black uppercase text-slate-400 hover:text-white"
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
              className="space-y-4"
            >
              {chapter.formulas?.map((formula, idx) => {
                const key = getBookmarkKey('formula', idx);
                const isBookmarked = !!bookmarks[key];
                return (
                  <div key={idx} className="glass-panel p-5 border border-white/5 flex items-center justify-between gap-4 shadow-sm hover:border-white/10 transition-colors">
                    <div className="space-y-2">
                      <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest font-mono">
                        Formula Card
                      </span>
                      <div className="bg-slate-950 px-4 py-3 border border-white/5 rounded text-xs font-mono text-green-400 select-all shadow-inner">
                        {formula}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(key, formula, 'Formula')}
                      className="text-slate-500 hover:text-yellow-400 p-1.5 shrink-0"
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-yellow-400" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                );
              }) || (
                <div className="text-slate-500 text-xs italic text-center py-6">
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
              className="space-y-4"
            >
              {activeBookmarks.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-xl text-slate-550 text-xs font-bold font-mono uppercase">
                  No Bookmarks Saved in this Chapter.
                </div>
              ) : (
                activeBookmarks.map(([bKey, bItem]) => (
                  <div key={bKey} className="glass-panel p-5 border border-white/5 flex items-start justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/25 rounded text-[8px] font-black uppercase tracking-widest text-purple-400 font-mono">
                        Saved: {bItem.type}
                      </span>
                      <p className="text-xs font-semibold text-slate-300 leading-relaxed mt-1">
                        {bItem.text}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(bKey, bItem.text, bItem.type)}
                      className="text-yellow-400 p-1.5 shrink-0"
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
