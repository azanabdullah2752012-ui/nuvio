import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Zap, MessageSquare, Star, 
  ChevronRight, Download, Share2, Bookmark, Layout, 
  Info, RotateCcw, HelpCircle, X, CheckCircle2, 
  Swords, Trophy, Check, Copy, Play, Compass, Target
} from 'lucide-react';
import { CURRICULUM_DATA } from '../../services/curriculumData';
import { EXPANDED_CURRICULUM } from '../../services/expandedCurriculum';
import { dataService } from '../../services/dataService';
import { xpService } from '../../services/xpService';
import { authService } from '../../services/authService';
import { gamificationService, BOSSES } from '../../services/gamificationService';

// Import sub-components
import ChapterIntro from './ChapterIntro';
import ConceptExplorer from './ConceptExplorer';
import LearningBlocks from './LearningBlocks';
import WorkedExamples from './WorkedExamples';
import PracticeArena from './PracticeArena';
import RevisionSuite from './RevisionSuite';
import MasteryChallenge from './MasteryChallenge';
import ChapterCompletion from './ChapterCompletion';
import CheatsheetDrawer from './CheatsheetDrawer';
import './styles.css';

// Synthetic sound triggers
const playSynthAudio = (type, isMuted) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'boss_hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'complete') {
      const playTone = (freq, start, duration) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, ctx.currentTime + start);
        g.gain.setValueAtTime(0.06, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + start + duration);
        o.start(ctx.currentTime + start);
        o.stop(ctx.currentTime + start + duration);
      };
      playTone(523.25, 0, 0.1);
      playTone(659.25, 0.1, 0.1);
      playTone(783.99, 0.2, 0.1);
      playTone(1046.50, 0.3, 0.25);
    }
  } catch (e) {
    console.warn("Synth blocked.");
  }
};

const SubjectLibraryHub = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, grade } = location.state || { subject: 'Mathematics', grade: '9' };

  // Core view controllers
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Immersive Hub Steps
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // steps 1 to 8
  const [soundMuted, setSoundMuted] = useState(false);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(null);
  const [combatEffects, setCombatEffects] = useState([]);
  const [bossShake, setBossShake] = useState(false);
  const [user, setUser] = useState(authService.me());

  useEffect(() => {
    const handleUserUpdate = (e) => {
      setUser(e.detail);
    };
    window.addEventListener('acadevance_stats_update', handleUserUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUserUpdate);
  }, []);

  const subjectData = CURRICULUM_DATA[grade]?.[subject] || { chapters: [] };

  const startQuest = (chapter) => {
    setSelectedChapter(chapter);
    setImmersiveMode(true);
    setActiveStep(1);
    setCombatEffects([]);
  };

  const handleCopyFormula = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Subject boss sync hook
  const getSubjectBoss = () => {
    const progress = user?.boss_chapter_progress || {};
    const subLower = subject.toLowerCase();

    let bossId = null;
    if (subLower.includes('math') || subLower.includes('algebra') || subLower.includes('geometry')) {
      bossId = ['dragon', 'algebra', 'geometry'].find(id => progress[id]?.status === 'active') || 'dragon';
    } else if (subLower.includes('sci') || subLower.includes('phys') || subLower.includes('chem') || subLower.includes('bio')) {
      bossId = ['cell', 'motion', 'atom'].find(id => progress[id]?.status === 'active') || 'cell';
    } else if (subLower.includes('social') || subLower.includes('hist') || subLower.includes('geo')) {
      bossId = ['empire', 'leviathan'].find(id => progress[id]?.status === 'active') || 'empire';
    }

    if (!bossId) return null;
    const bossMeta = BOSSES.find(b => b.id === bossId);
    const bossProgress = progress[bossId] || { hp: 100, max: 100, status: 'locked' };

    return {
      ...bossMeta,
      hp: bossProgress.hp,
      max: bossProgress.max,
      status: bossProgress.status
    };
  };

  const activeBoss = getSubjectBoss();

  const handleBossDamage = (amount) => {
    gamificationService.dealDamage(subject, amount);
    
    // Spawn floaters
    const id = Date.now() + Math.random();
    const effect = {
      id,
      text: `-${amount} HP 💥`,
      x: Math.floor(Math.random() * 40) + 30,
      y: Math.floor(Math.random() * 30) + 10
    };
    setCombatEffects(prev => [...prev, effect]);
    setBossShake(true);
    playSynthAudio('boss_hit', soundMuted);

    setTimeout(() => setBossShake(false), 300);
    setTimeout(() => {
      setCombatEffects(prev => prev.filter(e => e.id !== id));
    }, 1200);
  };

