import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Clock, 
  Trash2, Filter, AlertCircle, 
  Check, Calendar, BookOpen, ChevronRight,
  ListFilter, Target, Star, Compass, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService, PILLARS, ENERGY_LEVELS } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const Homework = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'completed' | 'all'
  const [filterPillar, setFilterPillar] = useState('All');
  
  // New task input state
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState('Craft');
  const [energy, setEnergy] = useState('Deep 90m');
  const [due, setDue] = useState('Today');
  const [priority, setPriority] = useState('Medium');
  const [isHighlight, setIsHighlight] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const list = await dataService.list('tasks');
      if (list && Array.isArray(list)) {
        setTasks(list);
      }
    } catch (err) {
      console.warn("Tasks sync delayed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      pillar: pillar,
      energy: energy,
      due: due,
      priority: priority,
      isHighlight: isHighlight,
      completed: false
    };

    try {
      const created = await dataService.create('tasks', newTask);
      if (isHighlight) {
        await dataService.setHighlight(created.id);
      }
      setTasks(prev => [created, ...prev]);
      setTitle('');
      setIsHighlight(false);
      setShowForm(false);
      notificationService.send("Directive Registered", `Logged under ${pillar} (${energy}).`, "success");
    } catch (err) {
      notificationService.send("Registration Error", "Could not commit directive to local store.", "error");
    }
  };

  const handleToggleTask = async (task) => {
    const updatedStatus = !task.completed;
    try {
      await dataService.update('tasks', task.id, { completed: updatedStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: updatedStatus } : t));
      if (updatedStatus) {
        notificationService.send("Directive Concluded", `Action item marked complete.`, "info");
      }
    } catch (err) {
      console.warn("Could not toggle task status:", err);
    }
  };

  const handleSetHighlight = async (id) => {
    await dataService.setHighlight(id);
    setTasks(tasks.map(t => ({ ...t, isHighlight: t.id === id })));
    notificationService.send("Anchor Locked", "Selected as today's #1 Daily Highlight.", "success");
  };

  const handleDeleteTask = async (id) => {
    try {
      await dataService.delete('tasks', id);
      setTasks(tasks.filter(t => t.id !== id));
      notificationService.send("Directive Removed", "Excised from action registry.", "info");
    } catch (err) {
      console.warn("Could not delete task:", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? task.completed : !task.completed;
    
    const matchesPillar = 
      filterPillar === 'All' ? true : (task.pillar || 'Craft') === filterPillar;

    return matchesStatus && matchesPillar;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Life Directives // Action Desk
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Action Registry & Pillars
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            A single, unfragmented action desk organized by the 4 life pillars: Craft, Vitality, Mind, and Tribe.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)] self-start md:self-end"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Input' : 'Add Directive'}</span>
        </button>
      </header>

      {/* ── QUICK DIRECTIVE CREATOR ─────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-[0_4px_20px_rgba(27,59,43,0.04)] space-y-4 overflow-hidden"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#1b3b2b] font-bold block">
              Log New Action Item
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <input
                  type="text"
                  placeholder="Directive title (e.g., Code API endpoints, 5km run, read 20 pages)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-sm focus:outline-none focus:border-[#1b3b2b]"
                  autoFocus
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value)}
                  className="w-full px-3 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-mono"
                >
                  {PILLARS.map(p => (
                    <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  className="w-full px-3 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-mono"
                >
                  {ENERGY_LEVELS.map(el => (
                    <option key={el.id} value={el.id}>{el.badge}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#f4f1ea]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isHighlight}
                  onChange={(e) => setIsHighlight(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1b3b2b] border-[#e5e1d5] focus:ring-0"
                />
                <span className="text-xs font-serif text-[#1a1917]">
                  Lock as Today's #1 Daily Highlight (Anchor)
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-[#e5e1d5] rounded-lg text-xs font-mono text-[#827f76] hover:text-[#1a1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Directive
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── FILTER & METRICS BAR ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e1d5] pb-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4f1ea] rounded-xl border border-[#e0dcce] self-start font-mono text-xs">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'pending' ? 'bg-white text-[#1a1917] shadow-xs' : 'text-[#827f76] hover:text-[#1a1917]'
            }`}
          >
            ACTIVE ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'completed' ? 'bg-white text-[#1a1917] shadow-xs' : 'text-[#827f76] hover:text-[#1a1917]'
            }`}
          >
            CONCLUDED ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'all' ? 'bg-white text-[#1a1917] shadow-xs' : 'text-[#827f76] hover:text-[#1a1917]'
            }`}
          >
            ALL ({tasks.length})
          </button>
        </div>

        {/* Pillar Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterPillar('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
              filterPillar === 'All' ? 'bg-[#1b3b2b] text-white' : 'text-[#827f76] hover:bg-[#f4f1ea]'
            }`}
          >
            ALL
          </button>
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => setFilterPillar(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1 shrink-0 ${
                filterPillar === p.id ? 'bg-[#1b3b2b] text-white' : 'text-[#827f76] hover:bg-[#f4f1ea]'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── DIRECTIVES LIST ─────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#e5e1d5] rounded-2xl bg-white space-y-2">
            <div className="font-serif text-base text-[#1a1917] font-bold">No directives found</div>
            <p className="text-xs text-[#827f76] font-mono">
              Adjust filters or register your next high-leverage objective above.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-base font-serif font-medium text-[#1a1917] truncate ${task.completed ? 'line-through text-[#827f76]' : ''}`}>
                      {task.title}
                    </span>
                    {task.isHighlight && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f4f7f4] text-[#1b3b2b] border border-[#1b3b2b]/20 font-bold uppercase flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Anchor Highlight
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#827f76] mt-1">
                    <span className="text-[#1a1917] font-bold">{task.pillar || 'Craft'}</span>
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
                    title="Lock as Today's Highlight"
                  >
                    <Star className="w-3 h-3" />
                    <span>Set Highlight</span>
                  </button>
                )}

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 text-[#827f76] hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                  title="Delete directive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Homework;
