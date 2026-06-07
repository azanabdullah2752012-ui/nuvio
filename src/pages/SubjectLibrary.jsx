import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Zap, 
  MessageSquare, Star, ChevronRight,
  Download, Share2, Bookmark, Layout,
  Info, RotateCcw, HelpCircle, X, CheckCircle2,
  Swords, Trophy, Check, Copy, HelpCircle as HelpIcon,
  Play, Pause, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM_DATA } from '../services/curriculumData';
import { EXPANDED_CURRICULUM } from '../services/expandedCurriculum';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { gamificationService, BOSSES } from '../services/gamificationService';

const ELI5_ANALOGIES = {
  "Coordinate Geometry": "Imagine a completely empty movie theater. To find your seat, you walk along the front row (x-axis) and then go up the aisle (y-axis) from the entrance (origin). Those two numbers, like Row 3 Seat 4, are coordinates!",
  "Linear Polynomials": "Think of a slide that goes down at a perfectly steady rate. For every meter you walk forward, you drop exactly 30 centimeters. It never changes speed or bends, just a straight line!",
  "The World of Numbers": "Numbers are like a set of nesting dolls. You start with standard counting numbers (1,2,3). Then you add zero, then negative numbers (like owing a friend a cookie), then fractions, and finally irrational numbers like Pi that never end!",
  "Science Exploration": "Science is like playing detective in the universe. You write down clues, guess how the criminal operates (making a model), and write down measurements so other detectives on the other side of the world can understand your clues!",
  "Cell: The Building Block": "Think of a cell as a micro-sized city! The plasma membrane is the city border checkpoint, the nucleus is city hall containing the blueprint records (DNA), and the mitochondria are power stations generating battery packs (ATP)!",
  "Tissues in Action": "Tissues are like specialized team members. Muscle cells are the pull-team that contract together to move bones. Nerve cells are the fiber-optic communication team sending instant electric messages. Working together, they form a functional body team!",
  "Describing Motion Around Us": "Imagine you are running a race. The distance is the actual steps you ran, displacement is the straight line from start to finish. Speed is how fast your legs moved, and acceleration is how quickly you kicked into high gear!"
};

const SubjectLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, grade } = location.state || { subject: 'Mathematics', grade: '9' };
  
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Immersive Deep Learning Flow states
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [immersiveStep, setImmersiveStep] = useState('overview');
  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const [revealExampleIdx, setRevealExampleIdx] = useState(null);
  const [quizScores, setQuizScores] = useState({});
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [plottedPoint, setPlottedPoint] = useState({ x: 2, y: 3 });
  const [simPlay, setSimPlay] = useState(false);
  const [simPos, setSimPos] = useState(0);
  const [activeChar, setActiveChar] = useState('krishtakka');
  
  // Dynamic progress saving states
  const [hasSavedQuiz, setHasSavedQuiz] = useState(false);
  const [flashcardScores, setFlashcardScores] = useState({ mastered: [], tricky: [] });
  const [hasSavedRecall, setHasSavedRecall] = useState(false);

  // NEW Interactivity states
  const [eli5Mode, setEli5Mode] = useState(false);
  const [conceptChallengeFlipped, setConceptChallengeFlipped] = useState({});
  const [unlockedSteps, setUnlockedSteps] = useState({});
  const [activeQuizIdx, setActiveQuizIdx] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [solvePredictions, setSolvePredictions] = useState({}); // { exampleIdx_stepIdx: true/false }

  // Physics motion simulation effect
  useEffect(() => {
    let interval;
    if (simPlay) {
      interval = setInterval(() => {
        setSimPos(prev => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [simPlay]);

  const subjectData = CURRICULUM_DATA[grade]?.[subject] || { chapters: [] };

  const startImmersiveStudy = (chapter) => {
    setSelectedChapter(chapter);
    setImmersiveMode(true);
    setImmersiveStep('overview');
    setSelectedConceptId(null);
    setRevealExampleIdx(null);
    setQuizScores({});
    setActiveCardIdx(0);
    setCardFlipped(false);
    setSimPlay(false);
    setSimPos(0);
    setHasSavedQuiz(false);
    setFlashcardScores({ mastered: [], tricky: [] });
    setHasSavedRecall(false);
    
    // Reset new interactivity states
    setEli5Mode(false);
    setConceptChallengeFlipped({});
    setUnlockedSteps({});
    setActiveQuizIdx(0);
    setQuizStreak(0);
    setSolvePredictions({});
  };

  const handleInjectCards = async (chapter) => {
    const deck = {
      title: `NCERT: ${chapter.title}`,
      subject: subject,
      cards: chapter.flashcards
    };
    await dataService.create('decks', deck);
    navigate('/flashcards');
  };

  // Subject boss hook
  const getActiveBoss = () => {
    const user = authService.me();
    if (!user) return null;
    const progress = user.boss_chapter_progress || {};
    const subLower = subject.toLowerCase();

    let bossId = null;
    if (subLower.includes('math')) {
      bossId = ['dragon', 'algebra', 'geometry'].find(id => progress[id]?.status === 'active') || 'geometry';
    } else if (subLower.includes('sci') || subLower.includes('phys') || subLower.includes('chem')) {
      bossId = ['cell', 'motion', 'atom'].find(id => progress[id]?.status === 'active') || 'atom';
    } else if (subLower.includes('social') || subLower.includes('hist') || subLower.includes('geo')) {
      bossId = ['empire', 'leviathan'].find(id => progress[id]?.status === 'active') || 'leviathan';
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

  return (
    <div className="min-h-screen pb-32 nv-page-transition bg-background-base">
      {/* 🧭 NAVIGATION */}
      <div className="bg-background-base/80 border-b-2 border-black sticky top-0 z-50 px-8 py-6 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/curriculum')} className="flex items-center gap-2 text-text-secondary hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Matrix
          </button>
          <div className="flex items-center gap-4">
             <button className="p-3 border border-transparent rounded-xl hover:bg-white/5 transition-colors text-text-muted hover:text-white"><Share2 className="w-5 h-5" /></button>
             <button className="p-3 border border-transparent rounded-xl hover:bg-white/5 transition-colors text-text-muted hover:text-white"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* 🏛️ SUBJECT HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-purple-500 border border-black text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-sm shadow-[2px_2px_0_#000]">
               Class {grade} NCERT
            </span>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none text-shadow-nb">
              {subject}
            </h1>
            <p className="text-text-secondary font-medium max-w-xl">
              Access verified study modules, pre-made flashcards, and the Curriculum Q&A bank for the official CBSE syllabus.
            </p>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-sm border-2 border-black shadow-[4px_4px_0_#000]">
             {[
               { id: 'chapters', label: 'Chapters', icon: BookOpen },
               { id: 'qna', label: 'Q&A Bank', icon: MessageSquare },
               { id: 'cards', label: 'Flashcards', icon: Zap }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab.id ? 'bg-purple-500 text-black border border-black shadow-[2px_2px_0_#000] scale-[1.02]' : 'text-text-secondary hover:text-white'
                 }`}
               >
                 <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* 📑 CONTENT AREA */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'chapters' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 gap-6"
              >
                {subjectData.chapters.map((chapter, i) => (
                  <div key={i} className="nv-card border-black bg-slate-900/60 p-8 transition-all hover:translate-x-1 hover:shadow-[12px_12px_0_#000] flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-20 h-20 rounded-xl bg-slate-950 border-2 border-black flex items-center justify-center text-text-secondary group-hover:bg-purple-500 group-hover:text-black transition-all duration-500 shrink-0 shadow-[4px_4px_0_#000]">
                       <span className="text-2xl font-black">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight">{chapter.title}</h3>
                       <p className="text-text-secondary text-sm leading-relaxed">{chapter.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => startImmersiveStudy(chapter)}
                         className="px-10 py-4 bg-purple-500 border-2 border-black text-black rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-3 shadow-[4px_4px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                       >
                         Study <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'qna' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {subjectData.chapters.flatMap(c => c.qna).map((qa, i) => (
                  <div key={i} className="nv-card border-black bg-slate-900/40 p-10 transition-all">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg border border-black bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-black">Q</div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Curriculum Q&A Module</span>
                     </div>
                     <h4 className="text-xl font-black text-white mb-6 leading-tight">{qa.q}</h4>
                     <div className="p-6 bg-slate-950 rounded-[4px] border-2 border-black text-text-secondary font-medium leading-relaxed shadow-[4px_4px_0_#000]">
                        <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-3">Verified Answer</div>
                        {qa.a}
                     </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'cards' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {subjectData.chapters.flatMap(c => c.flashcards).map((card, i) => (
                  <div key={i} className="nv-card border-black bg-slate-900/40 border-b-4 border-b-purple-500 p-8 aspect-square flex flex-col justify-between hover:shadow-[12px_12px_0_#000] hover:translate-y-[-4px]">
                     <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-black flex items-center justify-center text-purple-400">
                        <Zap className="w-5 h-5 fill-current" />
                     </div>
                     <h4 className="text-lg font-black text-white uppercase tracking-tight">{card.front}</h4>
                     <div className="pt-4 border-t border-white/5 text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center justify-between">
                        <span>Click STUDY on chapter to practice</span>
                        <Star className="w-4 h-4" />
                     </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 📖 DEEP LEARNING IMMERSIVE HUB */}
      <AnimatePresence>
        {selectedChapter && immersiveMode && (() => {
          // Resolve expanded notes or fallback to dynamic values
          const expanded = EXPANDED_CURRICULUM[grade]?.[subject]?.[selectedChapter.title] || (() => {
            return {
              difficulty: "Medium",
              studyTime: "35 mins",
              pyqPattern: "CBSE evaluates this chapter through fundamental definition checks and factual descriptions in short answer formats (2-4 marks).",
              overview: {
                intro: selectedChapter.summary,
                realWorld: "This topic relates directly to everyday phenomena, helping us structure logical thinking and build real-world systems.",
                whyItMatters: "Understanding these core principles forms the foundation of advanced curriculum and scientific thinking."
              },
              concepts: selectedChapter.keyIdeas?.map((idea, idx) => ({
                id: `concept-${idx}`,
                title: idea.split(':')[0] || `Core Concept ${idx + 1}`,
                definition: idea.split(':')[1] || idea,
                explanation: idea,
                memoryTrick: "Break this concept down into smaller keywords and connect it with an analogy.",
                commonMistake: "Failing to read the question parameters carefully or mixing up standard terminology."
              })) || [],
              examples: selectedChapter.qna?.map((qna, idx) => ({
                level: idx === 0 ? "Easy" : idx === 1 ? "Medium" : "HOTS",
                title: `Application Problem ${idx + 1}`,
                problem: qna.q,
                solution: [qna.a]
              })) || [],
              quiz: selectedChapter.qna?.map((qna, idx) => ({
                type: "mcq",
                q: qna.q,
                options: [qna.a, "Incorrect Option A", "Incorrect Option B", "None of the above"],
                answer: qna.a,
                explanation: "Verified directly from the standard NCERT curriculum key guidelines."
              })) || [],
              recap: selectedChapter.keyIdeas || ["Review the full chapter summary.", "Practice the pre-loaded flashcard deck."]
            };
          })();

          const currentConcept = expanded.concepts.find(c => c.id === selectedConceptId) || expanded.concepts[0];
          const subjectBoss = getActiveBoss();

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col overflow-hidden"
            >
              {/* Immersive Top Bar */}
              <div className="bg-slate-900 border-b-4 border-black px-8 py-5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-[0_4px_0_#000]">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setImmersiveMode(false);
                      setSelectedChapter(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border-2 border-black rounded-[4px] text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <ArrowLeft className="w-4 h-4 text-purple-400" /> Close Hub
                  </button>
                  <div className="h-6 w-[1px] bg-slate-800" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Class {grade} {subject} Masterclass</span>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">{selectedChapter.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Difficulty Level</span>
                    <span className="text-xs font-black text-yellow-400 uppercase">{expanded.difficulty}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Study Duration</span>
                    <span className="text-xs font-black text-green-400 uppercase">{expanded.studyTime}</span>
                  </div>
                </div>
              </div>

              {/* Core Immersive Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Immersive Navigation Sidebar */}
                <div className="w-80 bg-slate-900/50 border-r-2 border-black p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
                  <div className="space-y-6">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Learning Flow</div>
                    <nav className="space-y-3">
                      {[
                        { id: 'overview', label: '1. Chapter Overview', icon: BookOpen },
                        { id: 'concepts', label: '2. Core Concepts', icon: Layout },
                        { id: 'examples', label: '3. Worked Examples', icon: Bookmark },
                        { id: 'practice', label: '4. Practice Arena', icon: HelpCircle },
                        { id: 'revision', label: '5. Exam Prep & Revision', icon: Zap }
                      ].map(step => (
                        <button
                          key={step.id}
                          onClick={() => {
                            setImmersiveStep(step.id);
                            if (step.id === 'practice') {
                              // Reset active quiz question
                              setActiveQuizIdx(0);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-4 border-2 border-black rounded-[4px] text-left text-xs font-black uppercase tracking-widest transition-all ${
                            immersiveStep === step.id 
                              ? 'bg-purple-500 text-black shadow-[3px_3px_0_#000] scale-[1.02]' 
                              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 hover:shadow-[3px_3px_0_#000]'
                          }`}
                        >
                          <step.icon className="w-4 h-4 shrink-0" />
                          <span>{step.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-5 bg-slate-900 border-2 border-black rounded-[4px] space-y-4 mt-8 shadow-[4px_4px_0_#000]">
                    <div className="w-8 h-8 rounded bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] font-bold text-text-muted uppercase tracking-widest">Active Deck Ready</span>
                      <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">Boost your recall using custom NCERT flashcards.</p>
                    </div>
                    <button 
                      onClick={() => handleInjectCards(selectedChapter)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border-2 border-black rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-colors shadow-[2px_2px_0_#000]"
                    >
                      Export to Cards
                    </button>
                  </div>
                </div>

                {/* Primary Content Container */}
                <div className="flex-1 p-10 overflow-y-auto bg-slate-950/40">
                  
                  {/* Step 1: Overview */}
                  {immersiveStep === 'overview' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-10"
                    >
                      <div className="flex items-center justify-between border-b-2 border-black pb-4">
                        <div className="space-y-1">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">Step 1: Introduction</span>
                          <h3 className="text-4xl font-black uppercase tracking-tight text-white leading-none mt-2">Chapter Overview</h3>
                        </div>

                        {/* ELI5 Toggle Button */}
                        <button
                          onClick={() => setEli5Mode(!eli5Mode)}
                          className={`px-4 py-2 border-2 border-black rounded-[4px] text-[10px] font-black uppercase tracking-wider transition-all shadow-[2px_2px_0_#000] ${
                            eli5Mode ? 'bg-green-500 text-black' : 'bg-slate-900 text-purple-400'
                          }`}
                        >
                          {eli5Mode ? '🐱 Normal Mode' : '👶 Explain Like I\'m 5'}
                        </button>
                      </div>

                      {/* Summary explainer box */}
                      <div className="nv-card bg-slate-900 border-3 border-black text-slate-300 leading-relaxed font-medium">
                        {eli5Mode ? (
                          <div className="space-y-3">
                            <span className="block text-[8px] font-black text-green-400 uppercase tracking-widest">Analogy Explainer Mode</span>
                            <p className="text-sm font-semibold leading-relaxed text-slate-100 italic">
                              "{ELI5_ANALOGIES[selectedChapter.title] || `Imagine this chapter is like a puzzle where each concept is a piece. Instead of reading boring rules, think of it as building a Lego set step-by-step!`}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm">{expanded.overview.intro}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="nv-card bg-slate-900 border-2 border-black p-8 space-y-4 shadow-[6px_6px_0_#000]">
                          <div className="w-10 h-10 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shadow-[2px_2px_0_#000]">
                            <Info className="w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">Real-world Meaning</h4>
                          <p className="text-slate-400 text-xs leading-relaxed font-medium">{expanded.overview.realWorld}</p>
                        </div>

                        <div className="nv-card bg-slate-900 border-2 border-black p-8 space-y-4 shadow-[6px_6px_0_#000]">
                          <div className="w-10 h-10 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[2px_2px_0_#000]">
                            <Zap className="w-5 h-5 fill-current" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">Why it Matters</h4>
                          <p className="text-slate-400 text-xs leading-relaxed font-medium">{expanded.overview.whyItMatters}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Core Concepts */}
                  {immersiveStep === 'concepts' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-5xl mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">Step 2: Core Syllabus Breakdown</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white leading-none mt-2">Syllabus Breakdown</h3>
                      </div>

                      {/* Sub-Concept Selector */}
                      <div className="flex bg-slate-900 p-1.5 rounded-[4px] border-2 border-black overflow-x-auto no-scrollbar shadow-[4px_4px_0_#000]">
                        {expanded.concepts.map(concept => (
                          <button
                            key={concept.id}
                            onClick={() => setSelectedConceptId(concept.id)}
                            className={`flex-shrink-0 px-6 py-3 border border-transparent rounded-[2px] text-[9px] font-black uppercase tracking-widest transition-all ${
                              currentConcept.id === concept.id ? 'bg-purple-500 text-black border-black shadow-[2px_2px_0_#000] scale-[1.02]' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {concept.title}
                          </button>
                        ))}
                      </div>

                      {/* Detailed Concept Panel */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                        <div className="lg:col-span-7 space-y-6">
                          
                          {/* 3D Flip Concept Card Challenge */}
                          {(() => {
                            const isChallengeFlipped = conceptChallengeFlipped[currentConcept.id];
                            return (
                              <div className="w-full h-72 perspective-1000">
                                <div 
                                  className="relative w-full h-full preserve-3d transition-transform duration-500"
                                  style={{ transform: isChallengeFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                >
                                  {/* Front: Definition and Explanation */}
                                  <div 
                                    className="absolute inset-0 backface-hidden nv-card bg-slate-900 border-3 border-black p-8 flex flex-col justify-between"
                                    style={{ backfaceVisibility: 'hidden' }}
                                  >
                                    <div className="space-y-3">
                                      <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Syllabus Definition</span>
                                      <h4 className="text-xl font-black uppercase text-white leading-tight">{currentConcept.title}</h4>
                                      <p className="text-slate-300 font-bold leading-relaxed bg-slate-950 p-4 rounded border border-black text-xs">
                                        {currentConcept.definition}
                                      </p>
                                      <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                        {currentConcept.explanation}
                                      </p>
                                    </div>
                                    <div className="flex justify-end">
                                      <button 
                                        onClick={() => setConceptChallengeFlipped(prev => ({ ...prev, [currentConcept.id]: true }))}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-755 border border-black text-purple-400 font-black uppercase tracking-wider text-[8px] rounded-[4px]"
                                      >
                                        Challenge Me 🧠
                                      </button>
                                    </div>
                                  </div>

                                  {/* Back: Concept Challenge Question */}
                                  <div 
                                    className="absolute inset-0 backface-hidden nv-card bg-slate-800 border-3 border-black p-8 flex flex-col justify-between"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                  >
                                    <div className="space-y-4">
                                      <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Concept Challenge Check</span>
                                      <h4 className="text-md font-black text-white">Quick Check:</h4>
                                      <p className="text-sm text-slate-200 font-semibold leading-relaxed">
                                        {currentConcept.title.toLowerCase().includes('plane') || currentConcept.title.toLowerCase().includes('geometry')
                                          ? "Under standard rules, how many numbers do you need to find a single exact location in a flat room?"
                                          : currentConcept.title.toLowerCase().includes('axes')
                                            ? "True or False: The horizontal axis in coordinate geometry is called the ordinate."
                                            : "Can you state a quick real-world example of this concept from memory?"}
                                      </p>
                                      <div className="bg-slate-950 p-4 rounded border border-black text-[10px] text-slate-400 leading-normal">
                                        <strong>Answer:</strong>{" "}
                                        {currentConcept.title.toLowerCase().includes('plane') || currentConcept.title.toLowerCase().includes('geometry')
                                          ? "Exactly 2 numbers (X and Y coordinates, representing horizontal and vertical offsets from the entrance origin)."
                                          : currentConcept.title.toLowerCase().includes('axes')
                                            ? "False! Abscissa represents x (horizontal), ordinate represents y (vertical)."
                                            : currentConcept.memoryTrick}
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <button 
                                        onClick={() => setConceptChallengeFlipped(prev => ({ ...prev, [currentConcept.id]: false }))}
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-black text-text-muted hover:text-white font-black uppercase tracking-wider text-[8px] rounded-[4px]"
                                      >
                                        Go Back ➔
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Memory Trick Box */}
                            <div className="p-6 bg-purple-500/5 border-2 border-black rounded-sm space-y-3 shadow-[4px_4px_0_#000]">
                              <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest">
                                <Zap className="w-4 h-4 fill-current" /> Memory Trick
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                                {currentConcept.memoryTrick}
                              </p>
                            </div>

                            {/* Common Mistake Box */}
                            <div className="p-6 bg-red-500/5 border-2 border-black rounded-sm space-y-3 shadow-[4px_4px_0_#000]">
                              <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest">
                                <Info className="w-4 h-4" /> Common Mistake
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                                {currentConcept.commonMistake}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Visual Canvas */}
                        <div className="lg:col-span-5 flex flex-col justify-center">
                          {currentConcept.visualType === 'cartesian-grid' && (
                            <div className="bg-slate-900 text-white rounded-sm border-2 border-black p-6 space-y-6 shadow-[6px_6px_0_#000]">
                              <div className="text-center">
                                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Interactive Sandbox</h5>
                                <h4 className="text-sm font-black uppercase">Live Coordinate Plotter</h4>
                                <p className="text-slate-400 text-[10px] mt-1">Click grid intersections to plot coordinates!</p>
                              </div>

                              <div className="flex flex-col gap-4 items-center justify-center">
                                {/* Cartesian Grid Plotter */}
                                <div className="relative w-64 h-64 bg-slate-950 border-3 border-black rounded-md overflow-hidden flex items-center justify-center shrink-0">
                                  <div className="absolute inset-0 grid grid-cols-11 grid-rows-11">
                                    {(() => {
                                      const cells = [];
                                      for (let y = 5; y >= -5; y--) {
                                        for (let x = -5; x <= 5; x++) {
                                          cells.push({ x, y });
                                        }
                                      }
                                      return cells.map((cell, idx) => {
                                        const isX = cell.y === 0;
                                        const isY = cell.x === 0;
                                        const isSelected = cell.x === plottedPoint.x && cell.y === plottedPoint.y;
                                        return (
                                          <div
                                            key={idx}
                                            onClick={() => setPlottedPoint({ x: cell.x, y: cell.y })}
                                            className={`relative flex items-center justify-center border border-slate-900/30 cursor-pointer hover:bg-purple-500/20 transition-colors ${
                                              isX ? 'border-b-2 border-b-slate-600' : ''
                                            } ${
                                              isY ? 'border-r-2 border-r-slate-600' : ''
                                            }`}
                                          >
                                            {cell.x === 0 && cell.y === 0 && (
                                              <div className="absolute w-2 h-2 bg-yellow-500 rounded-full z-10" />
                                            )}
                                            {isSelected && (
                                              <motion.div
                                                layoutId="grid-point"
                                                className="absolute w-4 h-4 bg-purple-500 rounded-full border border-black flex items-center justify-center shadow-lg z-20"
                                              >
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                              </motion.div>
                                            )}
                                          </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>

                                {/* Math Diagnostics */}
                                <div className="w-full space-y-2 bg-slate-950 p-4 border border-black rounded-sm shadow-[3px_3px_0_#000]">
                                  <div className="flex justify-between border-b border-black pb-1 text-xs">
                                    <span className="text-slate-400">Plotted Point</span>
                                    <span className="font-black text-purple-400">P({plottedPoint.x}, {plottedPoint.y})</span>
                                  </div>
                                  <div className="flex justify-between border-b border-black pb-1 text-[10px]">
                                    <span className="text-slate-400">Quadrant / Axis</span>
                                    <span className="font-bold text-yellow-400">
                                      {(() => {
                                        const { x, y } = plottedPoint;
                                        if (x === 0 && y === 0) return "Origin";
                                        if (x === 0) return "y-axis";
                                        if (y === 0) return "x-axis";
                                        if (x > 0 && y > 0) return "Quadrant I (+, +)";
                                        if (x < 0 && y > 0) return "Quadrant II (-, +)";
                                        if (x < 0 && y < 0) return "Quadrant III (-, -)";
                                        return "Quadrant IV (+, -)";
                                      })()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-slate-400">Distance from Origin</span>
                                    <span className="font-mono font-bold text-green-400">{Math.sqrt(plottedPoint.x*plottedPoint.x + plottedPoint.y*plottedPoint.y).toFixed(2)} units</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'axes-demo' && (
                            <div className="bg-slate-900 rounded-sm border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0_#000]">
                              <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Axes Anatomy</h5>
                              <div className="bg-slate-950 p-6 rounded border-2 border-black flex flex-col gap-3 font-semibold text-xs text-left shadow-[4px_4px_0_#000]">
                                <div className="p-3 bg-slate-900 border border-black rounded flex justify-between">
                                  <span>Horizontal line:</span>
                                  <strong className="text-white">x-axis (Abscissa line)</strong>
                                </div>
                                <div className="p-3 bg-slate-900 border border-black rounded flex justify-between">
                                  <span>Vertical line:</span>
                                  <strong className="text-white">y-axis (Ordinate line)</strong>
                                </div>
                                <div className="p-3 bg-slate-900 border border-black rounded flex justify-between text-yellow-400">
                                  <span>Intersection point:</span>
                                  <strong>Origin (0, 0)</strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'quadrants-selector' && (
                            <div className="bg-slate-900 rounded-sm border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0_#000]">
                              <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono font-black">Interactive Quadrants</h5>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { q: 'Quadrant I', sign: '(+, +)', bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
                                  { q: 'Quadrant II', sign: '(-, +)', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
                                  { q: 'Quadrant III', sign: '(-, -)', bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
                                  { q: 'Quadrant IV', sign: '(+, -)', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' }
                                ].map((item, idx) => (
                                  <div key={idx} className={`p-4 rounded border-2 border-black ${item.bg} flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-[3px_3px_0_#000]`}>
                                    <span>{item.q}</span>
                                    <strong className="text-lg">{item.sign}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'formula-showcase' && (
                            <div className="bg-slate-900 rounded-sm border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0_#000]">
                              <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Formula Sandbox</h5>
                              <div className="bg-slate-950 p-6 rounded border-2 border-black shadow-inner flex flex-col justify-center items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pythagoras representation</span>
                                <div className="text-xl font-mono font-black text-green-400 leading-none">
                                  d = √((x₂-x₁)² + (y₂-y₁)²)
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'vector-vs-scalar' && (
                            <div className="bg-slate-900 rounded-sm border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0_#000]">
                              <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Magnitude Matrix</h5>
                              <div className="grid grid-cols-2 gap-3 text-left font-semibold text-xs">
                                <div className="p-4 bg-slate-950 border-2 border-black rounded space-y-2 shadow-[3px_3px_0_#000]">
                                  <strong className="text-white block border-b border-black pb-1.5 text-blue-400">Scalars</strong>
                                  <span>Magnitude only.</span>
                                  <span className="block text-[10px] text-slate-500">e.g. Speed, Distance</span>
                                </div>
                                <div className="p-4 bg-slate-950 border-2 border-black rounded space-y-2 shadow-[3px_3px_0_#000]">
                                  <strong className="text-white block border-b border-black pb-1.5 text-green-400">Vectors</strong>
                                  <span>Magnitude + Direction.</span>
                                  <span className="block text-[10px] text-slate-500">e.g. Velocity, Displacement</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'acceleration-demo' && (() => {
                            return (
                              <div className="bg-slate-900 text-white rounded-sm border-2 border-black p-6 space-y-6 shadow-[6px_6px_0_#000]">
                                <div className="text-center">
                                  <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Physics Sandbox</h5>
                                  <h4 className="text-sm font-black uppercase">Velocity & Displacement</h4>
                                  <p className="text-slate-400 text-[10px] mt-1 font-semibold">Play to run the simulation!</p>
                                </div>

                                <div className="space-y-4">
                                  {/* Track */}
                                  <div className="relative h-16 bg-slate-950 border-2 border-black rounded overflow-hidden flex items-center px-4">
                                    <div className="absolute inset-x-0 h-0.5 bg-slate-800 border-t border-dashed border-slate-700" />
                                    <div className="absolute left-4 text-[8px] uppercase font-black text-slate-600">Start (0m)</div>
                                    <div className="absolute right-4 text-[8px] uppercase font-black text-slate-600">Finish (100m)</div>
                                    {/* Car */}
                                    <div
                                      style={{ left: `${simPos}%`, transition: 'left 50ms linear' }}
                                      className="absolute -translate-x-1/2 w-8 h-8 bg-purple-500 rounded border border-black flex items-center justify-center shadow-lg"
                                    >
                                      <span className="text-sm">🏎️</span>
                                    </div>
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded border-2 border-black shadow-[3px_3px_0_#000]">
                                    <button
                                      onClick={() => setSimPlay(!simPlay)}
                                      className={`px-4 py-2 border border-black rounded text-[9px] font-black uppercase tracking-widest ${
                                        simPlay ? 'bg-red-500 text-black' : 'bg-green-500 text-black'
                                      }`}
                                    >
                                      {simPlay ? 'Pause' : 'Start'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSimPos(0);
                                        setSimPlay(false);
                                      }}
                                      className="px-3 py-2 bg-slate-800 text-slate-300 border border-black rounded text-[9px] font-black uppercase tracking-widest"
                                    >
                                      Reset
                                    </button>
                                    <span className="text-[10px] text-slate-400 font-mono">Pos: <strong className="text-white">{Math.round(simPos)}m</strong></span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {currentConcept.visualType === 'literature-excerpt' && (
                            <div className="bg-slate-900 rounded-sm border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0_#000]">
                              <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">NCERT Excerpt Box</h5>
                              <blockquote className="bg-slate-950 p-6 rounded border-2 border-black text-left font-serif italic text-slate-350 text-sm leading-relaxed shadow-inner shadow-[4px_4px_0_#000]">
                                "For a grandmother, touching the feet of a child is quite unusual. But she said: 'I am touching the feet of a teacher, not my granddaughter. A teacher who taught me so well and with so much affection...'"
                              </blockquote>
                            </div>
                          )}

                          {currentConcept.visualType === 'character-analysis' && (
                            <div className="bg-slate-900 text-white rounded-sm border-2 border-black p-6 space-y-6 shadow-[6px_6px_0_#000]">
                              <div className="text-center">
                                  <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Character Profiles</h5>
                                  <h4 className="text-sm font-black uppercase">Grandmother vs Narrator</h4>
                              </div>

                              <div className="flex gap-2">
                                {['krishtakka', 'sudha'].map(key => (
                                  <button
                                    key={key}
                                    onClick={() => setActiveChar(key)}
                                    className={`flex-1 py-2 px-3 border-2 border-black rounded text-[9px] font-black uppercase tracking-widest transition-all ${
                                      activeChar === key
                                        ? 'bg-purple-500 border-black text-black shadow-[2px_2px_0_#000] scale-[1.02]'
                                        : 'bg-slate-950 border-slate-800 text-slate-500'
                                    }`}
                                  >
                                    {key === 'krishtakka' ? 'Krishtakka' : 'Sudha (Narrator)'}
                                  </button>
                                ))}
                              </div>

                              <div className="bg-slate-950 p-4 rounded border-2 border-black text-left text-[11px] font-semibold text-slate-300 shadow-[3px_3px_0_#000]">
                                <div className="border-b border-black pb-1.5 font-bold text-white flex justify-between">
                                  <span>{activeChar === 'krishtakka' ? 'Krishtakka (62)' : 'Sudha (12)'}</span>
                                  <span className="text-[8px] uppercase px-2.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                                    {activeChar === 'krishtakka' ? 'Student' : 'Teacher'}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-[10px] mt-2">
                                  {activeChar === 'krishtakka' 
                                    ? 'Decided to master Kannada literacy late in life. Highly motivated, progressive and deeply humble.'
                                    : 'A school-going granddaughter who patienty accepted the inverted role to become her elder’s guru.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Fallback Graphic */}
                          {!currentConcept.visualType && (
                            <div className="bg-slate-900 border-2 border-black rounded-sm p-8 text-center space-y-4 flex flex-col justify-center items-center aspect-video shadow-[6px_6px_0_#000]">
                              <div className="w-12 h-12 rounded bg-purple-500/10 border border-black flex items-center justify-center text-purple-400">
                                <BookOpen className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus Matrix</span>
                              <p className="text-xs text-slate-450 italic">Fully aligned to CBSE NCERT standard guidelines.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Worked Examples */}
                  {immersiveStep === 'examples' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">Step 3: Solve-Along Interactive Walkthrough</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white leading-none mt-2">Worked Examples</h3>
                      </div>

                      <div className="space-y-6">
                        {expanded.examples.map((example, i) => {
                          const currentStep = unlockedSteps[i] || 0; // 0 = not started (shows problem + predict button), 1...N = showing steps
                          const predictKey = `${i}_${currentStep}`;
                          const answeredPrediction = solvePredictions[predictKey] !== undefined;
                          const isPredictionCorrect = solvePredictions[predictKey] === true;

                          // Example prediction prompts
                          const predictionOptions = ["Substituting values", "Addition/Subtraction", "Multiplication/Division", "Applying formulas"];
                          
                          const handlePredict = async (choice) => {
                            if (answeredPrediction) return;
                            const correct = choice === "Substituting values" || choice === "Applying formulas";
                            setSolvePredictions(prev => ({ ...prev, [predictKey]: correct }));
                            
                            if (correct) {
                              xpService.awardXp(5, "Worked example prediction correct");
                              gamificationService.dealDamage(subject, 20);
                            }
                          };

                          return (
                            <div key={i} className="nv-card bg-slate-900 border-3 border-black overflow-hidden shadow-[8px_8px_0_#000]">
                              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-black bg-black/20">
                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-1 border border-black rounded text-[8px] font-black uppercase tracking-wider ${
                                    example.level === 'Easy' ? 'bg-green-500 text-black' :
                                    example.level === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-rose-500 text-black'
                                  }`}>
                                    {example.level} Level
                                  </span>
                                  <h4 className="text-lg font-black uppercase text-white">{example.title}</h4>
                                </div>
                                <button
                                  onClick={() => {
                                    setUnlockedSteps(prev => ({
                                      ...prev,
                                      [i]: currentStep > 0 ? 0 : 1
                                    }));
                                  }}
                                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border-2 border-black rounded-[4px] text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0_#000]"
                                >
                                  {currentStep > 0 ? 'Hide Solution' : 'Solve-Along Quest ➔'}
                                </button>
                              </div>

                              <div className="p-6 space-y-6">
                                <div className="p-5 bg-slate-950 rounded border-2 border-black shadow-[3px_3px_0_#000]">
                                  <p className="text-slate-200 font-bold leading-relaxed text-sm">{example.problem}</p>
                                </div>

                                {currentStep > 0 && (
                                  <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted">
                                      <span>Quest Steps Revealed</span>
                                      <span>Step {Math.min(currentStep, example.solution.length)} of {example.solution.length}</span>
                                    </div>

                                    {/* Show step by step reveal */}
                                    <div className="space-y-3">
                                      {example.solution.slice(0, currentStep).map((stepText, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-slate-950/80 rounded border border-black text-xs shadow-[3px_3px_0_#000]">
                                          <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold font-mono shrink-0">{idx + 1}</div>
                                          <p className="text-slate-300 font-medium leading-relaxed">{stepText}</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Next Step Prediction Gate */}
                                    {currentStep < example.solution.length ? (
                                      <div className="p-6 bg-slate-900 border-2 border-black border-dashed rounded space-y-4">
                                        <div className="flex items-center gap-2">
                                          <HelpIcon className="w-4 h-4 text-purple-400" />
                                          <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Predict Next Action for Step {currentStep + 1}</span>
                                        </div>
                                        <p className="text-xs text-slate-300 font-bold">What methodology is primarily expected in the next step?</p>
                                        
                                        {!answeredPrediction ? (
                                          <div className="grid grid-cols-2 gap-3">
                                            {predictionOptions.map(opt => (
                                              <button
                                                key={opt}
                                                onClick={() => handlePredict(opt)}
                                                className="py-2.5 px-4 bg-slate-950 border border-black hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-left rounded"
                                              >
                                                {opt}
                                              </button>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="space-y-3">
                                            <div className={`p-3 rounded text-[10px] font-black uppercase ${
                                              isPredictionCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                              {isPredictionCorrect ? '✓ Correct! Dealt 20 DMG to boss! +5 XP' : '✗ Incorrect Prediction, but let\'s learn!'}
                                            </div>
                                            <button
                                              onClick={() => setUnlockedSteps(prev => ({ ...prev, [i]: currentStep + 1 }))}
                                              className="px-6 py-2 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded"
                                            >
                                              Reveal Step {currentStep + 1} ➔
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-xs font-black uppercase tracking-wider">
                                        ✓ Walkthrough completed!
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Practice Arena */}
                  {immersiveStep === 'practice' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">Step 4: Active Recall Arena</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white leading-none mt-2">Practice Arena</h3>
                      </div>

                      {/* QUIZ ARCADE ENGINE */}
                      {(() => {
                        const totalQuestions = expanded.quiz.length;
                        const isFinished = activeQuizIdx >= totalQuestions;
                        
                        const handleQuizAnswer = async (selectedOption) => {
                          if (quizScores[activeQuizIdx] !== undefined) return;
                          
                          const q = expanded.quiz[activeQuizIdx];
                          const isCorrect = selectedOption === q.answer;
                          
                          setQuizScores(prev => ({ ...prev, [activeQuizIdx]: selectedOption }));
                          
                          if (isCorrect) {
                            const newStreak = quizStreak + 1;
                            setQuizStreak(newStreak);
                            
                            // Deal 100 base DMG + 20 per combo streak!
                            const finalDmg = 100 + newStreak * 20;
                            await gamificationService.dealDamage(subject, finalDmg);
                            await xpService.awardXp(10, `Quiz MCQ correct: streak x${newStreak}`);
                            
                            window.dispatchEvent(new CustomEvent('acadevance_notification', {
                              detail: { title: `Combo 🔥 x${newStreak}!`, message: `Hit! Dealt ${finalDmg} DMG to Boss!`, type: 'success' }
                            }));
                          } else {
                            setQuizStreak(0);
                            window.dispatchEvent(new CustomEvent('acadevance_notification', {
                              detail: { title: `Break! ❌`, message: `Streak broken. Correct was: ${q.answer}`, type: 'warning' }
                            }));
                          }
                        };

                        if (isFinished) {
                          const correctCount = expanded.quiz.reduce((acc, q, idx) => {
                            return acc + (quizScores[idx] === q.answer ? 1 : 0);
                          }, 0);

                          return (
                            <div className="nv-card bg-slate-900 border-3 border-black p-8 text-center space-y-6 shadow-[8px_8px_0_#000]">
                              <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                              <h4 className="text-2xl font-black text-white uppercase tracking-tight">Quiz Complete!</h4>
                              <p className="text-sm font-semibold text-text-secondary leading-relaxed">
                                You solved <strong className="text-purple-400 text-lg font-black">{correctCount}</strong> out of <strong className="text-white text-lg font-black">{totalQuestions}</strong> questions correctly ({Math.round((correctCount / totalQuestions) * 100)}%).
                              </p>
                              
                              {hasSavedQuiz ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-xs font-black uppercase tracking-widest mx-auto">
                                  ✓ Score Synced & Rewards Dispatched!
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    try {
                                      const saved = await dataService.create('quiz_scores', {
                                        chapter_title: selectedChapter.title,
                                        subject,
                                        score: correctCount,
                                        total: totalQuestions,
                                        grade,
                                        completed_at: new Date().toISOString()
                                      });
                                      if (saved) {
                                        const xp = correctCount * 50;
                                        await xpService.awardXp(xp, `Quiz Complete: ${selectedChapter.title}`);
                                        await gamificationService.incrementStat('stats_quizzes_correct', correctCount);
                                        
                                        const subLower = subject.toLowerCase();
                                        if (subLower.includes('math')) {
                                          await gamificationService.incrementStat('stats_math_completed', 1);
                                        } else if (subLower.includes('science')) {
                                          await gamificationService.incrementStat('stats_science_completed', 1);
                                        }

                                        setHasSavedQuiz(true);
                                        notificationService.send("Progress Synced", `Earned ${correctCount}/${totalQuestions} & claimed +${xp} XP! ⚡`, "success");
                                      }
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }}
                                  className="px-10 py-4 bg-purple-500 border-2 border-black text-black rounded font-black uppercase tracking-widest text-xs shadow-[4px_4px_0_#000] hover:bg-purple-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                                >
                                  Submit Score & Claim Rewards
                                </button>
                              )}
                              <div className="pt-2">
                                <button 
                                  onClick={() => {
                                    setQuizScores({});
                                    setActiveQuizIdx(0);
                                    setQuizStreak(0);
                                    setHasSavedQuiz(false);
                                  }}
                                  className="text-xs text-text-muted hover:text-white uppercase font-black tracking-widest border-b border-dashed border-text-muted hover:border-white transition-all pb-0.5"
                                >
                                  Restart Quiz Arena
                                </button>
                              </div>
                            </div>
                          );
                        }

                        const q = expanded.quiz[activeQuizIdx];
                        const answered = quizScores[activeQuizIdx] !== undefined;
                        const userAns = quizScores[activeQuizIdx];
                        const isCorrect = userAns === q.answer;

                        return (
                          <div className="space-y-6">
                            {/* LIVE BOSS BATTLE PORTAL */}
                            {subjectBoss && (
                              <div className="bg-slate-900 border-2 border-black rounded p-4 flex items-center justify-between gap-4 shadow-[4px_4px_0_#000]">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl animate-bounce">{subjectBoss.emoji}</span>
                                  <div>
                                    <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Active Target HP</div>
                                    <h4 className="text-sm font-black text-white">{subjectBoss.name}</h4>
                                  </div>
                                </div>
                                <div className="flex-1 max-w-xs space-y-1">
                                  <div className="h-3 w-full bg-black border border-black rounded overflow-hidden p-0.5">
                                    <div className="h-full bg-rose-500 rounded-sm" style={{ width: `${(subjectBoss.hp / subjectBoss.max) * 100}%` }} />
                                  </div>
                                  <div className="flex justify-between text-[7px] font-bold text-text-muted uppercase">
                                    <span>HP: {subjectBoss.hp} / {subjectBoss.max}</span>
                                    <span>Answering correct deals DMG</span>
                                  </div>
                                </div>
                                
                                {/* Combo Streak counter */}
                                <div className="bg-black/40 border border-black rounded p-2 text-center shrink-0">
                                  <span className="block text-[6px] font-bold text-text-muted uppercase">Combo</span>
                                  <span className="text-xs font-black text-purple-400 tracking-wider">{quizStreak}x 🔥</span>
                                </div>
                              </div>
                            )}

                            {/* Question layout */}
                            <div className="nv-card bg-slate-900/60 border-2 border-black p-8 space-y-6">
                              <div className="flex justify-between items-center border-b border-black pb-3 text-[10px] font-black text-text-muted uppercase tracking-wider">
                                <span>Question {activeQuizIdx + 1} of {totalQuestions}</span>
                                <span className="nv-badge bg-black/40 text-text-muted border border-black">Syllabus MCQ</span>
                              </div>

                              <h4 className="text-xl font-black text-white leading-relaxed">{q.q}</h4>

                              <div className="grid grid-cols-1 gap-3 pt-2">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = userAns === opt;
                                  const isOptionCorrect = opt === q.answer;
                                  const showCorrect = answered && isOptionCorrect;
                                  const showIncorrect = answered && isSelected && !isOptionCorrect;

                                  return (
                                    <button
                                      key={optIdx}
                                      disabled={answered}
                                      onClick={() => handleQuizAnswer(opt)}
                                      className={`w-full p-4 border-2 border-black rounded text-xs font-black uppercase text-left transition-all ${
                                        showCorrect
                                          ? 'bg-green-500 text-black shadow-none'
                                          : showIncorrect
                                            ? 'bg-rose-500 text-black shadow-none'
                                            : isSelected
                                              ? 'bg-purple-500 text-black shadow-none'
                                              : 'bg-slate-950 border-black text-text-secondary hover:bg-slate-800 hover:text-white hover:shadow-[3px_3px_0_#000]'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{opt}</span>
                                        {showCorrect && <span className="text-[9px] font-black">✓ Correct</span>}
                                        {showIncorrect && <span className="text-[9px] font-black">✗ Incorrect</span>}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {answered && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="space-y-4 pt-4 border-t border-black"
                                >
                                  {q.explanation && (
                                    <div className="p-4 bg-slate-950 border border-black rounded text-[10px] text-text-secondary font-semibold leading-relaxed">
                                      <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1.5">NCERT Syllabus Reference</span>
                                      {q.explanation}
                                    </div>
                                  )}

                                  <button
                                    onClick={() => setActiveQuizIdx(prev => prev + 1)}
                                    className="w-full py-3.5 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded hover:bg-purple-400 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                                  >
                                    {activeQuizIdx + 1 === totalQuestions ? 'Complete Quiz 🏆' : 'Next Question ➔'}
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Step 5: Exam Prep & Revision */}
                  {immersiveStep === 'revision' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-10"
                    >
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">Step 5: Revision Suite</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white leading-none mt-2">Exam Prep & Revision</h3>
                      </div>

                      {/* 3D Flashcard Mini Game */}
                      <div className="nv-card bg-slate-900 border-3 border-black p-8 space-y-6 shadow-[8px_8px_0_#000]">
                        <div className="flex items-center justify-between border-b-2 border-black pb-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest font-mono">Active Recall Sandbox</span>
                            <h4 className="text-lg font-black uppercase text-white font-sans">Flashcard Flasher</h4>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 font-mono">Card {activeCardIdx + 1} of {selectedChapter.flashcards.length}</span>
                        </div>

                        {/* Flipper Card Container */}
                        <div className="flex items-center justify-center py-6">
                          <div 
                            onClick={() => setCardFlipped(!cardFlipped)}
                            className="perspective-1000 w-80 h-52 cursor-pointer relative"
                          >
                            <motion.div
                              animate={{ rotateY: cardFlipped ? 180 : 0 }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              className="preserve-3d relative w-full h-full"
                            >
                              {/* Front */}
                              <div className="absolute inset-0 bg-slate-950 border-3 border-black rounded p-8 flex flex-col justify-between backface-hidden shadow-2xl transition-colors hover:border-purple-500/50"
                                   style={{ backfaceVisibility: 'hidden' }}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Term / Question</span>
                                  {flashcardScores.mastered.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Mastered ✓</span>
                                  )}
                                  {flashcardScores.tricky.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Tricky ✗</span>
                                  )}
                                </div>
                                <h4 className="text-lg font-black text-white text-center uppercase tracking-tight leading-normal my-auto">
                                  {selectedChapter.flashcards[activeCardIdx]?.front}
                                </h4>
                                <span className="text-[8px] font-black text-purple-400 text-center uppercase tracking-widest font-mono">Click to Flip & Reveal Answer</span>
                              </div>

                              {/* Back */}
                              <div 
                                style={{ transform: "rotateY(180deg)", backfaceVisibility: 'hidden' }}
                                className="absolute inset-0 bg-[#1e1b4b] border-3 border-purple-500 rounded p-8 flex flex-col justify-between backface-hidden shadow-2xl"
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-[8px] font-black text-purple-300 uppercase tracking-widest font-mono">Explanation / Answer</span>
                                  {flashcardScores.mastered.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Mastered ✓</span>
                                  )}
                                  {flashcardScores.tricky.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Tricky ✗</span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-white leading-relaxed text-center my-auto">
                                  {selectedChapter.flashcards[activeCardIdx]?.back}
                                </p>
                                <span className="text-[8px] font-black text-purple-400 text-center uppercase tracking-widest font-mono">Click to Flip Back</span>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Card Controls */}
                        <div className="flex flex-wrap justify-between items-center bg-slate-950 p-4 border-2 border-black rounded gap-3 shadow-[4px_4px_0_#000]">
                          <button
                            onClick={() => {
                              setCardFlipped(false);
                              setActiveCardIdx(prev => (prev > 0 ? prev - 1 : selectedChapter.flashcards.length - 1));
                            }}
                            className="px-4 py-2.5 bg-slate-900 border border-black hover:bg-slate-800 text-slate-300 rounded text-[9px] font-black uppercase tracking-widest transition-all shadow-[2px_2px_0_#000]"
                          >
                            Prev
                          </button>
                          
                          <button
                            onClick={() => {
                              setFlashcardScores(prev => {
                                const mastered = prev.mastered.filter(idx => idx !== activeCardIdx);
                                const tricky = [...prev.tricky.filter(idx => idx !== activeCardIdx), activeCardIdx];
                                return { mastered, tricky };
                              });
                              if (activeCardIdx < selectedChapter.flashcards.length - 1) {
                                setCardFlipped(false);
                                setTimeout(() => setActiveCardIdx(activeCardIdx + 1), 300);
                              }
                            }}
                            className="px-4 py-2.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Tricky ✗
                          </button>

                          <button
                            onClick={() => setCardFlipped(!cardFlipped)}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-black rounded text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Flip
                          </button>

                          <button
                            onClick={() => {
                              setFlashcardScores(prev => {
                                const tricky = prev.tricky.filter(idx => idx !== activeCardIdx);
                                const mastered = [...prev.mastered.filter(idx => idx !== activeCardIdx), activeCardIdx];
                                return { mastered, tricky };
                              });
                              if (activeCardIdx < selectedChapter.flashcards.length - 1) {
                                setCardFlipped(false);
                                setTimeout(() => setActiveCardIdx(activeCardIdx + 1), 300);
                              }
                            }}
                            className="px-4 py-2.5 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Mastered ✓
                          </button>

                          <button
                            onClick={() => {
                              setCardFlipped(false);
                              setActiveCardIdx(prev => (prev < selectedChapter.flashcards.length - 1 ? prev + 1 : 0));
                            }}
                            className="px-4 py-2.5 bg-slate-900 border border-black hover:bg-slate-800 text-slate-300 rounded text-[9px] font-black uppercase tracking-widest transition-all shadow-[2px_2px_0_#000]"
                          >
                            Next
                          </button>
                        </div>

                        {/* Flashcards complete evaluations */}
                        {(() => {
                          const totalCards = selectedChapter.flashcards.length;
                          const masteredCount = flashcardScores.mastered.length;
                          const trickyCount = flashcardScores.tricky.length;
                          const isRecallComplete = masteredCount + trickyCount === totalCards;

                          return isRecallComplete && (
                            <div className="bg-slate-950 border-2 border-black rounded p-6 text-center space-y-4 mt-6 shadow-[4px_4px_0_#000]">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">Active Recall Complete!</h4>
                              <p className="text-xs text-text-secondary">
                                Mastered: <strong className="text-green-400">{masteredCount}</strong> | Tricky: <strong className="text-red-400">{trickyCount}</strong>
                              </p>
                              {hasSavedRecall ? (
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-[10px] font-black uppercase tracking-widest mx-auto">
                                  ✓ Progress Saved & XP Claimed!
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    try {
                                      const saved = await dataService.create('flashcard_logs', {
                                        chapter_title: selectedChapter.title,
                                        subject,
                                        grade,
                                        mastered: masteredCount,
                                        tricky: trickyCount,
                                        total: totalCards,
                                        completed_at: new Date().toISOString()
                                      });
                                      if (saved) {
                                        const xp = masteredCount * 15;
                                        await xpService.awardXp(xp, `Recall: ${selectedChapter.title}`);
                                        await gamificationService.incrementStat('stats_flashcards_reviewed', totalCards);
                                        
                                        const subLower = subject.toLowerCase();
                                        if (subLower.includes('math')) {
                                          await gamificationService.incrementStat('stats_math_completed', 1);
                                        } else if (subLower.includes('science')) {
                                          await gamificationService.incrementStat('stats_science_completed', 1);
                                        }

                                        // Boss damage: 5 DMG per card
                                        await gamificationService.dealDamage(subject, totalCards * 5);

                                        setHasSavedRecall(true);
                                        notificationService.send("Recall Synced", `Saved recall session & claimed +${xp} XP! ⚡`, "success");
                                      }
                                    } catch (e) {
                                      console.error("Recall score error:", e);
                                    }
                                  }}
                                  className="px-8 py-3 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded hover:bg-purple-400 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                                >
                                  Submit Recall Progress
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Formula Sheet & PYQ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* PYQ Box */}
                        <div className="bg-slate-900 border-2 border-black p-8 rounded shadow-[6px_6px_0_#000] space-y-4">
                          <div className="w-10 h-10 rounded bg-purple-500/10 border border-black flex items-center justify-center text-purple-400 shadow-[2px_2px_0_#000]">
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white font-sans">CBSE Exam PYQ Patterns</h4>
                          <p className="text-slate-400 text-xs leading-relaxed font-semibold">{expanded.pyqPattern}</p>
                        </div>

                        {/* Recap Sheet */}
                        <div className="bg-slate-900 border-2 border-black p-8 rounded shadow-[6px_6px_0_#000] space-y-4">
                          <div className="w-10 h-10 rounded bg-green-500/10 border border-black flex items-center justify-center text-green-400 shadow-[2px_2px_0_#000]">
                            <Info className="w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white font-sans">Quick Recall Tips</h4>
                          <ul className="space-y-2 text-slate-400 text-xs font-semibold">
                            {expanded.recap.slice(0, 4).map((item, idx) => (
                              <li key={idx} className="flex gap-2 items-start">
                                <span className="text-green-500 shrink-0 font-bold">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default SubjectLibrary;
