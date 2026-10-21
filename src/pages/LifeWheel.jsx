import React, { useState, useEffect, useRef } from 'react';
import { Compass, RotateCcw, Save, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationService } from '../services/notificationService';

const DIMENSIONS = [
  { id: 'craft', label: 'Craft & Output', icon: '💼', color: '#1b3b2b', desc: 'High-leverage work, coding, writing, business' },
  { id: 'vitality', label: 'Vitality & Body', icon: '⚡', color: '#8a4b16', desc: 'Sleep, sunlight, compound workouts, clean food' },
  { id: 'mind', label: 'Mind & Clarity', icon: '🧠', color: '#244e6b', desc: 'Reading, stillness, low dopamine, mental health' },
  { id: 'tribe', label: 'Tribe & Connection', icon: '🤝', color: '#68325a', desc: 'Family presence, deep friendships, undistracted time' },
  { id: 'finances', label: 'Financial Freedom', icon: '📈', color: '#2b5e3b', desc: 'Income, savings, low burn rate, peace of mind' },
  { id: 'environment', label: 'Physical Workspace', icon: '🏛️', color: '#544e3b', desc: 'Desk ergonomics, lighting, declutter, sanctuary' },
  { id: 'play', label: 'Play & Recreation', icon: '🎨', color: '#7a3e2b', desc: 'Hobbies, exploration, outdoor nature, non-goal fun' },
  { id: 'purpose', label: 'Purpose & North Star', icon: '🧭', color: '#1b3b2b', desc: 'Clear 3-year vision, core values, meaningful contribution' }
];

const LifeWheel = () => {
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('nuvio_wheel_scores');
      return saved ? JSON.parse(saved) : {
        craft: 8,
        vitality: 5,
        mind: 6,
        tribe: 4,
        finances: 7,
        environment: 8,
        play: 3,
        purpose: 8
      };
    } catch (e) {
      return { craft: 8, vitality: 5, mind: 6, tribe: 4, finances: 7, environment: 8, play: 3, purpose: 8 };
    }
  });

  const canvasRef = useRef(null);

  // Compute Life Balance Quotient (0-100)
  const scoreValues = Object.values(scores);
  const averageScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
  const balanceQuotient = Math.round(averageScore * 10);

  // Find lowest lagging dimension
  const sortedDimensions = [...DIMENSIONS].sort((a, b) => scores[a.id] - scores[b.id]);
  const laggingDimension = sortedDimensions[0];

  const handleScoreChange = (id, val) => {
    const updated = { ...scores, [id]: Number(val) };
    setScores(updated);
    localStorage.setItem('nuvio_wheel_scores', JSON.stringify(updated));
  };

  const handleReset = () => {
    const defaults = { craft: 7, vitality: 7, mind: 7, tribe: 7, finances: 7, environment: 7, play: 7, purpose: 7 };
    setScores(defaults);
    localStorage.setItem('nuvio_wheel_scores', JSON.stringify(defaults));
    notificationService.send("Radar Reset", "All dimensions normalized to 7.", "info");
  };

  // Draw Interactive Spider / Radar Chart on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 36;
    const totalSides = DIMENSIONS.length;
    const angleStep = (Math.PI * 2) / totalSides;

    ctx.clearRect(0, 0, width, height);

    // Draw concentric reference rings (2, 4, 6, 8, 10)
    for (let level = 1; level <= 5; level++) {
      const radius = (maxRadius / 5) * level;
      ctx.beginPath();
      for (let i = 0; i < totalSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === 5 ? 'rgba(26, 25, 23, 0.15)' : 'rgba(26, 25, 23, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw spoke axis lines
    for (let i = 0; i < totalSides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + maxRadius * Math.cos(angle);
      const y = cy + maxRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(26, 25, 23, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw polygon fill for current user scores
    ctx.beginPath();
    DIMENSIONS.forEach((dim, i) => {
      const score = scores[dim.id] || 1;
      const radius = (maxRadius / 10) * score;
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Subtle forest green fill
    ctx.fillStyle = 'rgba(27, 59, 43, 0.12)';
    ctx.fill();
    ctx.strokeStyle = '#1b3b2b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw vertex marker beads
    DIMENSIONS.forEach((dim, i) => {
      const score = scores[dim.id] || 1;
      const radius = (maxRadius / 10) * score;
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#1b3b2b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer label icon
      const labelRadius = maxRadius + 22;
      const lx = cx + labelRadius * Math.cos(angle);
      const ly = cy + labelRadius * Math.sin(angle);
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dim.icon, lx, ly);
    });

  }, [scores]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Paul J. Meyer & Dan Koe // Life Architecture
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Wheel of Life & Energy Radar
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            A linear to-do list hides catastrophic imbalances. Tune your 8 life dimensions to diagnose hidden friction before burnout occurs.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 border border-[#e5e1d5] hover:border-[#1b3b2b] bg-white rounded-xl text-xs font-mono text-[#52504a] flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Normalize</span>
        </button>
      </header>

      {/* ── RADAR VISUALIZATION & DIAGNOSTIC CHASSIS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Radar Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 border border-[#e5e1d5] bg-white rounded-3xl shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-4">
            <div className="text-left">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#827f76] font-bold">
                Dynamic Polygon
              </span>
              <div className="font-serif font-bold text-base text-[#1a1917]">
                Holistic Energy Geometry
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-serif font-bold text-[#1b3b2b]">{balanceQuotient}/100</div>
              <div className="text-[10px] font-mono text-[#827f76] uppercase">Balance Index</div>
            </div>
          </div>

          {/* Canvas Render */}
          <div className="flex justify-center p-2">
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full h-auto"
            />
          </div>

          <div className="text-xs font-mono text-[#827f76]">
            Vertices represent current satisfaction ratings (1 to 10). A symmetrical shape indicates sustainable momentum.
          </div>
        </div>

        {/* Diagnostic Intervention Plate (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Lagging Pillar Diagnosis */}
          <div className="p-6 border-2 border-[#8a4b16]/30 bg-[#faf8f4] rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8a4b16] font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Primary Drag Diagnostic</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{laggingDimension.icon}</span>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  {laggingDimension.label} ({scores[laggingDimension.id]}/10)
                </h3>
                <p className="text-xs text-[#52504a]">
                  This is currently your lowest-scoring dimension and the root source of friction in your life.
                </p>
              </div>
            </div>

            <div className="border-t border-[#d4c39e] pt-3 text-xs text-[#52504a] space-y-1">
              <span className="font-bold font-serif text-[#1a1917]">7-Day Rebalance Prescription:</span>
              <p>
                Do not add more tasks to Craft. Schedule an immediate 2-hour non-negotiable block dedicated strictly to <span className="font-bold text-[#1b3b2b]">{laggingDimension.label}</span> this week.
              </p>
            </div>
          </div>

          {/* Quick Sliders */}
          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-sm space-y-4">
            <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#1b3b2b]">
              Adjust 8 Life Dimensions
            </div>

            <div className="space-y-3.5">
              {DIMENSIONS.map(dim => (
                <div key={dim.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#1a1917]">
                      <span>{dim.icon}</span>
                      <span>{dim.label}</span>
                    </span>
                    <span className="font-mono font-bold text-[#1b3b2b]">{scores[dim.id]}/10</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores[dim.id]}
                    onChange={(e) => handleScoreChange(dim.id, e.target.value)}
                    className="w-full h-1.5 bg-[#f0ece1] rounded-lg appearance-none cursor-pointer accent-[#1b3b2b]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LifeWheel;
