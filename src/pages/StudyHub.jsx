import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Lightbulb, CheckCircle2, Clock, 
  ArrowRight, BookMarked, Timer, Target, Calendar,
  Sparkles, Check, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

const STUDY_TIPS = [
  { 
    id: 't1', 
    title: 'Active Recall', 
    desc: 'Close your textbook and retrieve formulas and definitions purely from memory onto paper. This builds resilient synaptic pathways rather than passive recognition.',
    subject: 'Cognitive Protocol 01'
  },
  { 
    id: 't2', 
    title: 'Spaced Repetition', 
    desc: 'Schedule reviews at compounding intervals (Day 1, Day 3, Day 7, Day 14). This intercepts the Ebbinghaus forgetting curve before decay sets in.',
    subject: 'Memory Retention 02'
  },
  { 
    id: 't3', 
    title: 'Feynman Technique', 
    desc: 'Articulate a complex concept (such as Newton\'s laws or cell division) using straightforward vocabulary. Ambiguities in your explanation reveal immediate gaps.',
    subject: 'Deep Conceptual 03'
  },
  { 
    id: 't4', 
    title: 'Pomodoro Interval', 
    desc: 'Execute 25-minute deep focus sprints followed strictly by 5-minute cognitive detours. Protects against mental fatigue during intensive NCERT problem sets.',
    subject: 'Sustained Focus 04'
  },
  { 
    id: 't5', 
    title: 'Interleaved Practice', 
    desc: 'Alternate between problem types (e.g. Science physics problems and Math linear equations) within the same workstation session to improve cognitive schema flexibility.',
    subject: 'Problem Versatility 05'
  }
];

const WORKSPACE_MODULES = [
  { name: 'Curriculum Hub', path: '/curriculum', desc: 'CBSE Class 9 NCERT syllabus & interactive units', icon: BookOpen },
  { name: 'Flashcard Vault', path: '/flashcards', desc: 'Active retrieval decks with spaced intervals', icon: BookMarked },
  { name: 'Focus Timer', path: '/focus-timer', desc: 'Customizable Pomodoro blocks and timer console', icon: Timer },
  { name: 'Task Planner', path: '/homework', desc: 'Organize study assignments, homework & milestones', icon: Target },
  { name: 'Academic Calendar', path: '/calendar', desc: 'Timeline scheduling and exam preparation dates', icon: Calendar }
];

const StudyHub = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.me());

  const [appliedTips, setAppliedTips] = useState(() => {
    try {
      const saved = localStorage.getItem('acadevance_applied_tips');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [dailyChecklist, setDailyChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('acadevance_daily_study_checklist');
      return saved ? JSON.parse(saved) : [
        { id: 'c1', title: 'Complete 1 Focused 25m Pomodoro Block', completed: false },
        { id: 'c2', title: 'Review 15 Spaced Repetition Flashcards', completed: false },
        { id: 'c3', title: 'Inspect 1 NCERT Science/Math Unit Summary', completed: false }
      ];
    } catch (e) {
      return [
        { id: 'c1', title: 'Complete 1 Focused 25m Pomodoro Block', completed: false },
        { id: 'c2', title: 'Review 15 Spaced Repetition Flashcards', completed: false },
        { id: 'c3', title: 'Inspect 1 NCERT Science/Math Unit Summary', completed: false }
      ];
    }
  });

  const toggleTip = (id) => {
    let next;
    if (appliedTips.includes(id)) {
      next = appliedTips.filter(t => t !== id);
    } else {
      next = [...appliedTips, id];
      notificationService.send("Protocol Applied", "Study technique registered to active routine.", "info");
    }
    setAppliedTips(next);
    localStorage.setItem('acadevance_applied_tips', JSON.stringify(next));
  };

  const toggleChecklist = (id) => {
    const updated = dailyChecklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setDailyChecklist(updated);
    localStorage.setItem('acadevance_daily_study_checklist', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Academic Protocol / Workspace & Techniques
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Study Arsenal
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Evidence-based cognitive retention frameworks, daily discipline protocols, and direct launchers to academic modules.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0d0f14] border border-white/10 px-5 py-3 rounded-xl self-start md:self-end">
          <Clock className="w-4 h-4 text-[#ff4625]" />
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">Curriculum Tier</span>
            <span className="font-mono text-xs font-bold text-white">Class {user?.grade_level || '9th'} CBSE</span>
          </div>
        </div>
      </header>

      {/* WORKSPACE LAUNCHERS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold">
            Academic Modules & Tools
          </h2>
          <span className="font-mono text-[10px] text-zinc-600 uppercase">5 Workstation Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKSPACE_MODULES.map((mod) => (
            <div
              key={mod.name}
              onClick={() => navigate(mod.path)}
              className="p-6 border border-white/10 bg-[#0d0f14] hover:border-[#ff4625]/40 hover:bg-[#12151c] rounded-2xl transition-all cursor-pointer group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#ff4625] transition-colors">
                  <mod.icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ff4625] transition-all group-hover:translate-x-1" />
              </div>

              <div>
                <h3 className="font-clash text-lg font-bold text-white uppercase group-hover:text-[#ff4625] transition-colors">
                  {mod.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                  {mod.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT SECTION: DAILY PROTOCOLS & COGNITIVE TECHNIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: DAILY STUDY PROTOCOLS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#ff4625]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                  Daily Protocols
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#ff4625] bg-[#ff4625]/10 px-2 py-0.5 rounded">
                {dailyChecklist.filter(c => c.completed).length} / {dailyChecklist.length} Complete
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Complete these three daily rituals to maintain unbroken retention across your CBSE subjects.
            </p>

            <div className="space-y-3">
              {dailyChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                    item.completed 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-zinc-400' 
                      : 'border-white/5 bg-[#08090b] hover:border-white/15 text-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    item.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700 bg-transparent'
                  }`}>
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-medium leading-snug ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COGNITIVE SCIENCE TECHNIQUES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#ff4625]" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                Cognitive Science Techniques
              </h3>
            </div>

            <div className="space-y-4">
              {STUDY_TIPS.map((tip) => {
                const isApplied = appliedTips.includes(tip.id);
                return (
                  <div
                    key={tip.id}
                    className="p-5 border border-white/5 bg-[#08090b] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625]">
                          {tip.subject}
                        </span>
                        <h4 className="font-clash text-base font-bold text-white uppercase">
                          {tip.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {tip.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTip(tip.id)}
                      className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider shrink-0 transition-all ${
                        isApplied
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300'
                      }`}
                    >
                      {isApplied ? 'Applied to Routine' : 'Integrate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudyHub;