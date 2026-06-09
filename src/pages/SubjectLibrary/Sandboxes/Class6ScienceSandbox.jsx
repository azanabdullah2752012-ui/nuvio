import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, RotateCcw, Info, Thermometer, Wind, Eye, Check,
  AlertTriangle, Sun, Droplets, Filter, HelpCircle, Trees, ShieldAlert,
  ArrowRight, ShieldCheck, Heart, Trash2, HelpCircle as HelpIcon, ArrowLeftRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { xpService } from '../../../services/xpService';
import { authService } from '../../../services/authService';

// ==========================================
// 1. CHAPTER 1: SCIENTIFIC METHOD SIMULATOR
// ==========================================
const ScientificMethodSandbox = () => {
  const [stage, setStage] = useState(1); // 1: Observe, 2: Question, 3: Hypothesis, 4: Test, 5: Analyze
  const [hypothesis, setHypothesis] = useState(null); // 'empty' | 'dried'
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [completed, setCompleted] = useState(false);

  const resetActivity = () => {
    setStage(1);
    setHypothesis(null);
    setTestRunning(false);
    setTestResult(null);
    setCompleted(false);
  };

  const handleTest = () => {
    setTestRunning(true);
    setTimeout(() => {
      setTestRunning(false);
      if (hypothesis === 'empty') {
        setTestResult('fail');
      } else {
        setTestResult('success');
        setCompleted(true);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
        xpService.awardXp(20, 'Scientific Method Applied');
        authService.addTokens(5);
      }
      setStage(5);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Experiment 1.1: Pen Troubleshooting Lab
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          Stage {stage}/5
        </span>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[180px] flex flex-col justify-between">
        {stage === 1 && (
          <div className="space-y-3">
            <h6 className="text-xs font-black uppercase text-white">Step 1: Observation</h6>
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 border border-white/5 rounded-lg">
              <span className="text-3xl">✍️❌</span>
              <p className="text-[10px] text-slate-350 leading-relaxed font-semibold">
                You sit down to do homework and start writing. Suddenly, the pen ceases to leave any ink.
              </p>
            </div>
            <button
              onClick={() => setStage(2)}
              className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-black text-[9px] font-black uppercase tracking-widest rounded transition-all active:scale-[0.98]"
            >
              Ask a Question ➔
            </button>
          </div>
        )}

        {stage === 2 && (
          <div className="space-y-3">
            <h6 className="text-xs font-black uppercase text-white">Step 2: Questioning</h6>
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 border border-white/5 rounded-lg">
              <span className="text-3xl">❓</span>
              <p className="text-[10px] text-cyan-400 leading-relaxed font-black uppercase tracking-wider">
                "Why did my pen stop writing?"
              </p>
            </div>
            <button
              onClick={() => setStage(3)}
              className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-black text-[9px] font-black uppercase tracking-widest rounded transition-all active:scale-[0.98]"
            >
              Formulate Hypothesis ➔
            </button>
          </div>
        )}

        {stage === 3 && (
          <div className="space-y-3">
            <h6 className="text-xs font-black uppercase text-white">Step 3: Hypothesis (Guess)</h6>
            <p className="text-[10px] text-slate-400 font-semibold mb-2">
              Form a testable explanation for why the pen stopped writing. Select one to test:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setHypothesis('empty')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  hypothesis === 'empty' 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-[9px] font-black uppercase">Hypothesis A</span>
                <span className="text-[10px] font-semibold mt-1">"The ink cartridge is completely empty."</span>
              </button>
              <button
                onClick={() => setHypothesis('dried')}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  hypothesis === 'dried' 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-[9px] font-black uppercase">Hypothesis B</span>
                <span className="text-[10px] font-semibold mt-1">"The ink has dried up at the nib."</span>
              </button>
            </div>
            {hypothesis && (
              <button
                onClick={() => setStage(4)}
                className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-black text-[9px] font-black uppercase tracking-widest rounded transition-all mt-2"
              >
                Proceed to Testing ➔
              </button>
            )}
          </div>
        )}

        {stage === 4 && (
          <div className="space-y-3 text-center py-2">
            <h6 className="text-xs font-black uppercase text-white">Step 4: Testing & Experimentation</h6>
            <p className="text-[10px] text-slate-450 font-semibold">
              {hypothesis === 'empty' 
                ? "Test: Open the pen shell and pull out the refill to inspect ink level."
                : "Test: Dip the nib in warm water for a few seconds to dissolve dried ink."}
            </p>
            <div className="py-4">
              {testRunning ? (
                <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <button
                  onClick={handleTest}
                  className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                >
                  Conduct Test 🔬
                </button>
              )}
            </div>
          </div>
        )}

        {stage === 5 && (
          <div className="space-y-3">
            <h6 className="text-xs font-black uppercase text-white">Step 5: Analyze & Conclude</h6>
            {testResult === 'fail' ? (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-[10px] text-red-400 font-semibold leading-relaxed">
                  <strong>Result:</strong> Inspecting the refill reveals it is 80% full! The cartridge is NOT empty. Your hypothesis was refuted.
                </div>
                <button
                  onClick={() => setStage(3)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all"
                >
                  Formulate New Hypothesis ↩
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-[10px] text-green-400 font-semibold leading-relaxed">
                  <strong>Result:</strong> Dipping the nib in warm water dissolves the plug. The pen writes smoothly again! Your hypothesis is supported! 🎉 +20 XP awarded.
                </div>
                <button
                  onClick={resetActivity}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Experiment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. CHAPTER 2: HABITAT & ADAPTATION MATCHER
// ==========================================
const HabitatAdaptationSandbox = () => {
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [score, setScore] = useState(0);
  const [matchedList, setMatchedList] = useState([]); // Array of strings representing completed matches
  const [feedback, setFeedback] = useState(null);

  const organisms = [
    { name: "Cactus", emoji: "🌵", trait: "Fleshy water-storing stem & spine-like leaves" },
    { name: "Camel", emoji: "🐫", trait: "Wide hooves & fat-storing hump" },
    { name: "Deodar Tree", emoji: "🌲", trait: "Conical shape & sloping branches" },
    { name: "Fish", emoji: "🐟", trait: "Streamlined body & breathing gills" },
    { name: "Frog", emoji: "🐸", trait: "Webbed feet & strong leaping legs" }
  ];

  const habitats = [
    { name: "Hot Desert", correctOrganisms: ["Cactus", "Camel"], emoji: "🏜️" },
    { name: "Snowy Mountains", correctOrganisms: ["Deodar Tree"], emoji: "🏔️" },
    { name: "Aquatic Ocean", correctOrganisms: ["Fish"], emoji: "🌊" },
    { name: "Pond Wetland", correctOrganisms: ["Frog"], emoji: "🪷" }
  ];

  const checkMatch = (orgName, habName) => {
    const org = organisms.find(o => o.name === orgName);
    const hab = habitats.find(h => h.name === habName);

    if (hab.correctOrganisms.includes(orgName)) {
      if (matchedList.includes(orgName)) {
        setFeedback("Already matched!");
        return;
      }
      setMatchedList([...matchedList, orgName]);
      setScore(prev => prev + 1);
      setFeedback(`Correct! ${org.emoji} belongs to ${hab.emoji} ${hab.name}. Trait: ${org.trait}`);
      xpService.awardXp(5, 'Adaptation Match');
      authService.addTokens(1);

      if (matchedList.length + 1 === organisms.length) {
        confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
        xpService.awardXp(15, 'All Habitats Matched');
      }
    } else {
      setFeedback(`Incorrect. ${org.emoji} is not adapted to survive in ${hab.emoji} ${hab.name}.`);
    }
    setSelectedOrganism(null);
    setSelectedHabitat(null);
  };

  const handleOrgClick = (org) => {
    if (matchedList.includes(org.name)) return;
    if (selectedOrganism === org.name) {
      setSelectedOrganism(null);
    } else {
      setSelectedOrganism(org.name);
      if (selectedHabitat) {
        checkMatch(org.name, selectedHabitat);
      }
    }
  };

  const handleHabClick = (hab) => {
    setSelectedHabitat(hab.name);
    if (selectedOrganism) {
      checkMatch(selectedOrganism, hab.name);
    }
  };

  const resetActivity = () => {
    setSelectedOrganism(null);
    setSelectedHabitat(null);
    setScore(0);
    setMatchedList([]);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Activity 2.2: Habitat Matcher Game
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          Matched: {matchedList.length}/{organisms.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Organisms column */}
        <div className="md:col-span-5 space-y-2">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
            1. Select Organism
          </label>
          <div className="flex flex-col gap-1.5">
            {organisms.map(org => {
              const matched = matchedList.includes(org.name);
              const selected = selectedOrganism === org.name;
              return (
                <button
                  key={org.name}
                  onClick={() => handleOrgClick(org)}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    matched 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-60' 
                      : selected 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-1 ring-purple-500'
                      : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{org.emoji}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider">{org.name}</span>
                  </div>
                  {matched && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Habitats column */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
              2. Choose Target Habitat
            </label>
            <div className="grid grid-cols-2 gap-2">
              {habitats.map(hab => {
                const selected = selectedHabitat === hab.name;
                return (
                  <button
                    key={hab.name}
                    onClick={() => handleHabClick(hab)}
                    className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                      selected 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl mb-1">{hab.emoji}</span>
                    <span className="text-[9px] font-black uppercase leading-tight">{hab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Display */}
          <div className="p-3 bg-slate-900 border border-white/5 rounded-lg text-[10px] min-h-[50px] flex items-center justify-center text-center font-semibold text-slate-300">
            {feedback ? feedback : "Match all organisms with their correct habitats to learn their key survival traits."}
          </div>

          {matchedList.length === organisms.length && (
            <button
              onClick={resetActivity}
              className="w-full py-2 bg-slate-850 hover:bg-slate-805 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Matcher
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CHAPTER 3: BALANCED DIET BUILDER
// ==========================================
const BalancedDietSandbox = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);

  const foodItems = [
    { name: "Brown Rice", carbs: 45, protein: 5, fats: 2, vitamins: 2, emoji: "🍚" },
    { name: "Yellow Dal", carbs: 20, protein: 22, fats: 3, vitamins: 4, emoji: "🥣" },
    { name: "Green Salad", carbs: 5, protein: 2, fats: 0, vitamins: 30, emoji: "🥗" },
    { name: "Paneer Sabji", carbs: 8, protein: 18, fats: 15, vitamins: 6, emoji: "🧀" },
    { name: "Fresh Apple", carbs: 12, protein: 1, fats: 0, vitamins: 20, emoji: "🍎" },
    { name: "Butter (Ghee)", carbs: 0, protein: 0, fats: 40, vitamins: 2, emoji: "🧈" }
  ];

  const toggleFood = (food) => {
    if (selectedFoods.some(f => f.name === food.name)) {
      setSelectedFoods(selectedFoods.filter(f => f.name !== food.name));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const getNutrientTotals = () => {
    return selectedFoods.reduce(
      (acc, curr) => ({
        energy: Math.min(100, acc.energy + curr.carbs + curr.fats),
        growth: Math.min(100, acc.growth + curr.protein),
        protection: Math.min(100, acc.protection + curr.vitamins),
        roughage: Math.min(100, acc.roughage + (curr.vitamins > 15 ? 35 : 5))
      }),
      { energy: 0, growth: 0, protection: 0, roughage: 0 }
    );
  };

  const totals = getNutrientTotals();
  const isBalanced = totals.energy >= 60 && totals.growth >= 40 && totals.protection >= 40 && totals.roughage >= 40;

  useEffect(() => {
    if (isBalanced) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(15, 'Nutritional Balance Mastered');
    }
  }, [isBalanced]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Mindful Meal Laboratory: Balanced Plate Maker
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Food Choice Grid */}
        <div className="md:col-span-5 space-y-2">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
            Add to plate
          </label>
          <div className="grid grid-cols-2 gap-2">
            {foodItems.map(item => {
              const active = selectedFoods.some(f => f.name === item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleFood(item)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    active 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="overflow-hidden">
                    <div className="text-[9px] font-black uppercase leading-tight truncate">{item.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plates and Gauges */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
          {/* Plate Visual */}
          <div className="border border-white/10 rounded-full w-24 h-24 mx-auto bg-slate-900 flex items-center justify-center p-2 relative shadow-inner">
            <span className="absolute -top-1.5 px-1.5 py-0.5 bg-slate-950 border border-white/10 text-[6px] text-slate-400 uppercase font-black rounded">Tray</span>
            {selectedFoods.length === 0 ? (
              <span className="text-[8px] text-slate-600 font-bold uppercase text-center">Tray Empty</span>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-1">
                {selectedFoods.map(f => (
                  <span key={f.name} className="text-lg animate-pulse">{f.emoji}</span>
                ))}
              </div>
            )}
          </div>

          {/* Live Bar Graphs */}
          <div className="space-y-2 text-[8px] font-black">
            {/* Energy Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-400">
                <span>ENERGY GIVING (CARBS + FATS)</span>
                <span className="font-mono">{totals.energy}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${totals.energy}%` }} />
              </div>
            </div>

            {/* Growth Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-400">
                <span>BODY BUILDING (PROTEIN)</span>
                <span className="font-mono">{totals.growth}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${totals.growth}%` }} />
              </div>
            </div>

            {/* Protection Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-400">
                <span>PROTECTION (VITAMINS & MINERALS)</span>
                <span className="font-mono">{totals.protection}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${totals.protection}%` }} />
              </div>
            </div>

            {/* Fiber Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-400">
                <span>ROUGHAGE (DIETARY FIBER)</span>
                <span className="font-mono">{totals.roughage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${totals.roughage}%` }} />
              </div>
            </div>
          </div>

          {/* Balanced Badge */}
          {selectedFoods.length > 0 && (
            <div className={`p-2 rounded text-center text-[9px] font-black uppercase ${
              isBalanced ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {isBalanced ? "✓ Wholesome Balanced plate constructed! 🌟" : "⚠ Plate lacks balance. Add greens and protein items!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CHAPTER 4: EXPLORING MAGNETS
// ==========================================
const MagnetSandbox = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [distance, setDistance] = useState(50); // slider 1 to 100
  const [poleMode, setPoleMode] = useState('unlike'); // 'like' (Repulsive S-S) | 'unlike' (Attractive N-S)

  const items = [
    { name: "Iron Key", magnetic: true, emoji: "🔑", desc: "Highly attracted! Iron is a magnetic substance." },
    { name: "Plastic Ruler", magnetic: false, emoji: "📏", desc: "No attraction. Plastic is non-magnetic." },
    { name: "Nickel Coin", magnetic: true, emoji: "🪙", desc: "Attracted! Nickel is a magnetic metal." },
    { name: "Copper Wire", magnetic: false, emoji: "🔌", desc: "No attraction. Copper is non-magnetic." },
    { name: "Gold Ring", magnetic: false, emoji: "💍", desc: "No attraction. Gold is non-magnetic." }
  ];

  const activeObj = items.find(i => i.name === selectedObject);

  // Compute magnetic pull offset
  const getPullX = () => {
    if (!activeObj?.magnetic) return 0;
    // Closer distance = stronger pull
    const force = Math.max(0, 80 - distance);
    return force;
  };

  // Compute force vector length
  const getForceVectorLength = () => {
    return Math.max(1, (100 - distance) * 0.8);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Magnetics Laboratory: Polarity & Attraction
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Objects Shelf */}
        <div className="md:col-span-5 space-y-2">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
            Select materials to test
          </label>
          <div className="flex flex-col gap-1.5">
            {items.map(item => (
              <button
                key={item.name}
                onClick={() => setSelectedObject(item.name)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  selectedObject === item.name 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-[7px] font-semibold text-slate-500">
                  {item.magnetic ? "MAGNETIC" : "NON-MAGNETIC"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Lab Field */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
          <div className="flex justify-center bg-slate-900 p-1 border border-white/5 rounded-lg text-[8px] font-black uppercase">
            <button
              onClick={() => setPoleMode('unlike')}
              className={`flex-1 py-1.5 rounded transition-all ${poleMode === 'unlike' ? 'bg-purple-500 text-black shadow' : 'text-slate-400'}`}
            >
              Attractive Test (N-S)
            </button>
            <button
              onClick={() => setPoleMode('like')}
              className={`flex-1 py-1.5 rounded transition-all ${poleMode === 'like' ? 'bg-purple-500 text-black shadow' : 'text-slate-400'}`}
            >
              Repulsive Test (S-S)
            </button>
          </div>

          {/* Attraction Area */}
          <div className="h-32 bg-slate-950/60 rounded-xl border border-white/5 relative flex items-center justify-between px-8 overflow-hidden">
            {/* Primary Bar Magnet (N-S) */}
            <div className="flex border border-white/10 rounded overflow-hidden shadow-lg h-8 select-none shrink-0 z-15">
              <span className="bg-red-600 w-8 flex items-center justify-center text-[10px] font-black text-white">N</span>
              <span className="bg-blue-600 w-8 flex items-center justify-center text-[10px] font-black text-white">S</span>
            </div>

            {/* Force Vector Arrows Display */}
            {poleMode === 'unlike' ? (
              /* Attractive Test: Object pulls to the left magnet's South pole */
              <>
                {activeObj?.magnetic && (
                  <div className="absolute left-24 right-24 flex items-center justify-center gap-1 text-[11px] font-black text-emerald-400 pointer-events-none select-none z-10">
                    <span 
                      className="inline-block bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${getForceVectorLength()}px` }}
                    />
                    <span>➔</span>
                  </div>
                )}
                <div 
                  className="relative text-2xl select-none transition-all duration-150 ease-out"
                  style={{ transform: `translateX(-${getPullX()}px)` }}
                >
                  {activeObj ? (
                    <div className="flex flex-col items-center">
                      <span>{activeObj.emoji}</span>
                      <span className="text-[6px] text-slate-500 uppercase font-black">{activeObj.name}</span>
                    </div>
                  ) : (
                    <span className="text-[8px] text-slate-600 font-bold uppercase">No Material</span>
                  )}
                </div>
              </>
            ) : (
              /* Repulsive Test: Second magnet with S-N orientation faces the left magnet's S pole. S-S repels! */
              <>
                <div className="absolute left-24 right-28 flex items-center justify-center gap-1.5 text-[11px] font-black text-cyan-400 pointer-events-none select-none z-10">
                  <span>←</span>
                  <span 
                    className="inline-block bg-cyan-450 h-1.5 rounded-full transition-all"
                    style={{ width: `${getForceVectorLength() * 0.6}px` }}
                  />
                  <span>→</span>
                </div>

                <div 
                  className="flex border border-white/10 rounded overflow-hidden shadow-lg h-8 select-none transition-all duration-100 shrink-0"
                  style={{ transform: `translateX(-${(100 - distance) * 0.4}px)` }}
                >
                  {/* Flipped orientation: South faces South */}
                  <span className="bg-blue-600 w-8 flex items-center justify-center text-[10px] font-black text-white">S</span>
                  <span className="bg-red-600 w-8 flex items-center justify-center text-[10px] font-black text-white">N</span>
                </div>
              </>
            )}

            {/* Labels */}
            {activeObj?.magnetic && poleMode === 'unlike' && distance < 45 && (
              <span className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-emerald-400 font-black animate-pulse uppercase tracking-wider">
                Magnetic Force (Attraction) 🧲
              </span>
            )}
            {poleMode === 'like' && distance < 45 && (
              <span className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-cyan-400 font-black animate-pulse uppercase tracking-wider">
                Repulsion Force (Like Poles S-S) ⚡
              </span>
            )}
          </div>

          {/* Slider distance controller */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>PROXIMITY DISTANCE (RULER)</span>
              <span className="font-mono">{distance} mm</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Diagnostic Console */}
          <div className="p-3 bg-slate-900 border border-white/5 rounded-lg text-[10px] text-slate-400 leading-normal font-semibold">
            {poleMode === 'unlike' ? (
              activeObj ? (
                <span><strong>Attraction Check:</strong> {activeObj.desc}</span>
              ) : (
                <span>Pick an object from the shelf to test if it attracts the magnet.</span>
              )
            ) : (
              <span><strong>Repulsion Check:</strong> South Pole meets South Pole. Like poles repel each other. When pushed together, the invisible magnetic fields generate a resistive force that pushes them back.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. CHAPTER 5: MEASUREMENT & MOTION LAB
// ==========================================
const MeasurementMotionSandbox = () => {
  const [activeTab, setActiveTab] = useState('measure'); // 'measure' | 'motion'
  
  // Measure game states
  const [userGuess, setUserGuess] = useState('');
  const [measureFeedback, setMeasureFeedback] = useState('');
  const [measureCorrect, setMeasureCorrect] = useState(false);

  // Motion states
  const [selectedMotion, setSelectedMotion] = useState('rectilinear');

  const checkMeasureGuess = () => {
    // Correct length is 18.5 - 2.0 = 16.5 cm
    const guessVal = parseFloat(userGuess);
    if (guessVal === 16.5) {
      setMeasureFeedback("Correct! ✓ 18.5 cm (end mark) - 2.0 cm (starting mark) = 16.5 cm. You correctly accounted for the broken edge offset!");
      setMeasureCorrect(true);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(15, 'Measurement Skill Acquired');
      authService.addTokens(4);
    } else {
      setMeasureFeedback(`Incorrect. Hint: Look at the start mark (2.0 cm) and the end mark (18.5 cm) and calculate the difference!`);
      setMeasureCorrect(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center bg-slate-900 p-1 border border-white/5 rounded-lg text-[8px] font-black uppercase">
        <button
          onClick={() => setActiveTab('measure')}
          className={`flex-1 py-1.5 rounded transition-all ${activeTab === 'measure' ? 'bg-purple-500 text-black shadow' : 'text-slate-400'}`}
        >
          Ruler Calibration (Class 6)
        </button>
        <button
          onClick={() => setActiveTab('motion')}
          className={`flex-1 py-1.5 rounded transition-all ${activeTab === 'motion' ? 'bg-purple-500 text-black shadow' : 'text-slate-400'}`}
        >
          Motion Classifications
        </button>
      </div>

      {activeTab === 'measure' ? (
        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
          <h6 className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Broken Ruler Alignment Challenge</h6>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            The ruler is broken at the zero mark. To measure the wooden bar, you align its left edge with the **2.0 cm** mark. The right edge reaches the **18.5 cm** mark.
          </p>

          {/* Visual ruler block */}
          <div className="relative h-16 bg-slate-900 border border-white/10 rounded-lg flex flex-col justify-end p-2 overflow-hidden select-none">
            {/* The Wooden Bar */}
            <div className="absolute left-[20%] right-[15%] top-2 h-4 bg-amber-700/80 rounded border border-amber-600 flex items-center justify-center text-[7px] font-black text-amber-200">
              WOODEN BAR
            </div>

            {/* Ruler markings */}
            <div className="w-full flex justify-between text-[8px] font-mono text-slate-500 border-t border-white/15 pt-1">
              <span>[X]</span>
              <span>1</span>
              <span className="text-cyan-400 font-black">2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
              <span>10</span>
              <span>12</span>
              <span>14</span>
              <span>16</span>
              <span className="text-rose-400 font-black">18.5</span>
              <span>20</span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex-1 space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Enter Actual Length (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.0"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 text-xs font-bold text-slate-200 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={checkMeasureGuess}
              className="py-2 px-4 bg-purple-500 hover:bg-purple-400 text-black text-[9px] font-black uppercase tracking-widest rounded mt-5"
            >
              Verify Length
            </button>
          </div>

          {measureFeedback && (
            <div className={`p-3 rounded text-[10px] font-semibold leading-relaxed ${
              measureCorrect ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {measureFeedback}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Motion selector list */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            {['rectilinear', 'circular', 'periodic'].map(m => (
              <button
                key={m}
                onClick={() => setSelectedMotion(m)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  selectedMotion === m 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">{m} Motion</span>
                <span className="text-[8px] font-semibold text-slate-500">
                  {m === 'rectilinear' ? "Straight Line" : m === 'circular' ? "Rotational" : "Repeating Cycle"}
                </span>
              </button>
            ))}
          </div>

          {/* Visual animation block */}
          <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
            <div className="h-28 bg-slate-900 border border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center select-none">
              <span className="absolute top-2 left-2 text-[7px] font-black text-slate-500 uppercase tracking-widest">Motion Simulator</span>

              {selectedMotion === 'rectilinear' && (
                <motion.div
                  animate={{ x: [-80, 80, -80] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="text-3xl"
                >
                  🚀
                </motion.div>
              )}

              {selectedMotion === 'circular' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="text-4xl w-10 h-10 flex items-center justify-center border-4 border-dashed border-cyan-400/40 rounded-full"
                >
                  🎡
                </motion.div>
              )}

              {selectedMotion === 'periodic' && (
                <motion.div
                  animate={{ rotate: [-40, 40, -40] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="h-16 w-1 bg-white/40 origin-top flex flex-col justify-end items-center"
                >
                  <span className="text-xl translate-y-3">🔔</span>
                </motion.div>
              )}
            </div>

            <div className="p-2.5 bg-slate-900 border border-white/5 rounded text-[9px] text-slate-400 font-semibold leading-relaxed">
              {selectedMotion === 'rectilinear' && "Rectilinear motion is travel along a straight path. Examples: a rocket launching straight up, or a train on straight tracks."}
              {selectedMotion === 'circular' && "Circular motion is travel in a circle around a central point, keeping a constant radius. Examples: a Ferris wheel, or the hands of a clock."}
              {selectedMotion === 'periodic' && "Periodic motion is movement that repeats in regular cycles over equal intervals of time. Examples: a swing, a pendulum, or guitar string vibrations."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. CHAPTER 6: MATERIALS PROPERTIES SORTER
// ==========================================
const MaterialsSorterSandbox = () => {
  const [selectedMaterial, setSelectedMaterial] = useState("Steel Key");

  const materials = {
    "Steel Key": { luster: "Lustrous (Shiny)", hardness: "Hard", solubility: "Insoluble", transparency: "Opaque", density: "Sinks in water", emoji: "🔑" },
    "Sponge block": { luster: "Dull", hardness: "Soft (Compressible)", solubility: "Insoluble", transparency: "Opaque", density: "Floats on water", emoji: "🧽" },
    "Glass Jar": { luster: "Dull/Lustrous", hardness: "Hard", solubility: "Insoluble", transparency: "Transparent", density: "Sinks in water", emoji: "🫙" },
    "Oiled Paper": { luster: "Dull", hardness: "Soft", solubility: "Insoluble", transparency: "Translucent (Blurry)", density: "Floats on water", emoji: "📝" },
    "Sugar Crystals": { luster: "Lustrous (Crystalline)", hardness: "Hard", solubility: "Soluble (Dissolves)", transparency: "Translucent/Opaque", density: "Sinks in water", emoji: "🧂" }
  };

  const active = materials[selectedMaterial];

  const handleTestXp = () => {
    xpService.awardXp(10, 'Material Property Inspection');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Experiment 6.1: Physical Properties Sorter
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Materials list */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Select Material</label>
          <div className="flex flex-col gap-1.5">
            {Object.keys(materials).map(name => (
              <button
                key={name}
                onClick={() => {
                  setSelectedMaterial(name);
                  handleTestXp();
                }}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  selectedMaterial === name 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-lg">{materials[name].emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-wider">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostics Table Grid */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3.5">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[9px] font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <span className="text-xl">{active.emoji}</span> {selectedMaterial} Diagnostics
            </span>
          </div>

          <div className="space-y-2 text-[9px] font-semibold leading-relaxed">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">LUSTER / SHINE</span>
              <strong className="text-cyan-400 font-black uppercase">{active.luster}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">HARDNESS</span>
              <strong className="text-amber-400 font-black uppercase">{active.hardness}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">WATER SOLUBILITY</span>
              <strong className="text-rose-400 font-black uppercase">{active.solubility}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">TRANSPARENCY</span>
              <strong className="text-purple-400 font-black uppercase">{active.transparency}</strong>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-400">WATER DENSITY</span>
              <strong className="text-emerald-400 font-black uppercase">{active.density}</strong>
            </div>
          </div>

          <div className="bg-slate-900 p-2.5 rounded border border-white/5 text-[9px] text-slate-500 font-semibold leading-normal">
            Classifying materials helps us select materials systematically. E.g., we use transparent glass for windows, and insoluble opaque metals for door keys.
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. CHAPTER 7: TEMPERATURE & MEASUREMENT
// ==========================================
const TemperatureSandbox = () => {
  const [temp, setTemp] = useState(20); // range -10 to 110

  const getLiquidColor = () => {
    if (temp <= 0) return 'bg-cyan-500/20 border-cyan-400';
    if (temp >= 80) return 'bg-red-500/30 border-red-400';
    return 'bg-blue-500/10 border-blue-400';
  };

  const getBeakerEffect = () => {
    if (temp <= 0) return "❄️ SOLID ICE BLOCK";
    if (temp >= 100) return "♨️ BOILING & STEAMING";
    if (temp >= 80) return "🥛 VERY HOT WATER";
    return "💧 LIQUID WATER";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Thermal Laboratory: Thermometer Calibration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Thermometers Render */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="flex justify-around items-end h-48 py-4 relative">
            {/* Lab Thermometer */}
            <div className="flex flex-col items-center relative h-full">
              <span className="text-[6px] text-slate-500 font-black uppercase mb-1">Laboratory (-10 to 110°C)</span>
              <div className="w-2.5 h-36 bg-slate-900 border border-white/10 rounded-full relative flex flex-col justify-end p-0.5">
                <div 
                  className="w-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ height: `${((temp - (-10)) / 120) * 100}%` }}
                />
              </div>
              <strong className="text-[10px] font-mono text-cyan-400 mt-1">{temp}°C</strong>
            </div>

            {/* Clinical Thermometer */}
            <div className="flex flex-col items-center relative h-full">
              <span className="text-[6px] text-slate-500 font-black uppercase mb-1">Clinical (35 to 42°C)</span>
              {temp > 42 ? (
                <div className="w-16 h-36 border-2 border-dashed border-red-500/40 rounded flex flex-col items-center justify-center p-2 text-center text-red-500 animate-pulse bg-red-950/20">
                  <ShieldAlert className="w-5 h-5 mb-1" />
                  <span className="text-[6px] font-black uppercase leading-tight">Cracked!<br />Mercury Spill Warning</span>
                </div>
              ) : (
                <>
                  <div className="w-2.5 h-36 bg-slate-900 border border-white/10 rounded-full relative flex flex-col justify-end p-0.5">
                    {/* Visual Kink lock */}
                    <div className="absolute bottom-8 left-0 right-0 h-1 bg-purple-500/80 z-10" title="Kink" />
                    <div 
                      className="w-full bg-red-500 rounded-full transition-all duration-300"
                      style={{ height: temp < 35 ? '0%' : `${((temp - 35) / 7) * 100}%` }}
                    />
                  </div>
                  <strong className="text-[10px] font-mono text-cyan-400 mt-1">
                    {temp < 35 ? "Below 35°C" : `${Math.min(42, temp)}°C`}
                  </strong>
                </>
              )}
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>WATER BEAKER HEAT</span>
              <span className="font-mono text-amber-400">{temp}°C</span>
            </div>
            <input
              type="range"
              min="-10"
              max="110"
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Liquid Beaker Visual and warnings */}
        <div className="md:col-span-5 space-y-4">
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 min-h-[120px] transition-all ${getLiquidColor()}`}>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Liquid Beaker Chamber</span>
            <span className="text-4xl">
              {temp <= 0 ? "🧊" : temp >= 100 ? "💨🥛" : "💧"}
            </span>
            <span className="text-[9px] font-black uppercase text-white">{getBeakerEffect()}</span>
          </div>

          {/* Warnings Panel */}
          <div className="p-3 bg-slate-900 border border-white/5 rounded-lg space-y-2 text-[9px] leading-relaxed font-semibold">
            {temp === 37 && (
              <div className="text-green-400 flex gap-1 items-start">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Normal body temperature level. Fits clinical calibration range.</span>
              </div>
            )}
            {temp > 42 && (
              <div className="text-red-400 flex gap-1 items-start">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 animate-bounce" />
                <span><strong>BURST HAZARD:</strong> Heating a clinical thermometer past 42°C causes the mercury to expand beyond the sealed capillary tube, cracking the glass bulb.</span>
              </div>
            )}
            {temp < 35 && (
              <div className="text-slate-500 flex gap-1 items-start">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Below clinical scale threshold (35°C). Clinical thermometer reads empty/inactive.</span>
              </div>
            )}
            <p className="text-slate-450 border-t border-white/5 pt-2">
              Clinical thermometers have a **kink** so that mercury doesn't fall down when removed from a patient's mouth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. CHAPTER 8: STATES OF WATER KINETICS
// ==========================================
const WaterStateSandbox = () => {
  const [temperature, setTemperature] = useState(25); // 0 to 100

  const getWaterPhase = () => {
    if (temperature < 0) return 'ice';
    if (temperature >= 100) return 'steam';
    return 'liquid';
  };

  const phase = getWaterPhase();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          States of Water: Molecular Kinetic Simulator
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Kinetic Box */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            <span className="absolute top-2 left-2 text-[7px] font-black text-slate-500 uppercase tracking-widest">
              H₂O Molecule Micro-chamber
            </span>

            {/* Draw 12 molecular dots */}
            <div className={`grid gap-4 w-40 h-28 items-center justify-center ${
              phase === 'ice' 
                ? 'grid-cols-4 select-none' 
                : phase === 'liquid' 
                ? 'grid-cols-4 animate-pulse'
                : 'flex flex-wrap relative animate-ping'
            }`}>
              {Array.from({ length: 12 }).map((_, idx) => {
                const getAnimSpeed = () => {
                  if (phase === 'ice') return 'animate-shake duration-1000';
                  if (phase === 'liquid') return 'animate-bounce';
                  return 'animate-ping duration-300';
                };

                return (
                  <motion.div
                    key={idx}
                    className={`w-3 h-3 rounded-full bg-cyan-400 border border-white/20 ${getAnimSpeed()}`}
                    style={{
                      transition: 'all 0.5s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>THERMAL KINETIC INPUT</span>
              <span className="font-mono text-cyan-400">{temperature}°C</span>
            </div>
            <input
              type="range"
              min="-15"
              max="115"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Phase descriptors */}
        <div className="md:col-span-5 space-y-4">
          <div className="glass-panel p-4 border-purple-500/20 shadow space-y-2 min-h-[140px]">
            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black uppercase rounded">
              Current State Details
            </span>
            {phase === 'ice' && (
              <div className="space-y-1.5 pt-1 text-[10px] text-slate-350">
                <h5 className="font-black text-white uppercase text-[11px]">Solid State (Ice)</h5>
                <p className="leading-relaxed">Molecules are locked in a rigid hexagonal lattice structure. Thermal energy is low, so they only vibrate in fixed positions.</p>
                <div className="text-cyan-400 font-bold uppercase text-[8px] pt-1">Melting point threshold: 0°C</div>
              </div>
            )}
            {phase === 'liquid' && (
              <div className="space-y-1.5 pt-1 text-[10px] text-slate-350">
                <h5 className="font-black text-white uppercase text-[11px]">Liquid State (Water)</h5>
                <p className="leading-relaxed">Molecules have enough kinetic energy to break rigid lattices. They move around fluidly, sliding over one another.</p>
                <div className="text-yellow-400 font-bold uppercase text-[8px] pt-1">Freezing threshold: 0°C | Boiling: 100°C</div>
              </div>
            )}
            {phase === 'steam' && (
              <div className="space-y-1.5 pt-1 text-[10px] text-slate-350">
                <h5 className="font-black text-white uppercase text-[11px]">Gaseous State (Steam/Vapor)</h5>
                <p className="leading-relaxed">High thermal kinetic energy. Intermolecular forces are broken, and water molecules fly rapidly, colliding and expanding.</p>
                <div className="text-rose-400 font-bold uppercase text-[8px] pt-1">Transition: Evaporation / Condensation</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. CHAPTER 9: METHODS OF SEPARATION
// ==========================================
const SeparationSandbox = () => {
  const [activeMixture, setActiveMixture] = useState('grain-husk'); // 'grain-husk' | 'brine-sand'
  const [selectedTools, setSelectedTools] = useState([]);
  const [separationState, setSeparationState] = useState('mixed'); // 'mixed' | 'winnowed' | 'filtered' | 'evaporated' | 'clean'

  const resetActivity = () => {
    setSelectedTools([]);
    setSeparationState('mixed');
  };

  useEffect(() => {
    resetActivity();
  }, [activeMixture]);

  const selectTool = (tool) => {
    if (activeMixture === 'grain-husk') {
      if (tool === 'Winnowing') {
        setSeparationState('clean');
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
        xpService.awardXp(15, 'Separation Method Perfected');
      } else {
        setSeparationState('incorrect');
      }
    } else {
      // Brine sand requires: Filtration first, then Evaporation
      const nextTools = [...selectedTools, tool];
      setSelectedTools(nextTools);

      if (nextTools.length === 1) {
        if (tool === 'Filtration') {
          setSeparationState('filtered');
        } else {
          setSeparationState('incorrect');
        }
      } else if (nextTools.length === 2) {
        if (nextTools[0] === 'Filtration' && tool === 'Evaporation') {
          setSeparationState('clean');
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
          xpService.awardXp(20, 'Compound Separation Mastery');
        } else {
          setSeparationState('incorrect');
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Chemistry Separator: Mixture Purification Lab
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Mixture Selector */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
              Choose Mixture
            </label>
            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-lg">
              <button
                onClick={() => setActiveMixture('grain-husk')}
                className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                  activeMixture === 'grain-husk' ? 'bg-purple-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wheat + Husk
              </button>
              <button
                onClick={() => setActiveMixture('brine-sand')}
                className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                  activeMixture === 'brine-sand' ? 'bg-purple-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sand + Salt Water
              </button>
            </div>
          </div>

          {/* Tools Box */}
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
              Click tool to apply
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Winnowing', 'Filtration', 'Evaporation'].map(tool => (
                <button
                  key={tool}
                  onClick={() => selectTool(tool)}
                  disabled={separationState === 'clean' || separationState === 'incorrect'}
                  className="p-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-white rounded-lg flex flex-col items-center justify-center text-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
                >
                  <span className="text-lg">
                    {tool === 'Winnowing' ? "💨" : tool === 'Filtration' ? "☕" : "🔥"}
                  </span>
                  <span className="text-[7px] font-black uppercase tracking-tight leading-none">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Window */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
          <div className="h-32 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center p-4 relative shadow-inner text-center">
            <span className="absolute top-2 left-2 text-[7px] font-black text-slate-500 uppercase tracking-widest">Simulation Chamber</span>

            {/* Grain husk animation */}
            {activeMixture === 'grain-husk' && (
              <div>
                {separationState === 'mixed' && (
                  <div>
                    <span className="text-4xl animate-bounce inline-block">🌾🍂</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">Grains mixed with light husk fibers</p>
                  </div>
                )}
                {separationState === 'incorrect' && (
                  <div>
                    <span className="text-4xl inline-block">❌🌾🍂</span>
                    <p className="text-[9px] text-red-400 font-black uppercase mt-2">Incorrect method! Grains are still mixed.</p>
                  </div>
                )}
                {separationState === 'clean' && (
                  <div>
                    <span className="text-4xl inline-block">🌾 ✨ 🍂💨</span>
                    <p className="text-[9px] text-green-400 font-black uppercase mt-2">Husk blown away! Pure wheat grains collected.</p>
                  </div>
                )}
              </div>
            )}

            {/* Brine Sand animation */}
            {activeMixture === 'brine-sand' && (
              <div>
                {separationState === 'mixed' && (
                  <div>
                    <span className="text-4xl inline-block">⏳🥛🧂</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">Salty water mixed with coarse sand</p>
                  </div>
                )}
                {separationState === 'filtered' && (
                  <div>
                    <span className="text-4xl inline-block">☕🥛🧂</span>
                    <p className="text-[9px] text-cyan-400 font-black uppercase mt-2">Sand filtered out! Clear salt water remains.</p>
                  </div>
                )}
                {separationState === 'clean' && (
                  <div>
                    <span className="text-4xl inline-block">🔥🍚💨</span>
                    <p className="text-[9px] text-green-400 font-black uppercase mt-2">Water evaporated! Pure salt crystals recovered.</p>
                  </div>
                )}
                {separationState === 'incorrect' && (
                  <div>
                    <span className="text-4xl inline-block">❌💥</span>
                    <p className="text-[9px] text-red-400 font-black uppercase mt-2">Separation out of order! Sand blocks evaporation.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {(separationState === 'clean' || separationState === 'incorrect') && (
            <button
              onClick={resetActivity}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Mixture
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. CHAPTER 10: LIFE CARE SANDBOX
// ==========================================
const LifeCharacteristicsSandbox = () => {
  const [nutrition, setNutrition] = useState(false);
  const [respiration, setRespiration] = useState(false);
  const [stimulus, setStimulus] = useState(false);
  const [excretion, setExcretion] = useState(false);
  const [scoreGranted, setScoreGranted] = useState(false);

  const resetActivity = () => {
    setNutrition(false);
    setRespiration(false);
    setStimulus(false);
    setExcretion(false);
    setScoreGranted(false);
  };

  const allCompleted = nutrition && respiration && stimulus && excretion;

  useEffect(() => {
    if (allCompleted && !scoreGranted) {
      setScoreGranted(true);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      xpService.awardXp(20, 'Life Processes Examined');
      authService.addTokens(5);
    }
  }, [allCompleted, scoreGranted]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Biology Laboratory: Seedling Growth Care
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Action Panel */}
        <div className="md:col-span-5 space-y-2.5">
          <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Apply Life Inputs</label>
          
          <button
            onClick={() => setNutrition(true)}
            className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
              nutrition 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">💧</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider">Supply Nutrition</span>
              <span className="text-[7px] text-slate-450 leading-tight">Pour water & add soil minerals</span>
            </div>
          </button>

          <button
            onClick={() => setRespiration(true)}
            className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
              respiration 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">🍃</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider">Air Respiration</span>
              <span className="text-[7px] text-slate-450 leading-tight">Provide oxygen flow inside cell tissues</span>
            </div>
          </button>

          <button
            onClick={() => setStimulus(true)}
            className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
              stimulus 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">⚡</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider">Trigger Stimulus</span>
              <span className="text-[7px] text-slate-450 leading-tight">Tap leaves to trigger response (folding)</span>
            </div>
          </button>

          <button
            onClick={() => setExcretion(true)}
            className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
              excretion 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-white/5 text-slate-350 hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">🍂</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-wider">Waste Excretion</span>
              <span className="text-[7px] text-slate-450 leading-tight">Shed old decaying cells to stay healthy</span>
            </div>
          </button>
        </div>

        {/* Animation Visualizer */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="h-36 bg-slate-900 border border-white/5 rounded-xl relative overflow-hidden flex flex-col items-center justify-center select-none text-center">
            <span className="absolute top-2 left-2 text-[7px] font-black text-slate-500 uppercase tracking-widest">Growth Matrix</span>

            {/* Growing plant stage */}
            <div className="text-4xl mt-3 transition-all duration-500 transform">
              {!nutrition && "🫘"}
              {nutrition && !respiration && "🌱"}
              {nutrition && respiration && !stimulus && "🌿"}
              {nutrition && respiration && stimulus && !excretion && "🪴"}
              {allCompleted && "🌸🪴"}
            </div>

            <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 px-4 leading-relaxed">
              {!nutrition && "Dormant Seed: Needs water & nutrients to begin germination."}
              {nutrition && !respiration && "Sprout: Needs respiration to convert glucose into cellular energy."}
              {nutrition && respiration && !stimulus && "Plant: Tap the leaves to check for active environmental reflex."}
              {nutrition && respiration && stimulus && !excretion && "Grown Plant: Needs to excrete metabolic wastes to bloom."}
              {allCompleted && "✓ Fully grown blooming plant! All core characteristics of life met! 🌟"}
            </p>
          </div>

          {allCompleted && (
            <button
              onClick={resetActivity}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Replant New Seed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 11. CHAPTER 11: NATURE'S TREASURES (REBUILT)
// ==========================================
const NaturalResourcesSandbox = () => {
  const [forestCover, setForestCover] = useState(100); // 0 to 100
  const [rainActive, setRainActive] = useState(false);
  const [erosionComplete, setErosionComplete] = useState(false);

  const triggerRain = () => {
    setRainActive(true);
    setTimeout(() => {
      setRainActive(false);
      setErosionComplete(true);
      if (forestCover < 50) {
        xpService.awardXp(10, 'Erosion Impact Recorded');
      } else {
        xpService.awardXp(15, 'Root Binding Confirmed');
      }
    }, 2500);
  };

  const getTopsoilIntegrity = () => {
    // Topsoil holds together based on forest cover
    if (erosionComplete) {
      return forestCover;
    }
    return 100;
  };

  const getRiverSilt = () => {
    if (erosionComplete) {
      return (100 - forestCover) * 6; // max 600 ppm
    }
    return 0;
  };

  const resetActivity = () => {
    setForestCover(100);
    setRainActive(false);
    setErosionComplete(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Ecology Laboratory: Forest Cover & Soil Erosion
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Visual Hillside Simulator */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between p-4">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest absolute top-2 left-2 z-10">
              Erosion Visualization Chamber
            </span>

            {/* Visual Landscape Elements */}
            <div className="flex justify-between items-end h-32 relative">
              {/* Forest trees based on cover */}
              <div className="flex gap-1.5 items-end z-10 pb-2">
                {Array.from({ length: Math.ceil(forestCover / 20) }).map((_, idx) => (
                  <span key={idx} className="text-3xl animate-pulse">🌲</span>
                ))}
                {forestCover === 0 && (
                  <span className="text-2xl filter grayscale">🏜️🪵</span>
                )}
              </div>

              {/* The river flow changing colors */}
              <div className={`w-24 h-16 rounded-tl-full flex flex-col items-center justify-center transition-all duration-500 z-5 border-l border-t border-white/10 ${
                erosionComplete && forestCover < 60 ? 'bg-amber-800/80 text-amber-200' : 'bg-cyan-600/80 text-cyan-200'
              }`}>
                <span className="text-[8px] font-black uppercase tracking-wider">River Bed</span>
                <span className="text-[6px] font-semibold">
                  {erosionComplete && forestCover < 60 ? "HIGH SILT / MUD" : "CLEAR WATER"}
                </span>
              </div>
            </div>

            {/* Rain animation overlay */}
            {rainActive && (
              <div className="absolute inset-0 bg-blue-950/40 flex flex-col items-center justify-center z-25 text-3xl select-none animate-pulse">
                🌧️🌧️🌧️
                <span className="text-[8px] font-black uppercase text-cyan-400 mt-1 tracking-widest">Heavy Precipitation Active</span>
              </div>
            )}
          </div>

          {/* Deforestation Slider */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[9px] font-black text-slate-400">
                <span>SLOPE FOREST COVER DEPLOYED</span>
                <span className="font-mono text-purple-400">{forestCover}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="20"
                value={forestCover}
                disabled={rainActive}
                onChange={(e) => {
                  setForestCover(parseInt(e.target.value));
                  setErosionComplete(false);
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <button
              onClick={triggerRain}
              disabled={rainActive}
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-black text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
            >
              Trigger Rain
            </button>
          </div>
        </div>

        {/* Diagnostics & Metrics Panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3.5 min-h-[140px] text-[10px] text-slate-350 leading-relaxed font-semibold">
            <span className="font-black text-[9px] uppercase tracking-wider text-amber-400 block border-b border-white/5 pb-1.5 flex items-center gap-1">
              <Trees className="w-3.5 h-3.5" /> Soil Cover Metrics
            </span>
            
            <div className="space-y-2 text-[9px] font-black">
              <div className="flex justify-between">
                <span className="text-slate-450 uppercase">Topsoil Retention:</span>
                <span className={getTopsoilIntegrity() < 50 ? 'text-rose-400' : 'text-green-400'}>{getTopsoilIntegrity()}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 uppercase">River Silt Level:</span>
                <span className={getRiverSilt() > 200 ? 'text-rose-400' : 'text-green-400'}>{getRiverSilt()} ppm</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-2 text-slate-400 font-semibold leading-relaxed">
              {erosionComplete ? (
                forestCover >= 60 ? (
                  <span className="text-green-400">✓ Excellent: Plant and tree roots firmly anchored the slope's topsoil. Clear river flow.</span>
                ) : (
                  <span className="text-red-400">⚠️ Landslide Risk: Low forest cover allowed heavy rains to strip the topsoil, generating high silt runoff.</span>
                )
              ) : (
                <span>Adjust the forest slider to plant trees, then click 'Trigger Rain' to run the diagnostic scan.</span>
              )}
            </div>
          </div>

          {erosionComplete && (
            <button
              onClick={resetActivity}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Landscaping
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. CHAPTER 12: BEYOND EARTH MOON PHASES
// ==========================================
const SpaceExplorerSandbox = () => {
  const [moonAngle, setMoonAngle] = useState(180); // slider 0 to 360

  const getMoonPhaseDetails = () => {
    const a = moonAngle;
    if (a < 22) return { name: "New Moon (Amawasya)", emoji: "🌑", desc: "The Moon lies between Earth and Sun. Its lit side is facing away from us, making it completely dark." };
    if (a < 67) return { name: "Waxing Crescent", emoji: "🌒", desc: "A thin curved silver sliver of the sunlit side begins to grow visible." };
    if (a < 112) return { name: "First Quarter (Half Moon)", emoji: "🌓", desc: "Half of the Moon's visible disk is illuminated by sunlight." };
    if (a < 157) return { name: "Waxing Gibbous", emoji: "🌔", desc: "More than half of the visible disk is lit and growing larger." };
    if (a < 202) return { name: "Full Moon (Poornima)", emoji: "🌕", desc: "Earth lies between Moon and Sun. The entire lit face of the Moon faces us." };
    if (a < 247) return { name: "Waning Gibbous", emoji: "🌖", desc: "The lit portion begins to shrink, showing more than half illuminated." };
    if (a < 292) return { name: "Third Quarter", emoji: "🌗", desc: "The opposite half of the Moon's disk is lit as it continues to shrink." };
    if (a < 337) return { name: "Waning Crescent", emoji: "🌘", desc: "A final thin sliver of light is visible before turning into a New Moon." };
    return { name: "New Moon (Amawasya)", emoji: "🌑", desc: "Completed the orbit. The Moon is once again dark and hidden." };
  };

  const phase = getMoonPhaseDetails();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
          Space Observatory: Moon Phase Orbit Simulator
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Orbit Graphics */}
        <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="relative h-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            {/* The Sun light rays from right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-yellow-500/20 to-transparent flex items-center justify-center">
              <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>

            {/* Earth Center */}
            <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center shadow-lg text-[10px] select-none z-10">
              🌍
            </div>

            {/* Moon Orbit ring */}
            <div className="absolute w-28 h-28 border border-dashed border-white/10 rounded-full" />

            {/* Orbiting Moon dot */}
            <div 
              className="absolute text-sm select-none transition-all duration-100 ease-out"
              style={{
                transform: `rotate(${moonAngle}deg) translate(56px) rotate(-${moonAngle}deg)`
              }}
            >
              🌑
            </div>
          </div>

          {/* Orbit Angle slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400">
              <span>MOON ORBIT ANGLE</span>
              <span className="font-mono text-yellow-400">{moonAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={moonAngle}
              onChange={(e) => setMoonAngle(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Phase preview display */}
        <div className="md:col-span-5 space-y-4">
          <div className="glass-panel p-4 border-purple-500/20 shadow text-center space-y-3 min-h-[140px] flex flex-col justify-center items-center">
            <span className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Earth view representation</span>
            <span className="text-5xl animate-pulse select-none">{phase.emoji}</span>
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-tight">{phase.name}</h5>
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5 leading-relaxed">{phase.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN EXPORTER WRAPPER COMPONENT
// ==========================================
const Class6ScienceSandbox = ({ chapterTitle, activeConcept }) => {
  const chLower = chapterTitle.toLowerCase();

  const renderSelectedSandbox = () => {
    if (chLower.includes('world of science') || chLower.includes('wonderful world')) {
      return <ScientificMethodSandbox />;
    }
    if (chLower.includes('diversity') || chLower.includes('living world')) {
      return <HabitatAdaptationSandbox />;
    }
    if (chLower.includes('mindful eating') || chLower.includes('healthy body') || chLower.includes('eating')) {
      return <BalancedDietSandbox />;
    }
    if (chLower.includes('magnet') || chLower.includes('poles')) {
      return <MagnetSandbox />;
    }
    if (chLower.includes('measurement') || chLower.includes('motion')) {
      return <MeasurementMotionSandbox />;
    }
    if (chLower.includes('material') || chLower.includes('materials around us')) {
      return <MaterialsSorterSandbox />;
    }
    if (chLower.includes('temperature') || chLower.includes('hot and cold')) {
      return <TemperatureSandbox />;
    }
    if (chLower.includes('water') || chLower.includes('states of water')) {
      return <WaterStateSandbox />;
    }
    if (chLower.includes('separation') || chLower.includes('mixture')) {
      return <SeparationSandbox />;
    }
    if (chLower.includes('living creatures') || chLower.includes('characteristics')) {
      return <LifeCharacteristicsSandbox />;
    }
    if (chLower.includes('treasure') || chLower.includes('natural resource')) {
      return <NaturalResourcesSandbox />;
    }
    if (chLower.includes('beyond earth') || chLower.includes('space')) {
      return <SpaceExplorerSandbox />;
    }

    // Default Fallback
    return (
      <div className="bg-slate-900 p-6 border border-white/5 rounded-xl space-y-4 text-center">
        <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
        <h5 className="text-xs font-black uppercase text-white">Concept Illustration</h5>
        <div className="p-4 bg-slate-950 border border-white/5 rounded-lg text-[11px] leading-relaxed text-slate-350">
          <strong className="text-cyan-400 block mb-1">Interactive Diagnostic:</strong>
          {activeConcept?.definition || "Explore the subtopics to trigger targeted laboratory simulations."}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 p-5 border border-white/10 rounded-xl space-y-5 text-left shadow-lg">
      <div className="space-y-0.5">
        <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
          Class 6 NCERT Science Laboratory
        </span>
        <h4 className="text-sm font-black uppercase text-white truncate">{chapterTitle}</h4>
        <p className="text-slate-400 text-[9px] font-semibold leading-relaxed">
          Interact with variables and sliders to visualize core experimental concepts.
        </p>
      </div>

      <div className="w-full pt-1">
        {renderSelectedSandbox()}
      </div>
    </div>
  );
};

export default Class6ScienceSandbox;
