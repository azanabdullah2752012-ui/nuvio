import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Flame, Check, Plus, Trash2, 
  Sparkles, Zap, Target, Heart, ArrowRight, Award, Clock, Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';

const DisciplinePage = () => {
  const [dateKey, setDateKey] = useState(getTodayKey());
  const [checks, setChecks] = useState(journalStorage.getDisciplineChecks(dateKey));
  const [pledges, setPledges] = useState(journalStorage.getDisciplinePledges());
  const [ironRules, setIronRules] = useState(journalStorage.getIronRules());
  const [realityLines, setRealityLines] = useState(journalStorage.getRealityCheckLines());
  const [countdowns, setCountdowns] = useState(journalStorage.getExamCountdowns());
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  
  // Emergency Reality Mode
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [realityIndex, setRealityIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // New Rule Modal
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDetail, setRuleDetail] = useState('');

  // New Pledge Modal
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [pledgeTitle, setPledgeTitle] = useState('');
  const [pledgeReward, setPledgeReward] = useState('');

  // Add Truth Modal
  const [showAddTruth, setShowAddTruth] = useState(false);
  const [newTruth, setNewTruth] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setChecks(journalStorage.getDisciplineChecks(dateKey));
      setPledges(journalStorage.getDisciplinePledges());
      setIronRules(journalStorage.getIronRules());
      setRealityLines(journalStorage.getRealityCheckLines());
      setCountdowns(journalStorage.getExamCountdowns());
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, [dateKey]);

  // 30s Reset Countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && resetTimer > 0) {
      interval = setInterval(() => {
        setResetTimer((prev) => prev - 1);
      }, 1000);
    } else if (resetTimer === 0 && timerActive) {
      soundEngine.playBell(587);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, resetTimer]);

  const startEmergencyReset = () => {
    soundEngine.playPop();
    setShowRealityCheck(true);
    setResetTimer(30);
    setTimerActive(true);
  };

  const handleToggleCheck = (id) => {
    soundEngine.playPop();
    journalStorage.toggleDisciplineCheck(dateKey, id);
    const updated = journalStorage.getDisciplineChecks(dateKey);
    setChecks(updated);

    const completed = updated.filter(c => c.completed).length;
    if (completed === updated.length) {
      soundEngine.playBell(587); // High bell
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleTogglePledgeDay = (pledgeId, dayIdx) => {
    soundEngine.playPop();
    journalStorage.togglePledgeDay(pledgeId, dayIdx);
  };

  const handleDeletePledge = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this discipline pledge?')) {
      journalStorage.deletePledge(id);
    }
  };

  const handleAddPledge = (e) => {
    e.preventDefault();
    if (!pledgeTitle.trim()) return;
    soundEngine.playPop();
    journalStorage.addPledge({
      title: pledgeTitle.trim(),
      reward: pledgeReward.trim() || 'Guilt-free rest or special treat'
    });
    setPledgeTitle('');
    setPledgeReward('');
    setShowPledgeModal(false);
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!ruleTitle.trim()) return;
    soundEngine.playPop();
    journalStorage.addIronRule(ruleTitle.trim(), ruleDetail.trim());
    setRuleTitle('');
    setRuleDetail('');
    setShowRuleModal(false);
  };

  const handleDeleteRule = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this rule?')) {
      journalStorage.deleteIronRule(id);
    }
  };

  const handleAddCustomTruth = (e) => {
    e.preventDefault();
    if (!newTruth.trim()) return;
    soundEngine.playPop();
    journalStorage.addRealityCheckLine(newTruth.trim());
    setNewTruth('');
    setShowAddTruth(false);
  };

  const triggerNextRealityLine = () => {
    soundEngine.playPop();
    setRealityIndex((prev) => (prev + 1) % realityLines.length);
  };

  // Helper: calculate days remaining
  const calculateDaysLeft = (targetDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const completedChecksCount = checks.filter(c => c.completed).length;
  const scorePercent = Math.round((completedChecksCount / checks.length) * 100);

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-16">
      
      {/* ── TOP HEADER & EMERGENCY WAKE-UP BUTTON ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Mindset & Operating Standard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Discipline Board
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Motivation is temporary. Discipline is doing what needs to be done even when you don't feel like it.
          </p>
        </div>

        {/* Emergency Panic / Wake-Up Button */}
        <button
          onClick={startEmergencyReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all self-start sm:self-auto shadow-sm"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>Read When Lazy / Procrastinating</span>
        </button>
      </div>

      {/* ── EMERGENCY REALITY CHECK MODAL / BANNER ─────────────────── */}
      {showRealityCheck && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-300 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-md">
                Hard Truth #{realityIndex + 1}
              </span>
              {timerActive && (
                <span className="text-xs font-mono text-white bg-black/40 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset in: {resetTimer}s</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={triggerNextRealityLine}
                className="text-xs font-semibold underline text-rose-300 hover:text-white"
              >
                Next Truth →
              </button>
              <button
                onClick={() => setShowRealityCheck(false)}
                className="text-xs text-rose-300/80 hover:text-white px-2 py-1 rounded border border-rose-500/30"
              >
                Dismiss
              </button>
            </div>
          </div>

          <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            "{realityLines[realityIndex]}"
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-rose-500/20 text-xs">
            <p className="text-rose-200/90 font-medium">
              👉 Put your phone in another room. Splash cold water on your face. Start 5 minutes of study right now.
            </p>
            <button
              onClick={() => setShowAddTruth(true)}
              className="text-xs text-rose-300 hover:text-white underline self-start sm:self-auto"
            >
              + Add Custom Truth
            </button>
          </div>
        </div>
      )}

      {/* ── COUNTDOWNS TO MAJOR GOALS ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {countdowns.map((cd) => {
          const daysLeft = calculateDaysLeft(cd.targetDate);
          const isUrgent = daysLeft <= 30;

          return (
            <div 
              key={cd.id}
              className={`journal-card p-4 space-y-2 border transition-all ${
                isUrgent ? 'border-amber-500/40 bg-amber-500/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] truncate max-w-[180px]">
                  {cd.subject || 'Target Milestone'}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  daysLeft > 0 ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {daysLeft > 0 ? `${daysLeft} Days` : 'Completed'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                {cd.name}
              </h3>
              <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                Target: {cd.targetDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION 1: THE 5 DAILY NON-NEGOTIABLES ─────────────────── */}
      <div className="journal-card p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Today's 5 Non-Negotiable Standards
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Hit all 5 daily. Zero excuses. 100% adherence = pure momentum.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {completedChecksCount} / {checks.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] ml-1">({scorePercent}%)</span>
            </div>
            <div className="w-24 h-2 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${scorePercent}%`, backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>

        {/* 5 Daily Standard Rows */}
        <div className="space-y-2.5">
          {checks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleCheck(item.id)}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all duration-200 ${
                item.completed
                  ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--text-primary)]'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  aria-label={`Toggle check ${item.label}`}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    item.completed ? 'border-transparent text-white' : 'border-[var(--border-medium)]'
                  }`}
                  style={item.completed ? { backgroundColor: accentColor } : {}}
                >
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className={`text-xs sm:text-sm font-medium ${item.completed ? 'text-[var(--text-primary)] font-bold line-through opacity-80' : 'text-[var(--text-primary)]'}`}>
                  {item.label}
                </span>
              </div>

              {item.completed ? (
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Locked In
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Pending
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: 7-DAY DISCIPLINE CONTRACTS ──────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Active 7-Day Discipline Contracts
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              7-day commitments to break bad habits or lock in key standards
            </p>
          </div>

          <button
            onClick={() => setShowPledgeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Contract</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pledges.map((pledge) => {
            const completedDays = pledge.daysCompleted.filter(Boolean).length;
            const isFinished = completedDays === 7;

            return (
              <div 
                key={pledge.id}
                className={`journal-card p-5 space-y-3.5 flex flex-col justify-between group transition-all ${
                  isFinished ? 'border-amber-500/40 bg-amber-500/5' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {pledge.title}
                    </h3>
                    <button
                      onClick={() => handleDeletePledge(pledge.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-[var(--text-muted)] mt-2">
                    Reward upon completion: <span className="font-semibold text-amber-400">{pledge.reward}</span>
                  </div>
                </div>

                {/* 7 Interactive Day Buttons */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Progress</span>
                    <span className="font-bold text-[var(--text-primary)]">{completedDays} / 7 Days</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {pledge.daysCompleted.map((done, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTogglePledgeDay(pledge.id, idx)}
                        className={`h-9 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          done
                            ? 'bg-amber-500 border-transparent text-white shadow-sm'
                            : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-secondary)]'
                        }`}
                      >
                        {done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `D${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: MY IRON RULES (USER CUSTOMIZABLE) ───────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              My Iron Rules
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Personal non-negotiable principles you live by
            </p>
          </div>

          <button
            onClick={() => setShowRuleModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ironRules.map((r, i) => (
            <div 
              key={r.id}
              className="journal-card p-4 space-y-1.5 bg-[var(--bg-surface-elevated)] relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" 
                    style={{ backgroundColor: accentColor }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                    {r.rule}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteRule(r.id)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-0.5 transition-opacity"
                  title="Delete Rule"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {r.detail && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-7">
                  {r.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: ADD PLEDGE ──────────────────────────────────────── */}
      {showPledgeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowPledgeModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">New 7-Day Discipline Contract</h3>
              <button onClick={() => setShowPledgeModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPledge} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Contract Title / Standard
                </label>
                <input
                  type="text"
                  required
                  value={pledgeTitle}
                  onChange={(e) => setPledgeTitle(e.target.value)}
                  placeholder="e.g. 7 Days 5:00 AM Fajr with Zero Snooze"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Reward Upon 7/7 Completion
                </label>
                <input
                  type="text"
                  value={pledgeReward}
                  onChange={(e) => setPledgeReward(e.target.value)}
                  placeholder="e.g. Guilt-free weekend coding / special meal"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPledgeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Sign Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD RULE ────────────────────────────────────────── */}
      {showRuleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowRuleModal(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add Iron Rule</h3>
              <button onClick={() => setShowRuleModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Rule Principle
                </label>
                <input
                  type="text"
                  required
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  placeholder="e.g. Never touch phone before morning study"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Why / Detail (Optional)
                </label>
                <input
                  type="text"
                  value={ruleDetail}
                  onChange={(e) => setRuleDetail(e.target.value)}
                  placeholder="e.g. Protect morning dopamine and mental focus"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD REALITY TRUTH ───────────────────────────────── */}
      {showAddTruth && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowAddTruth(false)}
        >
          <div 
            className="bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Add Reality Truth</h3>
              <button onClick={() => setShowAddTruth(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomTruth} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Reality Check Line
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTruth}
                  onChange={(e) => setNewTruth(e.target.value)}
                  placeholder="e.g. If you don't build discipline now, your future self pays the penalty."
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTruth(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Add Truth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DisciplinePage;