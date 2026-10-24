import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core
import Layout from './components/layout/Layout';

// Primary Workspace (Kaiser Command Deck)
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Minimalist Loading Spinner
const AppLoader = () => (
  <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-2 border-[#e8e6df] border-t-emerald-800 rounded-full animate-spin" />
    <div className="font-mono text-xs text-[#8e8d8a] uppercase tracking-widest">
      Initializing Kaiser Command Deck...
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Main Workstation */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
