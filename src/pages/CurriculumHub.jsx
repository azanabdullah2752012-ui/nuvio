import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, ChevronRight, Search, 
  GraduationCap, Book, Layers, 
  Zap, MessageSquare, Clock,
  ArrowRight, CheckCircle2, Star,
  Swords, Play, Copy, Check, RotateCcw,
  Compass, Lock, Trophy, HelpCircle, FileText,
  X, Info, ChevronLeft, ArrowLeft, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { CURRICULUM_DATA } from '../services/curriculumData';

const CLASSES = [
  { id: '6', name: 'Class 6', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '7', name: 'Class 7', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '8', name: 'Class 8', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '9', name: 'Class 9', subjects: ['Mathematics', 'Science', 'English'] },
  { id: '10', name: 'Class 10', subjects: ['Mathematics', 'Science', 'English'] },
  { id: '11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
  { id: '12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
];

// Shuffles an array safely
const shuffleArray = (arr) => {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

// Generates dynamic choices for quizzes when options are missing
const generateOptions = (questionObj, allQnasOfChapter) => {
  if (questionObj.options && questionObj.options.length > 0) {
    return shuffleArray([...questionObj.options]);
  }
  
  const correct = questionObj.a;
  const incorrects = new Set();
  
  allQnasOfChapter.forEach(item => {
    if (item.a !== correct) {
      incorrects.add(item.a);
    }
  });
  
  const fallbackPool = [
    "It is not defined in standard NCERT guidelines.",
    "None of the above options are correct.",
    "Both A and B are correct depending on parameters.",
    "It depends on the reference point.",
    "The quantity remains conserved.",
    "It doubles under uniform acceleration."
  ];
  
  let poolIndex = 0;
  while (incorrects.size < 3 && poolIndex < fallbackPool.length) {
    const val = fallbackPool[poolIndex];
    if (val !== correct) {
      incorrects.add(val);
    }
    poolIndex++;
  }
  
  const optionsList = [correct, ...Array.from(incorrects).slice(0, 3)];
  return shuffleArray(optionsList);
};

// Retro synthetic arcade sound generator using Web Audio API
const playSynthSound = (type, isMuted) => {
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
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'boss_hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
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
      playTone(523.25, 0, 0.12);
      playTone(659.25, 0.12, 0.12);
      playTone(783.99, 0.24, 0.12);
      playTone(1046.50, 0.36, 0.3);
    }
  } catch (e) {
    console.warn("Synth audio blocked or not supported by browser security policy.");
  }
};

const SubjectIcon = ({ name }) => {
  const s = name.toLowerCase();
  let symbol = "📖";
  if (s.includes('math')) symbol = "∑";
  else if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('biology')) symbol = "⚛";
  else if (s.includes('social') || s.includes('history') || s.includes('geography')) symbol = "🌍";
  else if (s.includes('english')) symbol = "A";
  
  return (
    <div className="w-12 h-12 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] font-serif font-bold text-xl shadow-sm">
      {symbol}
    </div>
  );
};

