import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({
  title = '¡Reseña publicada con éxito!',
  description = 'Tu análisis ya está disponible en el feed de la comunidad.',
  type = 'success', // 'success' | 'info' | 'warning' | 'error'
  duration = 4000,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 border-l-4 border-l-[#B80C09] shadow-[0_20px_50px_-10px_rgba(75,40,64,0.15)] dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7)] flex items-start gap-3.5 transition-colors duration-300"
          role="alert"
        >
          {/* Ícono de Confirmación / Estado */}
          <div className="w-9 h-9 rounded-xl bg-[#f8e9f6] dark:bg-[#231123] text-[#B80C09] flex items-center justify-center shrink-0 border border-[#e6d5e2] dark:border-white/10 shadow-2xs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          {/* Mensaje de la Notificación */}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <h5 className="text-sm font-bold text-[#231123] dark:text-white leading-tight">
              {title}
            </h5>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar notificación"
            className="text-[#81737e] dark:text-[#B89CB0] hover:text-[#B80C09] dark:hover:text-white transition-colors cursor-pointer p-1 rounded-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
