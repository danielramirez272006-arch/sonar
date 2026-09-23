import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';

export const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, isLoading, currentTime, duration, toggleTrack, seek, closePlayer, openReviewModal } = usePlayer();

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
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed bottom-5 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-[440px] md:max-w-[460px] flex flex-col gap-2 p-2.5 sm:p-3 select-none backdrop-blur-2xl"
        style={{
          backgroundColor: '#1c0d1cee', /* Midnight Violet oscuro translúcido */
          color: '#DCDCDD',              /* Alabaster Grey */
          borderRadius: '24px',          /* Cápsula moderna */
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(184, 12, 9, 0.15)',
        }}
      >
        {/* Barra de progreso de audio interactiva superior */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPercent = clickX / rect.width;
            seek(newPercent * duration);
          }}
          className="relative w-full h-1.5 rounded-full cursor-pointer overflow-hidden group"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          title="Saltar en la muestra de audio"
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #5c1d5e 0%, #B80C09 100%)',
            }}
          />
        </div>

        {/* Fila Principal de Controles y Metadatos */}
        <div className="flex items-center justify-between gap-2.5 px-0.5">
          {/* Portada + Título + Artista */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 overflow-hidden shadow-md flex items-center justify-center rounded-xl"
              style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              <img
                src={currentTrack.cover || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg'}
                alt={currentTrack.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
                }}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'rotate-180 scale-105' : ''}`}
              />
              {isPlaying && !isLoading && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-[#B80C09] animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-rose-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-white animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold truncate text-white">
                  {currentTrack.title}
                </span>
                <span className="px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#B80C09]/30 text-rose-300 border border-[#B80C09]/40 shrink-0">
                  {isLoading ? 'Cargando...' : '30s'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] truncate opacity-75 text-gray-300">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          {/* Controles: Play / Pausa + Botón Criticar + Cerrar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[9px] sm:text-[10px] font-mono opacity-60 hidden xs:inline-block text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggleTrack(currentTrack)}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B80C09] hover:bg-[#9c0a07] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[19px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openReviewModal(currentTrack)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Escribir una crítica"
            >
              <span className="material-symbols-outlined text-[13px] text-rose-400">rate_review</span>
              <span className="hidden sm:inline">Criticar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => closePlayer()}
              className="w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              title="Cerrar reproductor"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalAudioPlayer;
