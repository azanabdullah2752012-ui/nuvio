import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronRight, Search, 
  GraduationCap, Book, Layers, 
  Zap, MessageSquare, Clock,
  ArrowRight, CheckCircle2, Star,
  Swords, Play, Copy, Check, RotateCcw,
  Compass, Lock, Trophy, HelpCircle, FileText,
  X, Info, ChevronLeft, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
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
  { id: '9', name: 'Class 9', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'IT'] },
  { id: '10', name: 'Class 10', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'IT'] },
  { id: '11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
  { id: '12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
];

const SubjectIcon = ({ name }) => {
  const s = name.toLowerCase();
  if (s.includes('math')) return <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl shadow-[4px_4px_0_#000]">∑</div>;
  if (s.includes('sci') || s.includes('phys') || s.includes('chem') || s.includes('bio')) return <div className="w-12 h-12 rounded-2xl bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-400 font-bold text-xl shadow-[4px_4px_0_#000]">⚛</div>;
  if (s.includes('social') || s.includes('hist') || s.includes('geo')) return <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xl shadow-[4px_4px_0_#000]">🌍</div>;
  if (s.includes('english')) return <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl shadow-[4px_4px_0_#000]">A</div>;
  return <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl shadow-[4px_4px_0_#000]">🎴</div>;
};

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

// MOCK HIGH-FIDELITY CURRICULUM DATA FOR OTHER GRADES
const MOCK_CURRICULUM = {
  "10": {
    "Mathematics": {
      chapters: [
        {
          title: "Real Numbers",
          summary: "Explore divisibility of integers, the Fundamental Theorem of Arithmetic, and irrationality proofs of √2, √3, √5.",
          keyIdeas: [
            "Every composite number can be uniquely expressed as a product of primes.",
            "If p is a prime and p divides a², then p divides a, where a is a positive integer.",
            "Real numbers consist of rational and irrational numbers."
          ],
          formulas: ["LCM(a, b) × HCF(a, b) = a × b"],
          flashcards: [
            { front: "Fundamental Theorem of Arithmetic", back: "Every composite number can be expressed as a product of primes, uniquely apart from the order." },
            { front: "Is π rational or irrational?", back: "Irrational. Decimal representation is non-terminating and non-repeating." },
            { front: "Proof technique for irrationality of √2", back: "Proof by Contradiction, assuming √2 = p/q where p and q are co-prime." }
          ],
          qna: [
            { q: "If HCF(a, b) = 1, then a and b are called...", a: "Co-prime", options: ["Co-prime", "Prime", "Composite", "Equal"] },
            { q: "What is the product of LCM and HCF of 12 and 15?", a: "180", options: ["180", "60", "3", "120"] },
            { q: "Which of the following is irrational?", a: "√9", options: ["√2", "√3", "√5", "√9"] }
          ]
        },
        {
          title: "Trigonometry",
          summary: "Introduction to trigonometric ratios (sine, cosine, tangent) and standard trigonometric identities.",
          keyIdeas: [
            "Trigonometric ratios are defined for acute angles in a right-angled triangle.",
            "Standard values for 0°, 30°, 45°, 60°, and 90° are essential for calculation.",
            "Identities help simplify complex geometry calculations."
          ],
          formulas: ["sin²θ + cos²θ = 1", "1 + tan²θ = sec²θ", "1 + cot²θ = cosec²θ", "tanθ = sinθ/cosθ"],
          flashcards: [
            { front: "sin θ in right triangle", back: "Perpendicular / Hypotenuse (Opposite / Hypotenuse)." },
            { front: "Value of tan 45°", back: "Exactly 1." },
            { front: "Complement of sin(90° - θ)", back: "cos θ" }
          ],
          qna: [
            { q: "What is sin² 30° + cos² 30°?", a: "1", options: ["0.5", "1", "0.25", "1.5"] },
            { q: "If sin θ = 3/5, what is cos θ?", a: "4/5", options: ["4/5", "3/4", "5/4", "3/5"] },
            { q: "What is the value of tan 60°?", a: "√3", options: ["1/√3", "√3", "1", "2"] }
          ]
        }
      ]
    },
    "Science": {
      chapters: [
        {
          title: "Chemical Reactions",
          summary: "Diving into chemical changes, balanced equations, combination, decomposition, displacement, and redox reactions.",
          keyIdeas: [
            "A balanced chemical equation has equal atoms on both reactant and product sides.",
            "Combination reactions form a single product; decomposition reactions break one reactant down.",
            "Redox reactions involve simultaneous reduction and oxidation."
          ],
          formulas: ["Reactants → Products"],
          flashcards: [
            { front: "What is a balanced equation?", back: "An equation where the number of atoms of each element is equal on both sides." },
            { front: "Rusting of iron is which type of reaction?", back: "Oxidation / Redox reaction." },
            { front: "What is a precipitate?", back: "An insoluble solid substance formed during a liquid chemical reaction." }
          ],
          qna: [
            { q: "What type of reaction is the burning of coal?", a: "Combination", options: ["Combination", "Decomposition", "Displacement", "Endothermic"] },
            { q: "Which gas is released when calcium carbonate is heated?", a: "Carbon Dioxide", options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"] },
            { q: "What is the color of copper sulfate crystals?", a: "Blue", options: ["Green", "Blue", "White", "Red"] }
          ]
        },
        {
          title: "Acids, Bases & Salts",
          summary: "Properties of acidic and basic solutions, pH scale indicators, and key salts like baking soda and washing soda.",
          keyIdeas: [
            "Acids release H+ ions in water; bases release OH- ions.",
            "pH scale ranges from 0 to 14, where <7 is acidic, 7 is neutral, and >7 is basic.",
            "Salts are formed by neutralization: Acid + Base → Salt + Water."
          ],
          formulas: ["pH = -log[H+]"],
          flashcards: [
            { front: "Litmus indicator in Acid", back: "Turns red." },
            { front: "Litmus indicator in Base", back: "Turns blue." },
            { front: "Chemical formula of Baking Soda", back: "Sodium Hydrogen Carbonate (NaHCO₃)." }
          ],
          qna: [
            { q: "What is the pH of pure water?", a: "7", options: ["0", "5.6", "7", "14"] },
            { q: "Which acid is present in lemon juice?", a: "Citric acid", options: ["Citric acid", "Lactic acid", "Acetic acid", "Methanoic acid"] },
            { q: "What is the common name of Calcium Oxychloride?", a: "Bleaching powder", options: ["Baking soda", "Washing soda", "Bleaching powder", "Gypsum"] }
          ]
        }
      ]
    }
  },
  "11-sci": {
    "Physics": {
      chapters: [
        {
          title: "Units & Measurements",
          summary: "Introduction to physical quantities, SI base units, dimensional analysis, errors, and significant figures.",
          keyIdeas: [
            "SI has 7 base units (meter, kilogram, second, ampere, kelvin, mole, candela).",
            "Dimensional analysis helps check the correctness of physical equations.",
            "Significant figures represent the precision of scientific measurements."
          ],
          formulas: ["Percentage Error = (Δa / a_mean) × 100%"],
          flashcards: [
            { front: "What are the 7 base units in SI?", back: "Meter, Kilogram, Second, Ampere, Kelvin, Mole, Candela." },
            { front: "Dimension of Force", back: "[MLT⁻²] (Mass × Acceleration)." },
            { front: "What does accuracy indicate?", back: "How close a measured value is to the true value of the quantity." }
          ],
          qna: [
            { q: "What are the dimensions of work done?", a: "[ML²T⁻²]", options: ["[MLT⁻¹]", "[ML²T⁻²]", "[MLT⁻²]", "[ML²T⁻¹]"] },
            { q: "Which of the following is NOT a fundamental SI unit?", a: "Newton", options: ["Meter", "Kelvin", "Ampere", "Newton"] },
            { q: "How many significant figures are in 0.0075?", a: "2", options: ["1", "2", "4", "5"] }
          ]
        },
        {
          title: "Laws of Motion",
          summary: "Study of force and inertia, Galileo's experiments, and Newton's three laws of motion.",
          keyIdeas: [
            "Inertia is the resistance of any physical object to any change in its velocity.",
            "F = dp/dt: Force is the rate of change of momentum.",
            "Every action has an equal and opposite reaction acting on different bodies."
          ],
          formulas: ["F = ma", "p = mv", "Friction (f) = μ × N"],
          flashcards: [
            { front: "State Newton's First Law", back: "An object remains at rest or in uniform motion unless acted on by an external force." },
            { front: "SI unit of momentum", back: "kg·m/s." },
            { front: "What is impulse?", back: "The product of average force and time interval: Impulse = F × Δt = Δp." }
          ],
          qna: [
            { q: "What is the force acting on an object of mass 10kg accelerating at 5 m/s²?", a: "50 N", options: ["2 N", "15 N", "50 N", "25 N"] },
            { q: "Is inertia a vector or scalar quantity?", a: "Neither (it is a property, proportional to mass)", options: ["Vector", "Scalar", "Neither", "Both"] },
            { q: "A man pushes a wall with 100 N. The wall pushes the man with:", a: "100 N", options: ["0 N", "50 N", "100 N", "200 N"] }
          ]
        }
      ]
    }
  }
};

// Generates dynamic chapters for grades/subjects not in static records
const generateGenericCurriculum = (grade, subject) => {
  return {
    chapters: [
      {
        title: `${subject} Foundation`,
        summary: `An introductory module outlining the basic principles and core building blocks of Class ${grade} ${subject}.`,
        keyIdeas: [
          `Understanding the basic terminology of Class ${grade} ${subject}.`,
          "Connecting textbook knowledge to practical everyday observations.",
          "Building mathematical or scientific reasoning skills."
        ],
        formulas: subject.toLowerCase().includes('math') || subject.toLowerCase().includes('phys') ? ["Base Formula: Yield = Input × Efficiency"] : [],
        flashcards: [
          { front: `What is the primary goal of Class ${grade} ${subject}?`, back: "To build a strong foundation and understand key syllabus concepts." },
          { front: "What is active recall?", back: "A highly effective study method where you test your memory instead of just rereading." },
          { front: "How do you earn XP?", back: "By completing quizzes, reviewing flashcards, and defeating subject bosses!" }
        ],
        qna: [
          { q: `What is the first step in mastering Class ${grade} ${subject}?`, a: "Active revision", options: ["Rereading notes", "Active revision", "Highlighting text", "Skipping modules"] },
          { q: "Which active study technique is built into Acadevance?", a: "Flashcards and mini-quizzes", options: ["Cramming overnight", "Passive reading", "Flashcards and mini-quizzes", "Ignoring exercises"] },
          { q: "How do you damage the Subject Boss?", a: "By answering quiz questions correctly", options: ["By sleeping", "By answering quiz questions correctly", "By logging out", "By waiting"] }
        ]
      },
      {
        title: `Advanced ${subject} Concepts`,
        summary: `Deepen your comprehension with standard NCERT syllabus concepts for Class ${grade} ${subject}.`,
        keyIdeas: [
          "Applying fundamental concepts to solve complex analytical problems.",
          "Improving problem-solving accuracy and velocity.",
          "Syllabus-aligned mastery and self-assessment."
        ],
        formulas: [],
        flashcards: [
          { front: "What does HOTS stand for?", back: "Higher Order Thinking Skills." },
          { front: "Why are concept checks important?", back: "They expose gaps in understanding before exams." }
        ],
        qna: [
          { q: "What should you do when you get a question wrong?", a: "Review the explanation and try again", options: ["Give up", "Review the explanation and try again", "Ignore it", "Skip the chapter"] },
          { q: "What is the reward for completing this module?", a: "XP, Coins, and Boss Damage", options: ["Nothing", "XP, Coins, and Boss Damage", "Only a badge", "Only coins"] }
        ]
      }
    ]
  };
};

const getCurriculumData = (grade, subject) => {
  if (grade === '9' && CURRICULUM_DATA['9']?.[subject]) {
    return CURRICULUM_DATA['9'][subject];
  }
  if (MOCK_CURRICULUM[grade]?.[subject]) {
    return MOCK_CURRICULUM[grade][subject];
  }
  return generateGenericCurriculum(grade, subject);
};

const CurriculumHub = () => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(authService.me());
  
  // Dashboard & Navigation states
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [studyTab, setStudyTab] = useState('learn'); // 'learn' | 'recall' | 'practice'

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

  const navigate = useNavigate();

  // Load completed chapters list on start
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

  // Filter grade subjects
  const currentClass = CLASSES.find(c => c.id === selectedClass);
  const filteredSubjects = currentClass?.subjects.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
    const subLower = subName.toLowerCase();
    const progress = user?.boss_chapter_progress || {};
    
    let activeBossId = null;
    if (subLower.includes('math') || subLower.includes('algebra') || subLower.includes('geometry')) {
      activeBossId = ['dragon', 'algebra', 'geometry'].find(id => progress[id]?.status === 'active') || 'geometry';
    } else if (subLower.includes('sci') || subLower.includes('phys') || subLower.includes('chem') || subLower.includes('bio')) {
      activeBossId = ['cell', 'motion', 'atom'].find(id => progress[id]?.status === 'active') || 'atom';
    } else if (subLower.includes('social') || subLower.includes('hist') || subLower.includes('geo')) {
      activeBossId = ['empire', 'leviathan'].find(id => progress[id]?.status === 'active') || 'leviathan';
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
      // Deal 100 damage to subject boss!
      gamificationService.dealDamage(activeSubject, 100);
      xpService.awardXp(10, `Quiz correct answer: ${currentQuestion.q.substring(0, 15)}...`);
    } else {
      window.dispatchEvent(new CustomEvent('acadevance_notification', {
        detail: { title: `Wrong! ❌`, message: `Correct: ${currentQuestion.a}`, type: 'warning' }
      }));
    }
  };

  const nextQuizQuestion = () => {
    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
      setSelectedOpt(null);
      setQuizSubmitted(false);
    } else {
      // Quiz complete!
      setQuizComplete(true);
      
      const xpEarned = quizScore * 20;
      const coinsEarned = quizScore * 5;
      
      if (xpEarned > 0) xpService.awardXp(xpEarned, `Mastered ${expandedChapter.title} Quiz`);
      if (coinsEarned > 0) authService.addTokens(coinsEarned);

      // Log stats
      gamificationService.incrementStat('stats_quizzes_correct', quizScore);
      
      const subLower = activeSubject.toLowerCase();
      if (subLower.includes('math')) gamificationService.incrementStat('stats_math_completed', 1);
      else if (subLower.includes('sci') || subLower.includes('phys')) gamificationService.incrementStat('stats_science_completed', 1);
      else if (subLower.includes('social') || subLower.includes('hist')) gamificationService.incrementStat('stats_social_completed', 1);

      // Save chapter completed to state & local
      if (quizScore === quizQuestions.length) {
        const key = `${selectedClass}_${activeSubject}_${expandedChapter.title}`;
        const updated = { ...completedChapters, [key]: true };
        setCompletedChapters(updated);
        localStorage.setItem('acadevance_mastered_chapters', JSON.stringify(updated));
        
        notificationService.send(
          'Chapter Mastered! 🏆',
          `Perfect recall in ${expandedChapter.title}! Added to syllabus index.`,
          'celebration'
        );
      }
    }
  };

  // Flashcards navigation
  const nextFlashcard = (type) => {
    // Stat increment
    gamificationService.incrementStat('stats_flashcards_reviewed', 1);
    
    // XP reward based on assessment
    const xpReward = type === 'easy' ? 5 : 2;
    xpService.awardXp(xpReward, `Flashcard self-assessment: ${type}`);
    
    setIsFlipped(false);
    
    setTimeout(() => {
      if (cardIdx + 1 < expandedChapter.flashcards.length) {
        setCardIdx(prev => prev + 1);
      } else {
        setFlashcardDeckComplete(true);
        xpService.awardXp(15, `Reviewed full deck: ${expandedChapter.title}`);
      }
    }, 200);
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
      <div className="border-b-4 border-black bg-slate-900 p-8 md:p-12 mb-10 shadow-[8px_8px_0_#000]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xs">
              <GraduationCap className="w-5 h-5" /> Interactive CBSE Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Curriculum <span className="text-purple-500 text-shadow-nb">Matrix</span>
            </h1>
            <p className="text-text-secondary font-medium text-sm">
              Conquer CBSE modules, flip flashcards, and run quizzes to damage subject bosses!
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search syllabus or chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nv-input pl-16 h-16"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* 🧭 CLASS SELECTOR BAR */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
          {CLASSES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedClass(c.id);
                setActiveSubject(null);
                setExpandedChapter(null);
              }}
              className={`flex-shrink-0 px-6 py-3 border-2 border-black rounded-[4px] text-xs font-black uppercase tracking-widest transition-all ${
                selectedClass === c.id 
                  ? 'bg-purple-500 text-black shadow-[4px_4px_0_#000] scale-105' 
                  : 'bg-slate-900 text-text-secondary hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 📚 CONDITIONAL VIEW: SUBJECT LIST VS SUBJECT CONTROL DECK */}
        <AnimatePresence mode="wait">
          {!activeSubject ? (
            // SUBJECT GRID VIEW
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-black uppercase text-white">Syllabus Subjects</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSubjects.map((subject, idx) => {
                  const mastery = getSubjectMastery(subject);
                  const boss = getSubjectBoss(subject);
                  return (
                    <motion.div
                      key={subject}
                      onClick={() => {
                        setActiveSubject(subject);
                        setExpandedChapter(null);
                      }}
                      className="nv-card bg-slate-900/60 border-3 border-black p-8 hover:translate-y-[-4px] hover:shadow-[12px_12px_0_#000] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[260px]"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <SubjectIcon name={subject} />
                          <div className="nv-badge bg-black/40 text-text-muted border border-black">
                            Verified CBSE
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-purple-400 transition-colors">{subject}</h3>
                        
                        {/* Mastery status */}
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary">
                            <span>Syllabus Mastery</span>
                            <span>{mastery}%</span>
                          </div>
                          <div className="h-2 w-full bg-black border border-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mastery}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Boss Indicator */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        {boss ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl animate-pulse">{boss.emoji}</span>
                            <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider">
                              Boss: {boss.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-text-muted uppercase">No boss gate</span>
                        )}
                        <span className="flex items-center gap-1 text-[9px] font-black text-purple-400 uppercase group-hover:gap-2 transition-all">
                          Enter Deck <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // SUBJECT CONTROL DECK (FULL INTERACTIVE DESKTOP)
            <motion.div
              key="deck"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Top navigation row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 border-2 border-black rounded-[4px]">
                <button 
                  onClick={() => setActiveSubject(null)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Matrix
                </button>
                <div className="flex items-center gap-3">
                  <span className="nv-badge bg-purple-500 text-black">
                    Class {selectedClass}
                  </span>
                  <span className="text-xl font-black uppercase text-white">
                    {activeSubject}
                  </span>
                </div>
                
                {/* Cheatsheet activator */}
                {(activeSubject.toLowerCase().includes('math') || 
                  activeSubject.toLowerCase().includes('sci') || 
                  activeSubject.toLowerCase().includes('phys') || 
                  activeSubject.toLowerCase().includes('chem')) && (
                  <button 
                    onClick={() => setShowCheatsheet(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-2 border-black hover:bg-slate-700 rounded-[4px] text-[10px] font-black uppercase tracking-wider transition-colors shadow-[2px_2px_0_#000]"
                  >
                    <Book className="w-4 h-4 text-purple-400" /> Formulas Cheatsheet
                  </button>
                )}
              </div>

              {/* Main Deck layout: Stats / Boss on left, Chapters on right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* LEFT BLOCK: SUBJECT SUMMARY & BOSS CARD */}
                <div className="space-y-6">
                  {/* Subject progress panel */}
                  <div className="nv-card bg-slate-900 border-3 border-black space-y-4">
                    <h3 className="text-lg font-black uppercase text-white border-b-2 border-black pb-3">Syllabus Status</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 border border-white/5 rounded-[4px]">
                        <span className="block text-[8px] font-bold text-text-muted uppercase">Chapters</span>
                        <span className="text-xl font-black text-purple-400">{subjectData.chapters.length}</span>
                      </div>
                      <div className="bg-black/30 p-4 border border-white/5 rounded-[4px]">
                        <span className="block text-[8px] font-bold text-text-muted uppercase">Subject Mastery</span>
                        <span className="text-xl font-black text-green-400">{getSubjectMastery(activeSubject)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-black border border-black rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: `${getSubjectMastery(activeSubject)}%` }} />
                      </div>
                      <span className="block text-[9px] text-text-muted text-center font-bold">Complete chapter recall quizzes to master topics!</span>
                    </div>
                  </div>

                  {/* Subject Boss panel */}
                  {(() => {
                    const boss = getSubjectBoss(activeSubject);
                    if (!boss) return null;
                    return (
                      <div className="nv-card bg-slate-900 border-3 border-black border-l-rose-500 border-l-[6px] space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-lg pointer-events-none" />
                        
                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Subject Guardian</span>
                          <span className="nv-badge bg-rose-500 text-black">Active Target</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-4xl animate-bounce">{boss.emoji}</div>
                          <div>
                            <h4 className="text-md font-black text-white">{boss.name}</h4>
                            <p className="text-[10px] text-text-secondary font-semibold">HP: {boss.hp} / {boss.max}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="h-3.5 w-full bg-black border-2 border-black rounded-[4px] overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-rose-500 rounded-[2px] transition-all duration-500" 
                              style={{ width: `${(boss.hp / boss.max) * 100}%` }} 
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-text-muted uppercase">
                            <span>Boss health bar</span>
                            {boss.hp === 0 ? <span className="text-green-400">Defeated 🎉</span> : <span>Damage multiplier x1.2</span>}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => navigate('/boss-raid')}
                            className="w-full py-3 bg-rose-600 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-rose-500 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                          >
                            <Swords className="w-4 h-4" /> Go to Raid Arena
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* RIGHT BLOCK: CHAPTERS TIMELINE PATH */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-black uppercase text-white">Chapter Modules</h2>
                  </div>

                  <div className="space-y-4 relative pl-4 border-l-2 border-black">
                    {subjectData.chapters.map((ch, idx) => {
                      const chapterKey = `${selectedClass}_${activeSubject}_${ch.title}`;
                      const isChapterCompleted = completedChapters[chapterKey];
                      const isExpanded = expandedChapter?.title === ch.title;

                      return (
                        <div key={idx} className="relative">
                          {/* Circle dot on path line */}
                          <div className={`absolute w-5 h-5 rounded-full border-2 border-black left-[-25px] top-6 flex items-center justify-center text-[8px] font-black ${
                            isChapterCompleted 
                              ? 'bg-green-500 text-black' 
                              : isExpanded 
                                ? 'bg-purple-500 text-black' 
                                : 'bg-slate-900 text-text-muted'
                          }`}>
                            {isChapterCompleted ? '✓' : idx + 1}
                          </div>

                          <div className={`nv-card bg-slate-900/40 border-2 border-black p-6 transition-all ${
                            isExpanded ? 'shadow-[8px_8px_0_#000]' : 'hover:translate-x-1'
                          }`}>
                            
                            {/* Card header */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{ch.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed max-w-xl">{ch.summary}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isChapterCompleted && (
                                  <span className="nv-badge bg-green-500 text-black flex items-center gap-1 text-[8px]">
                                    ✓ Mastered
                                  </span>
                                )}
                                <button
                                  onClick={() => isExpanded ? setExpandedChapter(null) : selectChapter(ch)}
                                  className="px-4 py-2 border-2 border-black bg-slate-800 text-[9px] font-black uppercase tracking-wider rounded-[4px] hover:bg-slate-700"
                                >
                                  {isExpanded ? 'Hide' : 'Expand'}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Control deck */}
                            {isExpanded && (
                              <div className="mt-8 pt-6 border-t-2 border-black space-y-6">
                                {/* Tab selector */}
                                <div className="flex border-b border-black pb-2 gap-2 overflow-x-auto no-scrollbar">
                                  {[
                                    { id: 'learn', label: '1. Learn Ideas', icon: BookOpen },
                                    { id: 'recall', label: '2. Memorize Cards', icon: Zap },
                                    { id: 'practice', label: '3. Practice Quiz', icon: HelpCircle }
                                  ].map(tab => (
                                    <button
                                      key={tab.id}
                                      onClick={() => {
                                        setStudyTab(tab.id);
                                        // Reset flashcard decks or start quiz
                                        if (tab.id === 'recall') {
                                          setCardIdx(0);
                                          setIsFlipped(false);
                                          setFlashcardDeckComplete(false);
                                        } else if (tab.id === 'practice') {
                                          startQuiz(ch);
                                        }
                                      }}
                                      className={`px-4 py-2 border-2 border-black rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all ${
                                        studyTab === tab.id 
                                          ? 'bg-purple-500 text-black shadow-[2px_2px_0_#000]' 
                                          : 'bg-slate-900 text-text-secondary hover:bg-slate-800'
                                      }`}
                                    >
                                      <tab.icon className="w-3.5 h-3.5 inline mr-1.5" />
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>

                                {/* TAB 1: LEARN CORE IDEAS */}
                                {studyTab === 'learn' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                  >
                                    <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">Key Curriculum Ideas</h4>
                                    <div className="space-y-3">
                                      {ch.keyIdeas?.map((idea, i) => (
                                        <div key={i} className="bg-black/30 p-4 border border-white/5 rounded-[4px] flex items-start gap-3">
                                          <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-black shrink-0">
                                            {i + 1}
                                          </div>
                                          <p className="text-xs text-text-secondary leading-relaxed font-medium">{idea}</p>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Launch Study Library bridge */}
                                    <div className="pt-4 flex justify-end">
                                      <button 
                                        onClick={() => navigate('/subject-library', { state: { subject: activeSubject, grade: selectedClass } })}
                                        className="px-6 py-3 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400 transition-all flex items-center gap-2"
                                      >
                                        Launch Immersive Study Library <ArrowRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                )}

                                {/* TAB 2: MEMORIZE FLASHCARDS PLAYER */}
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
                                      <div className="text-center p-8 bg-purple-500/10 border-2 border-purple-500/30 rounded-[4px] space-y-4">
                                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                                        <h4 className="text-lg font-black text-white uppercase">Deck Review Complete!</h4>
                                        <p className="text-xs text-text-secondary max-w-sm mx-auto">
                                          Awesome memory workout! You reviewed all {ch.flashcards.length} cards and earned +15 XP!
                                        </p>
                                        <button
                                          onClick={() => {
                                            setCardIdx(0);
                                            setFlashcardDeckComplete(false);
                                            setIsFlipped(false);
                                          }}
                                          className="px-6 py-2.5 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-wider text-[9px] rounded-[4px] hover:bg-purple-400"
                                        >
                                          Restart Deck
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="max-w-md mx-auto space-y-6">
                                        {/* Card index */}
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-text-muted">
                                          <span>Flashcard Deck</span>
                                          <span>Card {cardIdx + 1} of {ch.flashcards.length}</span>
                                        </div>

                                        {/* 3D Flip Card */}
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
                                              <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">Question / Term</span>
                                              <div className="flex-1 flex items-center justify-center">
                                                <h4 className="text-md md:text-lg font-black text-white text-center leading-snug">
                                                  {ch.flashcards[cardIdx].front}
                                                </h4>
                                              </div>
                                              <span className="text-[8px] font-bold text-center text-text-muted uppercase">Click card to reveal answer</span>
                                            </div>

                                            {/* Back Side */}
                                            <div 
                                              className="absolute inset-0 backface-hidden nv-card bg-slate-800 border-3 border-black p-8 flex flex-col justify-between"
                                              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                            >
                                              <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">Explanation / Answer</span>
                                              <div className="flex-1 flex items-center justify-center">
                                                <p className="text-sm font-medium text-text-primary text-center leading-relaxed">
                                                  {ch.flashcards[cardIdx].back}
                                                </p>
                                              </div>
                                              <span className="text-[8px] font-bold text-center text-text-muted uppercase">Click card to view question</span>
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
                                                className="py-3 bg-slate-800 border-2 border-black text-text-primary font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-slate-700 transition-all shadow-[2px_2px_0_#000]"
                                              >
                                                🧠 Hard (+2 XP)
                                              </button>
                                              <button
                                                onClick={() => nextFlashcard('easy')}
                                                className="py-3 bg-green-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-green-400 transition-all shadow-[2px_2px_0_#000]"
                                              >
                                                😊 Easy (+5 XP)
                                              </button>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )}
                                  </motion.div>
                                )}

                                {/* TAB 3: PRACTICE QUIZ ARENA */}
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
                                      <div className="text-center p-8 bg-purple-500/10 border-2 border-purple-500/30 rounded-[4px] space-y-4 max-w-md mx-auto">
                                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                                        <h4 className="text-xl font-black text-white uppercase">Recall Quiz Complete!</h4>
                                        
                                        <div className="py-2">
                                          <div className="text-[10px] font-bold text-text-muted uppercase">Final Score</div>
                                          <div className="text-4xl font-black text-purple-400">
                                            {quizScore} / {quizQuestions.length}
                                          </div>
                                        </div>

                                        <p className="text-xs text-text-secondary leading-relaxed">
                                          {quizScore === quizQuestions.length 
                                            ? "🎉 Perfect score! You have completely mastered this chapter. Dealt massive damage to the Subject Boss!"
                                            : "Good attempt! Keep reviewing to achieve perfect syllabus mastery."}
                                        </p>

                                        <div className="bg-black/40 p-4 border border-white/5 rounded-[4px] grid grid-cols-2 gap-4 text-center">
                                          <div>
                                            <span className="block text-[8px] font-bold text-text-muted uppercase">XP Gained</span>
                                            <span className="text-md font-black text-purple-400">+{quizScore * 20} XP</span>
                                          </div>
                                          <div>
                                            <span className="block text-[8px] font-bold text-text-muted uppercase">Coins Earned</span>
                                            <span className="text-md font-black text-amber-400">+{quizScore * 5} Coins</span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => startQuiz(ch)}
                                          className="w-full py-3 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400"
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
                                        <div className="nv-card bg-slate-900 border-2 border-black p-6">
                                          <h4 className="text-sm font-black text-white leading-relaxed">
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
                                                    ? 'bg-green-500 text-black shadow-none'
                                                    : shouldShowIncorrect
                                                      ? 'bg-rose-500 text-black shadow-none'
                                                      : isSelected
                                                        ? 'bg-purple-500 text-black shadow-none'
                                                        : 'bg-slate-900/60 text-text-secondary hover:bg-slate-800'
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span>{opt}</span>
                                                  {shouldShowCorrect && <span className="font-bold text-xs">✓ Correct</span>}
                                                  {shouldShowIncorrect && <span className="font-bold text-xs">✗ Incorrect</span>}
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
                                            {/* Explanatory text */}
                                            {quizQuestions[quizIdx].explanation && (
                                              <div className="p-4 bg-slate-900 border border-white/5 text-[10px] font-semibold text-text-secondary rounded-[4px] leading-relaxed">
                                                <span className="block text-[8px] font-bold text-purple-400 uppercase tracking-widest mb-1">Concept Guidance</span>
                                                {quizQuestions[quizIdx].explanation}
                                              </div>
                                            )}
                                            
                                            <button
                                              onClick={nextQuizQuestion}
                                              className="w-full py-3.5 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400 shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
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
            {/* Backdrop filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheatsheet(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-slate-950 border-l-4 border-black p-8 shadow-2xl flex flex-col justify-between z-10 text-text-primary"
            >
              <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Book className="w-5 h-5" />
                    <h3 className="text-lg font-black uppercase">Formula Cheatsheet</h3>
                  </div>
                  <button 
                    onClick={() => setShowCheatsheet(false)}
                    className="p-2 bg-slate-900 border border-black hover:bg-slate-800 text-text-muted hover:text-white rounded-[4px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter search bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search equations or chapters..."
                    value={cheatsheetSearch}
                    onChange={(e) => setCheatsheetSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-black text-xs placeholder:text-text-muted focus:border-purple-500 focus:outline-none rounded-[4px]"
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
                      <div key={idx} className="bg-slate-900 border border-white/5 p-4 rounded-[4px] space-y-2 relative overflow-hidden group">
                        <span className="block text-[8px] font-black uppercase text-purple-400">
                          {item.chapterTitle}
                        </span>
                        <div className="bg-black/40 p-3 rounded font-mono text-[11px] text-green-400 border border-black/40 select-all leading-normal">
                          {item.formula}
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.formula)}
                          className="absolute top-3 right-3 p-1.5 bg-slate-800 border border-black/60 rounded hover:bg-slate-700 hover:text-white text-text-muted transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedFormula === item.formula ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="pt-4 border-t border-white/10 text-center text-[10px] text-text-muted font-bold">
                Formula values retrieved directly from NCERT textbook curriculum guidelines.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurriculumHub;
