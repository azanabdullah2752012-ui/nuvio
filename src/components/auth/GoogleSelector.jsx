import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronRight, User, MoreHorizontal } from 'lucide-react';

const GoogleSelector = ({ isOpen, onClose, onSelect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const accounts = [
    { 
      name: 'Azan Abdullah', 
      email: 'azanabdullah2752012@gmail.com', 
      avatar: '🛡️',
      role: 'admin'
    },
    { 
      name: 'Guest Learner', 
      email: 'guest.student@gmail.com', 
      avatar: '⚡',
      role: 'student'
    }
  ];

  const handleAccountClick = (acc) => {
    setIsConnecting(true);
    setSelectedEmail(acc.email);
    setTimeout(() => {
      onSelect(acc);
      setIsConnecting(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={!isConnecting ? onClose : undefined}
            className="absolute inset-0 bg-[#202124]/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl relative z-10 overflow-hidden font-sans"
          >
            {/* Google Colored Progress Bar */}
            {isConnecting && (
              <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"
                />
              </div>
            )}

            <div className="p-8 pb-12">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 mb-4">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-normal text-[#202124] mb-1">Choose an account</h1>
                <p className="text-sm text-[#5f6368]">to continue to <span className="text-[#3c4043] font-medium">Nuvio</span></p>
              </div>

              <div className="space-y-0 pt-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.email}
                    disabled={isConnecting}
                    onClick={() => handleAccountClick(acc)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-[#f8f9fa] border-b border-gray-100 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl overflow-hidden border border-gray-200">
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#3c4043] truncate">{acc.name}</div>
                      <div className="text-xs text-[#5f6368] truncate">{acc.email}</div>
                    </div>
                    {selectedEmail === acc.email && isConnecting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#4285F4] border-t-transparent animate-spin" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
                
                <button
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 p-3 hover:bg-[#f8f9fa] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                    <User className="w-5 h-5 text-[#5f6368]" />
                  </div>
                  <div className="text-sm font-medium text-[#3c4043]">Use another account</div>
                </button>
              </div>

              <div className="mt-8 text-xs text-[#5f6368] leading-relaxed">
                To continue, Google will share your name, email address, language preference, and profile picture with Nuvio. Before using this app, you can review Nuvio’s <span className="text-[#4285F4] hover:underline cursor-pointer">privacy policy</span> and <span className="text-[#4285F4] hover:underline cursor-pointer">terms of service</span>.
              </div>
            </div>

            <div className="bg-[#f8f9fa] p-4 flex justify-between items-center text-xs text-[#5f6368]">
               <div className="flex gap-4">
                  <span className="hover:text-gray-900 cursor-pointer">English (United States)</span>
               </div>
               <div className="flex gap-4">
                  <span className="hover:text-gray-900 cursor-pointer">Help</span>
                  <span className="hover:text-gray-900 cursor-pointer">Privacy</span>
                  <span className="hover:text-gray-900 cursor-pointer">Terms</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoogleSelector;
