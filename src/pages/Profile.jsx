import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  User, Settings, GraduationCap, Volume2, 
  VolumeX, Clock, Save, Shield, Check, 
  RotateCcw, Sliders, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  const [editData, setEditData] = useState({ 
    full_name: user?.full_name || '', 
    email: user?.email || '',
    grade_level: user?.grade_level || '9th'
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('acadevance_learning_preferences');
      return saved ? JSON.parse(saved) : { goal: '45m', sounds: true, highContrast: false };
    } catch (e) {
      return { goal: '45m', sounds: true, highContrast: false };
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('acadevance_learning_preferences', JSON.stringify(updated));
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    const updated = await authService.updateMe(editData);
    if (updated) {
      setUser(updated);
    }
    setIsSaved(true);
    notificationService.send("Settings Saved", "Scholar workstation preferences committed.", "success");
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetStorage = () => {
    if (window.confirm("Reset local study progress cache? This will clear temporary session timestamps.")) {
      localStorage.removeItem('acadevance_applied_tips');
      localStorage.removeItem('acadevance_focus_session');
      notificationService.send("Cache Cleared", "Local study buffers have been reset.", "info");
    }
  };

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER / IDENTITY PLATE */}
      <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              System Configuration / Identity & Settings
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Scholar Workstation
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Control your academic curriculum tier, daily study focus targets, and workspace audio ergonomics.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-6 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm self-start sm:self-end"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Committed' : 'Commit Settings'}</span>
        </button>
      </header>

      {/* MAIN CONFIGURATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#ff4625]/10 border border-[#ff4625]/20 flex items-center justify-center text-[#ff4625]">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Active Scholar</span>
              <h2 className="text-xl font-bold text-white uppercase font-clash">
                {editData.full_name || 'Anonymous Scholar'}
              </h2>
              <p className="font-mono text-xs text-zinc-400 break-all">{editData.email || 'scholar@local.hub'}</p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono text-[11px] uppercase">Curriculum Tier</span>
                <span className="font-mono font-bold text-[#ff4625] bg-[#ff4625]/10 px-2.5 py-1 rounded">
                  Class {editData.grade_level} CBSE
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono text-[11px] uppercase">Daily Target</span>
                <span className="font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded">
                  {preferences.goal}
                </span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="p-5 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block">Workspace Actions</span>
            
            <button
              onClick={() => navigate('/curriculum')}
              className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left flex items-center justify-between text-xs text-zinc-300 transition-colors"
            >
              <span>Explore Curriculum Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => navigate('/focus-timer')}
              className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left flex items-center justify-between text-xs text-zinc-300 transition-colors"
            >
              <span>Open Focus Timer</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => navigate('/flashcards')}
              className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left flex items-center justify-between text-xs text-zinc-300 transition-colors"
            >
              <span>Review Flashcards</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREFERENCES & EDIT FORMS */}
        <div className="md:col-span-2 space-y-8">
          
          {/* SCHOLAR PROFILE EDIT */}
          <section className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#ff4625]" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                Scholar Identity Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  placeholder="Enter scholar name"
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-sm text-white font-sans focus:outline-none focus:border-[#ff4625] transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
                  Target Academic Class (NCERT Syllabus)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setEditData({ ...editData, grade_level: grade })}
                      className={`py-2.5 rounded-lg border font-mono text-xs uppercase transition-all ${
                        editData.grade_level === grade
                          ? 'bg-[#ff4625] border-[#ff4625] text-white font-bold'
                          : 'bg-[#08090b] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STUDY ENVIRONMENT PREFERENCES */}
          <section className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ff4625]" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                Study Session Ergonomics
              </h3>
            </div>

            <div className="space-y-6">
              {/* Daily Target */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Daily Focus Goal</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Recommended continuous study block per day</p>
                </div>
                <div className="flex gap-2">
                  {['15m', '30m', '45m', '60m', '90m'].map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handlePreferenceChange('goal', target)}
                      className={`px-3.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                        preferences.goal === target
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-[#08090b] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Feedback */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Interface Audio Feedback</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Synthesized tactile clicks and timer alert cues</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('sounds', !preferences.sounds)}
                  className={`px-4 py-2 rounded-lg border font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                    preferences.sounds
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                      : 'bg-[#08090b] border-white/10 text-zinc-400'
                  }`}
                >
                  {preferences.sounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{preferences.sounds ? 'Enabled' : 'Muted'}</span>
                </button>
              </div>

              {/* Reset Cache */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Clear Study Cache</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Flush temporary checklist marks and local session timers</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetStorage}
                  className="px-4 py-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Flush</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;