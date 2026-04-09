import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, Star, Shield, 
  Coins, CheckCircle2, ShoppingCart, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';

const Shop = () => {
  const [user, setUser] = useState(authService.me());
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const shopItems = [
    { id: 'xp_boost', name: 'XP Overdrive', price: 1000, icon: Zap, color: 'text-nuvio-yellow', desc: 'Double XP for the next 4 hours.' },
    { id: 'golden_rim', name: 'Aura Aura', price: 2500, icon: Star, color: 'text-nuvio-purple-400', desc: 'A legendary golden profile border.' },
    { id: 'streak_shield', name: 'Streak Aegis', price: 1500, icon: Shield, color: 'text-nuvio-blue', desc: 'Protects your streak for 1 missed day.' },
    { id: 'divine_avatar', name: 'Divine Cipher', price: 5000, icon: ShoppingBag, color: 'text-nuvio-red', desc: 'Unlock the exclusive Mythic avatar set.' },
  ];

  useEffect(() => {
    fetchInventory();
    
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('nuvio_stats_update', handleUpdate);
    return () => window.removeEventListener('nuvio_stats_update', handleUpdate);
  }, []);

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('user_inventory')
      .select('item_id')
      .eq('user_id', user.id);
    if (data) setInventory(data.map(i => i.item_id));
    setLoading(false);
  };

  const buyItem = async (item) => {
    if (user.era_tokens < item.price) {
      alert("Insufficient Era Tokens! Keep studying to earn more. ⚡");
      return;
    }

    if (inventory.includes(item.id)) {
      alert("You already own this item!");
      return;
    }

    // 1. Deduct Tokens
    const { error: tokenError } = await supabase
      .from('profiles')
      .update({ era_tokens: user.era_tokens - item.price })
      .eq('id', user.id);

    if (tokenError) return;

    // 2. Add to Inventory
    const { error: invError } = await supabase
      .from('user_inventory')
      .insert([{ user_id: user.id, item_id: item.id }]);

    if (!invError) {
      setInventory([...inventory, item.id]);
      authService.addTokens(-item.price); // Sync local state
      alert(`Success! Unlocked: ${item.name} 🛡️`);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-nuvio-purple-400" />
            Academy Shop
          </h1>
          <p className="text-text-secondary font-medium mt-1">Exchange your hard-earned tokens for neural power-ups.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-nuvio-yellow/5">
          <Coins className="w-6 h-6 text-nuvio-yellow" />
          <span className="text-3xl font-black text-white tabular-nums">{user.era_tokens?.toLocaleString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map((item, i) => {
          const isOwned = inventory.includes(item.id);
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`nv-card p-8 border-white/5 group relative ${isOwned ? 'opacity-70 grayscale' : ''}`}
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
                disabled={isOwned}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${isOwned 
                    ? 'bg-nuvio-green/20 text-nuvio-green border border-nuvio-green/30 cursor-default' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-nuvio-purple-500 hover:border-nuvio-purple-400'}
                `}
              >
                {isOwned ? (
                  <span className="flex items-center justify-center gap-2 italic"><CheckCircle2 className="w-4 h-4" /> OWNED</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> {item.price} Tokens</span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Inventory Section */}
      <div className="nv-card p-10 border-white/5 bg-white/[0.02]">
        <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-8">Your Cloud Inventory</h3>
        <div className="flex flex-wrap gap-4">
          {inventory.map(id => {
            const item = shopItems.find(i => i.id === id);
            return (
              <div key={id} className="px-6 py-3 bg-nuvio-purple-600/20 border border-nuvio-purple-500/30 rounded-full flex items-center gap-3">
                {item && <item.icon className={`w-4 h-4 ${item.color}`} />}
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{item ? item.name : id}</span>
              </div>
            );
          })}
          {inventory.length === 0 && (
            <div className="flex items-center gap-3 text-text-muted opacity-30 italic text-xs uppercase font-bold px-4">
              <Lock className="w-4 h-4" /> No items acquired in the current neural cycle...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
