import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Play, Swords, ChevronRight, Star, BookOpen, Flame, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { gamificationService, BOSSES } from '../services/gamificationService';

// ─────────────────────────────────────────────────────────────
// CBSE CHAPTER JOURNEY — Fixed curriculum-based world map
// ─────────────────────────────────────────────────────────────
const JOURNEY = [
  // ── Mathematics ──────────────────────────────────────────
  {
    subject: 'math', biome: 'village',      emoji: '🏘️',
    area: 'Village of Numbers',
    chapter: 'Number Systems', grade: '9',
    bossId: 'dragon', bossEmoji: '🐉',
    color: 'from-blue-500 to-cyan-400',
    glow: 'shadow-blue-500/40', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400',
    desc: 'Master natural numbers, integers, rational & irrational numbers.',
    topics: ['Natural Numbers', 'Whole Numbers', 'Integers', 'Rational Numbers', 'Irrational Numbers', 'Real Numbers'],
    chain: 0,
  },
  {
    subject: 'math', biome: 'forest',       emoji: '🌲',
    area: 'Algebra Forest',
    chapter: 'Polynomials', grade: '9',
    bossId: 'algebra', bossEmoji: '🔺',
    color: 'from-cyan-500 to-teal-400',
    glow: 'shadow-cyan-500/40', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400',
    desc: 'Navigate the algebraic forest — polynomials, zeroes, and factor trees.',
    topics: ['Polynomials', 'Zeroes of a Polynomial', 'Remainder Theorem', 'Factor Theorem', 'Algebraic Identities'],
    chain: 1,
  },
  {
    subject: 'math', biome: 'mountain',     emoji: '⛰️',
    area: 'Geometry Mountains',
    chapter: 'Triangles & Coordinate Geometry', grade: '9',
    bossId: 'geometry', bossEmoji: '🔷',
    color: 'from-indigo-500 to-violet-400',
    glow: 'shadow-indigo-500/40', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400',
    desc: 'Climb Geometry Mountains — congruence, similarity, and coordinates.',
    topics: ['Euclidean Geometry', 'Lines and Angles', 'Triangles', 'Congruence', 'Coordinate Geometry'],
    chain: 2,
  },
  {
    subject: 'math', biome: 'kingdom',      emoji: '📊',
    area: 'Statistics Kingdom',
    chapter: 'Statistics & Probability', grade: '9',
    bossId: null, bossEmoji: null,
    color: 'from-violet-500 to-purple-400',
    glow: 'shadow-violet-500/40', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400',
    desc: 'Rule the Kingdom of Data — mean, median, mode, and probability.',
    topics: ['Mean', 'Median', 'Mode', 'Bar Graphs', 'Histograms', 'Probability'],
    chain: 3,
  },
  {
    subject: 'math', biome: 'citadel',      emoji: '🏯',
    area: 'Mathematics Citadel',
    chapter: 'Surface Areas, Volumes & Heron\'s Formula', grade: '9',
    bossId: null, bossEmoji: null,
    color: 'from-purple-600 to-pink-500',
    glow: 'shadow-purple-600/40', bg: 'bg-purple-600/10', border: 'border-purple-600/30', text: 'text-purple-400',
    desc: 'Conquer the final Citadel — 3D geometry and advanced formulas.',
    topics: ['Heron\'s Formula', 'Surface Areas', 'Volumes', 'Circles', 'Constructions'],
    chain: 4,
  },
  // ── Science ─────────────────────────────────────────────
  {
    subject: 'science', biome: 'cave',      emoji: '🔬',
    area: 'Cell Caverns',
    chapter: 'The Fundamental Unit of Life', grade: '9',
    bossId: 'cell', bossEmoji: '🦠',
    color: 'from-green-500 to-emerald-400',
    glow: 'shadow-green-500/40', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400',
    desc: 'Explore the microscopic Cell Caverns — cell theory, structure, and division.',
    topics: ['Cell Theory', 'Prokaryotic Cells', 'Eukaryotic Cells', 'Cell Organelles', 'Cell Division'],
    chain: 0,
  },
  {
    subject: 'science', biome: 'plains',    emoji: '⚡',
    area: 'Motion Plains',
    chapter: 'Motion & Force', grade: '9',
    bossId: 'motion', bossEmoji: '⚡',
    color: 'from-yellow-500 to-amber-400',
    glow: 'shadow-yellow-500/40', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400',
    desc: 'Cross the Motion Plains — Newton\'s laws, velocity, acceleration, and force.',
    topics: ['Distance & Displacement', 'Speed & Velocity', 'Acceleration', 'Newton\'s Laws', 'Gravitation'],
    chain: 1,
  },
  {
    subject: 'science', biome: 'nuclear',   emoji: '☢️',
    area: 'Atom Realm',
    chapter: 'Atoms & Molecules', grade: '9',
    bossId: 'atom', bossEmoji: '☢️',
    color: 'from-rose-500 to-red-400',
    glow: 'shadow-rose-500/40', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400',
    desc: 'Enter the Atom Realm — atomic structure, molecules, Mole concept.',
    topics: ['Atoms', 'Molecules', 'Atomic Mass', 'Valency', 'Chemical Formulae', 'Mole Concept'],
    chain: 2,
  },
  // ── Social Studies ────────────────────────────────────────
  {
    subject: 'social', biome: 'empire',     emoji: '🏛️',
    area: 'Ancient Empires',
    chapter: 'History — French Revolution & Nazism', grade: '9',
    bossId: 'empire', bossEmoji: '🏛️',
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/40', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400',
    desc: 'Conquer history — French Revolution, socialism, and the rise of Nazism.',
    topics: ['French Revolution', 'Russian Revolution', 'Nazism', 'Hitler\'s Rise', 'Forest Society'],
    chain: 0,
  },
  {
    subject: 'social', biome: 'ocean',      emoji: '🌊',
    area: 'Geography Leviathan\'s Sea',
    chapter: 'Geography — Climate, Drainage & Natural Vegetation', grade: '9',
    bossId: 'leviathan', bossEmoji: '🌊',
    color: 'from-teal-500 to-cyan-500',
    glow: 'shadow-teal-500/40', bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400',
    desc: 'Navigate the vast ocean of geography — India\'s climate, rivers, and biomes.',
    topics: ['India\'s Physical Features', 'Drainage Systems', 'Climate', 'Natural Vegetation', 'Wild Life'],
    chain: 1,
  },
];

