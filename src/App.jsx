import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Dedicated Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DisciplinePage = lazy(() => import('./pages/DisciplinePage'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const WeeklyReviewPage = lazy(() => import('./pages/WeeklyReviewPage'));
const WinsPage = lazy(() => import('./pages/WinsPage'));
const MistakesPage = lazy(() => import('./pages/MistakesPage'));
const FormulasPage = lazy(() => import('./pages/FormulasPage'));
const PrayerPage = lazy(() => import('./pages/PrayerPage'));
const PickleCorpPage = lazy(() => import('./pages/PickleCorpPage'));
const SpellingPage = lazy(() => import('./pages/SpellingPage'));
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

            {/* Discipline Board */}
            <Route path="/discipline" element={<DisciplinePage />} />

            {/* 2. Routine Schedule */}
            <Route path="/routine" element={<RoutinePage />} />

            {/* 3. Habit Tracker */}
            <Route path="/habits" element={<HabitsPage />} />

            {/* 4. Prayer & Sunnah Radar */}
            <Route path="/prayer" element={<PrayerPage />} />

            {/* 5. JEE Formulas & Theorems */}
            <Route path="/formulas" element={<FormulasPage />} />

            {/* 6. Goals & Exam Marks */}
            <Route path="/goals" element={<GoalsPage />} />

            {/* 7. Weekly Review (5-Min Protocol) */}
            <Route path="/review" element={<WeeklyReviewPage />} />

            {/* 8. Small Wins & Shipped Vault */}
            <Route path="/wins" element={<WinsPage />} />

            {/* 9. Mistake Notebook */}
            <Route path="/mistakes" element={<MistakesPage />} />

            {/* 10. Pickle Corp Studio Favor Bank */}
            <Route path="/pickle-corp" element={<PickleCorpPage />} />

            {/* 11. Spelling & Vocabulary Precision */}
            <Route path="/spelling" element={<SpellingPage />} />

            {/* 12. Settings & Privacy */}
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
