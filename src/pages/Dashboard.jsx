import React, { useState, useEffect } from 'react';
import { 
  Target, Clock, CheckCircle2,
  ArrowRight, Plus, Check, Timer, 
  Moon, Sun, Zap, Compass, Star, ChevronRight,
  Volume2, Wind, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { authService } from '../services/authService';
import { dataService, PILLARS, ENERGY_LEVELS } from '../services/dataService';
import { soundEngine } from '../services/soundEngine';
import EveningShutdownModal from '../components/EveningShutdownModal';
import BreathPacer from '../components/BreathPacer';

const getCircadianPhase = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) {
    return {
      phase: 'Phase 1: Circadian Anchor & Input',
      icon: '🌅',
      guidance: 'Get 15m natural sunlight, hydrate with 500ml water. Delay caffeine 90m to clear adenosine.',
      theme: 'border-[#d4c39e] bg-[#fbf8f0]'
    };
  }
  if (hour >= 9 && hour < 13) {
    return {
      phase: 'Phase 2: The Maker Peak Block',
      icon: '⚡',
      guidance: 'Peak cognitive window. Run your 90-minute Ultradian Bout on your Daily Highlight with 40Hz audio.',
      theme: 'border-[#1b3b2b]/30 bg-[#f4f7f4]'
    };
  }
  if (hour >= 13 && hour < 15) {
    return {
      phase: 'Phase 3: Fuel & Physical Reset',
      icon: '🥗',
      guidance: 'Nutrient-dense food, light movement or walk. Rest cognitive load to avoid the post-lunch dip.',
      theme: 'border-[#e5e1d5] bg-white'
    };
  }
  if (hour >= 15 && hour < 18) {
    return {
      phase: 'Phase 4: Shallow Logistics Window',
      icon: '🌿',
      guidance: 'Handle communication, admin, planning, and secondary chores. Protect tomorrow\'s focus.',
      theme: 'border-[#e5e1d5] bg-[#faf9f5]'
    };
  }
  return {
    phase: 'Phase 5: Evening Restoration & Shutdown',
    icon: '🌙',
    guidance: 'Dim overhead lights. Run the 60s Cal Newport Shutdown Ritual to unburden your mind.',
    theme: 'border-[#3a354c]/30 bg-[#f6f5f9]'
  };
};

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pillarFilter, setPillarFilter] = useState('All');
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [isBreathPacerOpen, setIsBreathPacerOpen] = useState(false);
  const [activeSound, setActiveSound] = useState('none'); // 'none' | 'binaural' | 'brown'
  
  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newPillar, setNewPillar] = useState('Craft');
  const [newEnergy, setNewEnergy] = useState('Deep 90m');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();
  const circadian = getCircadianPhase();

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('nuvio_data_update', handleUpdate);
    return () => {
      window.removeEventListener('nuvio_data_update', handleUpdate);
      soundEngine.stop();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskList, sessionList] = await Promise.all([
        dataService.list('tasks'),
        dataService.list('focus_sessions')
      ]);
      setTasks(taskList || []);
      setFocusSessions(sessionList || []);
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSound = (mode) => {
    if (activeSound === mode) {
      soundEngine.stop();
      setActiveSound('none');
    } else {
      if (mode === 'binaural') {
        soundEngine.play40HzBinaural(0.08);
      } else {
        soundEngine.playBrownNoise(0.05);
      }
      setActiveSound(mode);
    }
  };

  const handleToggleTask = async (task) => {
    const updated = !task.completed;
    await dataService.update('tasks', task.id, { completed: updated });
    soundEngine.playBell(updated ? 660 : 440);
    loadData();
  };

  const handleSetHighlight = async (taskId) => {
    await dataService.setHighlight(taskId);
    soundEngine.playBell(528);
    loadData();
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await dataService.create('tasks', {
      title: newTitle.trim(),
      pillar: newPillar,
      energy: newEnergy,
      due: 'Today',
      priority: 'Medium',
      isHighlight: tasks.length === 0,
      completed: false
    });

    setNewTitle('');
    setIsFormOpen(false);
    loadData();
  };

  // Find today's daily highlight
  const dailyHighlight = tasks.find(t => t.isHighlight && !t.completed) || tasks.find(t => t.isHighlight) || tasks[0];

  // Pillar statistics (Pillar Balance Compass)
  const pillarStats = PILLARS.map(p => {
    const pTasks = tasks.filter(t => (t.pillar || 'Craft') === p.id);
    const completed = pTasks.filter(t => t.completed).length;
    return {
      ...p,
      total: pTasks.length,
      completed,
      pct: pTasks.length > 0 ? Math.round((completed / pTasks.length) * 100) : 0
    };
  });

  const filteredTasks = tasks.filter(t => {
    if (pillarFilter === 'All') return true;
    return (t.pillar || 'Craft') === pillarFilter;
  });

  // Hormozi's Rule of 100: Total deep focus minutes today
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayFocusMinutes = focusSessions
    .filter(s => (s.completed_at || s.created_at || '').substring(0, 10) === todayStr)
    .reduce((acc, s) => acc + (s.duration_minutes || 25), 0);
  
  const ruleOf100Percent = Math.min(100, Math.round((todayFocusMinutes / 100) * 100));

  return (
    <div className="space-y-8 font-sans text-left pb-24 max-w-6xl mx-auto">
      
      {/* ── MASTHEAD & CIRCADIAN BANNER ───────────────────────────── */}
      <div className="p-6 sm:p-8 border border-[#e5e1d5] bg-white rounded-3xl shadow-[0_4px_24px_rgba(27,59,43,0.04)] space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#f0ece1] pb-6">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#1b3b2b] font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
              UNIVERSAL LIFE OPERATING SYSTEM // {format(new Date(), 'EEEE, d MMMM yyyy').toUpperCase()}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1917] tracking-tight">
              Daily Compass // {user?.full_name || 'Navigator'}
            </h1>
            <p className="text-xs sm:text-sm text-[#52504a] max-w-xl leading-relaxed">
              Ground your daily output in biological rhythms: 90-minute deep work cycles, 4-pillar balance, and the Cal Newport 60-second shutdown.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Live 40Hz Audio Machine Switcher */}
            <button
              onClick={() => handleToggleSound('binaural')}
              className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                activeSound === 'binaural'
                  ? 'bg-[#1b3b2b] text-white shadow-xs'
                  : 'bg-white border border-[#e5e1d5] text-[#52504a] hover:border-[#1b3b2b]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{activeSound === 'binaural' ? '40Hz Gamma Active' : '40Hz Beats'}</span>
            </button>

            {/* NSDR Physiological Sigh Pacer */}
            <button
              onClick={() => setIsBreathPacerOpen(true)}
              className="px-3.5 py-2.5 border border-[#e5e1d5] hover:border-[#244e6b] bg-white text-[#52504a] font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Wind className="w-4 h-4 text-[#244e6b]" />
              <span>NSDR Pacer</span>
            </button>

            {/* Newport Shutdown */}
            <button
              onClick={() => setIsShutdownOpen(true)}
              className="px-4 py-2.5 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-[#faf9f6] text-[#1a1917] font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Moon className="w-3.5 h-3.5 text-[#52504a]" />
              <span>Shutdown</span>
            </button>
          </div>
        </div>

        {/* Live Circadian Phase Alert */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${circadian.theme}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{circadian.icon}</span>
            <div>
              <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1a1917]">
                {circadian.phase}
              </div>
              <div className="text-xs text-[#52504a] mt-0.5">
                {circadian.guidance}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/circadian')}
            className="px-3 py-1.5 bg-white border border-[#e5e1d5] rounded-lg text-xs font-mono font-bold text-[#1b3b2b] hover:bg-[#faf9f6] transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>View 24h Stream</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ── THE RULE OF 100 (Alex Hormozi Protocol) ─────────────────── */}
      <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8a4b16] font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Alex Hormozi's Rule of 100</span>
          </div>
          <h3 className="font-serif font-bold text-base text-[#1a1917]">
            Daily 100-Minute High-Leverage Execution Threshold
          </h3>
          <p className="text-xs text-[#52504a]">
            100 minutes of pure, uninterrupted deep craft per day separates high-earning builders from the rest.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="font-serif font-bold text-2xl text-[#1b3b2b]">{todayFocusMinutes} / 100m</div>
            <div className="text-[10px] font-mono text-[#827f76]">{ruleOf100Percent}% Completed Today</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#f0ece1] flex items-center justify-center font-mono text-xs font-bold text-[#1b3b2b] relative">
            <div 
              className="absolute inset-0 rounded-full border-4 border-[#1b3b2b] transition-all duration-700"
              style={{ clipPath: `polygon(0 0, 100% 0, 100% ${ruleOf100Percent}%, 0 ${ruleOf100Percent}%)` }}
            />
            {ruleOf100Percent}%
          </div>
        </div>
      </div>

      {/* ── THE DAILY HIGHLIGHT (Jake Knapp / Ali Abdaal / Hormozi) ── */}
      {dailyHighlight && (
        <div className="p-6 sm:p-7 border-2 border-[#1b3b2b]/25 bg-[#fafbf9] rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#1b3b2b] text-white font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-xl">
            Today's #1 Anchor Highlight
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#827f76]">
                <Star className="w-3.5 h-3.5 text-[#8a4b16] fill-[#8a4b16]" />
                <span>Non-Negotiable Direct Focus</span>
                <span className="text-[#e5e1d5]">|</span>
                <span className="text-[#1b3b2b] font-bold">{dailyHighlight.pillar || 'Craft'}</span>
              </div>
              
              <h2 className={`text-xl sm:text-2xl font-serif font-bold text-[#1a1917] ${dailyHighlight.completed ? 'line-through text-[#827f76]' : ''}`}>
                {dailyHighlight.title}
              </h2>

              <p className="text-xs text-[#52504a]">
                {dailyHighlight.completed 
                  ? '✓ Anchor accomplished. The single most impactful task of your day is finished.'
                  : 'Dedicate your first 90-minute Maker block exclusively to this. Do not switch tabs until finished.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleTask(dailyHighlight)}
                className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center gap-2 ${
                  dailyHighlight.completed 
                    ? 'bg-[#e8f2ec] text-[#1b3b2b] border border-[#1b3b2b]/20' 
                    : 'bg-[#1b3b2b] hover:bg-[#26523c] text-white shadow-sm'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{dailyHighlight.completed ? 'Completed' : 'Mark Done'}</span>
              </button>

              <button
                onClick={() => navigate('/focus-timer')}
                className="p-2.5 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white rounded-xl text-[#52504a] hover:text-[#1a1917]"
                title="Timer for this highlight"
              >
                <Timer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PILLAR BALANCE COMPASS (Dan Koe 4 Pillars / Wheel of Life) ─ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#1b3b2b]" />
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#1a1917]">
              The 4 Life Pillars Compass
            </h3>
          </div>
          <button
            onClick={() => navigate('/wheel')}
            className="text-[11px] font-mono text-[#1b3b2b] font-bold hover:underline flex items-center gap-1"
          >
            <span>Open Interactive Radar</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillarStats.map(p => (
            <div 
              key={p.id}
              onClick={() => setPillarFilter(pillarFilter === p.id ? 'All' : p.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                pillarFilter === p.id 
                  ? 'border-[#1b3b2b] ring-1 ring-[#1b3b2b] shadow-sm' 
                  : 'border-[#e5e1d5] hover:border-[#827f76]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{p.icon}</span>
                <span className="font-mono text-xs font-bold text-[#1a1917]">{p.completed} / {p.total}</span>
              </div>
              <div className="font-serif font-bold text-sm text-[#1a1917]">{p.label}</div>
              <div className="text-[11px] text-[#827f76] line-clamp-1 mt-0.5">{p.desc}</div>

              {/* Progress Bar */}
              <div className="w-full bg-[#f0ece1] h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-[#1b3b2b] transition-all duration-500 rounded-full"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTION DESK (Task Board) ─────────────────────────────────── */}
      <div className="p-6 sm:p-8 border border-[#e5e1d5] bg-white rounded-3xl shadow-sm space-y-6">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ece1] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setPillarFilter('All')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider transition-colors ${
                pillarFilter === 'All' 
                  ? 'bg-[#1b3b2b] text-white' 
                  : 'text-[#827f76] hover:bg-[#f4f1ea] hover:text-[#1a1917]'
              }`}
            >
              ALL DIRECTIVES ({tasks.length})
            </button>
            {PILLARS.map(p => (
              <button
                key={p.id}
                onClick={() => setPillarFilter(p.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5 shrink-0 ${
                  pillarFilter === p.id 
                    ? 'bg-[#1b3b2b] text-white' 
                    : 'text-[#827f76] hover:bg-[#f4f1ea] hover:text-[#1a1917]'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.id.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Cancel' : 'Add Directive'}</span>
          </button>
        </div>

        {/* Quick Add Form Drawer */}
        {isFormOpen && (
          <form onSubmit={handleQuickAdd} className="p-5 border border-[#e5e1d5] bg-[#faf9f6] rounded-2xl space-y-4 animate-fadeIn">
            <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1b3b2b]">
              Register New Life Directive
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Directive title (e.g., Draft newsletter chapter, Run 5km)..."
                  className="w-full px-4 py-2.5 bg-white border border-[#e5e1d5] rounded-xl text-xs font-sans focus:outline-none focus:border-[#1b3b2b]"
                  autoFocus
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={newPillar}
                  onChange={(e) => setNewPillar(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#e5e1d5] rounded-xl text-xs font-mono text-[#1a1917]"
                >
                  {PILLARS.map(p => (
                    <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={newEnergy}
                  onChange={(e) => setNewEnergy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#e5e1d5] rounded-xl text-xs font-mono text-[#1a1917]"
                >
                  {ENERGY_LEVELS.map(el => (
                    <option key={el.id} value={el.id}>{el.badge}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-5 py-2 bg-[#1b3b2b] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg"
              >
                Log Directive
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-[#827f76] font-mono text-xs space-y-2">
              <div>No directives in this pillar yet.</div>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="text-[#1b3b2b] font-bold underline"
              >
                + Add your first task
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                  task.completed 
                    ? 'border-[#f0ece1] bg-[#faf9f5] opacity-65' 
                    : 'border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      task.completed 
                        ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white' 
                        : 'border-[#827f76] hover:border-[#1b3b2b]'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-serif font-medium text-[#1a1917] truncate ${task.completed ? 'line-through text-[#827f76]' : ''}`}>
                        {task.title}
                      </span>
                      {task.isHighlight && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f4f7f4] text-[#1b3b2b] border border-[#1b3b2b]/20 font-bold uppercase">
                          Anchor Highlight
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#827f76] mt-0.5">
                      <span>{task.pillar || 'Craft'}</span>
                      <span>•</span>
                      <span>{task.energy || 'Deep 90m'}</span>
                      <span>•</span>
                      <span>Due: {task.due || 'Today'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!task.isHighlight && !task.completed && (
                    <button
                      onClick={() => handleSetHighlight(task.id)}
                      className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#827f76] hover:text-[#1b3b2b] px-2 py-1 rounded hover:bg-[#f4f1ea]"
                      title="Set as Today's Highlight"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set Highlight</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/focus-timer')}
                    className="p-1.5 text-[#827f76] hover:text-[#1b3b2b] rounded hover:bg-[#f4f1ea]"
                    title="Focus on this"
                  >
                    <Timer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── CAL NEWPORT SHUTDOWN MODAL ──────────────────────────────── */}
      <EveningShutdownModal
        isOpen={isShutdownOpen}
        onClose={() => setIsShutdownOpen(false)}
        tasks={tasks}
        onCompleteShutdown={() => loadData()}
      />

      {/* ── INTERACTIVE BREATH PACER MODAL ──────────────────────────── */}
      {isBreathPacerOpen && (
        <BreathPacer onClose={() => setIsBreathPacerOpen(false)} />
      )}

    </div>
  );
};

export default Dashboard;
