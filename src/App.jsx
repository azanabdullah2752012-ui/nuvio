import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Separate Dedicated Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Clean Loading State
const AppLoader = () => (
  <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-2 border-[var(--border-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
    <div className="text-xs text-[var(--text-muted)] font-medium tracking-wide">
      Loading Journal...
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route element={<Layout />}>
            {/* Today Command Deck */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<Dashboard />} />

            {/* Dedicated Routine Timeline Page */}
            <Route path="/routine" element={<RoutinePage />} />

            {/* Dedicated Habit Tracker Page */}
            <Route path="/habits" element={<HabitsPage />} />

            {/* Dedicated Settings & Backup Page */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
