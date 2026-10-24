import React from 'react';
import { Outlet } from 'react-router-dom';
import UniversalHeader from './UniversalHeader';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <UniversalHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
