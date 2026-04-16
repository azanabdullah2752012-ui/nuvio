import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Plus, 
  ChevronRight, Calendar, AlertCircle,
  Clock, Tag, Trash2, ArrowUpRight,
  LayoutGrid, Sparkles, Zap, ShieldCheck,
  Target, Rocket, ScrollText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const Homework = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const list = await dataService.list('tasks');
      setTasks(list);
    } catch (err) {
      console.error("Quest Log Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestForge = async (e) => {
    if (e.key === 'Enter' && quickInput.trim()) {
      const newQuest = {
        title: quickInput,
        subject: 'General Sector',
        priority: 'Standard',
        completed: false
      };
      setQuickInput(''); // Immediate UI feedback
      try {
        const created = await dataService.create('tasks', newQuest);
        setTasks(prev => [created, ...prev]);
        notificationService.send("Quest Forged", `"${newQuest.title}" added to your roadmap.`, "info");
      } catch (err) {
        console.error("Cloud Forge failed:", err);
      }
    }
  };

  const toggleQuest = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const isCompleting = !task.completed;
    
    try {
      const updated = await dataService.update('tasks', id, { completed: isCompleting });
      setTasks(tasks.map(t => t.id === id ? updated : t));
      
      if (isCompleting) {
        const xpAmount = task.priority === 'Critical' ? 100 : 50;
        xpService.awardXp(xpAmount, `Completed Quest: ${task.title}`);
        notificationService.send("Quest Complete", `Verified! +${xpAmount} XP Synchronized.`, "success");
      }
    } catch (err) {
      console.error("Cloud update failed:", err);
    }
  };

  const deleteQuest = async (id) => {
    try {
      await dataService.delete('tasks', id);
      setTasks(tasks.filter(t => t.id !== id));
      notificationService.send("Mission Aborted", "Quest removed from timeline.", "info");
    } catch (err) {
      console.error("Cloud purge failed:", err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Critical': return 'text-nuvio-red border-nuvio-red/30 bg-nuvio-red/10';
      case 'High': return 'text-nuvio-orange border-nuvio-orange/30 bg-nuvio-orange/10';
      default: return 'text-nuvio-purple-400 border-nuvio-purple-500/20 bg-nuvio-purple-500/10';
    }
  };

  return (
    <div className="space-y-12 pb-32 nv-page-transition">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-nuvio-purple-500/5 blur-[120px] pointer-events-none" />
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <ScrollText className="w-12 h-12 text-nuvio-purple-400" />
            Quest Log
          </h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-nuvio-green animate-pulse" />
            Active Missions: {tasks.filter(t => !t.completed).length}
          </p>
        </div>
        
        <div className="flex bg-background-dark/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
           {['pending', 'completed', 'all'].map(t => (
             <button 
               key={t}
               onClick={() => setFilter(t)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === t ? 'bg-nuvio-purple-500 text-white shadow-xl shadow-nuvio-purple-500/20' : 'text-text-muted hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </header>

      {/* Quick Forge */}
      <div className="relative group max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-nuvio-purple-500/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative nv-card p-2 border-white/10 shadow-2xl bg-[#0d0d12]/80 backdrop-blur-xl">
           <div className="flex items-center gap-6 px-8 h-20">
              <Zap className="w-8 h-8 text-nuvio-purple-400 animate-pulse" />
              <input 
                 className="flex-1 bg-transparent text-xl font-black text-white outline-none placeholder:text-text-muted placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.3em]"
                 placeholder="Forge New Quest: Identify mission and press Enter..."
                 value={quickInput}
                 onChange={(e) => setQuickInput(e.target.value)}
                 onKeyDown={handleQuestForge}
              />
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
                 <span className="text-nuvio-purple-400">[Enter]</span> to Archive
              </div>
           </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white/[0.01] rounded-[40px] border-2 border-dashed border-white/5"
            >
               <Target className="w-20 h-20 text-text-muted mx-auto mb-6 opacity-20" />
               <h3 className="text-2xl font-black text-text-muted uppercase tracking-tighter">No Active Objectives</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">All sectors identified as clear</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={task.id}
                className={`nv-card p-10 flex flex-col md:flex-row items-center gap-10 group relative border-white/5 transition-all overflow-hidden ${task.completed ? 'opacity-40 grayscale-[0.5]' : 'hover:border-nuvio-purple-500/30 hover:bg-white/[0.02]'}`}
              >
                {/* Status Indicator */}
                <button 
                  onClick={() => toggleQuest(task.id)}
                  className={`relative w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-nuvio-green shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                      : 'bg-white/5 border-2 border-white/10 text-text-muted hover:border-nuvio-purple-500 group-hover:scale-110'
                  }`}
                >
                  {task.completed ? (
                    <ShieldCheck className="w-8 h-8 text-white" />
                  ) : (
                    <Circle className="w-8 h-8 group-hover:text-nuvio-purple-400 transition-colors" />
                  )}
                  {task.completed && (
                    <motion.div 
                      layoutId={`spark-${task.id}`}
                      className="absolute inset-0 bg-nuvio-green/20 blur-xl rounded-full" 
                    />
                  )}
                </button>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h3 className={`text-2xl font-black text-white uppercase tracking-tight transition-all ${task.completed ? 'line-through decoration-nuvio-green decoration-4 opacity-50' : ''}`}>
                      {task.title}
                    </h3>
                    <div className={`inline-flex px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'Standard'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-8">
                     <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-xl bg-nuvio-purple-500/10 flex items-center justify-center text-nuvio-purple-400">
                         <Rocket className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{task.subject || 'General Sector'}</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                       <Clock className="w-4 h-4 text-text-muted" />
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Target: Soon</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 absolute top-6 right-8 md:relative md:top-0 md:right-0 opacity-0 group-hover:opacity-100 transition-all">
                   <button 
                     onClick={() => deleteQuest(task.id)}
                     className="p-4 bg-white/5 rounded-2xl text-text-muted hover:text-nuvio-red hover:bg-nuvio-red/10 transition-all border border-white/5"
                   >
                     <Trash2 className="w-6 h-6" />
                   </button>
                   <button className="nv-btn-secondary h-16 w-16 p-0 bg-white/5 border-white/10 group/btn">
                     <ArrowUpRight className="w-8 h-8 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Persistence Stats */}
      <footer className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Completion Rate', val: `${Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%`, icon: Sparkles, color: 'text-nuvio-purple-400' },
           { label: 'Synchronized XP', val: `+${tasks.filter(t => t.completed).length * 50}`, icon: Zap, color: 'text-nuvio-yellow' },
           { label: 'Quest Efficiency', val: 'Exemplary', icon: ShieldCheck, color: 'text-nuvio-green' },
         ].map((stat, i) => (
           <div key={i} className="nv-card p-8 border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <div className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                 <div className="text-xl font-black text-white uppercase tracking-tight">{stat.val}</div>
              </div>
           </div>
         ))}
      </footer>
    </div>
  );
};

export default Homework;
