import React from 'react';

/**
 * AnimatedBackground
 * Atelier 09 Architectural Plate
 * 
 * Replaces all AI aurora blobs with:
 *  - Architectural coordinate matrix (48px hairlines)
 *  - Directional top-left warm illumination (single falloff angle)
 *  - High-frequency micro-grain SVG texture (feTurbulence)
 *  - Continuous 100% fixed viewport depth across all scroll depths
 */
const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ backgroundColor: '#090a0d' }}
    >
      {/* 1. Directional Warm Illumination (Top-Left Precision Rake) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '70vw',
          height: '70vw',
          maxWidth: '1000px',
          maxHeight: '1000px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 25% 25%, rgba(255, 70, 37, 0.06) 0%, rgba(229, 169, 60, 0.02) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* 2. Architectural Blueprint Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 15%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 15%, black 40%, transparent 90%)',
        }}
      />

      {/* 3. Tactile Micro-Grain Dither Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-screen pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="atelierNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atelierNoise)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
