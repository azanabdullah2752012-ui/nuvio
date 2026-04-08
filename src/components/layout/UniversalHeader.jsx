import React, { useState, useEffect } from 'react';
import { Menu, Zap, MessageSquare, Bell, Search } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';

const UniversalHeader = ({ onMenuClick, user }) => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="text-xl font-black nv-gradient-text tracking-tighter">⚡ NUVIO</span>
          </div>
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