const CurriculumHub = () => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(authService.me());
  const [soundMuted, setSoundMuted] = useState(false);
  
  // Navigation & details states
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [studyTab, setStudyTab] = useState('learn'); // 'learn' | 'recall' | 'practice' | 'prep'

  // Interactive Flashcard Player State
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardDeckComplete, setFlashcardDeckComplete] = useState(false);

  // Interactive Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Cheatsheet Overlay State
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [cheatsheetSearch, setCheatsheetSearch] = useState('');
  const [copiedFormula, setCopiedFormula] = useState(null);

  // Mastery Completion State
  const [completedChapters, setCompletedChapters] = useState({});

  // Game UI & Visual Sandbox states
  const [eli5Mode, setEli5Mode] = useState(false);
  const [plottedPoint, setPlottedPoint] = useState({ x: 2, y: 3 });
  const [motionPercent, setMotionPercent] = useState(0); // Physics motion slider
  const [isDriving, setIsDriving] = useState(false);
  const [drivingDir, setDrivingDir] = useState('forward'); // 'forward' | 'backward'
  const [maxDistanceReached, setMaxDistanceReached] = useState(0);
  
  // PYQ marking checksheets state
  const [pyqChecks, setPyqChecks] = useState({
    def: false,
    formula: false,
    diagram: false,
    steps: false,
    units: false
  });

  const navigate = useNavigate();
  const synthTimerRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('acadevance_mastered_chapters');
      if (stored) {
        setCompletedChapters(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    const handleUserUpdate = (e) => {
      setUser(e.detail);
    };
    window.addEventListener('acadevance_stats_update', handleUserUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUserUpdate);
  }, []);

  // Keyboard controls for Flashcards
  useEffect(() => {
    if (studyTab !== 'recall' || !expandedChapter || flashcardDeckComplete) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' && isFlipped) {
        e.preventDefault();
        nextFlashcard('easy');
      } else if (e.code === 'ArrowLeft' && isFlipped) {
        e.preventDefault();
        nextFlashcard('hard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyTab, expandedChapter, cardIdx, isFlipped, flashcardDeckComplete]);

  // Physics motion simulation effect
  useEffect(() => {
    let timer;
    if (isDriving) {
      timer = setInterval(() => {
        setMotionPercent(prev => {
          if (drivingDir === 'forward') {
            const next = prev + 2;
            if (next >= 100) {
              setIsDriving(false);
              setMaxDistanceReached(100);
              return 100;
            }
            return next;
          } else {
            const next = prev - 2;
            if (next <= 0) {
              setIsDriving(false);
              return 0;
            }
            return next;
          }
        });
      }, 35);
    }
    return () => clearInterval(timer);
  }, [isDriving, drivingDir]);

  // Filter grade subjects
  const currentClass = CLASSES.find(c => c.id === selectedClass);
  const filteredSubjects = currentClass?.subjects.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getCurriculumData = (grade, subject) => {
    if (CURRICULUM_DATA[grade]?.[subject]) {
      return CURRICULUM_DATA[grade][subject];
    }
    return { chapters: [] };
  };

  // Active Subject details
  const subjectData = activeSubject ? getCurriculumData(selectedClass, activeSubject) : { chapters: [] };

  // Calculate subject mastery %
  const getSubjectMastery = (subName) => {
    const data = getCurriculumData(selectedClass, subName);
    if (!data.chapters || data.chapters.length === 0) return 0;
    
    let masteredCount = 0;
    data.chapters.forEach(ch => {
      const key = `${selectedClass}_${subName}_${ch.title}`;
      if (completedChapters[key]) {
        masteredCount++;
      }
    });
    return Math.round((masteredCount / data.chapters.length) * 100);
  };

  // Initialize interactive deck
  const selectChapter = (chapter) => {
    setExpandedChapter(chapter);
    setStudyTab('learn');
    setCardIdx(0);
    setIsFlipped(false);
    setFlashcardDeckComplete(false);
    setQuizActive(false);
    setQuizComplete(false);
    setEli5Mode(false);
    setPyqChecks({
      def: false,
      formula: false,
      diagram: false,
      steps: false,
      units: false
    });
  };

  // Launch Quiz Mode
  const startQuiz = (chapter) => {
    if (!chapter.qna || chapter.qna.length === 0) return;
    
    const formatted = chapter.qna.map(item => ({
      ...item,
      shuffledOptions: generateOptions(item, chapter.qna)
    }));
    
    setQuizQuestions(formatted);
    setQuizIdx(0);
    setSelectedOpt(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizComplete(false);
    setQuizActive(true);
  };

  const submitQuizAnswer = (option) => {
    if (quizSubmitted) return;
    setSelectedOpt(option);
    setQuizSubmitted(true);
    
    const currentQuestion = quizQuestions[quizIdx];
    const isCorrect = option === currentQuestion.a;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playSynthSound('correct', soundMuted);
    } else {
      playSynthSound('incorrect', soundMuted);
      window.dispatchEvent(new CustomEvent('acadevance_notification', {
        detail: { title: `Practice Check`, message: `Correct Answer: ${currentQuestion.a}`, type: 'warning' }
      }));
    }
  };

  const nextQuizQuestion = () => {
    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
      setSelectedOpt(null);
      setQuizSubmitted(false);
    } else {
      setQuizComplete(true);
      playSynthSound('complete', soundMuted);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });

      // Check if perfect score -> complete chapter
      if (quizScore === quizQuestions.length) {
        const key = `${selectedClass}_${activeSubject}_${expandedChapter.title}`;
        const updated = { ...completedChapters, [key]: true };
        setCompletedChapters(updated);
        localStorage.setItem('acadevance_mastered_chapters', JSON.stringify(updated));
        
        notificationService.send(
          'Syllabus Topic Mastered',
          `100% recall in ${expandedChapter.title}! Added to syllabus index.`,
          'success'
        );
      }
    }
  };

  // Flashcards navigation
  const nextFlashcard = (type) => {
    playSynthSound('correct', soundMuted);
    setIsFlipped(false);
    
    setTimeout(() => {
      if (cardIdx + 1 < expandedChapter.flashcards.length) {
        setCardIdx(prev => prev + 1);
      } else {
        setFlashcardDeckComplete(true);
        playSynthSound('complete', soundMuted);
      }
    }, 200);
  };

  // Calculate PYQ Checklist grade score
  const getPyqScore = () => {
    const checkedCount = Object.values(pyqChecks).filter(Boolean).length;
    return Math.round((checkedCount / 5) * 100);
  };

  // Extract subject formulas
  const allSubjectFormulas = subjectData.chapters.flatMap(ch => 
    (ch.formulas || []).map(f => ({ chapterTitle: ch.title, formula: f }))
  );

  const filteredFormulas = allSubjectFormulas.filter(f => 
    f.formula.toLowerCase().includes(cheatsheetSearch.toLowerCase()) ||
    f.chapterTitle.toLowerCase().includes(cheatsheetSearch.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="min-h-screen pb-32 nv-page-transition bg-[#fbfbfa] text-[#1a1917] font-sans">
      {/* 🏛️ CBSE HEADER SECTION */}
      <div className="border-b border-[#e5e1d5] bg-white p-8 md:p-12 mb-10 shadow-[0_4px_24px_rgba(27,59,43,0.04)] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#1b3b2b] font-mono font-bold uppercase tracking-widest text-xs">
                <GraduationCap className="w-4 h-4" /> Academic Curriculum Directory
              </span>
              <span className="bg-[#1b3b2b]/10 text-[#1b3b2b] border border-[#1b3b2b]/20 text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold">
                NCERT Aligned
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1917] tracking-tight">
              CBSE Curriculum Matrix
            </h1>
            <p className="text-[#52504a] text-sm max-w-xl leading-relaxed">
              Standardized NCERT syllabus directory, core textbook units, formula sheets, and chapter walkthroughs across secondary classes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Audio Toggle */}
            <button 
              onClick={() => setSoundMuted(!soundMuted)}
              className="px-4 h-12 bg-[#f5f3ec] hover:bg-[#ede9de] border border-[#e5e1d5] rounded-xl flex items-center justify-center text-[#52504a] hover:text-[#1a1917] transition-colors shadow-sm"
              title="Toggle Audio"
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1b3b2b]" />}
            </button>

            {/* Global Search */}
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827f76] group-focus-within:text-[#1b3b2b] transition-colors" />
              <input 
                type="text"
                placeholder="Search syllabus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 h-12 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-sm text-[#1a1917] placeholder-[#827f76] focus:outline-none focus:border-[#1b3b2b] shadow-sm transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* 🧭 CLASS SELECTOR BAR */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar border-b border-[#e5e1d5]">
          {CLASSES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedClass(c.id);
                setActiveSubject(null);
                setExpandedChapter(null);
              }}
              className={`flex-shrink-0 px-5 py-2.5 border rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                selectedClass === c.id 
                  ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white font-bold shadow-sm' 
                  : 'bg-white border-[#e5e1d5] text-[#52504a] hover:bg-[#f5f3ec] hover:text-[#1a1917]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 📚 CONDITIONAL VIEW: SUBJECT LIST VS SUBJECT CONTROL DECK */}
        <AnimatePresence mode="wait">
          {!activeSubject ? (
            // SUBJECT GRID MATRIX VIEW
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#1b3b2b]" />
                <h2 className="text-2xl font-serif font-bold text-[#1a1917]">Syllabus Subjects</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSubjects.map((subject) => {
                  const mastery = getSubjectMastery(subject);

                  return (
                    <motion.div
                      key={subject}
                      onClick={() => {
                        navigate('/subject-library', { state: { subject, grade: selectedClass } });
                      }}
                      className="bg-white border border-[#e5e1d5] rounded-2xl p-8 hover:border-[#1b3b2b]/40 shadow-[0_2px_12px_rgba(27,59,43,0.03)] hover:shadow-[0_4px_20px_rgba(27,59,43,0.06)] transition-all cursor-pointer group flex flex-col justify-between min-h-[260px]"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <SubjectIcon name={subject} />
                          <div className="bg-[#f5f3ec] text-[#52504a] border border-[#e5e1d5] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold">
                            NCERT standard
                          </div>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-[#1a1917] tracking-tight mb-2 group-hover:text-[#1b3b2b] transition-colors">
                          {subject}
                        </h3>
                        
                        {/* Mastery status */}
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-[#827f76]">
                            <span>Syllabus Mastery</span>
                            <span className="font-bold text-[#1a1917]">{mastery}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#ede9de] rounded-full overflow-hidden p-0.5">
                            <div className="h-full bg-[#1b3b2b] rounded-full transition-all duration-300" style={{ width: `${mastery}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Explore Action */}
                      <div className="mt-6 pt-4 border-t border-[#e5e1d5] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider">Interactive Units</span>
                        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1b3b2b] uppercase group-hover:gap-2 transition-all shrink-0">
                          Enter Units <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredSubjects.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white border border-dashed border-[#e5e1d5] rounded-2xl shadow-sm">
                    <HelpCircle className="w-10 h-10 text-[#827f76] mx-auto mb-3 opacity-40" />
                    <p className="text-sm text-[#52504a] font-sans">No subjects match the search query.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // SUBJECT CONTROL DECK (FULL INTERACTIVE STUDY HUB)
            <motion.div
              key="deck"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Top navigation row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 border border-[#e5e1d5] rounded-2xl shadow-sm">
                <button 
                  onClick={() => setActiveSubject(null)}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#52504a] hover:text-[#1a1917] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-[#1b3b2b]" /> Back to Syllabus Matrix
                </button>
                <div className="flex items-center gap-3">
                  <span className="bg-[#1b3b2b]/10 text-[#1b3b2b] border border-[#1b3b2b]/20 font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold">
                    Class {selectedClass}
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#1a1917] tracking-tight">
                    {activeSubject}
                  </span>
                </div>
                
                <button 
                  onClick={() => navigate('/subject-library', { state: { subject: activeSubject, grade: selectedClass } })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(27,59,43,0.2)] font-semibold"
                >
                  Launch 8-Step Study Unit <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Main Deck layout: Stats on left, Chapters on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT BLOCK: SUBJECT SUMMARY */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Subject progress panel */}
                  <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl space-y-4 shadow-[0_2px_12px_rgba(27,59,43,0.03)]">
                    <h3 className="text-lg font-serif font-bold text-[#1a1917] border-b border-[#e5e1d5] pb-3">Syllabus Overview</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#fbfbfa] p-4 border border-[#e5e1d5] rounded-xl">
                        <span className="block text-[9px] font-mono font-bold text-[#827f76] uppercase tracking-widest">Chapters</span>
                        <span className="text-2xl font-serif font-bold text-[#1a1917]">{subjectData.chapters.length}</span>
                      </div>
                      <div className="bg-[#fbfbfa] p-4 border border-[#e5e1d5] rounded-xl">
                        <span className="block text-[9px] font-mono font-bold text-[#827f76] uppercase tracking-widest">Mastery</span>
                        <span className="text-2xl font-serif font-bold text-[#1b3b2b]">{getSubjectMastery(activeSubject)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-2 w-full bg-[#ede9de] rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-[#1b3b2b] rounded-full transition-all duration-300" style={{ width: `${getSubjectMastery(activeSubject)}%` }} />
                      </div>
                      <span className="block text-[9px] text-[#827f76] text-center font-mono uppercase tracking-wider">
                        NCERT Syllabus Unit Progression
                      </span>
                    </div>
                  </div>

                  {/* Focus Topic Notes */}
                  <div className="p-6 bg-white border border-[#e5e1d5] rounded-2xl space-y-3 shadow-[0_2px_12px_rgba(27,59,43,0.03)]">
                    <span className="text-[10px] font-mono text-[#1b3b2b] uppercase tracking-widest font-bold">
                      Curriculum Scope
                    </span>
                    <p className="text-xs text-[#52504a] font-sans leading-relaxed">
                      All units, NCERT core definitions, worked problem sets, and recall benchmarks are aligned with the CBSE academic framework.
                    </p>
                  </div>
                </div>

                {/* RIGHT BLOCK: CHAPTERS TIMELINE ROADMAP */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#1b3b2b]" />
                    <h2 className="text-2xl font-serif font-bold text-[#1a1917]">Syllabus Units</h2>
                  </div>

                  <div className="space-y-4">
                    {subjectData.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate('/subject-library', { state: { subject: activeSubject, grade: selectedClass } })}
                        className="p-6 border border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/40 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_12px_rgba(27,59,43,0.03)] group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[#1b3b2b] font-serif font-bold text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-serif font-bold text-[#1a1917] group-hover:text-[#1b3b2b] transition-colors">{ch.title}</h3>
                            <p className="text-xs text-[#52504a] mt-1 leading-relaxed max-w-xl">{ch.summary}</p>
                          </div>
                        </div>

                        <button
                          className="px-4 py-2 border border-[#e5e1d5] bg-[#f5f3ec] group-hover:bg-[#1b3b2b] group-hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider text-[#1a1917] transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Open Chapter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurriculumHub;
