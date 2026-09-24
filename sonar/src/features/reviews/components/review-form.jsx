import { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../../../shared/components/ui/star-rating';

export const ReviewForm = ({
  albumTitle = 'In Rainbows',
  artistName = 'Radiohead',
  onSubmit = () => {},
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!rating || !reviewText.trim()) { setError('Añade una calificación y el texto de tu reseña.'); return; }
    setBusy(true); setError('');
    try { await onSubmit({
      rating,
      reviewText,
      hasSpoilers,
    }); setReviewText(''); }
    catch (cause) { setError(cause.message || 'No se pudo guardar la reseña.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="w-full max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.08)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] transition-colors duration-300">
      {/* Header del Formulario */}
      <div className="flex flex-col gap-1.5 pb-6 border-b border-[#e6d5e2]/80 dark:border-white/10">
        <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
          Nueva Crítica
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
          Calificar Álbum
        </h2>
        <p className="text-sm text-[#5c435a] dark:text-[#B89CB0]">
          Escribe tu análisis para <strong className="text-[#231123] dark:text-white">{albumTitle}</strong> de <span className="text-[#5c1d5e] dark:text-pink-300 font-medium">{artistName}</span>
        </p>
      </div>

      <form aria-busy={busy} onSubmit={handleSubmit} className="flex flex-col gap-6 pt-6">
        {/* Selector de Calificación con Estrellas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200">
              Puntuación
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
            Tu Reseña
          </label>
          <textarea
            id="review-text"
            rows={5}
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Describe la experiencia acústica, la producción, tus pistas favoritas o el impacto emocional del disco..."
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm sm:text-base text-[#231123] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20 resize-y min-h-[130px]"
          />
        </div>

        {/* Switch / Checkbox Estilizado de Spoilers */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 cursor-pointer select-none" onClick={() => setHasSpoilers(!hasSpoilers)}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center text-[#B80C09]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
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

          {/* Toggle Switch Visual */}
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
          type="submit" disabled={busy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 rounded-xl bg-[#B80C09] text-white text-sm font-bold uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Publicar Reseña</span>
        </motion.button>
      {error && <p role="alert">{error}</p>}</form>
    </div>
  );
};

export default ReviewForm;
