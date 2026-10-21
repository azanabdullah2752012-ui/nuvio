import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Volume2, 
  VolumeX, Clock, Save, Shield, Check, 
  RotateCcw, Sliders, ArrowUpRight, Zap, Moon, Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const ARCHETYPES = [
  'Creator / Solopreneur',
  'Knowledge Worker / Engineer',
  'Deep Thinker / Researcher',
  'Operator / Executive',
  'Universal Life Optimizer'
];

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  const [editData, setEditData] = useState({ 
    full_name: user?.full_name || 'Navigator', 
    email: user?.email || '',
    archetype: user?.grade_level || 'Creator / Solopreneur'
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('nuvio_life_preferences');
      return saved ? JSON.parse(saved) : { 
        dailyUltradianTarget: 2, 
        sounds: true, 
        bedtime: '22:30', 
        wakeTime: '06:30' 
      };
    } catch (e) {
      return { dailyUltradianTarget: 2, sounds: true, bedtime: '22:30', wakeTime: '06:30' };
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('nuvio_life_preferences', JSON.stringify(updated));
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    const updated = await authService.updateMe({
      full_name: editData.full_name,
      email: editData.email,
      grade_level: editData.archetype
    });
    if (updated) {
      setUser(updated);
    }
    setIsSaved(true);
    notificationService.send("Preferences Saved", "Life operating system preferences committed.", "success");
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetStorage = () => {
    if (window.confirm("Reset local cache and temporary session timers?")) {
      localStorage.removeItem('nuvio_life_preferences');
      notificationService.send("Cache Reset", "Local buffers cleared.", "info");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              User Configuration // System Parameters
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Life OS Settings
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Configure your professional archetype, circadian waking windows, and daily deep work capacity.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)] self-start sm:self-auto"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Committed' : 'Save Settings'}</span>
        </button>
      </header>

      {/* ── IDENTITY CARD ──────────────────────────────────────────── */}
      <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl shadow-sm space-y-6">
        <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1b3b2b]">
          Identity & Archetype
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#827f76] font-bold">
              Full Name / Moniker
            </label>
            <input
              type="text"
              value={editData.full_name}
              onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-sm focus:outline-none focus:border-[#1b3b2b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#827f76] font-bold">
              Life / Work Archetype
            </label>
            <select
              value={editData.archetype}
              onChange={(e) => setEditData({ ...editData, archetype: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-mono"
            >
              {ARCHETYPES.map(arc => (
                <option key={arc} value={arc}>{arc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── CIRCADIAN & DEEP WORK PROTOCOLS ────────────────────────── */}
      <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl shadow-sm space-y-6">
        <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1b3b2b]">
          Circadian Rhythms & Focus Capacities
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-4 border border-[#e5e1d5] rounded-xl bg-[#faf9f6] space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1a1917]">
              <Zap className="w-4 h-4 text-[#1b3b2b]" />
              <span>Daily Ultradian Target</span>
            </div>
            <p className="text-[11px] text-[#52504a]">
              Huberman recommends 2 to 3 high-intensity bouts (3 to 4.5h) per day.
            </p>
            <select
              value={preferences.dailyUltradianTarget}
              onChange={(e) => handlePreferenceChange('dailyUltradianTarget', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#e5e1d5] rounded-lg text-xs font-mono"
            >
              <option value={1}>1 Bout (1.5 Hours)</option>
              <option value={2}>2 Bouts (3 Hours - Recommended)</option>
              <option value={3}>3 Bouts (4.5 Hours - Maximum)</option>
            </select>
          </div>

          <div className="p-4 border border-[#e5e1d5] rounded-xl bg-[#faf9f6] space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1a1917]">
              <Sun className="w-4 h-4 text-[#8a4b16]" />
              <span>Wake Time Anchor</span>
            </div>
            <p className="text-[11px] text-[#52504a]">
              Anchors morning cortisol pulse and natural sunlight window.
            </p>
            <input
              type="time"
              value={preferences.wakeTime}
              onChange={(e) => handlePreferenceChange('wakeTime', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e5e1d5] rounded-lg text-xs font-mono"
            />
          </div>

          <div className="p-4 border border-[#e5e1d5] rounded-xl bg-[#faf9f6] space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1a1917]">
              <Moon className="w-4 h-4 text-[#3a354c]" />
              <span>Bedtime Shutdown</span>
            </div>
            <p className="text-[11px] text-[#52504a]">
              Triggers dim lighting cues and evening shutdown preparation.
            </p>
            <input
              type="time"
              value={preferences.bedtime}
              onChange={(e) => handlePreferenceChange('bedtime', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e5e1d5] rounded-lg text-xs font-mono"
            />
          </div>

        </div>
      </div>

      {/* ── STORAGE ACTIONS ────────────────────────────────────────── */}
      <div className="p-6 border border-[#e5e1d5] bg-[#faf9f6] rounded-2xl flex items-center justify-between">
        <div>
          <div className="font-serif font-bold text-sm text-[#1a1917]">
            Reset Session Buffer Cache
          </div>
          <div className="text-xs text-[#827f76]">
            Clear temporary session state without deleting your saved tasks.
          </div>
        </div>

        <button
          onClick={handleResetStorage}
          className="px-4 py-2 border border-[#e5e1d5] hover:border-red-500 hover:text-red-600 bg-white rounded-xl text-xs font-mono transition-colors"
        >
          Reset Cache
        </button>
      </div>

    </div>
  );
};

export default Profile;
