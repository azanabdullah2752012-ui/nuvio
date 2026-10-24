import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, X, Sparkles, Filter, Rocket, BookOpen, Heart } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';

const CATEGORY_ICONS = {
  Build: Rocket,
  Academics: BookOpen,
  Faith: Sparkles,
  Personal: Heart
};

const WinsPage = () => {
  const [wins, setWins] = useState(journalStorage.getWins());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [winTitle, setWinTitle] = useState('');
  const [winCategory, setWinCategory] = useState('Build');
  const [winDetails, setWinDetails] = useState('');
  const [winDate, setWinDate] = useState(getTodayKey());

  useEffect(() => {
    const handleUpdate = () => {
      setWins(journalStorage.getWins());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAddWin = (e) => {
    e.preventDefault();
    if (!winTitle.trim()) return;
    journalStorage.addWin({
      title: winTitle.trim(),
      category: winCategory,
      details: winDetails.trim(),
      date: winDate
    });
    setWinTitle('');
    setWinDetails('');
    setShowModal(false);
  };

  const handleDeleteWin = (id) => {
    if (confirm('Delete this win?')) {
      journalStorage.deleteWin(id);
    }
  };

  const filteredWins = activeFilter === 'All' 
    ? wins 
    : wins.filter(w => w.category === activeFilter);

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Small Wins & Shipped Vault
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            A permanent record of things you shipped, concepts mastered, and personal milestones.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Log Small Win</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Build', 'Academics', 'Faith', 'Personal'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              activeFilter === cat
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cat} {cat === 'All' ? `(${wins.length})` : `(${wins.filter(w => w.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Wins Timeline List */}
      {filteredWins.length === 0 ? (
        <div className="journal-card p-10 text-center space-y-3">
          <Award className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            No milestones logged under {activeFilter} yet
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Log small steps forward: a feature shipped, 10 math word problems conquered, or a good day of prayers.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm inline-block"
            style={{ backgroundColor: accentColor }}
          >
            Log Your First Win
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWins.map((win) => {
            const IconComponent = CATEGORY_ICONS[win.category] || Award;

            return (
              <div
                key={win.id}
                className="journal-card p-5 flex items-start justify-between gap-4 group hover:border-[var(--border-medium)] transition-all"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${accentColor}1f`, color: accentColor }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                        {win.title}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                        {win.category}
                      </span>
                    </div>

                    {win.details && (
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {win.details}
                      </p>
                    )}

                    <div className="text-[11px] text-[var(--text-muted)] pt-1">
                      {win.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteWin(win.id)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1.5 rounded transition-opacity"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Win Modal */}
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
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Log a Milestone / Win</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={winTitle}
                  onChange={(e) => setWinTitle(e.target.value)}
                  placeholder="e.g. Shipped new user feature on active build"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Category
                  </label>
                  <select
                    value={winCategory}
                    onChange={(e) => setWinCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="Build">Build / Code</option>
                    <option value="Academics">Academics</option>
                    <option value="Faith">Faith</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={winDate}
                    onChange={(e) => setWinDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Details / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={winDetails}
                  onChange={(e) => setWinDetails(e.target.value)}
                  placeholder="e.g. Finished the full React router migration without breaking backward compatibility."
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
                  Save Win
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WinsPage;
