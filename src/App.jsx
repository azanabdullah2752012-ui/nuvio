import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core
import Layout from './components/layout/Layout';

// Public Pages
import LandingPage from './pages/Landing';
import Onboarding from './pages/Onboarding';

// Core Productivity Arsenal
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Homework = lazy(() => import('./pages/Homework'));
const Calendar = lazy(() => import('./pages/Calendar'));
const FocusTimer = lazy(() => import('./pages/FocusTimer'));
const Profile = lazy(() => import('./pages/Profile'));

// Minimalist Loading Spinner
const AppLoader = () => (
  <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-2 border-[#e5e1d5] border-t-[#1b3b2b] rounded-full animate-spin" />
    <div className="font-mono text-xs text-[#827f76] uppercase tracking-widest">Loading Workstation...</div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Public Orientation & Initialization */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Student Productivity Suite (Wrapped in Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/focus-timer" element={<FocusTimer />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
