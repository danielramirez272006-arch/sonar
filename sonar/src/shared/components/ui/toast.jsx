import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({
  message,
  title,
  description,
  type = 'info', // 'success' | 'info' | 'warning' | 'error'
  duration = 3500,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const displayTitle = title || (message ? message : 'Notificación de Sonar');
  const displayDescription = description || (title && message ? message : null);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    }
    if (type === 'error') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-auto p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#341b34]/95 backdrop-blur-xl border border-[#e6d5e2] dark:border-white/10 border-l-4 border-l-[#B80C09] shadow-[0_20px_50px_-10px_rgba(75,40,64,0.18)] dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] flex items-center gap-3 transition-colors duration-300"
          role="alert"
        >
          {/* Ícono de Estado */}
          <div className="w-8 h-8 rounded-xl bg-[#f8e9f6] dark:bg-[#231123] text-[#B80C09] flex items-center justify-center shrink-0 border border-[#e6d5e2] dark:border-white/10 shadow-2xs">
            {getIcon()}
          </div>

          {/* Mensaje de la Notificación */}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
            <h5 className="text-xs sm:text-sm font-bold text-[#231123] dark:text-white leading-tight">
              {displayTitle}
            </h5>
            {displayDescription && (
              <p className="text-[11px] sm:text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
                {displayDescription}
              </p>
            )}
          </div>

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar notificación"
            className="text-[#81737e] dark:text-[#B89CB0] hover:text-[#B80C09] dark:hover:text-white transition-colors cursor-pointer p-1 rounded-lg shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
