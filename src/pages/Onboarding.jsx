import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { Sparkles, Rocket, GraduationCap, ChevronRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedBackground from '../components/AnimatedBackground';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '9th'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    
    // Fire confetti for the wow factor
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#06b6d4', '#ec4899']
    });

    const starterXp = 500;
    const starterTokens = 1500;

    await authService.updateMe({
      full_name: formData.name.trim(),
      avatar_emoji: '⚡',
      grade_level: formData.grade,
      onboarding_completed: true,
      era_tokens: starterTokens,
      xp: starterXp,
      streak: 1
    });

    setIsSuccess(true);
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1800);
  };

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBackground variant="hero" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-nuvio-purple-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-nuvio-cyan/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="nv-card p-10 bg-slate-900/60 border border-white/10 rounded-[32px] shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center bg-gradient-to-tr from-nuvio-purple-600 to-nuvio-cyan shadow-lg shadow-nuvio-purple-500/20">
                  <GraduationCap className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white nv-shimmer-text">
                  Initialize Profile
                </h1>
                <p className="text-text-secondary text-sm font-semibold mt-1">
                  Configure your academic identity to enter the StudyVerse.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display Name Input */}
                <div className="space-y-2">
                  <label className="nv-label px-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-nuvio-purple-400" /> Scholar Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your display name (e.g. Scholar_01)"
                    className="nv-input focus:border-nuvio-purple-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Grade Selection */}
                <div className="space-y-3">
                  <label className="nv-label px-1">Academic Grade (Class)</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setFormData({ ...formData, grade })}
                        className={`py-3 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200
                          ${formData.grade === grade
                            ? 'bg-nuvio-purple-500/20 border-nuvio-purple-500 text-nuvio-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105'
                            : 'border-white/5 bg-white/5 text-text-muted hover:border-white/10 hover:text-text-primary'
                          }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center mt-2">
                    Note: Study content is optimized for Grades 6-12 CBSE NCERT.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim()}
                    className="nv-btn-primary w-full py-5 text-sm disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Activate Scholar Identity</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="nv-card p-10 bg-slate-900/60 border border-white/10 rounded-[32px] text-center space-y-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl min-h-[350px]"
            >
              <div className="w-20 h-20 rounded-full bg-nuvio-green/10 flex items-center justify-center border border-nuvio-green/20">
                <Rocket className="w-10 h-10 text-nuvio-green animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Configured!</h2>
                <p className="text-text-secondary text-sm font-semibold max-w-sm mx-auto">
                  You have been awarded <span className="text-nuvio-yellow font-black">1,500 Era Tokens</span> and <span className="text-nuvio-purple-400 font-black">500 XP</span> to jumpstart your quest.
                </p>
              </div>
              <div className="text-[11px] font-black text-nuvio-purple-400 uppercase tracking-[0.2em] animate-pulse">
                Initializing StudyVerse...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
