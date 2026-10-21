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
      { name: "Classmates", path: "/classmates", icon: Users },
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
              background: '#0d0f14',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '12px 0 40px rgba(0,0,0,0.8)',
            }}
          >
            {/* User Card */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-b border-white/[0.08]"
            >
              <div
                onClick={() => window.dispatchEvent(new CustomEvent('acadevance_open_profile', { detail: { user } }))}
                className="flex items-center gap-3.5 mb-4 cursor-pointer group"
              >
                <div
                  className="w-10 h-10 rounded bg-[#171a22] flex items-center justify-center text-xl border border-white/15 group-hover:border-brand-vermilion transition-colors"
                >
                  {user?.avatar_emoji || '⚡'}
                </div>
                <div>
                  <div className="font-bold text-text-primary text-sm leading-tight group-hover:text-white transition-colors">{user?.full_name || 'Scholar'}</div>
                  <div className="font-mono text-[10px] text-text-muted font-bold flex items-center gap-2 mt-0.5">
                    <span className="text-brand-vermilion uppercase">LVL {user?.level || 1}</span>
                    <span>·</span>
                    <span className="text-text-secondary uppercase">{gamificationService.getRank(user?.level || 1).title}</span>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div
                className="space-y-1.5 cursor-pointer font-mono"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                <div className="h-1.5 w-full rounded bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-brand-vermilion"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-text-muted font-bold">
                  <span>{(user?.xp || 0)} XP</span>
                  <span className="text-text-secondary">DAY {user?.streak || 1} STREAK</span>
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
                          flex items-center gap-3 px-3 py-2 rounded font-medium transition-all group
                          ${isActive
                            ? 'bg-brand-vermilion/15 text-brand-vermilion border border-brand-vermilion/30'
                            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <div>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-[13px]">{item.name}</span>
                            {isActive && (
                              <div
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-vermilion"
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
