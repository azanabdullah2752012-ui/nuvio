import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Plus, 
  Trash2, Zap, ShieldCheck,
  Target, Rocket, ScrollText,
  AlertCircle, ArrowUpRight, Filter,
  Layers, Brain, Trophy, Sparkles, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { rewardService } from '../services/rewardService';

const SubjectIcon = ({ subject, className = "w-6 h-6" }) => {
  const s = subject?.toLowerCase() || '';
  if (s.includes('math')) return <Target className={className} />;
  if (s.includes('sci')) return <Zap className={className} />;
  if (s.includes('hist') || s.includes('human')) return <ScrollText className={className} />;
  if (s.includes('lang') || s.includes('write')) return <Brain className={className} />;
  if (s.includes('lit')) return <Layers className={className} />;
  if (s.includes('exam') || s.includes('test')) return <Rocket className={className} />;
  return <ShieldCheck className={className} />;
};

const QUICK_MISSIONS = [
  { id: 'math', title: 'Math Prime', icon: Target, color: 'bg-nuvio-blue', glow: 'shadow-nuvio-blue', subject: 'Mathematics' },
  { id: 'science', title: 'Science Synapse', icon: Zap, color: 'bg-nuvio-green', glow: 'shadow-nuvio-green', subject: 'Science' },
  { id: 'essay', title: 'Deep Draft', icon: ScrollText, color: 'bg-nuvio-purple-500', glow: 'shadow-nuvio-purple-500', subject: 'Humanities' },
  { id: 'vocab', title: 'Lexicon Drill', icon: Brain, color: 'bg-nuvio-cyan', glow: 'shadow-nuvio-cyan', subject: 'Languages' },
];

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

  const handleQuestForge = async (titleOverride = null, subjectOverride = 'General Sector') => {
    const title = typeof titleOverride === 'string' ? titleOverride : quickInput;
    if (title.trim()) {
      const newQuest = {
        title: title,
        subject: subjectOverride,
        priority: 'Standard',
        completed: false
      };
      setQuickInput('');
      try {
        const created = await dataService.create('tasks', newQuest);
        setTasks(prev => [created, ...prev]);
        notificationService.send("Objective Locked", `"${title}" forged successfully.`, "info");
      } catch (err) {
        notificationService.send("System Error", `Forge failed: ${err.message}`, "error");
      }
    } else {
      notificationService.send("Input Required", "Objective cannot be empty.", "warning");
    }
  };

  const handleMagicSuggest = () => {
    const suggestions = ["Master Quantum Theory", "Write English Thesis", "Solve Calculus Set", "Review World History"];
    handleQuestForge(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  const toggleQuest = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isCompleting = !task.completed;
    try {
      const updated = await dataService.update('tasks', id, { completed: isCompleting });
      setTasks(tasks.map(t => t.id === id ? updated : t));
      if (isCompleting) {
        xpService.awardXp(50, `Objective Accomplished: ${task.title}`);
        notificationService.send("Mission Complete", "+50 XP Synchronized.", "success");
        rewardService.triggerNeuralDrop();
      }
    } catch (err) {}
  };

  const deleteQuest = async (id) => {
    try {
      await dataService.delete('tasks', id);
      setTasks(tasks.filter(t => t.id !== id));
      notificationService.send("Objective Purged", "Memory wiped.", "info");
    } catch (err) {}
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-12 pb-32 nv-page-transition px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Cinematic Header */}
      <header className="relative flex flex-col md:flex-row items-end justify-between gap-10 border-b-[6px] border-white/10 pb-12 mb-16 mt-8">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-nuvio-purple-500/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-4 bg-black border-[3px] border-nuvio-purple-500 shadow-[6px_6px_0_#A855F7] px-6 py-2 transform -skew-x-6">
            <Terminal className="w-6 h-6 text-nuvio-purple-400" />
            <span className="text-sm font-black text-white uppercase tracking-widest">Active Objectives</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-nuvio-purple-300 uppercase tracking-tighter leading-none filter drop-shadow-lg">
            Mission <br /> Command
          </h1>
        </div>

        <div className="flex bg-black p-2 border-2 border-white/10 rounded-2xl relative z-10">
          {['pending', 'completed', 'all'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`
                px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all rounded-xl
                ${filter === t ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* The Forge - Extreme Input */}
      <div className="relative max-w-5xl mx-auto mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-nuvio-cyan via-nuvio-purple-500 to-nuvio-pink opacity-20 blur-3xl rounded-full" />
        <div className="nv-card bg-black p-2 !shadow-[16px_16px_0_rgba(168,85,247,0.3)] !border-4 border-nuvio-purple-500 relative z-10 overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="flex flex-col md:flex-row items-center gap-6 bg-[#0a0a0f] p-8 relative z-10 rounded-lg">
            <div className="p-4 bg-nuvio-purple-500/10 rounded-xl border border-nuvio-purple-500/30">
               <Plus className="w-10 h-10 text-nuvio-purple-400 animate-pulse" />
            </div>
            <input 
              className="flex-1 bg-transparent text-3xl md:text-5xl font-black text-white outline-none placeholder:text-white/10 uppercase tracking-tight"
              placeholder="INITIALIZE DIRECTIVE..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleQuestForge();
                }
              }}
              autoFocus
            />
            
            <button 
              onClick={handleMagicSuggest}
              className="hidden md:flex items-center gap-3 px-6 py-4 bg-white/5 border-2 border-white/10 hover:border-nuvio-cyan hover:bg-nuvio-cyan/10 text-white hover:text-nuvio-cyan rounded-xl transition-all font-black uppercase tracking-widest text-[10px] group/btn"
            >
              <Sparkles className="w-5 h-5 group-hover/btn:animate-spin" />
              Auto-Generate
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Pad */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {QUICK_MISSIONS.map(mission => (
          <button 
            key={mission.id}
            onClick={() => handleQuestForge(mission.title, mission.subject)}
            className="group relative flex items-center gap-4 p-6 bg-black border-2 border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02] active:scale-95 rounded-2xl overflow-hidden"
          >
            <div className={`absolute inset-0 ${mission.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`w-14 h-14 rounded-xl ${mission.color} flex items-center justify-center shadow-lg ${mission.glow}/20 border border-black/50 group-hover:scale-110 transition-transform duration-300`}>
              <mission.icon className="w-7 h-7 text-black" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest text-left">{mission.title}</span>
          </button>
        ))}
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 border-4 border-dashed border-white/5 text-center rounded-[40px] bg-black/40 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
              
              {/* Animated Radar Graphic */}
              <div className="relative w-48 h-48 mb-12">
                <div className="absolute inset-0 border-4 border-nuvio-purple-500/20 rounded-full animate-ping" />
                <div className="absolute inset-4 border-2 border-nuvio-purple-500/40 rounded-full animate-[pulse_3s_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-24 bg-gradient-to-t from-nuvio-purple-500 to-transparent origin-bottom animate-[spin_4s_linear_infinite]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Terminal className="w-16 h-16 text-nuvio-purple-400 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>

              <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">Sector Zero</h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] relative z-10">No active directives detected in local airspace.</p>
              
              <div className="mt-12 flex gap-4 relative z-10">
                <div className="w-2 h-2 rounded-full bg-nuvio-green animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-nuvio-purple-500 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-nuvio-cyan animate-pulse delay-150" />
              </div>
            </motion.div>
          ) : (
            filteredTasks.filter(t => t).map((task, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                key={task.id}
                className={`
                  nv-card flex flex-col justify-between p-8 bg-[#0d0d12] border-2 transition-all duration-300 group rounded-[32px]
                  ${task.completed ? 'border-nuvio-green/20 bg-nuvio-green/5' : 'border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5'}
                `}
              >
                <div className="flex justify-between items-start mb-12">
                  <div className={`p-4 rounded-2xl border-2 ${task.completed ? 'bg-nuvio-green border-nuvio-green text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                    <SubjectIcon subject={task.subject} className="w-8 h-8" />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => deleteQuest(task.id)}
                      className="p-4 bg-black border-2 border-white/5 hover:border-nuvio-red hover:bg-nuvio-red/10 text-white/40 hover:text-nuvio-red rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleQuest(task.id)}
                      className={`
                        p-4 rounded-xl border-2 transition-all shadow-lg
                        ${task.completed ? 'bg-nuvio-green border-nuvio-green text-black' : 'bg-black border-white/10 text-white hover:border-nuvio-green hover:text-nuvio-green'}
                      `}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-nuvio-cyan uppercase tracking-[0.4em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nuvio-cyan animate-pulse" /> Directive {idx + 1}
                  </div>
                  <h3 className={`text-4xl font-black text-white uppercase leading-tight tracking-tight ${task.completed ? 'line-through decoration-nuvio-green/50 text-white/40' : ''}`}>
                    {task.title}
                  </h3>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <SubjectIcon subject={task.subject} className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{task.subject || 'General'}</span>
                   </div>
                   <div className="px-4 py-2 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                      50 XP
                   </div>
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
