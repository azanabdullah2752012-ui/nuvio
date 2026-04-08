import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Plus, 
  ChevronRight, Calendar, AlertCircle,
  Clock, Tag, Trash2, ArrowUpRight,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';

const Homework = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    const list = dataService.list('tasks');
    if (list.length === 0) {
      const initial = [
        { id: '1', title: 'Complete Calculus Worksheet', subject: 'Math', due: 'Today', priority: 'High', completed: false },
        { id: '2', title: 'Biology Chapter 4 Summary', subject: 'Science', due: 'Tomorrow', priority: 'Medium', completed: false }
      ];
      initial.forEach(t => dataService.create('tasks', t));
      setTasks(initial);
    } else {
      setTasks(list);
    }
  }, []);

  const handleQuickAdd = (e) => {
    if (e.key === 'Enter' && quickInput.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: quickInput,
        subject: 'General',
        due: 'Soon',
        priority: 'Medium',
        completed: false
      };
      const created = dataService.create('tasks', newTask);
      setTasks([created, ...tasks]);
      setQuickInput('');
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const updated = dataService.update('tasks', id, { ...task, completed: !task.completed });
    setTasks(tasks.map(t => t.id === id ? updated : t));
  };

  const deleteTask = (id) => {
    dataService.delete('tasks', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-10 pb-20 nv-page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Academic Roadmap</h1>
          <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-1 opacity-70">Optimize your workflow efficiency</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
           {['all', 'pending', 'completed'].map(t => (
             <button 
               key={t}
               onClick={() => setFilter(t)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-nuvio-purple-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Simplified Quick Add */}
      <div className="relative group">
        <div className="absolute inset-0 bg-nuvio-purple-500/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative nv-card p-2 border-white/10 shadow-2xl bg-white/[0.03] backdrop-blur-md">
           <div className="flex items-center gap-4 px-6 h-16">
              <Plus className="w-6 h-6 text-nuvio-purple-400" />
              <input 
                 className="flex-1 bg-transparent text-white font-bold outline-none placeholder:text-text-muted placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                 placeholder="Quick Entry: Type task and press Enter..."
                 value={quickInput}
                 onChange={(e) => setQuickInput(e.target.value)}
                 onKeyDown={handleQuickAdd}
              />
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black text-text-muted uppercase tracking-widest">
                 Press Enter to Save
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-50">
               <LayoutGrid className="w-12 h-12 text-text-muted mx-auto mb-4" />
               <p className="text-xs font-black text-text-muted uppercase tracking-widest">No tasks identified in this sector</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task.id}
                className={`nv-card p-6 flex flex-col md:flex-row items-center gap-6 group border-white/5 hover:border-nuvio-purple-500/20 transition-all ${task.completed ? 'opacity-50' : ''}`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.completed ? 'bg-nuvio-green text-white' : 'bg-white/5 border border-white/10 text-text-muted hover:border-nuvio-purple-500'}`}
                >
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>

                <div className="flex-1 text-center md:text-left">
                  <h3 className={`text-lg font-black text-white uppercase tracking-tight ${task.completed ? 'line-through decoration-nuvio-green' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                     <span className="text-[9px] font-black text-nuvio-purple-400 uppercase tracking-widest bg-nuvio-purple-500/5 px-2 py-0.5 rounded-md">{task.subject}</span>
                     <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                       <Clock className="w-3 h-3" /> Due {task.due}
                     </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => deleteTask(task.id)} className="p-3 bg-white/5 rounded-xl text-text-muted hover:text-nuvio-red transition-all">
                     <Trash2 className="w-5 h-5" />
                   </button>
                   <button className="nv-btn-secondary h-12 w-12 p-0"><ArrowUpRight className="w-5 h-5" /></button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Homework;
