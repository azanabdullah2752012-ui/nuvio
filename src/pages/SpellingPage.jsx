import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle2, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { journalStorage } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const SpellingPage = () => {
  const [list, setList] = useState(journalStorage.getSpellingList());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  // Interactive Quiz State
  const [testWordIndex, setTestWordIndex] = useState(0);
  const [userAttempt, setUserAttempt] = useState('');
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' | 'wrong' | null

  // Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newContext, setNewContext] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setList(journalStorage.getSpellingList());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    soundEngine.playPop();
    journalStorage.addSpellingWord({
      word: newWord.trim(),
      context: newContext.trim() || 'Class 9 exam term'
    });
    setNewWord('');
    setNewContext('');
    setShowModal(false);
  };

  const handleToggleMastered = (id) => {
    soundEngine.playPop();
    journalStorage.toggleSpellingMastered(id);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this word from your spelling vault?')) {
      journalStorage.deleteSpellingWord(id);
    }
  };

  const currentQuizWord = list[testWordIndex] || null;

  const handleCheckQuiz = (e) => {
    e.preventDefault();
    if (!currentQuizWord) return;

    if (userAttempt.trim().toLowerCase() === currentQuizWord.word.toLowerCase()) {
      soundEngine.playPop();
      setQuizFeedback('correct');
      journalStorage.toggleSpellingMastered(currentQuizWord.id);
    } else {
      soundEngine.playPop();
      setQuizFeedback('wrong');
    }
  };

  const nextQuizWord = () => {
    soundEngine.playPop();
    setQuizFeedback(null);
    setUserAttempt('');
    setTestWordIndex((prev) => (prev + 1) % list.length);
  };

  const masteredCount = list.filter(w => w.mastered).length;

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Spelling & Vocab Precision Vault
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Never lose marks to careless spelling slips in English, Science, or Math terminology.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm self-start sm:self-auto transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Interactive Quick Drill Card */}
      {currentQuizWord && (
        <div className="journal-card p-6 space-y-4 bg-[var(--bg-surface-elevated)] border-[var(--accent-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Interactive Spelling Drill
              </span>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Word {testWordIndex + 1} of {list.length}
            </span>
          </div>

          <div>
            <span className="text-xs text-[var(--text-muted)] block">Context / Definition:</span>
            <p className="text-base font-semibold text-[var(--text-primary)] mt-0.5">
              "{currentQuizWord.context}"
            </p>
          </div>

          <form onSubmit={handleCheckQuiz} className="flex items-center gap-3">
            <input
              type="text"
              required
              value={userAttempt}
              onChange={(e) => setUserAttempt(e.target.value)}
              placeholder="Type the exact spelling here..."
              className="flex-1 px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              Check Spelling
            </button>
          </form>

          {/* Feedback */}
          {quizFeedback === 'correct' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> 100% Correct! "{currentQuizWord.word}"
              </span>
              <button onClick={nextQuizWord} className="underline text-emerald-300">
                Next Word →
              </button>
            </div>
          )}

          {quizFeedback === 'wrong' && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Correct spelling: "{currentQuizWord.word}"
              </span>
              <button onClick={nextQuizWord} className="underline text-rose-300">
                Try Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Vault List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Word Bank ({masteredCount} of {list.length} Mastered)
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {Math.round((masteredCount / list.length) * 100 || 0)}% accuracy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((item) => (
            <div
              key={item.id}
              className={`journal-card p-4 flex items-center justify-between gap-3 group transition-all ${
                item.mastered ? 'border-emerald-500/30 bg-emerald-500/5' : ''
              }`}
            >
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-wide">
                  {item.word}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {item.context}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleMastered(item.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.mastered 
                      ? 'bg-emerald-500 text-white border-transparent' 
                      : 'border-[var(--border-medium)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
                  }`}
                  title={item.mastered ? 'Mastered' : 'Mark Mastered'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Word Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add Word to Vault</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Word / Term (Exact Spelling)
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Simultaneous or Photosynthesis"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Context / Clue
                </label>
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="e.g. Linear equations in 2 variables"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SpellingPage;
