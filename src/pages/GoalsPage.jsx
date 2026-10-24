import React, { useState, useEffect } from 'react';
import { Target, Award, Plus, Trash2, X, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';
import { journalStorage } from '../services/journalStorage';

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science (Physics)',
  'Science (Chemistry)',
  'Science (Biology)',
  'AI / Computer Science',
  'Social Science',
  'English',
  'L2 Language',
  'JEE Foundation Mock'
];

const GoalsPage = () => {
  const [goals, setGoals] = useState(journalStorage.getGoals());
  const [marks, setMarks] = useState(journalStorage.getMarks());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  // Add Mark Modal
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [examName, setExamName] = useState('PA2');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('40');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [examNote, setExamNote] = useState('');

  // Add Goal Modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalTimeframe, setGoalTimeframe] = useState('');
  const [goalCategory, setGoalCategory] = useState('Academic');
  const [goalNote, setGoalNote] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setGoals(journalStorage.getGoals());
      setMarks(journalStorage.getMarks());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAddMark = (e) => {
    e.preventDefault();
    if (!marksObtained || !totalMarks) return;
    journalStorage.addMark({
      examName,
      subject,
      marksObtained: Number(marksObtained),
      totalMarks: Number(totalMarks),
      date: examDate,
      note: examNote
    });
    setMarksObtained('');
    setExamNote('');
    setShowMarkModal(false);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    journalStorage.addGoal({
      title: goalTitle.trim(),
      target: goalTarget.trim(),
      timeframe: goalTimeframe.trim(),
      category: goalCategory,
      note: goalNote.trim()
    });
    setGoalTitle('');
    setGoalTarget('');
    setGoalTimeframe('');
    setGoalNote('');
    setShowGoalModal(false);
  };

  const handleDeleteMark = (id) => {
    if (confirm('Delete this exam entry?')) {
      journalStorage.deleteMark(id);
    }
  };

  const handleDeleteGoal = (id) => {
    if (confirm('Remove this goal?')) {
      journalStorage.deleteGoal(id);
    }
  };

  // Group marks by subject for clean average / latest view
  const subjectSummaries = SUBJECT_OPTIONS.map(sub => {
    const subMarks = marks.filter(m => m.subject === sub);
    if (subMarks.length === 0) return null;
    const latest = subMarks[0];
    const avg = Math.round(subMarks.reduce((acc, m) => acc + m.percentage, 0) / subMarks.length);
    return { subject: sub, latest, count: subMarks.length, avg };
  }).filter(Boolean);

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Goals & Marks Tracker
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track exam scores, milestones, and JEE targets. Explicitly labeled as goals, not forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
          >
            <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Add Goal</span>
          </button>

          <button
            onClick={() => setShowMarkModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Log Exam Mark</span>
          </button>
        </div>
      </div>

      {/* ── GOALS CARDS ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Academic & Long-Term Targets
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] italic">
            Goals, not predictions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <div 
              key={g.id}
              className="journal-card p-5 flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {g.category}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {g.timeframe}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                  {g.title}
                </h3>
                <div className="mt-2 text-xs font-medium" style={{ color: accentColor }}>
                  Target: {g.target}
                </div>
                {g.note && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {g.note}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>{g.status}</span>
                <button
                  onClick={() => handleDeleteGoal(g.id)}
                  className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-1 rounded transition-opacity"
                  title="Remove goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARKS & PERFORMANCE LOG ─────────────────────────────────── */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Exam Scores & Subject Performance
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {marks.length} recorded evaluations
          </span>
        </div>

        {/* Subject Summaries Row */}
        {subjectSummaries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {subjectSummaries.map((sub) => (
              <div 
                key={sub.subject}
                className="journal-card p-4 space-y-1 bg-[var(--bg-surface-elevated)]"
              >
                <span className="text-xs text-[var(--text-muted)] truncate block">
                  {sub.subject}
                </span>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {sub.latest.percentage}%
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  Latest: {sub.latest.marksObtained}/{sub.latest.totalMarks} ({sub.latest.examName})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exam Records Table */}
        {marks.length === 0 ? (
          <div className="journal-card p-8 text-center space-y-3">
            <Award className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              No exam marks logged yet
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Log your PA1, PA2, or test scores to keep track of your trajectory toward 90%+ in Class 9.
            </p>
            <button
              onClick={() => setShowMarkModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm inline-block"
              style={{ backgroundColor: accentColor }}
            >
              Log First Exam
            </button>
          </div>
        ) : (
          <div className="journal-card overflow-hidden">
            <div className="divide-y divide-[var(--border-subtle)]">
              {marks.map((m) => (
                <div 
                  key={m.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-surface-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: `${accentColor}26`, color: accentColor }}
                    >
                      {m.percentage}%
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {m.subject}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                          {m.examName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                        <span>Score: {m.marksObtained} / {m.totalMarks}</span>
                        <span>•</span>
                        <span>{m.date}</span>
                        {m.note && <span>• {m.note}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMark(m.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1.5 rounded transition-opacity"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Log Exam Mark */}
      {showMarkModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowMarkModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Log Exam Score</h3>
              <button onClick={() => setShowMarkModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMark} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Exam / Test Name
                </label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. PA1, PA2, NextTopper Mock"
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                >
                  {SUBJECT_OPTIONS.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(e.target.value)}
                    placeholder="35"
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    placeholder="40"
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={examNote}
                  onChange={(e) => setExamNote(e.target.value)}
                  placeholder="e.g. Lost marks to equation conversion or spelling"
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Goal */}
      {showGoalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowGoalModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add Academic Target</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Class 10 School Topper"
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Target Metric
                </label>
                <input
                  type="text"
                  required
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="e.g. 95%+ or School Topper"
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={goalTimeframe}
                    onChange={(e) => setGoalTimeframe(e.target.value)}
                    placeholder="e.g. Class 10 Board"
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Maths / JEE">Maths / JEE</option>
                    <option value="Building">Building</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Note
                </label>
                <input
                  type="text"
                  value={goalNote}
                  onChange={(e) => setGoalNote(e.target.value)}
                  placeholder="e.g. Build foundation now"
                  className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GoalsPage;
