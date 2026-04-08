import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Users, 
  Zap, 
  CheckCircle2,
  Mail,
  Lock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';

const Landing = () => {
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.googleLogin();
      if (user.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const user = authService.login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background-base text-text-primary overflow-x-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-nuvio-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-nuvio-blue/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-nuvio-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-nuvio-purple-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter">Nuvio</span>
        </div>
        <div className="hidden md:flex items-center gap-8 lowercase text-sm font-bold text-text-secondary">
          <a href="#" className="hover:text-nuvio-purple-400 transition-colors">features</a>
          <a href="#" className="hover:text-nuvio-purple-400 transition-colors">games</a>
          <a href="#" className="hover:text-nuvio-purple-400 transition-colors">pricing</a>
        </div>
        <button 
          onClick={() => setShowLoginForm(true)}
          className="nv-btn-secondary px-6 md:px-8 py-2 min-h-[44px] text-xs uppercase font-black"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-nuvio-green animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">StudyVerse Alpha 2.0 now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.85] mb-8"
        >
          Study like it's <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nuvio-purple-400 to-nuvio-blue drop-shadow-sm">a video game</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-text-secondary text-lg md:text-xl font-medium leading-relaxed mb-12"
        >
          Nuvio turns your homework into quests, exams into boss raids, and study 
          groups into academic squads. Level up your grades with Nova, the world's most 
          powerful AI tutor.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
        >
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="nv-btn-primary w-full py-5 text-lg shadow-2xl shadow-nuvio-purple-500/20 group flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Mail className="w-6 h-6" />
                Sign in with Gmail
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-8 flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" /> no credit card</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-nuvio-green" /> 100% free beta</span>
        </motion.div>
      </main>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowLoginForm(false)}
              className="absolute inset-0 bg-background-base/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="nv-card w-full max-w-md p-10 space-y-8 relative z-10 border-nuvio-purple-500/30"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Welcome Back</h2>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-widest leading-none opacity-60">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleCredentialLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="nv-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-nuvio-purple-500 outline-none transition-all placeholder:text-white/10"
                      placeholder="student@nuvio.edu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="nv-label">Password</label>
                    <button type="button" className="text-[10px] uppercase font-black text-nuvio-purple-400 hover:text-nuvio-purple-300">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-nuvio-purple-500 outline-none transition-all placeholder:text-white/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && <div className="text-nuvio-red text-[10px] font-black uppercase text-center">{error}</div>}

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="nv-btn-primary w-full py-5 text-lg shadow-xl shadow-nuvio-purple-500/20 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center pt-2">
                <button 
                  onClick={() => setShowLoginForm(false)}
                  className="text-xs font-black text-text-muted uppercase hover:text-text-primary transition-colors"
                >
                  Back to Landing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
