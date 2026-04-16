import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { ChevronRight, Sparkles, Check, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '⚡',
    pack: null
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      if (step === 3) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#a78bfa', '#f97316']
        });
      }
    } else {
      const starterXp = formData.pack === 'math' ? 500 : 500; // Simplified for now
      const starterTokens = 1500;
      
      authService.updateMe({
        full_name: formData.name,
        avatar_emoji: formData.avatar,
        onboarding_completed: true,
        era_tokens: starterTokens,
        xp: starterXp,
        streak: 1
      });
      navigate('/dashboard');
    }
  };

  const steps = [
    {
      title: "Welcome to Nuvio",
      subtitle: "Let's get your learning journey started.",
      content: (
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="w-24 h-24 rounded-full bg-nuvio-purple-500/10 flex items-center justify-center border border-nuvio-purple-500/20">
            <Sparkles className="w-12 h-12 text-nuvio-purple-400" />
          </div>
          <p className="text-text-secondary">Ready to turn your exams into play?</p>
        </div>
      )
    },
    {
      title: "Who are you?",
      subtitle: "Choose your display name and mascot.",
      content: (
        <div className="space-y-6 py-6 w-full max-w-sm">
          <div className="space-y-2">
            <label className="nv-label px-1">Display Name</label>
            <input 
              type="text" 
              placeholder="e.g. ShadowMaster"
              className="w-full bg-white/5 border border-border rounded-[16px] p-4 text-text-primary focus:border-nuvio-purple-500 outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="nv-label px-1">Choose Mascot</label>
            <div className="grid grid-cols-4 gap-3">
              {['⚡', '🦊', '🦉', '🐲', '🧊', '🔥', '🌀', '💎'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setFormData({...formData, avatar: emoji})}
                  className={`text-2xl p-4 rounded-[16px] border ${formData.avatar === emoji ? 'border-nuvio-purple-500 bg-nuvio-purple-500/10' : 'border-border bg-white/5'} transition-all`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Select your Path",
      subtitle: "Choose a starter pack to kickstart your XP.",
      content: (
        <div className="grid grid-cols-1 gap-3 py-6 w-full">
          {[
            { id: 'math', title: 'Calculus King', icon: '📐', desc: '+500 Math XP' },
            { id: 'sci', title: 'Science Seeker', icon: '🧪', desc: '+500 Science XP' },
            { id: 'lit', title: 'Word Weaver', icon: '✍️', desc: '+500 Arts XP' },
          ].map(pack => (
            <button
              key={pack.id}
              onClick={() => setFormData({...formData, pack: pack.id})}
              className={`flex items-center gap-4 p-4 rounded-[16px] border text-left ${formData.pack === pack.id ? 'border-nuvio-purple-500 bg-nuvio-purple-500/10' : 'border-border bg-white/5'} transition-all`}
            >
              <span className="text-3xl">{pack.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-text-primary">{pack.title}</div>
                <div className="text-xs text-nuvio-purple-400 font-bold">{pack.desc}</div>
              </div>
              {formData.pack === pack.id && <div className="p-1.5 bg-nuvio-purple-500 rounded-full"><Check className="w-3 h-3 text-white" /></div>}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "You're all set!",
      subtitle: "Welcome to the elite rank of learners.",
      content: (
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="w-24 h-24 rounded-full bg-nuvio-green/10 flex items-center justify-center border border-nuvio-green/20">
            <Rocket className="w-12 h-12 text-nuvio-green" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-text-primary">1,500 ERA TOKENS</div>
            <div className="text-sm text-text-secondary">Claimed for joining</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-nuvio-purple-500' : 'bg-white/5'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-3xl font-black text-text-primary mb-2">{steps[step-1].title}</h1>
            <p className="text-text-secondary text-sm mb-6">{steps[step-1].subtitle}</p>
            
            <div className="w-full mb-10">
              {steps[step-1].content}
            </div>

            <button
              onClick={handleNext}
              disabled={(step === 2 && !formData.name) || (step === 3 && !formData.pack)}
              className="nv-btn-primary w-full py-5 text-lg disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 group"
            >
              {step === 4 ? "Let's Go!" : "Continue"}
              <ChevronRight className={`w-5 h-5 transition-transform ${step < 4 ? 'group-hover:translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
