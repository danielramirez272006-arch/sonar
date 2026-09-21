import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

export const HeroSearch = ({ onSearch = () => {}, onSubmit = (e) => e.preventDefault() }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
        <form
          onSubmit={handleFormSubmit}
          className="w-full max-w-[620px] relative flex items-center px-1"
        >
          {/* Ícono de Lupa */}
          <div
            className={`absolute left-5 flex items-center justify-center pointer-events-none z-10 transition-colors ${
              isFocused ? 'text-[#B80C09]' : 'text-[#81737e] dark:text-[#B89CB0]'
            }`}
          >
            <svg
              width="20"
              height="20"
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

          {/* Input Grande Adaptable */}
          <input
            type="text"
            placeholder="Buscar por álbum, artista o género..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full h-13 sm:h-14 md:h-[60px] pl-12 sm:pl-14 pr-24 sm:pr-28 text-xs sm:text-sm md:text-base font-medium rounded-full outline-none transition-all duration-300 ${
              isFocused
                ? 'border-2 border-[#B80C09] ring-4 ring-[#B80C09]/20 shadow-lg'
                : 'border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)]'
            } bg-white dark:bg-[#4B2840] text-[#231123] dark:text-[#FAF5F8] placeholder:text-[#81737e] dark:placeholder:text-[#B89CB0]/70`}
          />

          {/* Botón Buscar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="absolute right-2.5 sm:right-3 h-9 sm:h-10 md:h-11 px-3.5 sm:px-5 bg-[#B80C09] text-white rounded-full text-xs sm:text-sm font-bold cursor-pointer shadow-md hover:bg-[#9c0a07] transition-all flex items-center justify-center gap-1"
          >
            <span>Buscar</span>
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};

export default HeroSearch;
