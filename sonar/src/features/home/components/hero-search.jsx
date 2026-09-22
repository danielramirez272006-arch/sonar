import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../shared/context/theme-context';

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HeroSearch = ({ onSearch = () => {}, onSubmit = () => {} }) => {
  const [searchValue, setSearchValue] = useState('');
  const { isDarkMode } = useTheme();

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(searchValue);
  };

  return (
    <motion.section
      variants={heroVariants}
      className="relative w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-24 flex flex-col items-center justify-center text-center overflow-hidden bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300"
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[200px] sm:h-[260px] bg-rose-200/50 dark:bg-[#B80C09]/15 blur-[70px] sm:blur-[100px] pointer-events-none -z-10 transition-colors duration-300" />

      <div className="max-w-[820px] w-full mx-auto relative z-10 flex flex-col items-center">
        {/* Título Principal Mobile-First */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4 text-[#231123] dark:text-[#FAF5F8] transition-colors">
          <span className="bg-gradient-to-r from-[#231123] via-[#5c1d5e] to-[#B80C09] dark:from-white dark:via-rose-300 dark:to-[#B80C09] bg-clip-text text-transparent">
            Descubre. Escucha. Reseña.
          </span>
        </h1>

        {/* Subtítulo Mobile-First */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed text-[#5c435a] dark:text-[#B89CB0] max-w-[620px] mb-6 sm:mb-8 md:mb-10 transition-colors px-2">
          Únete a la comunidad de audiófilos y comparte tu perspectiva sobre los mejores álbumes del mundo.
        </p>

        {/* Buscador Principal */}
        <form onSubmit={handleFormSubmit} className="w-full">
          <div className="relative w-full max-w-2xl mx-auto mt-8">
            {/* Icono de Lupa */}
            <div 
              className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-50" 
              style={{ color: isDarkMode ? '#DCDCDD' : '#9CA3AF' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Input de Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por álbum, artista o género..."
              value={searchValue}
              onChange={handleInputChange}
              className="w-full focus:outline-none transition-all shadow-lg"
              style={{
                padding: '1rem 9rem 1rem 3.5rem',
                borderRadius: '9999px', /* Fuerza la forma de píldora */
                backgroundColor: isDarkMode ? '#4B2840' : '#ffffff',
                color: isDarkMode ? '#DCDCDD' : '#1F2937',
                border: isDarkMode ? '1px solid #231123' : '1px solid #E5E7EB'
              }}
            />

            {/* Botón Buscar Rediseñado con la paleta de Sonar (#B80C09) */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '9999px', /* Fuerza la forma de píldora para que encaje perfecto */
                backgroundColor: '#B80C09', /* Rojo Carmesí oficial de Sonar */
                color: '#ffffff',           /* Blanco puro */
                border: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                boxShadow: '0 4px 14px -2px rgba(184, 12, 9, 0.4)'
              }}
            >
              Buscar <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default HeroSearch;
