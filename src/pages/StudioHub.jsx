import React, { useState, useEffect } from 'react';
import { Rocket, DollarSign, Lightbulb, Terminal, Plus } from 'lucide-react';
import { journalStorage } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import ActiveForgeCard from '../components/journal/ActiveForgeCard';
import IdeaVaultCard from '../components/journal/IdeaVaultCard';
import ScratchpadCard from '../components/journal/ScratchpadCard';
import PickleCorpPage from './PickleCorpPage';

const TABS = [
  { id: 'active', label: 'Active Shipping Forge', icon: Rocket },
  { id: 'favors', label: 'Pickle Corp Favor Bank', icon: DollarSign },
  { id: 'ideas', label: 'Idea Vault', icon: Lightbulb },
  { id: 'scratchpad', label: 'Dev Scratchpad', icon: Terminal }
];

const StudioHub = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [accentColor, setAccentColor] = useState(journalStorage.getAccentColor());

  useEffect(() => {
    const handleUpdate = () => {
      setAccentColor(journalStorage.getAccentColor());
    };
    window.addEventListener('journal_data_update', handleUpdate);
    return () => window.removeEventListener('journal_data_update', handleUpdate);
  }, []);

  return (
    <div className="space-y-7 text-left max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
            Engineering, Software & Studio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Pickle Corp Studio & Builds
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Lock in on ONE product until it ships, bank real-life favors, and park shiny new distractions.
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
          </div>
        )}

        {activeTab === 'favors' && <PickleCorpPage />}

        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <IdeaVaultCard accentColor={accentColor} />
          </div>
        )}

        {activeTab === 'scratchpad' && (
          <div className="space-y-6">
            <ScratchpadCard />
          </div>
        )}
      </div>

    </div>
  );
};

export default StudioHub;
