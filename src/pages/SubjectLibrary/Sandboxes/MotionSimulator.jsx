import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Info } from 'lucide-react';
import '../styles.css';

const MotionSimulator = () => {
  const [position, setPosition] = useState(0); // percentage 0 to 100
  const [isDriving, setIsDriving] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' | 'backward'
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
    let interval;
    if (isDriving) {
      interval = setInterval(() => {
        setPosition(prev => {
          if (direction === 'forward') {
            const next = prev + 2;
            if (next >= 100) {
              setIsDriving(false);
              setMaxDistance(100);
              return 100;
            }
            return next;
          } else {
            const next = prev - 2;
            if (next <= 0) {
              setIsDriving(false);
              return 0;
            }
            return next;
          }
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isDriving, direction]);

  const handleStart = (dir) => {
    setDirection(dir);
    setIsDriving(true);
  };

  const handleReset = () => {
    setIsDriving(false);
    setPosition(0);
    setMaxDistance(0);
  };

  // Calculate parameters
  const currentDistance = direction === 'forward' 
    ? Math.max(maxDistance, position) 
    : 100 + (100 - position);

  return (
    <div className="bg-slate-950 p-6 border border-white/10 rounded-xl space-y-6 text-left shadow-lg">
      <div className="text-center space-y-1">
        <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
          Syllabus Laboratory
        </span>
        <h4 className="text-sm font-black uppercase text-white">Motion Vector Simulator</h4>
        <p className="text-slate-400 text-[10px] font-semibold">
          Observe how odometer distance grows while net displacement drops back to 0m.
        </p>
      </div>

      {/* Track layout */}
      <div className="relative h-16 bg-slate-900 border border-white/10 rounded-lg flex items-center px-6 shadow-inner">
        <div className="absolute left-6 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[8px] font-black text-blue-400 shadow">A</div>
        <div className="absolute right-6 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[8px] font-black text-red-400 shadow">B</div>
        
        {/* Road line */}
        <div className="absolute left-12 right-12 h-1 bg-white/10 rounded" />

        {/* Animated vehicle emoji */}
        <div 
          className="absolute text-2xl select-none transition-all duration-75"
          style={{ left: `calc(1.5rem + ${position}% * 0.85)` }}
        >
          🚀
        </div>
      </div>

      {/* Track metrics and controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            disabled={isDriving || position >= 100}
            onClick={() => handleStart('forward')}
            className="px-4 py-2 border border-transparent bg-green-500 hover:bg-green-600 disabled:opacity-30 text-black text-[9px] font-black uppercase tracking-wider rounded shadow active:scale-95 transition-all"
          >
            Launch to B ➔
          </button>
          <button
            disabled={isDriving || position <= 0}
            onClick={() => handleStart('backward')}
            className="px-4 py-2 border border-transparent bg-blue-500 hover:bg-blue-600 disabled:opacity-30 text-black text-[9px] font-black uppercase tracking-wider rounded shadow active:scale-95 transition-all"
          >
            ➔ Return to A
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-white/10 bg-slate-800 text-slate-350 text-[9px] font-black uppercase tracking-wider rounded shadow hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
          </button>
        </div>

        {/* Telemetry Output */}
        <div className="flex gap-4 bg-slate-900 px-4 py-2 border border-white/15 rounded text-[11px] font-semibold">
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[7px] block">Odometer Distance</span>
            <strong className="text-green-400 font-mono">{currentDistance}m</strong>
          </div>
          <div className="h-6 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase tracking-widest text-[7px] block">Displacement Vector</span>
            <strong className="text-cyan-400 font-mono">{position}m East</strong>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-slate-400 font-semibold flex gap-2">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p>
          Distance measures the actual path lengths you travelled. Displacement is a vector quantity that only cares about the shortest path from the start point to the end point.
        </p>
      </div>
    </div>
  );
};

export default MotionSimulator;
