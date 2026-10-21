import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, Plus, Trash2, Globe, BookOpen,
  GraduationCap, X, ChevronRight, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const DEFAULT_RESOURCES = [
  { id: 'res-1', title: 'NCERT Official Textbooks', url: 'https://ncert.nic.in/textbook.php', category: 'CBSE Core', desc: 'Digital editions of all official Class 9 textbooks and solutions.' },
  { id: 'res-2', title: 'CBSE Academic Repository', url: 'https://cbseacademic.nic.in', category: 'Curriculum', desc: 'Syllabus guidelines, sample question papers, and marking schemes.' },
  { id: 'res-3', title: 'Khan Academy Science & Math', url: 'https://www.khanacademy.org', category: 'Concept Video', desc: 'Interactive visual models for mathematics and physical sciences.' },
  { id: 'res-4', title: 'Wolfram Alpha Computation', url: 'https://www.wolframalpha.com', category: 'Math Engine', desc: 'Step-by-step algebraic solver and coordinate geometry plotter.' }
];

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
    try {
      const data = await dataService.list('study_sites');
      if (data && data.length > 0) {
        setSites(data);
      } else {
        setSites(DEFAULT_RESOURCES);
        for (const item of DEFAULT_RESOURCES) {
          await dataService.create('study_sites', item);
        }
      }
    } catch (err) {
      setSites(DEFAULT_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  const addSite = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSite = {
      title: formData.get('title'),
      url: formData.get('url'),
      category: formData.get('category') || 'General',
      desc: formData.get('desc') || 'Academic reference link.'
    };

    try {
      const saved = await dataService.create('study_sites', newSite);
      setSites([saved, ...sites]);
      setShowAdd(false);
      notificationService.send("Resource Saved", `"${newSite.title}" added to academic index.`, "success");
    } catch (err) {
      notificationService.send("Save Error", "Could not persist bookmark.", "error");
    }
  };

  const deleteSite = async (id, e) => {
    e?.stopPropagation();
    try {
      await dataService.delete('study_sites', id);
      setSites(sites.filter(s => s.id !== id));
      notificationService.send("Resource Removed", "Link excised from index.", "info");
    } catch (err) {
      console.warn("Delete failed:", err);
    }
  };

  const categories = ['All', 'CBSE Core', 'Curriculum', 'Concept Video', 'Math Engine', 'General'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Reference Index / Academic Portals
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Study Bookmarks
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Curated repository of official CBSE portals, interactive calculation tools, and textbook archives.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)] self-start sm:self-end"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </header>

      {/* CATEGORY FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all border whitespace-nowrap ${
              filter === c
                ? 'border-[#1b3b2b] bg-[#1b3b2b] text-white font-bold shadow-sm'
                : 'border-[#e5e1d5] bg-white text-[#52504a] hover:bg-[#f5f3ec] hover:text-[#1a1917]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SITES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites
          .filter(s => filter === 'All' || s.category === filter)
          .map((site) => (
            <div
              key={site.id}
              className="p-6 border border-[#e5e1d5] bg-white hover:border-[#1b3b2b]/40 rounded-2xl transition-all flex flex-col justify-between h-56 group shadow-[0_2px_12px_rgba(27,59,43,0.03)]"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#1b3b2b] bg-[#1b3b2b]/10 px-2 py-0.5 rounded font-bold">
                    {site.category || 'Reference'}
                  </span>
                  <button
                    onClick={(e) => deleteSite(site.id, e)}
                    className="p-1 text-[#827f76] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1a1917] group-hover:text-[#1b3b2b] transition-colors line-clamp-1">
                    {site.title}
                  </h3>
                  <p className="text-xs text-[#52504a] mt-1 leading-relaxed line-clamp-2">
                    {site.desc || site.url}
                  </p>
                </div>
              </div>

              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pt-3 border-t border-[#e5e1d5] flex items-center justify-between font-mono text-[11px] text-[#52504a] group-hover:text-[#1a1917] transition-colors"
              >
                <span className="truncate max-w-[200px] text-[#827f76] font-mono text-[10px]">
                  {site.url.replace(/^https?:\/\//, '')}
                </span>
                <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] text-[#1b3b2b]">
                  Launch <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          ))}
      </div>

      {/* MODAL: ADD RESOURCE */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 border border-[#e5e1d5] bg-white rounded-2xl space-y-6 shadow-2xl font-sans"
            >
              <div className="flex justify-between items-center border-b border-[#e5e1d5] pb-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#1b3b2b] font-semibold">Academic Reference</span>
                  <h3 className="font-serif text-xl font-bold text-[#1a1917] mt-0.5">Add Resource Bookmark</h3>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-1 text-[#827f76] hover:text-[#1a1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={addSite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">Portal Title</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. NCERT Exemplar Solutions"
                    className="w-full px-4 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-xs text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">URL Address</label>
                  <input
                    name="url"
                    required
                    type="url"
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-xs text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">Category Tag</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-xs font-mono uppercase text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  >
                    {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">Brief Description</label>
                  <input
                    name="desc"
                    placeholder="Brief notes on resource content"
                    className="w-full px-4 py-2.5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-xs text-[#1a1917] focus:outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
                >
                  Commit Bookmark
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudySites;