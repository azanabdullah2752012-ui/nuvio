import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, GraduationCap, Trophy, Users, 
  MessageCircle, Sparkles, ShoppingBag, Settings, ShieldAlert,
  Calendar, Timer, Map, Globe, Gamepad2, Sword, Skull, PenTool,
  History, BarChart3, ListChecks, Award, BookMarked, UserCircle
} from 'lucide-react';

const navSections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", path: "/profile", icon: UserCircle },
    ]
  },
  {
    label: "Study Tools",
    items: [
      { name: "Flashcards", path: "/flashcards", icon: BookOpen },
      { name: "Homework", path: "/homework", icon: ListChecks },
      { name: "Calendar", path: "/calendar", icon: Calendar },
      { name: "Focus Timer", path: "/focus-timer", icon: Timer },
      { name: "Knowledge Map", path: "/knowledge-map", icon: Map },
      { name: "Study Sites", path: "/study-sites", icon: Globe },
    ]
  },
  {
    label: "Study Verse",
    items: [
      { name: "Game Hub", path: "/studyverse", icon: Gamepad2 },
      { name: "Study Battles", path: "/studyverse", icon: Sword },
      { name: "Boss Raid", path: "/boss-raid", icon: Skull },
    ]
  },
  {
    label: "AI Suite",
    items: [
      { name: "Nova AI", path: "/nova-ai", icon: Sparkles },
      { name: "AI Hub", path: "/ai-hub", icon: Sparkles },
      { name: "Essay Forge", path: "/essay-forge", icon: PenTool },
    ]
  },
  {
    label: "Social & Progression",
    items: [
      { name: "Groups", path: "/learning-groups", icon: Users },
      { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
      { name: "Classmates", path: "/classmates", icon: Users },
      { name: "Messages", path: "/messages", icon: MessageCircle },
    ]
  },
  {
    label: "Rewards",
    items: [
      { name: "Quests", path: "/quests", icon: GraduationCap },
      { name: "Achievements", path: "/achievements", icon: Award },
      { name: "Shop", path: "/shop", icon: ShoppingBag },
      { name: "Analytics", path: "/analytics", icon: BarChart3 },
    ]
  }
];

const SideDrawer = ({ isOpen, onClose, user }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside className={`
        fixed top-0 left-0 z-[70] h-full w-[280px] bg-background-card border-r border-border
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* User Card */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-2xl border-2 border-white/10">
              {user?.avatar_emoji || '⚡'}
            </div>
            <div>
              <div className="font-bold text-text-primary leading-tight">{user?.full_name || 'Student'}</div>
              <div className="text-xs text-nuvio-purple-400 font-bold">Level {user?.level || 1}</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-nuvio-purple-500 rounded-full" 
              style={{ width: '45%' }} 
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-text-muted font-bold">450 / 1000 XP</span>
            <span className="text-[10px] text-nuvio-purple-400 font-bold">🔥 {user?.streak || 1} day streak</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-6 mb-8">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="nv-label px-3 mb-2">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-semibold transition-all
                    ${isActive 
                      ? 'bg-nuvio-purple-500/15 text-nuvio-purple-400 border border-nuvio-purple-500/20' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[14px]">{item.name}</span>
                </NavLink>
              ))}
            </div>
          ))}

          {/* Admin section */}
          {user?.role === 'admin' && (
            <div className="space-y-1">
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
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default SideDrawer;
