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
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';
import { gamificationService, BOSSES } from '../services/gamificationService';
import { CURRICULUM_DATA } from '../services/curriculumData';

const CLASSES = [
  { id: '1', name: 'Class 1', subjects: ['Mathematics', 'English', 'EVS', 'Hindi'] },
  { id: '2', name: 'Class 2', subjects: ['Mathematics', 'English', 'EVS', 'Hindi'] },
  { id: '3', name: 'Class 3', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '4', name: 'Class 4', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '5', name: 'Class 5', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
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
  if (s.includes('math')) return <div className="w-12 h-12 rounded-xl bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-black text-xl shadow-[3px_3px_0_#000]">∑</div>;
  if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('biology')) return <div className="w-12 h-12 rounded-xl bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-400 font-black text-xl shadow-[3px_3px_0_#000]">⚛</div>;
  if (s.includes('social') || s.includes('history') || s.includes('geography')) return <div className="w-12 h-12 rounded-xl bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-400 font-black text-xl shadow-[3px_3px_0_#000]">🌍</div>;
  if (s.includes('english')) return <div className="w-12 h-12 rounded-xl bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center text-purple-400 font-black text-xl shadow-[3px_3px_0_#000]">A</div>;
  return <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-black text-xl shadow-[3px_3px_0_#000]">🎴</div>;
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
  
  // Floating combat feedback
  const [combatEffects, setCombatEffects] = useState([]);
  const [bossShake, setBossShake] = useState(false);

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

  // Trigger floating combat damage indicators
  const spawnDamageEffect = (amount) => {
    const id = Date.now() + Math.random();
    const nextEffect = {
      id,
      text: `-${amount} HP 💥`,
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 40) + 10
    };
    setCombatEffects(prev => [...prev, nextEffect]);
    setBossShake(true);
    playSynthSound('boss_hit', soundMuted);

    setTimeout(() => {
      setBossShake(false);
    }, 400);

    setTimeout(() => {
      setCombatEffects(prev => prev.filter(e => e.id !== id));
    }, 1200);
  };

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

  // Fetch subject-boss status
  const getSubjectBoss = (subName) => {
    if (!subName) return null;
    const subLower = subName.toLowerCase();
    const progress = user?.boss_chapter_progress || {};
    
    let activeBossId = null;
    if (subLower.includes('math') || subLower.includes('algebra') || subLower.includes('geometry')) {
      activeBossId = ['dragon', 'algebra', 'geometry'].find(id => progress[id]?.status === 'active') || 'dragon';
    } else if (subLower.includes('science') || subLower.includes('physics') || subLower.includes('chemistry') || subLower.includes('biology')) {
      activeBossId = ['cell', 'motion', 'atom'].find(id => progress[id]?.status === 'active') || 'cell';
    } else if (subLower.includes('social') || subLower.includes('history') || subLower.includes('geography')) {
      activeBossId = ['empire', 'leviathan'].find(id => progress[id]?.status === 'active') || 'empire';
    }

    if (!activeBossId) return null;
    const bossMeta = BOSSES.find(b => b.id === activeBossId);
    const bossProgress = progress[activeBossId] || { hp: 100, max: 100, status: 'locked' };

    return {
      ...bossMeta,
      hp: bossProgress.hp,
      max: bossProgress.max,
      status: bossProgress.status,
      claimed: bossProgress.claimed
    };
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
      spawnDamageEffect(100);
      xpService.awardXp(10, `Quiz Correct Answer: ${currentQuestion.q.substring(0, 15)}...`);
      playSynthSound('correct', soundMuted);
    } else {
      playSynthSound('incorrect', soundMuted);
      window.dispatchEvent(new CustomEvent('acadevance_notification', {
        detail: { title: `Practice Check ❌`, message: `Correct Answer: ${currentQuestion.a}`, type: 'warning' }
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      const xpEarned = quizScore * 20;
      const coinsEarned = quizScore * 5;
      
      if (xpEarned > 0) xpService.awardXp(xpEarned, `Mastered Quiz: ${expandedChapter.title}`);
      if (coinsEarned > 0) authService.addTokens(coinsEarned);

      // Log stats
      gamificationService.incrementStat('stats_quizzes_correct', quizScore);
      
      const subLower = activeSubject.toLowerCase();
      if (subLower.includes('math')) gamificationService.incrementStat('stats_math_completed', 1);
      else if (subLower.includes('science') || subLower.includes('physics')) gamificationService.incrementStat('stats_science_completed', 1);

      // Check if perfect score -> complete chapter
      if (quizScore === quizQuestions.length) {
        const key = `${selectedClass}_${activeSubject}_${expandedChapter.title}`;
        const updated = { ...completedChapters, [key]: true };
        setCompletedChapters(updated);
        localStorage.setItem('acadevance_mastered_chapters', JSON.stringify(updated));
        
        notificationService.send(
          'Syllabus Topic Mastered! 🏆',
          `100% recall in ${expandedChapter.title}! Added to syllabus index.`,
          'success'
        );
      }
    }
  };

  // Flashcards navigation
  const nextFlashcard = (type) => {
    gamificationService.incrementStat('stats_flashcards_reviewed', 1);
    
    const xpReward = type === 'easy' ? 5 : 2;
    xpService.awardXp(xpReward, `Flashcard Rating: ${type}`);
    playSynthSound('correct', soundMuted);
    
    setIsFlipped(false);
    
    setTimeout(() => {
      if (cardIdx + 1 < expandedChapter.flashcards.length) {
        setCardIdx(prev => prev + 1);
      } else {
        setFlashcardDeckComplete(true);
        playSynthSound('complete', soundMuted);
        xpService.awardXp(15, `Reviewed Full Deck: ${expandedChapter.title}`);
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
    <div className="min-h-screen pb-32 nv-page-transition bg-background-base text-text-primary">
      {/* 🏛️ CBSE HEADER SECTION */}
      <div className="border-b-4 border-black bg-slate-900 p-8 md:p-12 mb-10 shadow-[8px_8px_0_#000] relative overflow-hidden">
        {/* Decorative Grid Line */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-cyan-400 font-black uppercase tracking-widest text-xs">
                <GraduationCap className="w-5 h-5 animate-pulse" /> Interactive CBSE Hub
              </span>
              <span className="nv-badge bg-purple-500 text-black text-[8px] font-black tracking-widest px-2 py-0.5">
                NCERT 2026 ALIGNED
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              CBSE <span className="text-purple-500 text-shadow-nb">Scholar</span> Matrix
            </h1>
            <p className="text-text-secondary font-semibold text-sm max-w-xl">
              Conquer NCERT syllabus modules, practice recall flashcards, and run quizzes to defeat subject bosses!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Audio Toggle */}
            <button 
              onClick={() => setSoundMuted(!soundMuted)}
              className="px-4 h-16 bg-slate-800 border-2 border-black rounded-[4px] flex items-center justify-center text-text-secondary hover:text-white shadow-[2px_2px_0_#000] active:translate-y-[2px]"
            >
              {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-purple-400" />}
            </button>

            {/* Global Search */}
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search syllabus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nv-input pl-16 h-16 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* 🧭 CLASS SELECTOR BAR */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b-2 border-black/20">
          {CLASSES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedClass(c.id);
                setActiveSubject(null);
                setExpandedChapter(null);
              }}
              className={`flex-shrink-0 px-6 py-3.5 border-2 border-black rounded-[4px] text-xs font-black uppercase tracking-widest transition-all ${
                selectedClass === c.id 
                  ? 'bg-purple-500 text-black shadow-[4px_4px_0_#000] scale-105' 
                  : 'bg-slate-900 text-text-secondary hover:bg-slate-800 hover:text-white'
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
                <Compass className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-black uppercase text-white">Syllabus Subjects</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSubjects.map((subject) => {
                  const mastery = getSubjectMastery(subject);
                  const boss = getSubjectBoss(subject);
                  
                  // Dynamically resolve neubrutalist hover styles
                  let subjectColor = "hover:border-purple-500";
                  if (subject.toLowerCase().includes('math')) subjectColor = "hover:border-blue-500";
                  if (subject.toLowerCase().includes('sci') || subject.toLowerCase().includes('phys') || subject.toLowerCase().includes('chem')) subjectColor = "hover:border-green-500";
                  if (subject.toLowerCase().includes('social')) subjectColor = "hover:border-orange-500";

                  return (
                    <motion.div
                      key={subject}
                      onClick={() => {
                        setActiveSubject(subject);
                        setExpandedChapter(null);
                      }}
                      className={`nv-card bg-slate-900/60 border-3 border-black p-8 hover:translate-y-[-4px] hover:shadow-[12px_12px_0_#000] ${subjectColor} transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[280px]`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <SubjectIcon name={subject} />
                          <div className="nv-badge bg-black/40 text-text-muted border border-black font-black text-[8px] px-2 py-0.5">
                            NCERT standard
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
                          {subject}
                        </h3>
                        
                        {/* Mastery status */}
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary">
                            <span>Syllabus Mastery</span>
                            <span>{mastery}%</span>
                          </div>
                          <div className="h-3.5 w-full bg-black border-2 border-black rounded-full overflow-hidden p-0.5">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mastery}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Boss Indicator */}
                      <div className="mt-6 pt-4 border-t-2 border-black/40 flex items-center justify-between">
                        {boss ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl animate-pulse shrink-0">{boss.emoji}</span>
                            <div className="text-[9px] text-left">
                              <span className="block font-bold text-slate-500 uppercase tracking-widest">Active Boss</span>
                              <span className="block font-black text-rose-400 uppercase leading-none">{boss.name}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-text-muted uppercase">No boss gate</span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] font-black text-purple-400 uppercase group-hover:gap-2 transition-all shrink-0">
                          Enter Deck <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredSubjects.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-slate-900/20 border-3 border-dashed border-black/20 rounded-[4px]">
                    <HelpCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-sm text-text-secondary font-semibold">No subjects match the search query.</p>
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
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 border-3 border-black rounded-[4px] shadow-[4px_4px_0_#000]">
                <button 
                  onClick={() => setActiveSubject(null)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Matrix
                </button>
                <div className="flex items-center gap-3">
                  <span className="nv-badge bg-purple-500 text-black text-[9px]">
                    Class {selectedClass}
                  </span>
                  <span className="text-2xl font-black uppercase text-white tracking-tight">
                    {activeSubject}
                  </span>
                </div>
                
                {/* Cheatsheet activator */}
                {(activeSubject.toLowerCase().includes('math') || 
                  activeSubject.toLowerCase().includes('science') || 
                  activeSubject.toLowerCase().includes('physics') || 
                  activeSubject.toLowerCase().includes('chemistry')) && (
                  <button 
                    onClick={() => setShowCheatsheet(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-800 border-2 border-black hover:bg-slate-700 hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-colors shadow-[2px_2px_0_#000] active:translate-y-[2px]"
                  >
                    <Book className="w-4 h-4 text-purple-400" /> Formulas Cheatsheet
                  </button>
                )}
              </div>

              {/* Main Deck layout: Stats / Boss on left, Chapters on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT BLOCK: SUBJECT SUMMARY & BOSS CARD */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Subject progress panel */}
                  <div className="nv-card bg-slate-900 border-3 border-black space-y-4 shadow-[6px_6px_0_#000]">
                    <h3 className="text-lg font-black uppercase text-white border-b-2 border-black pb-3">Syllabus Status</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 border border-white/5 rounded-[4px]">
                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Chapters</span>
                        <span className="text-2xl font-black text-purple-400">{subjectData.chapters.length}</span>
                      </div>
                      <div className="bg-black/30 p-4 border border-white/5 rounded-[4px]">
                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mastery</span>
                        <span className="text-2xl font-black text-green-400">{getSubjectMastery(activeSubject)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-4 w-full bg-black border-2 border-black rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: `${getSubjectMastery(activeSubject)}%` }} />
                      </div>
                      <span className="block text-[9px] text-text-muted text-center font-bold uppercase tracking-wider">
                        Complete quizzes to master chapters!
                      </span>
                    </div>
                  </div>

                  {/* RPG Subject Boss fight card */}
                  {(() => {
                    const boss = getSubjectBoss(activeSubject);
                    if (!boss) return null;
                    return (
                      <motion.div 
                        animate={bossShake ? {
                          x: [0, -10, 10, -10, 10, 0],
                          rotate: [0, -1, 1, -1, 1, 0]
                        } : {}}
                        transition={{ duration: 0.4 }}
                        className="nv-card bg-slate-900 border-3 border-black border-l-rose-500 border-l-[8px] space-y-5 relative overflow-hidden shadow-[6px_6px_0_#000]"
                      >
                        {/* Combat Floating Numbers overlay */}
                        <div className="absolute inset-0 pointer-events-none z-30">
                          {combatEffects.map(effect => (
                            <motion.span
                              key={effect.id}
                              initial={{ opacity: 1, y: 120, scale: 0.6 }}
                              animate={{ opacity: 0, y: 30, scale: 1.4 }}
                              transition={{ duration: 1 }}
                              className="absolute font-black text-rose-500 text-2xl uppercase tracking-tighter text-shadow-nb select-none"
                              style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                            >
                              {effect.text}
                            </motion.span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Syllabus Boss gate</span>
                          <span className="nv-badge bg-rose-500 text-black text-[8px] font-black px-2 py-0.5">
                            Active target
                          </span>
                        </div>

                        <div className="flex items-center gap-4 relative">
                          <div className={`text-5xl select-none ${boss.hp > 0 ? 'animate-bounce' : 'opacity-40 filter grayscale'}`}>
                            {boss.emoji}
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight">{boss.name}</h4>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                              HP: {boss.hp} / {boss.max}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-4.5 w-full bg-black border-2 border-black rounded-[4px] overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-rose-500 rounded-[2px] transition-all duration-300" 
                              style={{ width: `${(boss.hp / boss.max) * 100}%` }} 
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-wider">
                            <span>Guardian Health Bar</span>
                            {boss.hp === 0 ? (
                              <span className="text-green-400 font-bold">DEFEATED 🎉</span>
                            ) : (
                              <span>Damage multiplier x1.2</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => navigate('/boss-raid')}
                            className="w-full py-4 bg-rose-600 border-2 border-black text-black font-black uppercase tracking-widest text-[10px] rounded-[4px] hover:bg-rose-500 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                          >
                            <Swords className="w-5 h-5 shrink-0" /> Enter Boss Arena
                          </button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>

                {/* RIGHT BLOCK: CHAPTERS TIMELINE ROADMAP */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-purple-400 animate-pulse" />
                    <h2 className="text-2xl font-black uppercase text-white">Syllabus Timeline path</h2>
                  </div>

                  <div className="space-y-6 relative pl-6 border-l-4 border-black">
                    {subjectData.chapters.map((ch, idx) => {
                      const chapterKey = `${selectedClass}_${activeSubject}_${ch.title}`;
                      const isChapterCompleted = completedChapters[chapterKey];
                      const isExpanded = expandedChapter?.title === ch.title;

                      return (
                        <div key={idx} className="relative">
                          {/* Node circle dot on path line */}
                          <div className={`absolute w-7 h-7 rounded-full border-3 border-black left-[-39px] top-6 flex items-center justify-center text-[10px] font-black transition-all ${
                            isChapterCompleted 
                              ? 'bg-green-500 text-black' 
                              : isExpanded 
                                ? 'bg-purple-500 text-black ring-4 ring-purple-500/20' 
                                : 'bg-slate-900 text-text-muted border-dashed'
                          }`}>
                            {isChapterCompleted ? '✓' : idx + 1}
                          </div>

                          <div className={`nv-card bg-slate-900/40 border-2 border-black p-6 transition-all ${
                            isExpanded ? 'shadow-[8px_8px_0_#000] border-purple-500' : 'hover:translate-x-1 hover:border-black/80'
                          }`}>
                            
                            {/* Card Header Info */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{ch.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium">{ch.summary}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                                {isChapterCompleted && (
                                  <span className="nv-badge bg-green-500 text-black flex items-center gap-1 text-[8px] px-2 py-0.5">
                                    ✓ Mastered
                                  </span>
                                )}
                                <button
                                  onClick={() => isExpanded ? setExpandedChapter(null) : selectChapter(ch)}
                                  className="px-4 py-2 border-2 border-black bg-slate-800 hover:bg-slate-700 text-[9px] font-black uppercase tracking-wider rounded-[4px] text-text-secondary hover:text-white transition-colors"
                                >
                                  {isExpanded ? 'Collapse' : 'Expand Topic'}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Interactive Control Deck */}
                            {isExpanded && (
                              <div className="mt-8 pt-6 border-t-2 border-black space-y-6">
                                {/* Tab selector */}
                                <div className="flex border-b-2 border-black pb-2 gap-2 overflow-x-auto no-scrollbar">
                                  {[
                                    { id: 'learn', label: '1. Interactive Study', icon: BookOpen },
                                    { id: 'recall', label: '2. 3D Flashcards', icon: Zap },
                                    { id: 'prep', label: '3. Board Exam PYQs', icon: FileText },
                                    { id: 'practice', label: '4. Practice Quiz', icon: HelpCircle }
                                  ].map(tab => (
                                    <button
                                      key={tab.id}
                                      onClick={() => {
                                        setStudyTab(tab.id);
                                        if (tab.id === 'recall') {
                                          setCardIdx(0);
                                          setIsFlipped(false);
                                          setFlashcardDeckComplete(false);
                                        } else if (tab.id === 'practice') {
                                          startQuiz(ch);
                                        }
                                      }}
                                      className={`px-4 py-2.5 border-2 border-black rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all ${
                                        studyTab === tab.id 
                                          ? 'bg-purple-500 text-black shadow-[2px_2px_0_#000]' 
                                          : 'bg-slate-900 text-text-secondary hover:bg-slate-800 hover:text-white'
                                      }`}
                                    >
                                      <tab.icon className="w-3.5 h-3.5 inline mr-1.5 shrink-0" />
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>

                                {/* TAB 1: INTERACTIVE LEARNING & SCHOLAR SANDBOXES */}
                                {studyTab === 'learn' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                      <h4 className="text-xs font-black uppercase text-purple-400 tracking-widest">NCERT Syllabus Matrix Notes</h4>
                                      
                                      {/* ELI5 Analogies Switch */}
                                      <button
                                        onClick={() => setEli5Mode(!eli5Mode)}
                                        className={`px-3 py-1 border-2 border-black rounded-[4px] text-[8px] font-black uppercase tracking-wider transition-all shadow-[2px_2px_0_#000] active:translate-y-[1px] ${
                                          eli5Mode ? 'bg-green-500 text-black' : 'bg-slate-800 text-purple-400 hover:bg-slate-700'
                                        }`}
                                      >
                                        {eli5Mode ? '🤖 Academic Terms' : '👶 Explain Like I\'m 5'}
                                      </button>
                                    </div>

                                    {/* Key Syllabus Ideas Carousel/List */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {ch.keyIdeas?.map((idea, i) => (
                                        <div key={i} className="bg-slate-950 p-5 border-2 border-black rounded-[4px] flex items-start gap-3 shadow-[3px_3px_0_#000]">
                                          <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-[10px] font-black shrink-0 shadow-[1px_1px_0_#000]">
                                            {i + 1}
                                          </div>
                                          <div className="space-y-1">
                                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                              Concept Point
                                            </span>
                                            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                              {eli5Mode ? (
                                                idea.toLowerCase().includes('quadrant') 
                                                  ? "The coordinate plane is cut into 4 quarters, like slicing a pizza into four large slices!"
                                                  : idea.toLowerCase().includes('origin')
                                                    ? "The origin is the starting point on your map (0,0), like home base in a game!"
                                                    : idea.toLowerCase().includes('displacement')
                                                      ? "Distance is the total footsteps you walked, while displacement is just a straight line from start to end!"
                                                      : idea.toLowerCase().includes('velocity')
                                                        ? "Velocity is how fast you run PLUS which direction you are running, like sprinting North at 10km/h!"
                                                        : idea.split(':')[1] || idea
                                              ) : idea}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* DYNAMIC CBSE EXPERIMENT & SANDBOX DIAGRAMS */}
                                    <div className="pt-6 border-t border-black/40 space-y-6">
                                      <h5 className="text-xs font-black uppercase text-cyan-400 tracking-widest">
                                        Interactive Diagram Sandboxes
                                      </h5>

                                      {/* MATH SANDBOX: Live Cartesian coordinates plotter */}
                                      {ch.title.toLowerCase().includes('geometry') && (
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-6 border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000]">
                                          <div className="md:col-span-6 flex flex-col justify-center items-center">
                                            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-4">
                                              Click Grid Intersections to Plot Coordinate Points
                                            </span>
                                            
                                            {/* Coordinate Grid */}
                                            <div className="relative w-64 h-64 bg-slate-900 border-3 border-black rounded flex items-center justify-center shadow-[4px_4px_0_#000]">
                                              <div className="absolute inset-0 grid grid-cols-11 grid-rows-11">
                                                {(() => {
                                                  const cells = [];
                                                  for (let y = 5; y >= -5; y--) {
                                                    for (let x = -5; x <= 5; x++) {
                                                      cells.push({ x, y });
                                                    }
                                                  }
                                                  return cells.map((cell, cidx) => {
                                                    const isX = cell.y === 0;
                                                    const isY = cell.x === 0;
                                                    const isSelected = cell.x === plottedPoint.x && cell.y === plottedPoint.y;
                                                    return (
                                                      <div
                                                        key={cidx}
                                                        onClick={() => setPlottedPoint({ x: cell.x, y: cell.y })}
                                                        className={`relative flex items-center justify-center border border-slate-900/10 cursor-pointer hover:bg-purple-500/20 transition-colors ${
                                                          isX ? 'border-b-2 border-b-slate-500' : ''
                                                        } ${
                                                          isY ? 'border-r-2 border-r-slate-500' : ''
                                                        }`}
                                                      >
                                                        {cell.x === 0 && cell.y === 0 && (
                                                          <div className="absolute w-2 h-2 bg-yellow-500 rounded-full z-10" />
                                                        )}
                                                        {isSelected && (
                                                          <div className="absolute w-4.5 h-4.5 bg-purple-500 rounded-full border-2 border-black flex items-center justify-center shadow-lg z-20">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  });
                                                })()}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                                            <div className="p-4 bg-slate-900 border-2 border-black rounded-[4px] space-y-2">
                                              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                Plot Diagnostic Console
                                              </span>
                                              <div className="flex justify-between border-b border-black pb-1.5 text-sm">
                                                <span className="text-slate-400">Current Position</span>
                                                <strong className="text-purple-400">P({plottedPoint.x}, {plottedPoint.y})</strong>
                                              </div>
                                              <div className="flex justify-between border-b border-black pb-1.5 text-xs">
                                                <span className="text-slate-400">Quadrant Location</span>
                                                <strong className="text-yellow-400">
                                                  {(() => {
                                                    const { x, y } = plottedPoint;
                                                    if (x === 0 && y === 0) return "Origin";
                                                    if (x === 0) return "Y-Axis Boundary";
                                                    if (y === 0) return "X-Axis Boundary";
                                                    if (x > 0 && y > 0) return "Quadrant I (+, +)";
                                                    if (x < 0 && y > 0) return "Quadrant II (-, +)";
                                                    if (x < 0 && y < 0) return "Quadrant III (-, -)";
                                                    return "Quadrant IV (+, -)";
                                                  })()}
                                                </strong>
                                              </div>
                                              <div className="flex justify-between text-xs">
                                                <span className="text-slate-400">Distance from (0,0)</span>
                                                <strong className="font-mono text-green-400">
                                                  √({plottedPoint.x}² + {plottedPoint.y}²) = {Math.sqrt(plottedPoint.x*plottedPoint.x + plottedPoint.y*plottedPoint.y).toFixed(2)} units
                                                </strong>
                                              </div>
                                            </div>

                                            <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-[4px] text-xs leading-relaxed text-slate-400">
                                              <strong className="text-blue-400 block mb-1">💡 Baudhayana-Pythagoras link:</strong>
                                              The Distance formula uses right angles to compute absolute displacement. The Baudhāyana-Pythagoras Theorem was documented in Indian Sulba Sutras as early as 800 BCE to construct geometric brick layout systems.
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* SCIENCE SANDBOX: Live motion distance vs displacement vector simulator */}
                                      {ch.title.toLowerCase().includes('motion') && (
                                        <div className="bg-slate-950 p-6 border-2 border-black rounded-[4px] space-y-6 shadow-[4px_4px_0_#000]">
                                          <div className="text-center space-y-1">
                                            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                                              Live Physics Simulator
                                            </span>
                                            <h6 className="text-sm font-black uppercase text-white">Distance vs Displacement Simulation</h6>
                                            <p className="text-slate-400 text-[10px]">
                                              Simulate driving a vehicle to the target flag (100m) and back home (0m) to study how vectors behave.
                                            </p>
                                          </div>

                                          {/* Visual Animation Track */}
                                          <div className="relative h-16 bg-slate-900 border-2 border-black rounded flex items-center px-4 overflow-hidden">
                                            <div className="absolute left-4 w-3.5 h-3.5 rounded-full bg-blue-500 shadow-lg border border-black flex items-center justify-center text-[7px] font-black text-white">A</div>
                                            <div className="absolute right-4 w-3.5 h-3.5 rounded-full bg-red-500 shadow-lg border border-black flex items-center justify-center text-[7px] font-black text-white">B</div>
                                            
                                            {/* Connecting track line */}
                                            <div className="absolute left-8 right-8 h-1.5 bg-black rounded" />

                                            {/* Driving Car Indicator */}
                                            <div 
                                              className="absolute text-2xl select-none transition-all duration-75"
                                              style={{ left: `calc(${motionPercent}% - 12px)` }}
                                            >
                                              🚗
                                            </div>
                                          </div>

                                          {/* Control Panel buttons */}
                                          <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex gap-2">
                                              <button
                                                disabled={isDriving || motionPercent >= 100}
                                                onClick={() => {
                                                  setDrivingDir('forward');
                                                  setIsDriving(true);
                                                }}
                                                className="px-4 py-2 border-2 border-black bg-green-500 disabled:opacity-40 text-black text-[9px] font-black uppercase tracking-wider rounded shadow-[2px_2px_0_#000] active:translate-y-[1px]"
                                              >
                                                Drive to B ➔
                                              </button>
                                              <button
                                                disabled={isDriving || motionPercent <= 0}
                                                onClick={() => {
                                                  setDrivingDir('backward');
                                                  setIsDriving(true);
                                                }}
                                                className="px-4 py-2 border-2 border-black bg-blue-500 disabled:opacity-40 text-black text-[9px] font-black uppercase tracking-wider rounded shadow-[2px_2px_0_#000] active:translate-y-[1px]"
                                              >
                                                ➔ Drive back to A
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setIsDriving(false);
                                                  setMotionPercent(0);
                                                  setMaxDistanceReached(0);
                                                }}
                                                className="px-4 py-2 border-2 border-black bg-slate-800 text-slate-300 text-[9px] font-black uppercase tracking-wider rounded shadow-[2px_2px_0_#000] active:translate-y-[1px]"
                                              >
                                                Reset
                                              </button>
                                            </div>

                                            {/* Live Telemetry details */}
                                            <div className="flex gap-4 bg-slate-900 px-4 py-2 border border-black rounded text-[11px] font-semibold">
                                              <div>
                                                <span className="text-slate-500 uppercase tracking-widest text-[8px] block">Distance</span>
                                                <strong className="text-green-400">
                                                  {drivingDir === 'forward' 
                                                    ? Math.max(maxDistanceReached, motionPercent) 
                                                    : 100 + (100 - motionPercent)}m
                                                </strong>
                                              </div>
                                              <div className="h-6 w-[1px] bg-slate-800" />
                                              <div>
                                                <span className="text-slate-500 uppercase tracking-widest text-[8px] block">Displacement</span>
                                                <strong className="text-cyan-400">{motionPercent}m East</strong>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-[4px] text-xs leading-relaxed text-slate-400">
                                            <strong>💡 Educational Insight:</strong>
                                            If you drive to B (100m) and drive straight back to A, your odometer reads **200m** of actual road traveled. However, your net shift in position is **0m** since you ended exactly where you started!
                                          </div>
                                        </div>
                                      )}

                                      {/* GENERAL/LITERATURE ROADMAP CHART */}
                                      {ch.title.toLowerCase().includes('grandmother') && (
                                        <div className="bg-slate-950 p-6 border-2 border-black rounded-[4px] space-y-4 shadow-[4px_4px_0_#000]">
                                          <div className="text-center">
                                            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                                              Literature Chapter Concept Map
                                            </span>
                                            <h6 className="text-sm font-black uppercase text-white">Narrative Core Arc</h6>
                                          </div>

                                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 relative">
                                            {[
                                              { title: "Sudha Murty", desc: "12-year-old narrator, acting as guide & guru." },
                                              { title: "Krishtakka", desc: "62-year-old grandmother, determined student." },
                                              { title: "Kashi Yatre", desc: "The serialized novel setting her determination." },
                                              { title: "Humility Arc", desc: "Bowing to the teacher on Dassara festival." }
                                            ].map((node, nidx) => (
                                              <div key={nidx} className="flex-1 bg-slate-900 border border-black p-4 rounded relative hover:shadow-[3px_3px_0_#000] transition-all">
                                                <span className="absolute -top-3 -left-2 w-6 h-6 rounded bg-purple-500 text-black font-black flex items-center justify-center text-[10px] border border-black shadow">
                                                  {nidx + 1}
                                                </span>
                                                <h5 className="text-xs font-black uppercase text-white mt-1">{node.title}</h5>
                                                <p className="text-[10px] text-slate-400 leading-normal font-semibold mt-1">{node.desc}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Launch Immersive Study Library Link */}
                                    <div className="pt-6 flex justify-end">
                                      <button 
                                        onClick={() => navigate('/subject-library', { state: { subject: activeSubject, grade: selectedClass } })}
                                        className="px-6 py-4 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400 transition-all flex items-center gap-2 shadow-[3px_3px_0_#000]"
                                      >
                                        Immersive Study Library <ArrowRight className="w-4 h-4 shrink-0" />
                                      </button>
                                    </div>
                                  </motion.div>
                                )}

                                {/* TAB 2: ACTIVE RECALL 3D FLASHCARDS PLAYER */}
                                {studyTab === 'recall' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    {(!ch.flashcards || ch.flashcards.length === 0) ? (
                                      <div className="text-center p-8 bg-black/20 rounded-[4px] text-text-muted text-xs">
                                        No flashcards available for this chapter.
                                      </div>
                                    ) : flashcardDeckComplete ? (
                                      <div className="text-center p-8 bg-purple-500/10 border-2 border-purple-500/30 rounded-[4px] space-y-4 max-w-sm mx-auto shadow-[4px_4px_0_#000]">
                                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                                        <h4 className="text-xl font-black text-white uppercase">Deck Review Complete!</h4>
                                        <p className="text-xs text-slate-350 max-w-xs mx-auto leading-relaxed">
                                          Awesome memory workout! You reviewed all {ch.flashcards.length} cards and earned +15 XP!
                                        </p>
                                        <button
                                          onClick={() => {
                                            setCardIdx(0);
                                            setFlashcardDeckComplete(false);
                                            setIsFlipped(false);
                                          }}
                                          className="px-6 py-2.5 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-wider text-[9px] rounded-[4px] hover:bg-purple-400 shadow-[2px_2px_0_#000]"
                                        >
                                          Restart Deck
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="max-w-md mx-auto space-y-6">
                                        {/* Card index status */}
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted">
                                          <span>Flashcard Deck</span>
                                          <span>Card {cardIdx + 1} of {ch.flashcards.length}</span>
                                        </div>

                                        {/* 3D Flip Card Container */}
                                        <div 
                                          onClick={() => setIsFlipped(!isFlipped)}
                                          className="w-full h-56 perspective-1000 cursor-pointer"
                                        >
                                          <div 
                                            className="relative w-full h-full preserve-3d transition-transform duration-500"
                                            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                          >
                                            {/* Front Side */}
                                            <div 
                                              className="absolute inset-0 backface-hidden nv-card bg-slate-900 border-3 border-black p-8 flex flex-col justify-between"
                                              style={{ backfaceVisibility: 'hidden' }}
                                            >
                                              <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Question / Term</span>
                                              <div className="flex-1 flex items-center justify-center">
                                                <h4 className="text-base md:text-lg font-black text-white text-center leading-snug">
                                                  {ch.flashcards[cardIdx].front}
                                                </h4>
                                              </div>
                                              <span className="text-[8px] font-bold text-center text-slate-500 uppercase tracking-widest">
                                                Click or Press SPACE to reveal answer
                                              </span>
                                            </div>

                                            {/* Back Side */}
                                            <div 
                                              className="absolute inset-0 backface-hidden nv-card bg-slate-800 border-3 border-black p-8 flex flex-col justify-between"
                                              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                            >
                                              <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Explanation / Answer</span>
                                              <div className="flex-1 flex items-center justify-center">
                                                <p className="text-xs md:text-sm font-semibold text-text-primary text-center leading-relaxed">
                                                  {ch.flashcards[cardIdx].back}
                                                </p>
                                              </div>
                                              <span className="text-[8px] font-bold text-center text-slate-500 uppercase tracking-widest">
                                                Press SPACE to view question
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Assessment Action controls */}
                                        <AnimatePresence>
                                          {isFlipped && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 10 }}
                                              className="grid grid-cols-2 gap-4"
                                            >
                                              <button
                                                onClick={() => nextFlashcard('hard')}
                                                className="py-3.5 bg-slate-800 border-2 border-black text-text-primary font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-slate-700 transition-all shadow-[2px_2px_0_#000] active:translate-y-[1px]"
                                              >
                                                🧠 Hard (←)
                                              </button>
                                              <button
                                                onClick={() => nextFlashcard('easy')}
                                                className="py-3.5 bg-green-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-green-400 transition-all shadow-[2px_2px_0_#000] active:translate-y-[1px]"
                                              >
                                                😊 Easy (→)
                                              </button>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )}
                                  </motion.div>
                                )}

                                {/* TAB 3: BOARD EXAM PYQ & MARKING CRITERIA CHECKLIST */}
                                {studyTab === 'prep' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    <div className="border-b border-white/5 pb-2">
                                      <h4 className="text-xs font-black uppercase text-purple-400 tracking-widest">CBSE Exam PYQ Evaluation</h4>
                                      <p className="text-slate-400 text-[10px] mt-1">
                                        Test your self-written answers against the real CBSE NCERT marking rubrics.
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                      <div className="md:col-span-7 space-y-4">
                                        <h5 className="text-sm font-black uppercase text-white">Board Exam Marking Rubric Checklist</h5>
                                        
                                        <div className="space-y-3">
                                          {[
                                            { id: 'def', label: '1. Defined Key Definitions / Terms accurately', desc: 'Checks fundamental factual criteria.' },
                                            { id: 'formula', label: '2. Wrote the standard algebraic formulas first', desc: 'Ensures structural formula steps score.' },
                                            { id: 'diagram', label: '3. Drew clean diagrams / flowcharts if requested', desc: 'Validates visual presentation points.' },
                                            { id: 'steps', label: '4. Laid out calculations/arguments step-by-step', desc: 'Earns marks for mathematical logic flow.' },
                                            { id: 'units', label: '5. Wrote correct SI units in the final statement', desc: 'Avoids minor calculation deduction errors.' }
                                          ].map(item => (
                                            <label 
                                              key={item.id}
                                              className="flex items-start gap-3 p-4 bg-slate-950 border-2 border-black rounded-[4px] cursor-pointer hover:bg-slate-900 transition-colors shadow-[2px_2px_0_#000]"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={pyqChecks[item.id]}
                                                onChange={(e) => setPyqChecks(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                                className="mt-1 accent-purple-500 w-4 h-4 rounded border-2 border-black"
                                              />
                                              <div className="space-y-0.5">
                                                <span className="block text-xs font-black text-white">{item.label}</span>
                                                <span className="block text-[9px] text-slate-500 uppercase tracking-wider">{item.desc}</span>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="md:col-span-5 space-y-6">
                                        {/* Score Diagnostic Panel */}
                                        <div className="p-6 bg-slate-900 border-2 border-black rounded-[4px] text-center space-y-4 shadow-[4px_4px_0_#000]">
                                          <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Syllabus Evaluation Score</h5>
                                          
                                          <div className="py-2">
                                            <span className="text-5xl font-black text-purple-400 font-mono">{getPyqScore()}%</span>
                                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                              Rubric Alignment index
                                            </span>
                                          </div>

                                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                                            {getPyqScore() === 100 
                                              ? "🏆 Perfect! Your answers align exactly with standard CBSE guidelines to unlock full scoring potential."
                                              : "Complete all rubric checks to optimize answers for full marks in exams."}
                                          </p>

                                          <div className="h-3.5 w-full bg-black border border-black rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${getPyqScore()}%` }} />
                                          </div>
                                        </div>

                                        {/* CBSE Guidance Patterns */}
                                        <div className="p-5 bg-slate-900 border border-white/5 rounded text-xs space-y-3 font-semibold text-slate-400">
                                          <div className="flex items-center gap-2 text-cyan-400 font-black uppercase text-[10px] tracking-wider">
                                            <Info className="w-4 h-4" /> CBSE PYQ Patterns
                                          </div>
                                          <p className="leading-relaxed">
                                            CBSE awards marks step-by-step. Even if your final calculation is wrong, writing formulas, drawing diagrams, and stating parameters will secure up to 80% of the question's marks.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* TAB 4: PRACTICE QUIZ ARENA */}
                                {studyTab === 'practice' && quizActive && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                  >
                                    {(!ch.qna || ch.qna.length === 0) ? (
                                      <div className="text-center p-8 bg-black/20 rounded-[4px] text-text-muted text-xs">
                                        No questions available for a quiz in this chapter.
                                      </div>
                                    ) : quizComplete ? (
                                      <div className="text-center p-8 bg-purple-500/10 border-2 border-purple-500/30 rounded-[4px] space-y-4 max-w-md mx-auto shadow-[4px_4px_0_#000]">
                                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                                        <h4 className="text-2xl font-black text-white uppercase">Recall Quiz Complete!</h4>
                                        
                                        <div className="py-2">
                                          <div className="text-[10px] font-bold text-text-muted uppercase">Final Score</div>
                                          <div className="text-4xl font-black text-purple-400 font-mono">
                                            {quizScore} / {quizQuestions.length}
                                          </div>
                                        </div>

                                        <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                                          {quizScore === quizQuestions.length 
                                            ? "🎉 Perfect score! You have completely mastered this chapter. Dealt massive damage to the Subject Boss!"
                                            : "Good attempt! Keep reviewing to achieve perfect syllabus mastery."}
                                        </p>

                                        <div className="bg-black/40 p-4 border border-white/5 rounded-[4px] grid grid-cols-2 gap-4 text-center">
                                          <div>
                                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">XP Gained</span>
                                            <span className="text-sm font-black text-purple-400">+{quizScore * 20} XP</span>
                                          </div>
                                          <div>
                                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Coins Earned</span>
                                            <span className="text-sm font-black text-amber-400">+{quizScore * 5} Coins</span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => startQuiz(ch)}
                                          className="w-full py-3 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400 shadow-[3px_3px_0_#000]"
                                        >
                                          Try Again
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="max-w-xl mx-auto space-y-6">
                                        {/* Quiz status bar */}
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted">
                                          <span>Chapter Recall Challenge</span>
                                          <span>Question {quizIdx + 1} of {quizQuestions.length}</span>
                                        </div>

                                        {/* Question card */}
                                        <div className="nv-card bg-slate-900 border-2 border-black p-6 shadow-[4px_4px_0_#000]">
                                          <h4 className="text-sm font-bold text-white leading-relaxed">
                                            {quizQuestions[quizIdx]?.q}
                                          </h4>
                                        </div>

                                        {/* Multiple choice options */}
                                        <div className="grid grid-cols-1 gap-3">
                                          {quizQuestions[quizIdx]?.shuffledOptions.map((opt, i) => {
                                            const isSelected = selectedOpt === opt;
                                            const isCorrectAnswer = opt === quizQuestions[quizIdx].a;
                                            const shouldShowCorrect = quizSubmitted && isCorrectAnswer;
                                            const shouldShowIncorrect = quizSubmitted && isSelected && !isCorrectAnswer;

                                            return (
                                              <button
                                                key={i}
                                                disabled={quizSubmitted}
                                                onClick={() => submitQuizAnswer(opt)}
                                                className={`w-full p-4 border-2 border-black rounded-[4px] text-xs font-black uppercase tracking-wide text-left transition-all ${
                                                  shouldShowCorrect
                                                    ? 'bg-green-500 text-black shadow-none border-green-500'
                                                    : shouldShowIncorrect
                                                      ? 'bg-rose-500 text-black shadow-none border-rose-500'
                                                      : isSelected
                                                        ? 'bg-purple-500 text-black shadow-none border-purple-500'
                                                        : 'bg-slate-900/60 text-text-secondary hover:bg-slate-800 hover:text-white shadow-[2px_2px_0_#000]'
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span>{opt}</span>
                                                  {shouldShowCorrect && <span className="font-bold text-[10px] uppercase bg-black text-green-400 px-2 py-0.5 rounded border border-black shadow">✓ Correct</span>}
                                                  {shouldShowIncorrect && <span className="font-bold text-[10px] uppercase bg-black text-rose-400 px-2 py-0.5 rounded border border-black shadow">✗ Incorrect</span>}
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>

                                        {/* Action buttons */}
                                        {quizSubmitted && (
                                          <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                          >
                                            {/* Explanatory notes box */}
                                            {quizQuestions[quizIdx].explanation && (
                                              <div className="p-4 bg-slate-900 border border-white/5 text-[10px] font-semibold text-slate-400 rounded-[4px] leading-relaxed">
                                                <span className="block text-[8px] font-bold text-purple-400 uppercase tracking-widest mb-1">Concept Guidance</span>
                                                {quizQuestions[quizIdx].explanation}
                                              </div>
                                            )}
                                            
                                            <button
                                              onClick={nextQuizQuestion}
                                              className="w-full py-4 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[10px] rounded-[4px] hover:bg-purple-400 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                                            >
                                              {quizIdx + 1 === quizQuestions.length ? 'Finish Quiz 🏆' : 'Next Question ➔'}
                                            </button>
                                          </motion.div>
                                        )}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 📐 FORMULA CHEATSHEET SIDE DRAWER PANEL */}
      <AnimatePresence>
        {showCheatsheet && activeSubject && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheatsheet(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-slate-950 border-l-4 border-black p-8 shadow-2xl flex flex-col justify-between z-10 text-text-primary"
            >
              <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b-2 border-black pb-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Book className="w-5 h-5 animate-pulse" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Formula Matrix Cheatsheet</h3>
                  </div>
                  <button 
                    onClick={() => setShowCheatsheet(false)}
                    className="p-2.5 bg-slate-900 border-2 border-black hover:bg-slate-800 text-text-muted hover:text-white rounded-[4px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter search bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search equations..."
                    value={cheatsheetSearch}
                    onChange={(e) => setCheatsheetSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-black text-xs font-semibold placeholder:text-text-muted focus:border-purple-500 focus:outline-none rounded-[4px]"
                  />
                </div>

                {/* Formulas listing */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {filteredFormulas.length === 0 ? (
                    <div className="text-center py-12 text-text-muted text-xs">
                      No formula keys found matching query.
                    </div>
                  ) : (
                    filteredFormulas.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 border-2 border-black p-4 rounded-[4px] space-y-2 relative overflow-hidden group shadow-[3px_3px_0_#000]">
                        <span className="block text-[8px] font-black uppercase text-purple-400 tracking-widest">
                          {item.chapterTitle}
                        </span>
                        <div className="bg-slate-950 p-3 rounded font-mono text-[11px] text-green-400 border border-black/40 select-all leading-normal">
                          {item.formula}
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.formula)}
                          className="absolute top-3 right-3 p-1.5 bg-slate-800 border border-black rounded hover:bg-slate-700 hover:text-white text-text-muted transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedFormula === item.formula ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="pt-4 border-t-2 border-black text-center text-[10px] text-text-muted font-black uppercase tracking-wider">
                Retrieved directly from official NCERT guidelines.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurriculumHub;
