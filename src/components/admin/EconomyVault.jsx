import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Sliders, Save, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { notificationService } from '../../services/notificationService';

const EconomyVault = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    total_tokens: 0,
    total_xp: 0,
    avg_balance: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: configData } = await supabase.from('system_config').select('*');
    const { data: profileStats } = await supabase.from('profiles').select('era_tokens, xp');
    
    if (configData) setConfigs(configData);
    if (profileStats) {
      const tokens = profileStats.reduce((sum, p) => sum + (p.era_tokens || 0), 0);
      const xp = profileStats.reduce((sum, p) => sum + (p.xp || 0), 0);
      setStats({
        total_tokens: tokens,
        total_xp: xp,
        avg_balance: Math.floor(tokens / profileStats.length)
      });
    }
    setLoading(false);
  };

  const updateConfig = async (key, newValue) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_config')
        .update({ value: newValue })
        .eq('key', key);

      if (!error) {
        notificationService.send("Neural Adjustment", `Global ${key} updated to ${newValue}.`, "success");
        // Log the change
        await supabase.from('admin_logs').insert([{
          action_type: 'CONFIG_CHANGE',
          target_id: key,
          details: `Changed multiplier to ${newValue}`
        }]);
        fetchData();
      }
    } catch (err) {
      console.error("Config update failure:", err);
    } finally {
      setSaving(false);
    }
  };

  const ConfigSlider = ({ label, configKey, currentVal, unit = 'x' }) => (
    <div className="nv-card p-8 border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h4 className="text-sm font-black text-white uppercase tracking-widest">{label}</h4>
           <div className="text-[10px] text-text-muted font-bold mt-1 uppercase">Global Modifier Protocol</div>
        </div>
        <div className="text-2xl font-black text-nuvio-yellow">{currentVal}{unit}</div>
      </div>
      
      <div className="space-y-6">
        <input 
          type="range" 
          min="0.5" 
          max="5.0" 
          step="0.1"
          value={currentVal}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setConfigs(prev => prev.map(c => c.key === configKey ? { ...c, value: val } : c));
          }}
          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-nuvio-yellow"
        />
        <div className="flex justify-between text-[8px] font-black text-text-muted uppercase tracking-widest">
           <span>0.5x (Safe)</span>
           <span>5.0x (Hyperinflation)</span>
        </div>
        <button 
          onClick={() => updateConfig(configKey, currentVal)}
          disabled={saving}
          className="w-full py-3 bg-nuvio-yellow/10 hover:bg-nuvio-yellow text-nuvio-yellow hover:text-black border border-nuvio-yellow/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          {saving ? 'Synchronizing...' : 'Apply Neural Multiplier'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 🪙 INFLATION MONITOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Circulating Tokens', val: stats.total_tokens, icon: Coins, color: 'text-nuvio-blue' },
           { label: 'Global XP Mass', val: stats.total_xp, icon: TrendingUp, color: 'text-nuvio-yellow' },
           { label: 'Avg Node Wealth', val: stats.avg_balance, icon: Sliders, color: 'text-nuvio-green' }
         ].map((stat, i) => (
           <div key={i} className="nv-card p-6 border-white/5 bg-white/[0.02]">
             <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
             <div className="text-2xl font-black text-white">{stat.val.toLocaleString()}</div>
             <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
           </div>
         ))}
      </div>

      {/* ⚙️ CONFIGURATION HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConfigSlider 
          label="Global XP Multiplier" 
          configKey="xp_multiplier" 
          currentVal={configs.find(c => c.key === 'xp_multiplier')?.value || 1.0} 
        />
        <ConfigSlider 
          label="Token Generation Rate" 
          configKey="token_rate" 
          currentVal={configs.find(c => c.key === 'token_rate')?.value || 1.0} 
        />
      </div>

      <div className="nv-card p-6 border-nuvio-blue/20 bg-nuvio-blue/5 flex items-center gap-4">
         <Info className="w-10 h-10 text-nuvio-blue opacity-50" />
         <div>
            <p className="text-xs font-bold text-nuvio-blue/80 leading-relaxed uppercase tracking-tighter">
              The Economy Vault regulates the neural reward kernel. Adjusting multipliers will affect the progress velocity of all 10,000+ nodes in real-time. Use caution to prevent asset devaluation.
            </p>
         </div>
      </div>
    </div>
  );
};

export default EconomyVault;
