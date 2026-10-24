import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, X, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';

const ERROR_TYPES = [
  { id: 'careless', label: 'Careless Calculation', color: '#f59e0b' },
  { id: 'equation', label: 'Word Problem to Equation Gap', color: '#3b82f6' },
  { id: 'concept', label: 'Concept Gap', color: '#ef4444' },
  { id: 'misread', label: 'Misread Question', color: '#8b5cf6' },
  { id: 'spelling', label: 'Spelling / Formatting', color: '#10b981' },
  { id: 'time', label: 'Time Management', color: '#ec4899' }
];

const MistakesPage = () => {
  const [mistakes, setMistakes] = useState(journalStorage.getMistakes());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [problemDescription, setProblemDescription] = useState('');
  const [errorType, setErrorType] = useState(ERROR_TYPES[0].label);
  const [correctMethod, setCorrectMethod] = useState('');
  const [revisitDate, setRevisitDate] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setMistakes(journalStorage.getMistakes());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAddMistake = (e) => {
    e.preventDefault();
    if (!problemDescription.trim() || !correctMethod.trim()) return;

    journalStorage.addMistake({
      subject,
      problemDescription: problemDescription.trim(),
      errorType,
      correctMethod: correctMethod.trim(),
      revisitDate: revisitDate || getTodayKey()
    });

    setProblemDescription('');
    setCorrectMethod('');
    setRevisitDate('');
    setShowModal(false);
  };

  const handleToggleReviewed = (id) => {
    journalStorage.toggleMistakeReviewed(id);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this mistake note?')) {
      journalStorage.deleteMistake(id);
    }
  };

  const filteredMistakes = activeFilter === 'All' 
    ? mistakes 
    : activeFilter === 'Pending' 
      ? mistakes.filter(m => !m.reviewed)
      : mistakes.filter(m => m.errorType === activeFilter);

  // Calculate mistake type breakdown
  const typeCounts = ERROR_TYPES.map(type => ({
    ...type,
    count: mistakes.filter(m => m.errorType === type.label).length
  }));

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Mistake Notebook
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Analyze errors by type (equation bottlenecks, careless steps, spelling) so you never repeat them.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Log Mistake</span>
        </button>
      </div>

      {/* Error Breakdown Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {typeCounts.map((type) => (
          <div 
            key={type.id}
            onClick={() => setActiveFilter(type.label)}
            className={`journal-card p-3.5 space-y-1 cursor-pointer transition-all ${
              activeFilter === type.label ? 'border-[var(--border-focus)] bg-[var(--bg-surface-elevated)]' : ''
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: type.color }} />
              <span className="text-[11px] font-medium text-[var(--text-muted)] truncate">
                {type.label}
              </span>
            </div>
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {type.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeFilter === 'All'
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          All ({mistakes.length})
        </button>
        <button
          onClick={() => setActiveFilter('Pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeFilter === 'Pending'
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Pending Review ({mistakes.filter(m => !m.reviewed).length})
        </button>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="journal-card p-10 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            No mistakes recorded under {activeFilter}
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Log tricky math problems, equation formulation bugs, or careless exam mistakes to build your review notebook.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm inline-block"
            style={{ backgroundColor: accentColor }}
          >
            Log First Mistake
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map((m) => (
            <div
              key={m.id}
              className={`journal-card p-5 space-y-3 transition-all group ${
                m.reviewed ? 'opacity-60 bg-[var(--bg-surface-elevated)]/40' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--text-primary)] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    {m.subject}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    {m.errorType}
                  </span>
                  {m.revisitDate && (
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Revisit: {m.revisitDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReviewed(m.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      m.reviewed 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.reviewed ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-rose-400 block mb-0.5">
                    ❌ Problem / What Went Wrong:
                  </span>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {m.problemDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="font-semibold text-emerald-400 block mb-0.5">
                    ✅ Correct Method & Algebraic Formulation:
                  </span>
                  <p className="font-mono text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
                    {m.correctMethod}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Mistake Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Log Mistake & Analysis</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMistake} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science (Physics)">Science (Physics)</option>
                    <option value="Science (Chemistry)">Science (Chemistry)</option>
                    <option value="Science (Biology)">Science (Biology)</option>
                    <option value="English">English</option>
                    <option value="Social Science">Social Science</option>
                    <option value="AI / CS">AI / CS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Error Category
                  </label>
                  <select
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  >
                    {ERROR_TYPES.map(t => (
                      <option key={t.id} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Problem & What Went Wrong
                </label>
                <textarea
                  rows={2}
                  required
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. Word problem on two trains traveling in opposite directions. Confused relative speed formula."
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Correct Method / Equations
                </label>
                <textarea
                  rows={3}
                  required
                  value={correctMethod}
                  onChange={(e) => setCorrectMethod(e.target.value)}
                  placeholder="e.g. Let speed of Train A = x, Train B = y. When opposite directions, relative speed = x + y. Distance = (x + y) * time."
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Revisit Date (Optional)
                </label>
                <input
                  type="date"
                  value={revisitDate}
                  onChange={(e) => setRevisitDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
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
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MistakesPage;
