import React, { useEffect, useRef } from 'react';

/**
 * AnimatedBackground
 * Renders a layered animated background:
 *  - CSS particle dot field (::before / ::after pseudo-elements via class)
 *  - Three large slow-drifting aurora orbs
 *  - Rotating geometric ring shapes
 *  - Cursor-reactive spotlight (reads CSS vars set by InteractionSystem)
 */
const AnimatedBackground = ({ variant = 'default' }) => {
  const orbConfigs = {
    default: [
      { color: 'rgba(168,85,247,0.12)', fade: 'rgba(168,85,247,0.04)', size: '60vw', top: '-20%', left: '-15%',  dur: '28s', delay: '0s' },
      { color: 'rgba(6,182,212,0.09)',  fade: 'rgba(6,182,212,0.03)',  size: '50vw', bottom: '-18%', right: '-12%', dur: '35s', delay: '-8s' },
      { color: 'rgba(236,72,153,0.07)',  fade: 'rgba(236,72,153,0.02)',  size: '40vw', top: '40%',  left: '30%',  dur: '42s', delay: '-16s' },
    ],
    hero: [
      { color: 'rgba(168,85,247,0.18)', fade: 'rgba(168,85,247,0.06)', size: '70vw', top: '-30%', left: '-20%',  dur: '24s', delay: '0s' },
      { color: 'rgba(6,182,212,0.14)',  fade: 'rgba(6,182,212,0.04)',  size: '55vw', bottom: '-25%', right: '-18%', dur: '32s', delay: '-6s' },
      { color: 'rgba(236,72,153,0.10)',  fade: 'rgba(236,72,153,0.03)',  size: '45vw', top: '35%',  left: '25%',  dur: '38s', delay: '-12s' },
    ],
  };

  const orbs = orbConfigs[variant] || orbConfigs.default;

  return (
    <>
      {/* Particle dot field */}
      <div className="nv-particle-field" aria-hidden="true" />

      {/* Aurora orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'fixed',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, ${orb.fade} 50%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: -1,
            top: orb.top,
            left: orb.left,
            bottom: orb.bottom,
            right: orb.right,
            animation: `float-blob ${orb.dur} infinite alternate ease-in-out`,
            animationDelay: orb.delay,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Rotating geometric rings */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '800px',
          height: '800px',
          marginLeft: '-400px',
          marginTop: '-400px',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.03,
          willChange: 'transform',
        }}
      >
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(168,85,247,0.8)',
          animation: 'aurora-spin 60s linear infinite',
          willChange: 'transform',
        }} />
        {/* Mid ring */}
        <div style={{
          position: 'absolute',
          inset: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(6,182,212,0.8)',
          animation: 'aurora-spin 45s linear infinite reverse',
          willChange: 'transform',
        }} />
        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          inset: '180px',
          borderRadius: '50%',
          border: '1px dashed rgba(236,72,153,0.6)',
          animation: 'aurora-spin 30s linear infinite',
          willChange: 'transform',
        }} />
      </div>

      {/* Floating geometric shapes (top-right corner accent) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '8%',
          right: '6%',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.08,
        }}
      >
        <div style={{
          width: '120px',
          height: '120px',
          border: '1px solid rgba(168,85,247,0.6)',
          transform: 'rotate(45deg)',
          animation: 'float-x 14s ease-in-out infinite',
        }} />
      </div>

      {/* Bottom-left accent triangle */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '12%',
          left: '4%',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.06,
          width: 0,
          height: 0,
          borderLeft: '50px solid transparent',
          borderRight: '50px solid transparent',
          borderBottom: '86px solid rgba(6,182,212,0.8)',
          animation: 'float-x 18s ease-in-out infinite reverse',
          animationDelay: '-5s',
        }}
      />
    </>
  );
};

export default AnimatedBackground;
