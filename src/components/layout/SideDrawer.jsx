import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Compass, Sun, Timer,
  Sliders, Settings, X, Moon, Zap, Wind, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: "Daily Compass", path: "/dashboard", icon: Compass, desc: "Command center & highlight" },
  { name: "Circadian Stream", path: "/circadian", icon: Sun, desc: "24h biological timeline" },
  { name: "Wheel of Life", path: "/wheel", icon: Sliders, desc: "Interactive energy radar" },
  { name: "Focus Chronometer", path: "/focus-timer", icon: Timer, desc: "90m Ultradian engine" },
  { name: "Life OS Settings", path: "/profile", icon: Settings, desc: "Circadian parameters" },
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
            className="fixed top-0 left-0 z-[70] h-full w-[290px] overflow-y-auto bg-[#f8f6f0] border-r border-[#e5e1d5] shadow-xl font-sans text-xs flex flex-col justify-between text-left"
          >
            <div>
              {/* Header Identity */}
              <div className="p-5 border-b border-[#e5e1d5] flex items-center justify-between bg-[#f4f1ea]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#1b3b2b] rounded-sm" />
                  <span className="font-serif font-bold text-base tracking-tight text-[#1a1917]">
                    NUVIO
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#e5e1d5] bg-white text-[#827f76] font-bold">
                    LIFE OS
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-[#827f76] hover:text-[#1a1917] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Identity Strip */}
              <div className="px-5 py-4 border-b border-[#e5e1d5] bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f4f1ea] flex items-center justify-center text-sm border border-[#e0dcce]">
                    {user?.avatar_emoji || '⚡'}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-[#1a1917] truncate font-serif text-sm">
                      {user?.full_name || 'Navigator'}
                    </div>
                    <div className="text-[10px] text-[#827f76] font-mono truncate">
                      {user?.grade_level || 'Universal Life Optimizer'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Sections */}
              <nav className="p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#827f76] px-3 py-1">
                  Biological Modules
                </div>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      w-full flex items-start gap-3 px-3.5 py-2.5 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-[#1b3b2b] text-white shadow-xs font-semibold' 
                        : 'text-[#52504a] hover:bg-[#eae6db] hover:text-[#1a1917]'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs">{item.name}</div>
                      <div className={`text-[10px] font-mono ${isActive ? 'text-emerald-100' : 'text-[#827f76]'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Footer Protocols */}
            <div className="p-5 border-t border-[#e5e1d5] bg-[#f4f1ea] space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#827f76]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>OFFLINE BIOLOGICAL ENGINE</span>
              </div>
              <div className="text-[9px] font-mono text-[#827f76] leading-relaxed">
                40Hz Binaural • NSDR Pacer • Cal Newport Shutdown
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
