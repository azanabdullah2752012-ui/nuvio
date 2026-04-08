import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Coins, Sparkles, 
  ChevronRight, Lock, Check, Gift, Zap, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { authService } from '../services/authService';

const Shop = () => {
  const [user, setUser] = useState(authService.me());
  const [isScratching, setIsScratching] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const handleAuth = (e) => setUser(e.detail);
    window.addEventListener('nuvio_auth_change', handleAuth);
    return () => window.removeEventListener('nuvio_auth_change', handleAuth);
  }, []);

  const tokens = user?.era_tokens || 0;

  const shopItems = [
    { id: 1, name: 'Cosmic Border', price: 500, type: 'Border', rarity: 'Rare', icon: '✨' },
    { id: 2, name: 'Dragon Mascot', price: 1200, type: 'Avatar', rarity: 'Epic', icon: '🐲' },
    { id: 3, name: 'Glass Theme', price: 800, type: 'Theme', rarity: 'Legendary', icon: '🎨' },
    { id: 10, name: 'Streak Shield', price: 300, type: 'PowerUp', rarity: 'Common', icon: '🛡️' },
    { id: 11, name: 'XP Overdrive (1hr)', price: 750, type: 'PowerUp', rarity: 'Rare', icon: '⚡' },
    { id: 12, name: 'Ancient Scroll', price: 400, type: 'Item', rarity: 'Uncommon', icon: '📜' },
  ];

  const handleScratch = () => {
    if (tokens < 100 || isScratching) return;
    
    setIsScratching(true);
    const updatedUser = authService.updateMe({ era_tokens: tokens - 100 });
    setUser(updatedUser);

    setTimeout(() => {
      // Re-balanced Odds: High risk of small loss or break-even
      const roll = Math.random();
      let win = 0;
      
      if (roll < 0.45) win = Math.floor(Math.random() * 20) + 10; // 45% chance: Losing 70-90 tokens
      else if (roll < 0.75) win = 100; // 30% chance: Break-even
      else if (roll < 0.90) win = 250; // 15% chance: Small Profit
      else if (roll < 0.98) win = 500; // 8% chance: Big Profit
      else win = 1000; // 2% chance: Jackpot
      
      setReward(win);
      setScratched(true);
      setIsScratching(false);
      
      authService.updateMe({ era_tokens: updatedUser.era_tokens + win });

      if (win >= 250) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#eab308', '#8b5cf6', '#3b82f6']
        });
      }
    }, 1500);
  };

  const buyItem = (item) => {
    if (tokens < item.price) return;
    const inventory = user.inventory || [];
    if (inventory.includes(item.id)) {
      alert("You already own this!");
      return;
    }
    
    authService.updateMe({ 
      era_tokens: tokens - item.price,
      inventory: [...inventory, item.id]
    });
    alert(`Success! Unlocked ${item.name}`);
  };

  return (
    <div className="space-y-12 pb-20 nv-page-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-nuvio-purple-400" />
            Elite Store
          </h1>
          <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mt-1">Enhance your profile & protect your progress</p>
        </div>
        <div className="flex items-center gap-3 bg-nuvio-yellow/10 border border-nuvio-yellow/20 px-8 py-4 rounded-3xl">
          <Coins className="w-6 h-6 text-nuvio-yellow fill-nuvio-yellow/50" />
          <span className="text-3xl font-black text-nuvio-yellow tabular-nums">{tokens.toLocaleString()}</span>
        </div>
      </div>

      {/* Lucky Card */}
      <section className="nv-card bg-[#1a1a24] border-nuvio-purple-500/20 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nuvio-purple-500/5 blur-[100px] pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-nuvio-purple-500/10 text-nuvio-purple-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-nuvio-purple-500/20">
              High Risk / High Reward
            </div>
            <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">Lucky Ticket</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm font-bold opacity-70">
              Test your luck for 100 Tokens. Win up to <span className="text-nuvio-yellow text-lg font-black italic">1,000 TOKENS</span> or exclusive items.
            </p>
            <button 
              onClick={handleScratch}
              disabled={tokens < 100 || isScratching}
              className="nv-btn-primary px-12 py-5 shadow-2xl shadow-nuvio-purple-500/30 disabled:opacity-50"
            >
              Scratch for 100 <Coins className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[4/3] bg-background-base rounded-[32px] border-4 border-dashed border-white/5 p-4 overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {!scratched ? (
                  <motion.div 
                    key="scratch"
                    className="w-full h-full bg-[#2a2a3a] flex flex-col items-center justify-center gap-4 text-center cursor-pointer group rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Gift className={`w-16 h-16 text-nuvio-purple-400 transition-all ${isScratching ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                    <div className="text-xs font-black text-white uppercase tracking-widest">
                      {isScratching ? 'SCRATCHING...' : 'SCRATCH HERE'}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="reward"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full bg-nuvio-yellow/5 flex flex-col items-center justify-center gap-6 text-center rounded-2xl"
                  >
                    <Sparkles className="w-14 h-14 text-nuvio-yellow animate-pulse" />
                    <div>
                      <div className="text-[10px] font-black text-nuvio-yellow uppercase tracking-widest mb-1 opacity-70">PAYOUT</div>
                      <div className="text-5xl font-black text-white uppercase tracking-tighter">
                        +{reward}
                      </div>
                    </div>
                    <button 
                      onClick={() => setScratched(false)}
                      className="text-[10px] font-black text-nuvio-purple-400 hover:text-nuvio-purple-300 transition-colors uppercase tracking-[0.2em]"
                    >
                      Play Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item) => {
            const isOwned = user?.inventory?.includes(item.id);
            return (
              <motion.div 
                key={item.id}
                whileHover={{ y: -6 }}
                className="nv-card p-0 overflow-hidden group border-white/5 hover:border-nuvio-purple-500/30 shadow-lg"
              >
                <div className="p-10 flex flex-col items-center gap-6 bg-white/[0.02] border-b border-white/5">
                  <div className="text-6xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 opacity-70">
                      {item.rarity} {item.type}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{item.name}</h3>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-nuvio-yellow" />
                    <span className="font-black text-white text-lg">{item.price}</span>
                  </div>
                  {isOwned ? (
                    <span className="text-[10px] font-black text-nuvio-green uppercase flex items-center gap-2">
                      <Check className="w-4 h-4" /> Owned
                    </span>
                  ) : (
                    <button 
                      onClick={() => buyItem(item)}
                      disabled={tokens < item.price}
                      className="nv-btn-primary px-8 h-10 text-[10px] uppercase rounded-xl disabled:opacity-30"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
