import React, { useState, useEffect } from 'react';
import { Menu, Zap, MessageSquare, Bell, Search } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const UniversalHeader = ({ onMenuClick, user }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSyncPulse = (e) => {
      setIsSyncing(e.detail.syncing);
    };
    window.addEventListener('nuvio_sync_pulse', handleSyncPulse);
    return () => window.removeEventListener('nuvio_sync_pulse', handleSyncPulse);
  }, []);

  useEffect(() => {
    const loadNotifications = () => {
      const list = notificationService.list();
      setNotifications(list);
      setUnreadCount(notificationService.getUnreadCount());
    };

    loadNotifications();
    window.addEventListener('nuvio_notification', loadNotifications);
    return () => window.removeEventListener('nuvio_notification', loadNotifications);
  }, []);

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
      <header className="sticky top-0 z-50 h-[60px] w-full bg-background-base/80 backdrop-blur-md border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-text-primary" />
          </button>
          <div className="flex items-center gap-1 cursor-pointer select-none" onClick={handleLogoClick}>
            <span className="text-xl font-black nv-gradient-text tracking-tighter">⚡ NUVIO</span>
          </div>
          {isSyncing && (
            <div className="flex items-center gap-2 bg-nuvio-cyan text-black px-3 py-1 border-2 border-black font-black text-[9px] uppercase tracking-widest leading-none shadow-[2px_2px_0_#000]">
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Neural Sync
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* XP Boost Timer */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-nuvio-orange/10 border border-nuvio-orange/20 rounded-full">
            <Zap className="w-4 h-4 text-nuvio-orange fill-nuvio-orange" />
            <span className="text-xs font-bold text-nuvio-orange">2X XP 14:20</span>
          </div>

          <button 
            onClick={() => navigate('/messages')}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-nuvio-red text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background-base">
              3
            </span>
          </button>

          <button 
            onClick={() => setIsNotifyOpen(true)}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-nuvio-purple-400 rounded-full border-2 border-background-base" />
            )}
          </button>

          <div 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-lg border-2 border-white/10 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            {user?.avatar_emoji || '👤'}
          </div>
        </div>
      </header>

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
