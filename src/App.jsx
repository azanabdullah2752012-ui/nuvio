import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Dedicated Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const WeeklyReviewPage = lazy(() => import('./pages/WeeklyReviewPage'));
const WinsPage = lazy(() => import('./pages/WinsPage'));
const MistakesPage = lazy(() => import('./pages/MistakesPage'));
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
            {/* 1. Today Overview */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<Dashboard />} />

            {/* 2. Routine Schedule */}
            <Route path="/routine" element={<RoutinePage />} />

            {/* 3. Habit Tracker */}
            <Route path="/habits" element={<HabitsPage />} />

            {/* 4. Goals & Exam Marks */}
            <Route path="/goals" element={<GoalsPage />} />

            {/* 5. Weekly Review (5-Min Protocol) */}
            <Route path="/review" element={<WeeklyReviewPage />} />

            {/* 6. Small Wins & Shipped Vault */}
            <Route path="/wins" element={<WinsPage />} />

            {/* 7. Mistake Notebook */}
            <Route path="/mistakes" element={<MistakesPage />} />

            {/* 8. Settings & Privacy */}
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
