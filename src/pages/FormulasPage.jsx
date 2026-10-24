import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle2, RotateCcw, X, Sparkles, Filter } from 'lucide-react';
import { journalStorage } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const FormulasPage = () => {
  const [formulas, setFormulas] = useState(journalStorage.getFormulas());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [activeSubject, setActiveSubject] = useState('All');
  const [revealedIds, setRevealedIds] = useState({});

  // Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [formulaText, setFormulaText] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setFormulas(journalStorage.getFormulas());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggleReveal = (id) => {
    soundEngine.playPop();
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMastery = (id) => {
    soundEngine.playPop();
    journalStorage.toggleFormulaMastery(id);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this formula card?')) {
      journalStorage.deleteFormula(id);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !formulaText.trim()) return;
    soundEngine.playPop();
    journalStorage.addFormula({
      subject,
      topic: topic.trim() || 'General',
      name: name.trim(),
      formula: formulaText.trim()
    });
    setName('');
    setTopic('');
    setFormulaText('');
    setShowModal(false);
  };

  const filteredFormulas = activeSubject === 'All'
    ? formulas
    : formulas.filter(f => f.subject === activeSubject);

  const masteredCount = formulas.filter(f => f.mastery === 'Mastered').length;

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            JEE Formula & Theorem Vault
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Core mathematical identities, kinematics equations, and chemical laws for Class 9 & JEE Foundation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm self-start sm:self-auto transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Formula</span>
        </button>
      </div>

      {/* Subject Filter Tabs & Mastery Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Mathematics', 'Physics', 'Chemistry'].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                activeSubject === sub
                  ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {sub} {sub === 'All' ? `(${formulas.length})` : `(${formulas.filter(f => f.subject === sub).length})`}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-2">
          <span>Mastery:</span>
          <span className="font-bold text-emerald-400">{masteredCount} / {formulas.length}</span>
          <span className="text-[var(--text-muted)]">({Math.round((masteredCount / formulas.length) * 100 || 0)}%)</span>
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item) => {
          const isRevealed = !!revealedIds[item.id];
          const isMastered = item.mastery === 'Mastered';

          return (
            <div
              key={item.id}
              className="journal-card p-5 space-y-3 flex flex-col justify-between group hover:border-[var(--border-medium)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {item.subject}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.topic}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleMastery(item.id)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                      isMastered
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isMastered ? 'Mastered' : 'Learning'}</span>
                  </button>
                </div>

                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.name}
                </h3>
              </div>

              {/* Formula Display Area */}
              <div className="pt-2">
                {isRevealed ? (
                  <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm text-sky-400 whitespace-pre-line leading-relaxed">
                    {item.formula}
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleReveal(item.id)}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-[var(--border-medium)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-center"
                  >
                    Click to Reveal Formula / Equation
                  </button>
                )}
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                <button
                  onClick={() => handleToggleReveal(item.id)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
                >
                  {isRevealed ? 'Hide Formula' : 'Show Formula'}
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
          );
        })}
      </div>

      {/* Add Formula Modal */}
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
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add Formula to Vault</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Topic / Chapter
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Kinematics or Circles"
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Formula / Theorem Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Newton's Second Law"
                  className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Formula Equation (Mathematical Expression)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formulaText}
                  onChange={(e) => setFormulaText(e.target.value)}
                  placeholder="e.g. F = m * a &#10;p = m * v"
                  className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs text-[var(--text-primary)] focus:outline-none"
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
                  Save Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FormulasPage;
