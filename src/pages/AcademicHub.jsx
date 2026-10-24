import React, { useState, useEffect } from 'react';
import { 
  Target, Award, BookOpen, Type, Plus, CheckCircle2, 
  Trash2, X, Sparkles, Check, ChevronRight, Bookmark, Clock, Flame
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import GoalsPage from './GoalsPage';
import FormulasPage from './FormulasPage';
import SpellingPage from './SpellingPage';
import EquationForge from '../components/journal/EquationForge';

const TABS = [
  { id: 'marks', label: 'Marks & Targets', icon: Target },
  { id: 'study_log', label: 'Study Hours Log', icon: Clock },
  { id: 'equations', label: 'Equation Forge', icon: Sparkles },
  { id: 'formulas', label: 'JEE Formulas', icon: BookOpen },
  { id: 'syllabus', label: 'Class 9 Syllabus', icon: Bookmark },
  { id: 'spelling', label: 'Spelling Precision', icon: Type }
];

const AcademicHub = () => {
  const [activeTab, setActiveTab] = useState('marks');
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [syllabus, setSyllabus] = useState(journalStorage.getSyllabus());
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [studySessions, setStudySessions] = useState(journalStorage.getStudySessions());

  // New Study Session Form State
  const [showLogModal, setShowLogModal] = useState(false);
  const [sessionType, setSessionType] = useState('Actual Study');
  const [sessionSubject, setSessionSubject] = useState('Mathematics');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
      setSyllabus(journalStorage.getSyllabus());
      setStudySessions(journalStorage.getStudySessions());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggleSyllabus = (id) => {
    soundEngine.playPop();
    journalStorage.toggleSyllabusStatus(id);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;
    soundEngine.playPop();
    journalStorage.addStudySession({
      type: sessionType,
      subject: sessionSubject,
      topic: sessionTopic.trim(),
      durationMins: Number(sessionDuration) || 60
    });
    setSessionTopic('');
    setShowLogModal(false);
  };

  const handleDeleteSession = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this study log entry?')) {
      journalStorage.deleteStudySession(id);
    }
  };

  const filteredSyllabus = subjectFilter === 'All'
    ? syllabus
    : syllabus.filter(s => s.subject === subjectFilter);

  const masteredSyllabusCount = syllabus.filter(s => s.status === 'Mastered').length;
  const syllabusPercent = Math.round((masteredSyllabusCount / syllabus.length) * 100);

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (s.durationMins || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-7 text-left max-w-6xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
            Class 9 & JEE Foundation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Academic & JEE Forge
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Target tracking, deep study hour logging, equation distillation, and JEE formula active recall.
        </p>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playPop();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Icon 
                className="w-4 h-4 shrink-0" 
                style={isActive ? { color: accentColor } : {}}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {/* TAB 1: MARKS & TARGETS */}
        {activeTab === 'marks' && <GoalsPage />}

        {/* TAB 2: STUDY HOURS LOG */}
        {activeTab === 'study_log' && (
          <div className="space-y-6">
            {/* Summary Stat Card */}
            <div className="journal-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  Deep Study & JEE Hours Log
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Log your daily 1h Actual Study (excl. homework) and 1h JEE Problem Sets
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--text-primary)] font-mono">
                    {totalStudyHours} hrs
                  </div>
                  <span className="text-xs text-sky-400 font-semibold">{studySessions.length} Sessions Logged</span>
                </div>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Session</span>
                </button>
              </div>
            </div>

            {/* Sessions Grid */}
            <div className="space-y-2.5">
              {studySessions.map((s) => (
                <div 
                  key={s.id}
                  className="journal-card p-4 flex items-center justify-between gap-3 bg-[var(--bg-surface-elevated)] group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                        {s.durationMins}m
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          s.type === 'JEE Prep' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        }`}>
                          {s.type}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-muted)]">
                          {s.subject}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          • {s.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] mt-1">
                        {s.topic}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSession(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1.5 rounded transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EQUATION FORGE */}
        {activeTab === 'equations' && (
          <div className="space-y-6">
            <EquationForge accentColor={accentColor} />
          </div>
        )}

        {/* TAB 4: JEE FORMULAS */}
        {activeTab === 'formulas' && <FormulasPage />}

        {/* TAB 5: SYLLABUS */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="journal-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Class 9 Board & Foundation Syllabus
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Click any chapter to cycle status: Mastered → Needs Practice → In Progress
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--text-primary)]">
                    {masteredSyllabusCount} / {syllabus.length}
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">{syllabusPercent}% Mastered</span>
                </div>
                <div className="w-24 h-2.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${syllabusPercent}%`, backgroundColor: accentColor }}
                  />
                </div>
              </div>
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                    subjectFilter === sub
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Syllabus Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSyllabus.map((item) => {
                const isMastered = item.status === 'Mastered';
                const isPractice = item.status === 'Needs Practice';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSyllabus(item.id)}
                    className={`journal-card p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-all hover:border-[var(--border-medium)] ${
                      isMastered ? 'border-emerald-500/30 bg-emerald-500/5' : ''
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                        {item.subject}
                      </span>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                        {item.chapter}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                      isMastered
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isPractice
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: SPELLING PRECISION */}
        {activeTab === 'spelling' && <SpellingPage />}
      </div>

      {/* ── MODAL: LOG STUDY SESSION ───────────────────────────────── */}
      {showLogModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowLogModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Log Study Session</h3>
              <button onClick={() => setShowLogModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Session Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Actual Study', 'JEE Prep'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSessionType(type)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        sessionType === type
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)]'
                          : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Subject
                </label>
                <select
                  value={sessionSubject}
                  onChange={(e) => setSessionSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science / Coding</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Topic / Concept Studied
                </label>
                <input
                  type="text"
                  required
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  placeholder="e.g. Laws of Motion & Friction problems"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AcademicHub;