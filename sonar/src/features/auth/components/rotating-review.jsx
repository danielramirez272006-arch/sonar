import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';

const reviews = [
  {
    username: 'clara_sound',
    artist: 'Radiohead',
    album: 'In Rainbows',
    rating: 5,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    comment: 'La producción analógica y el ritmo de Reckoner alcanzan una dimensión cósmica en vinilo de 180g.',
    tag: 'Vinilo 180g',
  },
  {
    username: 'marcos_vinyl',
    artist: 'Evanescence',
    album: 'Fallen',
    rating: 5,
    cover: 'https://cdn-images.dzcdn.net/images/cover/97f48e4bf92a549d8c83c2705adca7e0/500x500-000000-80-0-0.jpg',
    comment: 'Un disco que sigue sonando increíble después de tantos años.',
    tag: 'Clásico 2003',
  },
  {
    username: 'luna_records',
    artist: 'Arctic Monkeys',
    album: 'AM',
    rating: 4,
    cover: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/500x500-000000-80-0-0.jpg',
    comment: 'Una producción elegante con una identidad sonora muy marcada.',
    tag: 'Producción Moderna',
  },
];

const positionInStack = (index, activeIndex) => (index - activeIndex + reviews.length) % reviews.length;
const starsForRating = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export const RotatingReview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % reviews.length), 4800);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  return (
    <section
      className="auth-review relative w-full max-w-[430px]"
      aria-label="Comentarios destacados de la comunidad"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ height: 'auto', minHeight: '190px' }}
    >
      {/* STACK DE TARJETAS DE RESEÑAS */}
      <div className="relative h-[175px] w-full">
        {reviews.map((review, index) => {
          const position = positionInStack(index, activeIndex);
          const isActive = position === 0;

          return (
            <motion.article
              key={review.username}
              className="absolute inset-0 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
              aria-hidden={!isActive}
              animate={{
                y: position === 0 ? 0 : position === 1 ? 10 : -12,
                scale: position === 0 ? 1 : position === 1 ? 0.97 : 0.94,
                opacity: position === 0 ? 1 : position === 1 ? 0.75 : 0.45,
                zIndex: reviews.length - position,
              }}
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.6, ease: [0.22, 0.72, 0.24, 1] }
              }
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(220, 200, 220, 0.6)',
                boxShadow: '0 15px 35px -5px rgba(92, 29, 94, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Cabecera de la tarjeta */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden border border-purple-200/60 shadow-xs flex items-center justify-center bg-purple-50">
                    <BlobatarAvatar name={review.username} active={isActive} size={44} />
                  </div>

                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <b className="text-xs sm:text-sm font-bold text-[#231123] truncate">
                        {review.username}
                      </b>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#f8e9f6] text-[#5c1d5e]">
                        {review.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#5c435a] font-medium truncate">
                      <img
                        src={review.cover}
                        alt={review.album}
                        className="w-3.5 h-3.5 rounded-sm object-cover shrink-0"
                      />
                      <span className="truncate">{review.artist} · <span className="font-bold text-[#B80C09]">{review.album}</span></span>
                    </div>
                  </div>
                </div>

                {/* Calificación & Ecualizador */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black tracking-wider text-[#B80C09]">
                    {starsForRating(review.rating)}
                  </span>
                  
                  {/* Mini Ecualizador Sutil */}
                  <div className="flex items-end gap-0.5 h-3">
                    {[8, 12, 6, 14, 10].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={
                          reduceMotion || !isActive
                            ? {}
                            : {
                                height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.3],
                              }
                        }
                        transition={{
                          repeat: Infinity,
                          duration: 1.2 + i * 0.15,
                          ease: 'easeInOut',
                        }}
                        className="w-0.5 rounded-full bg-[#B80C09]"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Texto de la Reseña */}
              <p className="text-xs sm:text-[13px] text-[#493547] font-medium leading-relaxed mt-2.5 line-clamp-2">
                &ldquo;{review.comment}&rdquo;
              </p>
            </motion.article>
          );
        })}
      </div>

      {/* PUNTOS INDICADORES CON CONTROLES INTERACTIVOS */}
      <div className="flex items-center justify-center gap-1.5 mt-3 relative z-20" aria-label={`Comentario ${activeIndex + 1} de ${reviews.length}`}>
        {reviews.map((review, index) => (
          <button
            key={review.username}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer border-none p-0 ${
              index === activeIndex ? 'w-5 h-1.5 bg-[#B80C09]' : 'w-1.5 h-1.5 bg-[#d9c4d7] hover:bg-[#b885b3]'
            }`}
            aria-label={`Ver reseña de ${review.username}`}
          />
        ))}
      </div>
    </section>
  );
};
