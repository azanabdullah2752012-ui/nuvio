import React, { useState, useRef, useEffect } from 'react';

const MODES = [
  { id: 'ultradian', name: '90M ULTRADIAN BOUT', freq: 10, amp: 26, color: '#1b3b2b', desc: 'Peak biological focus wave for deep creation, problem solving, and writing.' },
  { id: 'flow', name: 'HIGH-LEVERAGE SPRINT', freq: 18, amp: 32, color: '#8a4b16', desc: 'Fast, uninterrupted execution on your primary Daily Highlight.' },
  { id: 'recovery', name: 'NSDR / RESTORATION', freq: 4, amp: 16, color: '#244e6b', desc: 'Downshifting autonomic arousal with panoramic gaze and breathing.' },
];

const TactileStudyConsole = () => {
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [cadence, setCadence] = useState(1.0);
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

      // Fine paper coordinate grid
      ctx.strokeStyle = 'rgba(26, 25, 23, 0.05)';
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

      // Center baseline rule
      ctx.strokeStyle = 'rgba(26, 25, 23, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Render primary waveform in theme color
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = activeMode.color;
      ctx.shadowColor = 'rgba(27, 59, 43, 0.12)';
      ctx.shadowBlur = 6;

      for (let x = 0; x < w; x++) {
        const normalizedX = x / w;
        const wave1 = Math.sin((normalizedX * activeMode.freq * 2 * Math.PI) - (time * 2 * cadence));
        const wave2 = 0.3 * Math.sin((normalizedX * activeMode.freq * 4 * Math.PI) - (time * 3 * cadence));
        const envelope = Math.sin(normalizedX * Math.PI);
        const y = (h / 2) + ((wave1 + wave2) * activeMode.amp * envelope);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Ghosted harmonic resonance
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(138, 75, 22, 0.35)'; // warm brass accent
      ctx.shadowBlur = 0;

      for (let x = 0; x < w; x += 3) {
        const normalizedX = x / w;
        const wave = Math.sin((normalizedX * activeMode.freq * 1.5 * Math.PI) - (time * 1.2 * cadence));
        const y = (h / 2) + (wave * (activeMode.amp * 0.4));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      time += 0.025;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeMode, cadence]);

  return (
    <div className="w-full bg-white border border-[#e5e1d5] rounded-2xl shadow-sm p-6 font-sans text-left relative">
      {/* Console Header Plate */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e5e1d5] mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b2b]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a1917]">
            BIOLOGICAL FOCUS RESONATOR
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#827f76] uppercase px-2 py-0.5 border border-[#e5e1d5] rounded bg-[#fbfbfa]">
          ACTIVE CADENCE
        </span>
      </div>

      {/* Screen Display */}
      <div className="relative border border-[#e5e1d5] rounded-xl overflow-hidden bg-[#fbfbfa] p-2">
        <canvas
          ref={canvasRef}
          width={480}
          height={180}
          className="w-full h-[180px] block"
        />
        <div className="absolute top-4 left-4 font-mono text-[10px] text-[#52504a] uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded border border-[#e5e1d5] backdrop-blur-xs">
          {activeMode.name}
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {MODES.map((m) => {
          const isSelected = activeMode.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#1b3b2b] bg-[#f4f7f4] text-[#1b3b2b] shadow-xs'
                  : 'border-[#e5e1d5] bg-white text-[#52504a] hover:border-[#827f76]'
              }`}
            >
              <div className="font-mono text-[9px] font-bold uppercase text-[#827f76]">{m.id}</div>
              <div className="text-xs font-semibold text-[#1a1917] mt-0.5 font-sans leading-tight">{m.name.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Narrative Status */}
      <p className="text-xs text-[#52504a] font-sans mt-4 leading-relaxed border-t border-[#f0ece1] pt-3">
        {activeMode.desc}
      </p>
    </div>
  );
};

export default TactileStudyConsole;
