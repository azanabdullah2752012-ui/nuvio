import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, Star, Shield, 
  Coins, CheckCircle2, ShoppingCart, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';

const Shop = () => {
  const [user, setUser] = useState(authService.me());
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boostTimeLeft, setBoostTimeLeft] = useState('');

  const shopItems = [
    { id: 'xp_boost', name: 'XP Overdrive', price: 1000, icon: Zap, color: 'text-nuvio-yellow', desc: 'Double XP for the next 4 hours.' },
    { id: 'golden_rim', name: 'Aura Aura', price: 2500, icon: Star, color: 'text-nuvio-purple-400', desc: 'A legendary golden profile border.' },
    { id: 'streak_shield', name: 'Streak Aegis', price: 1500, icon: Shield, color: 'text-nuvio-blue', desc: 'Protects your streak for 1 missed day.' },
    { id: 'divine_avatar', name: 'Divine Cipher', price: 5000, icon: ShoppingBag, color: 'text-nuvio-red', desc: 'Unlock the exclusive Mythic avatar set.' },
  ];

  useEffect(() => {
    fetchInventory();
    
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('acadevance_stats_update', handleUpdate);
    return () => window.removeEventListener('acadevance_stats_update', handleUpdate);
  }, []);

  // Timer for XP boost countdown
  useEffect(() => {
    const checkBoost = () => {
      const expires = localStorage.getItem('acadevance_xp_boost_expires');
      if (expires) {
        const diff = Number(expires) - Date.now();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setBoostTimeLeft(`${hours}h ${mins}m ${secs}s`);
        } else {
          setBoostTimeLeft('');
        }
      } else {
        setBoostTimeLeft('');
      }
    };

    checkBoost();
    const timer = setInterval(checkBoost, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchInventory = async () => {
    const data = await dataService.list('inventory');
    if (data) setInventory(data.map(i => i.item_id));
    setLoading(false);
  };

  const buyItem = async (item) => {
    if (user.era_tokens < item.price) {
      notificationService.send("Tokens Insufficient", "Keep studying to earn more Era Tokens! ⚡", "error");
      return;
    }

    const isUnique = ['golden_rim', 'divine_avatar'].includes(item.id);
    if (isUnique && inventory.includes(item.id)) {
      notificationService.send("Already Acquired", `You already own the ${item.name}!`, "info");
      return;
    }

    // 1. Deduct Tokens locally and attempt sync
    await authService.addTokens(-item.price);
    
    // 2. Add to Inventory
    await dataService.create('inventory', { item_id: item.id });
    
    setInventory(prev => [...prev, item.id]);

    // Apply special activation logic
    if (item.id === 'xp_boost') {
      const currentExpires = localStorage.getItem('acadevance_xp_boost_expires');
      let newExpires = Date.now() + 4 * 60 * 60 * 1000;
      if (currentExpires && Number(currentExpires) > Date.now()) {
        newExpires = Number(currentExpires) + 4 * 60 * 60 * 1000; // extend duration
      }
      localStorage.setItem('acadevance_xp_boost_expires', String(newExpires));
      notificationService.send("XP Boost Activated", "2x XP Overdrive active for next 4 hours! ⚡", "success");
    } else {
      notificationService.send("Purchase Complete", `Successfully acquired: ${item.name}! 🎁`, "success");
    }
  };

  // Group inventory items by count for duplicate items like streak shields
  const groupedInventory = inventory.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-nuvio-purple-400" />
            Academy Shop
          </h1>
          <p className="text-text-secondary font-medium mt-1">Exchange your hard-earned tokens for academy power-ups.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-nuvio-yellow/5">
          <Coins className="w-6 h-6 text-nuvio-yellow" />
          <span className="text-3xl font-black text-white tabular-nums">{user.era_tokens?.toLocaleString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map((item, i) => {
          const isOwned = inventory.includes(item.id);
          const isUnique = ['golden_rim', 'divine_avatar'].includes(item.id);
          const isBoostActive = item.id === 'xp_boost' && boostTimeLeft !== '';

          // Determine button display properties
          let buttonText = `${item.price} Tokens`;
          let isDisabled = false;
          let buttonClass = 'bg-white/5 border border-white/10 text-white hover:bg-nuvio-purple-500 hover:border-nuvio-purple-400';

          if (isUnique && isOwned) {
            buttonText = 'OWNED';
            isDisabled = true;
            buttonClass = 'bg-nuvio-green/20 text-nuvio-green border border-nuvio-green/30 cursor-default';
          } else if (item.id === 'xp_boost' && isBoostActive) {
            buttonText = `Active: ${boostTimeLeft}`;
            isDisabled = false; // allow extension
            buttonClass = 'bg-gradient-to-r from-nuvio-yellow/20 to-nuvio-purple-500/20 text-nuvio-yellow border border-nuvio-yellow/30 hover:from-nuvio-yellow hover:to-nuvio-purple-500 hover:text-black';
          }

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`nv-card p-8 border-white/5 group relative ${isUnique && isOwned ? 'opacity-70 grayscale' : ''}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
              
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.name}</h3>
                <p className="text-xs text-text-muted font-medium leading-relaxed">{item.desc}</p>
              </div>

              <button 
                onClick={() => buyItem(item)}
                disabled={isDisabled}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${buttonClass}`}
              >
                {isUnique && isOwned ? (
                  <span className="flex items-center justify-center gap-2 italic">
                    <CheckCircle2 className="w-4 h-4" /> OWNED
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> {buttonText}
                  </span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Inventory Section */}
      <div className="nv-card p-10 border-white/5 bg-white/[0.02] rounded-[24px]">
        <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-8">Your Cloud Inventory</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(groupedInventory).map(([id, count]) => {
            const item = shopItems.find(i => i.id === id);
            return (
              <div key={id} className="px-6 py-3 bg-nuvio-purple-600/20 border border-nuvio-purple-500/30 rounded-full flex items-center gap-3">
                {item && <item.icon className={`w-4 h-4 ${item.color}`} />}
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {item ? item.name : id} {count > 1 ? `x${count}` : ''}
                </span>
              </div>
            );
          })}
          {inventory.length === 0 && (
            <div className="flex items-center gap-3 text-text-muted opacity-30 italic text-xs uppercase font-bold px-4">
              <Lock className="w-4 h-4" /> No items acquired in the current learning cycle...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
