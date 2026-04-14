import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import UniversalHeader from './UniversalHeader';
import SideDrawer from './SideDrawer';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';
import NovaFAB from '../ai/NovaFAB';

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
      // Step 1: Check local buffer (instant)
      let profile = authService.me();

      // Step 2: If no local buffer, ask Supabase directly
      if (!profile) {
        const session = await authService.getSession();
        if (session?.user) {
          // We have a live session — sync it and get the profile
          await authService.syncProfile(session.user);
          profile = authService.me();
        }
      }

      if (!mounted) return;

      if (profile) {
        setUser(profile);
        // If we're on the landing page, send to dashboard
        if (isAuthPage) {
          navigate('/dashboard', { replace: true });
        }
      } else if (!isAuthPage) {
        // No session anywhere — send to landing
        navigate('/', { replace: true });
      }

      setLoading(false);
    };

    init();

    // Listen for sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('nuvio_user');
        if (mounted) navigate('/', { replace: true });
      }
    });

    const handleUpdate = (e) => { if (mounted) setUser(e.detail); };
    window.addEventListener('nuvio_stats_update', handleUpdate);
    window.addEventListener('nuvio_auth_change', handleUpdate);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('nuvio_stats_update', handleUpdate);
      window.removeEventListener('nuvio_auth_change', handleUpdate);
    };
  }, []);  // Run ONCE on mount only

  // Hide UI on certain pages
  const hideUI = ['/', '/landing', '/onboarding'].includes(location.pathname);

  if (loading && !hideUI) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] animate-pulse">Neural Identity Syncing...</p>
        </div>
      </div>
    );
  }

  if (hideUI) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background-base text-text-primary">
      <UniversalHeader 
        onMenuClick={() => setIsDrawerOpen(true)} 
        user={user}
      />
      
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user}
      />

      <main className="max-w-[1100px] mx-auto px-4 py-6 md:px-8 md:py-10 nv-page-transition">
        <Outlet context={{ user, setUser }} />
      </main>

      {/* Global AI Assistant */}
      <NovaFAB />
    </div>
  );
};

export default Layout;
