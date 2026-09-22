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
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
          isLiked
            ? 'text-[#B80C09] font-bold'
            : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09]'
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          <svg
            width={currentIconSize}
            height={currentIconSize}
            viewBox="0 0 24 24"
            fill={isLiked ? '#B80C09' : 'none'}
            stroke={isLiked ? '#B80C09' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-200"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </motion.div>

        {showCount && (
          <span className="select-none text-xs sm:text-sm font-semibold transition-colors">
            {likesCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default LikeButton;
