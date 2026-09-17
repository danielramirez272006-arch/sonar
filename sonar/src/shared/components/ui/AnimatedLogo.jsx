import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedLogo = ({ className = '', onClick }) => {
  const leftGroupVariants = {
    initial: { x: 0 },
    hover: { 
      x: -30,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
  };

  const rightGroupVariants = {
    initial: { x: 0 },
    hover: { 
      x: 30,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
  };

  const textVariants = {
    initial: { 
      opacity: 0, 
      width: 0, 
      scale: 0.8 
    },
    hover: { 
      opacity: 1, 
      width: 'auto', 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 350, 
        damping: 25,
        opacity: { duration: 0.2 } 
      }
    },
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial="initial"
      animate="initial"
      whileHover="hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '6px 10px',
      }}
    >
      {/* Grupo Izquierdo: 2 círculos en #B80C09 */}
      <motion.div
        variants={leftGroupVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#B80C09',
            boxShadow: '0 0 10px rgba(184, 12, 9, 0.4)',
          }}
        />
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#B80C09',
            boxShadow: '0 0 12px rgba(184, 12, 9, 0.5)',
          }}
        />
      </motion.div>

      {/* Texto Central "SONAR" con Fade-in y Scale */}
      <motion.span
        variants={textVariants}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          textAlign: 'center',
          fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: '18px',
          letterSpacing: '2.5px',
          color: 'var(--text-main, #231123)',
          textShadow: '0 0 12px rgba(184, 12, 9, 0.35)',
          margin: '0 6px',
        }}
      >
        SONAR
      </motion.span>

      {/* Grupo Derecho: 2 círculos en #B80C09 */}
      <motion.div
        variants={rightGroupVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#B80C09',
            boxShadow: '0 0 12px rgba(184, 12, 9, 0.5)',
          }}
        />
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#B80C09',
            boxShadow: '0 0 10px rgba(184, 12, 9, 0.4)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo;
