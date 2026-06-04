import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Layout & Core
import Layout from './components/layout/Layout';
import NudgeSystem from './components/NudgeSystem';
import InteractionSystem from './components/InteractionSystem';

// Auth (Loaded immediately for UX)
import LandingPage from './pages/Landing';
import Onboarding from './pages/Onboarding';

// Lazy Loaded Pages (Chunked for performance)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Homework = lazy(() => import('./pages/Homework'));
const StudyHub = lazy(() => import('./pages/StudyHub'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const WritingWorkshop = lazy(() => import('./pages/EssayForge'));
const Admin = lazy(() => import('./pages/Admin'));
const Calendar = lazy(() => import('./pages/Calendar'));
const FocusTimer = lazy(() => import('./pages/FocusTimer'));
const CurriculumHub = lazy(() => import('./pages/CurriculumHub'));
const SubjectLibrary = lazy(() => import('./pages/SubjectLibrary'));
const BossRaid = lazy(() => import('./pages/BossRaid'));
const LearningGroups = lazy(() => import('./pages/LearningGroups'));
const Messages = lazy(() => import('./pages/Messages'));
const Shop = lazy(() => import('./pages/Shop'));
const Analytics = lazy(() => import('./pages/Analytics'));
const StudyVerse = lazy(() => import('./pages/StudyVerse'));
const StudySites = lazy(() => import('./pages/StudySites'));
const TriviaGame = lazy(() => import('./pages/TriviaGame'));

import { authService } from './services/authService';
import { supabase } from './lib/supabase';

// Loading Spinner for Chunks
const AppLoader = () => (
  <div className="min-h-screen bg-background-base flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-4 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Loading Acadevance...</div>
  </div>
);


// Robust Route Guard for Admin
const AdminGuard = ({ children }) => {
  const user = authService.me();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const RetentionEngine = ({ children }) => {
  const location = useLocation();
  
  React.useEffect(() => {
    const runValidation = async () => {
      const user = authService.me();
      if (!user) return;

      const result = await authService.validateStreak();
      if (result.status === 'reset') {
        window.dispatchEvent(new CustomEvent('acadevance_nudge', {
          detail: {
            title: "Streak Reset",
            message: `Study streak was cold for too long. Reset to 1 Day.`,
            type: 'streak'
          }
        }));
      } else if (result.status === 'increment') {
        window.dispatchEvent(new CustomEvent('acadevance_nudge', {
          detail: {
            title: "Streak Extended!",
            message: `Day ${user.streak + 1} active. Keep the burn!`,
            type: 'streak'
          }
        }));
      }
    };
    runValidation();
  }, [location.pathname]);

  return (
    <>
      {children}
      <NudgeSystem />
    </>
  );
};

const AuthOrchestrator = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // 1. Listen for Auth State Changes (OAuth Redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AUTH EVENT:", event);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          const profile = authService.me();
          
          // If we're on a public page but logged in, sync and move
          if (location.pathname === '/' || location.pathname === '/auth') {
             await authService.syncProfile(session.user);
             const user = authService.me();
             if (user?.role === 'admin') {
               navigate('/admin', { replace: true });
             } else {
               navigate('/dashboard', { replace: true });
             }
          }
        }
      }
    );

    // 2. Initial Session Check (Standard Page Load)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && (location.pathname === '/' || location.pathname === '/auth')) {
        await authService.syncProfile(session.user);
        navigate('/dashboard', { replace: true });
      }
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return children;
};

function App() {
  return (
    <HashRouter>
      <InteractionSystem />
      <AuthOrchestrator>
        <RetentionEngine>
          <Suspense fallback={<AppLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Private Routes (Wrapped in Layout) */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Study Tools */}
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/homework" element={<Homework />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/focus-timer" element={<FocusTimer />} />
                <Route path="/curriculum" element={<CurriculumHub />} />
                <Route path="/subject-library" element={<SubjectLibrary />} />
                
                {/* Learning Section */}
                <Route path="/study-hub" element={<StudyHub />} />
                <Route path="/essay-forge" element={<WritingWorkshop />} />
                
                {/* Study Verse */}
                <Route path="/boss-raid" element={<BossRaid />} />
                
                {/* Social Hub */}
                <Route path="/learning-groups" element={<LearningGroups />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/messages" element={<Messages />} />
                
                {/* Rewards & Analytics */}
                <Route path="/shop" element={<Shop />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/study-verse" element={<StudyVerse />} />
                <Route path="/trivia-game" element={<TriviaGame />} />
                <Route path="/study-sites" element={<StudySites />} />

                {/* Account */}
                <Route path="/profile" element={<Profile />} />
                
                {/* Admin */}
                <Route path="/admin" element={
                  <AdminGuard>
                    <Admin />
                  </AdminGuard>
                } />
              </Route>

              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RetentionEngine>
      </AuthOrchestrator>
    </HashRouter>
  );
}

export default App;
