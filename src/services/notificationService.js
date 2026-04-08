const STORAGE_KEY = 'nuvio_notifications';

export const notificationService = {
  list: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', title: 'Welcome to Nuvio!', message: 'Start by creating your first flashcard deck.', type: 'info', is_read: false, time: '2m ago' },
      { id: '2', title: 'Achievement Unlocked', message: 'You earned the "First Step" badge!', type: 'celebration', is_read: false, time: '1h ago' },
      { id: '3', title: 'Streak Warning', message: 'Only 3 hours left to save your 12-day streak!', type: 'warning', is_read: true, time: '3h ago' }
    ];
  },

  send: (title, message, type = 'info') => {
    const list = notificationService.list();
    const newNotify = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      is_read: false,
      time: 'Just now'
    };
    const updated = [newNotify, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time UI updates
    window.dispatchEvent(new CustomEvent('nuvio_notification', { detail: newNotify }));
    return newNotify;
  },

  markRead: (id) => {
    const list = notificationService.list();
    const updated = list.map(n => n.id === id ? { ...n, is_read: true } : n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  markAllRead: () => {
    const list = notificationService.list();
    const updated = list.map(n => ({ ...n, is_read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getUnreadCount: () => {
    return notificationService.list().filter(n => !n.is_read).length;
  }
};
