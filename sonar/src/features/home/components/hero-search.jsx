import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const HeroSearch = ({ onSearch = () => {}, onSubmit = (e) => e.preventDefault() }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(searchValue);
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        padding: '72px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-page)',
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Resplandor ambiental de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(184, 12, 9, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '820px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Título Principal */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(36px, 5.5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, var(--text-main) 40%, #B80C09 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Descubre. Escucha. Reseña.
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(15px, 2vw, 19px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 0 36px 0',
            transition: 'color 0.25s ease',
          }}
        >
          Únete a la comunidad de audiófilos y comparte tu perspectiva sobre los mejores álbumes del mundo.
        </motion.p>

        {/* Buscador Principal */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleFormSubmit}
          style={{
            width: '100%',
            maxWidth: '620px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Ícono de Lupa */}
          <div
            style={{
              position: 'absolute',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 2,
              color: isFocused ? '#B80C09' : 'var(--text-muted)',
              transition: 'color 0.25s ease',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Input Grande y Redondeado */}
          <input
            type="text"
            placeholder="Buscar por álbum, artista o género musical..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              height: '58px',
              padding: '0 24px 0 56px',
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--text-main)',
              backgroundColor: 'var(--bg-card)',
              border: isFocused ? '1.5px solid #B80C09' : '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              outline: 'none',
              boxShadow: isFocused
                ? '0 0 0 4px rgba(184, 12, 9, 0.2), var(--shadow-card-hover)'
                : 'var(--shadow-card)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxSizing: 'border-box',
            }}
          />

          {/* Botón Buscar opcional */}
          {searchValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                right: '8px',
                height: '42px',
                padding: '0 20px',
                backgroundColor: '#B80C09',
                color: '#FFFFFF',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(184, 12, 9, 0.4)',
              }}
            >
              Buscar
            </motion.button>
          )}
        </motion.form>
      </motion.div>
    </section>
  );
};

export default HeroSearch;
