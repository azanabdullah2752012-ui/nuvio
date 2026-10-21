import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import '../styles.css';

const NarrativeMap = () => {
  const characters = [
    { title: "Sudha Murty", role: "Granddaughter & Teacher", desc: "12-year-old narrator who patiently guides her grandmother through learning Kannada alphabets." },
    { title: "Krishtakka", role: "Grandmother & Student", desc: "62-year-old determined lady whose willpower helps her become literate by the Dassara deadline." },
    { title: "Kashi Yatre", role: "The Literary Catalyst", desc: "A popular serialized novel that drives Krishtakka's deep desire to read independently." },
    { title: "Guru Respect", role: "Traditional Reverence", desc: "The ultimate climax where roles reverse and the elder bows to her young teacher in gratitude." }
  ];

  return (
    <div className="bg-white p-6 md:p-8 border border-[#e5e1d5] rounded-2xl space-y-6 text-left shadow-sm">
      <div className="text-center space-y-1">
        <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider">
          Literature Study
        </span>
        <h4 className="text-lg font-serif font-bold text-[#1a1917]">Narrative Thematic Map</h4>
        <p className="text-[#52504a] text-xs">
          Explore character dynamics and central themes in Sudha Murty's autobiographical chapter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {characters.map((char, index) => (
          <div
            key={index}
            className="p-5 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl space-y-2 relative shadow-sm hover:border-[#1b3b2b]/40 transition-colors"
          >
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#f5f3ec] border border-[#e5e1d5] flex items-center justify-center text-[10px] font-mono font-bold text-[#1b3b2b]">
              {index + 1}
            </div>
            <span className="block text-[10px] font-mono font-bold text-[#1b3b2b] uppercase tracking-wider leading-none">
              {char.role}
            </span>
            <h5 className="text-sm font-serif font-bold text-[#1a1917] mt-1">
              {char.title}
            </h5>
            <p className="text-xs text-[#52504a] leading-relaxed">
              {char.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#f5f3ec] border border-[#e5e1d5] rounded-xl text-xs leading-relaxed text-[#52504a] flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-[#1b3b2b] shrink-0 mt-0.5" />
        <p>
          This narrative underscores how dedication transcends age and societal hierarchies. Respect for a teacher (Guru) is honored through sincere learning, independent of biological age.
        </p>
      </div>
    </div>
  );
};

export default NarrativeMap;
