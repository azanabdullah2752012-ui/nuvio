import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';

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
  const [selectedZ, setSelectedZ] = useState(6);

  const elem = ELEMENTS.find(e => e.z === selectedZ) || ELEMENTS[5];
  const protons = elem.z;
  const neutrons = Math.round(elem.mass - elem.z);

  const ORBIT_RADII = [45, 75, 105, 135];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl shadow-sm text-left">
      
      {/* Dynamic Bohr Orbit SVG Render */}
      <div className="md:col-span-7 flex flex-col items-center justify-center relative bg-[#fbfbfa] rounded-xl border border-[#e5e1d5] p-4 min-h-[340px]">
        <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider">
          Bohr's Atomic Model Orbit
        </span>

        <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto overflow-visible select-none">
          {elem.config.map((_, idx) => (
            <circle
              key={idx}
              cx="160"
              cy="160"
              r={ORBIT_RADII[idx]}
              className="fill-none stroke-[#d8d4c7]"
              strokeDasharray="4 4"
            />
          ))}

          {/* Central Nucleus */}
          <circle cx="160" cy="160" r="22" className="fill-[#f5f3ec] stroke-[#1b3b2b] stroke-2 shadow" />
          <text x="160" y="157" textAnchor="middle" className="text-[9px] fill-[#1b3b2b] font-bold font-mono leading-none">
            {protons}P
          </text>
          <text x="160" y="168" textAnchor="middle" className="text-[9px] fill-[#52504a] font-bold font-mono leading-none">
            {neutrons}N
          </text>

          {/* Orbit Electrons */}
          {elem.config.map((count, shellIdx) => {
            const radius = ORBIT_RADII[shellIdx];
            return Array.from({ length: count }).map((_, electronIdx) => {
              const angle = (electronIdx * (360 / count)) * (Math.PI / 180);
              const cx = 160 + radius * Math.cos(angle);
              const cy = 160 + radius * Math.sin(angle);

              return (
                <circle
                  key={`${shellIdx}-${electronIdx}`}
                  cx={cx}
                  cy={cy}
                  r="5"
                  className="fill-[#1b3b2b] stroke-white stroke-2 shadow"
                />
              );
            });
          })}
        </svg>

        {/* Orbit shell labels in corner */}
        <div className="absolute bottom-3 left-3 flex gap-2 text-[10px] font-mono text-[#52504a]">
          {elem.config.map((count, idx) => {
            const shellNames = ["K", "L", "M", "N"];
            return (
              <span key={idx} className="bg-white px-2.5 py-1 border border-[#e5e1d5] rounded-md shadow-sm">
                {shellNames[idx]}: <strong className="text-[#1b3b2b]">{count}e⁻</strong>
              </span>
            );
          })}
        </div>
      </div>

      {/* Control Panel and Periodic Table Metrics */}
      <div className="md:col-span-5 flex flex-col justify-between space-y-4">
        
        {/* Element Selector Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider block">
            Select Chemical Element
          </label>
          <select
            value={selectedZ}
            onChange={(e) => setSelectedZ(parseInt(e.target.value))}
            className="w-full bg-[#fbfbfa] border border-[#e5e1d5] text-xs font-serif font-bold text-[#1a1917] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#1b3b2b] transition-colors shadow-sm"
          >
            {ELEMENTS.map(item => (
              <option key={item.z} value={item.z}>
                Z = {item.z} : {item.name} ({item.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Atom Diagnostics Console */}
        <div className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-3.5 shadow-sm flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider border-b border-[#e5e1d5] pb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Nucleus & Electron Distribution
            </span>

            {/* Element Name Card */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1a1917]">{elem.name}</h3>
                <span className="text-[10px] text-[#52504a] font-mono">Atomic Weight: {elem.mass} u</span>
              </div>
              <div className="w-11 h-11 bg-white border border-[#e5e1d5] rounded-xl flex items-center justify-center font-serif font-bold text-lg text-[#1b3b2b] shadow-sm">
                {elem.symbol}
              </div>
            </div>

            {/* Config lines */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between border-b border-[#e5e1d5] pb-1.5">
                <span className="text-[#52504a]">Atomic Number (Z)</span>
                <strong className="text-[#1a1917] font-mono font-bold">{elem.z}</strong>
              </div>
              <div className="flex justify-between border-b border-[#e5e1d5] pb-1.5">
                <span className="text-[#52504a]">Shell Distribution</span>
                <strong className="text-[#1b3b2b] font-mono font-bold">({elem.config.join(", ")})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#52504a]">Valency</span>
                <strong className="text-[#1b3b2b] font-mono font-bold">{elem.valency}</strong>
              </div>
            </div>
          </div>

          {/* Valency Explanation Badge */}
          <div className="bg-[#f5f3ec] p-3 rounded-xl border border-[#e5e1d5] text-xs text-[#52504a] leading-relaxed">
            <strong className="text-[#1b3b2b] block uppercase text-[10px] font-mono tracking-wider mb-0.5">Valency Checkpoint:</strong>
            {elem.valency === 0 ? (
              <span>Noble gas structure. The outer shell has a stable octet (8e⁻, or 2e⁻ for helium) with <strong>zero combining capacity</strong>.</span>
            ) : (
              <span>The valence shell holds {elem.config[elem.config.length - 1]} electron(s). Valency is <strong>{elem.valency}</strong> (combines by {elem.config[elem.config.length - 1] <= 4 ? "donating" : "accepting"} {elem.valency} electron(s) to achieve octet stability).</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AtomExplorer;
