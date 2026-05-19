import React, { useState, useEffect } from 'react';
import { 
  Map, Brain, ChevronRight, 
  Circle, Sparkles, X, Database, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';

const KnowledgeMap = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [userNodes, setUserNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKnowledgeNodes();
  }, []);

  const fetchKnowledgeNodes = async () => {
    setLoading(true);
    
    try {
      // Fetch Decks and Tasks to see what subjects are "Unlocked"
      const [decks, tasks] = await Promise.all([
        dataService.list('decks'),
        dataService.list('tasks')
      ]);

      const subjectsData = {};

      // 1. Process all unique subjects from both sources
      const allSubjects = new Set([
        ...tasks.map(t => t.subject?.toLowerCase() || 'general'),
        ...decks.map(d => d.subject?.toLowerCase() || 'general')
      ]);

      allSubjects.forEach(s => {
        subjectsData[s] = { count: 0, completed: 0, decks: 0 };
      });

      tasks.forEach(t => {
        const s = t.subject?.toLowerCase() || 'general';
        subjectsData[s].count++;
        if (t.completed) subjectsData[s].completed++;
      });

      decks.forEach(d => {
        const s = d.subject?.toLowerCase() || 'general';
        subjectsData[s].decks++;
      });

      // 2. Generate Dynamic Nodes in a circular constellation pattern
      const subjects = Object.keys(subjectsData);
      const processed = subjects.map((s, i) => {
        const angle = (i / subjects.length) * 2 * Math.PI;
        const radius = subjects.length > 1 ? 30 : 0;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        return {
          id: s,
          label: s.charAt(0).toUpperCase() + s.slice(1),
          x: `${x}%`,
          y: `${y}%`,
          color: s === 'math' ? 'nuvio-blue' : s === 'science' ? 'nuvio-green' : 'nuvio-purple-500',
          size: s === 'general' ? 'w-16 h-16' : 'w-24 h-24',
          status: subjectsData[s].count > 0 && subjectsData[s].completed >= subjectsData[s].count ? 'Mastered' : 'In Progress',
          data: subjectsData[s]
        };
      });

      setUserNodes(processed);
    } catch (err) {
      console.error("Neural Map Calibration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-background-card rounded-[32px] border border-border overflow-hidden relative shadow-2xl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nuvio-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="p-8 flex items-center justify-between bg-white/[0.03] border-b border-white/5 z-10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Map className="w-8 h-8 text-nuvio-purple-400" />
            Neural Map
          </h1>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">Data-Synced Academic Topology 🛰️</p>
        </div>
        <button onClick={fetchKnowledgeNodes} className="nv-btn-secondary px-6 gap-2">
           <Sparkles className="w-4 h-4" /> Recalibrate
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-background-base/30">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
           <line x1="20%" y1="30%" x2="60%" y2="40%" stroke="white" strokeWidth="1" strokeDasharray="4" />
           <line x1="20%" y1="30%" x2="45%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="4" />
           <line x1="60%" y1="40%" x2="45%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="4" />
        </svg>

        {userNodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setActiveNode(node)}
            style={{ left: node.x, top: node.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 cursor-pointer group z-20 ${node.status === 'Locked' ? 'grayscale opacity-30' : ''}`}
          >
            <div className={`
              ${node.size} rounded-full bg-${node.color} flex items-center justify-center shadow-2xl transition-all duration-300 relative
              ${activeNode?.id === node.id ? 'ring-4 ring-white ring-offset-4 ring-offset-background-base scale-110' : 'hover:scale-105'}
            `}>
              <Brain className="w-1/2 h-1/2 text-white" />
              {node.status === 'Mastered' && (
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              )}
            </div>
            
            <div className="text-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</span>
              <div className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 ${node.status === 'Mastered' ? 'text-nuvio-green' : 'text-text-muted'}`}>
                {node.status}
              </div>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {activeNode && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute top-0 right-0 h-full w-[350px] bg-background-surface/80 backdrop-blur-xl border-l border-white/5 z-30 p-10 flex flex-col">
              <button onClick={() => setActiveNode(null)} className="absolute top-6 left-6 p-2 text-text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 space-y-10 pt-10">
                <div className={`w-20 h-20 rounded-3xl bg-${activeNode.color} flex items-center justify-center text-white shadow-2xl`}>
                  <Brain className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{activeNode.label}</h3>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Topology Data</label>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                    <Database className="w-5 h-5 text-nuvio-purple-400" />
                    <div>
                      <div className="text-xs font-black text-white">Status: {activeNode.status}</div>
                      <div className="text-[10px] text-text-muted font-bold">Cloud-Verified Subject</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                       <div className="text-xl font-black text-white">{activeNode.data.completed}/{activeNode.data.count}</div>
                       <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Tasks</div>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                       <div className="text-xl font-black text-white">{activeNode.data.decks}</div>
                       <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Vault Decks</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/homework', { state: { filterSubject: activeNode.label } })}
                    className="w-full py-5 bg-nuvio-purple-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-nuvio-purple-500/20 hover:scale-105 transition-all mt-auto"
                  >
                    <Play className="w-4 h-4 fill-white" /> Commence Study
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeMap;
