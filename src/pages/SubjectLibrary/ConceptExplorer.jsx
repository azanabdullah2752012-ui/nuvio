import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, AlertTriangle, Zap, HelpCircle, 
  BookOpen, Key, ArrowRight, CheckCircle2, RotateCcw, Brain, 
  Sparkles, Award, PlayCircle, Eye, Activity, RefreshCw, Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { xpService } from '../../services/xpService';
import { authService } from '../../services/authService';

// Import Sandboxes
import CartesianPlotter from './Sandboxes/CartesianPlotter';
import MotionSimulator from './Sandboxes/MotionSimulator';
import NarrativeMap from './Sandboxes/NarrativeMap';
import CellExplorer from './Sandboxes/CellExplorer';
import AtomExplorer from './Sandboxes/AtomExplorer';
import HeronExplorer from './Sandboxes/HeronExplorer';
import Class6MathSandbox from './Sandboxes/Class6MathSandbox';
import Class6ScienceSandbox from './Sandboxes/Class6ScienceSandbox';
import SeparationLab from './Sandboxes/SeparationLab';
import Class9ScienceSandbox from './Sandboxes/Class9ScienceSandbox';

import './styles.css';

const ConceptExplorer = ({ concepts = [], quiz = [], chapterTitle = "", subject = "", grade = "9" }) => {
  const [explorerMode, setExplorerMode] = useState('timeline'); // 'timeline' | 'quest'
  const [expandedId, setExpandedId] = useState(null);
  const [eli5States, setEli5States] = useState({}); // { [conceptId]: boolean }

  // Quest player state
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [questStep, setQuestStep] = useState(1); // 1: Learn, 2: See, 3: Play, 4: Recall, 5: Practice, 6: Reward
  const [recallAnswer, setRecallAnswer] = useState("");
  const [recallRevealed, setRecallRevealed] = useState(false);
  const [selectedPracticeOpt, setSelectedPracticeOpt] = useState(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [questXP, setQuestXP] = useState(0);
  const [questCoins, setQuestCoins] = useState(0);

  const activeConcept = concepts && concepts[activeConceptIndex] ? concepts[activeConceptIndex] : null;

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toggleEli5 = (id, e) => {
    e.stopPropagation(); // Avoid triggering card expand
    setEli5States(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startQuest = (index) => {
    setActiveConceptIndex(index);
    setQuestStep(1);
    setRecallAnswer("");
    setRecallRevealed(false);
    setSelectedPracticeOpt(null);
    setPracticeSubmitted(false);
    setQuestXP(0);
    setQuestCoins(0);
    setExplorerMode('quest');
  };

  // Find a matching practice question from the chapter's quiz
  const getConceptPracticeQuestion = () => {
    if (!quiz || quiz.length === 0) return null;
    
    // Try to find a question containing matching words
    const titleWords = activeConcept?.title?.toLowerCase().split(' ') || [];
    const matchedQ = quiz.find(q => 
      titleWords.some(word => word.length > 3 && q.q.toLowerCase().includes(word))
    );

    // Fallback to a random question from quiz
    if (matchedQ) return matchedQ;
    const hashIdx = Math.abs(activeConcept?.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0);
    return quiz[hashIdx % quiz.length];
  };

  const practiceQuestion = getConceptPracticeQuestion();

  // Pick sandbox based on concept/chapter meta
  const renderConceptSandbox = () => {
    const cTitle = activeConcept?.title?.toLowerCase() || "";
    const chLower = chapterTitle.toLowerCase();
    const subLower = subject.toLowerCase();

    if (grade === "6" && subLower.includes('math')) {
      return <Class6MathSandbox chapterTitle={chapterTitle} activeConcept={activeConcept} />;
    }
    if (grade === "6" && subLower.includes('science')) {
      return <Class6ScienceSandbox chapterTitle={chapterTitle} activeConcept={activeConcept} />;
    }
    if (grade === "9" && subLower.includes('science')) {
      const isCustomCh = chLower.includes('cell') || cTitle.includes('cell') ||
                         chLower.includes('atom') || cTitle.includes('atom') ||
                         chLower.includes('motion') || chLower.includes('force') || 
                         cTitle.includes('displacement') || cTitle.includes('speed') ||
                         chLower.includes('mixture') || chLower.includes('separation') || 
                         cTitle.includes('mixtures') || cTitle.includes('separation');
      if (!isCustomCh) {
        return <Class9ScienceSandbox chapterTitle={chapterTitle} activeConcept={activeConcept} />;
      }
    }
    if (chLower.includes('mixture') || chLower.includes('separation') || cTitle.includes('mixtures') || cTitle.includes('separation')) {
      return <SeparationLab />;
    }
    if (chLower.includes('cell') || cTitle.includes('cell')) {
      return <CellExplorer />;
    }
    if (chLower.includes('atom') || cTitle.includes('atom')) {
      return <AtomExplorer />;
    }
    if (chLower.includes('motion') || chLower.includes('force') || cTitle.includes('displacement') || cTitle.includes('speed')) {
      return <MotionSimulator />;
    }
    if (chLower.includes('heron') || cTitle.includes('heron')) {
      return <HeronExplorer />;
    }
    if (subLower.includes('math') || chLower.includes('geometry') || chLower.includes('algebra') || cTitle.includes('coordinate') || cTitle.includes('plane')) {
      return <CartesianPlotter />;
    }
    if (subLower.includes('english') || cTitle.includes('read') || cTitle.includes('narrative')) {
      return <NarrativeMap />;
    }

    // Default Fallback
    return (
      <div className="bg-slate-900 p-6 border border-white/5 rounded-xl space-y-4 text-center">
        <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
        <h5 className="text-xs font-black uppercase text-white">Visual Concept Diagram</h5>
        <div className="p-4 bg-slate-950 border border-white/5 rounded-lg text-[11px] leading-relaxed text-slate-350">
          <strong className="text-cyan-400 block mb-1">Concept Rule:</strong>
          {activeConcept?.definition}
        </div>
      </div>
    );
  };

  const handleSelfGrade = (scoreType) => {
    let xp = 0;
    let coins = 0;

    if (scoreType === 'perfect') {
      xp = 15;
      coins = 5;
    } else if (scoreType === 'partial') {
      xp = 5;
      coins = 2;
    }

    setQuestXP(prev => prev + xp);
    setQuestCoins(prev => prev + coins);
    xpService.awardXp(xp, `Recall Quest: ${activeConcept?.title || ''}`);
    authService.addTokens(coins);

    setRecallRevealed(true);
  };

  const handlePracticeSubmit = (option) => {
    if (practiceSubmitted) return;
    setSelectedPracticeOpt(option);
    setPracticeSubmitted(true);

    const isCorrect = option === practiceQuestion.answer;
    if (isCorrect) {
      setQuestXP(prev => prev + 10);
      setQuestCoins(prev => prev + 3);
      xpService.awardXp(10, 'Practice Arena Success');
      authService.addTokens(3);
      playLocalSynth('correct');
    } else {
      playLocalSynth('incorrect');
    }
  };

  const playLocalSynth = (type) => {
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

  const finishQuest = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    setExplorerMode('timeline');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header Panel */}
      <div className="text-center space-y-1 mb-6 flex flex-col items-center">
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-widest text-purple-400 uppercase">
          Step 2: Core syllabus
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-2">
          Concept Matrix
        </h2>
        
        {/* Toggle Mode */}
        {explorerMode === 'timeline' && concepts && concepts.length > 0 && (
          <div className="mt-4 flex bg-slate-900 p-1 border border-white/5 rounded-lg shrink-0 shadow-sm">
            <button
              onClick={() => setExplorerMode('timeline')}
              className="px-4 py-2 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500 text-black shadow"
            >
              📚 Browse Concepts
            </button>
            <button
              onClick={() => startQuest(0)}
              className="px-4 py-2 rounded text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white"
            >
              🚀 Launch Active Quest
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {explorerMode === 'timeline' ? (
          /* STANDARD EXPANDABLE TIMELINE */
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {concepts.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-500 text-xs uppercase space-y-2 border border-white/5 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-yellow-500/60 mx-auto" />
                <p>No concepts found for this chapter.</p>
              </div>
            ) : (
              concepts.map((concept, idx) => {
                const isExpanded = expandedId === concept.id;
                const isEli5 = !!eli5States[concept.id];

              return (
                <div
                  key={concept.id}
                  className={`glass-panel overflow-hidden border-2 transition-all duration-300 ${
                    isExpanded ? 'border-purple-500/40 shadow-purple-500/5' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleExpand(concept.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isExpanded ? 'bg-purple-500 text-black' : 'bg-white/5 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                          Core Topic
                        </span>
                        <h3 className="text-base font-black text-white uppercase tracking-tight mt-1">
                          {concept.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isExpanded && (
                        <button
                          onClick={(e) => toggleEli5(concept.id, e)}
                          className={`px-3 py-1.5 border border-white/10 rounded-[4px] text-[8px] font-black uppercase tracking-wider transition-all ${
                            isEli5 ? 'bg-green-500 text-black border-transparent' : 'bg-slate-900 text-purple-400 hover:bg-slate-800'
                          }`}
                        >
                          {isEli5 ? '👶 Child Mode' : '🎓 Academic Terms'}
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); startQuest(idx); }}
                        className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-black rounded text-[8px] font-black uppercase tracking-wider transition-all"
                      >
                        Quest ➔
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded description details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-6">
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Definition & explanation details */}
                            <div className="md:col-span-8 space-y-4">
                              <div className="space-y-1.5 text-left">
                                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5" /> Definition
                                </span>
                                <div className="p-4 bg-slate-950/80 border border-white/5 rounded-md text-xs font-bold text-slate-200 leading-relaxed">
                                  {concept.definition}
                                </div>
                              </div>

                              <div className="space-y-1.5 text-left">
                                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                  <HelpCircle className="w-3.5 h-3.5" /> Explanation
                                </span>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-md text-xs font-semibold text-slate-350 leading-relaxed">
                                  {isEli5 ? (
                                    <p className="italic text-green-300">
                                      "👶 {concept.eli5 || concept.explanation || 'Imagine this like blocks fitting together perfectly!'}"
                                    </p>
                                  ) : (
                                    <p>{concept.explanation}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Memory Aids & Mistakes */}
                            <div className="md:col-span-4 space-y-4">
                              {concept.memoryTrick && (
                                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-md space-y-1.5 text-left">
                                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 fill-current" /> Memory Aid
                                  </span>
                                  <p className="text-[11px] text-slate-300 font-bold leading-normal">
                                    {concept.memoryTrick}
                                  </p>
                                </div>
                              )}

                              {concept.commonMistake && (
                                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-md space-y-1.5 text-left">
                                  <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Common Mistake
                                  </span>
                                  <p className="text-[11px] text-slate-350 font-semibold leading-normal">
                                    {concept.commonMistake}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Key takeaways list */}
                          {concept.keyTakeaways && concept.keyTakeaways.length > 0 && (
                            <div className="pt-4 border-t border-white/5 text-left space-y-2">
                              <span className="text-[8px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1">
                                <Key className="w-3.5 h-3.5" /> Key Takeaways
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {concept.keyTakeaways.map((takeaway, tIdx) => (
                                  <div key={tIdx} className="bg-white/5 p-3 rounded-md border border-white/5 text-[11px] font-semibold text-slate-400 flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>{takeaway}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }))}
          </motion.div>
        ) : (
          /* ACTIVE RECALL GUIDED QUEST PLAYER */
          <motion.div
            key="quest"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Quest Tracker Progress header */}
            <div className="glass-panel p-4 flex items-center justify-between border border-white/10 relative">
              <button
                onClick={() => setExplorerMode('timeline')}
                className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-wider"
              >
                ◀ Exit Quest
              </button>
              
              {/* Stepper bubbles */}
              <div className="flex items-center gap-2">
                {[
                  { id: 1, label: 'Learn', icon: BookOpen },
                  { id: 2, label: 'See', icon: Eye },
                  { id: 3, label: 'Play', icon: Activity },
                  { id: 4, label: 'Recall', icon: Brain },
                  { id: 5, label: 'Practice', icon: HelpCircle },
                  { id: 6, label: 'Rewards', icon: Award }
                ].map(step => (
                  <div
                    key={step.id}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-black transition-all ${
                      questStep === step.id 
                        ? 'bg-purple-500 text-black border-transparent shadow shadow-purple-500/20 scale-110' 
                        : questStep > step.id 
                          ? 'bg-green-500/20 text-green-400 border-green-500/40' 
                          : 'bg-slate-900 text-slate-500 border-white/5'
                    }`}
                    title={step.label}
                  >
                    {step.id}
                  </div>
                ))}
              </div>

              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Topic {activeConceptIndex + 1}/{concepts.length}
              </span>
            </div>

            {/* Active Quest Content viewport */}
            <div className="glass-panel p-6 sm:p-8 space-y-6 text-left border-purple-500/20 min-h-[380px] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black tracking-widest uppercase rounded">
                  Topic Quest: {activeConcept?.title || ''}
                </span>

                <AnimatePresence mode="wait">
                  {/* Step 1: Learn */}
                  {questStep === 1 && (
                    <motion.div
                      key="learn"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Step 1: Understand Concept</h4>
                      
                      <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl text-xs font-bold leading-relaxed text-slate-200">
                        {activeConcept?.definition}
                      </div>

                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs leading-relaxed text-slate-350 font-semibold space-y-2">
                        <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Explanation
                        </span>
                        <p>{activeConcept?.explanation}</p>
                      </div>

                      {activeConcept?.memoryTrick && (
                        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[11px] leading-relaxed text-purple-300 font-bold flex items-start gap-2">
                          <Zap className="w-4 h-4 text-purple-400 fill-purple-400 shrink-0 mt-0.5" />
                          <span><strong>Memory Aid:</strong> {activeConcept?.memoryTrick}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: See */}
                  {questStep === 2 && (
                    <motion.div
                      key="see"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Step 2: Visual Concept Model</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Study the visual layout. Visual diagrams bind memory tags 2.5x more effectively than plain text blocks.
                      </p>

                      <div className="bg-slate-950 p-6 border border-white/5 rounded-xl space-y-4">
                        <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">Outline Snapshot</span>
                        <div className="space-y-3 text-xs leading-normal">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-500">Visual Component:</span>
                            <strong className="text-white uppercase tracking-tight font-black">{activeConcept?.visualType || 'Generic Grid'}</strong>
                          </div>
                          {activeConcept?.keyTakeaways && activeConcept.keyTakeaways.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Key Elements:</span>
                              {activeConcept.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                                <div key={idx} className="text-[11px] font-semibold text-slate-350 flex items-start gap-1.5">
                                  <span className="text-cyan-400 font-black">•</span>
                                  <span>{takeaway}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Play Sandbox */}
                  {questStep === 3 && (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Step 3: Interactive Sandbox</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Tweak values and inspect the live mathematical changes to build intuition.
                      </p>

                      <div className="w-full">
                        {renderConceptSandbox()}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Recall */}
                  {questStep === 4 && (
                    <motion.div
                      key="recall"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Step 4: Active Recall Challenge</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Research shows active retrieval practice strengthening memory pathways. Write down what you remember without looking back:
                      </p>

                      {!recallRevealed ? (
                        <div className="space-y-4">
                          <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
                            Can you explain this from memory?
                          </span>
                          <textarea
                            value={recallAnswer}
                            onChange={(e) => setRecallAnswer(e.target.value)}
                            placeholder="Type definition, core logic, or formula here..."
                            rows={4}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 shadow-inner"
                          />

                          <div className="flex gap-2">
                            <button
                              disabled={recallAnswer.trim().length === 0}
                              onClick={() => handleSelfGrade('perfect')}
                              className="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-40"
                            >
                              Reveal Answer & Grade ➔
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-1.5">
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Your Explanation:</span>
                            <p className="text-xs font-semibold text-slate-300 italic">"{recallAnswer}"</p>
                          </div>

                          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
                            <span className="text-[8px] text-purple-400 uppercase tracking-widest block font-black flex items-center gap-1">
                              <Brain className="w-3.5 h-3.5" /> Core Reference Definition:
                            </span>
                            <p className="text-xs font-bold text-white leading-relaxed">{activeConcept?.definition}</p>
                            <p className="text-[11px] text-slate-350 leading-relaxed font-medium mt-1">{activeConcept?.explanation}</p>
                          </div>

                          <div className="space-y-2 border-t border-white/5 pt-4">
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">
                              How close was your answer? Select to claim XP rewards:
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => { playLocalSynth('correct'); setQuestStep(5); }}
                                className="py-3 bg-green-500/10 border border-green-500/30 hover:bg-green-500 hover:text-black text-green-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                Got it! 🟢 (+15 XP)
                              </button>
                              <button
                                onClick={() => { playLocalSynth('correct'); setQuestStep(5); }}
                                className="py-3 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black text-yellow-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                Partial 🟡 (+5 XP)
                              </button>
                              <button
                                onClick={() => { playLocalSynth('incorrect'); setQuestStep(5); }}
                                className="py-3 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-black text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                Missed 🔴 (+0 XP)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 5: Practice Arena */}
                  {questStep === 5 && (
                    <motion.div
                      key="practice"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">Step 5: Concept Checkpoint</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Confirm your understanding by solving this board-aligned checkpoint problem.
                      </p>

                      {!practiceQuestion ? (
                        <div className="text-center p-8 bg-slate-900 border border-white/5 rounded-xl text-slate-500 text-xs">
                          No question available for this checkpoint. Click continue to advance.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-5 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold text-white leading-relaxed">
                            {practiceQuestion.q}
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {practiceQuestion.options.map((opt, oIdx) => {
                              const isSelected = selectedPracticeOpt === opt;
                              const isCorrect = opt === practiceQuestion.answer;
                              const showSuccess = practiceSubmitted && isCorrect;
                              const showDanger = practiceSubmitted && isSelected && !isCorrect;

                              return (
                                <button
                                  key={oIdx}
                                  disabled={practiceSubmitted}
                                  onClick={() => handlePracticeSubmit(opt)}
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
                                    {showDanger && <span className="bg-rose-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shrink-0">✗ Wrong</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {practiceSubmitted && (
                            <div className="p-4 bg-slate-900 border border-white/10 rounded-xl text-[11px] leading-relaxed text-slate-400 font-semibold space-y-1 animate-fadeIn">
                              <strong className="text-purple-400 font-black uppercase tracking-wider block">Solution Explanation:</strong>
                              <p>{practiceQuestion.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 6: Rewards */}
                  {questStep === 6 && (
                    <motion.div
                      key="reward"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="space-y-6 text-center py-6 flex flex-col items-center"
                    >
                      <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                      
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Quest Completed!</h4>
                        <p className="text-xs text-slate-400 font-semibold max-w-[240px] mx-auto leading-relaxed">
                          You conquered "{activeConcept?.title || ''}" following the Acadevance formula.
                        </p>
                      </div>

                      <div className="bg-slate-950 px-6 py-4.5 border border-white/5 rounded-2xl flex gap-8 text-xs font-black">
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Total XP Gained</span>
                          <span className="text-purple-400 font-mono text-base font-black">+{questXP} XP ✨</span>
                        </div>
                        <div className="w-[1px] bg-white/5" />
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Total Coins Gained</span>
                          <span className="text-amber-400 font-mono text-base font-black">+{questCoins} Coins 🪙</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full">
                        {activeConceptIndex + 1 < concepts.length ? (
                          <button
                            onClick={() => startQuest(activeConceptIndex + 1)}
                            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                          >
                            Next Concept Quest ➔
                          </button>
                        ) : (
                          <button
                            onClick={finishQuest}
                            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-white hover:to-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                          >
                            Conquer Concept Stage 🏆
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress buttons for linear steps */}
              {questStep < 6 && (
                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
                  <button
                    disabled={questStep === 1}
                    onClick={() => setQuestStep(prev => prev - 1)}
                    className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-white disabled:opacity-30 transition-all active:scale-95"
                  >
                    ◀ Back
                  </button>

                  {/* Show "Continue" or custom triggers depending on state */}
                  {questStep === 4 && !recallRevealed ? null : questStep === 5 && !practiceSubmitted ? (
                    <button
                      onClick={() => setQuestStep(6)}
                      className="px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all active:scale-95"
                    >
                      Skip Checkpoint ➔
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (questStep === 4) {
                          setQuestStep(5);
                        } else if (questStep === 5) {
                          setQuestStep(6);
                        } else {
                          setQuestStep(prev => prev + 1);
                        }
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow"
                    >
                      Continue Quest <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConceptExplorer;
