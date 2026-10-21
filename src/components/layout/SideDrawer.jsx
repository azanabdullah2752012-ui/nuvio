import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calendar, Timer, PenTool,
  ListChecks, BookMarked, Settings, Globe, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navSections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "CBSE Curriculum", path: "/curriculum", icon: BookOpen },
      { name: "Subject Library", path: "/subject-library", icon: Library },
    ]
  },
  {
    label: "Study Arsenal",
    items: [
      { name: "Active Flashcards", path: "/flashcards", icon: BookMarked },
      { name: "Tasks & Homework", path: "/homework", icon: ListChecks },
      { name: "Academic Calendar", path: "/calendar", icon: Calendar },
      { name: "Focus Timer", path: "/focus-timer", icon: Timer },
    ]
  },
  {
    label: "Academic Workshop",
    items: [
      { name: "Study Hub Notes", path: "/study-hub", icon: BookOpen },
      { name: "Essay Forge", path: "/essay-forge", icon: PenTool },
      { name: "Study Bookmarks", path: "/study-sites", icon: Globe },
      { name: "Settings", path: "/profile", icon: Settings },
    ]
  }
];

const SideDrawer = ({ isOpen, onClose, user }) => {
  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 350, damping: 35 },
    },
    exit: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 380, damping: 40 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit:   { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Chassis */}
          <motion.aside
            key="drawer-panel"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 z-[70] h-full w-[270px] overflow-y-auto bg-[#0d0f14] border-r border-white/10 shadow-2xl font-mono text-xs flex flex-col"
          >
            {/* Header Identity */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-brand-vermilion rounded-none" />
                <span className="font-display font-bold text-sm tracking-wider text-white">
                  ACADEVANCE
                </span>
              </div>
              <span className="text-[10px] text-text-muted px-1.5 py-0.5 border border-white/10 rounded">
                CLASS 9
              </span>
            </div>

            {/* Scholar Identity Strip */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#171a22] flex items-center justify-center text-sm border border-white/10">
                  {user?.avatar_emoji || '⚡'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-white truncate font-sans text-xs">{user?.full_name || 'Scholar'}</div>
                  <div className="text-[10px] text-text-muted font-mono">{user?.grade_level || 'Grade 9'} · CBSE</div>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <nav className="p-4 space-y-6 flex-1">
              {navSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted px-3 py-1">
                    {section.label}
                  </div>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded font-medium transition-colors
                        ${isActive
                          ? 'bg-brand-vermilion/15 text-white border border-brand-vermilion/30'
                          : 'text-text-secondary hover:bg-white/[0.04] hover:text-white border border-transparent'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-vermilion' : 'text-text-muted'}`} />
                          <span className="text-xs">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            {/* Footer Tag */}
            <div className="p-4 border-t border-white/[0.08] text-[10px] text-text-muted flex justify-between items-center">
              <span>LOCAL // OFFLINE</span>
              <span className="text-emerald-400">● READY</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