// Subject config for headers
const SUBJECT_META = {
  math:    { label: 'Mathematics',     emoji: '📐', color: 'from-blue-500 to-cyan-400'   },
  science: { label: 'Science',         emoji: '🔬', color: 'from-green-500 to-emerald-400'},
  social:  { label: 'Social Studies',  emoji: '🌍', color: 'from-orange-500 to-amber-500' },
};

// ─────────────────────────────────────────────────────────────
const JourneyNode = ({ node, userLevel, index, isUnlocked, onOpen }) => {
  const nodeRef = useRef(null);
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-center justify-center">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 -translate-y-8 bg-gradient-to-b from-white/20 to-transparent" />
      )}

      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
        onClick={() => isUnlocked && onOpen(node)}
        className={`relative w-full max-w-sm mx-auto cursor-pointer select-none rounded-3xl border p-5 transition-all duration-200 ${
          isUnlocked
            ? `${node.bg} ${node.border} hover:scale-[1.03] hover:shadow-2xl ${node.glow} shadow-lg`
            : 'bg-white/[0.02] border-white/5 opacity-40 grayscale cursor-not-allowed'
        }`}
      >
        {/* Boss indicator */}
        {node.bossId && isUnlocked && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-sm animate-pulse">
            {node.bossEmoji}
          </div>
        )}

        {/* Lock badge */}
        {!isUnlocked && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-text-muted" />
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Biome emoji */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
            isUnlocked ? 'bg-white/10' : 'bg-white/5'
          }`}>
            {isUnlocked ? node.emoji : '🔒'}
          </div>

          <div className="flex-1 min-w-0">
            <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isUnlocked ? node.text : 'text-text-muted'}`}>
              {SUBJECT_META[node.subject]?.label} · Ch {node.chain + 1}
            </div>
            <h3 className={`font-black uppercase tracking-tight text-sm truncate ${isUnlocked ? 'text-white' : 'text-text-muted'}`}>
              {node.area}
            </h3>
            <p className={`text-[11px] mt-0.5 ${isUnlocked ? 'text-text-muted' : 'text-white/20'}`}>{node.chapter}</p>
          </div>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-3 mt-4">
            {node.bossId && (
              <span className="flex items-center gap-1 text-[9px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded-lg">
                <Swords className="w-3 h-3" /> Boss Available
              </span>
            )}
            <span className="flex items-center gap-1 text-[9px] font-black text-text-muted ml-auto">
              {node.topics.length} Topics <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const JourneyMap = () => {
  const [user, setUser] = useState(authService.me());
  const [selectedNode, setSelectedNode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  const userLevel = user?.level || 1;
  const progress = user?.boss_chapter_progress || {};

  // A node is unlocked if:
  // - It's the first in its subject chain (chain === 0), OR
  // - The previous boss in the chain has been defeated/claimed
  const isNodeUnlocked = (node) => {
    if (node.chain === 0) return true;
    const subjectNodes = JOURNEY.filter(n => n.subject === node.subject && n.chain < node.chain);
    // Check if previous chapter's boss is defeated
    const prevBossNode = subjectNodes.find(n => n.chain === node.chain - 1 && n.bossId);
    if (prevBossNode) {
      const bp = progress[prevBossNode.bossId];
      return bp?.claimed || bp?.status === 'defeated' || bp?.hp === 0;
    }
    // No boss gate — unlock by level (every 2 levels per chapter)
    return userLevel >= (node.chain + 1) * 2;
  };

  const subjects = ['math', 'science', 'social'];

  return (
    <div className="space-y-12">
      {/* ─── Header ─── */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-white uppercase tracking-tighter"
        >
          🗺️ Academic Journey Map
        </motion.h1>
        <p className="text-text-muted text-[11px] font-black uppercase tracking-[0.25em] mt-2">
          Your CBSE Quest Through Knowledge — Conquer chapters, defeat bosses, ascend
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3" /> Level {userLevel}</span>
          <span className="flex items-center gap-1 text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            {JOURNEY.filter(n => isNodeUnlocked(n)).length}/{JOURNEY.length} Areas Unlocked
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <Swords className="w-3 h-3" />
            {Object.values(progress).filter(b => b?.claimed || b?.status === 'defeated').length}/{Object.keys(progress).length} Bosses Defeated
          </span>
        </div>
      </div>

      {/* ─── Subject Paths ─── */}
      {subjects.map(sub => {
        const meta = SUBJECT_META[sub];
        const nodes = JOURNEY.filter(n => n.subject === sub);

        return (
          <div key={sub} className="space-y-6">
            {/* Subject Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${meta.color} bg-opacity-10`}
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${meta.color}`}>
                {meta.emoji}
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">{meta.label}</h2>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">
                  {nodes.filter(n => isNodeUnlocked(n)).length}/{nodes.length} Chapters Unlocked
                </p>
              </div>
              <div className="ml-auto h-1.5 flex-1 max-w-xs rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
                  animate={{ width: `${(nodes.filter(n => isNodeUnlocked(n)).length / nodes.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Nodes */}
            <div className="relative">
              {/* Path line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent -translate-x-1/2 pointer-events-none" />

              <div className="space-y-6">
                {nodes.map((node, i) => (
                  <JourneyNode
                    key={node.chapter}
                    node={node}
                    userLevel={userLevel}
                    index={i}
                    isUnlocked={isNodeUnlocked(node)}
                    onOpen={setSelectedNode}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── Chapter Detail Sheet ─── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-3xl bg-background-card border ${selectedNode.border} p-7 shadow-2xl`}
            >
              {/* Area + Chapter */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${selectedNode.bg} border ${selectedNode.border} flex-shrink-0`}>
                  {selectedNode.emoji}
                </div>
                <div>
                  <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedNode.text}`}>
                    {SUBJECT_META[selectedNode.subject]?.label} · Chapter {selectedNode.chain + 1}
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">{selectedNode.area}</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">{selectedNode.chapter}</p>
                </div>
              </div>

              <p className="text-sm text-text-muted mb-5">{selectedNode.desc}</p>

              {/* Topics */}
              <div className="mb-5">
                <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Topics Covered</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.topics.map(t => (
                    <span key={t} className={`text-[10px] px-2.5 py-1 rounded-lg font-black ${selectedNode.bg} ${selectedNode.text} border ${selectedNode.border}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Boss info */}
              {selectedNode.bossId && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 mb-5">
                  <span className="text-2xl">{selectedNode.bossEmoji}</span>
                  <div>
                    <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Boss Guardian</div>
                    <div className="text-sm font-black text-white">
                      {/* Find boss name */}
                      {(() => {
                        const b = BOSSES?.find?.(b => b.id === selectedNode.bossId);
                        return b ? `${b.emoji} ${b.name}` : 'Chapter Boss';
                      })()}
                    </div>
                  </div>
                  <button
                    onClick={() => { navigate('/boss-raid'); setSelectedNode(null); }}
                    className="ml-auto text-[10px] font-black text-rose-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Fight →
                  </button>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { navigate('/subject-library'); setSelectedNode(null); }}
                  className={`flex-1 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-gradient-to-r ${selectedNode.color} text-white flex items-center justify-center gap-2 shadow-lg`}
                >
                  <Play className="w-4 h-4 fill-white" /> Study Now
                </button>
                <button
                  onClick={() => { navigate('/flashcards'); setSelectedNode(null); }}
                  className="py-3 px-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyMap;
