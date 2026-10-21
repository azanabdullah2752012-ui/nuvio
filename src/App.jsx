import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core
import Layout from './components/layout/Layout';

// Public Pages
import LandingPage from './pages/Landing';

// Primary Workspace (The Today Screen)
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Minimalist Loading Spinner
const AppLoader = () => (
  <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-2 border-[#e8e6df] border-t-[#1b3b2b] rounded-full animate-spin" />
    <div className="font-mono text-xs text-[#8e8d8a] uppercase tracking-widest">Opening Today...</div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Public Landing Showcase */}
          <Route path="/" element={<LandingPage />} />

          {/* Core Daily Workstation */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Legacy route redirects to the clean unified workspace */}
          <Route path="/today" element={<Navigate to="/dashboard" replace />} />
          <Route path="/homework" element={<Navigate to="/dashboard" replace />} />
          <Route path="/calendar" element={<Navigate to="/dashboard" replace />} />
          <Route path="/focus-timer" element={<Navigate to="/dashboard" replace />} />
          <Route path="/wheel" element={<Navigate to="/dashboard" replace />} />
          <Route path="/circadian" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
