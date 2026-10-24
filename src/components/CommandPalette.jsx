import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, Clock, BookOpen, Rocket, Shield, 
  AlertTriangle, Moon, Sun, CheckCircle2, Flame, Sparkles, X, Plus
} from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundEngine.playPop();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('journal_open_palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'discipline_panic',
      title: 'Read When Lazy / Procrastinating',
      subtitle: 'Emergency reality check & cold 30-second focus reset',
      icon: AlertTriangle,
      color: 'text-rose-400',
      action: () => {
        navigate('/discipline');
        onClose();
      }
    },
    {
      id: 'quick_fajr',
      title: 'Mark Fajr Prayer Done',
      subtitle: 'Complete 5:00 AM Fajr on schedule',
      icon: Clock,
      color: 'text-emerald-400',
      action: () => {
        journalStorage.togglePrayer(getTodayKey(), 'fajr');
        soundEngine.playBell(587);
        onClose();
      }
    },
    {
      id: 'quick_study',
      title: 'Log 1h Actual Deep Study',
      subtitle: 'Track 60 minutes conceptual study (excl. homework)',
      icon: BookOpen,
      color: 'text-sky-400',
      action: () => {
        journalStorage.addStudySession({
          type: 'Actual Study',
          subject: 'Mathematics',
          topic: 'Deep Study Block',
          durationMins: 60
        });
        journalStorage.toggleDisciplineCheck(getTodayKey(), 'dc_study');
        soundEngine.playBell(587);
        onClose();
      }
    },
    {
      id: 'quick_jee',
      title: 'Log 1h JEE Problem Sets',
      subtitle: 'Foundation practice & equation drill',
      icon: Sparkles,
      color: 'text-amber-400',
      action: () => {
        journalStorage.addStudySession({
          type: 'JEE Prep',
          subject: 'Physics',
          topic: 'JEE Foundation Problems',
          durationMins: 60
        });
        journalStorage.toggleDisciplineCheck(getTodayKey(), 'dc_jee');
        soundEngine.playBell(587);
        onClose();
      }
    },
    {
      id: 'nav_today',
      title: 'Jump to Today Command Hub',
      subtitle: 'Daily routine, 3 priorities, and habit strip',
      icon: Calendar,
      color: 'text-[var(--text-primary)]',
      action: () => {
        navigate('/');
        onClose();
      }
    },
    {
      id: 'nav_discipline',
      title: 'Jump to Discipline Board',
      subtitle: '5 standards, iron rules, and 7-day contracts',
      icon: Shield,
      color: 'text-amber-400',
      action: () => {
        navigate('/discipline');
        onClose();
      }
    },
    {
      id: 'nav_academics',
      title: 'Jump to Academic & JEE Forge',
      subtitle: 'Marks targets, equation forge, and formulas',
      icon: BookOpen,
      color: 'text-sky-400',
      action: () => {
        navigate('/academics');
        onClose();
      }
    },
    {
      id: 'nav_projects',
      title: 'Jump to Projects & Builds',
      subtitle: 'Active shipping forge, idea vault, and scratchpad',
      icon: Rocket,
      color: 'text-indigo-400',
      action: () => {
        navigate('/projects');
        onClose();
      }
    },
    {
      id: 'nav_schedule',
      title: 'Jump to Schedule & Prayers',
      subtitle: 'Chennai prayer times and routine timeline',
      icon: Clock,
      color: 'text-emerald-400',
      action: () => {
        navigate('/schedule');
        onClose();
      }
    },
    {
      id: 'toggle_theme',
      title: 'Toggle Light / Dark Mode',
      subtitle: 'Switch application color theme',
      icon: Moon,
      color: 'text-[var(--text-secondary)]',
      action: () => {
        const next = journalStorage.getTheme() === 'dark' ? 'light' : 'dark';
        journalStorage.setTheme(next);
        soundEngine.playPop();
        onClose();
      }
    }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page... (ESC to close)"
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No matching actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playPop();
                    item.action();
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[var(--bg-surface-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-0 group-hover:opacity-100 pr-2 transition-opacity">
                    ↵ Run
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
          <span>Journal OS Command Palette</span>
          <span>Press ⌘K anytime</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;