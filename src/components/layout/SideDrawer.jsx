import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Timer,
  ListChecks, Settings, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks & Homework", path: "/homework", icon: ListChecks },
  { name: "Focus Timer", path: "/focus-timer", icon: Timer },
  { name: "Academic Calendar", path: "/calendar", icon: Calendar },
  { name: "Scholar Settings", path: "/profile", icon: Settings },
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
            className="fixed top-0 left-0 z-[70] h-full w-[280px] overflow-y-auto bg-[#f8f6f0] border-r border-[#e5e1d5] shadow-xl font-sans text-xs flex flex-col justify-between"
          >
            <div>
              {/* Header Identity */}
              <div className="p-5 border-b border-[#e5e1d5] flex items-center justify-between bg-[#f4f1ea]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
                  <span className="font-serif font-bold text-base tracking-tight text-[#1a1917]">
                    ACADEVANCE
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-[#827f76] hover:text-[#1a1917] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scholar Identity Strip */}
              <div className="px-5 py-4 border-b border-[#e5e1d5] bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f4f1ea] flex items-center justify-center text-sm border border-[#e0dcce]">
                    {user?.avatar_emoji || '🎓'}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-[#1a1917] truncate font-serif text-sm">{user?.full_name || 'Scholar'}</div>
                    <div className="text-[10px] text-[#827f76] font-mono">Productivity Workstation</div>
                  </div>
                </div>
              </div>

              {/* Navigation Sections */}
              <nav className="p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#827f76] px-3 py-1">
                  Productivity Arsenal
                </div>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all
                      ${isActive 
                        ? 'bg-[#1b3b2b] text-white font-bold shadow-sm' 
                        : 'text-[#52504a] hover:bg-[#ede9de] hover:text-[#1a1917]'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Footer Note */}
            <div className="p-4 border-t border-[#e5e1d5] bg-[#f4f1ea] text-[10px] font-mono text-[#827f76] text-center">
              Student Productivity Suite
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
