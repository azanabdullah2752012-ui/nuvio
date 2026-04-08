import React from 'react';
import { X, Bell, Info, AlertTriangle, PartyPopper, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[120] h-full w-full max-w-[400px] bg-background-card border-l border-border shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-nuvio-purple-400" />
                <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Notifications</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-text-primary transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50">
                  <Bell className="w-12 h-12 mb-4 text-text-muted" />
                  <p className="text-text-secondary font-bold">All caught up!</p>
                  <p className="text-xs text-text-muted">No new notifications at the moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => onMarkRead(n.id)}
                      className={`p-6 hover:bg-white/5 transition-all cursor-pointer relative group ${!n.is_read ? 'bg-nuvio-purple-500/[0.03]' : ''}`}
                    >
                      {!n.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-nuvio-purple-500" />
                      )}
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          n.type === 'warning' ? 'bg-nuvio-orange/10 text-nuvio-orange' : 
                          n.type === 'celebration' ? 'bg-nuvio-green/10 text-nuvio-green' : 
                          'bg-nuvio-purple-500/10 text-nuvio-purple-400'
                        }`}>
                          {n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                           n.type === 'celebration' ? <PartyPopper className="w-5 h-5" /> : 
                           <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`text-sm font-black ${!n.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {n.title}
                            </h3>
                            <span className="text-[10px] font-bold text-text-muted">{n.time}</span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-background-base/50">
              <button 
                onClick={onMarkAllRead}
                className="w-full nv-btn-secondary text-xs uppercase tracking-widest gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckCircle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default NotificationPanel;
