import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Calendar, ArrowRight, Trash2, Star, BookOpen } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';

const WeeklyReviewPage = () => {
  const [reviews, setReviews] = useState(journalStorage.getWeeklyReviews());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  // Form State
  const [wentWell, setWentWell] = useState('');
  const [bottlenecks, setBottlenecks] = useState('');
  const [oneChange, setOneChange] = useState('');
  const [rating, setRating] = useState(4);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(journalStorage.getWeeklyReviews());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wentWell.trim() && !bottlenecks.trim() && !oneChange.trim()) return;

    const today = new Date();
    const weekLabel = `Week ending ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    journalStorage.saveWeeklyReview({
      title: weekLabel,
      date: getTodayKey(),
      wentWell: wentWell.trim(),
      bottlenecks: bottlenecks.trim(),
      oneChange: oneChange.trim(),
      rating
    });

    setWentWell('');
    setBottlenecks('');
    setOneChange('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this weekly review?')) {
      journalStorage.deleteWeeklyReview(id);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Weekly Review
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          A 5-minute reflection at the end of each week: celebrate progress, identify bottlenecks, and commit to one single adjustment.
        </p>
      </div>

      {/* 5-Minute Review Form */}
      <div className="journal-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              This Week's Reflection
            </h2>
          </div>
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Review Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--text-primary)] block">
              1. What went well this week?
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              Routines held, difficult problem sets conquered, project features shipped, or personal discipline.
            </p>
            <textarea
              rows={3}
              required
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="e.g. Woke up for Fajr every day, solved 15 quadratic word problems by isolating equations, worked out 4 times."
              className="w-full p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-all"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--text-primary)] block">
              2. What bottlenecked you or needs fixing?
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              Careless calculation mistakes, converting word problems into equations, spelling errors, or phone distractions.
            </p>
            <textarea
              rows={3}
              required
              value={bottlenecks}
              onChange={(e) => setBottlenecks(e.target.value)}
              placeholder="e.g. Lost 3 marks in math exam due to careless sign errors. Need to slow down on checking steps."
              className="w-full p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-all"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--text-primary)] block">
              3. What is ONE change you will make next week?
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              Keep it to just ONE concrete, realistic experiment.
            </p>
            <input
              type="text"
              required
              value={oneChange}
              onChange={(e) => setOneChange(e.target.value)}
              placeholder="e.g. Re-read every math word problem twice and write knowns vs unknowns before calculating."
              className="w-full p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-all"
            />
          </div>

          {/* Rating & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                Overall Week Score:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${s <= rating ? 'fill-amber-400' : 'text-[var(--border-medium)]'}`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              Save Weekly Review
            </button>
          </div>
        </form>
      </div>

      {/* Past Reviews Archive */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Past Weekly Reflections ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="journal-card p-6 text-center text-xs text-[var(--text-muted)]">
            No past reviews logged yet. Submit your first weekly review above!
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="journal-card p-5 space-y-3 relative group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {rev.title || 'Weekly Review'}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block mb-0.5">
                      ✓ What Went Well:
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {rev.wentWell}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-400 block mb-0.5">
                      ⚠ Bottlenecks to Fix:
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {rev.bottlenecks}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-[var(--text-primary)] block mb-0.5 flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: accentColor }} /> Next Week's One Change:
                    </span>
                    <p className="font-medium text-[var(--text-primary)]">
                      {rev.oneChange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default WeeklyReviewPage;
