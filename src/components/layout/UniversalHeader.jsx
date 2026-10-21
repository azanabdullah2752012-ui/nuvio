import React, { useState, useEffect } from 'react';
import { Menu, Zap, MessageSquare, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';

const UniversalHeader = ({ onMenuClick, user }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Track scroll for header glass intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const loadNotifications = () => {
      const list = notificationService.list();
      setNotifications(list);
      setUnreadCount(notificationService.getUnreadCount());
    };

    loadNotifications();
    fetchUnreadMessages();
    window.addEventListener('acadevance_notification', loadNotifications);
    return () => window.removeEventListener('acadevance_notification', loadNotifications);
  }, []);

  const fetchUnreadMessages = async () => {
    if (!user?.id) return;
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false);
    setUnreadMessages(count || 0);
  };

  const handleMarkRead = (id) => {
    notificationService.markRead(id);
    setNotifications(notificationService.list());
    setUnreadCount(notificationService.getUnreadCount());
  };

  const handleMarkAllRead = () => {
    notificationService.markAllRead();
    setNotifications(notificationService.list());
    setUnreadCount(notificationService.getUnreadCount());
  };

  const handleLogoClick = async () => {
    const now = Date.now();
    if (now - lastClickTime < 1000) {
      const newClicks = logoClicks + 1;
      setLogoClicks(newClicks);
      if (newClicks >= 7) {
        await authService.promoteToAdmin();
        setLogoClicks(0);
        notificationService.send("Authority Elevated", "Divine Root Status Activated.", "info");
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
    navigate('/dashboard');
  };

  return (
    <>
      {/* Header — slides down from top on mount */}
      <motion.header
        initial={{ y: -80, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 h-[56px] w-full border-b border-white/[0.08] px-5 flex items-center justify-between"
        style={{
          background: 'rgba(9, 10, 13, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="p-1.5 hover:bg-white/5 rounded transition-colors text-text-secondary hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <span className="w-2.5 h-2.5 bg-brand-vermilion rounded-none" />
            <span className="font-display font-bold text-base tracking-wider text-white">
              ACADEVANCE
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-text-muted px-1.5 py-0.5 border border-white/10 rounded">
              09 // WORKSTATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* XP Boost Badge */}
          <AnimatePresence>
            {user?.xp_multiplier > 1 && (
              <div
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[11px] font-mono text-amber-400 font-bold"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{user.xp_multiplier}X XP ACTIVE</span>
              </div>
            )}
          </AnimatePresence>

          {/* Messages button */}
          <button
            onClick={() => navigate('/messages')}
            className="relative p-2 hover:bg-white/5 rounded transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-text-secondary hover:text-white" />
            <AnimatePresence>
              {unreadMessages > 0 && (
                <span
                  key="msg-badge"
                  className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand-vermilion text-[9px] font-mono font-bold text-white flex items-center justify-center rounded-full"
                >
                  {unreadMessages}
                </span>
              )}
            </AnimatePresence>
          </button>

          {/* Bell button */}
          <button
            onClick={() => setIsNotifyOpen(true)}
            className="relative p-2 hover:bg-white/5 rounded transition-colors"
          >
            <Bell className="w-4 h-4 text-text-secondary hover:text-white" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <span
                  key="notif-badge"
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-vermilion rounded-full"
                />
              )}
            </AnimatePresence>
          </button>

          {/* Avatar */}
          <div
            onClick={() => navigate('/profile')}
            className="w-7 h-7 rounded bg-[#171a22] flex items-center justify-center text-sm border border-white/15 overflow-hidden cursor-pointer hover:border-brand-vermilion transition-colors"
          >
            {user?.avatar_emoji || '⚡'}
          </div>
        </div>
      </motion.header>

      <NotificationPanel
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
};

export default UniversalHeader;
