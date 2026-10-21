import React, { useState, useEffect } from 'react';
import { 
  Target, Clock, CheckCircle2,
  Calendar as CalendarIcon, ArrowRight, Plus,
  Check, Timer, AlertCircle, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('General');
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskList, eventList, sessionList] = await Promise.all([
        dataService.list('tasks'),
        dataService.list('calendar_events'),
        dataService.list('focus_sessions')
      ]);
      setTasks(taskList || []);
      setEvents(eventList || []);
      setFocusSessions(sessionList || []);
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
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
      subject: newTaskSubject,
      due: 'Today',
      priority: 'Medium',
      completed: false
    });
    setNewTaskTitle('');
    loadData();
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  // Calculate total focus minutes today
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const totalFocusMinutesToday = focusSessions
    .filter(s => {
      const dateStr = (s.completed_at || s.created_at || '').substring(0, 10);
      return dateStr === todayStr;
    })
    .reduce((acc, s) => acc + (s.duration_minutes || s.minutes || 25), 0);

  // Upcoming 3 calendar events
  const sortedUpcomingEvents = [...events]
    .sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''))
    .slice(0, 3);

  return (
    <div className="space-y-8 font-sans text-left">
      
      {/* ── MASTHEAD ────────────────────────────────────────────────── */}
      <div className="p-8 md:p-10 border border-[#e5e1d5] bg-white rounded-2xl shadow-[0_4px_24px_rgba(27,59,43,0.04)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#1b3b2b] font-mono font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            STUDENT PRODUCTIVITY SUITE // {format(new Date(), 'EEEE, d MMMM yyyy').toUpperCase()}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1917] tracking-tight">
            Welcome back, {user?.full_name || 'Scholar'}.
          </h1>
          <p className="text-xs md:text-sm text-[#52504a] max-w-xl leading-relaxed">
            Distraction-free workspace for tasks, cognitive focus intervals, and deadline planning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/focus-timer')}
            className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] active:scale-95 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Start 25m Focus</span>
          </button>
        </div>
      </div>

      {/* ── METRICS STRIP ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 border border-[#e5e1d5] bg-white rounded-xl shadow-sm space-y-1">
          <div className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Pending Tasks</div>
          <div className="text-3xl font-serif font-bold text-[#1a1917]">{pendingTasks.length}</div>
          <div className="text-[10px] font-mono text-[#52504a]">Active assignments</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-xl shadow-sm space-y-1">
          <div className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Tasks Completed</div>
          <div className="text-3xl font-serif font-bold text-[#1b3b2b]">{completedTasks.length}</div>
          <div className="text-[10px] font-mono text-[#52504a]">Completed to date</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-xl shadow-sm space-y-1">
          <div className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Focus Time Today</div>
          <div className="text-3xl font-serif font-bold text-[#1b3b2b]">
            {totalFocusMinutesToday > 0 ? `${totalFocusMinutesToday}m` : '0m'}
          </div>
          <div className="text-[10px] font-mono text-[#52504a]">Logged in sessions</div>
        </div>

        <div className="p-5 border border-[#e5e1d5] bg-white rounded-xl shadow-sm space-y-1">
          <div className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Scheduled Events</div>
          <div className="text-3xl font-serif font-bold text-[#1a1917]">{events.length}</div>
          <div className="text-[10px] font-mono text-[#52504a]">On calendar schedule</div>
        </div>
      </div>

      {/* ── CORE WORKBENCH COLUMNS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Tasks & Assignments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#e5e1d5] bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-[#1b3b2b]" />
                <h3 className="font-serif font-bold text-xl text-[#1a1917]">Tasks & Assignments</h3>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Filter pills */}
                <div className="flex bg-[#f5f3ec] p-1 border border-[#e5e1d5] rounded-lg">
                  {['all', 'pending', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setTaskFilter(f)}
                      className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
                        taskFilter === f 
                          ? 'bg-[#1b3b2b] text-white font-bold shadow-sm' 
                          : 'text-[#52504a] hover:text-[#1a1917]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/homework')}
                  className="text-xs font-mono uppercase text-[#1b3b2b] hover:underline font-bold flex items-center gap-1 pl-2"
                >
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inline Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add assignment, homework task, or study goal..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl px-4 py-3 text-xs text-[#1a1917] outline-none focus:border-[#1b3b2b] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Task Item List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#827f76] font-mono uppercase border border-dashed border-[#e5e1d5] rounded-xl">
                  No tasks matching the selected filter.
                </div>
              ) : (
                filteredTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="p-3.5 border border-[#e5e1d5] hover:border-[#1b3b2b]/40 bg-[#fbfbfa] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        task.completed ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white' : 'border-[#d0c9b8] bg-white'
                      }`}>
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs truncate font-sans ${task.completed ? 'line-through text-[#827f76]' : 'text-[#1a1917] font-medium'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-white text-[#1b3b2b] border border-[#e5e1d5] font-semibold">
                        {task.subject || 'General'}
                      </span>
                      <span className="text-[#827f76]">{task.due || 'Today'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Focus Station & Upcoming Calendar */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Focus Station */}
          <div className="border border-[#e5e1d5] bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2 text-[#1b3b2b]">
                <Timer className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">Focus Cadence</h3>
              </div>
              <button
                onClick={() => navigate('/focus-timer')}
                className="text-xs font-mono uppercase text-[#1b3b2b] hover:underline font-bold flex items-center gap-1"
              >
                <span>Launch Timer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-center space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#827f76] font-bold">Standard Pomodoro</span>
              <div className="text-4xl font-mono font-bold text-[#1b3b2b]">25:00</div>
              <p className="text-xs text-[#52504a]">
                Interval pacing primes cognitive focus and prevents study fatigue.
              </p>
              <button
                onClick={() => navigate('/focus-timer')}
                className="w-full py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Begin 25-Minute Session
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => navigate('/focus-timer')}
                className="p-3 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#1a1917]">50m Deep Work</div>
                <div className="text-[10px] text-[#827f76] font-mono mt-0.5">Extended sprint</div>
              </button>
              <button
                onClick={() => navigate('/focus-timer')}
                className="p-3 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#1a1917]">5m Reset Break</div>
                <div className="text-[10px] text-[#827f76] font-mono mt-0.5">Recovery buffer</div>
              </button>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="border border-[#e5e1d5] bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e1d5]">
              <div className="flex items-center gap-2 text-[#1b3b2b]">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => navigate('/calendar')}
                className="text-xs font-mono uppercase text-[#1b3b2b] hover:underline font-bold flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {sortedUpcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#827f76] font-mono uppercase">
                  No upcoming deadlines on schedule.
                </div>
              ) : (
                sortedUpcomingEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate('/calendar')}
                    className="p-3.5 border border-[#e5e1d5] hover:border-[#1b3b2b]/40 bg-[#fbfbfa] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-serif font-bold text-[#1a1917]">{evt.title}</h4>
                      <span className="text-[10px] font-mono text-[#827f76]">
                        {evt.event_date} at {evt.event_time || '10:00'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-white text-[10px] font-mono font-bold text-[#1b3b2b] rounded-lg border border-[#e5e1d5] shadow-xs">
                      {evt.event_type || 'Study'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
