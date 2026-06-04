import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, TrendingUp, Lightbulb, 
  CheckCircle2, Zap, Clock, ArrowRight,
  BookMarked, Timer, Target, Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const STUDY_TIPS = [
  { id: 't1', title: 'Active Recall', desc: 'Instead of just re-reading notes, close the book and write down everything you remember. This strengthens retrieval pathways in the brain.', reward: 15, applied: false },
  { id: 't2', title: 'Spaced Repetition', desc: 'Review your flashcards at increasing intervals (1 day, 3 days, 7 days) rather than cramming all at once to move info to long-term memory.', reward: 15, applied: false },
  { id: 't3', title: 'Feynman Technique', desc: 'Explain a complex CBSE concept (like Newton\'s 1st Law) in simple terms as if teaching a 10-year-old. If you struggle, review that section.', reward: 15, applied: false },
  { id: 't4', title: 'Pomodoro Method', desc: 'Study with absolute focus for 25 minutes, then take a 5-minute break. This prevents mental fatigue and keeps focus high.', reward: 15, applied: false },
  { id: 't5', title: 'Interleaved Practice', desc: 'Mix different subjects or topics in a single study session (e.g., alternating between Math and Science problems) to improve problem-solving adaptability.', reward: 15, applied: false }
];

const QUICK_LINKS = [
  { name: 'CBSE Hub', path: '/curriculum', desc: 'Official syllabus & chapters', icon: BookOpen, color: 'bg-nuvio-blue text-nuvio-blue' },
  { name: 'Flashcard Vault', path: '/flashcards', desc: 'Mnemonic study decks', icon: BookMarked, color: 'bg-nuvio-purple-500 text-nuvio-purple-500' },
  { name: 'Focus Timer', path: '/focus-timer', desc: 'Structured study blocks', icon: Timer, color: 'bg-nuvio-orange text-nuvio-orange' },
  { name: 'Mission Command', path: '/homework', desc: 'Manage study tasks', icon: Target, color: 'bg-nuvio-red text-nuvio-red' },
  { name: 'Trivia Games', path: '/study-verse', desc: 'Subject Monopoly, Ludo & Uno', icon: Gamepad2, color: 'bg-nuvio-cyan text-nuvio-cyan' }
];

const StudyHub = () => {
  const [user, setUser] = useState(authService.me());
  const [tips, setTips] = useState(() => {
    const saved = localStorage.getItem('acadevance_applied_tips');
    if (saved) {
      const parsed = JSON.parse(saved);
      return STUDY_TIPS.map(t => parsed.includes(t.id) ? { ...t, applied: true } : t);
    }
    return STUDY_TIPS;
  });

  const [challenges, setChallenges] = useState([
    { id: 'c1', title: 'Complete a 25m Focus Block', reward: 50, completed: false },
    { id: 'c2', title: 'Review Science Flashcards', reward: 50, completed: false },
    { id: 'c3', title: 'Play a game in StudyVerse', reward: 50, completed: false }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  const handleApplyTip = async (tipId, reward) => {
    const updatedTips = tips.map(t => t.id === tipId ? { ...t, applied: true } : t);
    setTips(updatedTips);
    
    const appliedIds = updatedTips.filter(t => t.applied).map(t => t.id);
    localStorage.setItem('acadevance_applied_tips', JSON.stringify(appliedIds));

    await xpService.awardXp(reward, `Applied Technique: ${tips.find(t => t.id === tipId).title}`);
    notificationService.send("Technique Applied!", `+${reward} XP secured.`, "success");
  };

  const handleCompleteChallenge = async (id, title, reward) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, completed: true } : c));
    await xpService.awardXp(reward, `Daily Challenge: ${title}`);
    notificationService.send("Challenge Completed!", `+${reward} XP awarded.`, "success");
  };

  return (
    <div className="space-y-12 pb-32 nv-page-transition">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-nuvio-purple-400" />
            Study Hub
          </h1>
          <p className="text-text-secondary font-medium mt-1">
            Repositioned for curriculum mastery, structured progression, and daily challenges.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
          <Award className="w-5 h-5 text-nuvio-yellow" />
          <span className="text-sm font-black text-white">Level {user?.level || 1} Scholar</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: QUICK LINKS & CHALLENGES */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* DAILY CHALLENGES */}
          <section className="space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-5 h-5 text-nuvio-yellow fill-nuvio-yellow" /> Daily Study Challenges
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {challenges.map(c => (
                <div 
                  key={c.id} 
                  className={`nv-card p-6 border-2 transition-all flex items-center justify-between
                    ${c.completed ? 'border-nuvio-green/20 bg-nuvio-green/5' : 'border-white/5 bg-white/[0.01]'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                      ${c.completed ? 'bg-nuvio-green border-nuvio-green text-black' : 'border-white/10 text-text-muted'}`}
                    >
                      {c.completed && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${c.completed ? 'line-through text-text-muted' : 'text-white'}`}>{c.title}</h3>
                      <span className="text-[10px] text-nuvio-yellow font-black uppercase tracking-wider">+{c.reward} XP</span>
                    </div>
                  </div>
                  {!c.completed && (
                    <button 
                      onClick={() => handleCompleteChallenge(c.id, c.title, c.reward)}
                      className="px-4 py-2 bg-white/5 hover:bg-nuvio-purple-500 text-white hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* QUICK LINKS */}
          <section className="space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-5 h-5 text-nuvio-blue" /> Curriculum Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUICK_LINKS.map(link => (
                <div 
                  key={link.name} 
                  onClick={() => navigate(link.path)}
                  className="nv-card p-8 border-white/5 hover:border-nuvio-purple-500/40 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group flex items-start gap-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className={`p-4 rounded-xl ${link.color} bg-white/5 flex items-center justify-center`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-white uppercase group-hover:text-nuvio-purple-400 transition-colors">{link.name}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{link.desc}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-[9px] font-black text-nuvio-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Go To Section <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: COGNITIVE SCIENCE TIPS */}
        <div className="space-y-8">
          <section className="nv-card p-8 border-white/5 bg-white/[0.02]">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-nuvio-yellow fill-nuvio-yellow" /> Study Techniques
            </h2>
            <div className="space-y-6">
              {tips.map(tip => (
                <div key={tip.id} className="border-b border-white/5 pb-6 last:border-b-0 last:pb-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">{tip.title}</h3>
                    <span className="text-[9px] font-bold text-nuvio-purple-400">+{tip.reward} XP</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">{tip.desc}</p>
                  
                  {tip.applied ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-nuvio-green font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Applied to study routine
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleApplyTip(tip.id, tip.reward)}
                      className="w-full py-2 bg-white/5 hover:bg-nuvio-purple-500 text-white hover:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Read & Apply to routine
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ACADEMIC PROGRESS SUMMARY */}
          <section className="nv-card p-8 border-white/5 bg-gradient-to-br from-nuvio-purple-600/10 to-transparent">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">Mastery Progression</h2>
            <p className="text-xs text-text-secondary leading-relaxed font-medium mb-6">
              Acadevance works by reinforcing CBSE syllabus mastery. Check off daily objectives, play games in the StudyVerse, and claim tokens to buy cosmetic upgrades in the Shop.
            </p>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-text-muted">
              <span>Next Milestone</span>
              <span className="text-white">Level {user?.level ? user.level + 1 : 2}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudyHub;
