import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Plus, 
  Trash2, Zap, ShieldCheck,
  Target, Rocket, ScrollText,
  AlertCircle, ArrowUpRight, Filter,
  Layers, Brain, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { rewardService } from '../services/rewardService';

const QUICK_MISSIONS = [
  { id: 'math', title: 'Math Prime Set', icon: Target, color: 'bg-nuvio-blue', subject: 'Mathematics' },
  { id: 'science', title: 'Science Synapse', icon: Zap, color: 'bg-nuvio-green', subject: 'Science' },
  { id: 'essay', title: 'Deep Draft', icon: ScrollText, color: 'bg-nuvio-purple-500', subject: 'Humanities' },
  { id: 'vocab', title: 'Linguistic Drill', icon: Brain, color: 'bg-nuvio-cyan', subject: 'Languages' },
  { id: 'reading', title: 'Sector Scan', icon: Layers, color: 'bg-nuvio-yellow', subject: 'Literature' },
  { id: 'quiz', title: 'Neural Test', icon: Rocket, color: 'bg-nuvio-red', subject: 'Exams' }
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
    const title = titleOverride || quickInput;
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
        notificationService.send("Objective Locked", `"${title}" added to study list.`, "info");
        
        // Interaction: Trigger particles from the input area
        window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: { last_gain: 1 } }));
      } catch (err) {
        console.error("Forge failed:", err);
      }
    }
  };

  const handleMagicSuggest = () => {
    const suggestions = [
      "Review Science Flashcards",
      "Draft Essay Outline",
      "Solve 10 Math Problems",
      "Read History Chapter 4",
      "Practice Vocabulary",
      "Summarize Social Notes"
    ];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    handleQuestForge(pick);
  };

  const emitReaction = (emoji, e) => {
    const x = e.clientX;
    const y = e.clientY;
    window.dispatchEvent(new CustomEvent('nuvio_particle_bonus', { detail: { emoji, x, y, type: 'reaction' } }));
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
        notificationService.send("Objective Complete", "+50 XP Synchronized.", "success");
        
        // Tier 2: Variable Reward (Neural Drop)
        rewardService.triggerNeuralDrop();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteQuest = async (id) => {
    try {
      await dataService.delete('tasks', id);
      setTasks(tasks.filter(t => t.id !== id));
      notificationService.send("Link Terminated", "Objective purged from memory.", "info");
    } catch (err) {
      console.error("Purge failed:", err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-12 pb-32 nv-page-transition px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b-[6px] border-black pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-4 bg-nuvio-blue border-[3px] border-black shadow-[6px_6px_0_#000] px-6 py-2">
            <ScrollText className="w-8 h-8 text-black" />
            <span className="text-sm font-black text-black uppercase tracking-widest">Active Missions</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none text-shadow-nb">
            Mission <br /> Control
          </h1>
          <p className="text-lg font-bold text-nuvio-cyan uppercase tracking-widest pt-2">
            [ Sector Clear: {(tasks.filter(t => t.completed).length / (tasks.length || 1) * 100).toFixed(0)}% ]
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {['pending', 'completed', 'all'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`
                px-8 py-4 text-xs font-black uppercase tracking-[0.2em] border-[3px] border-black transition-all
                ${filter === t ? 'bg-nuvio-purple-500 translate-x-[-4px] translate-y-[-4px] shadow-[8px_8px_0_#000] text-black' : 'bg-white/5 text-text-muted hover:bg-white/10'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Zero-Typing: Quick Mission Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-nuvio-yellow" />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Rapid Deployment Grid</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_MISSIONS.map(mission => (
            <button 
              key={mission.id}
              onClick={() => handleQuestForge(mission.title, mission.subject)}
              className="group relative flex flex-col items-center justify-center gap-4 p-6 bg-black border-[3px] border-black hover:border-white transition-all hover:bg-white/5 active:scale-95 shadow-nb-small"
            >
              <div className={`w-12 h-12 rounded-2xl ${mission.color} flex items-center justify-center shadow-[4px_4px_0_#000] border-2 border-black group-hover:scale-110 transition-transform`}>
                <mission.icon className="w-6 h-6 text-black" />
              </div>
              <span className="text-[9px] font-black text-white uppercase tracking-widest text-center">{mission.title}</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3 h-3 text-nuvio-cyan" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section (Secondary Mode) */}
      <div className="relative max-w-4xl opacity-60 hover:opacity-100 transition-opacity">
        <div className="nv-card bg-black/40 p-2 !shadow-[8px_8px_0_#000] !border-4">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-black p-4">
            <Plus className="w-8 h-8 text-nuvio-purple-400" />
            <input 
              className="flex-1 bg-transparent text-lg font-black text-white outline-none placeholder:text-white/20 uppercase"
              placeholder="Or forge unique objective..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuestForge()}
            />
            <button 
              onClick={handleMagicSuggest}
              className="p-4 bg-nuvio-cyan hover:bg-white text-black rounded-xl transition-all hover:scale-110 active:scale-90 flex items-center gap-2 group"
            >
              <Brain className="w-6 h-6 animate-pulse" />
              <span className="text-[10px] font-black uppercase hidden lg:block">Auto-Suggest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 py-32 border-4 border-dashed border-black/50 text-center rounded-xl bg-black/20">
              <ShieldCheck className="w-20 h-20 text-text-muted mx-auto mb-6 opacity-20" />
              <h3 className="text-4xl font-black text-text-muted uppercase tracking-tighter">Sector Static</h3>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2">All objectives archived or missing</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={task.id}
                className={`
                  nv-card flex flex-col justify-between h-full bg-[#181a20] !border-[3px] group
                  ${task.completed ? '!bg-nuvio-green/5 opacity-60 grayscale' : 'hover:!bg-[#1c1f26]'}
                `}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 border-[3px] border-black shadow-[4px_4px_0_#000] ${task.completed ? 'bg-nuvio-green' : 'bg-nuvio-purple-500'}`}>
                    <Target className={`w-8 h-8 ${task.completed ? 'text-black' : 'text-black'}`} />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => deleteQuest(task.id)}
                      className="p-3 bg-white/5 border-[2px] border-black hover:bg-nuvio-red hover:text-black transition-all shadow-[4px_4px_0_#000] opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleQuest(task.id)}
                      className={`
                        p-3 border-[2px] border-black transition-all shadow-[4px_4px_0_#000]
                        ${task.completed ? 'bg-nuvio-green text-black' : 'bg-white/10 text-white hover:bg-nuvio-green hover:text-black'}
                      `}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <div className="text-[10px] font-black text-nuvio-cyan uppercase tracking-[0.3em]">Neural Protocol {idx + 1}</div>
                  <h3 className={`text-3xl font-black text-white uppercase leading-tight ${task.completed ? 'line-through decoration-[#000]' : ''}`}>
                    {task.title}
                  </h3>
                  
                  {/* Reaction System */}
                  {!task.completed && (
                    <div className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-black border border-white/10 p-2 rounded-xl z-10 shadow-nb-small">
                       {['🔥', '💡', '🚀', '🎯'].map(emoji => (
                         <button 
                           key={emoji}
                           onClick={(e) => emitReaction(emoji, e)}
                           className="hover:scale-150 transition-transform text-lg"
                         >
                           {emoji}
                         </button>
                       ))}
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t-[3px] border-black flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-nuvio-blue border-2 border-black" />
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{task.subject || 'General'} Sector</span>
                   </div>
                   <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                      XP +50
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Analytics Footer */}
      <footer className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
        {[
          { label: 'Neural Accuracy', val: 'Exemplary', color: 'text-nuvio-cyan' },
          { label: 'Knowledge Points', val: tasks.filter(t => t.completed).length * 10, color: 'text-nuvio-yellow' },
          { label: 'Timeline Logic', val: 'Verified', color: 'text-nuvio-green' }
        ].map((stat, i) => (
          <div key={i} className="bg-black/40 border-[3px] border-black p-8 rounded-sm">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color} uppercase tracking-tighter`}>{stat.val}</div>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default Homework;
