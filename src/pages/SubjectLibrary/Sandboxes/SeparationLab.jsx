import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Beaker, Droplet, Play, RotateCcw, Compass, 
  AlertTriangle, CheckCircle2, Info, Sparkles, Activity, Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { xpService } from '../../../services/xpService';
import { authService } from '../../../services/authService';

const SeparationLab = () => {
  const [activeTab, setActiveTab] = useState('chromatography'); // 'chromatography' | 'distillation' | 'sublimation' | 'funnel'

  // Chromatography States
  const [inkColor, setInkColor] = useState('black'); // 'black' | 'red' | 'blue'
  const [chromRunning, setChromRunning] = useState(false);
  const [chromProgress, setChromProgress] = useState(0);
  const [chromSuccess, setChromSuccess] = useState(false);

  // Distillation States
  const [distTemp, setDistTemp] = useState(25); // 25°C to 120°C
  const [distProgress, setDistProgress] = useState(0); // 0 to 100%
  const [distPurity, setDistPurity] = useState(100);
  const [distSuccess, setDistSuccess] = useState(false);
  const [distWarning, setDistWarning] = useState('');

  // Sublimation States
  const [subTemp, setSubTemp] = useState(25); // 25°C to 250°C
  const [subProgress, setSubProgress] = useState(0); // 0 to 100%
  const [subSuccess, setSubSuccess] = useState(false);

  // Separating Funnel States
  const [funnelSettled, setFunnelSettled] = useState(false);
  const [funnelDraining, setFunnelDraining] = useState(false);
  const [funnelWaterLevel, setFunnelWaterLevel] = useState(100); // 100 to 0
  const [funnelMessage, setFunnelMessage] = useState('Oil and Water are mixed. Click Settle to separate by density.');
  const [funnelSuccess, setFunnelSuccess] = useState(false);

  // General audio synth feedback
  const playLocalSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {}
  };

  // ----------------------------------------------------
  // CHROMATOGRAPHY LAB LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    let interval;
    if (chromRunning && chromProgress < 100) {
      interval = setInterval(() => {
        setChromProgress(prev => {
          if (prev >= 99) {
            setChromRunning(false);
            setChromSuccess(true);
            playLocalSound('success');
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
            xpService.awardXp(15, 'Chromatography Dye Separation');
            authService.addTokens(5);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [chromRunning, chromProgress]);

  const handleStartChromatography = () => {
    setChromProgress(0);
    setChromSuccess(false);
    setChromRunning(true);
  };

  // ----------------------------------------------------
  // DISTILLATION LAB LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    let interval;
    if (distTemp >= 56 && distTemp <= 85) {
      setDistWarning('');
      if (distProgress < 100) {
        interval = setInterval(() => {
          setDistProgress(prev => {
            const nextVal = Math.min(100, prev + 2);
            if (nextVal === 100 && !distSuccess) {
              setDistSuccess(true);
              playLocalSound('success');
              confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
              xpService.awardXp(20, 'Distillation Temp Calibration');
              authService.addTokens(5);
            }
            return nextVal;
          });
          setDistPurity(prev => Math.min(100, prev + 1));
        }, 150);
      }
    } else if (distTemp > 85) {
      setDistWarning('⚠️ OVERHEATING: Water is evaporating too! Liquid purity is falling.');
      if (distProgress > 0) {
        interval = setInterval(() => {
          setDistPurity(prev => Math.max(40, prev - 3));
        }, 150);
      }
    } else {
      setDistWarning('ℹ️ TEMPERATURE TOO LOW: Acetone (boiling point 56°C) is not vaporizing.');
    }
    return () => clearInterval(interval);
  }, [distTemp, distProgress, distSuccess]);

  const resetDistillation = () => {
    setDistTemp(25);
    setDistProgress(0);
    setDistPurity(100);
    setDistSuccess(false);
    setDistWarning('');
  };

  // ----------------------------------------------------
  // SUBLIMATION LAB LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    let interval;
    if (subTemp >= 150) {
      if (subProgress < 100) {
        interval = setInterval(() => {
          setSubProgress(prev => {
            const nextVal = Math.min(100, prev + 2.5);
            if (nextVal === 100 && !subSuccess) {
              setSubSuccess(true);
              playLocalSound('success');
              confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
              xpService.awardXp(15, 'Sublimation Separation Mastery');
              authService.addTokens(5);
            }
            return nextVal;
          });
        }, 100);
      }
    } else {
      if (subProgress < 100) {
        setSubProgress(prev => Math.max(0, prev - 1));
      }
    }
    return () => clearInterval(interval);
  }, [subTemp, subProgress, subSuccess]);

  const resetSublimation = () => {
    setSubTemp(25);
    setSubProgress(0);
    setSubSuccess(false);
  };

  // ----------------------------------------------------
  // SEPARATING FUNNEL LAB LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    let interval;
    if (funnelDraining && funnelWaterLevel > 0) {
      interval = setInterval(() => {
        setFunnelWaterLevel(prev => {
          if (prev <= 1) {
            setFunnelDraining(false);
            setFunnelMessage('Water level is zero! STOP draining immediately!');
            return 0;
          }
          return prev - 2;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [funnelDraining, funnelWaterLevel]);

  const handleSettleFunnel = () => {
    setFunnelSettled(true);
    setFunnelMessage('Settle Complete: Density layers formed. Open the stopcock (Drain) to filter out water.');
  };

  const toggleStopcock = () => {
    if (funnelDraining) {
      setFunnelDraining(false);
      // Evaluate result
      if (funnelWaterLevel === 0) {
        setFunnelSuccess(true);
        setFunnelMessage('✓ PERFECT SEPARATION! All water is drained, and only pure oil remains in the funnel.');
        playLocalSound('success');
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        xpService.awardXp(20, 'Stopcock Valve Calibration');
        authService.addTokens(5);
      } else if (funnelWaterLevel > 0) {
        setFunnelMessage(`Separation incomplete. Water still remains (${funnelWaterLevel}%). Click Drain to continue.`);
      }
    } else {
      if (funnelWaterLevel > 0) {
        setFunnelDraining(true);
        setFunnelMessage('Draining water... Close the valve exactly when water reaches the bottom nozzle!');
      } else {
        // Oil has leaked
        setFunnelMessage('Too late! Water already emptied, and precious oil has spilled into the beaker.');
        playLocalSound('fail');
      }
    }
  };

  const resetFunnel = () => {
    setFunnelSettled(false);
    setFunnelDraining(false);
    setFunnelWaterLevel(100);
    setFunnelSuccess(false);
    setFunnelMessage('Oil and Water are mixed. Click Settle to separate by density.');
  };

  return (
    <div className="bg-slate-950 p-5 md:p-6 border border-white/10 rounded-xl shadow-2xl text-left space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          <h4 className="text-sm font-black uppercase text-white tracking-widest">
            Separation & Mixtures Virtual Science Lab
          </h4>
        </div>
        <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase rounded">
          Class 9 NCERT Lab
        </span>
      </div>

      {/* Tabs list switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 bg-slate-900 border border-white/5 rounded-lg">
        {[
          { id: 'chromatography', name: 'Chromatography', icon: '🧪' },
          { id: 'distillation', name: 'Distillation', icon: '🔥' },
          { id: 'sublimation', name: 'Sublimation', icon: '⚗️' },
          { id: 'funnel', name: 'Separating Funnel', icon: '💧' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-2.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id 
                ? 'bg-purple-500 text-black shadow font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      {/* Main viewport */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
        
        {/* Left Column: Visual Experiment Canvas */}
        <div className="md:col-span-6 bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]">
          
          {/* CHROMATOGRAPHY CANVAS */}
          {activeTab === 'chromatography' && (
            <div className="w-full flex flex-col items-center justify-center py-4">
              <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Paper Chromatography Chamber</span>
              
              <svg viewBox="0 0 200 220" className="w-48 h-auto overflow-visible select-none">
                {/* Glass Jar Outer Outline */}
                <rect x="30" y="20" width="140" height="180" rx="15" fill="none" className="stroke-white/10 stroke-2" />
                <rect x="50" y="10" width="100" height="10" fill="none" className="stroke-white/10 stroke-2" />
                
                {/* Solvent Water at the bottom */}
                <rect x="32" y="170" width="136" height="28" fill="rgba(34, 211, 238, 0.15)" rx="5" className="stroke-cyan-500/20 stroke-1" />
                
                {/* Chromatography Filter Paper strip */}
                <rect x="80" y="30" width="40" height="150" fill="white" className="stroke-slate-300 stroke-1" />
                
                {/* Reference line (pencil line) */}
                <line x1="80" y1="150" x2="120" y2="150" className="stroke-slate-400 stroke-1 stroke-dasharray-[2,2]" />
                
                {/* Capillary liquid rising up the paper */}
                <rect 
                  x="80" 
                  y={180 - (chromProgress / 100) * 140} 
                  width="40" 
                  height={(chromProgress / 100) * 140} 
                  fill="rgba(34, 211, 238, 0.25)" 
                />

                {/* Spot markings */}
                {/* Dropped Ink point at start line */}
                <circle cx="100" cy="150" r="3.5" fill={inkColor} />

                {/* Rising separation spots based on chromatography progress */}
                {chromProgress > 10 && (
                  <>
                    {inkColor === 'black' && (
                      <>
                        {/* Spot 1: Yellow (most soluble, rises highest) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 110} r={2.5 + (chromProgress/100)*3} fill="#eab308" className="opacity-80" />
                        {/* Spot 2: Red/Pink (mid solubility) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 75} r={2.5 + (chromProgress/100)*2} fill="#ec4899" className="opacity-80" />
                        {/* Spot 3: Blue (least soluble, rises lowest) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 45} r={2.5 + (chromProgress/100)*1.5} fill="#3b82f6" className="opacity-80" />
                      </>
                    )}
                    {inkColor === 'red' && (
                      <>
                        {/* Spot 1: Orange (high solubility) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 95} r={2.5 + (chromProgress/100)*3} fill="#f97316" className="opacity-80" />
                        {/* Spot 2: Pink/Magenta (low solubility) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 60} r={2.5 + (chromProgress/100)*2} fill="#d946ef" className="opacity-80" />
                      </>
                    )}
                    {inkColor === 'blue' && (
                      <>
                        {/* Spot 1: Cyan (high solubility) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 105} r={2.5 + (chromProgress/100)*3} fill="#06b6d4" className="opacity-80" />
                        {/* Spot 2: Royal Blue (low solubility) */}
                        <circle cx="100" cy={150 - (chromProgress / 100) * 55} r={2.5 + (chromProgress/100)*2} fill="#1d4ed8" className="opacity-80" />
                      </>
                    )}
                  </>
                )}
              </svg>

              {/* Status readout */}
              <div className="mt-2 text-[9px] font-black uppercase text-cyan-400">
                {chromRunning ? `Solvent Rising: ${Math.round(chromProgress)}%` : chromSuccess ? 'Chromatogram Complete! ✨' : 'Awaiting solvent rise'}
              </div>
            </div>
          )}

          {/* DISTILLATION CANVAS */}
          {activeTab === 'distillation' && (
            <div className="w-full flex flex-col items-center justify-center py-2">
              <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Fractional Distillation Console</span>
              
              <svg viewBox="0 0 280 200" className="w-56 h-auto overflow-visible select-none">
                {/* 1. Heating Bunsen Burner */}
                <rect x="40" y="160" width="30" height="25" fill="#334155" rx="3" />
                <line x1="55" y1="160" x2="55" y2="150" className="stroke-slate-400 stroke-2" />
                {distTemp >= 56 && (
                  <path 
                    d="M50,150 Q55,135 60,150 Z" 
                    fill={distTemp > 85 ? '#ef4444' : '#3b82f6'} 
                    className="animate-pulse" 
                  />
                )}

                {/* 2. Round Bottom Flask */}
                <circle cx="55" cy="115" r="22" fill="none" className="stroke-white/20 stroke-2" />
                <rect x="50" y="70" width="10" height="30" fill="none" className="stroke-white/20 stroke-2" />
                
                {/* Acetone + Water mixture inside flask */}
                {distProgress < 100 && (
                  <path 
                    d="M37,126 C43,123 48,127 55,126 C62,125 68,128 73,126 L73,135 A22,22 0 0,1 37,135 Z" 
                    fill="rgba(139, 92, 246, 0.3)" 
                  />
                )}

                {/* Thermometer in flask neck */}
                <line x1="55" y1="65" x2="55" y2="85" className="stroke-red-500 stroke-1.5" />
                <circle cx="55" cy="85" r="2" fill="red" />

                {/* 3. Condenser Tube */}
                <line x1="55" y1="75" x2="160" y2="105" className="stroke-white/20 stroke-[6]" />
                <line x1="55" y1="75" x2="160" y2="105" className="stroke-cyan-400/40 stroke-2" />
                
                {/* Condenser outer cooling jacket */}
                <rect x="70" y="72" width="75" height="20" transform="rotate(16, 70, 72)" fill="rgba(6, 182, 212, 0.15)" className="stroke-cyan-500/20 stroke-0.5" />

                {/* Vapor flow animation bubbles */}
                {distTemp >= 56 && distProgress < 100 && (
                  <>
                    <circle cx="55" cy="95" r="1.5" fill="#a7f3d0" className="animate-bounce" />
                    <circle cx="55" cy="80" r="1.5" fill="#a7f3d0" className="animate-ping" />
                    {/* Condensing drops along tube */}
                    <circle cx="95" cy="86" r="1.5" fill="#67e8f9" className="animate-pulse" />
                    <circle cx="135" cy="98" r="1.5" fill="#67e8f9" className="animate-pulse" />
                  </>
                )}

                {/* 4. Receiving Beaker */}
                <rect x="175" y="125" width="26" height="40" rx="2" fill="none" className="stroke-white/20 stroke-2" />
                {/* Recovered Acetone liquid */}
                {distProgress > 0 && (
                  <rect 
                    x="176" 
                    y={165 - (distProgress / 100) * 38} 
                    width="24" 
                    height={(distProgress / 100) * 38} 
                    fill={distPurity < 80 ? "rgba(139, 92, 246, 0.2)" : "rgba(34, 211, 238, 0.4)"} 
                    rx="1" 
                  />
                )}
                {/* Dripping drops from condenser tip */}
                {distTemp >= 56 && distProgress < 100 && (
                  <circle cx="160" cy="115" r="1.5" fill="#22d3ee" className="animate-bounce" />
                )}
              </svg>

              {/* Status gauges */}
              <div className="grid grid-cols-2 gap-4 w-full px-6 text-[9px] font-black uppercase text-center pt-2">
                <div className="bg-slate-950 p-1.5 rounded border border-white/5">
                  <span className="text-slate-500 block">Separation Progress</span>
                  <span className="text-yellow-400 font-mono text-[10px]">{Math.round(distProgress)}%</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-white/5">
                  <span className="text-slate-500 block">Distillate Purity</span>
                  <span className={distPurity < 80 ? 'text-red-400 font-mono text-[10px]' : 'text-green-400 font-mono text-[10px]'}>
                    {distPurity}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SUBLIMATION CANVAS */}
          {activeTab === 'sublimation' && (
            <div className="w-full flex flex-col items-center justify-center py-2">
              <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Inverted Funnel Sublimation Set-up</span>
              
              <svg viewBox="0 0 200 200" className="w-48 h-auto overflow-visible select-none">
                {/* Burner */}
                <rect x="85" y="160" width="30" height="20" fill="#334155" rx="3" />
                <line x1="100" y1="160" x2="100" y2="152" className="stroke-slate-400 stroke-2" />
                {subTemp >= 150 && (
                  <path d="M95,152 Q100,135 105,152 Z" fill="#f97316" className="animate-pulse" />
                )}

                {/* China Dish */}
                <path d="M50,135 C50,135 50,150 100,150 C150,150 150,135 150,135 Z" fill="none" className="stroke-white/20 stroke-2" />
                {/* Camphor + Salt mixture pile */}
                {subProgress < 100 && (
                  <path d="M75,138 Q100,126 125,138 Z" fill="#cbd5e1" />
                )}
                {/* Salt remaining after sublimation completes */}
                {subProgress >= 100 && (
                  <path d="M85,145 Q100,140 115,145 Z" fill="#f8fafc" />
                )}

                {/* Inverted Funnel */}
                <path d="M65,135 L95,65 L95,40 L105,40 L105,65 L135,135 Z" fill="none" className="stroke-white/10 stroke-1.5" />
                {/* Cotton plug in stem */}
                <circle cx="100" cy="45" r="4.5" fill="#f1f5f9" />

                {/* Vaporizing camphor paths */}
                {subTemp >= 150 && subProgress < 100 && (
                  <>
                    <circle cx="90" cy="110" r="2.5" fill="#e2e8f0" className="animate-ping" />
                    <circle cx="110" cy="90" r="2.5" fill="#e2e8f0" className="animate-ping" />
                    <circle cx="100" cy="70" r="2" fill="#e2e8f0" className="animate-bounce" />
                  </>
                )}

                {/* Deposited camphor crystals on funnel wall (Solidified Camphor) */}
                {subProgress > 20 && (
                  <>
                    {/* Left wall crystal clusters */}
                    <rect x="75" y="110" width="8" height="4" fill="#ffffff" rx="1" transform="rotate(-67, 75, 110)" />
                    <rect x="83" y="90" width="8" height="4" fill="#ffffff" rx="1" transform="rotate(-67, 83, 90)" />
                    {/* Right wall crystal clusters */}
                    <rect x="120" y="105" width="8" height="4" fill="#ffffff" rx="1" transform="rotate(67, 120, 105)" />
                    <rect x="110" y="85" width="8" height="4" fill="#ffffff" rx="1" transform="rotate(67, 110, 85)" />
                  </>
                )}
              </svg>

              {/* Readout label */}
              <div className="mt-2 text-[9px] font-black uppercase text-cyan-400">
                {subTemp < 150 ? 'Heating element cold' : subProgress < 100 ? `Sublimation Active: ${Math.round(subProgress)}%` : 'Pure Camphor Recovered! ⚗️'}
              </div>
            </div>
          )}

          {/* SEPARATING FUNNEL CANVAS */}
          {activeTab === 'funnel' && (
            <div className="w-full flex flex-col items-center justify-center py-2">
              <span className="absolute top-3 left-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Density Decantation Chamber</span>
              
              <svg viewBox="0 0 200 200" className="w-48 h-auto overflow-visible select-none">
                {/* Supporting Stand */}
                <line x1="50" y1="20" x2="50" y2="180" className="stroke-slate-700 stroke-4" />
                <line x1="30" y1="180" x2="110" y2="180" className="stroke-slate-700 stroke-5" />
                <line x1="50" y1="80" x2="85" y2="80" className="stroke-slate-600 stroke-2" />

                {/* Glass Separating Funnel Body */}
                <path d="M70,40 L130,40 C130,40 130,70 115,110 L115,135 L85,135 L85,110 C70,70 70,40 70,40 Z" fill="none" className="stroke-white/20 stroke-1.5" />
                <line x1="100" y1="135" x2="100" y2="155" className="stroke-white/20 stroke-2" />

                {/* Valve (Stopcock) knob */}
                <circle cx="100" cy="142" r="3.5" fill={funnelDraining ? "#10b981" : "#ef4444"} className="cursor-pointer" />

                {/* Liquid Layers inside funnel */}
                {/* 1. If not settled, oil and water are mixed */}
                {!funnelSettled && (
                  <path d="M71,50 L129,50 C129,50 125,75 113,110 L87,110 C75,75 71,50 71,50 Z" fill="rgba(167, 139, 250, 0.35)" />
                )}

                {/* 2. If settled, distinct density layers exist */}
                {funnelSettled && (
                  <>
                    {/* Top Layer: Light Oil (Yellow) */}
                    <path d="M71,50 L129,50 C129,50 126,68 120,80 L80,80 C74,68 71,50 71,50 Z" fill="rgba(234, 179, 8, 0.45)" />
                    
                    {/* Bottom Layer: Heavy Water (Blue) */}
                    {funnelWaterLevel > 0 && (
                      <path 
                        d={`M80,80 L120,80 C120,80 115,${80 + (funnelWaterLevel/100)*30} 115,110 L85,110 C85,110 85,${80 + (funnelWaterLevel/100)*30} 80,80 Z`} 
                        fill="rgba(34, 211, 238, 0.35)" 
                      />
                    )}
                  </>
                )}

                {/* Draining stream from bottom nozzle */}
                {funnelDraining && funnelWaterLevel > 0 && (
                  <line x1="100" y1="150" x2="100" y2="178" className="stroke-cyan-400 stroke-2 stroke-dasharray-[3,3]" />
                )}

                {/* Collection Beaker below funnel */}
                <rect x="88" y="160" width="24" height="20" rx="1" fill="none" className="stroke-white/20 stroke-1.5" />
                {/* Water collected in beaker */}
                {funnelWaterLevel < 100 && (
                  <rect 
                    x="89" 
                    y={180 - ((100 - funnelWaterLevel) / 100) * 18} 
                    width="22" 
                    height={((100 - funnelWaterLevel) / 100) * 18} 
                    fill="rgba(34, 211, 238, 0.4)" 
                    rx="0.5" 
                  />
                )}
              </svg>

              {/* Status label */}
              <div className="mt-2 text-[9px] font-black uppercase text-cyan-400">
                {!funnelSettled ? 'Emulsion Mixed' : funnelWaterLevel > 0 ? `Water remaining: ${funnelWaterLevel}%` : 'Water fully drained!'}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Controls, Directions, and Explanations */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* Active Lab directions console */}
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 shadow-md flex-1">
            <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest block border-b border-white/5 pb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Experiment Directions
            </span>

            {/* CHROMATOGRAPHY DIRECTIONS & CONTROLS */}
            {activeTab === 'chromatography' && (
              <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                <p>
                  <strong>Chromatography</strong> is used to separate components of a mixture based on their differing solubilities in a rising solvent.
                </p>

                {/* Controls */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-white/5">
                  <span className="text-[7px] text-slate-500 uppercase tracking-widest block font-black">Select Ink Dye Sample:</span>
                  <div className="flex gap-2">
                    {['black', 'red', 'blue'].map(color => (
                      <button
                        key={color}
                        disabled={chromRunning}
                        onClick={() => { setInkColor(color); setChromProgress(0); setChromSuccess(false); }}
                        className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase tracking-wider border transition-all ${
                          inkColor === color 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-sm'
                            : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {color} ink
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleStartChromatography}
                    disabled={chromRunning}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 mt-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Capillary Action
                  </button>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-white/5 text-[9px] text-slate-450 leading-relaxed font-semibold">
                  <strong className="text-purple-400 block uppercase text-[7px] mb-0.5">Scientific Principle:</strong>
                  The dye component that is **more soluble** in water rises faster and higher along the paper strip, separating cleanly from the less soluble dyes.
                </div>
              </div>
            )}

            {/* DISTILLATION DIRECTIONS & CONTROLS */}
            {activeTab === 'distillation' && (
              <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                <p>
                  <strong>Fractional Distillation</strong> separates miscible liquids with differing boiling points. Keep temperature in the optimal boiling range to purify.
                </p>

                {/* Heat burner temperature controller */}
                <div className="space-y-2.5 bg-slate-950 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between text-[7px] font-black text-slate-400">
                    <span>ADJUST BURNER TEMPERATURE</span>
                    <span className="font-mono text-cyan-400">{distTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="120"
                    value={distTemp}
                    onChange={(e) => setDistTemp(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[7px] font-bold text-slate-500">
                    <span>Room Temp (25°C)</span>
                    <span className="text-purple-400">BP Acetone (56°C)</span>
                    <span>BP Water (100°C)</span>
                  </div>
                </div>

                {/* Distillation warnings alerts */}
                <div className="p-3 bg-slate-950 border border-white/5 rounded-lg text-[9px] leading-relaxed font-semibold">
                  {distWarning ? (
                    <span className="text-amber-400 flex gap-1.5 items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{distWarning}</span>
                    </span>
                  ) : distSuccess ? (
                    <span className="text-green-400 flex gap-1.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span>✓ Perfect! Keep temperature in the 56°C - 85°C range until separation is 100% complete.</span>
                    </span>
                  ) : (
                    <span className="text-slate-450 flex gap-1.5 items-start">
                      <Info className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Slide temperature gauge to 56°C to start evaporating the acetone.</span>
                    </span>
                  )}
                </div>

                {distSuccess && (
                  <button
                    onClick={resetDistillation}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Distillation Lab
                  </button>
                )}
              </div>
            )}

            {/* SUBLIMATION DIRECTIONS & CONTROLS */}
            {activeTab === 'sublimation' && (
              <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                <p>
                  <strong>Sublimation</strong> separates a solid that sublimes (turns directly into vapor on heating) from a non-sublimable solid (like salt).
                </p>

                {/* Heat burner temperature controller */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between text-[7px] font-black text-slate-400">
                    <span>HEAT MIXTURE TWEAKER</span>
                    <span className="font-mono text-cyan-400">{subTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="220"
                    value={subTemp}
                    onChange={(e) => setSubTemp(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[7px] font-bold text-slate-500">
                    <span>Room Temp (25°C)</span>
                    <span className="text-purple-400">Sublime Temp (150°C)</span>
                  </div>
                </div>

                {/* Feedback message */}
                <div className="p-3 bg-slate-950 border border-white/5 rounded-lg text-[9px] leading-relaxed font-semibold">
                  {subTemp >= 150 ? (
                    <span className="text-green-400 flex gap-1.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span>✓ Camphor is subliming! Vapor crystals are depositing on the cool funnel walls, leaving salt in the dish.</span>
                    </span>
                  ) : (
                    <span className="text-slate-550 flex gap-1.5 items-start">
                      <Info className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Raise heat past 150°C to activate sublimation of camphor molecules.</span>
                    </span>
                  )}
                </div>

                {subSuccess && (
                  <button
                    onClick={resetSublimation}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Sublimation Lab
                  </button>
                )}
              </div>
            )}

            {/* SEPARATING FUNNEL DIRECTIONS & CONTROLS */}
            {activeTab === 'funnel' && (
              <div className="space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                <p>
                  A <strong>Separating Funnel</strong> separates two immiscible liquids based on their density differences (the heavier liquid forms the bottom layer).
                </p>

                {/* Action Buttons */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-white/5">
                  {!funnelSettled ? (
                    <button
                      onClick={handleSettleFunnel}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-white hover:to-white hover:text-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Wind className="w-4 h-4" /> Settle Mixture
                    </button>
                  ) : (
                    <button
                      onClick={toggleStopcock}
                      disabled={funnelSuccess}
                      className={`w-full py-2.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        funnelDraining 
                          ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse' 
                          : 'bg-emerald-500 hover:bg-emerald-450 text-black'
                      }`}
                    >
                      {funnelDraining ? 'Stop Stopcock Valve' : 'Open Stopcock (Drain)'}
                    </button>
                  )}
                </div>

                {/* Feedbacks */}
                <div className="p-3 bg-slate-950 border border-white/5 rounded-lg text-[9px] leading-relaxed font-semibold">
                  <span className={funnelSuccess ? 'text-green-400' : 'text-slate-350'}>
                    {funnelMessage}
                  </span>
                </div>

                {(funnelSuccess || funnelWaterLevel === 0) && (
                  <button
                    onClick={resetFunnel}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" /> Mix & Reset Funnel
                  </button>
                )}
              </div>
            )}

          </div>

          {/* XP & Rewards Checkpoint */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 text-[10px] text-slate-400 leading-relaxed font-semibold flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-purple-400 block uppercase text-[8px] font-black tracking-widest">Active Challenge:</span>
              <p>Separate components successfully to earn 15-20 XP & tokens!</p>
            </div>
            
            {/* Display success state */}
            {((activeTab === 'chromatography' && chromSuccess) ||
              (activeTab === 'distillation' && distSuccess) ||
              (activeTab === 'sublimation' && subSuccess) ||
              (activeTab === 'funnel' && funnelSuccess)) ? (
                <div className="px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-md text-green-400 text-[8px] font-black uppercase tracking-widest animate-bounce flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 fill-green-400" /> Complete
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-slate-900 border border-white/5 rounded-md text-slate-500 text-[8px] font-black uppercase tracking-widest shrink-0">
                  Pending
                </div>
              )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SeparationLab;
