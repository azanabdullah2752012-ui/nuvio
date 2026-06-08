import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
  },
};

const transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};

const exitTransition = {
  duration: 0.28,
  ease: [0.4, 0, 1, 1],
};

/**
 * PageTransition
 * Wraps page content with a smooth framer-motion enter/exit animation.
 * Use inside <AnimatePresence mode="wait"> with a location key.
 */
const PageTransition = ({ children, className = '' }) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={transition}
    style={{ willChange: 'transform, opacity, filter' }}
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;