// Smart option generator to avoid dummy fillers (like A, B, C, D or Option B)
const generateSmartOptions = (correctAnswer, questionText, allQna) => {
  if (!correctAnswer) return ["A", "B", "C", "D"];
  const correct = String(correctAnswer).trim();
  const lowerCorrect = correct.toLowerCase();

  // 1. Check if the correct answer is a clean integer or simple number
  const num = parseFloat(correct);
  if (!isNaN(num) && String(num) === correct) {
    const distractors = new Set();
    distractors.add(String(num + 1));
    distractors.add(String(num - 1));
    distractors.add(String(num * 2));
    distractors.add(String(num + 2));
    distractors.delete(correct);
    
    const optionsList = [correct, ...Array.from(distractors).slice(0, 3)];
    return optionsList.sort(() => Math.random() - 0.5);
  }

  // 2. Check if boolean or simple flags
  if (lowerCorrect === 'true' || lowerCorrect === 'false') {
    return ['True', 'False'];
  }
  if (lowerCorrect === 'yes' || lowerCorrect === 'no') {
    return ['Yes', 'No'];
  }

  // 3. Generate smart offsets if the text contains a number (e.g. "5 units", "20 m/s")
  const numMatch = correct.match(/(-?\d+(?:\.\d+)?)/);
  const distractors = new Set();
  if (numMatch) {
    const originalNumStr = numMatch[1];
    const originalNum = parseFloat(originalNumStr);
    const offsets = [originalNum + 1, originalNum - 1, originalNum * 2, originalNum + 2, Math.max(1, originalNum / 2)];
    offsets.forEach(offset => {
      const formatted = Number.isInteger(offset) ? String(offset) : offset.toFixed(1);
      const replaced = correct.replace(originalNumStr, formatted);
      if (replaced !== correct) {
        distractors.add(replaced);
      }
    });
  }

  // 4. Grab other answers from the same chapter Q&As as realistic options
  if (allQna && allQna.length > 0) {
    allQna.forEach(item => {
      if (item.a && item.a.trim() !== correct && item.a.trim().length < 80) {
        distractors.add(item.a.trim());
      }
    });
  }

  // 5. Plausible academic fallbacks
  const fallbacks = [
    "It cannot be determined from the given information.",
    "None of the mentioned options are correct.",
    "The quantity remains conserved under standard conditions.",
    "It depends on the relative frame of reference.",
    "Both statements are true depending on parameters."
  ];

  let idx = 0;
  while (distractors.size < 3 && idx < fallbacks.length) {
    const val = fallbacks[idx];
    if (val !== correct) {
      distractors.add(val);
    }
    idx++;
  }

  const optionsList = [correct, ...Array.from(distractors).slice(0, 3)];
  return optionsList.sort(() => Math.random() - 0.5);
};

