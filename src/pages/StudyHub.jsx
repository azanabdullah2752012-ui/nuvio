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
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Academic Disciplines / Workstation & Protocols
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Study Arsenal
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Evidence-based cognitive retention frameworks, daily discipline protocols, and direct launchers to academic modules.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-[#e5e1d5] px-5 py-3 rounded-xl shadow-sm self-start md:self-end">
          <Clock className="w-4 h-4 text-[#1b3b2b]" />
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[#827f76]">Curriculum Tier</span>
            <span className="font-mono text-xs font-bold text-[#1a1917]">Class {user?.grade_level || '9th'} CBSE</span>
          </div>
        </div>
      </header>

      {/* WORKSPACE LAUNCHERS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#52504a] font-bold">
            Academic Modules & Tools
          </h2>
          <span className="font-mono text-[10px] text-[#827f76] uppercase">5 Workstation Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKSPACE_MODULES.map((mod) => (
            <div
              key={mod.name}
              onClick={() => navigate(mod.path)}
              className="p-6 border border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/40 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between h-44 shadow-[0_2px_12px_rgba(27,59,43,0.03)]"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] group-hover:bg-[#1b3b2b] group-hover:text-white transition-colors">
                  <mod.icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#827f76] group-hover:text-[#1b3b2b] transition-all group-hover:translate-x-1" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1a1917] group-hover:text-[#1b3b2b] transition-colors">
                  {mod.name}
                </h3>
                <p className="text-xs text-[#52504a] mt-1 leading-relaxed line-clamp-2">
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
          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-[0_4px_20px_rgba(27,59,43,0.04)] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1b3b2b]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#1a1917] font-bold">
                  Daily Protocols
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#1b3b2b] bg-[#1b3b2b]/10 border border-[#1b3b2b]/20 px-2 py-0.5 rounded font-bold">
                {dailyChecklist.filter(c => c.completed).length} / {dailyChecklist.length} Complete
              </span>
            </div>

            <p className="text-xs text-[#52504a] leading-relaxed">
              Complete these three daily rituals to maintain unbroken retention across your CBSE subjects.
            </p>

            <div className="space-y-3">
              {dailyChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                    item.completed 
                      ? 'border-[#e5e1d5] bg-[#fbfbfa] text-[#827f76]' 
                      : 'border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/30 text-[#1a1917] shadow-sm'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    item.completed ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white' : 'border-[#827f76] bg-white'
                  }`}>
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-medium leading-snug ${item.completed ? 'line-through text-[#827f76]' : 'text-[#1a1917]'}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COGNITIVE SCIENCE TECHNIQUES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 border border-[#e5e1d5] bg-white rounded-2xl shadow-[0_4px_20px_rgba(27,59,43,0.04)] space-y-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#1b3b2b]" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#1a1917] font-bold">
                Cognitive Science Techniques
              </h3>
            </div>

            <div className="space-y-4">
              {STUDY_TIPS.map((tip) => {
                const isApplied = appliedTips.includes(tip.id);
                return (
                  <div
                    key={tip.id}
                    className="p-5 border border-[#e5e1d5] bg-[#fbfbfa] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#1b3b2b] font-bold">
                          {tip.subject}
                        </span>
                        <h4 className="font-serif text-base font-bold text-[#1a1917]">
                          {tip.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#52504a] leading-relaxed font-sans">
                        {tip.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTip(tip.id)}
                      className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider shrink-0 transition-all ${
                        isApplied
                          ? 'bg-[#1b3b2b]/10 border border-[#1b3b2b]/30 text-[#1b3b2b] font-bold'
                          : 'bg-[#1b3b2b] hover:bg-[#26523c] text-white shadow-sm font-semibold'
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