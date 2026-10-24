import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, BookOpen, Dumbbell, Star, 
  Plus, Check, Play, Pause, RotateCcw,
  Trash2, Edit3, Flame, ExternalLink, 
  Lightbulb, Shield, Sparkles, Activity, Clock, Terminal, ChevronRight
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { soundEngine } from '../services/soundEngine';

const Dashboard = () => {
  const [activeBuild, setActiveBuild] = useState(dataService.getActiveBuild());
  const [missions, setMissions] = useState(dataService.getMissions());
  const [ideas, setIdeas] = useState(dataService.getIdeaVault());
  const [scratchpad, setScratchpad] = useState(dataService.getScratchpad());
  const [sessions, setSessions] = useState(dataService.getSessions());

  // Quick Command Bar Input
  const [commandInput, setCommandInput] = useState('');
  const [commandCategory, setCommandCategory] = useState('Build');
  const commandInputRef = useRef(null);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        commandInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Mini Timer State
  const [timerMins, setTimerMins] = useState(45);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTarget, setTimerTarget] = useState('Active Build Sprint');

  // Edit Active Build Modal/Inline
  const [isEditingBuild, setIsEditingBuild] = useState(false);
  const [buildName, setBuildName] = useState(activeBuild?.name || '');
  const [buildGoal, setBuildGoal] = useState(activeBuild?.goal || '');
  const [buildNextStep, setBuildNextStep] = useState(activeBuild?.nextStep || '');

  // Add Idea inline
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaType, setIdeaType] = useState('Product Idea');
  const [ideaNotes, setIdeaNotes] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setActiveBuild(dataService.getActiveBuild());
      setMissions(dataService.getMissions());
      setIdeas(dataService.getIdeaVault());
      setScratchpad(dataService.getScratchpad());
      setSessions(dataService.getSessions());
    };
    window.addEventListener('kaiser_os_update', handleUpdate);
    return () => window.removeEventListener('kaiser_os_update', handleUpdate);
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            soundEngine.playBell(528);
            dataService.logSession(timerMins, timerTarget);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMins, timerTarget]);

  const toggleMission = (id) => {
    soundEngine.playPop();
    dataService.toggleMission(id);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    soundEngine.playPop();
    dataService.addMission(commandInput.trim(), commandCategory, 'Active');
    setCommandInput('');
  };

  const handleSaveBuild = (e) => {
    e.preventDefault();
    soundEngine.playPop();
    dataService.updateActiveBuild({
      name: buildName,
      goal: buildGoal,
      nextStep: buildNextStep
    });
    setIsEditingBuild(false);
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

  const handleScratchpadChange = (e) => {
    const val = e.target.value;
    setScratchpad(val);
    dataService.saveScratchpad(val);
  };

  const startTimerFor = (label, mins = 45) => {
    setTimerTarget(label);
    setTimerMins(mins);
    setTimerSecondsLeft(mins * 60);
    setIsTimerRunning(true);
    soundEngine.playPop();
  };

  const todayMinutes = sessions
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((acc, s) => acc + (s.minutes || 0), 0);

  const completedMissions = missions.filter(m => m.completed).length;

  const displayMins = Math.floor(timerSecondsLeft / 60);
  const displaySecs = timerSecondsLeft % 60;

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* ── RAYCAST-STYLE COMMAND BAR ──────────────────────────────── */}
      <form onSubmit={handleCommandSubmit} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
          <Terminal className="w-4 h-4 text-emerald-400" />
        </div>
        <input
          ref={commandInputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="⌘ Quick Command // Log today's mission, problem set, or build target (Press Enter)..."
          className="w-full h-12 pl-11 pr-36 bg-[#0e1013] border border-white/[0.08] hover:border-white/[0.16] focus:border-emerald-500/50 rounded-2xl text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] font-mono"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.08] rounded">
            ⌘K
          </kbd>
          <select
            value={commandCategory}
            onChange={(e) => setCommandCategory(e.target.value)}
            className="bg-[#15181d] border border-white/[0.08] text-zinc-400 text-[10px] font-mono rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="Build">Build</option>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </form>

      {/* ── BENTO GRID ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ── LEFT COLUMN (7 COLS): ACTIVE FORGE & TODAY'S MISSIONS ─── */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card A: The Active Shipping Forge */}
          <div className="linear-panel p-6 space-y-4 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent opacity-80" />

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-400 tracking-wider uppercase font-semibold text-[11px]">
                  ACTIVE SHIPPING FORGE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px]">
                  {activeBuild.status}
                </span>
                <button
                  onClick={() => {
                    setBuildName(activeBuild.name);
                    setBuildGoal(activeBuild.goal);
                    setBuildNextStep(activeBuild.nextStep);
                    setIsEditingBuild(!isEditingBuild);
                  }}
                  className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                  title="Configure project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isEditingBuild ? (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {activeBuild.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mt-1">
                    <span>Repo: {activeBuild.repo}</span>
                    <span>•</span>
                    <span>{activeBuild.type}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  <span className="text-zinc-300 font-semibold">Anti-Shiny-Object Target: </span>
                  {activeBuild.goal}
                </p>

                {/* Immediate Next Action Card */}
                <div className="p-3.5 rounded-xl bg-[#15181d] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
                      Next Step to Ship:
                    </span>
                    <span className="text-xs text-zinc-200 truncate block mt-0.5">
                      {activeBuild.nextStep}
                    </span>
                  </div>

                  <button
                    onClick={() => startTimerFor(`Ship: ${activeBuild.nextStep}`, 50)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Build Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveBuild} className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Project Name</label>
                  <input
                    type="text"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    className="w-full h-8 px-2.5 bg-[#15181d] border border-white/[0.08] rounded-lg text-xs text-white mt-1 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Goal (Real users / validation)</label>
                  <input
                    type="text"
                    value={buildGoal}
                    onChange={(e) => setBuildGoal(e.target.value)}
                    className="w-full h-8 px-2.5 bg-[#15181d] border border-white/[0.08] rounded-lg text-xs text-white mt-1 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Next Immediate Step</label>
                  <input
                    type="text"
                    value={buildNextStep}
                    onChange={(e) => setBuildNextStep(e.target.value)}
                    className="w-full h-8 px-2.5 bg-[#15181d] border border-white/[0.08] rounded-lg text-xs text-white mt-1 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingBuild(false)}
                    className="px-3 py-1 text-zinc-500 hover:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-emerald-500 text-black font-semibold rounded-lg"
                  >
                    Save Target
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card B: Today's Missions Matrix */}
          <div className="linear-panel p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">
                  TODAY'S BATTLE MISSIONS
                </span>
              </div>
              <span className="text-zinc-500 text-[11px]">
                {completedMissions} of {missions.length} complete
              </span>
            </div>

            <div className="space-y-2">
              {missions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMission(m.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    m.completed
                      ? 'bg-white/[0.01] border-white/[0.04] text-zinc-500'
                      : 'bg-[#15181d] border-white/[0.08] hover:border-white/[0.16] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      m.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-black' 
                        : 'border-zinc-600 group-hover:border-zinc-400'
                    }`}>
                      {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className={`text-xs sm:text-sm font-medium truncate ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                        {m.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                          m.category === 'Academic' ? 'bg-blue-500/10 text-blue-400' :
                          m.category === 'Build' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-amber-500/10 text-amber-400'
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
                        onClick={(e) => {
                          e.stopPropagation();
                          startTimerFor(m.title, 45);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                        title="Lock in on this mission"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dataService.deleteMission(m.id);
                      }}
                      className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (5 COLS): LOCK-IN TIMER & VAULT ─────────── */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card C: The Lock-In HUD (Mini Timer) */}
          <div className="linear-panel p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">
                  LOCK-IN HUD // FLOW SESSION
                </span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">
                {todayMinutes}m logged
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#15181d] border border-white/[0.06] text-center space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                {timerTarget}
              </div>
              
              <div className="text-5xl font-mono font-light tracking-tight text-white tabular-nums">
                {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
              </div>

              {/* Presets */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[25, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerMins(m);
                      setTimerSecondsLeft(m * 60);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all ${
                      timerMins === m 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(timerMins * 60);
                  }}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Lock-In'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card D: Idea Vault & Flame Lore */}
          <div className="linear-panel p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">
                  IDEA VAULT & FLAME LORE ({ideas.length})
                </span>
              </div>
              <button
                onClick={() => setShowAddIdea(!showAddIdea)}
                className="text-[10px] text-emerald-400 hover:underline font-mono"
              >
                + New Idea
              </button>
            </div>

            {showAddIdea && (
              <form onSubmit={handleAddIdea} className="p-3 bg-[#15181d] border border-white/[0.08] rounded-xl space-y-2 text-xs animate-fadeIn">
                <input
                  type="text"
                  placeholder="Idea or story title..."
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full h-7 px-2 bg-black/40 border border-white/[0.08] rounded text-white text-xs"
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Notes, pinouts, or lore..."
                  value={ideaNotes}
                  onChange={(e) => setIdeaNotes(e.target.value)}
                  className="w-full p-2 bg-black/40 border border-white/[0.08] rounded text-white text-xs font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddIdea(false)} className="text-zinc-500 text-[10px]">Cancel</button>
                  <button type="submit" className="px-2.5 py-1 bg-emerald-500 text-black rounded text-[10px] font-bold">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-3 rounded-xl bg-[#15181d] border border-white/[0.06] space-y-1 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">
                      {idea.type}
                    </span>
                    <button
                      onClick={() => dataService.deleteIdea(idea.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-semibold text-xs text-zinc-200">
                    {idea.title}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {idea.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card E: Live Scratchpad */}
          <div className="linear-panel p-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-semibold text-[11px] uppercase flex items-center gap-1.5">
                <Edit3 className="w-3 h-3 text-emerald-400" />
                KAISER SCRATCHPAD
              </span>
              <span className="text-[10px] text-zinc-600">Auto-saves live</span>
            </div>
            <textarea
              rows={4}
              value={scratchpad}
              onChange={handleScratchpadChange}
              placeholder="Fast scratchpad for math equations, ESP32 pinouts, or quick thoughts..."
              className="w-full text-xs font-mono text-zinc-300 bg-[#15181d] border border-white/[0.06] rounded-xl p-3 focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed placeholder:text-zinc-600"
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
