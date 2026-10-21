import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SideDrawer = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 left-0 z-50 h-full w-[260px] bg-[#fbfbfa] border-r border-[#eceae3] p-6 flex flex-col justify-between font-sans text-left"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#eceae3]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b2b]" />
                  <span className="font-serif font-bold text-base text-[#1d1d1f]">NUVIO</span>
                </div>
                <button onClick={onClose} className="p-1 text-[#8e8d8a] hover:text-[#1d1d1f]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={onClose}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#1b3b2b] text-white"
                >
                  <Sun className="w-4 h-4" />
                  <span>Today</span>
                </NavLink>
              </nav>
            </div>

            <div className="text-[11px] font-mono text-[#8e8d8a]">
              Things 3 Calm Minimalist Edition
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
