import React, { useState, useEffect } from 'react';
import { Rocket, FolderGit2, Lightbulb, Terminal, Plus, Trash2, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { journalStorage } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import ActiveForgeCard from '../components/journal/ActiveForgeCard';
import IdeaVaultCard from '../components/journal/IdeaVaultCard';
import ScratchpadCard from '../components/journal/ScratchpadCard';
import WinsPage from './WinsPage';

const TABS = [
  { id: 'active', label: 'Active Shipping Forge', icon: Rocket },
  { id: 'projects', label: 'Projects & Builds', icon: FolderGit2 },
  { id: 'ideas', label: 'Idea Vault', icon: Lightbulb },
  { id: 'scratchpad', label: 'Dev Scratchpad', icon: Terminal },
  { id: 'wins', label: 'Shipped Wins', icon: CheckCircle2 }
];

const ProjectsHub = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());
  const [projects, setProjects] = useState(journalStorage.getProjectsList());

  // New Project Modal State
  const [showModal, setShowModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projCategory, setProjCategory] = useState('Web App');
  const [projTech, setProjTech] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLink, setProjLink] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
      setProjects(journalStorage.getProjectsList());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projName.trim()) return;
    soundEngine.playPop();
    journalStorage.addProject({
      name: projName.trim(),
      category: projCategory,
      tech: projTech.trim() || 'React, Vite, Node',
      description: projDesc.trim(),
      link: projLink.trim(),
      status: 'In Progress'
    });
    setProjName('');
    setProjTech('');
    setProjDesc('');
    setProjLink('');
    setShowModal(false);
  };

  const handleToggleStatus = (id) => {
    soundEngine.playPop();
    journalStorage.toggleProjectStatus(id);
  };

  const handleDelete = (id) => {
    soundEngine.playPop();
    if (confirm('Delete this project?')) {
      journalStorage.deleteProject(id);
    }
  };

  return (
    <div className="space-y-7 text-left max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
            Engineering, Coding & Hardware
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Projects & Builds
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Lock in on ONE product until it ships, track web/robotics builds, and park shiny new distractions.
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
        {activeTab === 'active' && (
          <div className="space-y-6">
            <ActiveForgeCard accentColor={accentColor} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IdeaVaultCard accentColor={accentColor} />
              <ScratchpadCard />
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  All Projects & Prototypes
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Web applications, ESP32 electronics, and algorithmic tools
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const isDone = proj.status === 'Completed';

                return (
                  <div
                    key={proj.id}
                    className="journal-card p-5 space-y-3.5 flex flex-col justify-between group bg-[var(--bg-surface-elevated)]"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                            {proj.category}
                          </span>
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-opacity"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-[var(--text-primary)] mt-3">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {proj.description || 'No description provided.'}
                      </p>

                      <div className="mt-3 text-xs font-mono text-[var(--text-muted)]">
                        Tech: <span className="text-[var(--text-primary)]">{proj.tech}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                      <button
                        onClick={() => handleToggleStatus(proj.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          isDone 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {isDone ? '✓ Completed' : 'Mark Completed'}
                      </button>

                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 font-mono"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && <IdeaVaultCard accentColor={accentColor} />}

        {activeTab === 'scratchpad' && <ScratchpadCard />}

        {activeTab === 'wins' && <WinsPage />}
      </div>

      {/* ── MODAL: NEW PROJECT ─────────────────────────────────────── */}
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
              <h3 className="text-base font-semibold text-[var(--text-primary)]">New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] p-1 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="e.g. Quadcopter Flight Telemetry"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Category
                </label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="Web App">Web App</option>
                  <option value="Hardware/Robotics">Hardware / Robotics</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Algorithms">Algorithms / Tools</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  placeholder="e.g. C++, FreeRTOS, ESP32"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Description / Goal
                </label>
                <textarea
                  rows={2}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="What does it do and what is the MVP milestone?"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
                  Repository / Project URL (Optional)
                </label>
                <input
                  type="url"
                  value={projLink}
                  onChange={(e) => setProjLink(e.target.value)}
                  placeholder="https://github.com/..."
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsHub;