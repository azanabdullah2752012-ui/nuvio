import React, { useState } from 'react';
import { Volume2, Clock } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

const UniversalHeader = () => {
  const [soundMode, setSoundMode] = useState('none');

  const cycleSound = () => {
    if (soundMode === 'none') {
      soundEngine.playRain(0.04);
      setSoundMode('rain');
    } else if (soundMode === 'rain') {
      soundEngine.playBrownNoise(0.05);
      setSoundMode('brown');
    } else {
      soundEngine.stop();
      setSoundMode('none');
    }
  };

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-[#eceae3] bg-[#fbfbfa]/95 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between font-sans">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
        <span className="font-serif font-bold text-base tracking-tight text-[#1d1d1f]">
          KAISER OS
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
          v1.0 • GCIS IX-C
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={cycleSound}
          className={`px-3 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-1.5 ${
            soundMode !== 'none'
              ? 'bg-[#1b3b2b] text-white border-[#1b3b2b] shadow-xs'
              : 'bg-white border-[#e8e6df] text-[#8e8d8a] hover:text-[#1d1d1f]'
          }`}
          title="Toggle ambient background sound"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>
            {soundMode === 'none' ? 'Ambient Sound' : soundMode === 'rain' ? '🌧️ Rain' : '☕ Brown Noise'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default UniversalHeader;
