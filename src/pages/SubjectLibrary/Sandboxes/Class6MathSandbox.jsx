import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Plus, Minus, Check, HelpCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import '../styles.css';

// -------------------------------------------------------------
// 1. PATTERNS SANDBOX
// -------------------------------------------------------------
const PatternsSandbox = () => {
  const [patternType, setPatternType] = useState('triangular'); // 'triangular' | 'square' | 'fibonacci'
  const [n, setN] = useState(4);

  const getFibonacciSequence = (limit) => {
    const seq = [1, 2];
    for (let i = 2; i < limit; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq.slice(0, limit);
  };

  const fibTerms = getFibonacciSequence(7);

  const calculateTerm = () => {
    if (patternType === 'triangular') return (n * (n + 1)) / 2;
    if (patternType === 'square') return n * n;
    return fibTerms[n - 1] || 1;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center min-h-[200px]">
        {patternType === 'triangular' && (
          <div className="flex flex-col gap-1.5 items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-white/5 w-full h-full">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Triangular Dots Arrangement</span>
            <div className="flex flex-col items-center justify-center gap-1.5">
              {Array.from({ length: n }).map((_, rIdx) => (
                <div key={rIdx} className="flex gap-1.5">
                  {Array.from({ length: rIdx + 1 }).map((_, cIdx) => (
                    <motion.div
                      key={cIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3.5 h-3.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {patternType === 'square' && (
          <div className="flex flex-col gap-1.5 items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-white/5 w-full h-full">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Square Grid Arrangement</span>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {Array.from({ length: n * n }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3.5 h-3.5 bg-cyan-400 rounded-[3px] shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                />
              ))}
            </div>
          </div>
        )}

        {patternType === 'fibonacci' && (
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-white/5 w-full h-full space-y-4">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Virahānka-Fibonacci Sequence Blocks</span>
            <div className="flex flex-wrap gap-2 items-end justify-center">
              {fibTerms.slice(0, n).map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${val * 10 + 20}px`, opacity: 1 }}
                  className="w-10 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-lg flex items-center justify-center text-[10px] font-black text-white pb-1"
                >
                  {val}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Sequence Controller</span>
          <div className="flex gap-1.5 p-0.5 bg-slate-950 rounded border border-white/5">
            {['triangular', 'square', 'fibonacci'].map(type => (
              <button
                key={type}
                onClick={() => { setPatternType(type); setN(4); }}
                className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                  patternType === type ? 'bg-purple-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Term Index (n)</span>
              <span className="text-purple-400 font-mono">n = {n}</span>
            </label>
            <input
              type="range" min="1" max="7" value={n}
              onChange={e => setN(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Current Term Value</span>
            <strong className="text-yellow-400 font-mono">Value = {calculateTerm()}</strong>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Pattern Rule:</strong>
          {patternType === 'triangular' && "Triangular numbers sum successive integers: Sum = n(n+1)/2. For n=4, 1+2+3+4 = 10."}
          {patternType === 'square' && "Square numbers sum consecutive odd numbers starting from 1: Sum = n². For n=4, 1+3+5+7 = 16."}
          {patternType === 'fibonacci' && "Each Virahānka-Fibonacci number is the sum of the two preceding numbers: Fn = Fn-1 + Fn-2."}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. LINES AND ANGLES SANDBOX
// -------------------------------------------------------------
const AnglesSandbox = () => {
  const [angle, setAngle] = useState(45);

  const getAngleType = (deg) => {
    if (deg === 0) return "Zero Angle";
    if (deg < 90) return "Acute Angle (< 90°)";
    if (deg === 90) return "Right Angle (90°)";
    if (deg < 180) return "Obtuse Angle (90° - 180°)";
    return "Straight Angle (180°)";
  };

  // Convert polar coordinates to Cartesian for SVG drawing
  const rad = (angle * Math.PI) / 180;
  const targetX = 100 + 75 * Math.cos(rad);
  const targetY = 100 - 75 * Math.sin(rad);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Interactive Protractor</span>
        <div className="w-48 h-48 bg-slate-900 border border-white/5 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Horizontal axis grid line */}
            <line x1="20" y1="100" x2="180" y2="100" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.2" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.2" />

            {/* Protractor half arc */}
            <path d="M 30,100 A 70,70 0 0,1 170,100" fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.4" />

            {/* Base Ray */}
            <line x1="100" y1="100" x2="175" y2="100" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            
            {/* Dynamic Angle Ray */}
            <motion.line
              x1="100" y1="100"
              x2={targetX} y2={targetY}
              stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
            />

            {/* Ray Endpoint labels */}
            <circle cx="100" cy="100" r="4" fill="#facc15" />
            <circle cx="175" cy="100" r="3" fill="#22d3ee" />
            <circle cx={targetX} cy={targetY} r="3" fill="#a855f7" />

            {/* Angle sector highlight */}
            {angle > 0 && (
              <path
                d={`M 130,100 A 30,30 0 0,0 ${100 + 30 * Math.cos(rad)},${100 - 30 * Math.sin(rad)} L 100,100 Z`}
                fill="#a855f7" fillOpacity="0.15"
              />
            )}
          </svg>
          <div className="absolute bottom-2 bg-slate-950/80 px-2 py-0.5 border border-white/5 rounded font-mono text-[9px] text-purple-400">
            θ = {angle}°
          </div>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-4">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Angle Dial</span>
          <div className="space-y-1">
            <input
              type="range" min="0" max="180" value={angle}
              onChange={e => setAngle(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-500 font-mono">
              <span>0°</span>
              <span>90° (Right)</span>
              <span>180° (Straight)</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Classification</span>
              <strong className="text-cyan-400 font-black uppercase text-[10px]">{getAngleType(angle)}</strong>
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Properties:</strong>
          An angle is formed when two rays meet at a common endpoint (vertex). We divide one full turn into 360 equal parts, called degrees.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. NUMBER PLAY (COLLATZ RUNNER)
// -------------------------------------------------------------
const CollatzSandbox = () => {
  const [startNum, setStartNum] = useState(6);
  const [sequence, setSequence] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);

  const calculateCollatz = (val) => {
    const list = [val];
    let n = val;
    while (n > 1 && list.length < 50) {
      if (n % 2 === 0) {
        n = n / 2;
      } else {
        n = 3 * n + 1;
      }
      list.push(n);
    }
    return list;
  };

  useEffect(() => {
    const seq = calculateCollatz(startNum);
    setSequence(seq);
    setStepIdx(0);
  }, [startNum]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Collatz Step-by-Step Path</span>
        
        <div className="flex flex-wrap gap-2 justify-center max-h-[160px] overflow-y-auto p-3 bg-slate-900/50 border border-white/5 rounded-xl w-full">
          {sequence.map((num, i) => {
            const isFinished = num === 1;
            const isSpecialLoop = num === 4 || num === 2 || num === 1;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-3 py-1.5 border rounded-lg text-xs font-black font-mono transition-colors flex items-center gap-1 ${
                  isFinished 
                    ? 'bg-green-500/25 border-green-500 text-green-400' 
                    : isSpecialLoop 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-slate-950 border-white/5 text-slate-200'
                }`}
              >
                <span>{num}</span>
                {i < sequence.length - 1 && <span className="text-[9px] text-slate-500 ml-1">➔</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Number Selector</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStartNum(prev => Math.max(1, prev - 1))}
              className="p-2 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-purple-400 active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-mono font-black text-xl text-white">
              {startNum}
            </span>
            <button
              onClick={() => setStartNum(prev => Math.min(100, prev + 1))}
              className="p-2 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-purple-400 active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2 text-xs">
            <span className="text-slate-400 font-semibold text-[9px] tracking-wider uppercase">Path length</span>
            <strong className="text-yellow-400 font-mono">{sequence.length} steps</strong>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Collatz Rule:</strong>
          If number is even, divide by 2. If odd, multiply by 3 and add 1. No matter what starting number you pick, it always gets pulled into the 4-2-1 loop!
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. DATA HANDLING (BAR GRAPH & TALLY MARKS)
// -------------------------------------------------------------
const DataHandlingSandbox = () => {
  const [data, setData] = useState({
    Apples: 5,
    Bananas: 3,
    Oranges: 2
  });

  const increment = (key) => {
    setData(prev => ({ ...prev, [key]: Math.min(10, prev[key] + 1) }));
  };

  const decrement = (key) => {
    setData(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
  };

  // Helper to render tallies as strings
  const getTallyString = (count) => {
    if (count === 0) return "—";
    let output = "";
    const bundles = Math.floor(count / 5);
    const remainder = count % 5;

    for (let i = 0; i < bundles; i++) {
      output += "||||\\   ";
    }
    for (let i = 0; i < remainder; i++) {
      output += "|";
    }
    return output;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Dynamic Visual Graph</span>
        
        <div className="w-full space-y-3.5 p-4 bg-slate-900/50 border border-white/5 rounded-xl">
          {Object.entries(data).map(([key, count]) => (
            <div key={key} className="space-y-1 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{key}</span>
                <span className="font-mono text-purple-400">{count} units</span>
              </div>
              <div className="h-5 w-full bg-slate-950 border border-white/5 rounded p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${count * 10}%` }}
                  className="h-full bg-purple-500 rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3.5">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Category Tally Console</span>
          
          <div className="space-y-2.5">
            {Object.entries(data).map(([key, count]) => (
              <div key={key} className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5">
                <div className="w-20 font-bold text-slate-350">{key}</div>
                <div className="flex-1 font-mono text-cyan-400 font-black tracking-widest text-center">
                  {getTallyString(count)}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => decrement(key)}
                    className="p-1 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-slate-400"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => increment(key)}
                    className="p-1 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-slate-400"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Tally System:</strong>
          Tally marks group counting in bundles of 5. The fifth line crosses the first 4, making it easy to skip-count arrays of raw statistics.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. PRIME TIME (FACTOR TREE & CHECKER)
// -------------------------------------------------------------
const PrimeTimeSandbox = () => {
  const [num, setNum] = useState(12);

  const getFactors = (val) => {
    const list = [];
    for (let i = 1; i <= val; i++) {
      if (val % i === 0) list.push(i);
    }
    return list;
  };

  const getPrimeFactorization = (val) => {
    let temp = val;
    const factors = [];
    let divisor = 2;
    while (temp >= 2) {
      if (temp % divisor === 0) {
        factors.push(divisor);
        temp = temp / divisor;
      } else {
        divisor++;
      }
    }
    return factors.length > 0 ? factors : [val];
  };

  const factorsList = getFactors(num);
  const isPrime = factorsList.length === 2;
  const primeFactorization = getPrimeFactorization(num);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Number properties Diagnostics</span>
        
        <div className="w-full p-4 bg-slate-900/50 border border-white/5 rounded-xl space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
            <span className="text-slate-400 font-semibold">Classification:</span>
            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              isPrime 
                ? 'bg-green-500/15 border border-green-500/30 text-green-400' 
                : 'bg-purple-500/15 border border-purple-500/30 text-purple-400'
            }`}>
              {isPrime ? 'PRIME NUMBER' : 'COMPOSITE NUMBER'}
            </span>
          </div>

          <div className="space-y-1 text-left text-xs">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">All Factors list</span>
            <div className="flex flex-wrap gap-1.5">
              {factorsList.map(f => (
                <span key={f} className="px-2 py-1 bg-slate-950 border border-white/5 text-yellow-400 font-mono rounded text-[11px] font-black">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-left text-xs pt-1 border-t border-white/5">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Prime Factorization</span>
            <div className="p-2.5 bg-slate-950 border border-white/5 rounded text-cyan-400 font-mono font-black text-[13px] text-center">
              {num} = {primeFactorization.join(' × ')}
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Number Selector</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNum(prev => Math.max(2, prev - 1))}
              className="p-2 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-purple-400 active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-mono font-black text-xl text-white">
              {num}
            </span>
            <button
              onClick={() => setNum(prev => Math.min(100, prev + 1))}
              className="p-2 bg-slate-950 border border-white/10 rounded hover:bg-slate-800 text-purple-400 active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <input
              type="range" min="2" max="100" value={num}
              onChange={e => setNum(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Prime vs. Composite:</strong>
          Prime numbers (like 2, 3, 5, 7) have only 2 factors: 1 and themselves. Composite numbers have more. All numbers can be written as products of primes!
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. PERIMETER AND AREA SANDBOX
// -------------------------------------------------------------
const PerimeterAreaSandbox = () => {
  const [w, setW] = useState(5);
  const [h, setH] = useState(4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Rectangle Grid Overlay</span>
        
        <div className="w-40 h-40 bg-slate-900 border border-white/5 rounded flex items-center justify-center p-2 relative shadow-inner">
          <div className="grid grid-cols-10 grid-rows-10 gap-0.5 w-full h-full">
            {(() => {
              const cells = [];
              for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                  cells.push({ x, y });
                }
              }
              return cells.map((cell, idx) => {
                const isInside = cell.x < w && cell.y < h;
                const isBorder = isInside && (cell.x === 0 || cell.y === 0 || cell.x === w - 1 || cell.y === h - 1);
                
                let bgClass = "bg-slate-950/40 border border-white/2";
                if (isBorder) {
                  bgClass = "bg-purple-500 border border-purple-400 shadow-[0_0_4px_rgba(168,85,247,0.3)]";
                } else if (isInside) {
                  bgClass = "bg-purple-950/80 border border-purple-800/30";
                }
                
                return (
                  <div
                    key={idx}
                    className={`rounded-[1.5px] transition-colors ${bgClass}`}
                  />
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Dimension Controls</span>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between">
                <span>Width (l)</span>
                <span className="font-mono text-purple-400">{w} m</span>
              </label>
              <input
                type="range" min="1" max="10" value={w}
                onChange={e => setW(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between">
                <span>Height (w)</span>
                <span className="font-mono text-purple-400">{h} m</span>
              </label>
              <input
                type="range" min="1" max="10" value={h}
                onChange={e => setH(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-2 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Perimeter (Boundary)</span>
              <strong className="text-cyan-400 font-mono">2 × ({w} + {h}) = {2 * (w + h)} m</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Area (Enclosed Space)</span>
              <strong className="text-yellow-400 font-mono">{w} × {h} = {w * h} sq m</strong>
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Measurement Rule:</strong>
          Perimeter measures the boundary fence length (1D). Area measures the total grid square boxes enclosed on the inside (2D).
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. FRACTIONS SANDBOX
// -------------------------------------------------------------
const FractionsSandbox = () => {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(8);

  const handleDenChange = (val) => {
    setDen(val);
    if (num > val) setNum(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Fraction Shading Strip</span>
        
        <div className="w-full h-16 bg-slate-900 border border-white/5 rounded-xl overflow-hidden flex shadow-inner p-1 relative">
          <div className="flex w-full h-full gap-1">
            {Array.from({ length: den }).map((_, idx) => {
              const isShaded = idx < num;
              return (
                <motion.div
                  key={idx}
                  className={`flex-1 rounded-md transition-colors ${
                    isShaded 
                      ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
                      : 'bg-slate-950 border border-white/5'
                  }`}
                  animate={isShaded ? { scale: [0.95, 1] } : {}}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-3.5 bg-slate-950 px-4 py-1.5 border border-white/5 rounded font-mono text-xs text-yellow-400 font-black">
          {num} / {den} = {((num / den) * 100).toFixed(0)}% Shaded
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Fraction Builder</span>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between">
                <span>Numerator (Parts Taken)</span>
                <span className="font-mono text-purple-400">{num}</span>
              </label>
              <input
                type="range" min="1" max={den} value={num}
                onChange={e => setNum(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between">
                <span>Denominator (Total Parts)</span>
                <span className="font-mono text-purple-400">{den}</span>
              </label>
              <input
                type="range" min="1" max="8" value={den}
                onChange={e => handleDenChange(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-2 text-xs">
            <span className="text-slate-400 font-semibold text-[9px] tracking-wider uppercase">Decimal Value</span>
            <strong className="text-cyan-400 font-mono">{(num / den).toFixed(3)}</strong>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Fractions:</strong>
          A fraction represents divisions of a whole. Denominator is the total equal partitions, Numerator counts the partitions chosen.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. PLAYING WITH CONSTRUCTIONS
// -------------------------------------------------------------
const ConstructionsSandbox = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-6 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Construction Animator</span>
        
        <div className="w-48 h-48 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Base Line AB */}
            <line x1="40" y1="120" x2="160" y2="120" stroke="#4b5563" strokeWidth="2.5" />
            <circle cx="40" cy="120" r="3.5" fill="#facc15" />
            <circle cx="160" cy="120" r="3.5" fill="#facc15" />
            <text x="32" y="132" fill="#9ca3af" fontSize="9" fontWeight="black">A</text>
            <text x="162" y="132" fill="#9ca3af" fontSize="9" fontWeight="black">B</text>

            {/* Step 2: Arc from A */}
            {step >= 2 && (
              <motion.path
                d="M 100,50 A 65,65 0 0,0 100,190"
                fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}

            {/* Step 3: Arc from B */}
            {step >= 3 && (
              <motion.path
                d="M 100,50 A 65,65 0 0,1 100,190"
                fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}

            {/* Intersections */}
            {step >= 3 && (
              <>
                <circle cx="100" cy="62" r="3" fill="#a855f7" />
                <circle cx="100" cy="178" r="3" fill="#a855f7" />
              </>
            )}

            {/* Step 4: Perpendicular Bisector line */}
            {step >= 4 && (
              <motion.line
                x1="100" y1="40" x2="100" y2="180"
                stroke="#a855f7" strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            )}
          </svg>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-4">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Construction Steps</span>
          
          <div className="space-y-1.5 text-[11px] text-slate-300 font-bold">
            <div className={`p-2 rounded flex items-center justify-between ${step === 1 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'opacity-50'}`}>
              <span>1. Draw Base Segment AB</span>
              {step > 1 && <Check className="w-3.5 h-3.5 text-green-400" />}
            </div>
            <div className={`p-2 rounded flex items-center justify-between ${step === 2 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'opacity-50'}`}>
              <span>2. Sweep Arc from Point A (R &gt; half)</span>
              {step > 2 && <Check className="w-3.5 h-3.5 text-green-400" />}
            </div>
            <div className={`p-2 rounded flex items-center justify-between ${step === 3 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'opacity-50'}`}>
              <span>3. Sweep identical Arc from B</span>
              {step > 3 && <Check className="w-3.5 h-3.5 text-green-400" />}
            </div>
            <div className={`p-2 rounded flex items-center justify-between ${step === 4 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'opacity-50'}`}>
              <span>4. Draw line through Intersections</span>
              {step > 4 && <Check className="w-3.5 h-3.5 text-green-400" />}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="flex-1 py-2 bg-slate-950 border border-white/5 hover:bg-slate-800 text-slate-400 rounded text-[9px] font-black uppercase tracking-widest disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step < 4) {
                  setStep(prev => prev + 1);
                } else {
                  setStep(1);
                }
              }}
              className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-black rounded text-[9px] font-black uppercase tracking-widest"
            >
              {step === 4 ? 'Reset' : 'Next Step'}
            </button>
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Constructions:</strong>
          A perpendicular bisector splits a segment exactly in half at 90 degrees. Compasses preserve radial distances to locate bisect points.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. SYMMETRY (MIRROR REFLECTION GRID)
// -------------------------------------------------------------
const SymmetrySandbox = () => {
  const [grid, setGrid] = useState(Array(16).fill(false));

  const toggleCell = (idx) => {
    setGrid(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const clearGrid = () => {
    setGrid(Array(16).fill(false));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-8 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">Reflective Symmetry Matrix</span>
        
        <div className="flex gap-3 bg-slate-900/40 p-4 border border-white/5 rounded-2xl items-center shadow-inner">
          {/* Left Grid (User controlled) */}
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 16 }).map((_, idx) => {
              const isActive = grid[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCell(idx)}
                  className={`w-8 h-8 border rounded-md cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-purple-500 border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.3)]' 
                      : 'bg-slate-950 border-white/5 hover:border-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Mirror vertical line */}
          <div className="h-28 w-[2px] bg-yellow-400 relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-black text-yellow-400 uppercase tracking-widest">Mirror</span>
          </div>

          {/* Right Grid (Reflected representation) */}
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 16 }).map((_, idx) => {
              // Calculate mirrored cell index
              // Left cell (r, c) mirrors to Right cell (r, 3 - c)
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const mirroredLeftIdx = r * 4 + (3 - c);
              const isActive = grid[mirroredLeftIdx];

              return (
                <div
                  key={idx}
                  className={`w-8 h-8 border-2 border-dashed rounded-md transition-colors ${
                    isActive 
                      ? 'bg-cyan-500/90 border-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.3)]' 
                      : 'bg-slate-950/20 border-white/5'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:col-span-4 flex flex-col justify-between text-left space-y-4">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-4">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Mirror Controls</span>
          <p className="text-[10px] text-slate-400 font-semibold leading-normal">
            Draw dots on the left grid. See how reflection symmetry projects cells to the right side!
          </p>
          <button
            onClick={clearGrid}
            className="w-full py-2.5 bg-slate-950 border border-white/10 hover:bg-slate-800 rounded text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear canvas
          </button>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-0.5">Line Symmetry:</strong>
          An axis line of symmetry divides a shape into two identical halves, behaving exactly like mirror reflections.
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 10. THE OTHER SIDE OF ZERO (NUMBER LINE WALKER)
// -------------------------------------------------------------
const IntegersSandbox = () => {
  const [pos, setPos] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-5 border border-white/10 rounded-xl">
      <div className="md:col-span-12 flex flex-col items-center justify-center p-4 bg-slate-900/50 border border-white/5 rounded-xl">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-6">Interactive 1D Number Line</span>
        
        {/* Horizontal Number Line ticks */}
        <div className="relative w-full flex items-center justify-between px-4 pb-4 select-none">
          <div className="absolute h-0.5 left-4 right-4 bg-slate-700" />
          
          {Array.from({ length: 11 }).map((_, idx) => {
            const val = idx - 5;
            const isZero = val === 0;
            const isPos = val > 0;
            const isCurrent = val === pos;

            return (
              <div key={val} className="flex flex-col items-center relative z-10">
                <div className={`h-3 w-0.5 ${isZero ? 'h-4 bg-yellow-400 w-1' : 'bg-slate-500'}`} />
                <span className={`text-[10px] font-mono font-black mt-2 ${
                  isCurrent 
                    ? 'text-purple-400 scale-125' 
                    : isZero 
                      ? 'text-yellow-400' 
                      : isPos 
                        ? 'text-green-400' 
                        : 'text-rose-400'
                }`}>
                  {val}
                </span>

                {isCurrent && (
                  <motion.div
                    layoutId="number-line-bubble"
                    className="absolute -top-9 w-6 h-6 rounded-full bg-purple-500 border border-white flex items-center justify-center shadow-lg font-black text-[10px] text-black"
                  >
                    🚶
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="p-4 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Walk Controller</span>
          <div className="space-y-1">
            <input
              type="range" min="-5" max="5" value={pos}
              onChange={e => setPos(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-500 font-mono">
              <span className="text-rose-500">-5 Debt</span>
              <span className="text-yellow-400">0 Neutral</span>
              <span className="text-green-500">+5 Fortune</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] leading-relaxed text-slate-400 font-semibold flex flex-col justify-center">
          <div>
            <strong className="text-purple-400 block mb-0.5">Additive Inverse:</strong>
            Integers encompass negative numbers, positive whole numbers, and zero. The opposite of a number is its inverse (e.g. +3 inverse is -3). Adding opposite numbers always results in exactly 0!
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MAIN COMPONENT EXPORTER
// -------------------------------------------------------------
const Class6MathSandbox = ({ chapterTitle, activeConcept }) => {
  const titleLower = chapterTitle.toLowerCase();

  if (titleLower.includes('patterns')) {
    return <PatternsSandbox />;
  }
  if (titleLower.includes('lines and angles') || titleLower.includes('lines & angles')) {
    return <AnglesSandbox />;
  }
  if (titleLower.includes('number play')) {
    return <CollatzSandbox />;
  }
  if (titleLower.includes('data handling')) {
    return <DataHandlingSandbox />;
  }
  if (titleLower.includes('prime time')) {
    return <PrimeTimeSandbox />;
  }
  if (titleLower.includes('perimeter and area') || titleLower.includes('perimeter & area')) {
    return <PerimeterAreaSandbox />;
  }
  if (titleLower.includes('fractions')) {
    return <FractionsSandbox />;
  }
  if (titleLower.includes('constructions')) {
    return <ConstructionsSandbox />;
  }
  if (titleLower.includes('symmetry')) {
    return <SymmetrySandbox />;
  }
  if (titleLower.includes('zero') || titleLower.includes('integers')) {
    return <IntegersSandbox />;
  }

  // Fallback
  return (
    <div className="bg-slate-900 p-6 border border-white/10 rounded-xl text-center text-slate-350">
      <HelpCircle className="w-10 h-10 text-purple-400 mx-auto animate-pulse mb-2" />
      <h5 className="text-xs font-black uppercase text-white mb-2">Interactive Math Visualization</h5>
      <p className="text-[11px]">{activeConcept?.definition || "Select a concept step to begin your visual analysis."}</p>
    </div>
  );
};

export default Class6MathSandbox;
