import React, { useState, useEffect } from 'react';
import { Rocket, Edit3, ExternalLink, Check, Plus, Shield, ArrowRight } from 'lucide-react';
import { journalStorage } from '../../services/journalStorage';
import { soundEngine } from '../../services/soundEngine';

const ActiveForgeCard = ({ accentColor }) => {
  const [project, setProject] = useState(journalStorage.getActiveProject());
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [name, setName] = useState(project.name);
  const [pitch, setPitch] = useState(project.pitch);
  const [nextStep, setNextStep] = useState(project.nextStep);
  const [repoUrl, setRepoUrl] = useState(project.repoUrl);

  useEffect(() => {
    const handleUpdate = () => {
      setProject(journalStorage.getActiveProject());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleToggleMilestone = (index) => {
    soundEngine.playPop();
    journalStorage.toggleProjectMilestone(index);
  };

  const handleSave = (e) => {
    e.preventDefault();
    soundEngine.playPop();
    journalStorage.saveActiveProject({
      ...project,
      name,
      pitch,
      nextStep,
      repoUrl
    });
    setIsEditing(false);
  };

  return (
    <div className="journal-card p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
            Active Shipping Forge
          </h2>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Locked In
          </span>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel' : 'Edit Project'}</span>
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              One-Line Pitch / Utility
            </label>
            <input
              type="text"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
              The Next Physical Step
            </label>
            <input
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              Save Project
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {project.name}
              </h3>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 font-mono"
                >
                  <span>Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {project.pitch}
            </p>
          </div>

          {/* Next Step Box */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start gap-3">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white"
              style={{ backgroundColor: accentColor }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                Single Next Physical Action
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                {project.nextStep}
              </span>
            </div>
          </div>

          {/* Milestones checklist */}
          {project.milestones && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">
                Build Milestones
              </span>
              <div className="space-y-1">
                {project.milestones.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    onClick={() => handleToggleMilestone(idx)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs text-left hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <div 
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        m.completed ? 'border-transparent text-white' : 'border-[var(--border-medium)]'
                      }`}
                      style={m.completed ? { backgroundColor: accentColor } : {}}
                    >
                      {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={m.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}>
                      {m.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveForgeCard;
