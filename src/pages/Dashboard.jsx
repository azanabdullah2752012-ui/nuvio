import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Target, BookOpen, 
  ChevronRight, ArrowUpRight, Flame,
  Clock, Star, Sparkles, Coins, ArrowRight,
  X, CheckCircle2, Lock, RotateCcw, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { xpService } from '../services/xpService';
import { dataService } from '../services/dataService';
import { revisionService } from '../services/revisionService';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { EXPANDED_CURRICULUM } from '../services/expandedCurriculum';
import { CURRICULUM_DATA } from '../services/curriculumData';

const Dashboard = () => {
  const [user, setUser] = useState(authService.me());
  const [activity, setActivity] = useState([]);
  const [peers, setPeers] = useState([]);
  const [counts, setCounts] = useState({ tasks: 0, decks: 0 });
  const [loading, setLoading] = useState(true);
  const [nextMilestone, setNextMilestone] = useState({ label: 'Level 2', remaining: 100 });
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const navigate = useNavigate();

  const [cloudActive, setCloudActive] = useState(false);

  const [showLoginReward, setShowLoginReward] = useState(false);
  const [rewardDay, setRewardDay] = useState(1);

  const [recommendations, setRecommendations] = useState([]);
  const [revisionQueue, setRevisionQueue] = useState([]);

  // Daily Adaptive Recall Mission states
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [missionQuestions, setMissionQuestions] = useState([]);
  const [missionIndex, setMissionIndex] = useState(0);
  const [missionSelectedOpt, setMissionSelectedOpt] = useState(null);
  const [missionSubmitted, setMissionSubmitted] = useState(false);
  const [missionStreak, setMissionStreak] = useState(0);
  const [missionScore, setMissionScore] = useState(0);
  const [missionFinished, setMissionFinished] = useState(false);
  const [missionCompletedToday, setMissionCompletedToday] = useState(false);
  const [missionXP, setMissionXP] = useState(0);
  const [missionCoins, setMissionCoins] = useState(0);

  // Weak Topic diagnostics states
  const [revisionTab, setRevisionTab] = useState('queue'); // 'queue' | 'weak_topics'
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    // Sync with global state
    const handleUpdate = (e) => {
      setUser(e.detail);
      calculateMilestone(e.detail.xp, e.detail.level);
    };

    const handleCloudStatus = (e) => setCloudActive(e.detail.active);
    
    const handleShowReward = (e) => {
      setRewardDay(e.detail.day);
      setShowLoginReward(true);
    };
    
    window.addEventListener('acadevance_stats_update', handleUpdate);
    window.addEventListener('acadevance_cloud_status', handleCloudStatus);
    window.addEventListener('acadevance_show_login_reward', handleShowReward);
    fetchDashboardData();

    // Check mission completion
    const lastCompleted = localStorage.getItem('acadevance_daily_mission_date');
    const todayStr = new Date().toDateString();
    if (lastCompleted === todayStr) {
      setMissionCompletedToday(true);
    }

    return () => {
      window.removeEventListener('acadevance_stats_update', handleUpdate);
      window.removeEventListener('acadevance_cloud_status', handleCloudStatus);
      window.removeEventListener('acadevance_show_login_reward', handleShowReward);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const currentUser = authService.me();
      const [tasks, decks, history, recs, revQueue] = await Promise.all([
        dataService.list('tasks'),
        dataService.list('decks'),
        xpService.getHistory(),
        revisionService.getPersonalizedRecommendations(),
        revisionService.getRevisionQueue()
      ]);

      if (currentUser?.id) {
        const { data: topPeers } = await supabase
          .from('profiles')
          .select('full_name, level, xp')
          .neq('id', currentUser.id)
          .order('level', { ascending: false })
          .limit(4);

        if (topPeers) {
          setPeers(topPeers.map(p => ({
            name: p.full_name,
            action: `reached Level ${p.level}`,
            time: 'Active'
          })));
        }
      }

      setCounts({
        tasks: tasks.filter(t => !t.completed).length,
        decks: decks.length
      });

      setActivity((history || []).slice(0, 5));
      setRecommendations(recs || []);
      setRevisionQueue(revQueue || []);
      calculateMilestone(currentUser?.xp || 0, currentUser?.level || 1);

      // Fetch quiz scores for weak topic diagnostics
      const quizScores = await dataService.list('quiz_scores');
      if (quizScores && quizScores.length > 0) {
        const chapterTotals = {};
        quizScores.forEach(q => {
          if (!chapterTotals[q.chapter_title]) {
            chapterTotals[q.chapter_title] = { score: 0, total: 0, count: 0, subject: q.subject };
          }
          chapterTotals[q.chapter_title].score += q.score;
          chapterTotals[q.chapter_title].total += q.total;
          chapterTotals[q.chapter_title].count += 1;
        });

        const topicsList = Object.entries(chapterTotals).map(([title, val]) => {
          const accuracy = val.total > 0 ? Math.round((val.score / val.total) * 100) : 0;
          let status = 'weak';
          if (accuracy >= 80) status = 'strong';
          else if (accuracy >= 50) status = 'developing';

          return {
            title,
            subject: val.subject,
            accuracy,
            status
          };
        });

        setWeakTopics(topicsList);
      }
    } catch (err) {
      console.error("Dashboard cloud sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMilestone = (xp, level) => {
    const nextXp = xpService.getNextLevelXp(level);
    setNextMilestone({
      label: `Level ${level + 1}`,
      remaining: nextXp - (xp || 0)
    });
  };

  // --- DAILY ADAPTIVE RECALL MISSION LOGIC ---
  const generateMissionQuestions = async () => {
    try {
      const quizScores = await dataService.list('quiz_scores');
      
      // Sort and get unique chapter titles descending
      const sortedAttempts = [...quizScores].sort((a, b) => 
        new Date(b.completed_at || b.created_at || 0) - new Date(a.completed_at || a.created_at || 0)
      );
      
      const uniqueChapters = [];
      sortedAttempts.forEach(attempt => {
        if (!uniqueChapters.includes(attempt.chapter_title)) {
          uniqueChapters.push(attempt.chapter_title);
        }
      });

      let questionsList = [];

      // Helper to pull questions from EXPANDED_CURRICULUM
      const getQuestionsFromChapter = (chapterTitle, count) => {
        let foundQuestions = [];
        for (const grade in EXPANDED_CURRICULUM) {
          for (const subject in EXPANDED_CURRICULUM[grade]) {
            const chData = EXPANDED_CURRICULUM[grade][subject][chapterTitle];
            if (chData && chData.quiz && chData.quiz.length > 0) {
              foundQuestions = chData.quiz.map(q => ({
                ...q,
                chapter: chapterTitle,
                subject
              }));
              break;
            }
          }
        }
        return foundQuestions.slice(0, count);
      };

      // 3 questions from today (latest chapter)
      if (uniqueChapters[0]) {
        questionsList.push(...getQuestionsFromChapter(uniqueChapters[0], 3));
      }
      // 2 questions from yesterday (second latest)
      if (uniqueChapters[1]) {
        questionsList.push(...getQuestionsFromChapter(uniqueChapters[1], 2));
      }
      // 1 question from last week (third latest)
      if (uniqueChapters[2]) {
        questionsList.push(...getQuestionsFromChapter(uniqueChapters[2], 1));
      }

      // Fallback if we don't have enough questions from history
      const needed = 6 - questionsList.length;
      if (needed > 0) {
        const mathChapters = ['Coordinate Geometry', 'Linear Polynomials', 'Circles', "Heron's Formula"];
        let chIdx = 0;
        while (questionsList.length < 6 && chIdx < mathChapters.length) {
          const chTitle = mathChapters[chIdx];
          const chData = EXPANDED_CURRICULUM['9']?.['Mathematics']?.[chTitle];
          if (chData && chData.quiz) {
            const mappedQ = chData.quiz.map(q => ({
              ...q,
              chapter: chTitle,
              subject: 'Mathematics'
            }));
            
            for (const q of mappedQ) {
              if (questionsList.length < 6 && !questionsList.some(existing => existing.q === q.q)) {
                questionsList.push(q);
              }
            }
          }
          chIdx++;
        }
      }

      // Format and shuffle
      const finalized = questionsList.slice(0, 6).map(q => {
        return {
          ...q,
          options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : ["A", "B", "C", "D"]
        };
      });

      return finalized;
    } catch (e) {
      console.warn("Error gathering mission questions", e);
      return [];
    }
  };

  const startDailyMission = async () => {
    if (missionCompletedToday) {
      notificationService.send("Mission Complete", "You have already completed today's Adaptive Recall Mission!", "info");
      return;
    }
    setLoading(true);
    const questions = await generateMissionQuestions();
    if (questions.length > 0) {
      setMissionQuestions(questions);
      setMissionIndex(0);
      setMissionSelectedOpt(null);
      setMissionSubmitted(false);
      setMissionStreak(0);
      setMissionScore(0);
      setMissionXP(0);
      setMissionCoins(0);
      setMissionFinished(false);
      setShowMissionModal(true);
    } else {
      notificationService.send("Quest Offline", "Failed to retrieve adaptive mission questions.", "error");
    }
    setLoading(false);
  };

  const playMissionSynth = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  const handleMissionAnswerSubmit = (option) => {
    if (missionSubmitted) return;
    setMissionSelectedOpt(option);
    setMissionSubmitted(true);

    const currentQ = missionQuestions[missionIndex];
    const isCorrect = option === currentQ.answer;

    if (isCorrect) {
      const nextStreak = missionStreak + 1;
      setMissionStreak(nextStreak);
      setMissionScore(prev => prev + 1);

      const multiplier = 1 + Math.floor(nextStreak / 2) * 0.5;
      const addedXP = Math.round(15 * multiplier);
      const addedCoins = Math.round(5 * multiplier);

      setMissionXP(prev => prev + addedXP);
      setMissionCoins(prev => prev + addedCoins);
      
      xpService.awardXp(addedXP, `Mission Combo ${nextStreak}x`);
      authService.addTokens(addedCoins);

      playMissionSynth('correct');
    } else {
      setMissionStreak(0);
      playMissionSynth('incorrect');
    }
  };

  const handleMissionNext = () => {
    if (missionIndex + 1 < missionQuestions.length) {
      setMissionIndex(prev => prev + 1);
      setMissionSelectedOpt(null);
      setMissionSubmitted(false);
    } else {
      setMissionFinished(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      localStorage.setItem('acadevance_daily_mission_date', new Date().toDateString());
      setMissionCompletedToday(true);
    }
  };

  // --- HOLD SYSTEM LOGIC ---
  useEffect(() => {
    let interval;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            handleHoldComplete();
            return 0;
          }
          return prev + 2;
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding]);

  const handleHoldComplete = () => {
    setIsHolding(false);
    notificationService.send("Focus Surge", "Tasks synchronized. Gained +10 Focus Energy.", "success");
    xpService.awardXp(10, 'Daily Ritual');
    navigate('/homework');
  };

  const emitReaction = (emoji, e) => {
    const x = e.clientX;
    const y = e.clientY;
    window.dispatchEvent(new CustomEvent('acadevance_particle_bonus', { detail: { emoji, x, y, type: 'reaction' } }));
  };

  const tasksCount = counts.tasks;
  const decksCount = counts.decks;

  return (
    <div className="space-y-10 pb-20">
      {/* Page header — fade up */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">My Dashboard</h1>
          <p className="text-text-secondary font-medium mt-1">
            Welcome back, <span className="text-nuvio-purple-400 font-black">{user?.full_name}</span>. What are we focusing on today?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500 ${cloudActive ? 'bg-nuvio-green/10 border-nuvio-green/30 text-nuvio-green' : 'bg-nuvio-red/10 border-nuvio-red/30 text-nuvio-red'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cloudActive ? 'bg-nuvio-green animate-pulse' : 'bg-nuvio-red'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{cloudActive ? 'Cloud Active' : 'Offline Mode'}</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Coins className="w-5 h-5 text-nuvio-yellow" />
            <span className="text-xl font-black text-white tabular-nums">{user?.era_tokens?.toLocaleString()}</span>
          </div>
        </div>
      </motion.header>

      {/* 🏛️ CBSE QUICK START / CONTINUE LEARNING */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.008, y: -2 }}
        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
      >
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                  <Clock className="w-3 h-3" /> System Synchronized
               </div>
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                  Ready to conquer <br /> <span className="text-blue-200">{user?.grade_level || '9th'} Grade?</span>
               </h1>
               <p className="text-blue-100 text-sm font-medium opacity-80 max-w-md">Your CBSE curriculum is live. Pick up exactly where you left off in your NCERT journey.</p>
            </div>
            <button 
              onClick={() => navigate('/curriculum')}
              className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
               Continue Learning <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </motion.div>

      {/* 🛡️ DAILY ADAPTIVE RECALL MISSION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border-2 border-purple-500/20 rounded-[32px] p-8 relative overflow-hidden group shadow-lg"
      >
        {/* Neon purple blur effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left space-y-3">
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full">
              Academy Special Mission
            </span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Daily Adaptive Recall Quest
            </h2>
            <p className="text-slate-400 text-xs font-semibold max-w-xl leading-relaxed">
              Combine today's topics, yesterday's revision, and last week's spacing checks in one rapid-fire 6-question recall mission. Build combos and earn double tokens!
            </p>
          </div>
          
          <button
            onClick={startDailyMission}
            className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow shrink-0 animate-pulse"
          >
            {missionCompletedToday ? 'Quest Completed ✓' : 'Embark on Mission ➔'}
          </button>
        </div>
      </motion.div>

      {/* 🔮 PERSONALIZED STUDY PATHWAY & REVISION QUEUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommendation Panel */}
        <div className="border-3 border-black bg-slate-900 p-8 shadow-[8px_8px_0_#000] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Personalized Pathway
            </h3>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6">
              AI-Generated Study Recommendations
            </p>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase bg-purple-500 text-black px-2 py-0.5 rounded">
                      {rec.type}
                    </span>
                    <span className="text-[9px] font-bold text-text-muted uppercase">
                      {rec.subject}
                    </span>
                  </div>
                  <h4 className="font-black text-white text-sm uppercase tracking-tight">{rec.title}</h4>
                  <p className="text-[10px] text-text-muted mt-1 leading-relaxed font-semibold">{rec.desc}</p>
                  <button
                    onClick={() => {
                      if (rec.route) navigate(rec.route);
                      else if (rec.type === 'revision') navigate(`/curriculum`);
                    }}
                    className="mt-4 px-4 py-2 bg-purple-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-purple-400 shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
                  >
                    {rec.actionLabel || 'Go'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revision Queue & Diagnostics */}
        <div className="border-3 border-black bg-slate-900 p-8 shadow-[8px_8px_0_#000] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <div className="flex bg-slate-950 p-1 border border-white/5 rounded-lg">
                <button
                  onClick={() => setRevisionTab('queue')}
                  className={`px-3.5 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                    revisionTab === 'queue'
                      ? 'bg-rose-500 text-black shadow font-black'
                      : 'text-slate-400 hover:text-white font-semibold'
                  }`}
                >
                  Revision Queue
                </button>
                <button
                  onClick={() => setRevisionTab('weak_topics')}
                  className={`px-3.5 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                    revisionTab === 'weak_topics'
                      ? 'bg-rose-500 text-black shadow font-black'
                      : 'text-slate-400 hover:text-white font-semibold'
                  }`}
                >
                  Diagnostics
                </button>
              </div>
              <RotateCcw className="w-4 h-4 text-rose-500" />
            </div>

            {revisionTab === 'queue' ? (
              <>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6">
                  Topics requiring review (&lt;80% mastery)
                </p>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {revisionQueue.length === 0 ? (
                    <div className="text-center py-8 text-text-muted font-black uppercase text-[10px] tracking-widest opacity-50 italic">
                      No pending revisions! All clear. 🌟
                    </div>
                  ) : (
                    revisionQueue.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000] flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[8px] font-black uppercase text-rose-400 bg-rose-950/40 border border-rose-900 px-1.5 py-0.5 rounded">
                            {item.subject}
                          </span>
                          <h4 className="font-black text-white text-xs uppercase tracking-tight mt-2">{item.chapterTitle}</h4>
                          <p className="text-[9px] text-text-muted font-bold mt-1 font-mono">Accuracy: <span className="text-rose-500 font-black">{item.accuracy}%</span> ({item.score}/{item.total})</p>
                        </div>
                        <button
                          onClick={() => navigate('/curriculum')}
                          className="px-4 py-2 bg-rose-500 border-2 border-black text-black font-black uppercase tracking-widest text-[9px] rounded-[4px] hover:bg-rose-400 shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
                        >
                          Revise
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6">
                  Weak Topic Detection (Syllabus Health Check)
                </p>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {weakTopics.length === 0 ? (
                    <div className="text-center py-8 text-text-muted font-black uppercase text-[10px] tracking-widest opacity-50 italic">
                      No diagnostics found yet. Solve quizzes to build report.
                    </div>
                  ) : (
                    weakTopics.map((topic, idx) => {
                      const isStrong = topic.status === 'strong';
                      const isWeak = topic.status === 'weak';
                      
                      return (
                        <div key={idx} className="p-4 bg-slate-950 border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000] flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              {isStrong ? (
                                <span className="text-[10px] text-green-400 font-black uppercase tracking-tight">✓ Strong</span>
                              ) : isWeak ? (
                                <span className="text-[10px] text-rose-400 font-black uppercase tracking-tight">✗ Needs Practice</span>
                              ) : (
                                <span className="text-[10px] text-yellow-400 font-black uppercase tracking-tight">⚡ Developing</span>
                              )}
                              <span className="text-[9px] font-black uppercase text-slate-500 font-mono">Accuracy: {topic.accuracy}%</span>
                            </div>
                            <h4 className="font-black text-white text-xs uppercase tracking-tight mt-2">{topic.title}</h4>
                            <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 block">{topic.subject}</span>
                          </div>
                          
                          <button
                            onClick={() => navigate('/curriculum')}
                            className={`px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all border ${
                              isStrong
                                ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black'
                                : isWeak
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-black'
                                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black'
                            }`}
                          >
                            Study
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Stats — staggered whileInView */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total XP', val: user?.xp?.toLocaleString(), icon: Zap, color: 'text-nuvio-yellow', bg: 'bg-nuvio-yellow/10' },
          { label: 'Focus Streak', val: `${user?.streak || 1} Days`, icon: Flame, color: 'text-nuvio-orange', bg: 'bg-nuvio-orange/10', burning: (user?.streak > 3) },
          { label: 'Active Tasks', val: tasksCount, icon: Target, color: 'text-nuvio-purple-400', bg: 'bg-nuvio-purple-400/10' },
          { label: 'Memory Decks', val: decksCount, icon: BookOpen, color: 'text-nuvio-blue', bg: 'bg-nuvio-blue/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`nv-card p-8 border-white/5 flex flex-col justify-between group transition-all relative overflow-hidden ${stat.burning ? 'border-nuvio-red/40 shadow-[0_0_20px_rgba(255,50,50,0.1)]' : ''}`}
          >
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.burning ? 'animate-bounce' : ''}`}>
                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
               {stat.burning && <span className="text-[10px] font-black text-nuvio-red uppercase tracking-widest animate-pulse">Critical</span>}
            </div>
            <div className="mt-8">
               <motion.div
                 initial={{ opacity: 0, y: 6 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
                 className="text-3xl font-black text-white tracking-tight"
               >
                 {stat.val}
               </motion.div>
               <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="nv-card p-10 border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nuvio-purple-500/5 blur-[100px] pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
              <div className="space-y-6 flex-1 w-full">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-nuvio-purple-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-nuvio-purple-500/20">
                     {user?.level}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Academic Rank: Sentinel</h3>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{nextMilestone.remaining.toLocaleString()} XP to {nextMilestone.label}</p>
                   </div>
                </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((user?.xp || 0) / xpService.getNextLevelXp(user?.level || 1)) * 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-nuvio-purple-500 to-nuvio-blue nv-xp-bar"
                    />
                  </div>
                </div>
              </div>
            </div>

          <div className="nv-card p-0 border-white/5 overflow-hidden">
             <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Star className="w-4 h-4 text-nuvio-purple-400" /> Recent Activity
                </h3>
             </div>
             <div className="divide-y divide-white/5">
                {activity.length === 0 ? (
                  <div className="p-12 text-center text-text-muted font-bold uppercase text-[10px] tracking-widest opacity-50 italic">No activity recorded yet...</div>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="p-6 px-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nuvio-purple-400 group-hover:bg-nuvio-purple-500 group-hover:text-white transition-all">
                             <Zap className="w-5 h-5" />
                          </div>
                          <div>
                             <div className="font-black text-white uppercase tracking-tight text-sm">{item.reason}</div>
                             <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleTimeString()}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-nuvio-green font-black text-sm">+{item.amount} XP</span>
                          <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="nv-card !bg-black border-2 border-white/5 p-8 space-y-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Social Matrix</h3>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-nuvio-green animate-ping" />
                    <span className="text-[9px] font-black text-nuvio-green uppercase tracking-widest">Global Sync</span>
                 </div>
              </div>
              <div className="space-y-6">
                 {peers.map((peer, i) => (
                    <div 
                      key={i} 
                      className="group/peer flex gap-4 items-start border-l-2 border-white/5 pl-4 py-3 hover:border-nuvio-cyan transition-all relative cursor-pointer"
                    >
                       <div className="flex-1">
                          <div className="text-xs font-black text-white uppercase group-hover/peer:text-nuvio-cyan transition-colors">{peer.name}</div>
                          <div className="text-[10px] text-text-muted font-bold capitalize">{peer.action}</div>
                       </div>
                       <div className="text-[9px] text-white/20 font-black">{peer.time}</div>
                       
                       <div className="absolute right-0 top-0 opacity-0 group-hover/peer:opacity-100 transition-opacity flex gap-1 bg-black border border-white/10 p-1 rounded-lg">
                          {['🔥', '🚀', '💯'].map(e => (
                            <button key={e} onClick={(ev) => emitReaction(e, ev)} className="hover:scale-125 transition-transform">{e}</button>
                          ))}
                       </div>
                    </div>
                 ))}
                 {peers.length === 0 && (
                    <div className="py-10 text-center text-[10px] font-black text-text-muted uppercase tracking-widest opacity-30 italic">Searching for scholars...</div>
                 )}
              </div>
           </div>
           
           <div className="nv-card bg-nuvio-purple-500/10 border-nuvio-purple-500/20 p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-nuvio-purple-500 flex items-center justify-center text-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Focus Guide</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Sync your latest academic rituals. finishing tasks will help you earn a <span className="text-nuvio-purple-300">Reward Boost</span>.
              </p>
              <div className="relative pt-4">
                <button 
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => setIsHolding(false)}
                  onMouseLeave={() => setIsHolding(false)}
                  className={`w-full nv-btn-primary py-5 text-[10px] uppercase tracking-[0.3em] font-black relative overflow-hidden transition-all active:scale-95 ${isHolding ? 'brightness-125' : ''}`}
                >
                  <div className="absolute inset-0 bg-white/10 origin-left transition-transform duration-75" style={{ transform: `scaleX(${holdProgress / 100})` }} />
                  <span className="relative z-10">{isHolding ? 'Focusing...' : 'Hold to Sync Tasks'}</span>
                </button>
                <div className="flex justify-center mt-2">
                   <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Ritual Status: {holdProgress}% Authorized</div>
                </div>
              </div>
           </div>
        </div>
      </div>
      {/* Daily Login Rewards Modal */}
      <AnimatePresence>
        {showLoginReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowLoginReward(false)} 
              className="absolute inset-0 bg-background-base/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="nv-card w-full max-w-2xl p-8 sm:p-10 space-y-8 relative z-10 border-nuvio-purple-500/30 bg-gradient-to-br from-nuvio-purple-900/20 via-background-card to-background-card"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    Daily Login Ritual 🎁
                  </h2>
                  <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                    Maintain your streak to claim progressive academy rewards!
                  </p>
                </div>
                <button onClick={() => setShowLoginReward(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 py-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isCurrent = day === rewardDay;
                  const isPast = day < rewardDay;
                  const isFuture = day > rewardDay;
                  
                  const rewards = {
                    1: { coins: 20, icon: '🪙' },
                    2: { coins: 30, icon: '🪙' },
                    3: { coins: 40, icon: '🪙' },
                    4: { coins: 50, icon: '🪙' },
                    5: { coins: 60, icon: '🪙' },
                    6: { coins: 70, icon: '🪙' },
                    7: { coins: 100, icon: '👑' }
                  };
                  
                  const reward = rewards[day];

                  return (
                    <div 
                      key={day}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-between gap-3 text-center transition-all relative
                        ${isCurrent 
                          ? 'border-nuvio-purple-500 bg-nuvio-purple-500/10 shadow-lg shadow-nuvio-purple-500/10 scale-105 animate-pulse' 
                          : isPast 
                            ? 'border-nuvio-green/30 bg-nuvio-green/5 opacity-70' 
                            : 'border-white/5 bg-white/[0.01] opacity-50'}`}
                    >
                      {isPast && (
                        <div className="absolute top-1.5 right-1.5 text-nuvio-green">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-wider">Day {day}</div>
                      <div className="text-3xl">{reward.icon}</div>
                      <div>
                        <div className="text-sm font-black text-white">{reward.coins}</div>
                        <div className="text-[8px] font-bold text-text-muted uppercase">Coins</div>
                      </div>
                      
                      {day === 7 && (
                        <div className="text-[8px] font-black text-nuvio-yellow uppercase tracking-widest mt-1 bg-nuvio-yellow/10 px-1 py-0.5 rounded border border-nuvio-yellow/20">Crest</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  onClick={async () => {
                    const claimed = await authService.claimLoginReward(rewardDay);
                    if (claimed) {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                      });
                      notificationService.send("Claimed! 🎉", `Earned ${claimed.coins} Coins! ${claimed.avatar ? 'Unlocked ' + claimed.avatar + ' crest!' : ''}`, "success");
                      setTimeout(() => setShowLoginReward(false), 2000);
                    } else {
                      setShowLoginReward(false);
                    }
                  }}
                  className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-nuvio-purple-500 to-nuvio-blue hover:from-white hover:to-white hover:text-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-nuvio-purple-500/25 transition-all"
                >
                  Claim Reward
                </button>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Login streak resets if absent for more than 48 hours</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daily Adaptive Recall Mission Arena Modal */}
      <AnimatePresence>
        {showMissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowMissionModal(false)} 
              className="absolute inset-0 bg-background-base/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="nv-card w-full max-w-xl p-6 sm:p-8 space-y-6 relative z-10 border-purple-500/30 bg-gradient-to-br from-indigo-950/20 via-background-card to-background-card text-left shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black tracking-widest uppercase rounded">
                    Spaced Recall Arena
                  </span>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                    Daily Recall Mission
                  </h2>
                </div>
                <button 
                  onClick={() => setShowMissionModal(false)} 
                  className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!missionFinished ? (
                <div className="space-y-6">
                  {/* Mission progress HUD */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Question {missionIndex + 1} of {missionQuestions.length}
                    </span>
                    <div className="flex gap-2 font-mono text-[9px] font-black">
                      <span className="bg-rose-500/15 border border-rose-500/30 px-2 py-1 rounded-lg text-rose-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" /> Streak: {missionStreak}
                      </span>
                      <span className="bg-yellow-500/15 border border-yellow-500/30 px-2 py-1 rounded-lg text-yellow-400">
                        Combos: {Math.max(1, 1 + Math.floor(missionStreak / 2) * 0.5).toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 bg-slate-950 border border-white/5 rounded-xl space-y-2">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[7px] font-black uppercase tracking-wider rounded">
                      {missionQuestions[missionIndex]?.subject} · {missionQuestions[missionIndex]?.chapter}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed pt-1">
                      {missionQuestions[missionIndex]?.q}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {missionQuestions[missionIndex]?.options.map((opt, idx) => {
                      const isSelected = missionSelectedOpt === opt;
                      const isCorrect = opt === missionQuestions[missionIndex]?.answer;
                      const showSuccess = missionSubmitted && isCorrect;
                      const showDanger = missionSubmitted && isSelected && !isCorrect;

                      return (
                        <button
                          key={idx}
                          disabled={missionSubmitted}
                          onClick={() => handleMissionAnswerSubmit(opt)}
                          className={`w-full p-3.5 border-2 rounded-xl text-xs font-semibold text-left transition-all ${
                            showSuccess 
                              ? 'bg-green-500/10 border-green-500 text-green-400'
                              : showDanger 
                                ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                                : isSelected 
                                  ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                                  : 'bg-slate-950 border-white/5 text-slate-350 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{opt}</span>
                            {showSuccess && <span className="bg-green-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shrink-0">✓ Correct</span>}
                            {showDanger && <span className="bg-rose-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shrink-0">✗ Incorrect</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation details */}
                  {missionSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {missionQuestions[missionIndex]?.explanation && (
                        <div className="p-4 bg-slate-900 border border-white/5 rounded-xl text-[10px] leading-relaxed text-slate-400 font-semibold">
                          <strong className="text-purple-400 uppercase tracking-widest block mb-0.5">Explanation:</strong>
                          {missionQuestions[missionIndex]?.explanation}
                        </div>
                      )}

                      <button
                        onClick={handleMissionNext}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        {missionIndex + 1 === missionQuestions.length ? 'Finish Quest 🏆' : 'Next Question ➔'}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* SUMMARY SCREEN */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 text-center py-6 flex flex-col items-center animate-fadeIn"
                >
                  <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mission Accomplished!</h3>
                    <p className="text-xs text-slate-400 font-semibold max-w-[280px] mx-auto leading-relaxed">
                      You solved {missionScore} of {missionQuestions.length} spacing check questions correctly.
                    </p>
                  </div>

                  <div className="bg-slate-950 px-6 py-4.5 border border-white/5 rounded-2xl flex gap-8 text-xs font-black">
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase tracking-widest block">XP Gained</span>
                      <span className="text-purple-400 font-mono text-base font-black">+{missionXP} XP ✨</span>
                    </div>
                    <div className="w-[1px] bg-white/5" />
                    <div>
                      <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Coins Earned</span>
                      <span className="text-amber-400 font-mono text-base font-black">+{missionCoins} Coins 🪙</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMissionModal(false)}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-white hover:to-white hover:text-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Claim Rewards & Return
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
