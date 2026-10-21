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
    <div className="min-h-screen pb-32 nv-page-transition bg-[#fbfbfa] text-[#1a1917] overflow-x-hidden font-sans">
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
            <div className="flex items-center justify-between border-b border-[#e5e1d5] pb-4">
              <button 
                onClick={() => navigate('/curriculum')}
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#52504a] hover:text-[#1a1917] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Curriculum Matrix
              </button>
            </div>

            {/* Subject Hero Header */}
            <div className="p-8 md:p-12 border border-[#e5e1d5] bg-white rounded-2xl space-y-4 relative overflow-hidden text-left shadow-[0_4px_24px_rgba(27,59,43,0.04)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
                  CBSE Class {grade} NCERT Syllabus
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1917] leading-tight">
                {subject}
              </h1>
              <p className="text-[#52504a] text-sm max-w-2xl leading-relaxed">
                Access verified NCERT curriculum outlines, solve worked problems, study flashcards, and run interactive simulations.
              </p>
            </div>

            {/* Sub-Tabs Grid Selector */}
            <div className="flex bg-[#f5f3ec] p-1.5 border border-[#e5e1d5] rounded-xl shadow-sm max-w-md mx-auto justify-between">
              {[
                { id: 'chapters', label: 'Timeline Chapters', icon: BookOpen },
                { id: 'formulas', label: 'Subject Formulas', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#1b3b2b] text-white shadow-sm font-bold' 
                      : 'text-[#52504a] hover:text-[#1a1917]'
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
                      className="p-6 md:p-8 border border-[#e5e1d5] bg-white rounded-2xl flex flex-col md:flex-row md:items-center gap-6 shadow-[0_2px_12px_rgba(27,59,43,0.03)] hover:border-[#1b3b2b]/40 transition-all"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] text-lg font-serif font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-serif font-bold text-[#1a1917]">
                          {chapter.title}
                        </h3>
                        <p className="text-[#52504a] text-xs leading-relaxed">
                          {chapter.summary}
                        </p>
                      </div>
                      <button 
                        onClick={() => startQuest(chapter)}
                        className="px-6 py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-[0_2px_8px_rgba(27,59,43,0.2)] active:scale-95 transition-all flex items-center gap-2 shrink-0"
                      >
                        Enter Study Unit <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'formulas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allSubjectFormulas.map((item, idx) => (
                    <div key={idx} className="p-5 border border-[#e5e1d5] bg-white rounded-2xl space-y-2 shadow-[0_2px_12px_rgba(27,59,43,0.03)] hover:border-[#1b3b2b]/30 transition-all">
                      <span className="block text-[10px] font-mono text-[#1b3b2b] uppercase tracking-wider font-bold">
                        {item.chapterTitle}
                      </span>
                      <div className="bg-[#fbfbfa] p-3.5 rounded-lg font-mono text-xs text-[#1a1917] border border-[#e5e1d5] select-all">
                        {item.formula}
                      </div>
                    </div>
                  ))}
                  {allSubjectFormulas.length === 0 && (
                    <div className="col-span-full text-center py-12 text-[#827f76] font-mono text-xs uppercase">
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
            className="fixed inset-0 z-50 bg-[#fbfbfa] flex flex-col overflow-hidden text-[#1a1917] font-sans"
          >
            {/* Immersive Top Navigation Row */}
            <div className="bg-white/95 backdrop-blur-md border-b border-[#e5e1d5] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm relative z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setImmersiveMode(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#e5e1d5] bg-[#f5f3ec] hover:bg-[#ede9de] text-[10px] font-mono font-bold uppercase text-[#1a1917] tracking-widest rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-[#1b3b2b] shrink-0" /> Close Study Unit
                </button>
                <div className="h-6 w-[1px] bg-[#e5e1d5]" />
                <div className="text-left space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#1b3b2b] uppercase tracking-widest leading-none block">
                    Class {grade} {subject} Syllabus
                  </span>
                  <h2 className="text-lg font-serif font-bold text-[#1a1917] leading-none">
                    {selectedChapter.title}
                  </h2>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4">
                {/* Formula cheatsheet quick link */}
                <button
                  onClick={() => setShowFormulaDrawer(true)}
                  className="px-4 py-2 border border-[#e5e1d5] bg-[#f5f3ec] hover:bg-[#ede9de] text-[10px] font-mono font-semibold uppercase text-[#52504a] tracking-widest rounded-lg transition-colors"
                >
                  Reference Formulas
                </button>
              </div>
            </div>

            {/* Immersive Main Area split: Progress Timeline Steps Sidebar (left) and Core Study Panels (right) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
              {/* Horizontal Steps Bar for Mobile/Tablet */}
              <div className="md:hidden bg-[#f8f6f0] border-b border-[#e5e1d5] p-3 shrink-0 overflow-x-auto flex gap-2.5 no-scrollbar z-20">
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
                      className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg whitespace-nowrap text-[10px] font-mono uppercase tracking-wider transition-all ${
                        isActive 
                          ? 'bg-[#1b3b2b] text-white border-transparent shadow-sm font-bold' 
                          : isUnlocked 
                            ? 'bg-white border-[#e5e1d5] text-[#1a1917] hover:bg-[#fbfbfa]' 
                            : 'bg-[#f5f3ec] border-[#e5e1d5] text-[#827f76] cursor-not-allowed opacity-40'
                      }`}
                    >
                      <step.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Timeline Steps Progress Sidebar */}
              <div className="hidden md:flex w-72 bg-[#f8f6f0] border-r border-[#e5e1d5] p-5 flex-col justify-between shrink-0 overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                  <span className="block text-[9px] font-mono font-bold text-[#827f76] uppercase tracking-[0.2em] border-b border-[#e5e1d5] pb-2 text-left">
                    Curriculum Study Flow
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
                          className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-left text-xs font-mono uppercase tracking-wider transition-all ${
                            isActive 
                              ? 'bg-[#1b3b2b] text-white border-transparent shadow-sm font-bold' 
                              : isUnlocked 
                                ? 'bg-white border-[#e5e1d5] text-[#1a1917] hover:bg-[#fbfbfa]' 
                                : 'bg-[#f8f6f0] border-[#e5e1d5] text-[#827f76] cursor-not-allowed opacity-40'
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
                <div className="p-4 bg-white border border-[#e5e1d5] rounded-xl text-left shadow-sm">
                  <span className="block text-[9px] font-mono text-[#827f76] uppercase tracking-widest leading-none">
                    Unit Progress
                  </span>
                  <strong className="block text-xl font-serif font-bold text-[#1b3b2b] mt-1">
                    {Math.round(((activeStep - 1) / 7) * 100)}%
                  </strong>
                  <div className="h-2 w-full bg-[#ede9de] rounded-full overflow-hidden p-0.5 mt-2">
                    <div className="h-full bg-[#1b3b2b] rounded-full transition-all duration-300" style={{ width: `${((activeStep - 1) / 7) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Core Study Step Panel viewport (Right column) */}
              <div className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto bg-[#fbfbfa] relative z-10">
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
                  <div className="max-w-4xl mx-auto flex justify-between pt-10 border-t border-[#e5e1d5] mt-10">
                    <button
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className="px-5 py-3 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] disabled:opacity-35 text-xs font-mono uppercase text-[#52504a] tracking-wider rounded-xl shadow-sm active:scale-95 transition-all"
                    >
                      ◀ Previous Step
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="px-6 py-3 border border-transparent bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(27,59,43,0.2)] active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      Continue Unit <ChevronRight className="w-4 h-4 shrink-0" />
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
