import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Clock, 
  Trash2, Filter, AlertCircle, 
  Check, Calendar, BookOpen, ChevronRight,
  ListFilter, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Science'];

const Homework = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'completed' | 'all'
  const [filterSubject, setFilterSubject] = useState('All');
  
  // New task input state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium'); // 'high' | 'medium' | 'low'
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
      subject: subject,
      due_date: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      priority: priority,
      completed: false
    };

    try {
      const created = await dataService.create('tasks', newTask);
      setTasks(prev => [created, ...prev]);
      setTitle('');
      setShowForm(false);
      notificationService.send("Task Registered", `Directive logged under ${subject}.`, "success");
    } catch (err) {
      notificationService.send("Registration Error", "Could not commit task to local store.", "error");
    }
  };

  const handleToggleTask = async (task) => {
    const updatedStatus = !task.completed;
    try {
      const updated = await dataService.update('tasks', task.id, { completed: updatedStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: updatedStatus } : t));
      if (updatedStatus) {
        notificationService.send("Objective Concluded", `Task marked complete.`, "info");
      }
    } catch (err) {
      console.warn("Could not toggle task status:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await dataService.delete('tasks', id);
      setTasks(tasks.filter(t => t.id !== id));
      notificationService.send("Task Removed", "Directive excised from planner.", "info");
    } catch (err) {
      console.warn("Could not delete task:", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? task.completed : !task.completed;
    
    const matchesSubject = 
      filterSubject === 'All' ? true : task.subject === filterSubject;

    return matchesStatus && matchesSubject;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Task Directive / Academic Planning Matrix
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Study Planner & Tasks
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Register homework deliverables, syllabus revision targets, and exam preparation milestones.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm self-start md:self-end"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel Input' : 'Add Directive'}</span>
        </button>
      </header>

      {/* QUICK TASK CREATOR DRAWER */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-4 overflow-hidden"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold block">
              New Study Directive
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. NCERT Science Chapter 3 Exercise 3.2)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff4625] transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:border-[#ff4625]"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:border-[#ff4625]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-3 bg-white text-black font-mono uppercase tracking-widest text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Commit Task</span>
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FILTER BAR & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Status Filter */}
        <div className="flex gap-1.5 p-1 bg-[#0d0f14] border border-white/10 rounded-lg self-start">
          {[
            { id: 'pending', label: 'Active', count: pendingCount },
            { id: 'completed', label: 'Concluded', count: completedCount },
            { id: 'all', label: 'All Tasks', count: tasks.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                filterStatus === tab.id
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                filterStatus === tab.id ? 'bg-black text-white' : 'bg-white/10 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Subject Filter Pills */}
        <div className="flex gap-1.5 flex-wrap">
          {SUBJECTS.map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all border ${
                filterSubject === sub
                  ? 'border-[#ff4625] bg-[#ff4625]/10 text-white font-bold'
                  : 'border-white/5 bg-[#0d0f14] text-zinc-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

      </div>

      {/* TASKS LIST */}
      {filteredTasks.length === 0 ? (
        <div className="p-16 border border-white/10 bg-[#0d0f14] rounded-2xl text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="font-clash text-lg font-bold uppercase text-white">No Directives in Queue</h3>
          <p className="text-zinc-500 text-xs font-mono max-w-sm mx-auto">
            {filterStatus === 'completed'
              ? 'No completed tasks recorded under this filter.'
              : 'All scheduled homework and study items have been cleared.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-5 border rounded-xl transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'border-emerald-500/20 bg-[#08090b] text-zinc-500'
                  : 'border-white/10 bg-[#0d0f14] hover:border-white/20 text-white'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => handleToggleTask(task)}
                  className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : 'border-zinc-700 hover:border-white'
                  }`}
                  title={task.completed ? "Mark pending" : "Mark complete"}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="space-y-1">
                  <span className={`text-sm font-semibold block ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                    <span className="uppercase text-[#ff4625] font-bold">{task.subject || 'Curriculum'}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      Due {task.due_date || 'Upcoming'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-zinc-600 hover:text-rose-400 rounded transition-colors"
                  title="Purge Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Homework;