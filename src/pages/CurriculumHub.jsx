import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronRight, Search, 
  GraduationCap, Book, Layers, 
  Zap, MessageSquare, Clock,
  ArrowRight, CheckCircle2, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

const CLASSES = [
  { id: '1', name: 'Class 1', subjects: ['Mathematics', 'English', 'EVS', 'Hindi'] },
  { id: '2', name: 'Class 2', subjects: ['Mathematics', 'English', 'EVS', 'Hindi'] },
  { id: '3', name: 'Class 3', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '4', name: 'Class 4', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '5', name: 'Class 5', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '6', name: 'Class 6', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '7', name: 'Class 7', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '8', name: 'Class 8', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'] },
  { id: '9', name: 'Class 9', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'IT'] },
  { id: '10', name: 'Class 10', subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'IT'] },
  { id: '11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
  { id: '12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'CS'] },
];

const SubjectIcon = ({ name }) => {
  const s = name.toLowerCase();
  if (s.includes('math')) return <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">∑</div>;
  if (s.includes('sci') || s.includes('phys') || s.includes('chem')) return <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-bold">⚛</div>;
  if (s.includes('social') || s.includes('hist')) return <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">🌍</div>;
  if (s.includes('english')) return <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">A</div>;
  return <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">B</div>;
};

const CurriculumHub = () => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(authService.me());
  const navigate = useNavigate();

  const currentClass = CLASSES.find(c => c.id === selectedClass);
  const filteredSubjects = currentClass?.subjects.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen pb-32 nv-page-transition">
      {/* 🏛️ CBSE-INSPIRED HEADER */}
      <div className="bg-white border-b border-slate-200 p-8 md:p-12 mb-10 rounded-[40px] shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-[10px]">
               <GraduationCap className="w-4 h-4" /> NCERT Syllabus Hub
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Curriculum <span className="text-blue-600">Matrix</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Select your grade to access pre-made modules and Q&A.</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search subjects or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-slate-50 border border-slate-200 rounded-3xl pl-16 pr-8 text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* 🧭 CLASS SELECTOR */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {CLASSES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className={`flex-shrink-0 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                selectedClass === c.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 📚 SUBJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => navigate('/subject-library', { state: { subject, grade: selectedClass } })}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                   <SubjectIcon name={subject} />
                   <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Verified Syllabus
                   </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{subject}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> 12 Modules</span>
                     <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> 45 Q&A</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between relative z-10">
                   <button className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                      Open Library <ArrowRight className="w-4 h-4" />
                   </button>
                   <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                      <Star className="w-4 h-4 fill-current" />
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ⚡ PRE-MADE MODULES (Class 9 Focused) */}
        {selectedClass === '9' && (
          <div className="space-y-12 pt-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-600" /> Pre-made Study Packs
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform" />
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                        <Book className="w-6 h-6" />
                     </div>
                     <span className="bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-xl">High Intensity</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Physics: Motion & Laws</h3>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-80">Full NCERT coverage with pre-made 3D flashcards and chapter summaries.</p>
                  <button 
                    onClick={async () => {
                      const deck = {
                        title: 'CBSE Physics: Motion',
                        subject: 'Science',
                        cards: [
                          { front: 'What is acceleration?', back: 'The rate of change of velocity with time.' },
                          { front: 'Newton\'s First Law', back: 'An object remains at rest or in motion unless acted upon by an external force.' },
                          { front: 'SI Unit of Force', back: 'Newton (N)' }
                        ]
                      };
                      await dataService.create('decks', deck);
                      navigate('/flashcards');
                    }}
                    className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] transition-all"
                  >
                     Start Review
                  </button>
               </div>

               <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform" />
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <span className="bg-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-xl">45 Questions</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Math: Number Systems</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">NCERT solutions and verified Q&A for real numbers and irrational identities.</p>
                  <button onClick={() => navigate('/homework')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] transition-all">
                     View Q&A
                  </button>
               </div>
            </div>

            {/* 🛡️ QUESTION BANK SECTION */}
            <div className="space-y-8 pt-10">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                     <MessageSquare className="w-6 h-6 text-blue-600" /> Curriculum Question Bank
                  </h2>
               </div>
               
               <div className="space-y-4">
                  {[
                    { q: "Define Scalar and Vector quantities with examples.", a: "Scalar has only magnitude (e.g. Mass), Vector has both magnitude and direction (e.g. Velocity).", subject: "Physics" },
                    { q: "What is the result of adding two irrational numbers?", a: "The sum of two irrational numbers can be rational or irrational. e.g., √2 + (-√2) = 0 (Rational).", subject: "Math" },
                    { q: "Describe the three states of matter.", a: "Solid (fixed shape/volume), Liquid (fixed volume, no shape), Gas (neither fixed).", subject: "Science" }
                  ].map((qa, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md">{qa.subject}</span>
                          <span className="text-[10px] text-slate-400 font-bold">NCERT Exercise Solution</span>
                       </div>
                       <h4 className="text-sm font-black text-slate-900 mb-2">{qa.q}</h4>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">{qa.a}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumHub;
