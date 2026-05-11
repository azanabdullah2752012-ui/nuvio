import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Zap, 
  MessageSquare, Star, ChevronRight,
  Download, Share2, Bookmark, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM_DATA } from '../services/curriculumData';
import { dataService } from '../services/dataService';

const SubjectLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject, grade } = location.state || { subject: 'Mathematics', grade: '9' };
  
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const subjectData = CURRICULUM_DATA[grade]?.[subject] || { chapters: [] };

  const handleInjectCards = async (chapter) => {
    const deck = {
      title: `NCERT: ${chapter.title}`,
      subject: subject,
      cards: chapter.flashcards
    };
    await dataService.create('decks', deck);
    navigate('/flashcards');
  };

  return (
    <div className="min-h-screen pb-32 nv-page-transition">
      {/* 🧭 NAVIGATION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/curriculum')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Matrix
          </button>
          <div className="flex items-center gap-4">
             <button className="p-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"><Share2 className="w-5 h-5" /></button>
             <button className="p-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* 🏛️ SUBJECT HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
               Class {grade} NCERT
            </span>
            <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {subject}
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Access verified study modules, pre-made 3D flashcards, and the Neural Q&A bank for the official CBSE syllabus.
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
             {[
               { id: 'chapters', label: 'Chapters', icon: BookOpen },
               { id: 'qna', label: 'Q&A Bank', icon: MessageSquare },
               { id: 'cards', label: 'Flashcards', icon: Zap }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'
                 }`}
               >
                 <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* 📑 CONTENT AREA */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'chapters' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 gap-6"
              >
                {subjectData.chapters.map((chapter, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                       <span className="text-2xl font-black">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{chapter.title}</h3>
                       <p className="text-slate-500 text-sm leading-relaxed">{chapter.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => setSelectedChapter(chapter)}
                         className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-3 shadow-lg shadow-slate-200"
                       >
                         Study <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'qna' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {subjectData.chapters.flatMap(c => c.qna).map((qa, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-10 hover:border-blue-200 transition-all group">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">Q</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Q&A Module</span>
                     </div>
                     <h4 className="text-xl font-black text-slate-900 mb-6 leading-tight">{qa.q}</h4>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-medium leading-relaxed">
                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3">Verified Answer</div>
                        {qa.a}
                     </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'cards' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {subjectData.chapters.flatMap(c => c.flashcards).map((card, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-8 aspect-square flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-600/10 transition-all border-b-4 border-b-blue-600">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Zap className="w-5 h-5 fill-current" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{card.front}</h4>
                     <div className="pt-4 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                        <span>Click STUDY on chapter to practice</span>
                        <Star className="w-4 h-4" />
                     </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 📖 STUDY MODAL */}
      <AnimatePresence>
        {selectedChapter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChapter(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative z-10 flex flex-col"
            >
              <div className="p-12 space-y-10">
                <div className="flex items-start justify-between gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Deep Learning Module</span>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedChapter.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedChapter(null)}
                    className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-90" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-10">
                    {/* Summary */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Chapter Summary</h4>
                      <p className="text-slate-600 font-medium leading-relaxed italic text-lg">
                        "{selectedChapter.summary}"
                      </p>
                    </section>

                    {/* Key Ideas */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Key Concepts</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedChapter.keyIdeas?.map((idea, idx) => (
                          <div key={idx} className="flex gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">{idx + 1}</div>
                            <p className="text-slate-700 font-semibold text-sm leading-snug">{idea}</p>
                          </div>
                        )) || <p className="text-slate-400 italic text-sm">Key ideas are being synced from the Neural Matrix...</p>}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-10">
                    {/* Formulas (if any) */}
                    {selectedChapter.formulas && (
                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Formula Bank</h4>
                        <div className="space-y-3">
                          {selectedChapter.formulas.map((formula, idx) => (
                            <div key={idx} className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-inner">
                               <p className="text-center font-mono text-sm tracking-tight">{formula}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Practice CTA */}
                    <section className="p-8 bg-blue-600 rounded-[32px] text-white space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 fill-current" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-lg font-black uppercase tracking-tight">Active Recall</h5>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                          Master this chapter using the official NCERT flashcard deck.
                        </p>
                      </div>
                      <button 
                        onClick={() => handleInjectCards(selectedChapter)}
                        className="w-full py-4 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        Practice Flashcards <ChevronRight className="w-4 h-4" />
                      </button>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectLibrary;
