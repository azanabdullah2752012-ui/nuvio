import React, { useState, useEffect } from 'react';
import { Target, Plus, Check, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const EquationForge = ({ accentColor }) => {
  const [drills, setDrills] = useState(journalStorage.getEquationDrills());
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [variables, setVariables] = useState('');
  const [condition, setCondition] = useState('');
  const [equation, setEquation] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setDrills(journalStorage.getEquationDrills());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!problem.trim() || !equation.trim()) return;

    soundEngine.playPop();
    journalStorage.addEquationDrill({
      title: title.trim() || 'Word Problem Drill',
      problem: problem.trim(),
      variables: variables.trim(),
      condition: condition.trim(),
      equation: equation.trim()
    });

    setTitle('');
    setProblem('');
    setVariables('');
    setCondition('');
    setEquation('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this equation breakdown drill?')) {
      journalStorage.deleteEquationDrill(id);
    }
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Word Problem $\rightarrow$ Equation Forge
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Break down word problems: Unknowns $\rightarrow$ Relationships $\rightarrow$ Equation
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span>{isAdding ? 'Close' : 'New Drill'}</span>
        </button>
      </div>

      {/* Add Drill Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              Problem Title / Topic
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quadratic Word Problem (Age or Speed)"
              className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              Word Problem Statement
            </label>
            <textarea
              rows={2}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Paste the word problem text here..."
              className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-emerald-400 block mb-1">
                Step 1: Unknowns & Variables (x, y)
              </label>
              <input
                type="text"
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder="Let son's age = x. Father's age = 3x."
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-amber-400 block mb-1">
                Step 2: Relationship / Condition
              </label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="In 5 years, father = 2 * son + 10"
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-sky-400 block mb-1">
              Step 3: Formulated Equation & Steps
            </label>
            <input
              type="text"
              required
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="(3x + 5) = 2(x + 5) + 10  ==>  x = 15"
              className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Save Equation Drill
            </button>
          </div>
        </form>
      )}

      {/* Drills List */}
      <div className="space-y-3">
        {drills.map((drill) => (
          <div
            key={drill.id}
            className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2.5 relative group"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {drill.title}
              </span>
              <button
                onClick={() => handleDelete(drill.id)}
                className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                title="Delete drill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
              "{drill.problem}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {drill.variables && (
                <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="font-semibold text-emerald-400 block mb-0.5">Variables:</span>
                  <span className="text-[var(--text-secondary)]">{drill.variables}</span>
                </div>
              )}
              {drill.condition && (
                <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="font-semibold text-amber-400 block mb-0.5">Condition:</span>
                  <span className="text-[var(--text-secondary)]">{drill.condition}</span>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-sky-400">
              <span className="font-semibold text-[var(--text-muted)] block mb-0.5 font-sans text-[10px] uppercase">
                Formulated Equation:
              </span>
              {drill.equation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquationForge;
