import React, { useState } from 'react';
import { 
  PenTool, FileText, CheckCircle2, 
  Star, RotateCcw, BookOpen, Lightbulb,
  ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { xpService } from '../services/xpService';
import { notificationService } from '../services/notificationService';

const WRITING_PROMPTS = [
  { id: 'p1', subject: 'English', grade: '9th', prompt: 'Write about a time when you helped someone learn something new. What did you teach them and how did that experience change you?', type: 'Narrative', marks: 8 },
  { id: 'p2', subject: 'English', grade: '9th', prompt: 'Describe the importance of literacy in modern society. Use examples from your own life or the story "How I Taught My Grandmother to Read".', type: 'Descriptive', marks: 10 },
  { id: 'p3', subject: 'English', grade: '9th', prompt: 'Argue for or against: "Technology has made traditional crafts like pottery irrelevant in today\'s world."', type: 'Argumentative', marks: 8 },
  { id: 'p4', subject: 'Science', grade: '9th', prompt: 'Explain how Newton\'s three laws of motion apply to everyday activities. Give at least two real-world examples for each law.', type: 'Expository', marks: 10 },
  { id: 'p5', subject: 'English', grade: '10th', prompt: 'Write a letter to your school principal suggesting improvements to the library that would help students prepare for exams.', type: 'Formal Letter', marks: 5 },
];

const SELF_RUBRIC = [
  { id: 'content', label: 'Content & Ideas', desc: 'Is the essay relevant, informative, and well-supported with examples?', max: 4 },
  { id: 'structure', label: 'Structure & Organisation', desc: 'Does it have a clear intro, body, and conclusion?', max: 3 },
  { id: 'language', label: 'Language & Vocabulary', desc: 'Are sentences varied? Is vocabulary appropriate for the level?', max: 2 },
  { id: 'grammar', label: 'Grammar & Spelling', desc: 'Are sentences grammatically correct and free of spelling errors?', max: 1 },
];

const WRITING_TIPS = [
  'Always plan your essay before writing — spend 2–3 minutes outlining your key points.',
  'Start with a strong hook: a surprising fact, a question, or a bold statement.',
  'Use the PEE structure for body paragraphs: Point → Evidence → Explanation.',
  'Vary your sentence length for effect — mix short punchy sentences with longer descriptive ones.',
  'Re-read your essay once from the examiner\'s perspective before submitting.',
  'Avoid repeating the same vocabulary — use synonyms to show a rich command of language.',
];

const WritingWorkshop = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [essay, setEssay] = useState('');
  const [scores, setScores] = useState({});
  const [phase, setPhase] = useState('select'); // select | write | assess | results
  const [tipIdx] = useState(() => new Date().getDate() % WRITING_TIPS.length);

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = SELF_RUBRIC.reduce((a, c) => a + c.max, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleSubmitAssessment = async () => {
    const xpEarned = 30 + percentage;
    await xpService.awardXp(xpEarned, `Writing Workshop: ${selectedPrompt.type}`);
    notificationService.send('Workshop Complete! ✍️', `+${xpEarned} XP earned for your writing session.`, 'success');
    setPhase('results');
  };

  if (phase === 'select') {
    return (
      <div className="space-y-10 pb-20 nv-page-transition">
        <header>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <PenTool className="w-8 h-8 text-nuvio-purple-400" /> Writing Workshop
          </h1>
          <p className="text-text-secondary font-medium mt-1">Practice essays, develop your craft, and self-assess against CBSE rubrics.</p>
        </header>

        {/* Daily Writing Tip */}
        <div className="nv-card p-8 border-nuvio-purple-500/20 bg-nuvio-purple-500/5 flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-nuvio-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">💡</div>
          <div>
            <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em] mb-2">Writer's Tip of the Day</div>
            <p className="text-sm font-medium text-text-secondary leading-relaxed">{WRITING_TIPS[tipIdx]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prompts */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.3em]">Choose a Writing Prompt</h2>
            {WRITING_PROMPTS.map((prompt, i) => (
              <motion.button
                key={prompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setSelectedPrompt(prompt); setPhase('write'); }}
                className="w-full nv-card p-8 text-left border-white/5 hover:border-nuvio-purple-500/40 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-nuvio-purple-500/20 text-nuvio-purple-300 rounded-full text-[9px] font-black uppercase tracking-widest">{prompt.type}</span>
                    <span className="px-3 py-1 bg-white/5 text-text-muted rounded-full text-[9px] font-black uppercase tracking-widest">{prompt.subject} · {prompt.grade}</span>
                  </div>
                  <span className="text-[10px] font-black text-nuvio-yellow whitespace-nowrap">{prompt.marks} marks</span>
                </div>
                <p className="text-sm font-medium text-text-primary leading-relaxed">{prompt.prompt}</p>
                <div className="mt-4 flex items-center gap-2 text-nuvio-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest">Start Writing</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="nv-card p-8 border-white/5">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">How It Works</h3>
              {[
                { step: '1', label: 'Pick a Prompt', desc: 'Choose an essay prompt matching your grade.' },
                { step: '2', label: 'Write Your Essay', desc: 'Write freely — focus on your ideas first.' },
                { step: '3', label: 'Self-Assess', desc: 'Rate yourself against the CBSE rubric criteria.' },
                { step: '4', label: 'Earn XP', desc: 'Earn XP based on your self-assessment score.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-4 mb-5 last:mb-0">
                  <div className="w-8 h-8 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">{item.step}</div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight">{item.label}</div>
                    <div className="text-[10px] text-text-muted font-bold mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="nv-card p-8 border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">CBSE Marking Criteria</h3>
              {SELF_RUBRIC.map(r => (
                <div key={r.id} className="flex justify-between items-center mb-3 last:mb-0">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{r.label}</span>
                  <span className="text-[10px] font-black text-nuvio-yellow">{r.max} marks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'write') {
    return (
      <div className="space-y-8 pb-20 nv-page-transition">
        <header className="flex items-center gap-4">
          <button onClick={() => { setPhase('select'); setEssay(''); }} className="p-3 bg-white/5 rounded-2xl text-text-muted hover:text-white border border-white/5 transition-all">←</button>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Write Your Essay</h1>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 bg-nuvio-purple-500/20 text-nuvio-purple-300 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedPrompt.type}</span>
              <span className="px-2 py-0.5 bg-white/5 text-text-muted rounded-full text-[9px] font-black uppercase tracking-widest">{selectedPrompt.subject}</span>
            </div>
          </div>
        </header>

        {/* Prompt */}
        <div className="nv-card p-8 border-nuvio-blue/20 bg-nuvio-blue/5">
          <div className="flex items-start gap-4">
            <BookOpen className="w-5 h-5 text-nuvio-blue flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-black text-nuvio-blue uppercase tracking-widest mb-2">Question Prompt</div>
              <p className="text-sm font-medium text-text-primary leading-relaxed">{selectedPrompt.prompt}</p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="nv-card p-0 overflow-hidden border-white/10 focus-within:border-nuvio-purple-500/50 transition-all">
          <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-b border-white/5">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Your Response</span>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${wordCount < 100 ? 'text-nuvio-red' : wordCount < 200 ? 'text-nuvio-yellow' : 'text-nuvio-green'}`}>
                {wordCount} words {wordCount < 100 ? '(aim for 100+)' : ''}
              </span>
            </div>
          </div>
          <textarea
            className="w-full h-[400px] bg-transparent p-8 text-text-primary leading-relaxed resize-none focus:outline-none placeholder:text-text-muted/20 text-sm"
            placeholder="Start writing your essay here. Plan your introduction, develop your body paragraphs, and conclude strongly..."
            value={essay}
            onChange={e => setEssay(e.target.value)}
          />
        </div>

        <button
          onClick={() => setPhase('assess')}
          disabled={wordCount < 50}
          className="w-full nv-btn-primary h-16 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-40"
        >
          <CheckCircle2 className="w-5 h-5" />
          Proceed to Self-Assessment
        </button>
        {wordCount < 50 && <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-widest">Write at least 50 words to continue.</p>}
      </div>
    );
  }

  if (phase === 'assess') {
    return (
      <div className="space-y-8 pb-20 nv-page-transition max-w-2xl mx-auto">
        <header>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Self-Assessment</h1>
          <p className="text-text-secondary mt-1 text-sm">Rate your own work honestly against each CBSE criterion.</p>
        </header>

        <div className="space-y-6">
          {SELF_RUBRIC.map(rubric => (
            <div key={rubric.id} className="nv-card p-8 border-white/5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">{rubric.label}</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">{rubric.desc}</p>
                </div>
                <span className="text-[10px] font-black text-nuvio-yellow whitespace-nowrap">Max: {rubric.max}</span>
              </div>
              <div className="flex gap-3 mt-4">
                {Array.from({ length: rubric.max + 1 }, (_, i) => i).map(val => (
                  <button
                    key={val}
                    onClick={() => setScores(prev => ({ ...prev, [rubric.id]: val }))}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black text-lg transition-all ${
                      scores[rubric.id] === val
                        ? 'bg-nuvio-purple-500 border-nuvio-purple-500 text-white scale-105'
                        : 'border-white/10 text-text-muted hover:border-nuvio-purple-500/50 hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmitAssessment}
          disabled={Object.keys(scores).length < SELF_RUBRIC.length}
          className="w-full nv-btn-primary h-16 text-sm font-black uppercase tracking-widest disabled:opacity-40"
        >
          Submit Assessment & Claim XP
        </button>
      </div>
    );
  }

  if (phase === 'results') {
    const grade = percentage >= 90 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : percentage >= 45 ? 'C' : 'D';
    const gradeColor = percentage >= 75 ? 'text-nuvio-green' : percentage >= 45 ? 'text-nuvio-yellow' : 'text-nuvio-red';
    return (
      <div className="space-y-10 pb-20 nv-page-transition max-w-2xl mx-auto text-center">
        <div className="nv-card p-16 border-white/5 space-y-8">
          <div className="w-28 h-28 mx-auto bg-nuvio-purple-500/20 border-4 border-nuvio-purple-500/40 rounded-[32px] flex items-center justify-center">
            <span className={`text-5xl font-black ${gradeColor}`}>{grade}</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Session Complete!</h1>
            <p className="text-text-secondary mt-2 text-sm">You scored {totalScore}/{maxScore} ({percentage}%) on self-assessment.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {SELF_RUBRIC.map(r => (
              <div key={r.id} className="nv-card p-6 text-center border-white/5">
                <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">{r.label}</div>
                <div className="text-2xl font-black text-white">{scores[r.id] || 0}<span className="text-text-muted text-sm">/{r.max}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setPhase('select'); setEssay(''); setScores({}); }} className="flex-1 nv-btn-secondary py-5 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs">
            <RotateCcw className="w-4 h-4" /> Write Another
          </button>
        </div>
      </div>
    );
  }
};

export default WritingWorkshop;
