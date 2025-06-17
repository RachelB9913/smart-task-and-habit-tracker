// src/components/PageWrapper.js
import { motion } from 'framer-motion';

export default function PageWrapper({ children, direction = 'left' }) {
  const variants = {
    initial: {
      x: direction === 'left' ? '-100vw' : '100vw',
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 60, damping: 20 },
    },
    exit: {
      x: direction === 'left' ? '100vw' : '-100vw',
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
