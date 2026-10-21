import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core
import Layout from './components/layout/Layout';

// Public Pages
import LandingPage from './pages/Landing';
import Onboarding from './pages/Onboarding';

// Academic Core Tools (Chunked for performance)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CurriculumHub = lazy(() => import('./pages/CurriculumHub'));
const SubjectLibrary = lazy(() => import('./pages/SubjectLibrary'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Homework = lazy(() => import('./pages/Homework'));
const Calendar = lazy(() => import('./pages/Calendar'));
const FocusTimer = lazy(() => import('./pages/FocusTimer'));
const StudyHub = lazy(() => import('./pages/StudyHub'));
const WritingWorkshop = lazy(() => import('./pages/EssayForge'));
const StudySites = lazy(() => import('./pages/StudySites'));
const Profile = lazy(() => import('./pages/Profile'));

// Minimalist Loading Spinner
const AppLoader = () => (
  <div className="min-h-screen bg-background-base flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-2 border-[#e5e1d5] border-t-[#1b3b2b] rounded-full animate-spin" />
    <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Loading Academic Curriculum...</div>
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

          {/* Academic Workstation Suite (Wrapped in Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Core Study Arsenal */}
            <Route path="/curriculum" element={<CurriculumHub />} />
            <Route path="/subject-library" element={<SubjectLibrary />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/focus-timer" element={<FocusTimer />} />
            
            {/* Extended Academic Tools */}
            <Route path="/study-hub" element={<StudyHub />} />
            <Route path="/essay-forge" element={<WritingWorkshop />} />
            <Route path="/study-sites" element={<StudySites />} />

            {/* Scholar Settings */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
