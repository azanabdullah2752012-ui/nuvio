import React, { useState } from 'react';
import { Clock, Moon, Volume2, VolumeX, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { soundEngine } from '../../services/soundEngine';

const UniversalHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
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
    <header className="sticky top-0 z-40 h-14 w-full border-b border-[#eceae3] bg-[#fbfbfa]/90 backdrop-blur-md px-5 sm:px-8 flex items-center justify-between font-sans">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 text-[#8e8d8a] hover:text-[#1d1d1f] rounded-lg transition-colors sm:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b2b]" />
          <span className="font-serif font-bold text-base tracking-tight text-[#1d1d1f]">
            NUVIO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {/* Quick Ambient Audio Toggle */}
        <button
          onClick={cycleSound}
          className={`px-3 py-1.5 rounded-full border text-xs transition-all flex items-center gap-1.5 ${
            soundMode !== 'none'
              ? 'bg-[#1b3b2b] text-white border-[#1b3b2b] shadow-xs'
              : 'bg-white border-[#e8e6df] text-[#8e8d8a] hover:text-[#1d1d1f]'
          }`}
          title="Toggle ambient background sound (Rain / Brown noise / Off)"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] font-medium">
            {soundMode === 'none' ? 'Ambient Sound' : soundMode === 'rain' ? '🌧️ Rain' : '☕ Brown Noise'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default UniversalHeader;
