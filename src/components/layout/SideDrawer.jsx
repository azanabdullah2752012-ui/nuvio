import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calendar, Timer, PenTool,
  ListChecks, BookMarked, Settings, Globe, Library, X
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
      { name: "Scholar Settings", path: "/profile", icon: Settings },
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
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Chassis */}
          <motion.aside
            key="drawer-panel"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 z-[70] h-full w-[280px] overflow-y-auto bg-[#f8f6f0] border-r border-[#e5e1d5] shadow-xl font-sans text-xs flex flex-col"
          >
            {/* Header Identity */}
            <div className="p-5 border-b border-[#e5e1d5] flex items-center justify-between bg-[#f4f1ea]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
                <span className="font-display font-bold text-sm tracking-tight text-[#1a1917]">
                  ACADEVANCE
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-zinc-500 hover:text-black rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scholar Identity Strip */}
            <div className="px-5 py-4 border-b border-[#e5e1d5] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f4f1ea] flex items-center justify-center text-sm border border-[#e0dcce]">
                  {user?.avatar_emoji || '📖'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-[#1a1917] truncate font-sans text-xs">{user?.full_name || 'Scholar'}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Class {user?.grade_level || '9th'} CBSE</div>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <nav className="p-4 space-y-6 flex-1">
              {navSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-500 px-3 py-1">
                    {section.label}
                  </div>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                        ${isActive
                          ? 'bg-white text-[#1b3b2b] font-semibold border border-[#d8d2c0] shadow-sm'
                          : 'text-[#4e4c46] hover:bg-[#ede9de] hover:text-[#1a1917] border border-transparent'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`w-4 h-4 ${isActive ? 'text-[#1b3b2b]' : 'text-zinc-500'}`} />
                          <span className="text-xs">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            {/* Footer Tag */}
            <div className="p-4 border-t border-[#e5e1d5] text-[10px] font-mono text-zinc-500 flex justify-between items-center bg-[#f4f1ea]">
              <span>CURRICULUM ARCHIVE</span>
              <span className="text-[#1b3b2b] font-bold">● ACTIVE</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;