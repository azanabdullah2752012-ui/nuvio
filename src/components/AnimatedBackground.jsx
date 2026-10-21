import React from 'react';

/**
 * AnimatedBackground
 * Warm Editorial Academic Parchment Plate
 * 
 * Provides:
 *  - Warm parchment base (#fbfbfa)
 *  - Soft desk lamp illumination (warm amber/ivory falloff)
 *  - Subtle paper rule grid lines
 *  - Tactile paper grain texture
 */
const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ backgroundColor: '#fbfbfa' }}
    >
      {/* 1. Soft Warm Ambient Glow (Desk Lamp Ambient) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '65vw',
          height: '65vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 150, 70, 0.04) 0%, rgba(27, 59, 43, 0.02) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(27, 59, 43, 0.025) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* 2. Delicate Paper Rule Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(26, 25, 23, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 25, 23, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 50% 20%, black 50%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 20%, black 50%, transparent 95%)',
        }}
      />

      {/* 3. Tactile Paper Fiber Micro-Texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-multiply pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="paperFiber">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperFiber)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;