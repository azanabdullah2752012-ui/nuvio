import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import '../styles.css';

const MotionSimulator = () => {
  const [position, setPosition] = useState(0);
  const [isDriving, setIsDriving] = useState(false);
  const [direction, setDirection] = useState('forward');
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

  const currentDistance = direction === 'forward' 
    ? Math.max(maxDistance, position) 
    : 100 + (100 - position);

  return (
    <div className="bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl space-y-6 text-left shadow-sm">
      <div className="text-center space-y-1">
        <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
          Physics Laboratory
        </span>
        <h4 className="text-lg font-serif font-bold text-[#1a1917]">Motion & Displacement Simulator</h4>
        <p className="text-[#52504a] text-xs">
          Observe how scalar path distance increases continuously while vector displacement resets to 0 m upon round-trip return.
        </p>
      </div>

      {/* Track layout */}
      <div className="relative h-20 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl flex items-center px-8 shadow-inner">
        <div className="absolute left-6 w-6 h-6 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-xs font-mono font-bold text-[#1b3b2b] shadow-sm">A</div>
        <div className="absolute right-6 w-6 h-6 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-xs font-mono font-bold text-[#1b3b2b] shadow-sm">B</div>
        
        {/* Road line */}
        <div className="absolute left-14 right-14 h-1.5 bg-[#ede9de] rounded-full" />

        {/* Marker */}
        <div 
          className="absolute text-xl select-none transition-all duration-75"
          style={{ left: `calc(2rem + ${position}% * 0.78)` }}
        >
          📍
        </div>
      </div>

      {/* Track metrics and controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            disabled={isDriving || position >= 100}
            onClick={() => handleStart('forward')}
            className="px-4 py-2 border border-transparent bg-[#1b3b2b] hover:bg-[#26523c] disabled:opacity-30 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all"
          >
            Travel A ➔ B
          </button>
          <button
            disabled={isDriving || position <= 0}
            onClick={() => handleStart('backward')}
            className="px-4 py-2 border border-[#e5e1d5] bg-white hover:bg-[#fbfbfa] disabled:opacity-30 text-[#1a1917] text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all"
          >
            Return B ➔ A
          </button>
        </div>

        <button
          onClick={handleReset}
          className="p-2 border border-[#e5e1d5] bg-white hover:bg-[#ede9de] text-[#52504a] hover:text-[#1a1917] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Live Readouts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-1">
          <span className="block text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider">
            Total Distance (Scalar)
          </span>
          <div className="text-xl font-mono font-bold text-[#1b3b2b]">
            {currentDistance} m
          </div>
          <span className="text-[10px] text-[#52504a] block">Cumulative path length</span>
        </div>

        <div className="p-4 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-1">
          <span className="block text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider">
            Displacement (Vector)
          </span>
          <div className="text-xl font-mono font-bold text-[#1a1917]">
            {position} m
          </div>
          <span className="text-[10px] text-[#52504a] block">Shortest straight line from origin</span>
        </div>
      </div>

      <div className="p-4 bg-[#f5f3ec] border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#52504a]">
        <strong className="text-[#1b3b2b] block mb-0.5 font-mono uppercase text-[10px]">NCERT Physics Checkpoint:</strong>
        Distance is scalar and never decreases along a path. Displacement is a vector describing the change in position; when returning to the origin, displacement drops to exactly 0 m.
      </div>
    </div>
  );
};

export default MotionSimulator;
