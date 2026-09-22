import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedLogo = ({ className = '', onClick, showText = true, size = 'default' }) => {
  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'w-8 h-8' : 'w-10 h-10 sm:w-11 sm:h-11';
  const textSize = isSmall ? 'text-base tracking-[0.18em]' : 'text-lg sm:text-xl tracking-[0.22em]';

  return (
    <motion.div
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      onClick={onClick}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      initial="initial"
    >
      {/* Isotipo Sonar Logo público original sin distorsiones cromáticas */}
      <motion.div
        className={`relative ${iconSize} shrink-0 flex items-center justify-center`}
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: { 
            rotate: 15, 
            scale: 1.08,
            transition: { type: 'spring', stiffness: 260, damping: 18 }
          }
        }}
      >
        <img
          src="/logo-sonar.svg"
          alt="Sonar Logo"
          className="w-full h-full object-contain transition-all duration-200 drop-shadow-[0_4px_12px_rgba(184,12,9,0.3)]"
        />
      </motion.div>

      {/* Logotipo Tipográfico "SONAR" */}
      {showText && (
        <motion.span
          className={`font-black uppercase text-[#231123] dark:text-[#DCDCDD] group-hover:text-[#B80C09] dark:group-hover:text-[#ff4d4a] transition-colors duration-200 ${textSize}`}
          style={{
            fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          SONAR
        </motion.span>
      )}
    </motion.div>
  );
};

export default AnimatedLogo;
