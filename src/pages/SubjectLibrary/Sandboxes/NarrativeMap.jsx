import React from 'react';
import { motion } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';
import '../styles.css';

const NarrativeMap = () => {
  const characters = [
    { title: "Sudha Murty", role: "Granddaughter & Teacher", desc: "12-year-old narrator who patiently guides her grandmother through learning Kannada alphabets." },
    { title: "Krishtakka", role: "Grandmother & Student", desc: "62-year-old determined lady whose willpower helps her become literate by the Dassara deadline." },
    { title: "Kashi Yatre", role: "The Novel Target", desc: "A popular serialized novel that drives Krishtakka's deep desire to read independently." },
    { title: "Guru Respect", role: "Bowing to Teacher", desc: "The ultimate climax where roles reverse and the elder bows to her young teacher." }
  ];

  return (
    <div className="bg-slate-950 p-6 border border-white/10 rounded-xl space-y-6 text-left shadow-lg">
      <div className="text-center space-y-1">
        <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest">
          Syllabus Map
        </span>
        <h4 className="text-sm font-black uppercase text-white">Narrative Character Map</h4>
        <p className="text-slate-400 text-[10px] font-semibold">
          Explore the relationships and thematic elements of Sudha Murty's chapter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {characters.map((char, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-slate-900 border border-white/10 rounded-lg space-y-2 relative shadow hover:border-purple-500/30 transition-all"
          >
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500 flex items-center justify-center text-[9px] font-black text-purple-400">
              {index + 1}
            </div>
            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest leading-none">
              {char.role}
            </span>
            <h5 className="text-xs font-black uppercase text-white mt-1">
              {char.title}
            </h5>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              {char.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg text-xs leading-relaxed text-slate-400 font-semibold flex gap-2">
        <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <p>
          This story highlights how determination breaks traditional generational hierarchy. Respect for a teacher (Guru) is independent of age.
        </p>
      </div>
    </div>
  );
};

export default NarrativeMap;
