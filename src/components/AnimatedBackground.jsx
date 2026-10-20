import React from 'react';

/**
 * AnimatedBackground
 * Hassan Cinematic Scroll & BraveBrand Protocol
 * 
 * Replaces generic floating aurora blobs with:
 *  - Directional top-left light rake (single beam falloff)
 *  - Procedural SVG micro-grain texture overlay (feTurbulence) to kill color banding
 *  - Continuous deep obsidian background plate (#07080b) carried down the entire scroll
 *  - Zero cartoonish pastel blobs or hover bobbing
 */
const AnimatedBackground = ({ variant = 'default' }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ background: '#07080b' }}
    >
      {/* 1. Directional Volumetric Light Rake (Top-Left Rake) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '75vw',
          height: '75vw',
          maxWidth: '1200px',
          maxHeight: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 30% 30%, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.04) 45%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'rotate(-12deg)',
        }}
      />

      {/* 2. Secondary Low-Offset Subsurface Light (Subtle Ambient Falloff) */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-5%',
          width: '45vw',
          height: '45vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* 3. Deep Architectural Matrix (Faint 48px Coordinate Grid) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 20%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 20%, black 40%, transparent 85%)',
        }}
      />

      {/* 4. Procedural SVG Dithered Noise Overlay (feTurbulence) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-screen pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
