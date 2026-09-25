import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_FALLBACK_COVER, handleImageFallbackError } from '../../../shared/services/recommendations-service';

export const VinylCrateFlip = ({ albums = [], onPlayAlbum, onToggleSave }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [goldmineGrades, setGoldmineGrades] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sonar_goldmine_grades') || '{}');
    } catch {
      return {};
    }
  });

  const currentAlbum = albums[currentIndex] || null;

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : albums.length - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < albums.length - 1 ? prev + 1 : 0));
  };

  const handleSetGrade = (albumId, grade) => {
    const updated = { ...goldmineGrades, [albumId]: grade };
    setGoldmineGrades(updated);
    try {
      localStorage.setItem('sonar_goldmine_grades', JSON.stringify(updated));
    } catch {}
  };

  if (!albums || albums.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10">
        <span className="material-symbols-outlined text-[48px] text-[#5c435a] dark:text-[#B89CB0]">album</span>
        <h4 className="text-lg font-bold text-[#231123] dark:text-white mt-3">Tu Caja de Vinilos está vacía</h4>
        <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
          Guarda álbumes en tu colección para hojearlos en el visor 3D.
        </p>
      </div>
    );
  }

  const currentGrade = currentAlbum ? goldmineGrades[currentAlbum.id] || 'Near Mint (NM)' : 'NM';

  return (
    <div className="w-full flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#231123]/90 via-[#33182b] to-[#231123] text-white border border-white/15 shadow-2xl relative overflow-hidden select-none">
      {/* Luz ambiental superior estilo tienda de vinilos */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B80C09] to-transparent" />
      <div className="absolute top-2 right-4 text-[11px] font-mono text-pink-200/60 uppercase tracking-widest flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-[#B80C09]">3d_rotation</span>
        <span>Modo Caja 3D • {currentIndex + 1} de {albums.length}</span>
      </div>

      {/* Contenedor 3D de la Carátula y el Disco */}
      <div className="w-full max-w-md h-72 sm:h-80 flex items-center justify-center relative perspective-[1200px] mt-4">
        {/* Vinilo saliendo por el lateral derecho */}
        <motion.div
          animate={{
            x: isFlipped ? 60 : 35,
            rotate: isFlipped ? 180 : currentIndex * 45,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-black border-4 border-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center z-0 cursor-pointer"
          onClick={() => onPlayAlbum && onPlayAlbum(currentAlbum)}
          title="Haz clic para reproducir este vinilo"
        >
          {/* Surcos del vinilo */}
          <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center p-6">
            <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center p-6">
              <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center p-6">
                {/* Galleta central */}
                <div className="w-20 h-20 rounded-full bg-[#B80C09] border-2 border-white/30 flex items-center justify-center text-center p-2 overflow-hidden shadow-inner">
                  <span className="text-[9px] font-black uppercase text-white leading-tight truncate">
                    {currentAlbum?.artist || 'SONAR'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portada física del álbum con efecto de grosor e inclinación */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlbum?.id || currentIndex}
            initial={{ opacity: 0, rotateY: -35, scale: 0.9, x: -30 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 180 : -10, scale: 1, x: 0 }}
            exit={{ opacity: 0, rotateY: 35, scale: 0.9, x: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 24 }}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl relative shadow-[0_20px_40px_rgba(0,0,0,0.7)] z-10 cursor-pointer preserve-3d"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Cara frontal */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 backface-hidden bg-[#4B2840]">
              <img
                src={currentAlbum?.cover || DEFAULT_FALLBACK_COVER}
                alt={currentAlbum?.title || 'Vinilo'}
                onError={(e) => handleImageFallbackError(e, currentAlbum?.title || 'Album')}
                className="w-full h-full object-cover"
              />
              {/* Reflejo plástico vintage */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/15 pointer-events-none" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                180g HI-RES
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Información del Álbum Actual */}
      <div className="flex flex-col items-center text-center gap-1.5 z-10 max-w-md w-full">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate w-full">
          {currentAlbum?.title || 'Título del Álbum'}
        </h3>
        <p className="text-sm font-semibold text-pink-200/80">
          {currentAlbum?.artist || 'Artista'} • {currentAlbum?.year || 'Edición Maestra'}
        </p>

        {/* Selector de Estado Físico Goldmine */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-white/70 font-medium">Estado Físico:</span>
          <select
            value={currentGrade}
            onChange={(e) => handleSetGrade(currentAlbum.id, e.target.value)}
            className="text-xs font-bold py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white focus:outline-hidden focus:border-[#B80C09] cursor-pointer"
          >
            <option value="Mint (M)" className="bg-[#231123] text-white">Mint (M) - Impecable</option>
            <option value="Near Mint (NM)" className="bg-[#231123] text-white">Near Mint (NM) - Casi Nuevo</option>
            <option value="Very Good Plus (VG+)" className="bg-[#231123] text-white">Very Good Plus (VG+)</option>
            <option value="Very Good (VG)" className="bg-[#231123] text-white">Very Good (VG) - Buen Estado</option>
            <option value="Good (G)" className="bg-[#231123] text-white">Good (G) - Con Desgaste</option>
          </select>
        </div>
      </div>

      {/* Controles de Navegación & Reproducción */}
      <div className="flex items-center gap-4 z-10">
        <button
          type="button"
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 flex items-center justify-center cursor-pointer shadow-md hover:scale-105"
          title="Vinilo anterior"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <button
          type="button"
          onClick={() => onPlayAlbum && onPlayAlbum(currentAlbum)}
          className="px-6 py-3 rounded-2xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(184,12,9,0.5)] flex items-center gap-2 cursor-pointer hover:scale-105"
        >
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
          <span>Poner en Tornamesa</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 flex items-center justify-center cursor-pointer shadow-md hover:scale-105"
          title="Siguiente vinilo"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default VinylCrateFlip;
