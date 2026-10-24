import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Trash2, X, Shield } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const IdeaVaultCard = ({ accentColor }) => {
  const [ideas, setIdeas] = useState(journalStorage.getIdeaVault());
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product Idea');
  const [note, setNote] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setIdeas(journalStorage.getIdeaVault());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    soundEngine.playPop();
    journalStorage.addIdea({
      title: title.trim(),
      category,
      note: note.trim()
    });
    setTitle('');
    setNote('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Remove this idea from the vault?')) {
      journalStorage.deleteIdea(id);
    }
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Idea Vault (Distraction Parking Lot)
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Park new concepts here so you stay 100% focused on your active build
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close' : 'Park Idea'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              Idea Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Space flight trajectory calculator"
              className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
              >
                <option value="Product Idea">Product Idea</option>
                <option value="Robotics / ESP32">Robotics / ESP32</option>
                <option value="Pickle Corp">Pickle Corp</option>
                <option value="Math / Algorithms">Math / Algorithms</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                Short Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Key mechanic or hook..."
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
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
              Park in Vault
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start justify-between gap-3 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {idea.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {idea.category}
                </span>
              </div>
              {idea.note && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {idea.note}
                </p>
              )}
            </div>

            <button
              onClick={() => handleDelete(idea.id)}
              className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
              title="Delete idea"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaVaultCard;
