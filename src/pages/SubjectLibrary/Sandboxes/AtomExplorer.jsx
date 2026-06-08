import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Layers, Shield } from 'lucide-react';

const ELEMENTS = [
  { z: 1, symbol: "H", name: "Hydrogen", mass: 1, config: [1], valency: 1 },
  { z: 2, symbol: "He", name: "Helium", mass: 4, config: [2], valency: 0 },
  { z: 3, symbol: "Li", name: "Lithium", mass: 7, config: [2, 1], valency: 1 },
  { z: 4, symbol: "Be", name: "Beryllium", mass: 9, config: [2, 2], valency: 2 },
  { z: 5, symbol: "B", name: "Boron", mass: 11, config: [2, 3], valency: 3 },
  { z: 6, symbol: "C", name: "Carbon", mass: 12, config: [2, 4], valency: 4 },
  { z: 7, symbol: "N", name: "Nitrogen", mass: 14, config: [2, 5], valency: 3 },
  { z: 8, symbol: "O", name: "Oxygen", mass: 16, config: [2, 6], valency: 2 },
  { z: 9, symbol: "F", name: "Fluorine", mass: 19, config: [2, 7], valency: 1 },
  { z: 10, symbol: "Ne", name: "Neon", mass: 20, config: [2, 8], valency: 0 },
  { z: 11, symbol: "Na", name: "Sodium", mass: 23, config: [2, 8, 1], valency: 1 },
  { z: 12, symbol: "Mg", name: "Magnesium", mass: 24, config: [2, 8, 2], valency: 2 },
  { z: 13, symbol: "Al", name: "Aluminum", mass: 27, config: [2, 8, 3], valency: 3 },
  { z: 14, symbol: "Si", name: "Silicon", mass: 28, config: [2, 8, 4], valency: 4 },
  { z: 15, symbol: "P", name: "Phosphorus", mass: 31, config: [2, 8, 5], valency: 3 },
  { z: 16, symbol: "S", name: "Sulfur", mass: 32, config: [2, 8, 6], valency: 2 },
  { z: 17, symbol: "Cl", name: "Chlorine", mass: 35.5, config: [2, 8, 7], valency: 1 },
  { z: 18, symbol: "Ar", name: "Argon", mass: 40, config: [2, 8, 8], valency: 0 },
  { z: 19, symbol: "K", name: "Potassium", mass: 39, config: [2, 8, 8, 1], valency: 1 },
  { z: 20, symbol: "Ca", name: "Calcium", mass: 40, config: [2, 8, 8, 2], valency: 2 }
];

