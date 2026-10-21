import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, AlertTriangle, Zap, HelpCircle, 
  BookOpen, Key, ArrowRight, CheckCircle2, RotateCcw, Brain, 
  Sparkles, Award, PlayCircle, Eye, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [eli5States, setEli5States] = useState({});

  // Active study guide player state
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [questStep, setQuestStep] = useState(1); // 1: Learn, 2: See, 3: Play, 4: Recall, 5: Practice, 6: Completed
  const [recallAnswer, setRecallAnswer] = useState("");
  const [recallRevealed, setRecallRevealed] = useState(false);
  const [selectedPracticeOpt, setSelectedPracticeOpt] = useState(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  const activeConcept = concepts && concepts[activeConceptIndex] ? concepts[activeConceptIndex] : null;

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toggleEli5 = (id, e) => {
    e.stopPropagation();
    setEli5States(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startActiveStudy = (index) => {
    setActiveConceptIndex(index);
    setQuestStep(1);
    setRecallAnswer("");
    setRecallRevealed(false);
    setSelectedPracticeOpt(null);
    setPracticeSubmitted(false);
    setExplorerMode('quest');
  };

  const getConceptPracticeQuestion = () => {
    if (!quiz || quiz.length === 0) return null;
    const titleWords = activeConcept?.title?.toLowerCase().split(' ') || [];
    const matchedQ = quiz.find(q => 
      titleWords.some(word => word.length > 3 && q.q.toLowerCase().includes(word))
    );
    if (matchedQ) return matchedQ;
    const hashIdx = Math.abs(activeConcept?.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0);
    return quiz[hashIdx % quiz.length];
  };

  const practiceQuestion = getConceptPracticeQuestion();

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
                         chLower.includes('matter') || chLower.includes('pure');
      if (!isCustomCh) {
        return <Class9ScienceSandbox chapterTitle={chapterTitle} activeConcept={activeConcept} />;
      }
    }
    if (cTitle.includes('cell') || chLower.includes('cell')) {
      return <CellExplorer />;
    }
    if (cTitle.includes('atom') || chLower.includes('atom')) {
      return <AtomExplorer />;
    }
    if (chLower.includes('matter') || chLower.includes('separation') || chLower.includes('pure') || cTitle.includes('separation')) {
      return <SeparationLab />;
    }
    if (cTitle.includes('motion') || cTitle.includes('force') || subLower.includes('phys')) {
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

    return (
      <div className="bg-[#fbfbfa] p-6 border border-[#e5e1d5] rounded-xl space-y-3 text-center">
        <BookOpen className="w-8 h-8 text-[#1b3b2b] mx-auto" />
        <h5 className="text-xs font-mono font-bold uppercase text-[#1a1917]">Visual Concept Summary</h5>
        <div className="p-4 bg-white border border-[#e5e1d5] rounded-lg text-xs leading-relaxed text-[#52504a]">
          <strong className="text-[#1b3b2b] block mb-1">Core Principle:</strong>
          {activeConcept?.definition}
        </div>
      </div>
    );
  };

  const handlePracticeSubmit = (option) => {
    if (practiceSubmitted) return;
    setSelectedPracticeOpt(option);
    setPracticeSubmitted(true);
    const isCorrect = option === practiceQuestion?.answer;
    playLocalSynth(isCorrect ? 'correct' : 'incorrect');
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

  const finishActiveStudy = () => {
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
      className="max-w-4xl mx-auto space-y-6 text-left"
    >
      {/* Header Panel */}
      <div className="text-center space-y-1 mb-6 flex flex-col items-center">
        <span className="px-3 py-1 bg-[#ede9de] border border-[#d8d4c7] rounded-full text-[10px] font-mono font-bold tracking-widest text-[#1b3b2b] uppercase">
          Step 2: Core Syllabus
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1917] mt-2">
          Concept Directory
        </h2>
        <p className="text-[#52504a] text-xs">
          Explore key NCERT ideas, definitions, and active recall checkpoints.
        </p>
        
        {/* Toggle Mode */}
        {explorerMode === 'timeline' && concepts && concepts.length > 0 && (
          <div className="mt-4 flex bg-[#f5f3ec] p-1 border border-[#e5e1d5] rounded-xl shrink-0 shadow-sm">
            <button
              onClick={() => setExplorerMode('timeline')}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#1b3b2b] text-white shadow-sm"
            >
              Browse Concepts
            </button>
            <button
              onClick={() => startActiveStudy(0)}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-[#52504a] hover:text-[#1a1917]"
            >
              Interactive Study Mode ➔
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
              <div className="bg-white p-8 text-center text-[#827f76] text-xs font-mono uppercase space-y-2 border border-[#e5e1d5] rounded-xl">
                <AlertTriangle className="w-8 h-8 text-[#827f76] mx-auto" />
                <p>No concepts found for this chapter.</p>
              </div>
            ) : (
              concepts.map((concept, idx) => {
                const isExpanded = expandedId === concept.id;
                const isEli5 = !!eli5States[concept.id];

                return (
                  <div
                    key={concept.id}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 shadow-sm ${
                      isExpanded ? 'border-[#1b3b2b]/40 shadow-[0_4px_20px_rgba(27,59,43,0.06)]' : 'border-[#e5e1d5] hover:border-[#1b3b2b]/30'
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleExpand(concept.id)}
                      className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-xs shrink-0 transition-colors ${
                          isExpanded ? 'bg-[#1b3b2b] text-white' : 'bg-[#f5f3ec] text-[#1b3b2b] border border-[#e5e1d5]'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="text-left">
                          <span className="block text-[10px] font-mono text-[#827f76] uppercase tracking-wider leading-none">
                            Topic {idx + 1}
                          </span>
                          <h3 className="text-base font-serif font-bold text-[#1a1917] mt-1">
                            {concept.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isExpanded && (
                          <button
                            onClick={(e) => toggleEli5(concept.id, e)}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                              isEli5 
                                ? 'bg-[#1b3b2b] text-white border-transparent' 
                                : 'bg-[#f5f3ec] border-[#e5e1d5] text-[#52504a] hover:text-[#1a1917]'
                            }`}
                          >
                            {isEli5 ? 'Simple Language' : 'Academic Form'}
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); startActiveStudy(idx); }}
                          className="px-3 py-1.5 bg-[#f5f3ec] border border-[#e5e1d5] hover:bg-[#1b3b2b] hover:text-white text-[#1b3b2b] rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                          Study Unit ➔
                        </button>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#827f76]" /> : <ChevronDown className="w-5 h-5 text-[#827f76]" />}
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
                          <div className="px-6 pb-6 pt-2 border-t border-[#e5e1d5] space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                              {/* Definition & explanation details */}
                              <div className="md:col-span-8 space-y-4">
                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> Formal Definition
                                  </span>
                                  <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs text-[#1a1917] leading-relaxed">
                                    {concept.definition}
                                  </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider flex items-center gap-1.5">
                                    <HelpCircle className="w-3.5 h-3.5" /> Conceptual Explanation
                                  </span>
                                  <div className="p-4 bg-white border border-[#e5e1d5] rounded-xl text-xs text-[#52504a] leading-relaxed">
                                    {isEli5 ? (
                                      <p className="italic text-[#1b3b2b]">
                                        "{concept.eli5 || concept.explanation || 'Imagine this like foundational building blocks fitting together systematically.'}"
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
                                  <div className="p-4 bg-[#f5f3ec] border border-[#e5e1d5] rounded-xl space-y-1.5 text-left">
                                    <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider flex items-center gap-1.5">
                                      <Zap className="w-3.5 h-3.5" /> Memory Clue
                                    </span>
                                    <p className="text-xs text-[#1a1917] leading-relaxed">
                                      {concept.memoryTrick}
                                    </p>
                                  </div>
                                )}

                                {concept.commonMistake && (
                                  <div className="p-4 bg-[#fdf2f2] border border-[#e07d7d] rounded-xl space-y-1.5 text-left">
                                    <span className="text-[10px] font-mono font-bold text-[#8e2424] uppercase tracking-wider flex items-center gap-1.5">
                                      <AlertTriangle className="w-3.5 h-3.5" /> Common Board Mistake
                                    </span>
                                    <p className="text-xs text-[#8e2424] leading-relaxed">
                                      {concept.commonMistake}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Key takeaways list */}
                            {concept.keyTakeaways && concept.keyTakeaways.length > 0 && (
                              <div className="pt-4 border-t border-[#e5e1d5] text-left space-y-2">
                                <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider flex items-center gap-1.5">
                                  <Key className="w-3.5 h-3.5" /> Key Takeaways
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {concept.keyTakeaways.map((takeaway, tIdx) => (
                                    <div key={tIdx} className="bg-[#fbfbfa] p-3 rounded-lg border border-[#e5e1d5] text-xs text-[#52504a] flex items-start gap-2">
                                      <span className="text-[#1b3b2b] font-bold mt-0.5">•</span>
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
              })
            )}
          </motion.div>
        ) : (
          /* ACTIVE RECALL GUIDED STUDY PLAYER */
          <motion.div
            key="quest"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Study Progress header */}
            <div className="bg-white p-4 rounded-xl flex items-center justify-between border border-[#e5e1d5] shadow-sm">
              <button
                onClick={() => setExplorerMode('timeline')}
                className="text-[10px] font-mono font-bold text-[#52504a] hover:text-[#1a1917] uppercase tracking-wider"
              >
                ◀ Exit Study Mode
              </button>
              
              {/* Stepper bubbles */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: 1, label: 'Learn' },
                  { id: 2, label: 'Visual' },
                  { id: 3, label: 'Sandbox' },
                  { id: 4, label: 'Recall' },
                  { id: 5, label: 'Check' },
                  { id: 6, label: 'Done' }
                ].map(step => (
                  <div
                    key={step.id}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      questStep === step.id 
                        ? 'bg-[#1b3b2b] text-white shadow-sm' 
                        : questStep > step.id 
                          ? 'bg-[#f5f3ec] text-[#1b3b2b] border border-[#e5e1d5]' 
                          : 'bg-[#fbfbfa] text-[#827f76] border border-[#e5e1d5]'
                    }`}
                    title={step.label}
                  >
                    {step.id}
                  </div>
                ))}
              </div>

              <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-widest font-semibold">
                Topic {activeConceptIndex + 1} of {concepts.length}
              </span>
            </div>

            {/* Active Study Content viewport */}
            <div className="bg-white p-6 sm:p-8 space-y-6 text-left border border-[#e5e1d5] rounded-2xl shadow-sm min-h-[380px] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-[#f5f3ec] border border-[#e5e1d5] text-[#1b3b2b] text-[10px] font-mono font-bold tracking-wider uppercase rounded-md inline-block">
                  Topic: {activeConcept?.title || ''}
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
                      <h4 className="text-lg font-serif font-bold text-[#1a1917]">Step 1: Understand Concept</h4>
                      
                      <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs text-[#1a1917] leading-relaxed font-serif">
                        {activeConcept?.definition}
                      </div>

                      <div className="p-4 bg-white border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#52504a] space-y-2">
                        <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider block flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Conceptual Explanation
                        </span>
                        <p>{activeConcept?.explanation}</p>
                      </div>

                      {activeConcept?.memoryTrick && (
                        <div className="p-4 bg-[#f5f3ec] border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#1a1917] flex items-start gap-2">
                          <Zap className="w-4 h-4 text-[#1b3b2b] shrink-0 mt-0.5" />
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
                      <h4 className="text-lg font-serif font-bold text-[#1a1917]">Step 2: Visual Concept Framework</h4>
                      <p className="text-xs text-[#52504a] leading-relaxed">
                        Study the visual structure of this concept. Diagrams establish durable mental anchors for examination problems.
                      </p>

                      <div className="bg-[#fbfbfa] p-6 border border-[#e5e1d5] rounded-xl space-y-4">
                        <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">Concept Summary</span>
                        <div className="space-y-3 text-xs leading-normal">
                          <div className="flex justify-between border-b border-[#e5e1d5] pb-2">
                            <span className="text-[#827f76]">Visual Framework:</span>
                            <strong className="text-[#1a1917] font-serif font-bold">{activeConcept?.visualType || 'Schematic Diagram'}</strong>
                          </div>
                          {activeConcept?.keyTakeaways && activeConcept.keyTakeaways.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-[#827f76] uppercase tracking-wider block font-mono font-bold">Key Elements:</span>
                              {activeConcept.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                                <div key={idx} className="text-xs text-[#52504a] flex items-start gap-2">
                                  <span className="text-[#1b3b2b] font-bold">•</span>
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
                      <h4 className="text-lg font-serif font-bold text-[#1a1917]">Step 3: Interactive Sandbox</h4>
                      <p className="text-xs text-[#52504a] leading-relaxed">
                        Tweak values and observe real-time mathematical changes to build intuition.
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
                      <h4 className="text-lg font-serif font-bold text-[#1a1917]">Step 4: Active Recall Check</h4>
                      <p className="text-xs text-[#52504a] leading-relaxed">
                        Active retrieval practice strengthens retention. Summarize the core concept in your own words before checking the solution:
                      </p>

                      {!recallRevealed ? (
                        <div className="space-y-4">
                          <textarea
                            value={recallAnswer}
                            onChange={(e) => setRecallAnswer(e.target.value)}
                            placeholder="Type definition, core logic, or key formula here..."
                            rows={4}
                            className="w-full bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl p-4 text-xs font-sans text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                          />

                          <div className="flex gap-2">
                            <button
                              disabled={recallAnswer.trim().length === 0}
                              onClick={() => setRecallRevealed(true)}
                              className="flex-1 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-40"
                            >
                              Check My Recall ➔
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-1">
                            <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider block font-bold">Your Explanation:</span>
                            <p className="text-xs text-[#52504a] italic">"{recallAnswer}"</p>
                          </div>

                          <div className="p-4 bg-white border border-[#1b3b2b]/30 rounded-xl space-y-1.5 shadow-sm">
                            <span className="text-[10px] text-[#1b3b2b] uppercase tracking-wider block font-mono font-bold flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5" /> Official NCERT Definition:
                            </span>
                            <p className="text-xs font-serif font-bold text-[#1a1917] leading-relaxed">{activeConcept?.definition}</p>
                            <p className="text-xs text-[#52504a] leading-relaxed mt-1">{activeConcept?.explanation}</p>
                          </div>

                          <div className="space-y-2 border-t border-[#e5e1d5] pt-4">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#827f76] text-center">
                              Rate your recall accuracy to continue:
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => { playLocalSynth('correct'); setQuestStep(5); }}
                                className="py-2.5 bg-[#f5f3ec] border border-[#e5e1d5] hover:bg-[#1b3b2b] hover:text-white text-[#1b3b2b] rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                              >
                                Confident
                              </button>
                              <button
                                onClick={() => { playLocalSynth('correct'); setQuestStep(5); }}
                                className="py-2.5 bg-[#fef9ee] border border-[#e5e1d5] hover:bg-[#85570e] hover:text-white text-[#85570e] rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                              >
                                Partial
                              </button>
                              <button
                                onClick={() => { playLocalSynth('incorrect'); setQuestStep(5); }}
                                className="py-2.5 bg-[#fdf2f2] border border-[#e5e1d5] hover:bg-[#8e2424] hover:text-white text-[#8e2424] rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                              >
                                Review Needed
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 5: Practice Check */}
                  {questStep === 5 && (
                    <motion.div
                      key="practice"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-serif font-bold text-[#1a1917]">Step 5: Concept Checkpoint</h4>
                      <p className="text-xs text-[#52504a] leading-relaxed">
                        Verify your understanding with this syllabus checkpoint exercise.
                      </p>

                      {!practiceQuestion ? (
                        <div className="text-center p-8 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-[#827f76] text-xs font-mono uppercase">
                          No question available for this checkpoint. Click continue to advance.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-serif font-bold text-[#1a1917] leading-relaxed">
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
                                  className={`w-full p-3.5 border rounded-xl text-xs font-sans text-left transition-all ${
                                    showSuccess 
                                      ? 'bg-[#f5f3ec] border-[#1b3b2b] text-[#1b3b2b] font-bold'
                                      : showDanger 
                                        ? 'bg-[#fdf2f2] border-[#e07d7d] text-[#8e2424]'
                                        : isSelected 
                                          ? 'bg-[#f5f3ec] border-[#1b3b2b] text-[#1b3b2b]'
                                          : 'bg-white border-[#e5e1d5] text-[#1a1917] hover:border-[#1b3b2b]/40 hover:bg-[#fbfbfa]'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{opt}</span>
                                    {showSuccess && <span className="text-[10px] font-mono font-bold text-[#1b3b2b]">✓ Correct</span>}
                                    {showDanger && <span className="text-[10px] font-mono font-bold text-[#8e2424]">✗ Incorrect</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {practiceSubmitted && (
                            <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#52504a] space-y-1">
                              <strong className="text-[#1b3b2b] font-mono uppercase tracking-wider block text-[10px]">Solution Explanation:</strong>
                              <p>{practiceQuestion.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 6: Concept Mastered */}
                  {questStep === 6 && (
                    <motion.div
                      key="reward"
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.98, opacity: 0 }}
                      className="space-y-6 text-center py-6 flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] text-[#1b3b2b] flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xl font-serif font-bold text-[#1a1917]">Concept Unit Completed</h4>
                        <p className="text-xs text-[#52504a] max-w-sm mx-auto leading-relaxed">
                          You completed "{activeConcept?.title || ''}" through definition, visual modeling, and active recall.
                        </p>
                      </div>

                      <div className="bg-[#fbfbfa] px-6 py-4 border border-[#e5e1d5] rounded-xl flex gap-8 text-xs shadow-sm">
                        <div>
                          <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider block">Active Recall</span>
                          <span className="text-[#1b3b2b] font-mono text-sm font-bold">Verified ✓</span>
                        </div>
                        <div className="w-[1px] bg-[#e5e1d5]" />
                        <div>
                          <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider block">Checkpoint</span>
                          <span className="text-[#1a1917] font-mono text-sm font-bold">Completed</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full">
                        {activeConceptIndex + 1 < concepts.length ? (
                          <button
                            onClick={() => startActiveStudy(activeConceptIndex + 1)}
                            className="flex-1 py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
                          >
                            Next Concept Unit ➔
                          </button>
                        ) : (
                          <button
                            onClick={finishActiveStudy}
                            className="flex-1 py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
                          >
                            Return to Concept Matrix ✓
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress buttons for linear steps */}
              {questStep < 6 && (
                <div className="flex justify-between items-center border-t border-[#e5e1d5] pt-4 mt-6">
                  <button
                    disabled={questStep === 1}
                    onClick={() => setQuestStep(prev => prev - 1)}
                    className="px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] rounded-lg text-[#52504a] text-xs font-mono uppercase tracking-wider disabled:opacity-30 transition-all"
                  >
                    ◀ Back
                  </button>

                  {questStep === 4 && !recallRevealed ? null : questStep === 5 && !practiceSubmitted ? (
                    <button
                      onClick={() => setQuestStep(6)}
                      className="px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] rounded-lg text-[#52504a] text-xs font-mono uppercase tracking-wider transition-all"
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
                      className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
                    >
                      Continue <ArrowRight className="w-3.5 h-3.5" />
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
