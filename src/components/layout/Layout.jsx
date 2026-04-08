import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import UniversalHeader from './UniversalHeader';
import SideDrawer from './SideDrawer';
import { authService } from '../../services/authService';
import NovaFAB from '../ai/NovaFAB';

const Layout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load and Sync User State
  useEffect(() => {
    const currentUser = authService.me();
    if (!currentUser && location.pathname !== '/' && location.pathname !== '/landing' && !location.pathname.includes('onboarding')) {
      navigate('/');
    } else {
      setUser(currentUser);
    }

    // Sync Auth & Stats
    const handleUpdate = (e) => setUser(e.detail);
    window.addEventListener('nuvio_stats_update', handleUpdate);
    window.addEventListener('nuvio_auth_change', handleUpdate);
    
    return () => {
      window.removeEventListener('nuvio_stats_update', handleUpdate);
      window.removeEventListener('nuvio_auth_change', handleUpdate);
    };
  }, [location.pathname, navigate]);

  // Hide UI on certain pages
  const hideUI = ['/', '/landing', '/onboarding'].includes(location.pathname);

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
