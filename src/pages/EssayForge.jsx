import React, { useState } from 'react';
import { 
  PenTool, FileText, CheckCircle2, 
  RotateCcw, BookOpen, Lightbulb,
  ChevronRight, ArrowRight, Check, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/notificationService';

const WRITING_PROMPTS = [
  { id: 'p1', subject: 'English', grade: '9th', prompt: 'Write a personal narrative describing an instance where you helped a classmate master a difficult academic concept. Reflect on the cognitive hurdles encountered and how this exchange evolved your own comprehension.', type: 'Reflective Narrative', marks: 10 },
  { id: 'p2', subject: 'English', grade: '9th', prompt: 'Examine the significance of foundational literacy in contemporary technological societies, referencing themes from the NCERT text "How I Taught My Grandmother to Read".', type: 'Analytical Essay', marks: 10 },
  { id: 'p3', subject: 'English', grade: '9th', prompt: 'Draft a formal argumentative piece: "Artificial intelligence in classroom learning accelerates conceptual synthesis versus passive cognitive dependence."', type: 'Argumentative', marks: 10 },
  { id: 'p4', subject: 'Science', grade: '9th', prompt: 'Formulate an expository essay demonstrating how Newton’s Three Laws of Motion govern modern spaceflight propulsion and planetary orbital insertions.', type: 'Scientific Expository', marks: 10 },
  { id: 'p5', subject: 'English', grade: '9th', prompt: 'Write an official formal letter to your academic principal proposing the installation of structured quiet-focus study pods within the secondary library.', type: 'Formal Letter', marks: 8 }
];

const SELF_RUBRIC = [
  { id: 'content', label: 'Content Depth & Thesis', desc: 'Is the argument nuanced, factually substantiated, and aligned with CBSE guidelines?', max: 4 },
  { id: 'structure', label: 'Structural Architecture', desc: 'Does the essay possess an intentional opening hook, sequential transitions, and a decisive conclusion?', max: 3 },
  { id: 'lexical', label: 'Lexical Vocabulary & Tone', desc: 'Are words precise, varied, and fitting the formal academic register without verbose filler?', max: 2 },
  { id: 'mechanics', label: 'Grammar & Syntactic Flow', desc: 'Are sentences grammatically sound, punctuated accurately, and rhythmic?', max: 1 }
];

const WRITING_PRINCIPLES = [
  'Architect before execution: Spend 3 minutes drafting 3 core thesis pillars.',
  'Lead with concrete stakes: Open with a verifiable real-world tension or inquiry.',
  'Maintain the PEE cadence: Point → Evidence → Explanation per paragraph.',
  'Syntactic rhythm: Alternate between short punchy axioms and deliberate compound structures.',
  'Audit through the examiner’s lens: Remove every sentence that fails to advance your thesis.'
];

const WritingWorkshop = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [essay, setEssay] = useState('');
  const [scores, setScores] = useState({ content: 4, structure: 3, lexical: 2, mechanics: 1 });
  const [phase, setPhase] = useState('select'); // 'select' | 'write' | 'assess' | 'results'
  const [tipIdx] = useState(() => new Date().getDate() % WRITING_PRINCIPLES.length);

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const paragraphCount = essay.trim().split(/\n\s*\n/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 180));

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = SELF_RUBRIC.reduce((a, c) => a + c.max, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleStartWriting = (prompt) => {
    setSelectedPrompt(prompt);
    setEssay('');
    setPhase('write');
  };

  const handleFinishWriting = () => {
    if (wordCount < 30) {
      notificationService.send("Draft Incomplete", "Please draft at least 30 words before proceeding to self-rubric evaluation.", "info");
      return;
    }
    setPhase('assess');
  };

  const handleSubmitAssessment = () => {
    notificationService.send("Evaluation Recorded", `Academic composition evaluated at ${percentage}%.`, "success");
    setPhase('results');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Literary Architecture / CBSE Essay Forge
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Essay Forge
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Structured composition workbench. Practice argumentative essays, formal letters, and evaluate against CBSE board rubrics.
          </p>
        </div>

        {phase !== 'select' && (
          <button
            onClick={() => setPhase('select')}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors self-start sm:self-end"
          >
            ← Select Different Prompt
          </button>
        )}
      </header>

      {/* PHASE 1: SELECT PROMPT */}
      {phase === 'select' && (
        <div className="space-y-8">
          
          {/* Daily Writing Principle Card */}
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff4625]/10 border border-[#ff4625]/20 flex items-center justify-center text-[#ff4625] shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4625] font-bold">
                Composition Directive
              </span>
              <p className="text-sm text-zinc-200 mt-1 font-sans">
                {WRITING_PRINCIPLES[tipIdx]}
              </p>
            </div>
          </div>

          {/* Prompts Matrix */}
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-bold block">
              Curriculum Writing Prompts
            </span>

            <div className="space-y-4">
              {WRITING_PROMPTS.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => handleStartWriting(prompt)}
                  className="p-6 border border-white/10 bg-[#0d0f14] hover:border-[#ff4625]/40 hover:bg-[#12151c] rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625] bg-[#ff4625]/10 px-2 py-0.5 rounded font-bold">
                        {prompt.type}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {prompt.subject} · Class {prompt.grade}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed font-sans">
                      {prompt.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-zinc-400 font-bold">
                      {prompt.marks} Marks
                    </span>
                    <button className="px-4 py-2 bg-white/5 group-hover:bg-[#ff4625] text-zinc-300 group-hover:text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5">
                      <span>Draft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* PHASE 2: WRITE ESSAY */}
      {phase === 'write' && selectedPrompt && (
        <div className="space-y-6">
          
          {/* Prompt Banner */}
          <div className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625] font-bold">
                {selectedPrompt.type} · {selectedPrompt.marks} Marks
              </span>
            </div>
            <h3 className="text-base font-semibold text-white leading-relaxed">
              {selectedPrompt.prompt}
            </h3>
          </div>

          {/* Writing Surface */}
          <div className="border border-white/10 bg-[#0d0f14] rounded-2xl overflow-hidden">
            {/* Live Telemetry Bar */}
            <div className="px-6 py-3 border-b border-white/5 bg-[#08090b] flex items-center justify-between font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-6">
                <span>{wordCount} Words</span>
                <span>{paragraphCount} Paragraphs</span>
                <span>~{readTimeMinutes} min read</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">Live Metrics</span>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Begin drafting your thesis and supporting arguments here..."
              rows={14}
              className="w-full p-6 bg-transparent text-white font-sans text-sm sm:text-base leading-relaxed focus:outline-none placeholder:text-zinc-600 resize-y"
            />
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-mono text-zinc-500">
              Recommended minimum: 150 words for standard Class 9 essays.
            </span>
            <button
              onClick={handleFinishWriting}
              className="px-6 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <span>Evaluate Against Rubric</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* PHASE 3: SELF-ASSESS WITH RUBRIC */}
      {phase === 'assess' && selectedPrompt && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4625] font-bold">
              CBSE Marking Standard
            </span>
            <h2 className="font-clash text-2xl font-bold uppercase text-white mt-1">
              Self-Rubric Assessment
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Evaluate your draft against official CBSE evaluation dimensions.
            </p>
          </div>

          <div className="space-y-4">
            {SELF_RUBRIC.map((item) => (
              <div
                key={item.id}
                className="p-6 border border-white/10 bg-[#0d0f14] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-md">
                  <h4 className="font-clash text-base font-bold text-white uppercase">{item.label}</h4>
                  <p className="text-xs text-zinc-400 font-sans">{item.desc}</p>
                </div>

                <div className="flex gap-1.5 self-start sm:self-center">
                  {Array.from({ length: item.max + 1 }, (_, i) => i).map((scoreVal) => (
                    <button
                      key={scoreVal}
                      type="button"
                      onClick={() => setScores({ ...scores, [item.id]: scoreVal })}
                      className={`w-9 h-9 rounded-lg font-mono text-xs transition-all border ${
                        scores[item.id] === scoreVal
                          ? 'border-[#ff4625] bg-[#ff4625] text-white font-bold'
                          : 'border-white/10 bg-[#08090b] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {scoreVal}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmitAssessment}
            className="w-full py-4 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all"
          >
            Finalize Assessment & Review
          </button>
        </div>
      )}

      {/* PHASE 4: RESULTS */}
      {phase === 'results' && (
        <div className="max-w-xl mx-auto p-10 border border-white/10 bg-[#0d0f14] rounded-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Composition Verified</span>
            <h3 className="font-clash text-2xl font-bold uppercase text-white mt-1">
              Rubric Assessment Result
            </h3>
          </div>

          <div className="p-6 bg-[#08090b] border border-white/5 rounded-xl space-y-3">
            <div className="font-clash text-4xl font-bold text-white">{percentage}%</div>
            <span className="font-mono text-xs text-zinc-400 block">
              {totalScore} out of {maxScore} available rubric points
            </span>
            <div className="pt-2 border-t border-white/5 flex justify-center gap-6 font-mono text-[10px] text-zinc-500 uppercase">
              <span>{wordCount} Words Drafted</span>
              <span>·</span>
              <span>Class 9 Standard Met</span>
            </div>
          </div>

          <button
            onClick={() => setPhase('select')}
            className="w-full py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all"
          >
            Start Another Composition
          </button>
        </div>
      )}

    </div>
  );
};

export default WritingWorkshop;