import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import UniversalHeader from './UniversalHeader';
import SideDrawer from './SideDrawer';
import { authService } from '../../services/authService';
import QuestFAB from './QuestFAB';
import AnimatedBackground from '../AnimatedBackground';
import PageTransition from '../PageTransition';

const Layout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ['/', '/landing', '/onboarding'].includes(location.pathname);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Step 1: Show whatever is cached in localStorage immediately (instant render)
      const cachedProfile = authService.me();
      if (cachedProfile && mounted) {
        setUser(cachedProfile);
        setLoading(false);
      }

      // Step 2: Verify session and sync in the background
      const session = await authService.getSession();
      
      if (session?.user) {
        // Sync to verify role updates or recover from DB wipe (background)
        await authService.syncProfile(session.user);
        let profile = authService.me();

        // Fallback: build profile from session if Supabase table fails
        if (!profile) {
          const isAdmin = ['azanabdullah27.5.2012@gmail.com'].includes(session.user.email);
          profile = {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'Scholar',
            avatar_emoji: '⚡',
            level: 1, 
            xp: 0, 
            era_tokens: 500, 
            role: isAdmin ? 'admin' : 'student',
            achievements: [],
            stats_focus_sessions: 0,
            stats_flashcards_reviewed: 0,
            stats_quizzes_correct: 0,
            stats_math_completed: 0,
            stats_science_completed: 0,
            stats_quests_completed: 0,
            login_streak: 1,
            last_login_reward_date: null,
            unlocked_avatars: ['⚡'],
            claimed_season_tiers: [],
            boss_chapter_progress: {
              dragon: { hp: 1000, max: 1000, status: 'active' },
              monster: { hp: 2000, max: 2000, status: 'locked' },
              titan: { hp: 5000, max: 5000, status: 'locked' }
            }
          };
          localStorage.setItem('acadevance_user', JSON.stringify(profile));
        }

        if (mounted) setUser(profile);
      } else if (!cachedProfile) {
        // No session and no cache — redirect to landing
        if (!isAuthPage && mounted) navigate('/', { replace: true });
      }

      // Ensure loading is cleared even if no session
      if (mounted) setLoading(false);
    };

    init();

    const handleUpdate = (e) => { if (mounted) setUser(e.detail); };
    window.addEventListener('acadevance_stats_update', handleUpdate);
    window.addEventListener('acadevance_auth_change', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('acadevance_stats_update', handleUpdate);
      window.removeEventListener('acadevance_auth_change', handleUpdate);
    };
  }, []);  // Run ONCE on mount only

  // Hide UI on certain pages
  const hideUI = ['/', '/landing', '/onboarding'].includes(location.pathname);

  if (loading && !hideUI) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] animate-pulse">Scholar Identity Syncing...</p>
        </div>
      </div>
    );
  }

  if (hideUI) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background-base text-text-primary">
      {/* Global animated background layer */}
      <AnimatedBackground />

      <UniversalHeader 
        onMenuClick={() => setIsDrawerOpen(true)} 
        user={user}
      />
      
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user}
      />

      {/* Page transitions — keyed by pathname */}
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <main className="max-w-[1100px] mx-auto px-4 py-6 md:px-8 md:py-10">
            <Outlet context={{ user, setUser }} />
          </main>
        </PageTransition>
      </AnimatePresence>

      {/* Global Quests */}
      <QuestFAB />
    </div>
  );
};

export default Layout;
