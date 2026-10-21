import React, { useState, useEffect } from 'react';
import { 
  Target, BookOpen, Clock, CheckCircle2,
  Calendar as CalendarIcon, ArrowRight, Plus,
  Check, BookMarked, Library, GraduationCap
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
    <div className="space-y-8 font-sans text-left">
      
      {/* ── ACADEMIC DESK HEADER ───────────────────────────────────── */}
      <div className="p-8 border border-[#e5e1d5] bg-white rounded-xl shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#1b3b2b] font-mono font-bold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            CLASS 9 CBSE // SCHOLAR WORKSTATION
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1a1917] tracking-tight">
            Welcome back, {user?.full_name || 'Scholar'}.
          </h1>
          <p className="text-sm text-zinc-600 mt-1 max-w-xl">
            Here is your daily study itinerary, spaced retrieval queue, and NCERT curriculum roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/focus-timer')}
            className="nv-btn-primary shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>START 25M SPRINT</span>
          </button>
        </div>
      </div>

      {/* ── METRICS STRIP ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 border border-[#e5e1d5] bg-white rounded-lg shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">TASKS IN QUEUE</div>
          <div className="text-2xl font-bold font-display text-[#1a1917]">{pendingTasks.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">{completedTasks.length} completed today</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-lg shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">RETRIEVAL DECKS</div>
          <div className="text-2xl font-bold font-display text-[#1a1917]">{decks.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Spaced recall active</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-lg shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">SYLLABUS MODULES</div>
          <div className="text-2xl font-bold font-display text-[#1b3b2b]">100%</div>
          <div className="text-[11px] text-zinc-500 mt-1">Class 9 NCERT Verified</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-lg shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">DATA REPOSITORY</div>
          <div className="text-2xl font-bold font-display text-[#162744]">READY</div>
          <div className="text-[11px] text-zinc-500 mt-1">Local persistence synced</div>
        </div>
      </div>

      {/* ── CORE WORKBENCH COLUMNS ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tasks & Assignments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#e5e1d5] bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1b3b2b]" />
                <h3 className="font-display font-bold text-lg text-[#1a1917]">Study Tasks & Assignments</h3>
              </div>
              <button
                onClick={() => navigate('/homework')}
                className="text-[11px] font-mono text-zinc-500 hover:text-black transition-colors flex items-center gap-1 font-semibold"
              >
                <span>OPEN PLANNER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inline Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add academic objective or homework task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[#fbfbfa] border border-[#e5e1d5] rounded-md px-3.5 py-2 text-xs text-[#1a1917] outline-none focus:border-[#1b3b2b]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1b3b2b] hover:bg-[#254e3a] text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            </form>

            {/* Task Item List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-10 text-xs text-zinc-500 font-mono">
                  No active study tasks in queue. Add an objective above.
                </div>
              ) : (
                tasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="p-3 border border-[#ebe7dc] hover:border-[#d4cfbf] bg-[#fbfbfa] rounded-md flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white' : 'border-[#d0c9b8] bg-white'
                      }`}>
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs truncate font-sans ${task.completed ? 'line-through text-zinc-400' : 'text-[#1a1917]'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-white text-zinc-600 border border-[#e5e1d5]">
                        {task.subject}
                      </span>
                      <span className="text-zinc-500">{task.due}</span>
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
          <div className="border border-[#e5e1d5] bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#162744]" />
                <h3 className="font-display font-bold text-lg text-[#1a1917]">Active Flashcards</h3>
              </div>
              <button
                onClick={() => navigate('/flashcards')}
                className="text-[11px] font-mono text-zinc-500 hover:text-black transition-colors flex items-center gap-1 font-semibold"
              >
                <span>ALL DECKS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {decks.slice(0, 3).map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => navigate('/flashcards')}
                  className="p-3 border border-[#ebe7dc] hover:border-[#d4cfbf] bg-[#fbfbfa] rounded-md flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a1917]">{deck.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{deck.cards?.length || 0} retrieval cards · {deck.subject}</span>
                  </div>
                  <button className="px-2.5 py-1 bg-white hover:bg-[#f2efe6] text-[10px] font-mono font-bold text-[#1b3b2b] rounded border border-[#e5e1d5] shadow-xs">
                    REVIEW
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Curriculum Navigation */}
          <div className="border border-[#e5e1d5] bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-[#1b3b2b]" />
                <h3 className="font-display font-bold text-lg text-[#1a1917]">Curriculum Vaults</h3>
              </div>
              <button
                onClick={() => navigate('/curriculum')}
                className="text-[11px] font-mono text-zinc-500 hover:text-black transition-colors flex items-center gap-1 font-semibold"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-[#e5e1d5] hover:border-[#1b3b2b] rounded-md bg-[#fbfbfa] text-left transition-colors"
              >
                <div className="text-[9px] text-[#1b3b2b] font-mono font-bold">CBSE-M9</div>
                <div className="text-xs font-bold text-[#1a1917] mt-1 font-sans">Math</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-0.5">15 Units</div>
              </button>

              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-[#e5e1d5] hover:border-[#162744] rounded-md bg-[#fbfbfa] text-left transition-colors"
              >
                <div className="text-[9px] text-[#162744] font-mono font-bold">CBSE-S9</div>
                <div className="text-xs font-bold text-[#1a1917] mt-1 font-sans">Science</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-0.5">15 Units</div>
              </button>

              <button
                onClick={() => navigate('/curriculum')}
                className="p-3 border border-[#e5e1d5] hover:border-[#a46a29] rounded-md bg-[#fbfbfa] text-left transition-colors"
              >
                <div className="text-[9px] text-[#a46a29] font-mono font-bold">CBSE-E9</div>
                <div className="text-xs font-bold text-[#1a1917] mt-1 font-sans">English</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-0.5">12 Units</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;