const AtomExplorer = () => {
  const [selectedZ, setSelectedZ] = useState(6); // default Carbon (Z=6)

  const elem = ELEMENTS.find(e => e.z === selectedZ) || ELEMENTS[5];
  const protons = elem.z;
  const neutrons = Math.round(elem.mass - elem.z);
  const electrons = elem.z;

  // Orbit radius values in SVG coordinates
  const ORBIT_RADII = [45, 75, 105, 135]; // K, L, M, N shells

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-6 border border-white/10 rounded-xl shadow-lg text-left">
      
      {/* Dynamic Bohr Orbit SVG Render */}
      <div className="md:col-span-7 flex flex-col items-center justify-center relative bg-slate-900/50 rounded-lg border border-white/5 p-4 min-h-[340px]">
        <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Bohr's Atomic Model Orbit
        </span>

        <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto overflow-visible select-none">
          {/* Concentric Shells (K, L, M, N) */}
          {elem.config.map((_, idx) => (
            <circle
              key={idx}
              cx="160"
              cy="160"
              r={ORBIT_RADII[idx]}
              className="fill-none stroke-white/10 stroke-dashed"
              strokeDasharray="4 4"
            />
          ))}

          {/* Central Nucleus (Protons + Neutrons bundle) */}
          <circle cx="160" cy="160" r="22" className="fill-purple-900/80 stroke-purple-500 stroke-2 shadow-lg" />
          <text x="160" y="157" textAnchor="middle" className="text-[7px] fill-cyan-400 font-black font-mono leading-none">
            {protons}P
          </text>
          <text x="160" y="167" textAnchor="middle" className="text-[7px] fill-amber-400 font-black font-mono leading-none">
            {neutrons}N
          </text>

          {/* Orbit Electrons */}
          {elem.config.map((count, shellIdx) => {
            const radius = ORBIT_RADII[shellIdx];
            return Array.from({ length: count }).map((_, electronIdx) => {
              // Distribute electrons evenly around the circle
              const angle = (electronIdx * (360 / count)) * (Math.PI / 180);
              const cx = 160 + radius * Math.cos(angle);
              const cy = 160 + radius * Math.sin(angle);

              return (
                <g key={`${shellIdx}-${electronIdx}`}>
                  {/* Electron Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    className="fill-cyan-400 stroke-slate-950 stroke-1 shadow"
                  />
                  {/* Outer glowing ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    className="fill-none stroke-cyan-400/30 stroke-1 animate-pulse"
                  />
                </g>
              );
            });
          })}
        </svg>

        {/* Orbit shell labels in the corner */}
        <div className="absolute bottom-3 left-3 flex gap-2 text-[8px] font-black text-slate-500 uppercase tracking-wider">
          {elem.config.map((count, idx) => {
            const shellNames = ["K", "L", "M", "N"];
            return (
              <span key={idx} className="bg-slate-950 px-2 py-1 border border-white/5 rounded">
                {shellNames[idx]}: <strong className="text-cyan-400 font-mono">{count}e⁻</strong>
              </span>
            );
          })}
        </div>
      </div>

      {/* Control Panel and Periodic Table Metrics */}
      <div className="md:col-span-5 flex flex-col justify-between space-y-4">
        
        {/* Element Selector Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
            Select Chemical Element
          </label>
          <select
            value={selectedZ}
            onChange={(e) => setSelectedZ(parseInt(e.target.value))}
            className="w-full bg-slate-900 border border-white/10 text-xs font-bold text-slate-200 px-3.5 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          >
            {ELEMENTS.map(item => (
              <option key={item.z} value={item.z}>
                Z = {item.z} : {item.name} ({item.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Atom Diagnostics Console */}
        <div className="p-5 bg-slate-900 border border-white/10 rounded-lg space-y-3.5 shadow-md flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Nucleus and Electron Config
            </span>

            {/* Element Name Card */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{elem.name}</h3>
                <span className="text-[9px] text-slate-400 font-semibold font-mono">Atomic Weight: {elem.mass} u</span>
              </div>
              <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center font-black text-lg text-purple-400">
                {elem.symbol}
              </div>
            </div>

            {/* Config lines */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-400 font-semibold">Atomic Number (Z)</span>
                <strong className="text-cyan-400 font-mono">{elem.z}</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-400 font-semibold">Valence Distribution</span>
                <strong className="text-amber-400 font-mono">({elem.config.join(", ")})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Valency Capacity</span>
                <strong className="text-rose-400 font-mono">{elem.valency}</strong>
              </div>
            </div>
          </div>

          {/* Valency Explanation Badge */}
          <div className="bg-slate-950 p-3 rounded border border-white/5 text-[10px] text-slate-450 leading-relaxed font-semibold">
            <strong className="text-purple-400 block uppercase text-[8px] tracking-wide mb-0.5">Valency Checkpoint:</strong>
            {elem.valency === 0 ? (
              <span>Noble gas structure. Outer shell has a stable octet (8e⁻ or 2e⁻ for helium) with <strong>zero combining capacity</strong>.</span>
            ) : (
              <span>Outer shell has {elem.config[elem.config.length - 1]} electron(s). Valency is <strong>{elem.valency}</strong> (combines by {elem.config[elem.config.length - 1] <= 4 ? "losing" : "gaining"} {elem.valency} electrons to complete octet).</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AtomExplorer;
