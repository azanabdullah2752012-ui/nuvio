import React, { useState } from 'react';
import { 
  Map, ZoomIn, ZoomOut, 
  Maximize, Search, Brain, 
  ChevronRight, Circle, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KnowledgeMap = () => {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { id: 1, label: 'Mathematics', x: '20%', y: '30%', color: 'nuvio-blue', size: 'w-24 h-24', status: 'Mastered' },
    { id: 2, label: 'Calculus', x: '10%', y: '50%', color: 'nuvio-blue', size: 'w-16 h-16', status: 'Mastered' },
    { id: 3, label: 'Algebra', x: '30%', y: '50%', color: 'nuvio-blue', size: 'w-16 h-16', status: 'In Progress' },
    { id: 4, label: 'Science', x: '60%', y: '40%', color: 'nuvio-green', size: 'w-24 h-24', status: 'In Progress' },
    { id: 5, label: 'Physics', x: '70%', y: '60%', color: 'nuvio-green', size: 'w-16 h-16', status: 'Locked' },
    { id: 6, label: 'Humanities', x: '45%', y: '75%', color: 'nuvio-orange', size: 'w-24 h-24', status: 'Locked' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-background-card rounded-[32px] border border-border overflow-hidden relative shadow-2xl">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nuvio-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HUD Header */}
      <div className="p-8 flex items-center justify-between bg-white/[0.03] border-b border-white/5 z-10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3 uppercase tracking-tighter">
            <Map className="w-8 h-8 text-nuvio-purple-400" />
            Knowledge Map
          </h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2 opacity-60">Visualize your academic neural network</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="nv-btn-primary px-8 h-12 gap-3 shadow-lg shadow-nuvio-purple-500/20">
            <Sparkles className="w-5 h-5" /> AI Scan
          </button>
        </div>
      </div>

      {/* Map Content Area */}
      <div className="flex-1 relative overflow-hidden bg-background-base/30">
        {/* SVG Connections (Responsive Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
           <line x1="20%" y1="30%" x2="10%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4" />
           <line x1="20%" y1="30%" x2="30%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4" />
           <line x1="60%" y1="40%" x2="70%" y2="60%" stroke="white" strokeWidth="2" strokeDasharray="4" />
           <line x1="20%" y1="30%" x2="45%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="8" />
           <line x1="60%" y1="40%" x2="45%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="8" />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: node.id * 0.1 }}
            onClick={() => setActiveNode(node)}
            style={{ left: node.x, top: node.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 cursor-pointer group z-20"
          >
            <div className={`
              ${node.size} rounded-full bg-${node.color} flex items-center justify-center shadow-2xl transition-all duration-300 relative
              ${activeNode?.id === node.id ? 'ring-4 ring-white ring-offset-4 ring-offset-background-base scale-110' : 'hover:scale-105 active:scale-95'}
              ${node.status === 'Locked' ? 'grayscale opacity-50' : 'animate-pulse-subtle'}
            `}>
              <Brain className={`w-1/2 h-1/2 text-white ${node.status === 'Locked' ? 'opacity-50' : ''}`} />
              
              {/* Pulse effect for progress */}
              {node.status === 'In Progress' && (
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              )}
            </div>
            
            <div className="text-center">
              <span className={`text-[10px] font-black uppercase tracking-widest ${activeNode?.id === node.id ? 'text-white' : 'text-text-muted'}`}>{node.label}</span>
              <div className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 ${
                node.status === 'Mastered' ? 'text-nuvio-green' : 
                node.status === 'Locked' ? 'text-text-muted' : 'text-nuvio-yellow'
              }`}>
                {node.status}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Side Panel (Overlay) */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 h-full w-[350px] bg-background-surface/80 backdrop-blur-xl border-l border-white/5 z-30 p-10 flex flex-col"
            >
              <button onClick={() => setActiveNode(null)} className="absolute top-6 left-6 p-2 text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 space-y-10 pt-10">
                <div className={`w-20 h-20 rounded-3xl bg-${activeNode.color} flex items-center justify-center text-white shadow-2xl`}>
                  <Brain className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">{activeNode.label}</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-nuvio-green" />
                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Active Curriculum</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">Mastery Level</label>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        className={`h-full bg-${activeNode.color}`} 
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-text-primary uppercase">
                      <span>Tier III</span>
                      <span className="text-nuvio-purple-400">68%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-50">Locked Skills</label>
                  <div className="space-y-2">
                    {['Advanced Syntax', 'Logic Gates', 'Algorithmic Flow'].map(skill => (
                      <div key={skill} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <Circle className="w-3 h-3 text-text-muted" />
                        <span className="text-xs font-bold text-text-secondary">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="nv-btn-primary w-full py-5 text-sm font-black uppercase tracking-widest mt-auto">
                Launch Node
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeMap;
