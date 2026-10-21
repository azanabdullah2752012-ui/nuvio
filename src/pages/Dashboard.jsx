import React, { useState, useEffect } from 'react';
import { 
  Target, BookOpen, Clock, CheckCircle2,
  Calendar as CalendarIcon, ArrowRight, Plus,
  Check, BookMarked, Library
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [tasks, setTasks] = useState([]);
  const [decks, setDecks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [taskList, deckList] = await Promise.all([
      dataService.list('tasks'),
      dataService.list('decks')
    ]);
    setTasks(taskList || []);
    setDecks(deckList || []);
    setLoading(false);
  };

  const handleToggleTask = async (id, currentStatus) => {
    await dataService.update('tasks', id, { completed: !currentStatus });
    loadData();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await dataService.create('tasks', {
      title: newTaskTitle.trim(),
      subject: 'General',
      due: 'Today',
      priority: 'Medium',
      completed: false
    });
    setNewTaskTitle('');
    loadData();
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-8 font-mono text-left">
      
      {/* ── WORKSTATION HEADER ───────────────────────────────────── */}
      <div className="p-6 md:p-8 border border-white/10 bg-[#111318] rounded-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-brand-vermilion font-bold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-vermilion" />
            ACADEMIC COMMAND // CLASS 9 CBSE
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Welcome back, {user?.full_name || 'Scholar'}.
          </h1>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            Here is your current study itinerary and syllabus review queue for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/focus-timer')}
            className="nv-btn-primary"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>START 25M FOCUS</span>
          </button>
        </div>
      </div>

      {/* ── QUICK METRICS STRIP ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 border border-white/10 bg-[#111318] rounded-lg">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">TASKS PENDING</div>
          <div className="text-2xl font-bold font-display text-white">{pendingTasks.length}</div>
          <div className="text-[10px] text-text-muted mt-1">{completedTasks.length} completed today</div>
        </div>

        <div className="p-4 border border-white/10 bg-[#111318] rounded-lg">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">FLASHCARD DECKS</div>
          <div className="text-2xl font-bold font-display text-white">{decks.length}</div>
          <div className="text-[10px] text-text-muted mt-1">Spaced retrieval active</div>
        </div>

        <div className="p-4 border border-white/10 bg-[#111318] rounded-lg">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">SYLLABUS COVERAGE</div>
          <div className="text-2xl font-bold font-display text-emerald-400">100%</div>
          <div className="text-[10px] text-text-muted mt-1">NCERT Class 9 Matrix</div>
        </div>

        <div className="p-4 border border-white/10 bg-[#111318] rounded-lg">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">ENGINE STATUS</div>
          <div className="text-2xl font-bold font-display text-brand-vermilion">OFFLINE</div>
          <div className="text-[10px] text-text-muted mt-1">Local persistence verified</div>
        </div>
      </div>

      {/* ── CORE WORKSTATION COLUMNS ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tasks & Assignments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-white/10 bg-[#111318] rounded-xl p-5">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-vermilion" />
                <h3 className="font-display font-bold text-base text-white">Study Tasks & Assignments</h3>
              </div>
              <button
                onClick={() => navigate('/homework')}
                className="text-[11px] text-text-muted hover:text-white transition-colors flex items-center gap-1"
              >
                <span>OPEN PLANNER</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Inline Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add academic objective..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-brand-vermilion"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            </form>

            {/* Task Item List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-text-muted">
                  No active study tasks. Add an objective above.
                </div>
              ) : (
                tasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="p-3 border border-white/[0.06] hover:border-white/15 bg-white/[0.01] rounded flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'
                      }`}>
                        {task.completed && <Check className="w-3 h-3" />}
                      </div>
                      <span className={`text-xs truncate font-sans ${task.completed ? 'line-through text-text-muted' : 'text-white'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-text-muted border border-white/5">
                        {task.subject}
                      </span>
                      <span className="text-text-muted">{task.due}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Flashcard Decks & Fast Subject Jumps */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Recall Decks */}
          <div className="border border-white/10 bg-[#111318] rounded-xl p-5">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-blue-400" />
                <h3 className="font-display font-bold text-base text-white">Active Flashcards</h3>
              </div>
              <button
                onClick={() => navigate('/flashcards')}
                className="text-[11px] text-text-muted hover:text-white transition-colors flex items-center gap-1"
              >
                <span>ALL DECKS</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {decks.slice(0, 3).map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => navigate('/flashcards')}
                  className="p-3 border border-white/[0.06] hover:border-white/20 bg-white/[0.01] rounded flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">{deck.title}</h4>
                    <span className="text-[10px] text-text-muted">{deck.cards?.length || 0} recall cards · {deck.subject}</span>
                  </div>
                  <button className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white rounded border border-white/10">
                    REVIEW
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Curriculum Navigation */}
          <div className="border border-white/10 bg-[#111318] rounded-xl p-5">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-white">Curriculum Vaults</h3>
              </div>
              <button
                onClick={() => navigate('/curriculum')}
                className="text-[11px] text-text-muted hover:text-white transition-colors flex items-center gap-1"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-white/10 hover:border-brand-vermilion rounded bg-white/[0.02] text-left transition-colors"
              >
                <div className="text-[9px] text-brand-vermilion font-bold">CBSE-M9</div>
                <div className="text-xs font-bold text-white mt-1">Math</div>
                <div className="text-[9px] text-text-muted mt-0.5">15 Units</div>
              </button>

              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-white/10 hover:border-blue-400 rounded bg-white/[0.02] text-left transition-colors"
              >
                <div className="text-[9px] text-blue-400 font-bold">CBSE-S9</div>
                <div className="text-xs font-bold text-white mt-1">Science</div>
                <div className="text-[9px] text-text-muted mt-0.5">15 Units</div>
              </button>

              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-white/10 hover:border-amber-400 rounded bg-white/[0.02] text-left transition-colors"
              >
                <div className="text-[9px] text-amber-400 font-bold">CBSE-SS9</div>
                <div className="text-xs font-bold text-white mt-1">Social</div>
                <div className="text-[9px] text-text-muted mt-0.5">20 Units</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
