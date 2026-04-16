import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Auth
import LandingPage from './pages/Landing';
import Onboarding from './pages/Onboarding';

// Main Pages
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Homework from './pages/Homework';
import AIChat from './pages/AIChat';
import AIHub from './pages/AIHub';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import EssayForge from './pages/EssayForge';
import Admin from './pages/Admin';

// Restored Functional Pages
import Calendar from './pages/Calendar';
import FocusTimer from './pages/FocusTimer';
import KnowledgeMap from './pages/KnowledgeMap';
import BossRaid from './pages/BossRaid';
import LearningGroups from './pages/LearningGroups';
import Messages from './pages/Messages';
import Shop from './pages/Shop';
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import StudyVerse from './pages/StudyVerse';
import StudySites from './pages/StudySites';
import TriviaGame from './pages/TriviaGame';

import { authService } from './services/authService';
import { supabase } from './lib/supabase';


// Robust Route Guard for Admin
const AdminGuard = ({ children }) => {
  const user = authService.me();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <HashRouter>
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
          <Route path="/knowledge-map" element={<KnowledgeMap />} />
          
          {/* AI Suite */}
          <Route path="/nova-ai" element={<AIChat />} />
          <Route path="/ai-chat" element={<Navigate to="/nova-ai" replace />} />
          <Route path="/ai-hub" element={<AIHub />} />
          <Route path="/essay-forge" element={<EssayForge />} />
          
          {/* Study Verse */}
          <Route path="/boss-raid" element={<BossRaid />} />
          
          {/* Social Hub */}
          <Route path="/learning-groups" element={<LearningGroups />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Rewards & Analytics */}
          <Route path="/achievements" element={<Achievements />} />
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
    </HashRouter>
  );
}

export default App;
