import React, { useState } from 'react';
import { motion } from 'framer-motion';

const equalizerBars = [
  { delay: 0, duration: 0.8 },
  { delay: 0.2, duration: 0.6 },
  { delay: 0.1, duration: 0.9 },
  { delay: 0.3, duration: 0.7 },
];

export const DeezerPlayer = ({
  track = {
    title: '15 Step',
    artist: 'Radiohead · In Rainbows',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    duration: '3:57',
    currentTime: '1:24',
  },
  onPlayToggle = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
    onPlayToggle(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#4B2840]/60 backdrop-blur-md border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.12)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] transition-colors duration-300 flex flex-col gap-3">
      {/* Top Bar: Deezer Badge + Ecualizador Animado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#231123] dark:text-white/90">
            Deezer Preview
          </span>
        </div>

        {/* Ecualizador Animado de 4 Barras */}
        <div className="flex items-end gap-1 h-4 px-2 py-0.5 rounded-md bg-[#f8e9f6] dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10">
          {equalizerBars.map((bar, i) => (
            <motion.span
              key={i}
              className="w-1 bg-[#B80C09] rounded-full origin-bottom"
              animate={
                isPlaying
                  ? {
                      scaleY: [0.3, 1, 0.4, 0.9, 0.2],
                    }
                  : { scaleY: 0.2 }
              }
              transition={
                isPlaying
                  ? {
                      duration: bar.duration,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: bar.delay,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
              style={{ height: '100%' }}
            />
          ))}
        </div>
      </div>

      {/* Main Track Info & Controls */}
      <div className="flex items-center gap-4">
        {/* Mini-carátula */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 shadow-md bg-gray-200 dark:bg-[#231123] border border-white/20">
          <img
            src={track.cover}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          )}
        </div>

        {/* Info & Controles Centrales */}
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
            {track.title}
          </h4>
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
            {track.artist}
          </p>

          {/* Botones de Control (Anterior, Play/Pausa, Siguiente) */}
          <div className="flex items-center gap-3 mt-1.5">
            {/* Anterior */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors cursor-pointer"
              aria-label="Pista anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>

            {/* Play / Pausa Central */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
              type="button"
              className="w-8 h-8 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-md hover:bg-[#9c0a07] transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.button>

            {/* Siguiente */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors cursor-pointer"
              aria-label="Pista siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Barra de Progreso Estática */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-black/40 overflow-hidden">
          <div className="w-2/5 h-full bg-[#B80C09] rounded-full" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#81737e] dark:text-[#B89CB0] font-medium">
          <span>{track.currentTime}</span>
          <span>{track.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default DeezerPlayer;
