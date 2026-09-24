import { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../../../shared/components/ui/star-rating';

export const ReviewForm = ({
  initialType = 'album',
  trackTitle = '',
  albumTitle = 'In Rainbows',
  artistName = 'Radiohead',
  onSubmit = () => {},
  onClose = null,
}) => {
  const [reviewType, setReviewType] = useState(initialType || (trackTitle ? 'track' : 'album'));
  const [currentTrackTitle, setCurrentTrackTitle] = useState(trackTitle || (initialType === 'track' ? albumTitle : ''));
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!rating || !reviewText.trim()) {
      setError('Añade una calificación y el texto de tu reseña.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({
        type: reviewType,
        trackTitle: reviewType === 'track' ? (currentTrackTitle.trim() || albumTitle) : '',
        albumTitle,
        artistName,
        rating,
        reviewText,
        hasSpoilers,
      });
      setReviewText('');
    } catch (cause) {
      setError(cause.message || 'No se pudo guardar la reseña.');
    } finally {
      setBusy(false);
    }
  };

  const isTrackMode = reviewType === 'track';

  return (
    <div className="w-full max-w-2xl p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.12)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] transition-colors duration-300 relative">
      {/* Botón de Salir Visible */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#231123] dark:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs z-10"
          aria-label="Cerrar formulario"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}

      {/* Cabecera Informativa con Contexto de Álbum/Artista */}
      <div className="flex flex-col gap-1 pb-4 border-b border-[#e6d5e2] dark:border-white/10 text-left pr-10">
        <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
          Publicar Crítica Musical
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white tracking-tight">
          {albumTitle}
        </h3>
        <span className="text-xs sm:text-sm font-semibold text-[#5c435a] dark:text-[#B89CB0]">
          por {artistName}
        </span>
      </div>

      {/* Selector de Modo: Reseñar Canción Específica vs Álbum Completo */}
      <div className="flex flex-col gap-2 pt-4 text-left">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
          ¿Qué deseas calificar y analizar?
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-[#231123]/80 border border-[#e6d5e2] dark:border-white/10">
          <button
            type="button"
            onClick={() => setReviewType('track')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isTrackMode
                ? 'bg-white dark:bg-[#4B2840] text-[#B80C09] dark:text-rose-300 shadow-sm border border-[#B80C09]/20'
                : 'text-[#5c435a] dark:text-gray-300 hover:text-[#231123]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">music_note</span>
            <span>Canción Específica</span>
          </button>

          <button
            type="button"
            onClick={() => setReviewType('album')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isTrackMode
                ? 'bg-white dark:bg-[#4B2840] text-[#B80C09] dark:text-rose-300 shadow-sm border border-[#B80C09]/20'
                : 'text-[#5c435a] dark:text-gray-300 hover:text-[#231123]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">album</span>
            <span>Álbum Completo</span>
          </button>
        </div>
      </div>

      <form aria-busy={busy} onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
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
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm font-semibold text-[#231123] dark:text-white placeholder:text-gray-400 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20"
            />
          </div>
        )}

        {/* Selector de Calificación con Estrellas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200">
              Calificación
            </span>
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
              {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona una puntuación'}
            </span>
          </div>
          <StarRating value={rating} onChange={setRating} size={28} />
        </div>

        {/* Textarea de la Reseña */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="review-text"
            className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200"
          >
            Tu Crítica y Análisis
          </label>
          <textarea
            id="review-text"
            rows={3}
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={
              isTrackMode
                ? 'Describe la letra, producción sonora, instrumentación, interpretación vocal, mezcla o momento cumbre de la canción...'
                : 'Describe la cohesión temática del disco, la producción general, masterización, prensado en vinilo o impacto global...'
            }
            className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm sm:text-base text-[#231123] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20 resize-y min-h-[100px]"
          />
        </div>

        {/* Switch / Checkbox de Spoilers */}
        <div
          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 cursor-pointer select-none"
          onClick={() => setHasSpoilers(!hasSpoilers)}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center text-[#B80C09] shrink-0">
              <span className="material-symbols-outlined text-[16px]">visibility_off</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-white">
                Contiene spoilers o detalles de la trama / concepto
              </span>
              <span className="text-[10px] sm:text-xs text-[#5c435a] dark:text-[#B89CB0]">
                Ocultará el texto detrás de un aviso de moderación
              </span>
            </div>
          </div>

          <div
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              hasSpoilers ? 'bg-[#B80C09]' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                hasSpoilers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold">
            {error}
          </p>
        )}

        {/* Botones de Acción: Cancelar y Publicar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-[#231123] dark:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}

          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#B80C09] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isTrackMode ? 'music_note' : 'album'}
            </span>
            <span>
              {isTrackMode ? 'Publicar Crítica de Canción' : 'Publicar Crítica de Álbum'}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
