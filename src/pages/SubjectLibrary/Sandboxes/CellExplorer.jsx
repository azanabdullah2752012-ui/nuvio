import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, BookOpen, Layers, Check, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { xpService } from '../../../services/xpService';
import { authService } from '../../../services/authService';

const ORGANELLE_INFO = {
  nucleus: {
    name: "Nucleus (Control Center)",
    emoji: "🧬",
    function: "Houses the genetic library (DNA) and directs all cellular operations including protein synthesis, cell growth, division, and metabolic functions.",
    fact: "Bound by a double-layered nuclear membrane with pores that regulate material traffic. Inside, DNA exists as chromatin threads which condense into rod-shaped chromosomes during cell division.",
    color: "fill-purple-500/20 stroke-purple-400 hover:fill-purple-500/40"
  },
  mitochondria: {
    name: "Mitochondria (Powerhouse)",
    emoji: "🔥",
    function: "Converts glucose food into chemical energy in the form of ATP (Adenosine Triphosphate) molecules through aerobic cellular respiration.",
    fact: "Semi-autonomous organelle with its own circular DNA and 70S ribosomes. It features a double-membrane; the inner membrane is folded into finger-like cristae to maximize surface area for ATP generation.",
    color: "fill-rose-500/25 stroke-rose-400 hover:fill-rose-500/45"
  },
  cellWall: {
    name: "Cell Wall (Rigid Armor)",
    emoji: "🛡️",
    function: "Provides absolute rigidity, structural support, shapes the plant cell, and prevents the cell from bursting when taking in water (turgor pressure).",
    fact: "Present only in plants, fungi, and some bacteria. Made of cellulose (a complex carbohydrate). Unlike the plasma membrane, it is completely permeable and thick.",
    color: "fill-none stroke-emerald-500 hover:stroke-emerald-400"
  },
  cellMembrane: {
    name: "Plasma Membrane (Gateway)",
    emoji: "🚪",
    function: "Acts as a selectively permeable barrier, controlling the inflow and outflow of molecules (like water via osmosis, nutrients, and gases).",
    fact: "Composed of a flexible lipid bilayer with embedded transport proteins. Follows the fluid-mosaic model, allowing active and passive transport (diffusion/osmosis).",
    color: "fill-cyan-500/5 stroke-cyan-400 hover:fill-cyan-500/20"
  },
  chloroplast: {
    name: "Chloroplast (Solar Panel)",
    emoji: "☀️",
    function: "Performs photosynthesis, absorbing solar radiation to synthesize food (glucose) from carbon dioxide and water.",
    fact: "Double-membraned plastid found only in green plant cells. Contains green chlorophyll pigments within stacks of disk-like membranes called grana (thylakoids). Has its own DNA and ribosomes.",
    color: "fill-green-500/20 stroke-green-400 hover:fill-green-500/40"
  },
  er: {
    name: "Endoplasmic Reticulum (Assembly Lines)",
    emoji: "🏗️",
    function: "Rough ER (studded with ribosomes) synthesizes and transports proteins. Smooth ER manufactures lipids, steroids, and detoxifies drugs/poisons.",
    fact: "An extensive internal network of membrane tubes and sheets. Rough ER is continuous with the nuclear membrane. Helps in membrane biogenesis.",
    color: "fill-amber-500/10 stroke-amber-400 hover:fill-amber-500/25"
  },
  golgi: {
    name: "Golgi Apparatus (Post Office)",
    emoji: "📦",
    function: "Receives proteins and lipids synthesized in the ER, refines/modifies them, packages them into vesicles, and dispatches them to destinations.",
    fact: "Consists of parallel-stacked flat membrane sacs called cisternae. First described by Italian physician Camillo Golgi. Involved in the synthesis of lysosomes.",
    color: "fill-orange-500/15 stroke-orange-400 hover:fill-orange-500/30"
  },
  vacuole: {
    name: "Vacuole (Storage Vault)",
    emoji: "💧",
    function: "Stores water, cellular waste, and nutrients. Helps maintain hydrostatic pressure, cell turgidity, and volume.",
    fact: "In plants, a single large central vacuole filled with cell sap occupies up to 90% of cell volume, pushing the nucleus to the side. Animal cell vacuoles are small and temporary.",
    color: "fill-blue-500/15 stroke-blue-400 hover:fill-blue-500/30"
  }
};

const playSynthSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'complete') {
      const playTone = (freq, start, duration) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, ctx.currentTime + start);
        g.gain.setValueAtTime(0.06, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + start + duration);
        o.start(ctx.currentTime + start);
        o.stop(ctx.currentTime + start + duration);
      };
      playTone(523.25, 0, 0.1);
      playTone(659.25, 0.1, 0.1);
      playTone(783.99, 0.2, 0.1);
      playTone(1046.50, 0.3, 0.25);
    }
  } catch (e) {
    console.warn("Synth blocked.");
  }
};

const CellExplorer = () => {
  const [cellType, setCellType] = useState('plant'); // 'plant' | 'animal'
  const [selectedOrganelle, setSelectedOrganelle] = useState('nucleus');
  const [hoveredOrganelle, setHoveredOrganelle] = useState(null);

  // Game Mode States
  const [isGameMode, setIsGameMode] = useState(false);
  const [placedOrganelles, setPlacedOrganelles] = useState([]);
  const [selectedShelfOrganelle, setSelectedShelfOrganelle] = useState(null);
  const [floaters, setFloaters] = useState([]);
  const [shakeOrganelle, setShakeOrganelle] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const plantExpected = ['cellWall', 'cellMembrane', 'vacuole', 'nucleus', 'er', 'chloroplast', 'mitochondria', 'golgi'];
  const animalExpected = ['cellMembrane', 'nucleus', 'er', 'vacuole', 'mitochondria', 'golgi'];
  const expectedOrganelles = cellType === 'plant' ? plantExpected : animalExpected;

  useEffect(() => {
    // Reset game when cell type or game mode changes
    resetGame();
  }, [cellType, isGameMode]);

  const resetGame = () => {
    setPlacedOrganelles([]);
    setSelectedShelfOrganelle(null);
    setFloaters([]);
    setShakeOrganelle(null);
    setIsGameFinished(false);
  };

  const activeInfo = ORGANELLE_INFO[selectedOrganelle] || ORGANELLE_INFO.nucleus;

  // Handle organelle clicks in the SVG diagram
  const handleOrganelleClick = (organelleKey, e) => {
    if (!isGameMode) {
      setSelectedOrganelle(organelleKey);
      return;
    }

    if (placedOrganelles.includes(organelleKey)) return;

    if (selectedShelfOrganelle === organelleKey) {
      // Correct placement
      const newPlaced = [...placedOrganelles, organelleKey];
      setPlacedOrganelles(newPlaced);
      setSelectedShelfOrganelle(null);
      playSynthSound('correct');

      // Floater coordinate helper
      const rect = e.currentTarget.getBoundingClientRect();
      const nextId = Date.now() + Math.random();
      const newFloater = {
        id: nextId,
        text: "+10 XP ✨",
        x: e.nativeEvent.offsetX || 150,
        y: e.nativeEvent.offsetY || 150
      };
      setFloaters(prev => [...prev, newFloater]);
      setTimeout(() => {
        setFloaters(prev => prev.filter(f => f.id !== nextId));
      }, 1500);

      // Award XP globally
      xpService.awardXp(10, 'Organelle Placement');
      authService.addTokens(2);

      // Check if finished
      if (expectedOrganelles.every(org => newPlaced.includes(org))) {
        setIsGameFinished(true);
        playSynthSound('complete');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
        xpService.awardXp(50, 'Cell Assembly Mastery');
        authService.addTokens(10);
      }
    } else {
      // Incorrect placement
      playSynthSound('incorrect');
      setShakeOrganelle(organelleKey);
      setTimeout(() => setShakeOrganelle(null), 500);
    }
  };

  const getOrganelleStyle = (organelleKey, defaultStyle) => {
    const isPlaced = !isGameMode || placedOrganelles.includes(organelleKey);
    const isShaking = shakeOrganelle === organelleKey;

    if (!isPlaced) {
      return {
        className: `fill-slate-800/10 stroke-slate-500 transition-all duration-200 cursor-pointer ${
          isShaking ? 'animate-shake stroke-rose-500 fill-rose-500/10' : 'stroke-dasharray-4 stroke-slate-500 hover:fill-slate-700/20'
        }`,
        style: { strokeDasharray: '4 4' }
      };
    }

    return {
      className: `${defaultStyle} cursor-pointer transition-all duration-200`
    };
  };

  // Render SVG border stroke thickness depending on selection or hover
  const getStrokeWidth = (organelleKey) => {
    if (selectedOrganelle === organelleKey) return 4;
    if (hoveredOrganelle === organelleKey) return 3;
    return 1.5;
  };

  // Shelf components that are not yet placed
  const shelfOrganelles = expectedOrganelles.filter(org => !placedOrganelles.includes(org));

  return (
    <div className="bg-slate-900/60 p-6 border border-white/10 rounded-xl space-y-6 text-left shadow-lg relative">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
            Biology Laboratory
          </span>
          <h4 className="text-sm font-black uppercase text-white">Interactive Cell Sandbox</h4>
          <p className="text-slate-400 text-[10px] font-semibold">
            {isGameMode 
              ? "Select an organelle from the shelf and click its matching outline in the cell."
              : "Select cell type and click on highlighted structures to analyze organelles."
            }
          </p>
        </div>

        <div className="flex gap-2">
          {/* Game Mode toggle */}
          <div className="flex bg-slate-950 p-1 border border-white/5 rounded-lg shrink-0">
            <button
              onClick={() => setIsGameMode(false)}
              className={`px-3.5 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                !isGameMode
                  ? 'bg-purple-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Explorer
            </button>
            <button
              onClick={() => setIsGameMode(true)}
              className={`px-3.5 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                isGameMode
                  ? 'bg-purple-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧩 Assembly Game
            </button>
          </div>

          {/* Cell type toggle */}
          <div className="flex bg-slate-950 p-1 border border-white/5 rounded-lg shrink-0">
            {[
              { id: 'plant', label: '🌿 Plant' },
              { id: 'animal', label: '🦁 Animal' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setCellType(type.id);
                  if (type.id === 'animal' && (selectedOrganelle === 'cellWall' || selectedOrganelle === 'chloroplast')) {
                    setSelectedOrganelle('nucleus');
                  }
                }}
                className={`px-3.5 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                  cellType === type.id
                    ? 'bg-purple-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Model Column */}
        <div className="md:col-span-7 bg-slate-950/80 rounded-xl border border-white/5 p-4 flex items-center justify-center relative min-h-[340px] overflow-hidden">
          <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">
            {isGameMode ? "Cell Assembly Canvas" : "Clickable Vector Model"}
          </span>

          {/* Floating score floaters */}
          {floaters.map(f => (
            <motion.span
              key={f.id}
              initial={{ opacity: 1, y: f.y, x: f.x, scale: 0.8 }}
              animate={{ opacity: 0, y: f.y - 40, scale: 1.2 }}
              transition={{ duration: 1.2 }}
              className="absolute text-[11px] font-black text-green-400 pointer-events-none select-none z-30 shadow-sm"
              style={{ left: f.x, top: f.y }}
            >
              {f.text}
            </motion.span>
          ))}

          <svg viewBox="0 0 400 340" className="w-full max-w-[360px] h-auto overflow-visible select-none">
            {cellType === 'plant' ? (
              /* ================== PLANT CELL MODEL ================== */
              <g id="plant-cell">
                {/* 1. Cell Wall (Emerald Hexagonal shape) */}
                <polygon
                  points="200,10 370,50 370,290 200,330 30,290 30,50"
                  {...getOrganelleStyle('cellWall', ORGANELLE_INFO.cellWall.color)}
                  onClick={(e) => handleOrganelleClick('cellWall', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('cellWall')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('cellWall')}
                />

                {/* 2. Cell Membrane (Thin inner line) */}
                <polygon
                  points="200,20 355,57 355,280 200,317 45,280 45,57"
                  {...getOrganelleStyle('cellMembrane', ORGANELLE_INFO.cellMembrane.color)}
                  onClick={(e) => handleOrganelleClick('cellMembrane', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('cellMembrane')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('cellMembrane')}
                />

                {/* 3. Large Central Vacuole (Big central rectangle with rounded corners) */}
                <rect
                  x="120"
                  y="120"
                  width="160"
                  height="120"
                  rx="20"
                  {...getOrganelleStyle('vacuole', ORGANELLE_INFO.vacuole.color)}
                  onClick={(e) => handleOrganelleClick('vacuole', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('vacuole')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('vacuole')}
                />
                {(!isGameMode || placedOrganelles.includes('vacuole')) && (
                  <text x="200" y="185" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold pointer-events-none select-none">Vacuole</text>
                )}

                {/* 4. Nucleus */}
                <circle
                  cx="90"
                  cy="240"
                  r="35"
                  {...getOrganelleStyle('nucleus', ORGANELLE_INFO.nucleus.color)}
                  onClick={(e) => handleOrganelleClick('nucleus', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('nucleus')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('nucleus')}
                />
                {(!isGameMode || placedOrganelles.includes('nucleus')) && (
                  <circle cx="95" cy="235" r="12" className="fill-purple-300/60 stroke-purple-400 pointer-events-none" />
                )}

                {/* 5. Endoplasmic Reticulum (Wavy curves framing the nucleus) */}
                <path
                  d="M 50,230 Q 75,200 90,205 T 120,225"
                  {...getOrganelleStyle('er', ORGANELLE_INFO.er.color)}
                  fill="none"
                  onClick={(e) => handleOrganelleClick('er', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('er')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('er')}
                />
                <path
                  d="M 60,260 Q 85,280 110,270"
                  {...getOrganelleStyle('er', ORGANELLE_INFO.er.color)}
                  fill="none"
                  onClick={(e) => handleOrganelleClick('er', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('er')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('er')}
                />

                {/* 6. Chloroplasts */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('chloroplast', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('chloroplast')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="100" cy="80" rx="22" ry="12" {...getOrganelleStyle('chloroplast', ORGANELLE_INFO.chloroplast.color)} strokeWidth={getStrokeWidth('chloroplast')} />
                  {(!isGameMode || placedOrganelles.includes('chloroplast')) && (
                    <>
                      <line x1="85" y1="80" x2="115" y2="80" className="stroke-green-400/50 pointer-events-none" />
                      <line x1="90" y1="75" x2="110" y2="75" className="stroke-green-400/50 pointer-events-none" />
                      <line x1="90" y1="85" x2="110" y2="85" className="stroke-green-400/50 pointer-events-none" />
                    </>
                  )}
                </g>

                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('chloroplast', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('chloroplast')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="300" cy="80" rx="22" ry="12" {...getOrganelleStyle('chloroplast', ORGANELLE_INFO.chloroplast.color)} strokeWidth={getStrokeWidth('chloroplast')} />
                  {(!isGameMode || placedOrganelles.includes('chloroplast')) && (
                    <>
                      <line x1="285" y1="80" x2="315" y2="80" className="stroke-green-400/50 pointer-events-none" />
                      <line x1="290" y1="75" x2="310" y2="75" className="stroke-green-400/50 pointer-events-none" />
                    </>
                  )}
                </g>

                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('chloroplast', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('chloroplast')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="320" cy="240" rx="22" ry="12" {...getOrganelleStyle('chloroplast', ORGANELLE_INFO.chloroplast.color)} strokeWidth={getStrokeWidth('chloroplast')} />
                  {(!isGameMode || placedOrganelles.includes('chloroplast')) && (
                    <line x1="305" y1="240" x2="335" y2="240" className="stroke-green-400/50 pointer-events-none" />
                  )}
                </g>

                {/* 7. Mitochondria */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('mitochondria', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('mitochondria')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="250" cy="60" rx="18" ry="10" transform="rotate(20 250 60)" {...getOrganelleStyle('mitochondria', ORGANELLE_INFO.mitochondria.color)} strokeWidth={getStrokeWidth('mitochondria')} />
                  {(!isGameMode || placedOrganelles.includes('mitochondria')) && (
                    <path d="M 238,62 Q 244,56 250,62 T 262,62" className="stroke-rose-400/50 fill-none pointer-events-none" />
                  )}
                </g>
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('mitochondria', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('mitochondria')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="220" cy="280" rx="18" ry="10" transform="rotate(-15 220 280)" {...getOrganelleStyle('mitochondria', ORGANELLE_INFO.mitochondria.color)} strokeWidth={getStrokeWidth('mitochondria')} />
                  {(!isGameMode || placedOrganelles.includes('mitochondria')) && (
                    <path d="M 208,282 Q 214,276 220,282 T 232,282" className="stroke-rose-400/50 fill-none pointer-events-none" />
                  )}
                </g>

                {/* 8. Golgi Apparatus */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('golgi', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('golgi')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <path d="M 320,130 Q 300,140 320,150" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                  <path d="M 330,125 Q 310,140 330,155" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                  <path d="M 340,120 Q 320,140 340,160" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                </g>
              </g>
            ) : (
              /* ================== ANIMAL CELL MODEL ================== */
              <g id="animal-cell">
                {/* 1. Cell Membrane (Wavy rounded border representing elastic shape) */}
                <path
                  d="M 200,20 Q 280,10 340,60 T 370,200 T 310,300 T 180,320 T 60,280 T 30,160 T 90,50 Z"
                  {...getOrganelleStyle('cellMembrane', ORGANELLE_INFO.cellMembrane.color)}
                  onClick={(e) => handleOrganelleClick('cellMembrane', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('cellMembrane')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('cellMembrane')}
                />

                {/* 2. Large Central Nucleus */}
                <circle
                  cx="200"
                  cy="170"
                  r="42"
                  {...getOrganelleStyle('nucleus', ORGANELLE_INFO.nucleus.color)}
                  onClick={(e) => handleOrganelleClick('nucleus', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('nucleus')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('nucleus')}
                />
                {(!isGameMode || placedOrganelles.includes('nucleus')) && (
                  <circle cx="205" cy="165" r="15" className="fill-purple-300/60 stroke-purple-400 pointer-events-none" />
                )}

                {/* 3. Endoplasmic Reticulum (Surrounding the nucleus) */}
                <path
                  d="M 150,170 Q 135,130 180,120"
                  {...getOrganelleStyle('er', ORGANELLE_INFO.er.color)}
                  fill="none"
                  onClick={(e) => handleOrganelleClick('er', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('er')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('er')}
                />
                <path
                  d="M 250,170 Q 275,200 240,225"
                  {...getOrganelleStyle('er', ORGANELLE_INFO.er.color)}
                  fill="none"
                  onClick={(e) => handleOrganelleClick('er', e)}
                  onMouseEnter={() => !isGameMode && setHoveredOrganelle('er')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  strokeWidth={getStrokeWidth('er')}
                />

                {/* 4. Small Vacuoles */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('vacuole', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('vacuole')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <circle cx="100" cy="100" r="10" {...getOrganelleStyle('vacuole', ORGANELLE_INFO.vacuole.color)} strokeWidth={getStrokeWidth('vacuole')} />
                  <circle cx="300" cy="250" r="12" {...getOrganelleStyle('vacuole', ORGANELLE_INFO.vacuole.color)} strokeWidth={getStrokeWidth('vacuole')} />
                  <circle cx="280" cy="90" r="8" {...getOrganelleStyle('vacuole', ORGANELLE_INFO.vacuole.color)} strokeWidth={getStrokeWidth('vacuole')} />
                </g>

                {/* 5. Mitochondria */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('mitochondria', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('mitochondria')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="100" cy="220" rx="20" ry="11" transform="rotate(-30 100 220)" {...getOrganelleStyle('mitochondria', ORGANELLE_INFO.mitochondria.color)} strokeWidth={getStrokeWidth('mitochondria')} />
                  {(!isGameMode || placedOrganelles.includes('mitochondria')) && (
                    <path d="M 88,222 Q 96,215 104,222 T 112,222" className="stroke-rose-400/50 fill-none pointer-events-none" />
                  )}
                </g>
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('mitochondria', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('mitochondria')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="320" cy="140" rx="20" ry="11" transform="rotate(40 320 140)" {...getOrganelleStyle('mitochondria', ORGANELLE_INFO.mitochondria.color)} strokeWidth={getStrokeWidth('mitochondria')} />
                  {(!isGameMode || placedOrganelles.includes('mitochondria')) && (
                    <path d="M 308,142 Q 316,135 324,142 T 332,142" className="stroke-rose-400/50 fill-none pointer-events-none" />
                  )}
                </g>
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('mitochondria', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('mitochondria')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <ellipse cx="120" cy="280" rx="18" ry="10" transform="rotate(10 120 280)" {...getOrganelleStyle('mitochondria', ORGANELLE_INFO.mitochondria.color)} strokeWidth={getStrokeWidth('mitochondria')} />
                </g>

                {/* 6. Golgi Apparatus */}
                <g className="cursor-pointer" onClick={(e) => handleOrganelleClick('golgi', e)} onMouseEnter={() => !isGameMode && setHoveredOrganelle('golgi')} onMouseLeave={() => setHoveredOrganelle(null)}>
                  <path d="M 210,60 Q 200,80 190,60" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                  <path d="M 215,53 Q 200,80 185,53" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                  <path d="M 220,46 Q 200,80 180,46" {...getOrganelleStyle('golgi', ORGANELLE_INFO.golgi.color)} fill="none" strokeWidth={getStrokeWidth('golgi') * 1.5} />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Panel View Column */}
        <div className="md:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            {!isGameMode ? (
              /* EXPLORER MODE DESCRIPTION PANEL */
              <motion.div
                key={selectedOrganelle}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-6 border-purple-500/20 shadow-md space-y-4 min-h-[340px] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black tracking-widest uppercase rounded">
                    Selected Organelle
                  </span>
                  
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mt-1">
                    {activeInfo.name}
                  </h3>

                  {/* Primary function section */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-slate-350">
                    <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Primary Function
                    </span>
                    <p className="leading-relaxed font-semibold">
                      {activeInfo.function}
                    </p>
                  </div>

                  {/* NCERT diagnostic fact section */}
                  <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-slate-400">
                    <span className="font-black text-[9px] uppercase tracking-wider text-amber-400 block flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> NCERT Key Fact
                    </span>
                    <p className="leading-relaxed font-semibold italic">
                      {activeInfo.fact}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 border border-white/5 rounded-lg flex items-start gap-2.5 mt-4 text-[9px] text-slate-500 font-semibold leading-normal">
                  <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    Hover over or tap other structures in the model diagram to study different organelles.
                  </span>
                </div>
              </motion.div>
            ) : isGameFinished ? (
              /* GAME FINISHED SCREEN */
              <motion.div
                key="finished"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel p-6 border-green-500/20 shadow-md text-center space-y-6 min-h-[340px] flex flex-col justify-center items-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Cell Assembled!</h3>
                  <p className="text-xs text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
                    You placed all organelles accurately on the matrix. Excellent work!
                  </p>
                </div>

                <div className="bg-slate-950 px-6 py-3 border border-white/5 rounded-xl flex gap-6 text-xs font-black">
                  <div>
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Reward</span>
                    <span className="text-green-400 font-mono">+50 XP ✨</span>
                  </div>
                  <div className="w-[1px] bg-white/5" />
                  <div>
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Bonus</span>
                    <span className="text-amber-400 font-mono">+10 Coins 🪙</span>
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Game
                </button>
              </motion.div>
            ) : (
              /* ACTIVE GAME INTERACTIVE PANEL */
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-6 border-white/5 shadow-md space-y-4 min-h-[340px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">
                      Organelles Shelf
                    </span>
                    <span className="text-[9px] font-black text-slate-500 uppercase font-mono">
                      Placed: {placedOrganelles.length}/{expectedOrganelles.length}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Select an organelle below, then click its corresponding dashed outline on the cell structure to snap it into place.
                  </p>

                  {/* Shelf of unplaced organelles */}
                  <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                    {shelfOrganelles.map(org => {
                      const details = ORGANELLE_INFO[org];
                      const isSelected = selectedShelfOrganelle === org;
                      return (
                        <button
                          key={org}
                          onClick={() => setSelectedShelfOrganelle(org)}
                          className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] ${
                            isSelected 
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md ring-2 ring-purple-500/25'
                              : 'bg-slate-950 border-white/5 text-slate-350 hover:bg-slate-900 hover:border-white/10'
                          }`}
                        >
                          <span className="text-lg shrink-0">{details.emoji}</span>
                          <span className="text-[9px] font-black uppercase tracking-tight leading-tight truncate">
                            {details.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer hints */}
                <div className="bg-slate-950 p-3 rounded-lg border border-white/5 text-[9px] text-slate-500 font-semibold leading-normal flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    {selectedShelfOrganelle 
                      ? `Now find the matching slot for the ${ORGANELLE_INFO[selectedShelfOrganelle].name.split(' ')[0]} in the drawing.`
                      : "Click on any organelle above to begin positioning it."
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CellExplorer;
