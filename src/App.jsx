import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// 5 Core Master Hubs
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ScheduleHub = lazy(() => import('./pages/ScheduleHub'));
const AcademicHub = lazy(() => import('./pages/AcademicHub'));
const StudioHub = lazy(() => import('./pages/StudioHub'));
const DisciplineHub = lazy(() => import('./pages/DisciplineHub'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Standalone Backwards-Compatible Pages
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

// Clean Loading State
const AppLoader = () => (
  <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-2 border-[var(--border-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
    <div className="text-xs text-[var(--text-muted)] font-medium tracking-wide">
      Loading Journal OS...
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route element={<Layout />}>
            {/* ── 5 MASTER HUBS ────────────────────────────────────────── */}
            {/* 1. Today Command Hub */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<Dashboard />} />

            {/* 2. Schedule, Routine & Prayers Hub */}
            <Route path="/schedule" element={<ScheduleHub />} />

            {/* 3. Academic & JEE Mastery Forge */}
            <Route path="/academics" element={<AcademicHub />} />

            {/* 4. Pickle Corp Studio & Builds Hub */}
            <Route path="/studio" element={<StudioHub />} />

            {/* 5. Discipline, Mindset & Reviews Hub */}
            <Route path="/discipline" element={<DisciplineHub />} />

            {/* Settings & Privacy */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* ── DIRECT DEEP LINKS (BACKWARD COMPATIBLE) ─────────────── */}
            <Route path="/routine" element={<RoutinePage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/review" element={<WeeklyReviewPage />} />
            <Route path="/wins" element={<WinsPage />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="/formulas" element={<FormulasPage />} />
            <Route path="/prayer" element={<PrayerPage />} />
            <Route path="/pickle-corp" element={<PickleCorpPage />} />
            <Route path="/spelling" element={<SpellingPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
