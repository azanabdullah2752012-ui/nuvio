import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Brain, Search, 
  Map, MessageSquare, Zap, 
  Sparkles, History, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AIHub = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'essay-forge',
      name: 'Essay Forge',
      desc: 'Advanced academic writing assistant. Structure, citations, and flow optimization.',
      icon: <FileText className="w-8 h-8" />,
      color: 'text-nuvio-purple-400',
      bg: 'bg-nuvio-purple-500/10',
      prompt: "You are the Essay Forge Tool. Help the user structure, write, and refine their academic essay. Focus on citations and logical flow."
    },
    {
      id: 'knowledge-map',
      name: 'Curriculum Navigator',
      desc: 'Visualize your entire learning journey. Identify gaps and master nodes.',
      icon: <Map className="w-8 h-8" />,
      color: 'text-nuvio-blue',
      bg: 'bg-nuvio-blue/10',
      path: '/knowledge-map'
    },
    {
      id: 'homework-helper',
      name: 'Homework Helper',
      desc: 'Instant step-by-step solutions for complex problems across all subjects.',
      icon: <Search className="w-8 h-8" />,
      color: 'text-nuvio-green',
      bg: 'bg-nuvio-green/10',
      prompt: "You are the Homework Helper Tool. Provide step-by-step explanations for problems, not just answers."
    },
    {
      id: 'concept-explainer',
      name: 'Concept Voyager',
      desc: 'ELI5 (Explain Like I\'m 5) for even the most difficult scientific theories.',
      icon: <Brain className="w-8 h-8" />,
      color: 'text-nuvio-orange',
      bg: 'bg-nuvio-orange/10',
      prompt: "You are the Concept Voyager Tool. Explain complex topics simply using analogies and ELI5 principles."
    }
  ];

  const handleToolClick = (tool) => {
    if (tool.path) {
      navigate(tool.path);
    } else {
      // Pass the specific tool role as state
      navigate('/nova-ai', { state: { systemPrompt: tool.prompt, toolName: tool.name } });
    }
  };

  return (
    <div className="space-y-12 pb-20 nv-page-transition">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">AI Central</h1>
        <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Powered by Gemini 2.0 Academic Core
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => (
          <motion.button 
            key={tool.id}
            whileHover={{ y: -8, scale: 1.01 }}
            onClick={() => handleToolClick(tool)}
            className="nv-card text-left flex flex-col justify-between p-10 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${tool.bg} blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity`} />
            
            <div className="space-y-8 relative z-10">
              <div className={`w-16 h-16 rounded-[24px] ${tool.bg} flex items-center justify-center ${tool.color} shadow-inner group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{tool.name}</h3>
                <p className="text-text-muted text-sm font-bold leading-relaxed">{tool.desc}</p>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between group-hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white">Initialize Tool</span>
              <ChevronRight className="w-5 h-5 text-text-muted translate-x-0 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Recent History Placeholder */}
      <div className="nv-card p-10 border-white/5 bg-white/[0.01]">
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
               <History className="w-5 h-5 text-nuvio-purple-400" /> Recent Sessions
            </h4>
         </div>
         <div className="space-y-4 opacity-50">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-text-secondary uppercase">Essay Structure: Renaissance Art</span>
                <span className="text-[10px] text-text-muted uppercase">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-text-secondary uppercase">Problem Solving: Quadratic Equations</span>
                <span className="text-[10px] text-text-muted uppercase">Yesterday</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIHub;
