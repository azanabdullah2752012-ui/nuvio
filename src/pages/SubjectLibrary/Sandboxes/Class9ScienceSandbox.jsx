import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Beaker, Droplet, Play, RotateCcw, Compass, 
  AlertTriangle, CheckCircle2, Info, Sparkles, Activity, 
  Wind, Eye, HelpCircle, ShieldAlert, Zap, Compass as CompassIcon,
  ChevronRight, Brain, Award, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { xpService } from '../../../services/xpService';
import { authService } from '../../../services/authService';

// ====================================================
// 1. SCIENCE EXPLORATION: MEASUREMENT & SCALES LAB
// ====================================================
const ScientificMethodSandbox = () => {
  const [unitMode, setUnitMode] = useState('metric'); // 'metric' | 'imperial'
  const [massValue, setMassValue] = useState(100); // 100 kg/lbs
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const targetMassLbs = 220.46; // target for 100 kg
  const margin = 2; // allowance margin

  const handleRunVerification = () => {
    const isCorrect = unitMode === 'imperial' && Math.abs(massValue - targetMassLbs) < margin;
    if (isCorrect) {
      setConversionSuccess(true);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(15, 'Measurement Unit Calibration');
      authService.addTokens(5);
    } else {
      setConversionSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Flight Fuel Lab: Metric vs Imperial Calibration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Simulator Panel */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Airplane Fuel Weight Chamber
            </span>

            <span className="text-3xl animate-bounce">✈️⛽</span>
            <div className="text-center mt-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block">Fuel Mass Log:</span>
              <strong className="text-cyan-400 font-mono text-xl">
                {massValue} {unitMode === 'metric' ? 'kg' : 'lbs'}
              </strong>
            </div>

            {conversionSuccess && (
              <span className="text-[8px] font-black text-green-400 uppercase tracking-widest mt-2 block animate-pulse">
                ✓ Fuel margins aligned! Flight cleared.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>SELECT UNIT METRIC & SLIDER INPUT</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setUnitMode('metric'); setConversionSuccess(false); }}
                className={`flex-1 py-1 rounded text-[8px] font-black uppercase tracking-wider ${unitMode === 'metric' ? 'bg-purple-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Metric (kg)
              </button>
              <button
                onClick={() => { setUnitMode('imperial'); setConversionSuccess(false); }}
                className={`flex-1 py-1 rounded text-[8px] font-black uppercase tracking-wider ${unitMode === 'imperial' ? 'bg-purple-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Imperial (lbs)
              </button>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              value={massValue}
              onChange={(e) => { setMassValue(parseInt(e.target.value)); setConversionSuccess(false); }}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Readout panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-purple-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <CompassIcon className="w-3.5 h-3.5" /> Mission Calibration
            </span>
            <p>
              An aircraft requires exactly **100 kg** of fuel. Ground crew mistakenly calibrated the gauge in **pounds (lbs)**. 
            </p>
            <p className="text-yellow-400">
              <strong>Challenge:</strong> Toggle the unit to **lbs** and slide the gauge to match 100 kg in lbs (~220 lbs). Click Verify.
            </p>
            <button
              onClick={handleRunVerification}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all mt-1"
            >
              Verify Fuel Weight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 2. TISSUES IN ACTION: MICROSCOPE INTERACTIVE LAB
// ====================================================
const TissueViewerSandbox = () => {
  const [tissueType, setTissueType] = useState('neuron'); // 'neuron' | 'meristem' | 'muscle'
  const [tissueState, setTissueState] = useState('idle'); // 'idle' | 'active'

  const handleTriggerImpulse = () => {
    setTissueState('active');
    playLocalSound('pulse');
    setTimeout(() => {
      setTissueState('idle');
      xpService.awardXp(10, 'Tissue Impulse Recorded');
    }, 1500);
  };

  const playLocalSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(type === 'pulse' ? 880 : 330, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Microscope Simulator: Tissue Cell Activation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Tissue Microscope View */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Slide Chamber View (1000x Magnification)
            </span>

            {/* Neuron rendering */}
            {tissueType === 'neuron' && (
              <svg viewBox="0 0 100 100" className="w-24 h-auto overflow-visible">
                {/* Cell body & dendrites */}
                <path d="M50,50 L40,35 M50,50 L60,35 M50,50 L35,50 M50,50 L65,55" className="stroke-purple-400 stroke-1.5" />
                <circle cx="50" cy="50" r="8" fill="#a855f7" className="stroke-white stroke-0.5" />
                <circle cx="50" cy="50" r="3" fill="#ffffff" />
                
                {/* Axon */}
                <line x1="50" y1="58" x2="50" y2="90" className="stroke-purple-400 stroke-2" />
                
                {/* Myelin sheaths */}
                <rect x="47" y="62" width="6" height="8" rx="1" fill="#c084fc" />
                <rect x="47" y="74" width="6" height="8" rx="1" fill="#c084fc" />

                {/* Impulse pulse signal */}
                {tissueState === 'active' && (
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="4" 
                    fill="#38bdf8" 
                    animate={{ cy: [50, 90], opacity: [1, 0] }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                )}
              </svg>
            )}

            {/* Meristem rendering */}
            {tissueType === 'meristem' && (
              <div className="grid grid-cols-4 gap-1 w-24 h-24">
                {Array.from({ length: 16 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`border border-emerald-500/30 rounded-sm flex items-center justify-center text-[8px] font-black transition-all ${
                      tissueState === 'active' ? 'bg-emerald-500/20 border-emerald-400 scale-105' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    🌱
                  </motion.div>
                ))}
              </div>
            )}

            {/* Muscle rendering */}
            {tissueType === 'muscle' && (
              <div className="flex flex-col gap-2 w-28">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={tissueState === 'active' ? { scaleX: [1, 0.8, 1] } : {}}
                    transition={{ duration: 0.8, repeat: 1 }}
                    className="h-3 bg-gradient-to-r from-red-600 to-rose-500 rounded-full border border-white/10 relative overflow-hidden"
                  >
                    {/* Striations */}
                    <div className="absolute inset-0 flex justify-around opacity-30 select-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-black" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>

          <div className="space-y-1.5">
            <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-black">Choose Tissue Sample:</span>
            <div className="flex gap-2">
              {['neuron', 'meristem', 'muscle'].map(type => (
                <button
                  key={type}
                  onClick={() => { setTissueType(type); setTissueState('idle'); }}
                  className={`flex-1 py-1 rounded text-[8px] font-black uppercase tracking-wider ${tissueType === type ? 'bg-purple-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic console */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Specimen Analysis
            </span>
            {tissueType === 'neuron' && (
              <p><strong>Nervous Tissue:</strong> Neurons possess highly specialized extensions (dendrites & axon) designed to transmit electrical signals across the body.</p>
            )}
            {tissueType === 'meristem' && (
              <p><strong>Meristematic Tissue:</strong> Plant cells that divide actively, aiding root/shoot growth. Click trigger to watch cell division trigger points.</p>
            )}
            {tissueType === 'muscle' && (
              <p><strong>Muscular Tissue:</strong> Parallel strands capable of contracting & relaxing to generate physical movement. Click trigger to contract.</p>
            )}
            <button
              onClick={handleTriggerImpulse}
              className="w-full py-2 bg-purple-500 text-black text-[9px] font-black uppercase tracking-widest rounded transition-all mt-1"
            >
              Trigger Tissue Impulse ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 3. WORK & ENERGY: WATER MILL KINETIC SIMULATOR
// ====================================================
const EnergyMachinesSandbox = () => {
  const [flowRate, setFlowRate] = useState(5); // 0 to 10
  const [millSpeed, setMillSpeed] = useState(0);
  const [energyGenerated, setEnergyGenerated] = useState(0);

  useEffect(() => {
    setMillSpeed(flowRate * 12);
    setEnergyGenerated(flowRate * 4.5);
    if (flowRate >= 8) {
      xpService.awardXp(10, 'Mill Efficiency Optimized');
    }
  }, [flowRate]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Hydraulic Power Lab: Kinetic Energy Converter
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Simulation */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Traditional Water Mill (Panchakki) Chamber
            </span>

            {/* Rotating Water Wheel SVG */}
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-24 h-auto overflow-visible select-none"
              animate={millSpeed > 0 ? { rotate: 360 } : {}}
              transition={millSpeed > 0 ? { repeat: Infinity, duration: 12 / flowRate, ease: "linear" } : {}}
            >
              <circle cx="50" cy="50" r="30" fill="none" className="stroke-purple-500/60 stroke-[4]" />
              <circle cx="50" cy="50" r="5" fill="#a855f7" />
              {/* Spokes / paddles */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 360) / 8;
                return (
                  <line 
                    key={i}
                    x1="50" y1="50" 
                    x2={50 + 28 * Math.cos((angle * Math.PI) / 180)} 
                    y2={50 + 28 * Math.sin((angle * Math.PI) / 180)} 
                    className="stroke-purple-400 stroke-2" 
                  />
                );
              })}
            </motion.svg>

            {/* Water flow visual particles */}
            {flowRate > 0 && (
              <div className="absolute top-10 right-8 flex flex-col gap-2 opacity-50 select-none animate-pulse text-xl">
                💧💧💧
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>WATER FLOW RATE RATE INPUT</span>
              <span className="font-mono text-purple-400">{flowRate} m/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={flowRate}
              onChange={(e) => setFlowRate(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Readout stats */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Energy Calculations
            </span>
            <div className="space-y-1.5 font-mono text-[9px]">
              <div className="flex justify-between">
                <span>FLOW SPEED (v):</span>
                <span className="text-white">{flowRate} m/s</span>
              </div>
              <div className="flex justify-between">
                <span>PADDLE RPM:</span>
                <span className="text-yellow-400">{millSpeed} RPM</span>
              </div>
              <div className="flex justify-between">
                <span>KINETIC ENERGY (KE):</span>
                <span className="text-green-400">{(0.5 * 10 * flowRate * flowRate).toFixed(1)} J</span>
              </div>
              <div className="flex justify-between">
                <span>GENERATED POWER:</span>
                <span className="text-cyan-400">{energyGenerated.toFixed(1)} Watts</span>
              </div>
            </div>
            <p className="text-slate-450 border-t border-white/5 pt-2 text-[9px]">
              Water mills convert the gravitational Potential Energy of falling water into Kinetic Energy to run grinding tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 4. ATOMIC FOUNDATIONS: CONSERVATION OF MASS LAB
// ====================================================
const ChemicalCombinationsSandbox = () => {
  const [reactantMass, setReactantMass] = useState(10.0);
  const [reactionTriggered, setReactionTriggered] = useState(false);
  const [reactionSuccess, setReactionSuccess] = useState(false);

  const handleSparkReaction = () => {
    setReactionTriggered(true);
    playLocalSound();
    setTimeout(() => {
      setReactionSuccess(true);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(20, 'Conservation of Mass Verified');
      authService.addTokens(5);
    }, 1200);
  };

  const playLocalSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const resetReaction = () => {
    setReactionTriggered(false);
    setReactionSuccess(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Chemical Purifier: Law of Conservation of Mass
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Scale simulation */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Sealed Reaction Flask & Scale
            </span>

            {/* Weighing scale grid */}
            <div className="text-center space-y-2">
              <span className="text-3xl">🧪⚗️</span>
              <div className="bg-slate-950 p-2 rounded-lg border border-white/5 font-mono">
                <span className="text-[7px] text-slate-500 block uppercase font-bold">Total Scale Weight:</span>
                <strong className="text-green-400 text-xl font-black">{reactantMass.toFixed(2)} g</strong>
              </div>
            </div>

            {reactionTriggered && !reactionSuccess && (
              <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center text-xl select-none animate-ping">
                ⚡💥
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSparkReaction}
              disabled={reactionTriggered}
              className="flex-1 py-2 bg-purple-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
            >
              Trigger Spark Reaction ⚡
            </button>
            {reactionSuccess && (
              <button
                onClick={resetReaction}
                className="px-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Readout panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <CompassIcon className="w-3.5 h-3.5" /> Conservation Principle
            </span>
            <p>
              Antoine Lavoisier established that mass can neither be created nor destroyed in a chemical reaction.
            </p>
            <p className="text-slate-400 leading-normal">
              {reactionSuccess ? (
                <span className="text-green-400">✓ SUCCESS: Notice how the reactants turned into products, yet the mass scale remained exactly **{reactantMass.toFixed(2)} g**!</span>
              ) : (
                <span>Mix ingredients, spark the reaction, and check the mass scale changes.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 5. SOUND WAVES: WAVE PROFILE & SONAR DEPTH SCAN
// ====================================================
const SoundWavesSandbox = () => {
  const [frequency, setFrequency] = useState(5); // 1 to 10
  const [amplitude, setAmplitude] = useState(5); // 1 to 10
  const [sonarActive, setSonarActive] = useState(false);
  const [sonarDepth, setSonarDepth] = useState(0);

  const handleSonarTrigger = () => {
    setSonarActive(true);
    setSonarDepth(0);
    playSonarSound();
    setTimeout(() => {
      setSonarActive(false);
      setSonarDepth((1500 * 0.4).toFixed(0)); // speed of sound in water * time
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(15, 'SONAR Echo Calibration');
    }, 1500);
  };

  const playSonarSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Acoustic Laboratory: Wave Scope & SONAR Depth Scanner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Wave visualizer */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Oscilloscope Wave-profile Display
            </span>

            {/* Dynamic wave path */}
            <svg viewBox="0 0 200 100" className="w-full h-auto overflow-visible">
              <path 
                d={Array.from({ length: 200 }).map((_, x) => {
                  const y = 50 + amplitude * 4.5 * Math.sin((x * frequency * Math.PI) / 80);
                  return `${x === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')} 
                fill="none" 
                className="stroke-purple-400 stroke-2" 
              />
            </svg>

            {sonarActive && (
              <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center z-10 text-xs font-black uppercase text-cyan-400 animate-pulse">
                🔊 SONAR Ping Sent... Receiving Echo...
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400">
                <span>FREQUENCY</span>
                <span className="font-mono text-purple-400">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400">
                <span>AMPLITUDE</span>
                <span className="font-mono text-purple-400">{amplitude}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Diagnostics & SONAR details */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3.5 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <CompassIcon className="w-3.5 h-3.5" /> SONAR Navigation
            </span>
            <p>
              SONAR uses ultrasonic pulses to measure the depth of water bodies. High frequency produces higher pitch.
            </p>
            {sonarDepth > 0 && (
              <div className="bg-slate-950 p-2 rounded border border-white/5 font-mono text-[9px] text-green-400 text-center leading-normal">
                ECHO TRIP TIME: **0.8 seconds** <br />
                CALCULATED DEPTH: **{sonarDepth} meters**
              </div>
            )}
            <button
              onClick={handleSonarTrigger}
              disabled={sonarActive}
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
            >
              Trigger SONAR Ping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 6. REPRODUCTION: FLOWER POLLINATION & GENETICS
// ====================================================
const ReproductionLab = () => {
  const [alleleParent1, setAlleleParent1] = useState('R'); // 'R' (Red) | 'r' (white)
  const [alleleParent2, setAlleleParent2] = useState('r');
  const [crossResults, setCrossResults] = useState(null);

  const handleRunCross = () => {
    // Generate Punnett square alleles
    const results = [
      alleleParent1 + alleleParent2,
      alleleParent1 + alleleParent2 === 'Rr' ? 'Rr' : alleleParent1 + alleleParent2,
      alleleParent1 + 'r',
      'r' + alleleParent2
    ];
    setCrossResults(results);
    confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 } });
    xpService.awardXp(15, 'Genetic Cross Verification');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Genetics Console: Punnett Square Allele Cross-over
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Visual cross board */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Cross-over Grid Display
            </span>

            {crossResults ? (
              <div className="grid grid-cols-2 gap-2 w-36 font-mono text-center">
                {crossResults.map((allele, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border text-xs font-black uppercase flex flex-col items-center justify-center leading-none ${
                      allele.includes('R') ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-950 border-white/5 text-slate-400'
                    }`}
                  >
                    <span>{allele}</span>
                    <span className="text-[6px] text-slate-500 mt-1 uppercase font-bold">
                      {allele.includes('R') ? 'Red Flower' : 'White Flower'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <span className="text-3xl animate-pulse">🌸🐝</span>
                <p className="text-[9px] text-slate-500 font-black uppercase">Awaiting pollination cross-over</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase block">Parent 1:</label>
              <div className="flex gap-1">
                {['R', 'r'].map(a => (
                  <button
                    key={a}
                    onClick={() => { setAlleleParent1(a); setCrossResults(null); }}
                    className={`flex-1 py-1 rounded text-[8px] font-black ${alleleParent1 === a ? 'bg-purple-500 text-black' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {a === 'R' ? 'R (Dom)' : 'r (Rec)'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase block">Parent 2:</label>
              <div className="flex gap-1">
                {['R', 'r'].map(a => (
                  <button
                    key={a}
                    onClick={() => { setAlleleParent2(a); setCrossResults(null); }}
                    className={`flex-1 py-1 rounded text-[8px] font-black ${alleleParent2 === a ? 'bg-purple-500 text-black' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {a === 'R' ? 'R (Dom)' : 'r (Rec)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Readout panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3.5 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" /> Genetics Principle
            </span>
            <p>
              Dominant alleles (R, Red flower) hide the phenotypic traits of Recessive alleles (r, white flower).
            </p>
            <p className="text-slate-400 leading-normal">
              Select alleles for both parent seeds and click Pollinate.
            </p>
            <button
              onClick={handleRunCross}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
            >
              Pollinate & Cross ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 7. KINGDOM CLASSIFICATION: WHITTAKER SORTER LAB
// ====================================================
const KingdomSorterSandbox = () => {
  const [specimen, setSpecimen] = useState('amoeba'); // 'amoeba' | 'mushroom' | 'tahr'
  const [selectedKingdom, setSelectedKingdom] = useState(null);
  const [success, setSuccess] = useState(false);

  const specimens = {
    amoeba: { emoji: '🦠', kingdom: 'Protista', desc: 'Unicellular eukaryote, moves using pseudopodia.' },
    mushroom: { emoji: '🍄', kingdom: 'Fungi', desc: 'Multicellular heterotrophic organism, cell wall made of chitin.' },
    tahr: { emoji: '🐐', kingdom: 'Animalia', desc: 'Vertebrate mammal endemic to the Western Ghats (Nilgiri Tahr).' }
  };

  const handleSort = (kingdom) => {
    setSelectedKingdom(kingdom);
    const correct = specimens[specimen].kingdom === kingdom;
    if (correct) {
      setSuccess(true);
      confetti({ particleCount: 25, spread: 35, origin: { y: 0.8 } });
      xpService.awardXp(15, 'Whittaker Specimen Sorting');
      authService.addTokens(3);
    } else {
      setSuccess(false);
      playErrorSound();
    }
  };

  const playErrorSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Taxonomy Laboratory: Whittaker Kingdom Sorter
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Specimen display */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-36 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Specimen Viewing Slide
            </span>

            <div className="text-center space-y-1 mt-2">
              <span className="text-4xl animate-pulse block">{specimens[specimen].emoji}</span>
              <strong className="text-white text-xs uppercase block font-black mt-1">{specimen} Specimen</strong>
              <p className="text-[9px] text-slate-400 leading-normal max-w-[180px] font-semibold">{specimens[specimen].desc}</p>
            </div>
          </div>

          {/* Sorter grids */}
          <div className="grid grid-cols-3 gap-1.5">
            {['Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia'].map(k => (
              <button
                key={k}
                onClick={() => handleSort(k)}
                className={`py-2 rounded text-[8px] font-black uppercase border transition-all ${
                  selectedKingdom === k 
                    ? success 
                      ? 'bg-green-500/20 border-green-500 text-green-400 font-extrabold'
                      : 'bg-red-500/20 border-red-500 text-red-400 font-extrabold'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Switcher & Diagnostics */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3.5 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-purple-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <CompassIcon className="w-3.5 h-3.5" /> Specimen Board
            </span>
            <div className="flex gap-2">
              {Object.keys(specimens).map(k => (
                <button
                  key={k}
                  onClick={() => { setSpecimen(k); setSelectedKingdom(null); setSuccess(false); }}
                  className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase border transition-all ${
                    specimen === k 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="border-t border-white/5 pt-2 text-slate-400 font-semibold leading-relaxed">
              {selectedKingdom ? (
                success ? (
                  <span className="text-green-400">✓ CORRECT: Successfully classified under the kingdom **{selectedKingdom}**!</span>
                ) : (
                  <span className="text-red-400">⚠️ INCORRECT: Not a member of the kingdom **{selectedKingdom}**. Try again.</span>
                )
              ) : (
                <span>Pick a specimen, examine its physical traits, and select the correct kingdom category.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// 8. EARTH SYSTEM: ENERGY CONVERTER & ALBEDO LAB
// ====================================================
const EarthSystemSandbox = () => {
  const [co2Level, setCo2Level] = useState(400); // 300 to 1000 ppm
  const [iceCover, setIceCover] = useState(60); // 0 to 100%
  const [earthTemp, setEarthTemp] = useState(14); // degrees celsius

  useEffect(() => {
    // Temperature formula based on greenhouse gases and albedo
    // Base temp 14C. CO2 increases temp. Ice (Albedo) cools temp.
    const co2Offset = (co2Level - 300) * 0.015;
    const albedoOffset = (60 - iceCover) * 0.08;
    setEarthTemp(+(14 + co2Offset + albedoOffset).toFixed(1));
    if (co2Level <= 350 && iceCover >= 70) {
      xpService.awardXp(15, 'Atmospheric Balance Mastery');
    }
  }, [co2Level, iceCover]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Planetary Simulation: Albedo & Greenhouse Thermal Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Planetary view */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2">
              Atmosphere & Heat Absorption Scope
            </span>

            {/* Earth rendering */}
            <div className="text-center space-y-1 mt-2">
              <span className="text-4xl animate-pulse block">
                {earthTemp > 18 ? "🥵🌍" : earthTemp < 10 ? "🥶🌍" : "🌏✨"}
              </span>
              <div className="bg-slate-950 px-3 py-1.5 border border-white/5 rounded-lg font-mono">
                <span className="text-[6px] text-slate-500 block uppercase font-bold">Planetary Mean Temp:</span>
                <strong className={`text-xl font-black ${earthTemp > 18 ? 'text-red-400' : earthTemp < 10 ? 'text-cyan-400' : 'text-green-400'}`}>
                  {earthTemp}°C
                </strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400">
                <span>CO₂ CONCENTRATION</span>
                <span className="font-mono text-purple-400">{co2Level} ppm</span>
              </div>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={co2Level}
                onChange={(e) => setCo2Level(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400">
                <span>POLAR ICE COVER</span>
                <span className="font-mono text-purple-400">{iceCover}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={iceCover}
                onChange={(e) => setIceCover(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Readouts diagnostics */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3.5 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-cyan-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Climate Analytics
            </span>
            <div className="space-y-1 text-slate-400 leading-normal">
              {earthTemp > 18 && (
                <span className="text-red-400 block font-bold">⚠️ GREENHOUSE WARNING: High CO₂ levels are trapping thermal radiation. Polar icecap melting is accelerating.</span>
              )}
              {earthTemp < 10 && (
                <span className="text-cyan-400 block font-bold">❄️ ALBEDO WARNING: High ice reflection is returning solar radiation back to space, triggering cooling.</span>
              )}
              {earthTemp >= 10 && earthTemp <= 18 && (
                <span className="text-green-400 block font-bold">✓ ECOSTASIS: Temperature within normal habitable ranges (10°C - 18°C). Atmospheric balance optimized.</span>
              )}
            </div>
            <p className="text-slate-450 border-t border-white/5 pt-2 text-[9px]">
              Albedo reflects radiation back to space, keeping Earth cool, while greenhouse gases trap heat to sustain the biosphere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// CORE CHAPTER ROUTER & WRAPPER
// ====================================================
const Class9ScienceSandbox = ({ chapterTitle = "", activeConcept = null }) => {
  const chLower = chapterTitle.toLowerCase();

  const renderSelectedSandbox = () => {
    if (chLower.includes('exploration') || chLower.includes('science exploration')) {
      return <ScientificMethodSandbox />;
    }
    if (chLower.includes('tissues') || chLower.includes('tissues in action')) {
      return <TissueViewerSandbox />;
    }
    if (chLower.includes('work') || chLower.includes('energy') || chLower.includes('machines')) {
      return <EnergyMachinesSandbox />;
    }
    if (chLower.includes('atomic foundations') || chLower.includes('foundations of matter')) {
      return <ChemicalCombinationsSandbox />;
    }
    if (chLower.includes('sound waves') || chLower.includes('sound')) {
      return <SoundWavesSandbox />;
    }
    if (chLower.includes('reproduction') || chLower.includes('continues')) {
      return <ReproductionLab />;
    }
    if (chLower.includes('patterns in life') || chLower.includes('diversity and classification') || chLower.includes('classification')) {
      return <KingdomSorterSandbox />;
    }
    if (chLower.includes('earth') || chLower.includes('system') || chLower.includes('planetary')) {
      return <EarthSystemSandbox />;
    }

    // Fallback UI
    return (
      <div className="bg-slate-900 p-6 border border-white/5 rounded-xl space-y-4 text-center">
        <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
        <h5 className="text-xs font-black uppercase text-white">Concept Visualisation</h5>
        <div className="p-4 bg-slate-950 border border-white/5 rounded-lg text-[11px] leading-relaxed text-slate-350">
          <strong className="text-cyan-400 block mb-1">Concept Target:</strong>
          {activeConcept?.definition || "Explore the subtopics to configure dynamic lab components."}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 p-5 border border-white/10 rounded-xl space-y-5 text-left shadow-lg">
      <div className="space-y-0.5">
        <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
          Class 9 NCERT Science Laboratory
        </span>
        <h4 className="text-sm font-black uppercase text-white truncate">{chapterTitle}</h4>
        <p className="text-slate-400 text-[9px] font-semibold leading-relaxed">
          Tweak values, slide temperature bars, and trigger reactions to visualize core experimental concepts.
        </p>
      </div>

      <div className="w-full pt-1">
        {renderSelectedSandbox()}
      </div>
    </div>
  );
};

export default Class9ScienceSandbox;
export { 
  ScientificMethodSandbox,
  TissueViewerSandbox,
  EnergyMachinesSandbox,
  ChemicalCombinationsSandbox,
  SoundWavesSandbox,
  ReproductionLab,
  KingdomSorterSandbox,
  EarthSystemSandbox
};
