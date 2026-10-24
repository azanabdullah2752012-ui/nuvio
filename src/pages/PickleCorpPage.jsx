import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, CheckCircle2, RotateCcw, X, DollarSign, Award, Heart } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const PickleCorpPage = () => {
  const [favors, setFavors] = useState(journalStorage.getFavors());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [favorBanked, setFavorBanked] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setFavors(journalStorage.getFavors());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggleStatus = (id) => {
    soundEngine.playPop();
    journalStorage.toggleFavorStatus(id);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this ledger record?')) {
      journalStorage.deleteFavor(id);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!client.trim() || !project.trim()) return;
    soundEngine.playPop();
    journalStorage.addFavor({
      client: client.trim(),
      project: project.trim(),
      favorBanked: favorBanked.trim() || 'A favor banked for later when in a pickle'
    });
    setClient('');
    setProject('');
    setFavorBanked('');
    setShowModal(false);
  };

  const bankedCount = favors.filter(f => f.status === 'Banked').length;
  const redeemedCount = favors.filter(f => f.status === 'Redeemed').length;

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-16">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-semibold text-[var(--text-muted)] tracking-wider">
              Pickle Corp™ Studio
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-xs text-emerald-400 font-mono">
              Invoices: $0.00
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Favor Bank & Studio Ledger
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 italic">
            "Independent Freelance Studio. Paid Strictly in Favors."
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm self-start sm:self-auto transition-opacity"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Delivery</span>
        </button>
      </div>

      {/* Studio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="journal-card p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Total Invoices Sent
          </span>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            $0.00
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Cash is useless in a real pickle. Favors are currency.
          </p>
        </div>

        <div className="journal-card p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Banked Favors (Active)
          </span>
          <div className="text-2xl font-bold text-amber-400">
            {bankedCount}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Ready to be called in when needed
          </p>
        </div>

        <div className="journal-card p-5 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Redeemed Favors
          </span>
          <div className="text-2xl font-bold text-emerald-400">
            {redeemedCount}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Successfully exchanged for real-world support
          </p>
        </div>
      </div>

      {/* Favor Ledger Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Deliverables & Favor Entries ({favors.length})
        </h2>

        {favors.length === 0 ? (
          <div className="journal-card p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
            <div>No favors logged in the studio ledger yet.</div>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold text-emerald-400 underline"
            >
              Log your first deliverable
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favors.map((item) => {
              const isBanked = item.status === 'Banked';

              return (
                <div
                  key={item.id}
                  className="journal-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[var(--border-medium)] transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                        {item.client}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        isBanked
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {item.date}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">Delivered:</span> {item.project}
                    </div>

                    <div className="text-xs" style={{ color: accentColor }}>
                      <span className="font-semibold">Favor Banked:</span> {item.favorBanked}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        isBanked
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {isBanked ? 'Mark Redeemed' : 'Mark Banked'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Favor Modal */}
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
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Log Studio Deliverable</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Client / Collaborator
                </label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Thanvi, Greenfield classmate, friend"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Deliverable / Work Done ($0.00 Invoice)
                </label>
                <input
                  type="text"
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Built portfolio website / coded automated bot"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Favor Banked in Exchange
                </label>
                <input
                  type="text"
                  value={favorBanked}
                  onChange={(e) => setFavorBanked(e.target.value)}
                  placeholder="e.g. Notes on French chapter / product review"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  Bank Favor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PickleCorpPage;
