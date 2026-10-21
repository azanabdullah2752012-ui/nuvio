import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl shadow-sm text-left">
      {/* Plotter Grid */}
      <div className="md:col-span-6 flex flex-col justify-center items-center">
        <span className="text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider mb-4">
          Click grid intersections to plot coordinates
        </span>
        
        <div className="relative w-64 h-64 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
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
                    className={`relative flex items-center justify-center border border-[#e5e1d5]/40 cursor-pointer hover:bg-[#ede9de] transition-colors ${
                      isX ? 'border-b-2 border-[#1b3b2b]' : ''
                    } ${
                      isY ? 'border-r-2 border-[#1b3b2b]' : ''
                    }`}
                  >
                    {cell.x === 0 && cell.y === 0 && (
                      <div className="absolute w-2 h-2 bg-[#1b3b2b] rounded-full z-10" />
                    )}
                    {isSelected && (
                      <motion.div
                        layoutId="immersive-grid-point"
                        className="absolute w-4 h-4 bg-[#1b3b2b] rounded-full border-2 border-white flex items-center justify-center shadow z-20"
                      />
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
        <div className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-3 shadow-sm">
          <span className="block text-[10px] font-mono font-bold text-[#827f76] uppercase tracking-wider">
            Coordinate Metrics
          </span>
          <div className="flex justify-between border-b border-[#e5e1d5] pb-2 text-xs">
            <span className="text-[#52504a]">Selected Point</span>
            <strong className="text-[#1b3b2b] font-mono font-bold text-sm">P({point.x}, {point.y})</strong>
          </div>
          <div className="flex justify-between border-b border-[#e5e1d5] pb-2 text-xs">
            <span className="text-[#52504a]">Quadrant Position</span>
            <strong className="text-[#1a1917] font-serif font-bold">
              {getQuadrant(point.x, point.y)}
            </strong>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#52504a]">Distance from Origin</span>
            <strong className="font-mono text-[#1b3b2b] font-bold">
              d = √({point.x}² + {point.y}²) = {calculateDistance(point.x, point.y)} units
            </strong>
          </div>
        </div>

        <div className="p-4 bg-[#f5f3ec] border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#52504a]">
          <strong className="text-[#1b3b2b] block mb-1 font-mono uppercase text-[10px]">NCERT Standard Checkpoint:</strong>
          Points are plotted relative to the origin (0, 0), which splits the Cartesian plane into 4 quadrants numbered counter-clockwise from quadrant I (+, +).
        </div>
      </div>
    </div>
  );
};

export default CartesianPlotter;
