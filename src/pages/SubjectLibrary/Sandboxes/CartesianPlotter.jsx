import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';
import '../styles.css';

const CartesianPlotter = () => {
  const [point, setPoint] = useState({ x: 2, y: 3 });

  const getQuadrant = (x, y) => {
    if (x === 0 && y === 0) return "Origin (0, 0)";
    if (x === 0) return "y-axis boundary";
    if (y === 0) return "x-axis boundary";
    if (x > 0 && y > 0) return "Quadrant I (+, +)";
    if (x < 0 && y > 0) return "Quadrant II (-, +)";
    if (x < 0 && y < 0) return "Quadrant III (-, -)";
    return "Quadrant IV (+, -)";
  };

  const calculateDistance = (x, y) => {
    return Math.sqrt(x * x + y * y).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-6 border border-white/10 rounded-xl shadow-lg">
      {/* Plotter Grid */}
      <div className="md:col-span-6 flex flex-col justify-center items-center">
        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-4">
          Click grid lines to plot coordinates
        </span>
        
        <div className="relative w-64 h-64 bg-slate-900 border-2 border-white/10 rounded-md overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 grid grid-cols-11 grid-rows-11">
            {(() => {
              const cells = [];
              for (let y = 5; y >= -5; y--) {
                for (let x = -5; x <= 5; x++) {
                  cells.push({ x, y });
                }
              }
              return cells.map((cell, idx) => {
                const isX = cell.y === 0;
                const isY = cell.x === 0;
                const isSelected = cell.x === point.x && cell.y === point.y;
                return (
                  <div
                    key={idx}
                    onClick={() => setPoint({ x: cell.x, y: cell.y })}
                    className={`relative flex items-center justify-center border border-white/5 cursor-pointer hover:bg-purple-500/20 transition-colors ${
                      isX ? 'border-b border-slate-500' : ''
                    } ${
                      isY ? 'border-r border-slate-500' : ''
                    }`}
                  >
                    {cell.x === 0 && cell.y === 0 && (
                      <div className="absolute w-2.5 h-2.5 bg-yellow-500 rounded-full z-10 shadow" />
                    )}
                    {isSelected && (
                      <motion.div
                        layoutId="immersive-grid-point"
                        className="absolute w-4.5 h-4.5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg z-20"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      </motion.div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Diagnostics Panel */}
      <div className="md:col-span-6 flex flex-col justify-between space-y-4 text-left">
        <div className="p-5 bg-slate-900 border border-white/10 rounded-lg space-y-3 shadow">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Grid Diagnostics Console
          </span>
          <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
            <span className="text-slate-400 font-semibold">Active Coordinates</span>
            <strong className="text-purple-400 font-mono">P({point.x}, {point.y})</strong>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
            <span className="text-slate-400 font-semibold">Location Region</span>
            <strong className="text-yellow-400 font-semibold">
              {getQuadrant(point.x, point.y)}
            </strong>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-semibold">Hypotenuse Distance</span>
            <strong className="font-mono text-green-400">
              d = √({point.x}² + {point.y}²) = {calculateDistance(point.x, point.y)} units
            </strong>
          </div>
        </div>

        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-lg text-xs leading-relaxed text-slate-400 font-semibold">
          <strong className="text-purple-400 block mb-1">💡 CBSE Syllabus Checkpoint:</strong>
          The distance formula is derived directly from the Baudhāyana-Pythagoras Theorem. Points are plotted relative to the origin (0, 0) which splits the plane into 4 distinct quadrants counter-clockwise.
        </div>
      </div>
    </div>
  );
};

export default CartesianPlotter;
