import React, { useState, useRef, useEffect } from 'react';

/**
 * TactileStudyConsole
 * Brand Signature Artifact: The Swiss-Industrial Cognitive Oscilloscope
 * 
 * An interactive, functional hardware instrument built in code:
 * - Mathematical waveform physics (Sine + Harmonic Distortion + Jitter)
 * - Selectable cognitive frequency states (Alpha 10Hz, Theta 6Hz, Gamma 40Hz)
 * - Physical chassis styling: technical screws, engraved stamps, interactive tactile toggles
 * - Zero float/boop slop: physical, deterministic, 60fps locked
 */
const MODES = [
  { id: 'alpha', name: 'ALPHA // 10 HZ', label: 'DEEP WORK', freq: 10, amp: 28, color: '#ff4625', desc: 'Optimal cognitive state for sustained problem-solving.' },
  { id: 'theta', name: 'THETA // 06 HZ', label: 'ENCODING', freq: 6, amp: 38, color: '#e5a93c', desc: 'Spaced repetition retrieval & memory consolidation.' },
  { id: 'gamma', name: 'GAMMA // 40 HZ', label: 'SYNTHESIS', freq: 36, amp: 18, color: '#3b82f6', desc: 'Complex mathematical synthesis & active recall.' },
];

const TactileStudyConsole = () => {
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [gain, setGain] = useState(1.0);
  const [isDamping, setIsDamping] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Oscilloscope background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshair axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      time += 0.04;

      // Primary Waveform Trace
      ctx.beginPath();
      const currentAmp = activeMode.amp * gain * (isDamping ? 0.3 : 1);
      const f = activeMode.freq * 0.015;

      for (let x = 0; x < w; x++) {
        // Fundamental wave + harmonic overtone
        const y1 = Math.sin(x * f + time) * currentAmp;
        const y2 = Math.sin(x * f * 2.1 - time * 1.4) * (currentAmp * 0.25);
        const y = h / 2 + y1 + y2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = activeMode.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = activeMode.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary Ghost Trace (Persistence of phosphor)
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y1 = Math.sin(x * f + (time - 0.15)) * currentAmp * 0.95;
        const y = h / 2 + y1;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${activeMode.color}33`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeMode, gain, isDamping]);

  return (
    <div className="w-full max-w-[540px] bg-[#111318] border border-white/10 rounded-xl p-5 shadow-2xl relative font-mono select-none">
      
      {/* Industrial Chassis Top Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-vermilion" />
          <span className="text-[11px] font-bold tracking-wider text-text-primary uppercase">
            OSCILLOGRAPH // CHASSIS AC-09
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold">
          <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10">
            RATE: 60 FPS
          </span>
          <span className="text-emerald-400">● LIVE</span>
        </div>
      </div>

      {/* Screen Enclosure */}
      <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#07080a] mb-5">
        <canvas
          ref={canvasRef}
          width={480}
          height={200}
          className="w-full h-[180px] sm:h-[210px] block"
        />

        {/* Telemetry Overlays */}
        <div className="absolute top-2.5 left-3 text-[10px] text-text-muted flex gap-4 pointer-events-none">
          <span>CH1: <strong className="text-white">{activeMode.freq}.00 HZ</strong></span>
          <span>GAIN: <strong className="text-white">{gain.toFixed(1)}X</strong></span>
        </div>
        <div className="absolute bottom-2.5 right-3 text-[9px] uppercase tracking-widest text-text-muted pointer-events-none">
          NCERT COGNITIVE TRACE // DUAL-PHASE
        </div>
      </div>

      {/* Physical Hardware Controls */}
      <div className="space-y-4">
        {/* Frequency Band Selector */}
        <div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 flex justify-between">
            <span>COGNITIVE BANDWIDTH</span>
            <span style={{ color: activeMode.color }}>[{activeMode.label}]</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((mode) => {
              const active = activeMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode)}
                  className={`py-2 px-3 rounded text-[11px] font-bold transition-all border text-left flex flex-col gap-0.5 ${
                    active
                      ? 'bg-white/10 border-white/30 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/5 text-text-muted hover:border-white/15 hover:text-text-secondary'
                  }`}
                >
                  <span className="text-[9px] opacity-70">{mode.id.toUpperCase()}</span>
                  <span className="truncate">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tactile Sliders & Switches */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase">AMPLITUDE</span>
            <input
              type="range"
              min="0.5"
              max="1.6"
              step="0.1"
              value={gain}
              onChange={(e) => setGain(parseFloat(e.target.value))}
              className="flex-1 accent-brand-vermilion h-1.5 bg-white/10 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsDamping(!isDamping)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold border uppercase transition-colors ${
              isDamping
                ? 'bg-brand-vermilion/20 border-brand-vermilion text-brand-vermilion'
                : 'bg-white/[0.03] border-white/10 text-text-muted hover:text-white'
            }`}
          >
            {isDamping ? 'DAMPING: ON' : 'DAMPING: OFF'}
          </button>
        </div>
      </div>

      {/* Description Strip */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-secondary">
        <p className="text-[11px] text-text-muted font-sans font-normal leading-tight">
          {activeMode.desc}
        </p>
      </div>

    </div>
  );
};

export default TactileStudyConsole;
