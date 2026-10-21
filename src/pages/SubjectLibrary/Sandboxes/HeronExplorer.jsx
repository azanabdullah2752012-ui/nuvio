import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass } from 'lucide-react';

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

  const drawTriangle = () => {
    if (!isValid) return null;

    const scale = 12;
    const originX = 60;
    const originY = 220;

    const p1x = originX;
    const p1y = originY;

    const p2x = originX + a * scale;
    const p2y = originY;

    const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

    const p3x = originX + b * scale * Math.cos(angle);
    const p3y = originY - b * scale * Math.sin(angle);

    return `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl shadow-sm text-left">
      
      {/* Visual Triangle SVG Preview (Left Column) */}
      <div className="md:col-span-6 flex flex-col justify-center items-center relative bg-[#fbfbfa] rounded-xl border border-[#e5e1d5] p-4 min-h-[300px]">
        <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider">
          Geometry Schematic
        </span>

        {isValid ? (
          <svg viewBox="0 0 320 260" className="w-full max-w-[280px] h-auto overflow-visible select-none">
            <circle cx="160" cy="130" r="110" className="stroke-[#e5e1d5] fill-none" />
            <circle cx="160" cy="130" r="60" className="stroke-[#e5e1d5] fill-none" />
            
            <polygon
              points={drawTriangle()}
              className="fill-[#1b3b2b]/10 stroke-[#1b3b2b] stroke-[2.5] transition-all duration-200"
            />
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
                    className="fill-[#1b3b2b] stroke-white stroke-2 shadow"
                  />
                );
              });
            })()}

            <text x="60" y="240" className="text-[10px] fill-[#827f76] font-mono">P1</text>
            <text x={60 + a * 12} y="240" className="text-[10px] fill-[#827f76] font-mono">P2</text>
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#fdf2f2] border border-[#e07d7d] flex items-center justify-center text-[#8e2424] shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-serif font-bold text-[#8e2424]">Inequality Theorem Violation</h5>
              <p className="text-xs text-[#52504a] max-w-[240px] leading-relaxed">
                The sum of any two sides must be strictly greater than the third side (a + b &gt; c). Adjust the sliders to form a valid triangle.
              </p>
            </div>
          </div>
        )}

        {/* Dimension badges */}
        {isValid && (
          <div className="absolute bottom-3 left-3 flex gap-2 text-[10px] font-mono text-[#52504a]">
            <span className="bg-white px-2.5 py-1 border border-[#e5e1d5] rounded-md shadow-sm">Side a: <strong className="text-[#1b3b2b]">{a}</strong></span>
            <span className="bg-white px-2.5 py-1 border border-[#e5e1d5] rounded-md shadow-sm">Side b: <strong className="text-[#1b3b2b]">{b}</strong></span>
            <span className="bg-white px-2.5 py-1 border border-[#e5e1d5] rounded-md shadow-sm">Side c: <strong className="text-[#1b3b2b]">{c}</strong></span>
          </div>
        )}
      </div>

      {/* Slider Controls and Equations console (Right Column) */}
      <div className="md:col-span-6 flex flex-col justify-between space-y-4">
        
        {/* Sliders Container */}
        <div className="space-y-3.5 bg-[#fbfbfa] p-4 border border-[#e5e1d5] rounded-xl">
          <span className="block text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider border-b border-[#e5e1d5] pb-1.5">
            Adjust Dimensions
          </span>

          {/* Slider A */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-[#52504a] font-mono w-14 shrink-0">Side a: {a}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={a}
              onChange={(e) => setA(parseInt(e.target.value))}
              className="flex-1 accent-[#1b3b2b]"
            />
          </div>

          {/* Slider B */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-[#52504a] font-mono w-14 shrink-0">Side b: {b}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={b}
              onChange={(e) => setB(parseInt(e.target.value))}
              className="flex-1 accent-[#1b3b2b]"
            />
          </div>

          {/* Slider C */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-[#52504a] font-mono w-14 shrink-0">Side c: {c}</span>
            <input
              type="range"
              min="2"
              max="20"
              value={c}
              onChange={(e) => setC(parseInt(e.target.value))}
              className="flex-1 accent-[#1b3b2b]"
            />
          </div>
        </div>

        {/* Heron calculations display */}
        <div className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-3 shadow-sm flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider border-b border-[#e5e1d5] pb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Worked Derivation
            </span>

            {isValid ? (
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider block">Step 1: Semi-perimeter (s)</span>
                  <div className="bg-white p-2.5 rounded-lg font-mono text-xs text-[#1a1917] border border-[#e5e1d5]">
                    s = ({a} + {b} + {c}) / 2 = {s} units
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#827f76] uppercase tracking-wider block">Step 2: Heron's Formula</span>
                  <div className="bg-white p-2.5 rounded-lg font-mono text-xs text-[#1a1917] border border-[#e5e1d5] leading-relaxed">
                    A = √[s · (s-a) · (s-b) · (s-c)] <br />
                    A = √[{s} · ({s}-{a}) · ({s}-{b}) · ({s}-{c})] <br />
                    A = √[{s} · {sDiffA} · {sDiffB} · {sDiffC}] <br />
                    A = √[{radicand}] = <strong className="text-[#1b3b2b] font-bold">{area} sq units</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[#827f76] text-xs font-mono uppercase italic py-4 text-center">
                Awaiting valid dimensions input...
              </div>
            )}
          </div>

          <div className="bg-[#f5f3ec] p-3 rounded-xl border border-[#e5e1d5] text-xs text-[#52504a] leading-relaxed">
            <strong className="text-[#1b3b2b] block uppercase text-[10px] font-mono tracking-wider mb-0.5">NCERT Checkpoint:</strong>
            Heron's Formula is used when the perpendicular height is unknown, but all three side lengths of the triangle are specified.
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeronExplorer;
