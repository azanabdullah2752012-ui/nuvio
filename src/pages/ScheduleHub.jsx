import React, { useState, useEffect } from 'react';
import { Clock, Compass, Flame, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { journalStorage, getTodayKey } from '../services/journalStorage';
import { soundEngine } from '../services/soundEngine';
import RoutinePage from './RoutinePage';
import PrayerPage from './PrayerPage';
import HabitsPage from './HabitsPage';
import DigitalTasbihCard from '../components/journal/DigitalTasbihCard';

const TABS = [
  { id: 'timeline', label: 'Routine Timeline', icon: Clock },
  { id: 'prayer', label: 'Prayer & Dhikr Radar', icon: Compass },
  { id: 'habits', label: 'Habit Tracker Deep View', icon: Flame }
];

const ScheduleHub = () => {
  const [activeTab, setActiveTab] = useState('timeline');
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
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
            Daily Rhythm & Spiritual Anchor
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Schedule, Routines & Prayers
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your school day flow, weekend build blocks, and Chennai prayer radar in one unified view.
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
        {activeTab === 'timeline' && <RoutinePage />}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <PrayerPage />
            <DigitalTasbihCard accentColor={accentColor} />
          </div>
        )}
        {activeTab === 'habits' && <HabitsPage />}
      </div>

    </div>
  );
};

export default ScheduleHub;