// Resolve curriculum parameters or fallbacks
const getChapterExpandedData = (ch) => {
  const fallback = {
    difficulty: "Medium",
    studyTime: "35 mins",
    whyItMatters: "Forms the absolute gateway to spatial reasoning and structural geometry.",
    realWorld: "Used directly in coordinate designs, mechanical engineering, and game development.",
    recap: ["Calculate formulas accurately.", "Understand core NCERT textbook concepts."],
    concepts: ch.keyIdeas?.map((idea, i) => ({
      id: `con-${i}`,
      title: idea.split(':')[0] || `Key Topic ${i + 1}`,
      definition: idea.split(':')[1] || idea,
      explanation: idea,
      memoryTrick: "Break this down and solve standard mock question exercises.",
      commonMistake: "Failing to check unit offsets."
    })) || [],
    examples: ch.qna?.map((qna, i) => ({
      level: i === 0 ? "Easy" : "Medium",
      title: `Worked Example ${i + 1}`,
      problem: qna.q,
      solution: [qna.a],
      hint: "Look up variables and solve step-by-step."
    })) || [],
    quiz: ch.qna?.map(qna => ({
      q: qna.q,
      options: generateSmartOptions(qna.a, qna.q, ch.qna),
      answer: qna.a,
      explanation: "Aligned with NCERT standard guidelines."
    })) || []
  };

  if (!ch) return fallback;
  const key = ch.title;
  const matched = EXPANDED_CURRICULUM[grade]?.[subject]?.[key];
  if (matched) return { ...fallback, ...matched };
  return fallback;
};

  const chData = selectedChapter ? getChapterExpandedData(selectedChapter) : null;

  // Extract subject formulas
  const allSubjectFormulas = subjectData.chapters.flatMap(ch => 
    (ch.formulas || []).map(f => ({ chapterTitle: ch.title, formula: f }))
  );

  return (
    <div className="min-h-screen pb-32 nv-page-transition bg-background-base text-text-primary overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!immersiveMode ? (
          /* STANDARD SUBJECT OVERVIEW CHAPTERS LIST */
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-10 space-y-12"
          >
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <button 
                onClick={() => navigate('/curriculum')}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4.5 h-4.5" /> Back to Matrix
              </button>
            </div>

            {/* Subject Hero Header */}
            <div className="glass-panel p-8 md:p-12 space-y-4 relative overflow-hidden text-left shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                Class {grade} NCERT Syllabus
              </span>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                {subject}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-semibold">
                Access verified NCERT curriculum outlines, solve worked problems, study flashcards, and run interactive simulations.
              </p>
            </div>

            {/* Sub-Tabs Grid Selector */}
            <div className="flex bg-slate-900/60 p-1.5 border border-white/10 rounded-lg shadow max-w-md mx-auto justify-between">
              {[
                { id: 'chapters', label: 'Timeline Chapters', icon: BookOpen },
                { id: 'formulas', label: 'Subject Formulas', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-500 text-black shadow scale-[1.02]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Content view */}
            <div className="pt-4 text-left">
              {activeTab === 'chapters' && (
                <div className="grid grid-cols-1 gap-6">
                  {subjectData.chapters.map((chapter, i) => (
                    <div 
                      key={i} 
                      className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 border-white/5 hover:border-purple-500/30 transition-all hover:translate-y-[-2px] shadow hover:shadow-[0_8px_32px_rgba(168,85,247,0.1)]"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-350 text-xl font-black shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">
                          {chapter.title}
                        </h3>
                        <p className="text-slate-455 text-xs font-semibold leading-relaxed">
                          {chapter.summary}
                        </p>
                      </div>
                      <button 
                        onClick={() => startQuest(chapter)}
                        className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow active:scale-95 transition-all flex items-center gap-2"
                      >
                        Enter Quest <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'formulas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allSubjectFormulas.map((item, idx) => (
                    <div key={idx} className="glass-panel p-5 space-y-2 relative group hover:border-purple-500/30 transition-all shadow-sm">
                      <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                        {item.chapterTitle}
                      </span>
                      <div className="bg-slate-950 p-3.5 rounded font-mono text-xs text-green-400 border border-white/5 select-all">
                        {item.formula}
                      </div>
                    </div>
                  ))}
                  {allSubjectFormulas.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 font-mono text-xs uppercase">
                      No formula lists recorded in this subject.
                    </div>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* DYNAMIC 8-STEP INTERACTIVE LEARNING HUB VIEW */
          <motion.div
            key="immersive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/98 flex flex-col overflow-hidden text-slate-200"
          >
            {/* Immersive Top Navigation Row */}
            <div className="bg-slate-900/80 border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg relative z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setImmersiveMode(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-350 tracking-widest rounded transition-all active:scale-95 shadow"
                >
                  <ArrowLeft className="w-4 h-4 text-purple-400 shrink-0" /> Close Hub
                </button>
                <div className="h-6 w-[1px] bg-white/10" />
                <div className="text-left space-y-0.5">
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest leading-none block">
                    Class {grade} {subject} Quest
                  </span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                    {selectedChapter.title}
                  </h2>
                </div>
              </div>

              {/* Combat Overlay HUD for bosses */}
              <div className="flex items-center gap-6 relative">
                {activeBoss && activeBoss.hp > 0 && (
                  <motion.div 
                    animate={bossShake ? { x: [-5, 5, -5, 5, 0] } : {}}
                    className="flex items-center gap-3 bg-slate-950 px-4 py-1.5 border border-white/10 rounded-full relative"
                  >
                    {/* Floating damage effect output */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {combatEffects.map(effect => (
                        <span
                          key={effect.id}
                          className="absolute text-rose-500 font-black text-xl combat-floater select-none"
                          style={{ left: `${effect.x}%`, top: `-20px` }}
                        >
                          {effect.text}
                        </span>
                      ))}
                    </div>

                    <span className="text-xl animate-bounce shrink-0 select-none">{activeBoss.emoji}</span>
                    <div className="text-[9px] text-left shrink-0">
                      <span className="block font-black text-rose-400 uppercase tracking-widest leading-none">{activeBoss.name}</span>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase font-mono mt-0.5">HP: {activeBoss.hp}/{activeBoss.max}</span>
                    </div>
                  </motion.div>
                )}

                {/* Formula cheatsheet quick link */}
                <button
                  onClick={() => setShowFormulaDrawer(true)}
                  className="px-4 py-2 border border-white/10 bg-slate-800 hover:bg-slate-700 text-[9px] font-black uppercase text-slate-350 tracking-widest rounded transition-colors"
                >
                  Equations
                </button>
              </div>
            </div>

            {/* Immersive Main Area split: Progress Timeline Steps Sidebar (left) and Core Study Panels (right) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
              {/* Horizontal Steps Bar for Mobile/Tablet */}
              <div className="md:hidden bg-slate-900/90 border-b border-white/10 p-3 shrink-0 overflow-x-auto flex gap-2.5 no-scrollbar z-20">
                {[
                  { id: 1, label: '1. Intro', icon: Play },
                  { id: 2, label: '2. Concepts', icon: Star },
                  { id: 3, label: '3. Blocks', icon: Layout },
                  { id: 4, label: '4. Worked', icon: Compass },
                  { id: 5, label: '5. Practice', icon: HelpCircle },
                  { id: 6, label: '6. Revision', icon: Zap },
                  { id: 7, label: '7. Mastery', icon: Trophy },
                  { id: 8, label: '8. Complete', icon: CheckCircle2 }
                ].map(step => {
                  const isActive = activeStep === step.id;
                  const isUnlocked = step.id <= activeStep;

                  return (
                    <button
                      key={step.id}
                      onClick={() => isUnlocked && setActiveStep(step.id)}
                      disabled={!isUnlocked}
                      className={`flex items-center gap-1.5 px-3.5 py-2 border rounded whitespace-nowrap text-[9px] font-black uppercase tracking-wider transition-all ${
                        isActive 
                          ? 'bg-purple-500 text-black border-transparent shadow' 
                          : isUnlocked 
                            ? 'bg-slate-950 border-white/5 text-slate-350 hover:bg-slate-850' 
                            : 'bg-slate-950/40 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <step.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Timeline Steps Progress Sidebar */}
              <div className="hidden md:flex w-72 bg-slate-900/40 border-r border-white/10 p-5 flex-col justify-between shrink-0 overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                  <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 text-left">
                    Quest Roadmap Flow
                  </span>

                  <nav className="space-y-2">
                    {[
                      { id: 1, label: '1. Chapter Intro', icon: Play },
                      { id: 2, label: '2. Concept Explorer', icon: Star },
                      { id: 3, label: '3. Interactive Blocks', icon: Layout },
                      { id: 4, label: '4. Worked Examples', icon: Compass },
                      { id: 5, label: '5. Practice Arena', icon: HelpCircle },
                      { id: 6, label: '6. Revision Suite', icon: Zap },
                      { id: 7, label: '7. Mastery Challenge', icon: Trophy },
                      { id: 8, label: '8. Completion Stats', icon: CheckCircle2 }
                    ].map(step => {
                      const isActive = activeStep === step.id;
                      const isUnlocked = step.id <= activeStep;

                      return (
                        <button
                          key={step.id}
                          onClick={() => isUnlocked && setActiveStep(step.id)}
                          disabled={!isUnlocked}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 rounded text-left text-[11px] font-black uppercase tracking-widest transition-all ${
                            isActive 
                              ? 'bg-purple-500 text-black border-transparent shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                              : isUnlocked 
                                ? 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-850' 
                                : 'bg-slate-950 border-white/5 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <step.icon className="w-4 h-4 shrink-0" />
                          <span>{step.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Progress Indicators footer */}
                <div className="p-4 bg-slate-900 border border-white/5 rounded-lg text-left shadow">
                  <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    Quest Completion
                  </span>
                  <strong className="block text-lg font-black text-purple-400 font-mono mt-1">
                    {Math.round(((activeStep - 1) / 7) * 100)}%
                  </strong>
                  <div className="h-2 w-full bg-black border border-white/5 rounded-full overflow-hidden p-0.5 mt-2">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${((activeStep - 1) / 7) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Core Study Step Panel viewport (Right column) */}
              <div className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto bg-slate-950/20 relative z-10">
                <AnimatePresence mode="wait">
                  
                  {activeStep === 1 && (
                    <ChapterIntro 
                      key="step1"
                      chapter={chData}
                      subject={subject}
                      grade={grade}
                      onStart={() => setActiveStep(2)}
                    />
                  )}

                  {activeStep === 2 && (
                    <ConceptExplorer
                      key="step2"
                      concepts={chData.concepts}
                      quiz={chData.quiz}
                      chapterTitle={selectedChapter.title}
                      subject={subject}
                      grade={grade}
                    />
                  )}

                  {activeStep === 3 && (
                    <LearningBlocks
                      key="step3"
                      subject={subject}
                      chapter={selectedChapter}
                      grade={grade}
                    />
                  )}

                  {activeStep === 4 && (
                    <WorkedExamples
                      key="step4"
                      examples={chData.examples}
                    />
                  )}

                  {activeStep === 5 && (
                    <PracticeArena
                      key="step5"
                      questions={chData.quiz}
                      subject={subject}
                      onCorrectAnswer={handleBossDamage}
                      playSound={(t) => playSynthAudio(t, soundMuted)}
                    />
                  )}

                  {activeStep === 6 && (
                    <RevisionSuite
                      key="step6"
                      chapter={selectedChapter}
                      subject={subject}
                    />
                  )}

                  {activeStep === 7 && (
                    <MasteryChallenge
                      key="step7"
                      questions={chData.quiz}
                      playSound={(t) => playSynthAudio(t, soundMuted)}
                      onComplete={() => setActiveStep(8)}
                    />
                  )}

                  {activeStep === 8 && (
                    <ChapterCompletion
                      key="step8"
                      chapter={selectedChapter}
                      subject={subject}
                      onReturn={() => {
                        setImmersiveMode(false);
                        setSelectedChapter(null);
                      }}
                    />
                  )}

                </AnimatePresence>

                {/* Bottom Navigation controls (Only shown on non-completed final stages) */}
                {activeStep < 8 && (
                  <div className="max-w-4xl mx-auto flex justify-between pt-10 border-t border-white/5 mt-10">
                    <button
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className="px-5 py-3 border border-white/10 bg-slate-900 hover:bg-slate-800 disabled:opacity-35 text-[10px] font-black uppercase text-slate-350 tracking-widest rounded shadow active:scale-95 transition-all"
                    >
                      ◀ Back Step
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="px-5 py-3 border border-transparent bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded shadow active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      Continue Quest <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Formulas cheatsheet drawer */}
            <CheatsheetDrawer 
              isOpen={showFormulaDrawer}
              onClose={() => setShowFormulaDrawer(false)}
              formulas={allSubjectFormulas}
              copiedFormula={copiedFormula}
              onCopy={handleCopyFormula}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectLibraryHub;
