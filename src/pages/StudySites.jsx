import React from 'react';
import { 
  ExternalLink, Globe, Search, 
  Star, Bookmark, Share2, 
  BookOpen, Plus, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudySites = () => {
  const sites = [
    { title: 'Khan Academy', desc: 'Expert-led lessons on every subject imaginable.', url: 'https://khanacademy.org', category: 'General', rating: 4.9, icon: '🏫' },
    { title: 'Wolfram Alpha', desc: 'Computational intelligence for math and science.', url: 'https://wolframalpha.com', category: 'Math', rating: 4.8, icon: '📐' },
    { title: 'Brilliant.org', desc: 'Interactive learning for STEM subjects.', url: 'https://brilliant.org', category: 'Science', rating: 4.7, icon: '💡' },
    { title: 'Coursera', desc: 'Professional courses from world-class universities.', url: 'https://coursera.org', category: 'Courses', rating: 4.6, icon: '🏛️' },
    { title: 'Quizlet', desc: 'Crowdsourced flashcards and study sets.', url: 'https://quizlet.com', category: 'Study Tools', rating: 4.5, icon: '🃏' },
    { title: 'Duolingo', desc: 'Gamified language learning for everyone.', url: 'https://duolingo.com', category: 'Languages', rating: 4.9, icon: '🦉' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3 uppercase tracking-tighter">
            <Globe className="w-8 h-8 text-nuvio-blue" />
            Study Sites
          </h1>
          <p className="text-text-secondary text-sm">A curated portal to the best educational resources on the web.</p>
        </div>
        <button className="nv-btn-primary gap-2">
          <Plus className="w-4 h-4" /> Suggest Site
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search resources by name or subject..."
            className="w-full bg-background-card border border-border rounded-[16px] py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-nuvio-blue transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'Math', 'Science', 'Languages', 'History'].map(cat => (
            <button key={cat} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${cat === 'All' ? 'bg-nuvio-blue border-nuvio-blue text-white' : 'bg-white/5 border-border text-text-muted hover:text-text-primary'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site, i) => (
          <motion.div
            key={site.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="nv-card p-0 flex flex-col group hover:border-nuvio-blue/30 transition-all border-white/5"
          >
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {site.icon}
                </div>
                <button className="p-2 text-text-muted hover:text-nuvio-yellow transition-all">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              
              <div>
                <div className="text-[10px] font-black text-nuvio-blue uppercase tracking-widest mb-1">{site.category}</div>
                <h3 className="text-xl font-black text-white group-hover:text-nuvio-blue transition-colors">{site.title}</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">{site.desc}</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-[10px] text-nuvio-yellow uppercase">
                <Star className="w-3.5 h-3.5 fill-nuvio-yellow" /> {site.rating} Rating
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-muted hover:text-text-primary transition-all cursor-pointer"><Share2 className="w-4 h-4" /></button>
                <a 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="nv-btn-primary h-10 px-6 bg-nuvio-blue hover:bg-nuvio-blue/90 text-[10px] uppercase tracking-widest flex items-center gap-2"
                >
                  Visit site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended Section */}
      <div className="nv-card bg-nuvio-blue/5 border-nuvio-blue/20">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6">
          <div className="w-20 h-20 bg-nuvio-blue/10 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-nuvio-blue" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-black text-text-primary mb-1">Local Knowledge Base</h3>
            <p className="text-sm text-text-secondary">Access offline-ready textbooks and whitepapers downloaded by your teachers.</p>
          </div>
          <button className="nv-btn-secondary px-8 border-nuvio-blue/30 text-nuvio-blue">Browse Files</button>
        </div>
      </div>
    </div>
  );
};

export default StudySites;
