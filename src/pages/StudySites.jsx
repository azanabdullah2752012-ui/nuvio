import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, Plus, Search, 
  Trash2, Filter, Globe, BookOpen,
  Code, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const StudySites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('study_sites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSites(data);
    setLoading(false);
  };

  const addSite = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = authService.me();

    const newSite = {
      user_id: user.id,
      title: formData.get('title'),
      url: formData.get('url'),
      category: formData.get('category')
    };

    const { data, error } = await supabase.from('study_sites').insert([newSite]).select();
    if (data) {
      setSites([data[0], ...sites]);
      setShowAdd(false);
    }
  };

  const deleteSite = async (id) => {
    const { error } = await supabase.from('study_sites').delete().eq('id', id);
    if (!error) setSites(sites.filter(s => s.id !== id));
  };

  const categories = ['All', 'General', 'Math', 'Dev', 'Science'];

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <Globe className="w-10 h-10 text-nuvio-blue" />
            Study Sites
          </h1>
          <p className="text-text-secondary font-medium mt-1">Cloud-synced library of your essential academic portals.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="nv-btn-primary px-8 gap-3 h-14 bg-nuvio-blue hover:bg-nuvio-blue/80 shadow-xl shadow-nuvio-blue/20">
          <Plus className="w-5 h-5" /> Add Resource
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter(c)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
              ${filter === c ? 'bg-nuvio-blue text-white shadow-lg' : 'bg-white/5 text-text-muted hover:bg-white/10'}
            `}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {sites.filter(s => filter === 'All' || s.category === filter).map((site, i) => (
            <motion.div 
              key={site.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="nv-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-nuvio-blue/10 rounded-xl">
                    {site.category === 'Math' ? <GraduationCap className="w-6 h-6 text-nuvio-blue" /> : <BookOpen className="w-6 h-6 text-nuvio-blue" />}
                  </div>
                  <button onClick={() => deleteSite(site.id)} className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-nuvio-red transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">{site.title}</h3>
                   <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 opacity-50 truncate">{site.url}</div>
                </div>
              </div>

              <div className="mt-8">
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  Launch Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="py-20 text-center animate-pulse opacity-20">
          <Globe className="w-12 h-12 mx-auto mb-4" />
          <p className="text-xs font-black uppercase tracking-widest">Residuing cloud archives...</p>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-background-base/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="nv-card w-full max-w-md p-10 space-y-8 relative z-10">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">New Portal</h2>
              <form onSubmit={addSite} className="space-y-6">
                <input name="title" required placeholder="Resource Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-blue" />
                <input name="url" required placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-blue" />
                <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-blue">
                  {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="w-full nv-btn-primary h-14 uppercase tracking-widest text-xs bg-nuvio-blue">Link to Cloud</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudySites;
