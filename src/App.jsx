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
import StudyVerse from './pages/StudyVerse';
import AIChat from './pages/AIChat';
import AIHub from './pages/AIHub';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import LearningGroups from './pages/LearningGroups';
import Leaderboard from './pages/Leaderboard';
import Calendar from './pages/Calendar';
import Shop from './pages/Shop';
import BossRaid from './pages/BossRaid';
import Classmates from './pages/Classmates';
import EssayForge from './pages/EssayForge';
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import KnowledgeMap from './pages/KnowledgeMap';
import StudySites from './pages/StudySites';
import FocusTimer from './pages/FocusTimer';
import Admin from './pages/Admin';
import { authService } from './services/authService';

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
          <Route path="/study-sites" element={<StudySites />} />
          
          {/* Games */}
          <Route path="/studyverse" element={<StudyVerse />} />
          <Route path="/boss-raid" element={<BossRaid />} />
          <Route path="/raid" element={<Navigate to="/boss-raid" replace />} />
          
          {/* Social */}
          <Route path="/learning-groups" element={<LearningGroups />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/classmates" element={<Classmates />} />
          
          {/* AI */}
          <Route path="/nova-ai" element={<AIChat />} />
          <Route path="/ai-chat" element={<Navigate to="/nova-ai" replace />} />
          <Route path="/ai-hub" element={<AIHub />} />
          <Route path="/essay-forge" element={<EssayForge />} />
          
          {/* Progress */}
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/quests" element={<Navigate to="/dashboard" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/analytics" element={<Analytics />} />
          
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
