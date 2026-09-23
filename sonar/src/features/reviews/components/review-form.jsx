import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../../../shared/components/ui/star-rating';

export const ReviewForm = ({
  initialType = 'album',
  trackTitle = '',
  albumTitle = 'In Rainbows',
  artistName = 'Radiohead',
  onSubmit = (e) => e.preventDefault(),
  onClose = null,
}) => {
  const [reviewType, setReviewType] = useState(initialType || (trackTitle ? 'track' : 'album'));
  const [currentTrackTitle, setCurrentTrackTitle] = useState(trackTitle || (initialType === 'track' ? albumTitle : ''));
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: reviewType,
      trackTitle: reviewType === 'track' ? (currentTrackTitle.trim() || albumTitle) : '',
      albumTitle,
      artistName,
      rating,
      reviewText,
      hasSpoilers,
    });
  };

  const isTrackMode = reviewType === 'track';

  return (
    <div className="w-full max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.08)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] transition-colors duration-300 relative">
      {/* Header del Formulario */}
      <div className="flex flex-col gap-2 pb-5 border-b border-[#e6d5e2]/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">rate_review</span>
            <span>Nueva Crítica Sonar</span>
          </span>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
              isTrackMode
                ? 'bg-rose-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-rose-300 border-[#B80C09]/30'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
            }`}>
              {isTrackMode ? '🎵 Canción' : '💿 Álbum'}
            </span>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#B80C09] text-gray-700 hover:text-white dark:bg-white/10 dark:hover:bg-[#B80C09] dark:text-white flex items-center justify-center transition-colors cursor-pointer border border-gray-200 dark:border-white/10 shadow-xs"
                title="Cerrar (Esc)"
                aria-label="Cerrar formulario de crítica"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
          {isTrackMode ? 'Criticar Canción Individual' : 'Criticar Álbum Completo'}
        </h2>

        <p className="text-sm text-[#5c435a] dark:text-[#B89CB0]">
          {isTrackMode ? (
            <>Analizando canción de <strong className="text-[#231123] dark:text-white">{artistName}</strong></>
          ) : (
            <>Analizando disco <strong className="text-[#231123] dark:text-white">{albumTitle}</strong> de <span className="text-[#5c1d5e] dark:text-pink-300 font-medium">{artistName}</span></>
          )}
        </p>

        {/* Selector de Modo: Canción vs Álbum */}
        <div className="grid grid-cols-2 gap-2 mt-2 p-1 rounded-2xl bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setReviewType('track')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isTrackMode
                ? 'bg-[#B80C09] text-white shadow-sm'
                : 'text-[#5c435a] dark:text-gray-300 hover:text-[#231123] dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">music_note</span>
            <span>Canción Individual</span>
          </button>
          <button
            type="button"
            onClick={() => setReviewType('album')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isTrackMode
                ? 'bg-[#B80C09] text-white shadow-sm'
                : 'text-[#5c435a] dark:text-gray-300 hover:text-[#231123] dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">album</span>
            <span>Álbum Completo</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5">
        {/* Campo opcional de Título de la Canción si está en modo canción */}
        {isTrackMode && (
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="track-title-input"
              className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-[#B80C09]">music_note</span>
              <span>Nombre de la Canción</span>
            </label>
            <input
              id="track-title-input"
              type="text"
              required
              value={currentTrackTitle}
              onChange={(e) => setCurrentTrackTitle(e.target.value)}
              placeholder="Ej: 15 Step, Reckoner, Nude..."
              className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm font-semibold text-[#231123] dark:text-white placeholder:text-gray-400 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20"
            />
          </div>
        )}

        {/* Selector de Calificación con Estrellas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200">
              Calificación
            </span>
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
              {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona una puntuación'}
            </span>
          </div>
          <StarRating value={rating} onChange={setRating} size={30} />
        </div>

        {/* Textarea de la Reseña */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="review-text"
            className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200"
          >
            Tu Crítica y Análisis
          </label>
          <textarea
            id="review-text"
            rows={4}
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={
              isTrackMode
                ? 'Describe la letra, producción sonora, instrumentación, interpretación vocal, mezcla o momento cumbre de la canción...'
                : 'Describe la cohesión temática del disco, la producción general, masterización, prensado en vinilo o impacto global...'
            }
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm sm:text-base text-[#231123] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20 resize-y min-h-[120px]"
          />
        </div>

        {/* Switch / Checkbox de Spoilers */}
        <div
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 cursor-pointer select-none"
          onClick={() => setHasSpoilers(!hasSpoilers)}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center text-[#B80C09] shrink-0">
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-white">
                Contiene spoilers o detalles de la trama / concepto
              </span>
              <span className="text-[11px] sm:text-xs text-[#5c435a] dark:text-[#B89CB0]">
                Ocultará el texto detrás de un aviso de moderación
              </span>
            </div>
          </div>

          <div
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              hasSpoilers ? 'bg-[#B80C09]' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                hasSpoilers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Botón de Publicación */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 rounded-2xl bg-[#B80C09] text-white text-sm font-black uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isTrackMode ? 'music_note' : 'album'}
          </span>
          <span>
            {isTrackMode ? 'Publicar Crítica de Canción' : 'Publicar Crítica de Álbum'}
          </span>
        </motion.button>
      </form>
    </div>
  );
};

export default ReviewForm;
