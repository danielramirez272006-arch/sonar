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
      {/* Isotipo Sonar Radar: 4 pétalos concéntricos */}
      <motion.div
        className={`relative ${iconSize} shrink-0 flex items-center justify-center`}
        variants={{
          initial: { rotate: 0, scale: 1 },
          hover: { 
            rotate: 20, 
            scale: 1.08,
            transition: { type: 'spring', stiffness: 260, damping: 18 }
          }
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(184,12,9,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top Petal Gradient (Crimson) */}
            <radialGradient id="sonarTopPetal" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#9E1B29" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4A0E18" stopOpacity="0.82" />
            </radialGradient>

            {/* Left Petal Gradient (Brand Red) */}
            <radialGradient id="sonarLeftPetal" cx="35%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#C51613" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#6B0907" stopOpacity="0.82" />
            </radialGradient>

            {/* Bottom Petal Gradient (Dark Petrol/Navy) */}
            <radialGradient id="sonarBottomPetal" cx="50%" cy="65%" r="65%">
              <stop offset="0%" stopColor="#1B324B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0E1A29" stopOpacity="0.88" />
            </radialGradient>

            {/* Right Petal Gradient (Deep Purple/Plum) */}
            <radialGradient id="sonarRightPetal" cx="65%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#4B2A5E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#231130" stopOpacity="0.88" />
            </radialGradient>
          </defs>

          {/* 4 Overlapping Petals */}
          <g>
            {/* Top Petal */}
            <circle cx="60" cy="38" r="27" fill="url(#sonarTopPetal)" />
            {/* Left Petal */}
            <circle cx="38" cy="60" r="27" fill="url(#sonarLeftPetal)" />
            {/* Bottom Petal */}
            <circle cx="60" cy="82" r="27" fill="url(#sonarBottomPetal)" />
            {/* Right Petal */}
            <circle cx="82" cy="60" r="27" fill="url(#sonarRightPetal)" />
          </g>

          {/* Concentric Radar Rings */}
          <circle
            cx="60"
            cy="60"
            r="37"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="3.5 3.5"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="21"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1"
            fill="none"
          />

          {/* Center Target Core */}
          <circle
            cx="60"
            cy="60"
            r="11"
            fill="#1C0D1C"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1"
          />
          <circle cx="60" cy="60" r="7.5" fill="#B80C09" />
          <circle cx="60" cy="60" r="2.8" fill="#ffffff" />
        </svg>
      </motion.div>

      {/* Logotipo Tipográfico "SONAR" */}
      {showText && (
        <motion.span
          className={`font-black uppercase text-[#231123] dark:text-[#FAF5F8] group-hover:text-[#B80C09] dark:group-hover:text-[#ff6b68] transition-colors duration-200 ${textSize}`}
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

