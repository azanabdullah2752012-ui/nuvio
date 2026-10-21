import React, { useState, useEffect } from 'react';
import { 
  Star, Plus, Check, Play, Moon, 
  Trash2, Sparkles, Volume2, ArrowRight, 
  Smile, Flame, BookOpen, Clock, Edit3, X
} from 'lucide-react';
import { format } from 'date-fns';
import { dataService } from '../services/dataService';
import { soundEngine } from '../services/soundEngine';
import ZenFocusOverlay from '../components/ZenFocusOverlay';
import EveningCloseModal from '../components/EveningCloseModal';

const TAGS = ['Deep Work', 'Quick', 'Health', 'Personal'];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [scratchpad, setScratchpad] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Deep Work');
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState('');
  const [showScratchpad, setShowScratchpad] = useState(false);

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('nuvio_update', handleUpdate);
    return () => window.removeEventListener('nuvio_update', handleUpdate);
  }, []);

  const loadAll = () => {
    setTasks(dataService.getTasks());
    setHabits(dataService.getHabits());
    setScratchpad(dataService.getScratchpad());
  };

  const handleToggleTask = (task) => {
    soundEngine.playPop();
    dataService.toggleTask(task.id);
    loadAll();
  };

  const handleToggleHabit = (id) => {
    soundEngine.playPop();
    dataService.toggleHabit(id);
    loadAll();
  };

  const handleSetHighlight = (id) => {
    soundEngine.playPop();
    dataService.setHighlight(id);
    loadAll();
  };

  const handleDeleteTask = (id, e) => {
    e.stopPropagation();
    dataService.deleteTask(id);
    loadAll();
  };

  const handleAddTask = (e) => {
    e?.preventDefault();
    if (!newTitle.trim()) return;
    soundEngine.playPop();
    dataService.addTask(newTitle.trim(), newTag, false, 'today');
    setNewTitle('');
    loadAll();
  };

  const handleStartZenForTask = (title) => {
    setActiveFocusTask(title);
    setIsZenOpen(true);
  };

  const handleSaveScratchpad = (e) => {
    const text = e.target.value;
    setScratchpad(text);
    dataService.saveScratchpad(text);
  };

  // Find today's highlight
  const highlightTask = tasks.find(t => t.isHighlight) || tasks[0];
  const regularTasks = tasks.filter(t => t.id !== highlightTask?.id);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-36 pt-4 px-4 sm:px-6 font-sans text-left selection:bg-[#1b3b2b] selection:text-white">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="flex items-end justify-between border-b border-[#eceae3] pb-6">
        <div className="space-y-1">
          <div className="text-xs font-mono tracking-wider uppercase text-[#8e8d8a]">
            {format(new Date(), 'EEEE, MMMM d')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1d1d1f] tracking-tight">
            Today
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Zen Trigger */}
          <button
            onClick={() => handleStartZenForTask(highlightTask?.title || '')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e8e6df] hover:border-[#1b3b2b] text-[#1d1d1f] text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
            title="Open distraction-free Zen focus"
          >
            <Clock className="w-3.5 h-3.5 text-[#1b3b2b]" />
            <span className="hidden sm:inline">Zen Mode</span>
          </button>

          {/* Evening Close Trigger */}
          <button
            onClick={() => setIsCloseOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#f4f3ef] hover:bg-[#eae8e1] text-[#1d1d1f] text-xs font-medium transition-all flex items-center gap-1.5"
            title="20-Second Evening Close"
          >
            <Moon className="w-3.5 h-3.5 text-[#545350]" />
            <span className="hidden sm:inline">Close Day</span>
          </button>
        </div>
      </header>

      {/* ── THE BIG ONE (Daily Anchor Task) ─────────────────────────── */}
      {highlightTask && (
        <div className="p-6 rounded-3xl bg-white border border-[#e5e3db] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 relative overflow-hidden transition-all hover:border-[#1b3b2b]/40">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8e8d8a]">
            <span className="flex items-center gap-1.5 text-[#1b3b2b] font-bold">
              <Star className="w-3 h-3 fill-current text-[#c78216]" />
              The Big One
            </span>
            <span>Anchor Priority</span>
          </div>

          <div className="flex items-start gap-3.5 pt-1">
            {/* Custom Circular Checkbox (Things 3 feel) */}
            <button
              onClick={() => handleToggleTask(highlightTask)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                highlightTask.completed
                  ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white shadow-xs'
                  : 'border-[#c7c5bc] hover:border-[#1b3b2b]'
              }`}
            >
              {highlightTask.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className={`text-lg sm:text-xl font-serif text-[#1d1d1f] font-medium leading-snug ${
                highlightTask.completed ? 'line-through text-[#8e8d8a]' : ''
              }`}>
                {highlightTask.title}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => handleStartZenForTask(highlightTask.title)}
                  className="px-3 py-1.5 rounded-lg bg-[#f4f3ef] hover:bg-[#1b3b2b] hover:text-white text-[#1d1d1f] text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Focus on This</span>
                </button>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#f7f6f2] text-[#8e8d8a]">
                  {highlightTask.tag || 'Deep Work'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DAILY ANCHORS (Habit Loops) ─────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8d8a] font-bold">
            Daily Anchors
          </span>
          <span className="text-[11px] text-[#8e8d8a] font-mono">
            {habits.filter(h => h.completedToday).length} / {habits.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => handleToggleHabit(habit.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                habit.completedToday
                  ? 'bg-[#f4f7f4] border-[#1b3b2b]/30 text-[#1b3b2b] shadow-xs'
                  : 'bg-white border-[#e8e6df] text-[#545350] hover:border-[#1d1d1f]/40'
              }`}
            >
              <div className="flex items-center justify-between text-base mb-1">
                <span>{habit.emoji}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  habit.completedToday ? 'bg-[#1b3b2b] text-white' : 'bg-[#f0eee6] text-[#8e8d8a]'
                }`}>
                  {habit.streak}d
                </span>
              </div>
              <div className="text-xs font-medium truncate mt-1">
                {habit.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── INLINE ACTION CREATOR (Zero friction) ─────────────────────── */}
      <form onSubmit={handleAddTask} className="p-3.5 bg-white border border-[#e8e6df] rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-dashed border-[#c7c5bc] flex items-center justify-center shrink-0">
            <Plus className="w-3 h-3 text-[#8e8d8a]" />
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add an action for today (press Enter)..."
            className="w-full text-sm font-sans text-[#1d1d1f] placeholder:text-[#a09e97] focus:outline-none bg-transparent"
          />
        </div>

        {newTitle.trim() && (
          <div className="flex items-center justify-between pt-2 border-t border-[#f4f3ef] text-xs">
            <div className="flex items-center gap-1.5">
              {TAGS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setNewTag(t)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                    newTag === t ? 'bg-[#1b3b2b] text-white' : 'bg-[#f4f3ef] text-[#8e8d8a]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-3 py-1 bg-[#1b3b2b] text-white rounded-lg text-xs font-medium shadow-xs"
            >
              Add
            </button>
          </div>
        )}
      </form>

      {/* ── TODAY'S ACTIONS LIST ─────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8d8a] font-bold">
            Actions
          </span>
          <span className="text-[11px] text-[#8e8d8a] font-mono">
            {completedCount} completed
          </span>
        </div>

        {regularTasks.length === 0 ? (
          <div className="py-12 text-center text-[#a09e97] text-xs font-serif">
            Your list is clear. Add what matters today or focus on your Big One.
          </div>
        ) : (
          <div className="divide-y divide-[#f0eee6] bg-white border border-[#e8e6df] rounded-2xl shadow-xs overflow-hidden">
            {regularTasks.map((task) => (
              <div
                key={task.id}
                className="group p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      task.completed
                        ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white'
                        : 'border-[#c7c5bc] group-hover:border-[#1b3b2b]'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>

                  <span className={`text-sm text-[#1d1d1f] font-serif truncate ${
                    task.completed ? 'line-through text-[#a09e97]' : ''
                  }`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f3ef] text-[#8e8d8a] hidden sm:inline">
                    {task.tag || 'General'}
                  </span>

                  {/* Make Highlight Button */}
                  {!task.completed && (
                    <button
                      onClick={() => handleSetHighlight(task.id)}
                      className="p-1.5 text-[#c7c5bc] hover:text-[#c78216] transition-colors"
                      title="Set as The Big One"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Jump into Focus */}
                  <button
                    onClick={() => handleStartZenForTask(task.title)}
                    className="p-1.5 text-[#c7c5bc] hover:text-[#1b3b2b] transition-colors"
                    title="Focus on this"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    className="p-1.5 text-[#c7c5bc] hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete action"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SCRATCHPAD / BRAIN DUMP (Zero-friction notes) ────────────── */}
      <div className="pt-2">
        <button
          onClick={() => setShowScratchpad(!showScratchpad)}
          className="flex items-center gap-1.5 text-xs font-mono text-[#8e8d8a] hover:text-[#1d1d1f] transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{showScratchpad ? 'Hide Scratchpad' : 'Open Scratchpad (Brain Dump)'}</span>
        </button>

        {showScratchpad && (
          <div className="mt-3 p-4 bg-white border border-[#e8e6df] rounded-2xl shadow-xs space-y-2 animate-fadeIn">
            <div className="text-[10px] font-mono uppercase text-[#8e8d8a] tracking-wider">
              Scratchpad (Auto-saves continuously)
            </div>
            <textarea
              rows={5}
              value={scratchpad}
              onChange={handleSaveScratchpad}
              placeholder="Dump links, fleeting ideas, notes, or things to deal with later..."
              className="w-full text-xs font-mono text-[#1d1d1f] bg-transparent focus:outline-none resize-none leading-relaxed placeholder:text-[#a09e97]"
            />
          </div>
        )}
      </div>

      {/* ── ZEN FOCUS OVERLAY ───────────────────────────────────────── */}
      <ZenFocusOverlay
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        taskTitle={activeFocusTask}
        onCompleteSession={() => loadAll()}
      />

      {/* ── 20-SECOND EVENING CLOSE MODAL ───────────────────────────── */}
      <EveningCloseModal
        isOpen={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
        highlightTask={highlightTask}
        onComplete={() => loadAll()}
      />

    </div>
  );
};

export default Dashboard;
