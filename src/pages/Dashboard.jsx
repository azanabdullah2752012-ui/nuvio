import React, { useState, useEffect } from 'react';
import { 
  Rocket, BookOpen, Dumbbell, Star, 
  Plus, Check, Play, Clock, 
  Trash2, Edit3, Flame, ExternalLink, 
  Lightbulb, Shield, Sparkles, ChevronDown, ChevronUp, Cpu
} from 'lucide-react';
import { format } from 'date-fns';
import { dataService } from '../services/dataService';
import { soundEngine } from '../services/soundEngine';
import LockInModal from '../components/LockInModal';

const Dashboard = () => {
  const [profile, setProfile] = useState(dataService.getProfile());
  const [activeBuild, setActiveBuild] = useState(dataService.getActiveBuild());
  const [missions, setMissions] = useState(dataService.getMissions());
  const [routine, setRoutine] = useState(dataService.getRoutine());
  const [ideas, setIdeas] = useState(dataService.getIdeaVault());
  const [scratchpad, setScratchpad] = useState(dataService.getScratchpad());
  const [sessions, setSessions] = useState(dataService.getSessions());

  // Input states
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionCategory, setNewMissionCategory] = useState('Build');
  const [newMissionTag, setNewMissionTag] = useState('Code');
  
  // Idea vault input
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaType, setIdeaType] = useState('Product Idea');
  const [ideaNotes, setIdeaNotes] = useState('');

  // Lock-In Mode
  const [isLockInOpen, setIsLockInOpen] = useState(false);
  const [lockInTarget, setLockInTarget] = useState('');

  // Edit Active Build
  const [isEditingBuild, setIsEditingBuild] = useState(false);
  const [buildName, setBuildName] = useState(activeBuild?.name || '');
  const [buildGoal, setBuildGoal] = useState(activeBuild?.goal || '');
  const [buildNextStep, setBuildNextStep] = useState(activeBuild?.nextStep || '');

  // Routine toggle
  const [showRoutine, setShowRoutine] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(dataService.getProfile());
      setActiveBuild(dataService.getActiveBuild());
      setMissions(dataService.getMissions());
      setRoutine(dataService.getRoutine());
      setIdeas(dataService.getIdeaVault());
      setScratchpad(dataService.getScratchpad());
      setSessions(dataService.getSessions());
    };
    window.addEventListener('kaiser_os_update', handleUpdate);
    return () => window.removeEventListener('kaiser_os_update', handleUpdate);
  }, []);

  const handleToggleMission = (id) => {
    soundEngine.playPop();
    dataService.toggleMission(id);
  };

  const handleAddMission = (e) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;
    soundEngine.playPop();
    dataService.addMission(newMissionTitle, newMissionCategory, newMissionTag);
    setNewMissionTitle('');
  };

  const handleDeleteMission = (id, e) => {
    e.stopPropagation();
    dataService.deleteMission(id);
  };

  const handleSaveBuild = (e) => {
    e.preventDefault();
    dataService.updateActiveBuild({
      name: buildName,
      goal: buildGoal,
      nextStep: buildNextStep
    });
    setIsEditingBuild(false);
    soundEngine.playPop();
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    soundEngine.playPop();
    dataService.addIdea(ideaTitle, ideaType, ideaNotes);
    setIdeaTitle('');
    setIdeaNotes('');
    setShowAddIdea(false);
  };

  const handleDeleteIdea = (id) => {
    dataService.deleteIdea(id);
  };

  const handleScratchpadChange = (e) => {
    const val = e.target.value;
    setScratchpad(val);
    dataService.saveScratchpad(val);
  };

  const startLockIn = (label) => {
    setLockInTarget(label);
    setIsLockInOpen(true);
  };

  // Stats
  const todayMinutes = sessions
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((acc, s) => acc + (s.minutes || 0), 0);

  const completedMissions = missions.filter(m => m.completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-36 pt-4 px-4 sm:px-6 font-sans text-left selection:bg-emerald-800 selection:text-white">
      
      {/* ── HEADER & IDENTITY ─────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eceae3] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#8e8d8a] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span>GCIS CLASS IX-C • POLARIS HOUSE</span>
            <span>•</span>
            <span>{format(new Date(), 'EEEE, MMMM d')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1d1d1f] tracking-tight">
            Kaiser Command Deck
          </h1>
          <p className="text-xs text-[#545350] mt-1 font-mono">
            Ship products people actually use • Crack Pearson Class 9 Maths • Stay disciplined.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => startLockIn('Deep Focus Sprint')}
            className="px-4 py-2.5 bg-[#1b3b2b] hover:bg-[#28553e] text-white text-xs font-semibold rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>Enter Lock-In</span>
          </button>
        </div>
      </header>

      {/* ── SECTION 1: THE ACTIVE BUILD (Anti-Shiny-Object Forge) ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e3db] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 relative overflow-hidden">
        
        {/* Card Top Strip */}
        <div className="flex items-center justify-between border-b border-[#f4f3ef] pb-3 text-[10px] font-mono uppercase tracking-widest text-[#8e8d8a]">
          <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <Rocket className="w-3.5 h-3.5 text-emerald-700" />
            CURRENT SHIPPING FORGE // ONE PROJECT AT A TIME
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {activeBuild.status}
            </span>
            <button
              onClick={() => {
                setBuildName(activeBuild.name);
                setBuildGoal(activeBuild.goal);
                setBuildNextStep(activeBuild.nextStep);
                setIsEditingBuild(!isEditingBuild);
              }}
              className="hover:text-black transition-colors"
              title="Edit active project"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!isEditingBuild ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1d1d1f]">
                {activeBuild.name}
              </h2>
              <span className="text-xs font-mono text-[#8e8d8a]">
                Type: {activeBuild.type}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#545350] leading-relaxed">
              <span className="font-bold text-[#1d1d1f]">Core Goal: </span>
              {activeBuild.goal}
            </p>

            {/* Next Immediate Action Callout */}
            <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e8e6df] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
                  Next Step to Ship:
                </span>
                <span className="text-xs font-serif font-medium text-[#1d1d1f] truncate block">
                  {activeBuild.nextStep}
                </span>
              </div>

              <button
                onClick={() => startLockIn(`Ship: ${activeBuild.nextStep}`)}
                className="px-3.5 py-1.5 bg-[#1b3b2b] text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 hover:bg-[#28553e]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Build Now</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveBuild} className="space-y-3 pt-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8e8d8a]">Project Name</label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs font-sans mt-0.5"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8e8d8a]">Goal (Must have real users/validation)</label>
              <input
                type="text"
                value={buildGoal}
                onChange={(e) => setBuildGoal(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs font-sans mt-0.5"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#8e8d8a]">Next Step to Ship</label>
              <input
                type="text"
                value={buildNextStep}
                onChange={(e) => setBuildNextStep(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs font-sans mt-0.5"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingBuild(false)}
                className="px-3 py-1.5 text-xs text-[#8e8d8a]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1b3b2b] text-white text-xs font-semibold rounded-xl"
              >
                Update Build Target
              </button>
            </div>
          </form>
        )}

      </div>

      {/* ── SECTION 2: TODAY'S 3 BATTLE MISSIONS ───────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8e8d8a] font-bold">
              Today's Key Missions ({completedMissions}/{missions.length})
            </span>
          </div>
          <span className="text-xs font-mono text-[#8e8d8a]">
            {todayMinutes}m locked in today
          </span>
        </div>

        {/* Mission List */}
        <div className="divide-y divide-[#f0eee6] bg-white border border-[#e8e6df] rounded-3xl shadow-xs overflow-hidden">
          {missions.map((m) => (
            <div
              key={m.id}
              className="group p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-[#faf9f6] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleMission(m.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    m.completed
                      ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white'
                      : 'border-[#c7c5bc] group-hover:border-[#1b3b2b]'
                  }`}
                >
                  {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-serif font-medium text-[#1d1d1f] truncate ${
                    m.completed ? 'line-through text-[#8e8d8a]' : ''
                  }`}>
                    {m.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#8e8d8a] mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded ${
                      m.category === 'Academic' ? 'bg-blue-50 text-blue-700' :
                      m.category === 'Build' ? 'bg-emerald-50 text-emerald-800' :
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {m.category}
                    </span>
                    <span>•</span>
                    <span>{m.tag}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!m.completed && (
                  <button
                    onClick={() => startLockIn(m.title)}
                    className="p-1.5 text-[#8e8d8a] hover:text-[#1b3b2b] transition-colors rounded-lg hover:bg-[#f4f3ef]"
                    title="Lock in on this mission"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}

                <button
                  onClick={(e) => handleDeleteMission(m.id, e)}
                  className="p-1.5 text-[#c7c5bc] hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete mission"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Add Mission Form */}
        <form onSubmit={handleAddMission} className="p-3 bg-white border border-[#e8e6df] rounded-2xl flex items-center gap-2 text-xs">
          <input
            type="text"
            value={newMissionTitle}
            onChange={(e) => setNewMissionTitle(e.target.value)}
            placeholder="Add today's mission (e.g. Pearson Physics sound chapter, ESP32 test)..."
            className="flex-1 bg-transparent px-2 py-1 focus:outline-none text-[#1d1d1f]"
          />
          <select
            value={newMissionCategory}
            onChange={(e) => setNewMissionCategory(e.target.value)}
            className="bg-[#fbfbfa] border border-[#e8e6df] rounded-lg px-2 py-1 text-[11px] font-mono"
          >
            <option value="Academic">Academic</option>
            <option value="Build">Build</option>
            <option value="Personal">Personal</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#1b3b2b] text-white rounded-lg font-semibold hover:bg-[#28553e]"
          >
            Add
          </button>
        </form>
      </div>

      {/* ── SECTION 3: ESTABLISHED DAILY ROUTINE (REAL GCIS SYNC) ─── */}
      <div className="p-5 rounded-3xl bg-white border border-[#e5e3db] space-y-3">
        <button
          onClick={() => setShowRoutine(!showRoutine)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1d1d1f]">
            <span>🕒 Established Daily Cadence</span>
            <span className="text-[#8e8d8a] font-normal">(Fajr • GCIS • NextTopper • The Forge)</span>
          </div>
          {showRoutine ? <ChevronUp className="w-4 h-4 text-[#8e8d8a]" /> : <ChevronDown className="w-4 h-4 text-[#8e8d8a]" />}
        </button>

        {showRoutine && (
          <div className="pt-2 divide-y divide-[#f4f3ef] text-xs font-mono animate-fadeIn">
            {routine.map((block, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between gap-4">
                <span className="font-bold text-[#1b3b2b] shrink-0 w-28">{block.time}</span>
                <span className="font-serif text-[#1d1d1f] font-medium flex-1 truncate">{block.label}</span>
                <span className="text-[#8e8d8a] text-[11px] hidden sm:inline">{block.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 4: IDEA VAULT & FLAME LORE (Brain Dump) ────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8e8d8a] font-bold">
              Idea Vault & Flame Lore ({ideas.length})
            </span>
          </div>

          <button
            onClick={() => setShowAddIdea(!showAddIdea)}
            className="text-xs font-mono text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Store New Idea</span>
          </button>
        </div>

        {showAddIdea && (
          <form onSubmit={handleAddIdea} className="p-5 bg-white border border-[#e8e6df] rounded-3xl space-y-3 animate-fadeIn text-xs">
            <div className="font-mono text-xs uppercase font-bold text-[#1b3b2b]">
              Capture Fleeting Idea (Don't let it derail your active build!)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Idea title / concept..."
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-2 border rounded-xl"
                required
              />
              <select
                value={ideaType}
                onChange={(e) => setIdeaType(e.target.value)}
                className="px-3 py-2 border rounded-xl font-mono text-[11px]"
              >
                <option value="Product Idea">Product Idea</option>
                <option value="Robotics">Robotics / Hardware</option>
                <option value="Creative">Flame Dragon Lore</option>
                <option value="Study Trick">Study Trick / Formula</option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Notes, pinouts, mechanics, or character scenarios..."
              value={ideaNotes}
              onChange={(e) => setIdeaNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddIdea(false)}
                className="px-3 py-1 text-[#8e8d8a]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1b3b2b] text-white rounded-xl font-semibold"
              >
                Save to Vault
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="p-4 bg-white border border-[#e8e6df] rounded-2xl shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#f4f3ef] text-[#8e8d8a] font-bold">
                    {idea.type}
                  </span>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="text-[#c7c5bc] hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1d1d1f]">
                  {idea.title}
                </h3>
                <p className="text-xs text-[#545350] line-clamp-3 leading-relaxed font-sans">
                  {idea.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 5: LIVE SCRATCHPAD (Brain Dump) ────────────────── */}
      <div className="p-5 bg-white border border-[#e8e6df] rounded-3xl shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8e8d8a]">
          <span className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-[#1b3b2b]" />
            Kaiser Scratchpad (Auto-saves live)
          </span>
          <span>Notes & Working Memory</span>
        </div>
        <textarea
          rows={5}
          value={scratchpad}
          onChange={handleScratchpadChange}
          placeholder="Jot down quick word problem equations, ESP32 notes, or thoughts..."
          className="w-full text-xs font-mono text-[#1d1d1f] bg-transparent focus:outline-none resize-none leading-relaxed placeholder:text-[#a09e97]"
        />
      </div>

      {/* ── LOCK-IN CHAMBER MODAL ──────────────────────────────────── */}
      <LockInModal
        isOpen={isLockInOpen}
        onClose={() => setIsLockInOpen(false)}
        defaultMission={lockInTarget}
        onComplete={() => {
          setIsLockInOpen(false);
          setSessions(dataService.getSessions());
        }}
      />

    </div>
  );
};

export default Dashboard;
