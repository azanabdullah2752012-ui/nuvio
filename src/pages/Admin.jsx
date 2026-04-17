import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, Users, Database, Globe, 
  Settings, TrendingUp, AlertCircle, BarChart3, 
  Zap, Coins, MessageSquare, BrainCircuit, 
  Clock, Lock, Unlock, Search, ShieldCheck, 
  UserX, Target, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';

// Neural Control Modules
import SystemPulse from '../components/admin/SystemPulse';
import NeuralSentinel from '../components/admin/NeuralSentinel';
import EconomyVault from '../components/admin/EconomyVault';
import SocialMatrix from '../components/admin/SocialMatrix';
import AuditLogs from '../components/admin/AuditLogs';

const Admin = () => {
  const [user, setUser] = useState(authService.me());
  const [activeTab, setActiveTab] = useState('pulse');
  const [healthStatus, setHealthStatus] = useState('NOMINAL');

  const tabs = [
    { id: 'pulse', name: 'System Pulse', icon: Activity, color: 'text-nuvio-green' },
    { id: 'sentinel', name: 'Neural Sentinel', icon: ShieldAlert, color: 'text-nuvio-red' },
    { id: 'vault', name: 'Economy Vault', icon: Coins, color: 'text-nuvio-yellow' },
    { id: 'matrix', name: 'Social Matrix', icon: MessageSquare, color: 'text-nuvio-purple-400' },
    { id: 'identity', name: 'Student registry', icon: Users, color: 'text-nuvio-blue' },
    { id: 'audit', name: 'Audit Trail', icon: ShieldCheck, color: 'text-nuvio-green' },
    { id: 'aicore', name: 'AI Protocol', icon: BrainCircuit, color: 'text-nuvio-blue' }
  ];

  return (
    <div className="space-y-10 pb-32 nv-page-transition max-w-[1600px] mx-auto">
      {/* 🏛️ DIVINE COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-nuvio-purple-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-nuvio-purple-500/20 group hover:rotate-12 transition-all">
            <Cpu className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              Control <span className="text-nuvio-purple-400 italic">Center</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-nuvio-green/10 border border-nuvio-green/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-nuvio-green animate-pulse" />
                <span className="text-[9px] font-black text-nuvio-green uppercase tracking-widest">System Health: {healthStatus}</span>
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">Omniscience Level 9 Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-black text-white uppercase tracking-widest">{user?.full_name}</div>
            <div className="text-[9px] font-bold text-nuvio-purple-400 uppercase tracking-widest mt-1 opacity-60">Master Authority</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
            ⚡
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION MATRIX */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
              activeTab === tab.id 
                ? 'bg-white/10 text-white shadow-xl' 
                : 'text-text-muted hover:bg-white/5'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'opacity-40'}`} />
            {tab.name}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeGlow"
                className="absolute bottom-0 left-0 right-0 h-1 bg-nuvio-purple-500"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-[600px]"
        >
          {activeTab === 'pulse' && <SystemPulse />}
          {activeTab === 'sentinel' && <NeuralSentinel />}
          {activeTab === 'vault' && <EconomyVault />}
          {activeTab === 'matrix' && <SocialMatrix />}
          {activeTab === 'audit' && <AuditLogs />}
          
          {activeTab === 'identity' && (
             <div className="nv-card p-12 text-center border-white/5 bg-white/[0.01]">
                <Users className="w-16 h-16 text-nuvio-blue mx-auto mb-6 opacity-20" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Student Identity Matrix</h3>
                <p className="text-text-muted text-sm max-w-md mx-auto mt-4 mb-10 leading-relaxed uppercase tracking-widest font-bold">The Identity registry is currently undergoing a neural refactor to support sharded high-load population scans.</p>
                <div className="relative max-w-2xl mx-auto">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted opacity-40" />
                   <input 
                     className="w-full h-20 bg-white/5 border border-white/10 rounded-[28px] pl-16 pr-8 text-white font-bold tracking-widest uppercase text-xs"
                     placeholder="Search across 10,000+ nodes..."
                     disabled
                   />
                </div>
             </div>
          )}

          {activeTab === 'aicore' && (
            <div className="space-y-8">
              <div className="nv-card p-10 space-y-8 border-white/5">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Neural Protocol Hub</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['Gemini', 'OpenRouter', 'Groq'].map(p => (
                     <div key={p} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center gap-4 group hover:border-nuvio-purple-500/30 transition-all cursor-not-allowed grayscale opacity-40">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                           <Lock className="w-5 h-5 text-text-muted" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{p} Integration</span>
                     </div>
                   ))}
                </div>

                <div className="p-10 bg-nuvio-purple-600/5 border border-nuvio-purple-600/20 rounded-[32px] text-center space-y-6">
                   <ShieldCheck className="w-12 h-12 text-nuvio-purple-400 mx-auto opacity-30" />
                   <p className="text-xs font-bold text-nuvio-purple-300 uppercase tracking-widest italic">The Divine AI Intelligence is currently locked to Local Protocol Mode while the Era 10K scaling completes.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Admin;
