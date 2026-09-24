import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LikeButton = ({
  isLiked = false,
  likesCount = 0,
  onToggleLike = () => {},
  size = 'md',
  showCount = true,
  className = '',
}) => {
  const [floatingHearts, setFloatingHearts] = useState([]);

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const currentIconSize = iconSizes[size] || 18;

  const handleClick = (e) => {
    e.stopPropagation();
    // Disparar animación de corazón flotante desvaneciéndose hacia arriba
    if (!isLiked) {
      const newHeart = {
        id: Date.now() + Math.random(),
        rotation: (Math.random() - 0.5) * 30, // ligera rotación aleatoria
        xOffset: (Math.random() - 0.5) * 16,
      };
      setFloatingHearts((prev) => [...prev, newHeart]);

      // Limpiar el corazón después de la animación
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 900);
    }

    onToggleLike();
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Contenedor de corazones flotantes que se desvanecen hacia arriba */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.6, y: 0, x: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0.8, 0],
              scale: [0.6, 1.4, 1.2, 0.9],
              y: -42,
              x: heart.xOffset,
              rotate: heart.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -top-1 left-2 pointer-events-none z-30 select-none text-[#B80C09]"
          >
            <svg
              width={currentIconSize + 4}
              height={currentIconSize + 4}
              viewBox="0 0 24 24"
              fill="#B80C09"
              stroke="#B80C09"
              strokeWidth="2"
              className="drop-shadow-[0_2px_8px_rgba(184,12,9,0.5)]"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Botón Principal */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer select-none ${
          isLiked
            ? 'bg-rose-500/15 dark:bg-rose-500/25 text-[#B80C09] dark:text-rose-300 border border-rose-500/30 shadow-xs font-black'
            : 'bg-black/5 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] dark:hover:text-rose-400 border border-black/5 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-900/40'
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center justify-center shrink-0"
        >
          <svg
            width={currentIconSize}
            height={currentIconSize}
            viewBox="0 0 24 24"
            fill={isLiked ? '#B80C09' : 'none'}
            stroke={isLiked ? '#B80C09' : 'currentColor'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-200"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </motion.div>

        {showCount && (
          <span className="font-mono text-xs sm:text-sm font-bold transition-colors">
            {likesCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default LikeButton;
