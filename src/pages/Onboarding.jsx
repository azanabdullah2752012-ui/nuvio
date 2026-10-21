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
    <div className="min-h-screen bg-[#090a0d] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
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
              className="p-8 sm:p-10 bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl space-y-8"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#ff4625]/10 border border-[#ff4625]/20 flex items-center justify-center text-[#ff4625]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ff4625]">
                    System Configuration
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-clash mt-1">
                    Scholar Setup
                  </h1>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Set up your workstation identity and target CBSE curriculum level.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scholar Name */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    Scholar Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#08090b] border border-white/10 rounded-lg text-sm text-white font-sans focus:outline-none focus:border-[#ff4625] transition-colors"
                  />
                </div>

                {/* Academic Class */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">
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
                            ? 'bg-[#ff4625] border-[#ff4625] text-white font-bold'
                            : 'bg-[#08090b] border-white/10 text-zinc-400 hover:text-white'
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
                  className="w-full py-3.5 bg-[#ff4625] hover:bg-[#ff5738] disabled:opacity-40 text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
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
              className="p-10 bg-[#0d0f14] border border-white/10 rounded-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-clash">
                Workstation Ready
              </h2>
              <p className="text-zinc-400 text-xs font-mono">
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