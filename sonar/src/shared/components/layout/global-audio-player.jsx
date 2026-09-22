import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';

export const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, currentTime, duration, toggleTrack, seek, closePlayer, openReviewModal } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-3xl mx-auto z-50 flex flex-col gap-2.5 p-3 sm:p-4 select-none backdrop-blur-xl"
        style={{
          backgroundColor: '#231123ee', /* Midnight Violet con transparencia */
          color: '#DCDCDD',              /* Alabaster Grey */
          borderRadius: '9999px',        /* Forma de cápsula */
          border: '1px solid #4B2840',  /* Blackberry Cream */
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 56, 68, 0.25)',
        }}
      >
        {/* Barra de progreso de audio interactiva */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPercent = clickX / rect.width;
            seek(newPercent * duration);
          }}
          className="relative w-full h-1.5 rounded-full cursor-pointer overflow-hidden group"
          style={{ backgroundColor: '#4B2840' }}
          title="Saltar en la muestra de audio"
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #003844 0%, #B80C09 100%)', /* Dark Teal a Brick Ember */
            }}
          />
        </div>

        {/* Fila Principal de Controles y Metadatos */}
        <div className="flex items-center justify-between gap-3 px-1 sm:px-2">
          {/* Lado Izquierdo: Portada Deezer + Datos de Pista */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 overflow-hidden shadow-md flex items-center justify-center"
              style={{ borderRadius: '9999px', border: '1px solid #4B2840' }}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'rotate-180 scale-105' : ''}`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 h-3 bg-[#B80C09] animate-pulse" />
                  <span className="w-0.5 h-4 bg-[#003844] animate-bounce" />
                  <span className="w-0.5 h-2 bg-[#DCDCDD] animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold truncate" style={{ color: '#DCDCDD' }}>
                  {currentTrack.title}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0"
                  style={{ backgroundColor: '#4B2840', color: '#B80C09', border: '1px solid #B80C0933' }}
                >
                  30s Preview
                </span>
              </div>
              <span className="text-[11px] truncate opacity-75" style={{ color: '#DCDCDD' }}>
                {currentTrack.artist} {currentTrack.album ? `· ${currentTrack.album}` : ''}
              </span>
            </div>
          </div>

          {/* Centro: Tiempo y Botón Play / Pausa */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-[11px] font-mono opacity-60 hidden sm:inline-block" style={{ color: '#DCDCDD' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggleTrack(currentTrack)}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="flex items-center justify-center cursor-pointer transition-colors shadow-md"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                backgroundColor: '#003844', /* Dark Teal */
                color: '#DCDCDD',           /* Alabaster Grey */
                border: 'none',
              }}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </motion.button>
          </div>

          {/* Lado Derecho: Botón "Criticar Álbum" & Botón Cerrar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openReviewModal(currentTrack)}
              className="flex items-center gap-1.5 cursor-pointer transition-all shadow-sm select-none"
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                backgroundColor: '#4B2840',  /* Blackberry Cream */
                color: '#DCDCDD',            /* Alabaster Grey */
                border: '1px solid #003844', /* Dark Teal */
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
              title="Escribir una crítica de este álbum"
            >
              <span className="material-symbols-outlined text-[15px]" style={{ color: '#ff4d4a' }}>
                rate_review
              </span>
              <span>Criticar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => closePlayer()}
              className="flex items-center justify-center transition-colors cursor-pointer hover:bg-white/10"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                backgroundColor: 'transparent',
                color: '#DCDCDD',
                border: 'none',
              }}
              title="Cerrar reproductor"
            >
              <span className="material-symbols-outlined text-[19px]">close</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalAudioPlayer;
