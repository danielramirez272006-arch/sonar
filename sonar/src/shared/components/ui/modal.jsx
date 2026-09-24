import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden my-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#e6d5e2] dark:border-white/10">
            <h3 className="text-lg font-bold text-[#231123] dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#5c435a] dark:text-[#B89CB0] cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
