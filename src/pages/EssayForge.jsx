import React, { useState } from 'react';
import { 
  PenTool, Send, Sparkles, 
  Trash2, FileText, CheckCircle2, 
  BarChart, Info, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';

const EssayForge = () => {
  const [essay, setEssay] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleForge = async () => {
    if (!essay.trim() || essay.length < 50) return;
    setIsForging(true);
    
    const prompt = `Please grade this student essay and provide a structured feedback report (Grade, Strengths, Weaknesses, Tips). Essay: \n\n${essay}`;
    const result = await aiService.chat([{ role: 'user', content: prompt }]);
    
    setFeedback({
      grade: 'A-', // Simulated grade for now
      report: result,
      score: 88,
      metrics: [
        { label: 'Grammar', score: 92, color: 'bg-nuvio-green' },
        { label: 'Complexity', score: 75, color: 'bg-nuvio-blue' },
        { label: 'Clarity', score: 85, color: 'bg-nuvio-purple-500' },
      ]
    });
    setIsForging(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3 uppercase tracking-tighter">
            <PenTool className="w-8 h-8 text-nuvio-purple-400" />
            AI Essay Forge
          </h1>
          <p className="text-text-secondary text-sm">Write, refine, and get instant pedagogical feedback on your work.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEssay('')} className="p-3 bg-white/5 border border-border rounded-xl text-text-muted hover:text-nuvio-red transition-all cursor-pointer">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="nv-btn-secondary px-6">Save Draft</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="nv-card p-0 overflow-hidden border-white/10 group focus-within:border-nuvio-purple-500/50 transition-all">
            <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-border">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Document Editor</span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest border-l border-border pl-4">{essay.split(' ').filter(word => word).length} Words</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-text-muted cursor-help" />
              </div>
            </div>
            <textarea 
              className="w-full h-[500px] bg-transparent p-8 text-text-primary leading-relaxed resize-none focus:outline-none placeholder:text-text-muted/30"
              placeholder="Paste your essay here (minimum 50 words)..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>
          <button 
            onClick={handleForge}
            disabled={essay.length < 50 || isForging}
            className="w-full nv-btn-primary h-14 text-lg gap-3 disabled:opacity-50 shadow-xl shadow-nuvio-purple-500/20"
          >
            {isForging ? <Sparkles className="w-6 h-6 animate-spin text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
            {isForging ? 'FORGING FEEDBACK...' : 'FORGE GRADE & FEEDBACK'}
          </button>
        </div>

        {/* Feedback Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!feedback ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="nv-card py-20 text-center opacity-50 border-dashed"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                  <FileText className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="font-bold text-text-primary uppercase tracking-tight">Ready for analysis</h3>
                <p className="text-xs text-text-muted max-w-[200px] mx-auto mt-1">Forge your essay to see grading metrics and improvement tips.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Grade Card */}
                <div className="nv-card bg-gradient-to-br from-nuvio-purple-600/20 to-background-card border-nuvio-purple-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Forge Result</h3>
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl text-2xl font-black text-nuvio-purple-500 shadow-xl">
                      {feedback.grade}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {feedback.metrics.map(m => (
                      <div key={m.label} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-text-primary">{m.label}</span>
                          <span className="text-text-muted">{m.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Card */}
                <div className="nv-card">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-tight mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-nuvio-green" /> Nova's Report
                  </h3>
                  <div className="text-xs text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
                    {feedback.report}
                  </div>
                </div>

                <button 
                  onClick={() => setFeedback(null)}
                  className="w-full py-3 text-xs font-black text-text-muted uppercase tracking-widest hover:text-text-primary transition-colors"
                >
                  Clear Analysis
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EssayForge;
