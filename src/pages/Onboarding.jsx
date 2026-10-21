import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowRight, Check, User, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: '9th'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await authService.updateMe({
        full_name: formData.name.trim(),
        grade_level: formData.grade
      });

      if (updated) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error("Onboarding setup failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#1a1917] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Paper Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(27,59,43,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(27,59,43,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 sm:p-10 bg-white border border-[#e5e1d5] rounded-2xl shadow-[0_4px_24px_rgba(27,59,43,0.06)] space-y-8"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#1b3b2b]/10 border border-[#1b3b2b]/20 flex items-center justify-center text-[#1b3b2b]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#1b3b2b] font-bold">
                    System Configuration
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#1a1917] mt-1">
                    Scholar Setup
                  </h1>
                  <p className="text-[#52504a] text-xs mt-1 leading-relaxed">
                    Set up your workstation identity and target CBSE curriculum level.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scholar Name */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">
                    Scholar Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e5e1d5] rounded-lg text-sm text-[#1a1917] font-sans focus:outline-none focus:border-[#1b3b2b] transition-colors"
                  />
                </div>

                {/* Academic Class */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#52504a]">
                    Academic Class (NCERT Syllabus)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setFormData({ ...formData, grade })}
                        className={`py-2 rounded-md border font-mono text-xs uppercase transition-all ${
                          formData.grade === grade
                            ? 'bg-[#1b3b2b] border-[#1b3b2b] text-white font-bold shadow-sm'
                            : 'bg-[#fbfbfa] border-[#e5e1d5] text-[#52504a] hover:bg-white'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim()}
                  className="w-full py-3.5 bg-[#1b3b2b] hover:bg-[#26523c] disabled:opacity-40 text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)]"
                >
                  <span>Initialize Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 bg-white border border-[#e5e1d5] rounded-2xl text-center space-y-4 shadow-[0_4px_24px_rgba(27,59,43,0.06)]"
            >
              <div className="w-14 h-14 rounded-full bg-[#1b3b2b]/10 border border-[#1b3b2b]/20 text-[#1b3b2b] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1a1917]">
                Workstation Ready
              </h2>
              <p className="text-[#52504a] text-xs font-mono">
                Redirecting to scholar dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;