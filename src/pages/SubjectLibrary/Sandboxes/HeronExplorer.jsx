import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

const HeronExplorer = () => {
  const [a, setA] = useState(6);
  const [b, setB] = useState(8);
  const [c, setC] = useState(10);

  // Validate Triangle Inequality Theorem: a + b > c, a + c > b, b + c > a
  const isValid = (a + b > c) && (a + c > b) && (b + c > a);

  // Math equations
  const s = (a + b + c) / 2;
  const sDiffA = s - a;
  const sDiffB = s - b;
  const sDiffC = s - c;
  const radicand = s * sDiffA * sDiffB * sDiffC;
  const area = radicand > 0 ? Math.sqrt(radicand).toFixed(2) : 0;

  // Calculate coordinates for SVG rendering using the Law of Cosines
  // Vertex 1: (50, 250) (origin of drawing)
  // Vertex 2: (50 + a * scale, 250)
  // Vertex 3: found by angle C using cos(C) = (a^2 + b^2 - c^2) / (2 * a * b)
  const drawTriangle = () => {
    if (!isValid) return null;

    const scale = 12; // multiplier to scale units to pixels
    const originX = 60;
    const originY = 220;

    // We let side 'a' lie along the x-axis
    const p1x = originX;
    const p1y = originY;

    const p2x = originX + a * scale;
    const p2y = originY;

    // Law of cosines to find angle at p1 (between side a and side b)
    // cos(theta) = (a^2 + b^2 - c^2) / (2 * a * b)
    // Wait, let's treat 'a' as bottom side, 'b' as left side, 'c' as right side.
    // So angle is between side a (lying on x-axis) and side b (pointing up).
    // cos(C) = (a^2 + b^2 - c^2) / (2 * a * b)
    const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

    const p3x = originX + b * scale * Math.cos(angle);
    const p3y = originY - b * scale * Math.sin(angle); // negative because y goes down in SVGs

    return `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-6 border border-white/10 rounded-xl shadow-lg text-left">
      
      {/* Visual Triangle SVG Preview (Left Column) */}
      <div className="md:col-span-6 flex flex-col justify-center items-center relative bg-slate-900/50 rounded-lg border border-white/5 p-4 min-h-[300px]">
        <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Interactive Geometry Grid
        </span>

        {isValid ? (
          <svg viewBox="0 0 320 260" className="w-full max-w-[280px] h-auto overflow-visible select-none">
            {/* Grid background markers */}
            <circle cx="160" cy="130" r="110" className="stroke-white/5 fill-none" />
            <circle cx="160" cy="130" r="60" className="stroke-white/5 fill-none" />
            
            {/* The active triangle path */}
            <polygon
              points={drawTriangle()}
              className="fill-purple-500/10 stroke-purple-400 stroke-[3] transition-all duration-200"
            />
            {/* Glowing vertices points */}
            {(() => {
              const pts = drawTriangle();
              if (!pts) return null;
              return pts.split(' ').map((coord, i) => {
                const [cx, cy] = coord.split(',');
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="5"
                    className="fill-purple-500 stroke-white stroke-1.5 shadow z-10"
                  />
                );
              });
            })()}

            {/* Labels overlay */}
            <text x="60" y="240" className="text-[9px] fill-slate-500 font-bold font-mono">P1</text>
            <text x={60 + a * 12} y="240" className="text-[9px] fill-slate-500 font-bold font-mono">P2</text>
          </svg>
        ) : (
          /* Error feedback state */
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-black uppercase text-white tracking-wide">Inequality Violation</h5>
              <p className="text-[10px] text-slate-400 font-semibold max-w-[220px] leading-relaxed">
                The sum of any two sides must be strictly greater than the third side ($a+b &gt; c$). Tweak the sliders to form a valid polygon.
              </p>
            </div>
          </div>
        )}

        {/* Dimension badges */}
        {isValid && (
          <div className="absolute bottom-3 left-3 flex gap-2 text-[8px] font-black text-slate-500 uppercase tracking-wider">
            <span className="bg-slate-950 px-2 py-1 border border-white/5 rounded">Side a: <strong className="text-purple-400 font-mono">{a}</strong></span>
            <span className="bg-slate-950 px-2 py-1 border border-white/5 rounded">Side b: <strong className="text-purple-400 font-mono">{b}</strong></span>
            <span className="bg-slate-950 px-2 py-1 border border-white/5 rounded">Side c: <strong className="text-purple-400 font-mono">{c}</strong></span>
          </div>
        )}
      </div>

      {/* Slider Controls and Equations console (Right Column) */}
      <div className="md:col-span-6 flex flex-col justify-between space-y-4">
        
        {/* Sliders Container */}
        <div className="space-y-3.5 bg-slate-900/60 p-4 border border-white/5 rounded-lg">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1.5">
            Adjust Dimensions
          </span>

          {/* Slider A */}
          <div className="flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-slate-400 w-12 shrink-0">Side a: {a}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={a}
              onChange={(e) => setA(parseInt(e.target.value))}
              className="flex-1 accent-purple-500"
            />
          </div>

          {/* Slider B */}
          <div className="flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-slate-400 w-12 shrink-0">Side b: {b}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={b}
              onChange={(e) => setB(parseInt(e.target.value))}
              className="flex-1 accent-purple-500"
            />
          </div>

          {/* Slider C */}
          <div className="flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-slate-400 w-12 shrink-0">Side c: {c}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={c}
              onChange={(e) => setC(parseInt(e.target.value))}
              className="flex-1 accent-purple-500"
            />
          </div>
        </div>

        {/* Heron calculations display */}
        <div className="p-5 bg-slate-900 border border-white/10 rounded-lg space-y-3 shadow-md flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Worked Calculations
            </span>

            {isValid ? (
              <div className="space-y-2 text-xs">
                {/* Semi-perimeter step */}
                <div className="space-y-1">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">Step 1: Calculate Semi-perimeter (s)</span>
                  <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-green-400 border border-white/5 leading-none">
                    s = ({a} + {b} + {c}) / 2 = {s} units
                  </div>
                </div>

                {/* Heron formula step */}
                <div className="space-y-1">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">Step 2: Apply Heron's Formula</span>
                  <div className="bg-slate-950 p-2 rounded font-mono text-[10px] text-cyan-400 border border-white/5 leading-relaxed">
                    A = √[s * (s-a) * (s-b) * (s-c)] <br />
                    A = √[{s} * ({s}-{a}) * ({s}-{b}) * ({s}-{c})] <br />
                    A = √[{s} * {sDiffA} * {sDiffB} * {sDiffC}] <br />
                    A = √[{radicand}] = <strong className="text-yellow-400 font-bold">{area} sq units</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-xs font-semibold uppercase italic py-4 text-center">
                Awaiting valid dimensions console output...
              </div>
            )}
          </div>

          {/* Diagnostic Note */}
          <div className="bg-slate-950 p-3 rounded border border-white/5 text-[10px] text-slate-450 leading-relaxed font-semibold">
            <strong className="text-purple-400 block uppercase text-[8px] tracking-wide mb-0.5">Syllabus Checkpoint:</strong>
            Heron's Formula is highly useful when we do not know the vertical height ($h$) of a triangle, but all three boundary side lengths are known.
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeronExplorer;
