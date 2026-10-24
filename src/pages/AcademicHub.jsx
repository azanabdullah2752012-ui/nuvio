import React, { useState, useEffect } from 'react';
import { 
  Target, Award, BookOpen, Type, Plus, CheckCircle2, 
  Trash2, X, AlertTriangle, Sparkles, Check, ChevronRight, Bookmark
} from 'lucide-react';
import { journalStorage } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import GoalsPage from './GoalsPage';
import MistakesPage from './MistakesPage';
import FormulasPage from './FormulasPage';
import SpellingPage from './SpellingPage';
import EquationForge from '../components/journal/EquationForge';

const TABS = [
  { id: 'marks', label: 'Marks & Targets', icon: Target },
  { id: 'equations', label: 'Equation Forge', icon: Sparkles },
  { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle },
  { id: 'formulas', label: 'JEE Formulas', icon: BookOpen },
  { id: 'spelling', label: 'Spelling Precision', icon: Type },
  { id: 'syllabus', label: 'Class 9 Syllabus', icon: Bookmark }
];

const AcademicHub = () => {
  const [activeTab, setActiveTab] = useState('marks');
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [syllabus, setSyllabus] = useState(journalStorage.getSyllabus());
  const [subjectFilter, setSubjectFilter] = useState('All');

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
      setSyllabus(journalStorage.getSyllabus());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggleSyllabus = (id) => {
    soundEngine.playPop();
    journalStorage.toggleSyllabusStatus(id);
  };

  const filteredSyllabus = subjectFilter === 'All'
    ? syllabus
    : syllabus.filter(s => s.subject === subjectFilter);

  const masteredSyllabusCount = syllabus.filter(s => s.status === 'Mastered').length;
  const syllabusPercent = Math.round((masteredSyllabusCount / syllabus.length) * 100);

  return (
    <div className="space-y-7 text-left max-w-6xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
            Class IX-C GCIS & JEE Foundation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Academic & JEE Mastery Forge
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Unified academic cockpit: track exam marks, master equation conversion, eliminate careless errors, and memorize key formulas.
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
        {activeTab === 'marks' && <GoalsPage />}

        {activeTab === 'equations' && (
          <div className="space-y-6">
            <EquationForge accentColor={accentColor} />
          </div>
        )}

        {activeTab === 'mistakes' && <MistakesPage />}

        {activeTab === 'formulas' && <FormulasPage />}

        {activeTab === 'spelling' && <SpellingPage />}

        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            {/* Syllabus Overview Card */}
            <div className="journal-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Class 9 Board & Foundation Syllabus
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Click any chapter to cycle status: Mastered $\rightarrow$ Needs Practice $\rightarrow$ In Progress
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
      </div>

    </div>
  );
};

export default AcademicHub;
