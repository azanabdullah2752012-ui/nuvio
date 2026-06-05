import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Zap, 
  MessageSquare, Star, ChevronRight,
  Download, Share2, Bookmark, Layout,
  Info, RotateCcw, HelpCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM_DATA } from '../services/curriculumData';
import { EXPANDED_CURRICULUM } from '../services/expandedCurriculum';
import { dataService } from '../services/dataService';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { gamificationService } from '../services/gamificationService';

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

  return (
    <div className="min-h-screen pb-32 nv-page-transition bg-background-base">
      {/* 🧭 NAVIGATION */}
      <div className="bg-background-base/80 border-b border-white/5 sticky top-0 z-50 px-8 py-6 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/curriculum')} className="flex items-center gap-2 text-text-secondary hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Matrix
          </button>
          <div className="flex items-center gap-4">
             <button className="p-3 rounded-xl hover:bg-white/5 transition-colors text-text-muted hover:text-white"><Share2 className="w-5 h-5" /></button>
             <button className="p-3 rounded-xl hover:bg-white/5 transition-colors text-text-muted hover:text-white"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* 🏛️ SUBJECT HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-nuvio-purple-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
               Class {grade} NCERT
            </span>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
              {subject}
            </h1>
            <p className="text-text-secondary font-medium max-w-xl">
              Access verified study modules, pre-made flashcards, and the Curriculum Q&A bank for the official CBSE syllabus.
            </p>
          </div>
          
          <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
             {[
               { id: 'chapters', label: 'Chapters', icon: BookOpen },
               { id: 'qna', label: 'Q&A Bank', icon: MessageSquare },
               { id: 'cards', label: 'Flashcards', icon: Zap }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab.id ? 'bg-nuvio-purple-600 text-white shadow-lg shadow-nuvio-purple-500/20' : 'text-text-secondary hover:text-white'
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
                  <div key={i} className="nv-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] p-8 transition-all group flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover:bg-nuvio-purple-600 group-hover:border-nuvio-purple-500 group-hover:text-white transition-all duration-500 shrink-0">
                       <span className="text-2xl font-black">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight">{chapter.title}</h3>
                       <p className="text-text-secondary text-sm leading-relaxed">{chapter.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => startImmersiveStudy(chapter)}
                         className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-nuvio-purple-600 hover:text-white transition-colors flex items-center gap-3 shadow-lg shadow-black/20"
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
                  <div key={i} className="nv-card border-white/5 bg-white/[0.01] hover:border-nuvio-purple-500/30 p-10 transition-all group">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-nuvio-purple-500/20 flex items-center justify-center text-nuvio-purple-400 text-xs font-black">Q</div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Curriculum Q&A Module</span>
                     </div>
                     <h4 className="text-xl font-black text-white mb-6 leading-tight">{qa.q}</h4>
                     <div className="p-6 bg-black/40 rounded-2xl border border-white/5 text-text-secondary font-medium leading-relaxed">
                        <div className="text-[9px] font-black text-nuvio-green uppercase tracking-widest mb-3">Verified Answer</div>
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
                  <div key={i} className="nv-card border-white/5 bg-white/[0.01] hover:shadow-2xl hover:shadow-nuvio-purple-500/10 transition-all border-b-4 border-b-nuvio-purple-500 p-8 aspect-square flex flex-col justify-between">
                     <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500/10 flex items-center justify-center text-nuvio-purple-400">
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
            // Dynamically construct a high-fidelity fallback for general chapters
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

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col overflow-hidden"
            >
              {/* Immersive Top Bar */}
              <div className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setImmersiveMode(false);
                      setSelectedChapter(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Close Hub
                  </button>
                  <div className="h-6 w-[1px] bg-slate-800" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Class {grade} {subject} Masterclass</span>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white leading-none">{selectedChapter.title}</h2>
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
                <div className="w-80 bg-slate-900/50 border-r border-slate-900 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
                  <div className="space-y-6">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Learning Flow</div>
                    <nav className="space-y-2">
                      {[
                        { id: 'overview', label: '1. Chapter Overview', icon: BookOpen },
                        { id: 'concepts', label: '2. Core Concepts', icon: Layout },
                        { id: 'examples', label: '3. Worked Examples', icon: Bookmark },
                        { id: 'practice', label: '4. Practice Arena', icon: HelpCircle },
                        { id: 'revision', label: '5. Exam Prep & Revision', icon: Zap }
                      ].map(step => (
                        <button
                          key={step.id}
                          onClick={() => setImmersiveStep(step.id)}
                          className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left text-xs font-black uppercase tracking-widest transition-all ${
                            immersiveStep === step.id 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <step.icon className="w-4 h-4 shrink-0" />
                          <span>{step.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 mt-8">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Deck Ready</span>
                      <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">Boost your recall using custom NCERT flashcards.</p>
                    </div>
                    <button 
                      onClick={() => handleInjectCards(selectedChapter)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors"
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
                      <div className="space-y-4">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Step 1: Introduction</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white">Chapter Overview</h3>
                        <p className="text-slate-400 text-base leading-relaxed font-medium">{expanded.overview.intro}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                            <Info className="w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">Real-world Meaning</h4>
                          <p className="text-slate-400 text-sm leading-relaxed font-medium">{expanded.overview.realWorld}</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Zap className="w-5 h-5 fill-current" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">Why it Matters</h4>
                          <p className="text-slate-400 text-sm leading-relaxed font-medium">{expanded.overview.whyItMatters}</p>
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
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Step 2: Core Syllabus Breakdown</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white">Syllabus Breakdown</h3>
                      </div>

                      {/* Sub-Concept Selector */}
                      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                        {expanded.concepts.map(concept => (
                          <button
                            key={concept.id}
                            onClick={() => setSelectedConceptId(concept.id)}
                            className={`flex-shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              currentConcept.id === concept.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {concept.title}
                          </button>
                        ))}
                      </div>

                      {/* Detailed Concept Panel */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                        <div className="lg:col-span-7 space-y-6">
                          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-4">
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Syllabus Definition</span>
                            <h4 className="text-xl font-black uppercase text-white leading-tight">{currentConcept.title}</h4>
                            <p className="text-slate-300 font-bold leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm">
                              {currentConcept.definition}
                            </p>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium pt-2">
                              {currentConcept.explanation}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Memory Trick Box */}
                            <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-3">
                              <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest">
                                <Zap className="w-4 h-4 fill-current" /> Memory Trick
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                                {currentConcept.memoryTrick}
                              </p>
                            </div>

                            {/* Common Mistake Box */}
                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-3">
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
                            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-6">
                              <div className="text-center">
                                <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Interactive Sandbox</h5>
                                <h4 className="text-sm font-black uppercase">Live Coordinate Plotter</h4>
                                <p className="text-slate-400 text-[10px] mt-1">Click the grid intersections to plot coordinates!</p>
                              </div>

                              <div className="flex flex-col gap-4 items-center justify-center">
                                {/* Cartesian Grid Ploter */}
                                <div className="relative w-64 h-64 bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center shrink-0">
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
                                            className={`relative flex items-center justify-center border border-slate-900/30 cursor-pointer hover:bg-blue-600/20 transition-colors ${
                                              isX ? 'border-b-2 border-b-slate-700' : ''
                                            } ${
                                              isY ? 'border-r-2 border-r-slate-700' : ''
                                            }`}
                                          >
                                            {cell.x === 0 && cell.y === 0 && (
                                              <div className="absolute w-2 h-2 bg-yellow-500 rounded-full z-10" />
                                            )}
                                            {isSelected && (
                                              <motion.div
                                                layoutId="grid-point"
                                                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/50 z-20"
                                              >
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                              </motion.div>
                                            )}
                                          </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>

                                {/* Math Diagnostics */}
                                <div className="w-full space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <div className="flex justify-between border-b border-slate-800 pb-1 text-xs">
                                    <span className="text-slate-400">Plotted Point</span>
                                    <span className="font-black text-blue-400">P({plottedPoint.x}, {plottedPoint.y})</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-800 pb-1 text-[10px]">
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
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
                              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Axes Anatomy</h5>
                              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-3 font-semibold text-xs text-left">
                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
                                  <span>Horizontal line:</span>
                                  <strong className="text-white">x-axis (Abscissa line)</strong>
                                </div>
                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
                                  <span>Vertical line:</span>
                                  <strong className="text-white">y-axis (Ordinate line)</strong>
                                </div>
                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between text-yellow-400">
                                  <span>Intersection point:</span>
                                  <strong>Origin (0, 0)</strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'quadrants-selector' && (
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
                              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono font-black">Interactive Quadrant Quadrille</h5>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { q: 'Quadrant I', sign: '(+, +)', bg: 'bg-green-500/10 text-green-400' },
                                  { q: 'Quadrant II', sign: '(-, +)', bg: 'bg-blue-500/10 text-blue-400' },
                                  { q: 'Quadrant III', sign: '(-, -)', bg: 'bg-red-500/10 text-red-400' },
                                  { q: 'Quadrant IV', sign: '(+, -)', bg: 'bg-yellow-500/10 text-yellow-400' }
                                ].map((item, idx) => (
                                  <div key={idx} className={`p-4 rounded-xl border border-slate-800 ${item.bg} flex flex-col items-center justify-center gap-1 font-bold text-xs`}>
                                    <span>{item.q}</span>
                                    <strong className="text-lg">{item.sign}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'formula-showcase' && (
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
                              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Formula Sandbox</h5>
                              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-center items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pythagoras representation</span>
                                <div className="text-2xl font-mono font-black text-green-400 leading-none">
                                  d = √((x₂-x₁)² + (y₂-y₁)²)
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'vector-vs-scalar' && (
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
                              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Magnitude Matrix</h5>
                              <div className="grid grid-cols-2 gap-3 text-left font-semibold text-xs">
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                  <strong className="text-white block border-b border-slate-800 pb-1.5 text-blue-400">Scalars</strong>
                                  <span>Magnitude only.</span>
                                  <span className="block text-[10px] text-slate-500">e.g. Speed, Distance</span>
                                </div>
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                  <strong className="text-white block border-b border-slate-800 pb-1.5 text-green-400">Vectors</strong>
                                  <span>Magnitude + Direction.</span>
                                  <span className="block text-[10px] text-slate-500">e.g. Velocity, Displacement</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentConcept.visualType === 'acceleration-demo' && (() => {
                            // Run the simulation hook equivalent logic
                            return (
                              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-6">
                                <div className="text-center">
                                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Interactive Physics Simulation</h5>
                                  <h4 className="text-sm font-black uppercase">Velocity & Displacement</h4>
                                  <p className="text-slate-400 text-[10px] mt-1">Adjust acceleration speed and observe displacement live!</p>
                                </div>

                                <div className="space-y-4">
                                  {/* Track */}
                                  <div className="relative h-16 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center px-4">
                                    <div className="absolute inset-x-0 h-0.5 bg-slate-800 border-t border-dashed border-slate-700" />
                                    <div className="absolute left-4 text-[8px] uppercase font-black text-slate-600">Start (0m)</div>
                                    <div className="absolute right-4 text-[8px] uppercase font-black text-slate-600">Finish (100m)</div>
                                    {/* Car */}
                                    <div
                                      style={{ left: `${simPos}%`, transition: 'left 50ms linear' }}
                                      className="absolute -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                                    >
                                      <span className="text-sm">🏎️</span>
                                    </div>
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <button
                                      onClick={() => {
                                        setSimPlay(!simPlay);
                                      }}
                                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                        simPlay ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                      }`}
                                    >
                                      {simPlay ? 'Pause' : 'Start'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSimPos(0);
                                        setSimPlay(false);
                                      }}
                                      className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest"
                                    >
                                      Reset
                                    </button>
                                    <span className="text-[10px] text-slate-400 font-mono">Displacement: <strong className="text-white">{Math.round(simPos)}m</strong></span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {currentConcept.visualType === 'literature-excerpt' && (
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
                              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">NCERT Excerpt Box</h5>
                              <blockquote className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left font-serif italic text-slate-300 text-sm leading-relaxed shadow-inner">
                                "For a grandmother, touching the feet of a child is quite unusual. But she said: 'I am touching the feet of a teacher, not my granddaughter. A teacher who taught me so well and with so much affection...'"
                              </blockquote>
                            </div>
                          )}

                          {currentConcept.visualType === 'character-analysis' && (
                            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-6">
                              <div className="text-center">
                                <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Character Profiles</h5>
                                <h4 className="text-sm font-black uppercase">Grandmother vs Narrator</h4>
                                <p className="text-slate-500 text-[10px] mt-1">Explore character matrix traits below.</p>
                              </div>

                              <div className="flex gap-2">
                                {['krishtakka', 'sudha'].map(key => (
                                  <button
                                    key={key}
                                    onClick={() => setActiveChar(key)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                                      activeChar === key
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                        : 'bg-slate-950 border-slate-800 text-slate-500'
                                    }`}
                                  >
                                    {key === 'krishtakka' ? 'Krishtakka' : 'Sudha (Narrator)'}
                                  </button>
                                ))}
                              </div>

                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-left text-[11px] font-semibold text-slate-300">
                                <div className="border-b border-slate-800 pb-1 font-bold text-white flex justify-between">
                                  <span>{activeChar === 'krishtakka' ? 'Krishtakka (62)' : 'Sudha (12)'}</span>
                                  <span className="text-[8px] uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                                    {activeChar === 'krishtakka' ? 'Student' : 'Teacher'}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-[10px]">
                                  {activeChar === 'krishtakka' 
                                    ? 'Decided to master Kannada literacy late in life. Highly motivated, progressive and deeply humble.'
                                    : 'A school-going granddaughter who patienty accepted the inverted role to become her elder’s guru.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Fallback Graphic */}
                          {!currentConcept.visualType && (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 flex flex-col justify-center items-center aspect-video">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <BookOpen className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Curriculum Mind Map Matrix</span>
                              <p className="text-xs text-slate-400 italic">Fully mapped to CBSE & NCERT terms.</p>
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
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Step 3: Solved Application Steps</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white">Worked Examples</h3>
                      </div>

                      <div className="space-y-6">
                        {expanded.examples.map((example, i) => {
                          const isRevealed = revealExampleIdx === i;
                          return (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden transition-all duration-300">
                              <div className="p-8 flex items-center justify-between gap-6 border-b border-slate-800/50 bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                    example.level === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                    example.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                  }`}>
                                    {example.level} Level
                                  </span>
                                  <h4 className="text-lg font-black uppercase text-white">{example.title}</h4>
                                </div>
                                <button
                                  onClick={() => setRevealExampleIdx(isRevealed ? null : i)}
                                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors shrink-0"
                                >
                                  {isRevealed ? 'Hide Solution' : 'Reveal Solution'}
                                </button>
                              </div>

                              <div className="p-8 space-y-4">
                                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-850">
                                  <p className="text-slate-200 font-bold leading-relaxed text-sm">{example.problem}</p>
                                </div>

                                <AnimatePresence>
                                  {isRevealed && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden space-y-3 pt-3"
                                    >
                                      <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Step-by-step Solution Matrix</span>
                                      <div className="space-y-3">
                                        {example.solution.map((step, idx) => (
                                          <div key={idx} className="flex gap-4 p-4 bg-slate-950/80 rounded-xl border border-slate-850 text-xs">
                                            <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">{idx + 1}</div>
                                            <p className="text-slate-300 font-medium leading-relaxed">{step}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
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
                      className="max-w-4xl mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Step 4: Active Recall Arena</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white">Practice Arena</h3>
                      </div>

                      <div className="space-y-6">
                        {expanded.quiz.map((q, idx) => {
                          const selectedOption = quizScores[idx];
                          const hasAnswered = selectedOption !== undefined;
                          const isCorrect = selectedOption === q.answer;

                          return (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                  q.type === 'mcq' ? 'bg-blue-500/10 text-blue-400' :
                                  q.type === 'assertion' ? 'bg-purple-500/10 text-purple-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {q.type === 'mcq' ? 'Multiple Choice MCQ' :
                                   q.type === 'assertion' ? 'CBSE Assertion & Reason' : 'HOTS Question'}
                                </span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Syllabus Check</span>
                              </div>

                              <h4 className="text-lg font-black text-slate-200 leading-relaxed font-sans">{q.q}</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option, optIdx) => {
                                  const isSelected = selectedOption === option;
                                  const isOptionCorrect = option === q.answer;
                                  
                                  let buttonClass = "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white";
                                  if (hasAnswered) {
                                    if (isOptionCorrect) {
                                      buttonClass = "bg-green-500/10 border-green-500/40 text-green-400";
                                    } else if (isSelected) {
                                      buttonClass = "bg-red-500/10 border-red-500/40 text-red-400";
                                    } else {
                                      buttonClass = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60 pointer-events-none";
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      disabled={hasAnswered}
                                      onClick={() => setQuizScores(prev => ({ ...prev, [idx]: option }))}
                                      className={`p-5 rounded-2xl border text-left font-semibold text-xs transition-all flex items-center justify-between gap-4 group ${buttonClass}`}
                                    >
                                      <span>{option}</span>
                                      {hasAnswered && isOptionCorrect && <span className="text-green-500 text-xs">✓</span>}
                                      {hasAnswered && isSelected && !isOptionCorrect && <span className="text-red-500 text-xs">✗</span>}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Quiz Answer Feedback Panel */}
                              <AnimatePresence>
                                {hasAnswered && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="overflow-hidden bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2 mt-4"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        isCorrect ? 'text-green-400' : 'text-red-400'
                                      }`}>
                                        {isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                      {q.explanation}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}

                        {(() => {
                          const totalQuestions = expanded.quiz.length;
                          const answeredCount = Object.keys(quizScores).length;
                          const isQuizComplete = answeredCount === totalQuestions;
                          const correctCount = expanded.quiz.reduce((acc, q, idx) => {
                            return acc + (quizScores[idx] === q.answer ? 1 : 0);
                          }, 0);

                          return isQuizComplete && (
                            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-center space-y-6 mt-8">
                              <h4 className="text-2xl font-black text-white uppercase tracking-tight">Quiz Evaluation Complete!</h4>
                              <p className="text-sm font-semibold text-text-secondary leading-relaxed">
                                You answered <strong className="text-white">{correctCount}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions correctly ({Math.round((correctCount / totalQuestions) * 100)}%).
                              </p>
                              {hasSavedQuiz ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-nuvio-green/10 border border-nuvio-green/20 text-nuvio-green rounded-xl text-xs font-black uppercase tracking-widest mx-auto">
                                  ✓ Quiz Progress Saved & XP Claimed!
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
                                        
                                        // Gamification: increment correct answers
                                        await gamificationService.incrementStat('stats_quizzes_correct', correctCount);
                                        
                                        // Subject activity increments
                                        const subLower = subject.toLowerCase();
                                        if (subLower.includes('math')) {
                                          await gamificationService.incrementStat('stats_math_completed', 1);
                                        } else if (subLower.includes('science')) {
                                          await gamificationService.incrementStat('stats_science_completed', 1);
                                        }

                                        // Boss damage: 10 DMG per correct answer
                                        await gamificationService.dealDamage(subject, correctCount * 10);

                                        setHasSavedQuiz(true);
                                        notificationService.send("Progress Synced", `Saved score of ${correctCount}/${totalQuestions} & claimed +${xp} XP! ⚡`, "success");
                                      }
                                    } catch (e) {
                                      console.error("Could not save quiz score:", e);
                                      notificationService.send("Sync Failed", "Could not sync quiz progress.", "error");
                                    }
                                  }}
                                  className="px-10 py-4 bg-nuvio-purple-600 hover:bg-nuvio-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-nuvio-purple-500/20"
                                >
                                  Submit Score & Claim XP
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
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
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Step 5: Revision Suite</span>
                        <h3 className="text-4xl font-black uppercase tracking-tight text-white">Exam Prep & Revision</h3>
                      </div>

                      {/* 3D Flashcard Mini Game */}
                      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">Active Recall Sandbox</span>
                            <h4 className="text-lg font-black uppercase text-white">Flashcard Flasher</h4>
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
                              <div className="absolute inset-0 bg-slate-950 border-2 border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-2xl transition-colors">
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Term / Question</span>
                                  {flashcardScores.mastered.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Mastered ✓</span>
                                  )}
                                  {flashcardScores.tricky.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Tricky ✗</span>
                                  )}
                                </div>
                                <h4 className="text-xl font-black text-white text-center uppercase tracking-tight leading-normal my-auto">
                                  {selectedChapter.flashcards[activeCardIdx]?.front}
                                </h4>
                                <span className="text-[8px] font-black text-blue-400 text-center uppercase tracking-widest font-mono">Click to Flip & Reveal Answer</span>
                              </div>

                              {/* Back */}
                              <div 
                                style={{ transform: "rotateY(180deg)" }}
                                className="absolute inset-0 bg-[#1e1b4b] border-2 border-nuvio-purple-500 rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-2xl"
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-[8px] font-black text-nuvio-purple-300 uppercase tracking-widest font-mono">Explanation / Answer</span>
                                  {flashcardScores.mastered.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Mastered ✓</span>
                                  )}
                                  {flashcardScores.tricky.includes(activeCardIdx) && (
                                    <span className="text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Tricky ✗</span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-white leading-relaxed text-center my-auto">
                                  {selectedChapter.flashcards[activeCardIdx]?.back}
                                </p>
                                <span className="text-[8px] font-black text-nuvio-purple-400 text-center uppercase tracking-widest font-mono">Click to Flip Back</span>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Card Controls */}
                        <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-3">
                          <button
                            onClick={() => {
                              setCardFlipped(false);
                              setActiveCardIdx(prev => (prev > 0 ? prev - 1 : selectedChapter.flashcards.length - 1));
                            }}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
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
                            className="px-4 py-2.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Tricky ✗
                          </button>

                          <button
                            onClick={() => setCardFlipped(!cardFlipped)}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
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
                            className="px-4 py-2.5 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Mastered ✓
                          </button>

                          <button
                            onClick={() => {
                              setCardFlipped(false);
                              setActiveCardIdx(prev => (prev < selectedChapter.flashcards.length - 1 ? prev + 1 : 0));
                            }}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Next
                          </button>
                        </div>

                        {(() => {
                          const totalCards = selectedChapter.flashcards.length;
                          const masteredCount = flashcardScores.mastered.length;
                          const trickyCount = flashcardScores.tricky.length;
                          const isRecallComplete = masteredCount + trickyCount === totalCards;

                          return isRecallComplete && (
                            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-center space-y-4 mt-6">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">Active Recall Complete!</h4>
                              <p className="text-xs text-text-secondary">
                                Mastered: <strong className="text-green-400">{masteredCount}</strong> | Tricky: <strong className="text-red-400">{trickyCount}</strong>
                              </p>
                              {hasSavedRecall ? (
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-nuvio-green/10 border border-nuvio-green/20 text-nuvio-green rounded-xl text-[10px] font-black uppercase tracking-widest mx-auto">
                                  ✓ Recall Progress Saved & XP Claimed!
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
                                        
                                        // Gamification: increment flashcards reviewed
                                        await gamificationService.incrementStat('stats_flashcards_reviewed', totalCards);
                                        
                                        // Subject activity increments
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
                                      console.error("Could not save recall score:", e);
                                      notificationService.send("Sync Failed", "Could not sync recall progress.", "error");
                                    }
                                  }}
                                  className="px-8 py-3 bg-nuvio-purple-600 hover:bg-nuvio-purple-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-nuvio-purple-500/20"
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
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">CBSE Exam PYQ Patterns</h4>
                          <p className="text-slate-400 text-xs leading-relaxed font-semibold">{expanded.pyqPattern}</p>
                        </div>

                        {/* Recap Sheet */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                            <Info className="w-5 h-5" />
                          </div>
                          <h4 className="text-lg font-black uppercase text-white">Quick Recall Tips</h4>
                          <ul className="space-y-2 text-slate-400 text-xs font-semibold">
                            {expanded.recap.slice(0, 4).map((item, idx) => (
                              <li key={idx} className="flex gap-2 items-start">
                                <span className="text-green-500 shrink-0">✓</span>
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
