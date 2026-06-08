import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, GraduationCap, Trophy, Users, 
  MessageCircle, Sparkles, ShoppingBag, Settings, ShieldAlert,
  Calendar, Timer, Map, Globe, Gamepad2, Sword, Skull, PenTool,
  History, BarChart3, ListChecks, Award, BookMarked, UserCircle
} from 'lucide-react';
import { xpService } from '../../services/xpService';
import { gamificationService } from '../../services/gamificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const navSections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", path: "/profile", icon: UserCircle },
    ]
  },
  {
    label: "Study Arsenal",
    items: [
      { name: "Flashcards", path: "/flashcards", icon: BookMarked },
      { name: "Mission Control", path: "/homework", icon: ListChecks },
      { name: "Calendar", path: "/calendar", icon: Calendar },
      { name: "Focus Timer", path: "/focus-timer", icon: Timer },
      { name: "CBSE Hub", path: "/curriculum", icon: BookOpen },
    ]
  },
  {
    label: "Study Verse Hub",
    items: [
      { name: "Verse Portal", path: "/study-verse", icon: Gamepad2 },
      { name: "Boss Raid", path: "/boss-raid", icon: Skull },
      { name: "Journey Map", path: "/journey-map", icon: Map },
    ]
  },
  {
    label: "Learning",
    items: [
      { name: "Study Hub", path: "/study-hub", icon: BookOpen },
      { name: "Writing Workshop", path: "/essay-forge", icon: PenTool },
    ]
  },
  {
    label: "Social Hub",
    items: [
      { name: "Groups", path: "/learning-groups", icon: Users },
      { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
      { name: "Messages", path: "/messages", icon: MessageCircle },
    ]
  },
  {
    label: "Resources & Rewards",
    items: [
      { name: "Study Sites", path: "/study-sites", icon: Globe },
      { name: "Achievements", path: "/achievements", icon: Award },
      { name: "Seasonal Pass", path: "/seasonal-pass", icon: Calendar },
      { name: "Shop", path: "/shop", icon: ShoppingBag },
      { name: "Analytics", path: "/analytics", icon: BarChart3 },
    ]
  }
];

// Flatten all items for stagger index calculation
const allItems = navSections.flatMap(s => s.items);
const getStaggerDelay = (path) => {
  const idx = allItems.findIndex(i => i.path === path);
  return idx * 0.03;
};

const SideDrawer = ({ isOpen, onClose, user }) => {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const navigate = useNavigate();

  const drawerVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 35,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit:   { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="drawer-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(2,3,8,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer-panel"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 z-[70] h-full w-[280px] overflow-y-auto"
            style={{
              background: 'rgba(8, 9, 16, 0.95)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRight: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '8px 0 40px rgba(0,0,0,0.6), 2px 0 0 rgba(168,85,247,0.08)',
            }}
          >
            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div
                onClick={() => window.dispatchEvent(new CustomEvent('acadevance_open_profile', { detail: { user } }))}
                className="flex items-center gap-4 mb-4 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  className="w-12 h-12 rounded-full bg-nuvio-purple-500/80 flex items-center justify-center text-2xl border-2 border-white/10 group-hover:border-nuvio-cyan transition-all"
                  style={{ boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}
                >
                  {user?.avatar_emoji || '⚡'}
                </motion.div>
                <div>
                  <div className="font-bold text-text-primary leading-tight group-hover:text-nuvio-cyan transition-colors">{user?.full_name || 'Student'}</div>
                  <div className="text-[10px] text-text-muted font-bold flex flex-col gap-0.5 mt-0.5">
                    <span className="text-nuvio-purple-400 font-black uppercase">Level {user?.level || 1}</span>
                    <span className="text-nuvio-cyan font-black uppercase tracking-wider text-[8px]">{gamificationService.getRank(user?.level || 1).title}</span>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div
                className="nv-interactive space-y-2 cursor-pointer"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full nv-xp-bar"
                    style={{ background: 'linear-gradient(90deg, #a855f7, #06b6d4)' }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">{(user?.xp || 0)} XP Total</span>
                  <span className="text-[10px] text-nuvio-purple-400 font-bold uppercase tracking-widest">🔥 {user?.streak || 1} day streak</span>
                </div>
              </div>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 pt-4 space-y-3 overflow-hidden"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="text-[9px] font-black text-nuvio-cyan uppercase tracking-[0.3em] mb-2">Focus Distribution</div>
                    {Object.entries(xpService.getBreakdown()).map(([key, val]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[8px] font-black uppercase text-text-muted">
                          <span>{key}</span>
                          <span>{val} XP</span>
                        </div>
                        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (val / (user?.xp || 1)) * 100)}%` }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-nuvio-cyan"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Navigation — staggered entrance */}
            <nav className="p-3 space-y-6 mb-8">
              {navSections.map((section, sIdx) => (
                <motion.div
                  key={sIdx}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + sIdx * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-1"
                >
                  <div className="nv-label px-3 mb-2">{section.label}</div>
                  {section.items.map((item, iIdx) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.18 + sIdx * 0.06 + iIdx * 0.035,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-semibold transition-all group
                          ${isActive
                            ? 'bg-nuvio-purple-500/15 text-nuvio-purple-400 border border-nuvio-purple-500/20'
                            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: isActive ? 0 : 5 }}
                              className={isActive ? 'nv-glow-icon' : ''}
                            >
                              <item.icon className="w-5 h-5" />
                            </motion.div>
                            <span className="text-[14px]">{item.name}</span>
                            {isActive && (
                              <motion.div
                                layoutId="active-pill"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-nuvio-purple-400"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>
              ))}

              {/* Admin section */}
              {user?.role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.35 }}
                  className="space-y-1"
                >
                  <div className="nv-label px-3 mb-2 text-nuvio-red">Administration</div>
                  <NavLink
                    to="/admin"
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-semibold transition-all
                      ${isActive
                        ? 'bg-nuvio-red/15 text-nuvio-red border border-nuvio-red/20'
                        : 'text-nuvio-red/70 hover:bg-nuvio-red/10 border border-transparent'}
                    `}
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-[14px]">Admin Panel</span>
                  </NavLink>
                </motion.div>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
