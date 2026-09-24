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
    accent: '#B80C09',
  },
  {
    username: 'marcos_vinyl',
    artist: 'Evanescence',
    album: 'Fallen',
    rating: 5,
    cover: 'https://cdn-images.dzcdn.net/images/cover/97f48e4bf92a549d8c83c2705adca7e0/500x500-000000-80-0-0.jpg',
    comment: 'Un disco que sigue sonando increíble después de tantos años.',
    accent: '#5c1d5e',
  },
  {
    username: 'luna_records',
    artist: 'Arctic Monkeys',
    album: 'AM',
    rating: 4,
    cover: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/500x500-000000-80-0-0.jpg',
    comment: 'Una producción elegante con una identidad sonora muy marcada.',
    accent: '#0284c7',
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

  const currentReview = reviews[activeIndex];

  return (
    <section
      className="auth-review relative"
      aria-label="Comentarios destacados de la comunidad"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ minHeight: '230px' }}
    >
      {/* DISCO DE VINILO GIRATORIO DETRÁS DE LA TARJETA */}
      <motion.div
        animate={
          reduceMotion
            ? {}
            : {
                rotate: 360,
              }
        }
        transition={{
          repeat: Infinity,
          duration: isPaused ? 16 : 8,
          ease: 'linear',
        }}
        className="absolute -top-12 -right-6 sm:-right-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#120813] border-2 border-black/40 shadow-2xl flex items-center justify-center pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, transparent 28%, rgba(255,255,255,0.06) 29%, transparent 31%),
            radial-gradient(circle, transparent 45%, rgba(255,255,255,0.05) 46%, transparent 48%),
            radial-gradient(circle, transparent 62%, rgba(255,255,255,0.05) 63%, transparent 65%),
            radial-gradient(circle, transparent 78%, rgba(255,255,255,0.04) 79%, transparent 81%)
          `,
          boxShadow: '0 15px 35px rgba(0,0,0,0.35), 0 0 20px rgba(184, 12, 9, 0.2)',
        }}
      >
        {/* Etiqueta Central del Vinilo con Carátula del Álbum */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/30 relative flex items-center justify-center shadow-inner">
          <img
            src={currentReview.cover}
            alt={currentReview.album}
            className="w-full h-full object-cover"
          />
          <div className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#120813] border border-white/60" />
        </div>
      </motion.div>

      {/* ECUALIZADOR DE ONDAS SONORAS FLOTANTE */}
      <div className="absolute -top-6 left-6 flex items-end gap-1 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-white/60 shadow-xs z-10">
        <span className="text-[10px] font-black uppercase text-[#5c1d5e] tracking-wider mr-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B80C09] animate-pulse" />
          <span>Vibes</span>
        </span>
        {[14, 22, 12, 26, 18, 28, 15, 24].map((h, i) => (
          <motion.span
            key={i}
            animate={
              reduceMotion
                ? {}
                : {
                    height: [h * 0.4, h, h * 0.5, h * 0.9, h * 0.3],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 1.2 + (i % 4) * 0.2,
              ease: 'easeInOut',
            }}
            className="w-1 rounded-full bg-gradient-to-t from-[#5c1d5e] to-[#B80C09]"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* NOTAS MUSICALES FLOTANTES */}
      {!reduceMotion && (
        <div className="absolute -top-10 left-24 pointer-events-none z-10">
          {['♪', '♫', '♬'].map((note, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [-5, -30, -50],
                x: [0, (i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? -12 : 12)],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                delay: i * 0.9,
                ease: 'easeOut',
              }}
              className="absolute text-sm font-bold text-[#B80C09]"
            >
              {note}
            </motion.span>
          ))}
        </div>
      )}

      {/* STACK DE TARJETAS DE RESEÑAS */}
      <div className="auth-review__stack relative z-10" style={{ height: '175px' }}>
        {reviews.map((review, index) => {
          const position = positionInStack(index, activeIndex);
          const isActive = position === 0;

          return (
            <motion.article
              key={review.username}
              className="auth-review__card"
              aria-hidden={!isActive}
              animate={{
                y: position === 0 ? 0 : position === 1 ? 14 : -16,
                scale: position === 0 ? 1 : position === 1 ? 0.96 : 0.92,
                opacity: position === 0 ? 1 : position === 1 ? 0.72 : 0.45,
                rotate: position === 0 ? -2 : position === 1 ? -0.8 : -3.5,
                zIndex: reviews.length - position,
              }}
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.65, ease: [0.22, 0.72, 0.24, 1] }
              }
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 20px 35px rgba(100, 50, 92, 0.16)',
              }}
            >
              <div className="auth-review__content">
                {/* Mascota con Audífonos Neón y Headbobbing */}
                <div className="auth-review__avatars relative">
                  <motion.div
                    animate={
                      reduceMotion || !isActive
                        ? {}
                        : {
                            rotate: [-2, 2, -2],
                            y: [0, -3, 0],
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: 'easeInOut',
                    }}
                    className="relative flex items-center justify-center"
                  >
                    <BlobatarAvatar name={review.username} active={isActive} size={50} />

                    {/* Diadema de Audífonos sobre la Mascota */}
                    <div
                      className="absolute -top-2.5 inset-x-0 h-4 border-t-3 border-[#B80C09] rounded-t-full pointer-events-none"
                      style={{ boxShadow: '0 -2px 6px rgba(184, 12, 9, 0.3)' }}
                    />
                    {/* Almohadilla Izquierda */}
                    <div className="absolute top-1 -left-1 w-2.5 h-4 rounded-full bg-[#B80C09] shadow-xs" />
                    {/* Almohadilla Derecha */}
                    <div className="absolute top-1 -right-1 w-2.5 h-4 rounded-full bg-[#B80C09] shadow-xs" />
                  </motion.div>
                </div>

                <div>
                  <b className="text-[#231123] font-black">{review.username}</b>
                  <small className="text-[#5c435a] font-semibold block">
                    {review.artist} · <span className="text-[#B80C09]">{review.album}</span>
                  </small>
                </div>

                <strong aria-label={`${review.rating} de 5 estrellas`} className="text-[#B80C09]">
                  {starsForRating(review.rating)}
                </strong>

                <p className="text-[#493547] font-medium leading-relaxed mt-1.5">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* PUNTOS INDICADORES CON CONTROLES INTERACTIVOS */}
      <div className="auth-review__dots flex items-center justify-center gap-1.5 mt-4 relative z-20" aria-label={`Comentario ${activeIndex + 1} de ${reviews.length}`}>
        {reviews.map((review, index) => (
          <button
            key={review.username}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer border-none p-0 ${
              index === activeIndex ? 'w-6 h-2 bg-[#B80C09] shadow-xs' : 'w-2 h-2 bg-[#d9c4d7] hover:bg-[#b885b3]'
            }`}
            aria-label={`Ver reseña de ${review.username}`}
          />
        ))}
      </div>
    </section>
  );
};
