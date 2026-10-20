import React, { useRef, useEffect } from 'react';

/**
 * SignatureStudyNexus
 * BraveBrand & Hassan Protocol: Signature Focal Artifact
 * 
 * An interactive, code-driven mathematical orrery representing the Acadevance Knowledge Core:
 * - Multi-axis gyroscopic orbital rings with trigonometric physics
 * - 5 dynamic discipline satellites (Math, Physics, Biology, History, Chemistry)
 * - Real-time particle field with depth perspective
 * - Cursor-reactive gravitational parallax
 * - Mathematical easing & 60fps requestAnimationFrame loop with reduced-motion fallback
 */
const SignatureStudyNexus = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      width = rect ? rect.width : 500;
      height = rect ? rect.height : 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for reactive tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = nx * 0.4;
      targetTiltY = ny * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Knowledge Satellites
    const nodes = [
      { name: 'CALCULUS', color: '#06b6d4', radius: 140, speed: 0.008, phase: 0, ring: 0 },
      { name: 'MECHANICS', color: '#a855f7', radius: 175, speed: -0.006, phase: 1.2, ring: 1 },
      { name: 'GENETICS', color: '#10b981', radius: 210, speed: 0.005, phase: 2.5, ring: 2 },
      { name: 'CIVILIZATION', color: '#f59e0b', radius: 245, speed: -0.004, phase: 3.8, ring: 3 },
      { name: 'ATOMS', color: '#f43f5e', radius: 120, speed: 0.011, phase: 4.6, ring: 0 },
    ];

    // Background particle dust
    const particles = Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 450,
      z: Math.random() * 200 - 100,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      speed: (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1)
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Eased tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      if (!prefersReducedMotion) {
        time += 0.015;
      }

      // Draw faint background particles with 3D projection
      particles.forEach((p) => {
        if (!prefersReducedMotion) p.y += p.speed;
        if (p.y > 225) p.y = -225;
        if (p.y < -225) p.y = 225;

        const scale = 250 / (250 + p.z);
        const px = cx + (p.x + currentTiltX * 40) * scale;
        const py = cy + (p.y + currentTiltY * 40) * scale;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha * 0.4})`;
        ctx.fill();
      });

      // Orbital Rings (Gyroscopic 3D ellipses)
      const rings = [
        { rx: 120, ry: 48, rot: time * 0.2 + currentTiltX, color: 'rgba(6, 182, 212, 0.25)' },
        { rx: 160, ry: 64, rot: -time * 0.15 + currentTiltY, color: 'rgba(168, 85, 247, 0.22)' },
        { rx: 200, ry: 78, rot: time * 0.12 - currentTiltX * 0.5, color: 'rgba(59, 130, 246, 0.18)' },
        { rx: 235, ry: 92, rot: -time * 0.09 + currentTiltY * 0.5, color: 'rgba(236, 72, 153, 0.15)' },
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // Central Core: Pulsing Multilayer Knowledge Nexus
      const corePulse = Math.sin(time * 2) * 3;
      const coreRadius = 24 + corePulse;

      // Outer Core Corona
      const coronaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, coreRadius * 2.8);
      coronaGrad.addColorStop(0, 'rgba(124, 58, 237, 0.45)');
      coronaGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = coronaGrad;
      ctx.fill();

      // Core Solid Sphere
      const coreGrad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, coreRadius);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#d8b4fe');
      coreGrad.addColorStop(0.7, '#7c3aed');
      coreGrad.addColorStop(1, '#0c0a1a');
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Orbiting Nodes with Vector Trails
      nodes.forEach((node, i) => {
        const ring = rings[node.ring];
        const angle = time * node.speed * 60 + node.phase;
        
        // Projected point on 3D ellipse
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const baseRx = ring.rx;
        const baseRy = ring.ry;
        
        // Rotate projected coordinates by ring orientation
        const rot = ring.rot;
        const rawX = cosA * baseRx;
        const rawY = sinA * baseRy;
        const x = cx + (rawX * Math.cos(rot) - rawY * Math.sin(rot));
        const y = cy + (rawX * Math.sin(rot) + rawY * Math.cos(rot));

        // Connect beam to core if nearby
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Node Glow
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner white pip
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Node Label with micro technical badge
        ctx.font = '800 9px "Lexend", system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.letterSpacing = '0.12em';
        ctx.fillText(node.name, x + 12, y + 3);
      });

      // Technical HUD Crosshairs & Telemetry Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy);
      ctx.lineTo(cx + 260, cy);
      ctx.moveTo(cx, cy - 260);
      ctx.lineTo(cx, cy + 260);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] flex items-center justify-center select-none"
    >
      {/* Subtle directional highlight anchor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 65%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full cursor-crosshair"
      />
      
      {/* Tactical Telemetry Badge at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-nuvio-cyan animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-text-secondary">
          Autonomous Knowledge Orrery v2.0
        </span>
      </div>
    </div>
  );
};

export default SignatureStudyNexus;
