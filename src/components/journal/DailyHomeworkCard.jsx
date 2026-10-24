import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Check, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const DailyHomeworkCard = ({ accentColor }) => {
  const [homework, setHomework] = useState(journalStorage.getHomeworkList());
  const [filter, setFilter] = useState('All'); // 'All' | 'School' | 'NextTopper'
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [source, setSource] = useState('School');
  const [dueDate, setDueDate] = useState('Tomorrow');

  useEffect(() => {
    const handleUpdate = () => {
      setHomework(journalStorage.getHomeworkList());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggle = (id) => {
    soundEngine.playPop();
    journalStorage.toggleHomework(id);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    journalStorage.deleteHomework(id);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    soundEngine.playPop();
    journalStorage.addHomework({
      title: title.trim(),
      subject,
      source,
      dueDate
    });
    setTitle('');
    setShowAdd(false);
  };

  const filtered = filter === 'All' 
    ? homework 
    : homework.filter(h => h.source === filter);

  const pendingCount = homework.filter(h => !h.completed).length;

  return (
    <div className="journal-card p-6 space-y-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Homework & Due Assignments
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            School homework and NextTopper coaching tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs">
            {['All', 'School', 'NextTopper'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  soundEngine.playPop();
                  setFilter(f);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Add Homework Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                <option value="School">School</option>
                <option value="NextTopper">NextTopper Class</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">
                Due Date
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Tomorrow / Monday"
                className="w-full p-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1">
              Assignment Details
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NCERT Ex 4.2 Q1 to 8 + submit notebook"
              className="w-full p-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Save Homework
            </button>
          </div>
        </form>
      )}

      {/* Homework Items List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--text-muted)]">
            No homework items pending. You're completely caught up! 🎯
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all group ${
                item.completed
                  ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-70'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    item.completed ? 'border-transparent text-white' : 'border-[var(--border-medium)]'
                  }`}
                  style={item.completed ? { backgroundColor: accentColor } : {}}
                >
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                      {item.subject}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      • Due {item.dueDate}
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-semibold mt-0.5 truncate ${
                    item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {item.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity shrink-0"
                title="Delete homework"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyHomeworkCard;