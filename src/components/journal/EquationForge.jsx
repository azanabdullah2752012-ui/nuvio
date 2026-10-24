import React, { useState, useEffect } from 'react';
import { Target, Plus, Check, Trash2, ChevronDown, ChevronUp, BookOpen, Eye, EyeOff, Sparkles } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const PRACTICE_BANK = [
  {
    id: 'pb_linear_1',
    category: 'Linear Equations',
    title: 'Perimeter of Rectangular Pool',
    problem: 'The perimeter of a rectangular swimming pool is 154 m. Its length is 2 m more than twice its breadth. What are the length and breadth?',
    variables: 'Let breadth = x meters. Length = (2x + 2) meters.',
    condition: 'Perimeter = 2 * (Length + Breadth) = 154',
    equation: '2 * ((2x + 2) + x) = 154  ==>  6x + 4 = 154  ==>  x = 25m, Length = 52m'
  },
  {
    id: 'pb_speed_2',
    category: 'Speed & Time',
    title: 'Train Speed Reduction & Delay',
    problem: 'A train travels a distance of 480 km at a uniform speed. If the speed had been 8 km/h less, it would have taken 3 hours more to cover the same distance.',
    variables: 'Let speed = x km/h. Reduced speed = (x - 8) km/h. Distance = 480 km.',
    condition: 'Time = Distance / Speed. New Time - Old Time = 3 hrs.',
    equation: '480 / (x - 8) - 480 / x = 3  ==>  x² - 8x - 1280 = 0  ==>  (x - 40)(x + 32) = 0  ==>  x = 40 km/h'
  },
  {
    id: 'pb_work_3',
    category: 'Work & Rates',
    title: 'Two Water Taps Filling a Tank',
    problem: 'Two water taps together can fill a tank in 9 3/8 hours (75/8 hrs). The tap of larger diameter takes 10 hours less than the smaller one to fill the tank separately.',
    variables: 'Let smaller tap = x hours. Larger tap = (x - 10) hours.',
    condition: 'Combined 1-hour rate: 1/x + 1/(x - 10) = 8/75',
    equation: '(2x - 10) / (x² - 10x) = 8/75  ==>  8x² - 230x + 750 = 0  ==>  x = 25 hrs, larger = 15 hrs'
  },
  {
    id: 'pb_phys_4',
    category: 'Physics: Motion',
    title: 'Uniform Acceleration Distance',
    problem: 'A racing car has a uniform acceleration of 4 m/s². What distance will it cover in 10 s after start from rest?',
    variables: 'Initial u = 0 m/s, Acceleration a = 4 m/s², Time t = 10 s. Unknown: Distance s.',
    condition: 'Second equation of motion: s = ut + 0.5 * a * t²',
    equation: 's = (0)(10) + 0.5 * (4) * (10)²  ==>  s = 2 * 100 = 200 meters'
  },
  {
    id: 'pb_phys_5',
    category: 'Physics: Forces',
    title: 'Retarding Force Stopping Time',
    problem: 'A constant retarding force of 50 N is applied to a body of mass 20 kg moving initially with a speed of 15 m/s. How long does the body take to stop?',
    variables: 'Mass m = 20 kg, Force F = -50 N, Initial u = 15 m/s, Final v = 0 m/s. Unknown: time t.',
    condition: 'F = ma  ==>  a = -50 / 20 = -2.5 m/s². Then v = u + at.',
    equation: '0 = 15 + (-2.5) * t  ==>  2.5t = 15  ==>  t = 6 seconds'
  }
];

const EquationForge = ({ accentColor }) => {
  const [tab, setTab] = useState('bank'); // 'bank' | 'custom'
  const [drills, setDrills] = useState(journalStorage.getEquationDrills());
  const [revealed, setRevealed] = useState({});
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

  const toggleReveal = (id) => {
    soundEngine.playPop();
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="journal-card p-5 sm:p-6 space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
              Word Problem → Equation Forge
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Master the 3-step algebra distillation: Unknowns (x, y) → Relations → Equation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => {
                soundEngine.playPop();
                setTab('bank');
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                tab === 'bank' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Class 9 Practice Bank
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setTab('custom');
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                tab === 'custom' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              My Drills ({drills.length})
            </button>
          </div>

          {tab === 'custom' && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>{isAdding ? 'Close' : 'New'}</span>
            </button>
          )}
        </div>
      </div>

      {/* PRACTICE BANK VIEW */}
      {tab === 'bank' && (
        <div className="space-y-4">
          <div className="text-xs text-[var(--text-muted)]">
            Read the problem statement. Try formulating the variables and equation in your head or scratchpad, then click <span className="font-semibold text-sky-400">Reveal Breakdown</span> to verify.
          </div>

          <div className="space-y-3.5">
            {PRACTICE_BANK.map((item) => {
              const isShown = !!revealed[item.id];

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        {item.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 py-1 px-2.5 rounded-lg border border-sky-500/30 bg-sky-500/10 transition-colors"
                    >
                      {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isShown ? 'Hide' : 'Reveal Breakdown'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                    "{item.problem}"
                  </p>

                  {/* Revealed Distillation Steps */}
                  {isShown && (
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                          <span className="font-semibold text-emerald-400 text-[11px] block mb-1">
                            Step 1: Unknowns & Variables
                          </span>
                          <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                            {item.variables}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                          <span className="font-semibold text-amber-400 text-[11px] block mb-1">
                            Step 2: Physical / Math Condition
                          </span>
                          <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                            {item.condition}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-sky-500/30 font-mono text-xs text-sky-400">
                        <span className="font-semibold text-[var(--text-muted)] block mb-1 font-sans text-[10px] uppercase">
                          Step 3: Equation Formulation & Solution
                        </span>
                        {item.equation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CUSTOM DRILLS VIEW */}
      {tab === 'custom' && (
        <div className="space-y-4">
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
            {drills.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                No custom drills saved yet. Click "New" to break down your first problem!
              </div>
            ) : (
              drills.map((drill) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquationForge;