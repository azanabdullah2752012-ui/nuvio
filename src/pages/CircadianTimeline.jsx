import React, { useState, useEffect } from 'react';
import { 
  Sun, Zap, Wind, Utensils, Mail, Moon, 
  Check, Clock, Volume2, Play, Pause, AlertCircle,
  Eye, CheckCircle2, ChevronRight
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import BreathPacer from '../components/BreathPacer';
import EveningShutdownModal from '../components/EveningShutdownModal';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const CircadianTimeline = () => {
  const [tasks, setTasks] = useState([]);
  const [soundMode, setSoundMode] = useState(null); // 'binaural' | 'brown' | null
  const [isBreathPacerOpen, setIsBreathPacerOpen] = useState(false);
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  
  // Circadian Checklist State (persisted locally)
  const [circadianChecks, setCircadianChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('nuvio_circadian_checks');
      return saved ? JSON.parse(saved) : {
        sunlight: false,
        hydration: false,
        delayedCaffeine: false,
        makerBlock: false,
        nsdrBreak: false,
        movement: false,
        shallowAdmin: false,
        eveningShutdown: false,
        dimLights: false
      };
    } catch (e) {
      return { sunlight: false, hydration: false, delayedCaffeine: false, makerBlock: false, nsdrBreak: false, movement: false, shallowAdmin: false, eveningShutdown: false, dimLights: false };
    }
  });

  useEffect(() => {
    loadTasks();
    return () => soundEngine.stop();
  }, []);

  const loadTasks = async () => {
    const list = await dataService.list('tasks');
    setTasks(list || []);
  };

  const toggleCheck = (key) => {
    const updated = { ...circadianChecks, [key]: !circadianChecks[key] };
    setCircadianChecks(updated);
    localStorage.setItem('nuvio_circadian_checks', JSON.stringify(updated));
    if (updated[key]) {
      soundEngine.playBell(660);
      notificationService.send("Protocol Concluded", "Circadian biological anchor logged.", "success");
    }
  };

  const handleToggleSound = (mode) => {
    if (soundMode === mode) {
      soundEngine.stop();
      setSoundMode(null);
    } else {
      if (mode === 'binaural') {
        soundEngine.play40HzBinaural(0.08);
      } else {
        soundEngine.playBrownNoise(0.05);
      }
      setSoundMode(mode);
    }
  };

  const dailyHighlight = tasks.find(t => t.isHighlight && !t.completed) || tasks.find(t => t.isHighlight) || tasks[0];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Huberman & Newport Protocol // 24-Hour Rhythm
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Circadian Life Stream
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Biological alignment over bottomless to-do lists. Anchor your day with sunlight, 40Hz focus audio, and evening nervous system downshift.
          </p>
        </div>

        {/* Live Audio Lab Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleToggleSound('binaural')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              soundMode === 'binaural'
                ? 'bg-[#1b3b2b] text-white shadow-sm ring-2 ring-[#1b3b2b]'
                : 'bg-white border border-[#e5e1d5] text-[#52504a] hover:border-[#1b3b2b]'
            }`}
            title="MIT & Huberman protocol for focus and striatal dopamine"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{soundMode === 'binaural' ? '40Hz Active' : '40Hz Gamma'}</span>
          </button>

          <button
            onClick={() => handleToggleSound('brown')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              soundMode === 'brown'
                ? 'bg-[#8a4b16] text-white shadow-sm ring-2 ring-[#8a4b16]'
                : 'bg-white border border-[#e5e1d5] text-[#52504a] hover:border-[#8a4b16]'
            }`}
            title="Deep frequency masking for uninterrupted flow"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{soundMode === 'brown' ? 'Brown Noise Active' : 'Brown Noise'}</span>
          </button>
        </div>
      </header>

      {/* ── THE 24H CIRCADIAN STREAM ────────────────────────────────── */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#e5e1d5] before:pointer-events-none">
        
        {/* BLOCK 1: 06:30 - 08:30 CIRCADIAN ANCHOR */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#8a4b16] flex items-center justify-center text-xs">
            <Sun className="w-3.5 h-3.5 text-[#8a4b16]" />
          </div>

          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f4f1ea] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#8a4b16] uppercase font-bold tracking-wider">
                  06:30 – 08:30 // CIRCADIAN ANCHOR
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Cortisol Pulse & Adenosine Clearance
                </h3>
              </div>
              <span className="text-xs font-mono text-[#827f76]">Input Phase</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                onClick={() => toggleCheck('sunlight')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  circadianChecks.sunlight ? 'bg-[#f4f7f4] border-[#1b3b2b]' : 'bg-[#faf9f6] border-[#e5e1d5]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${circadianChecks.sunlight ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' : 'border-[#827f76]'}`}>
                  {circadianChecks.sunlight && '✓'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#1a1917]">15m Sunlight</div>
                  <div className="text-[10px] text-[#827f76]">View natural sky</div>
                </div>
              </label>

              <label 
                onClick={() => toggleCheck('hydration')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  circadianChecks.hydration ? 'bg-[#f4f7f4] border-[#1b3b2b]' : 'bg-[#faf9f6] border-[#e5e1d5]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${circadianChecks.hydration ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' : 'border-[#827f76]'}`}>
                  {circadianChecks.hydration && '✓'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#1a1917]">500ml Water</div>
                  <div className="text-[10px] text-[#827f76]">Electrolytes/salt</div>
                </div>
              </label>

              <label 
                onClick={() => toggleCheck('delayedCaffeine')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  circadianChecks.delayedCaffeine ? 'bg-[#f4f7f4] border-[#1b3b2b]' : 'bg-[#faf9f6] border-[#e5e1d5]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${circadianChecks.delayedCaffeine ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' : 'border-[#827f76]'}`}>
                  {circadianChecks.delayedCaffeine && '✓'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#1a1917]">Delay Caffeine</div>
                  <div className="text-[10px] text-[#827f76]">90m post-wake</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* BLOCK 2: 08:30 - 11:30 THE MAKER BLOCK (DEEP WORK) */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#1b3b2b] flex items-center justify-center text-xs">
            <Zap className="w-3.5 h-3.5 text-[#1b3b2b]" />
          </div>

          <div className="p-6 border-2 border-[#1b3b2b]/30 bg-[#fafbf9] rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ece1] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#1b3b2b] uppercase font-bold tracking-wider">
                  08:30 – 11:30 // PEAK COGNITIVE WINDOW
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  The 90-Minute Ultradian Bout (Daily Highlight)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#1b3b2b] font-bold">High Leverage</span>
            </div>

            {dailyHighlight && (
              <div className="p-4 border border-[#e5e1d5] bg-white rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#827f76]">Anchor Directive</div>
                  <div className="font-serif font-bold text-base text-[#1a1917] mt-0.5">{dailyHighlight.title}</div>
                </div>
                <button
                  onClick={() => handleToggleSound('binaural')}
                  className="px-4 py-2 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{soundMode === 'binaural' ? 'Stop 40Hz' : 'Focus with 40Hz'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BLOCK 3: 11:30 - 12:00 NSDR & PANORAMIC REST */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#244e6b] flex items-center justify-center text-xs">
            <Wind className="w-3.5 h-3.5 text-[#244e6b]" />
          </div>

          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f4f1ea] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#244e6b] uppercase font-bold tracking-wider">
                  11:30 – 12:00 // RESTORATION CADENCE
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Non-Sleep Deep Rest (NSDR) & Panoramic Gaze
                </h3>
              </div>
              <button
                onClick={() => setIsBreathPacerOpen(true)}
                className="px-4 py-2 bg-[#244e6b] hover:bg-[#1a384e] text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Open Breath Pacer</span>
              </button>
            </div>

            <p className="text-xs text-[#52504a]">
              Do not touch your phone or browse news during this break. Soften eye focus, widen to peripheral panoramic gaze, and complete 3 physiological sighs.
            </p>
          </div>
        </div>

        {/* BLOCK 4: 12:30 - 14:00 VITALITY & FUEL */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#8a4b16] flex items-center justify-center text-xs">
            <Utensils className="w-3.5 h-3.5 text-[#8a4b16]" />
          </div>

          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#8a4b16] uppercase font-bold tracking-wider">
                  12:30 – 14:00 // VITALITY & MOVEMENT
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Compound Resistance or Outdoor Walk
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                onClick={() => toggleCheck('movement')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  circadianChecks.movement ? 'bg-[#f4f7f4] border-[#1b3b2b]' : 'bg-[#faf9f6] border-[#e5e1d5]'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${circadianChecks.movement ? 'bg-[#1b3b2b] text-white border-[#1b3b2b]' : 'border-[#827f76]'}`}>
                  {circadianChecks.movement && '✓'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#1a1917]">Movement Session</div>
                  <div className="text-[10px] text-[#827f76]">Gym or 30m brisk walk</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* BLOCK 5: 14:30 - 17:30 SHALLOW LOGISTICS */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#544e3b] flex items-center justify-center text-xs">
            <Mail className="w-3.5 h-3.5 text-[#544e3b]" />
          </div>

          <div className="p-6 border border-[#e5e1d5] bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#544e3b] uppercase font-bold tracking-wider">
                  14:30 – 17:30 // SHALLOW LOGISTICS
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Asynchronous Batch & Admin
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#52504a]">
              Triage emails, schedule calls, clear secondary chores. Never place high-creativity tasks here when cognitive alertness dips.
            </p>
          </div>
        </div>

        {/* BLOCK 6: 18:00 CAL NEWPORT 60S SHUTDOWN */}
        <div className="relative pl-12">
          <div className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-[#fbfbfa] border-2 border-[#1b3b2b] flex items-center justify-center text-xs">
            <Moon className="w-3.5 h-3.5 text-[#1b3b2b]" />
          </div>

          <div className="p-6 border-2 border-[#1b3b2b]/30 bg-[#f4f7f4] rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ece1] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#1b3b2b] uppercase font-bold tracking-wider">
                  18:00 // WORKDAY CLOSURE
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Cal Newport's 60-Second Shutdown Station
                </h3>
              </div>
              <button
                onClick={() => setIsShutdownOpen(true)}
                className="px-5 py-2.5 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Execute Shutdown</span>
              </button>
            </div>

            <p className="text-xs text-[#52504a]">
              Audit wins, roll over remaining items without guilt, lock tomorrow's highlight, and say the closing phrase to release cognitive debt.
            </p>
          </div>
        </div>

      </div>

      {/* ── INTERACTIVE BREATH PACER MODAL ──────────────────────────── */}
      {isBreathPacerOpen && (
        <BreathPacer onClose={() => setIsBreathPacerOpen(false)} />
      )}

      {/* ── CAL NEWPORT SHUTDOWN MODAL ──────────────────────────────── */}
      <EveningShutdownModal
        isOpen={isShutdownOpen}
        onClose={() => setIsShutdownOpen(false)}
        tasks={tasks}
        onCompleteShutdown={() => loadTasks()}
      />

    </div>
  );
};

export default CircadianTimeline;
