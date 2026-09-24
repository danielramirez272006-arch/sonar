import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';

const reviews = [
  { username: 'clara_sound', artist: 'Radiohead', album: 'In Rainbows', rating: 5, comment: 'La producción analógica y el ritmo de Reckoner alcanzan una dimensión cósmica en vinilo de 180g.' },
  { username: 'marcos_vinyl', artist: 'Evanescence', album: 'Fallen', rating: 5, comment: 'Un disco que sigue sonando increíble después de tantos años.' },
  { username: 'luna_records', artist: 'Arctic Monkeys', album: 'AM', rating: 4, comment: 'Una producción elegante con una identidad sonora muy marcada.' },
];

const positionInStack = (index, activeIndex) => (index - activeIndex + reviews.length) % reviews.length;
const starsForRating = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export const RotatingReview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % reviews.length), 4600);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  return (
    <section className="auth-review" aria-label="Comentarios destacados de la comunidad" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="auth-review__stack">
        {reviews.map((review, index) => {
          const position = positionInStack(index, activeIndex);
          const isActive = position === 0;
          return <motion.article key={review.username} className="auth-review__card" aria-hidden={!isActive}
            animate={{ y: position === 0 ? 0 : position === 1 ? 16 : -19, scale: position === 0 ? 1 : position === 1 ? 0.955 : 0.91, opacity: position === 0 ? 1 : position === 1 ? 0.7 : 0.42, rotate: position === 0 ? -3 : position === 1 ? -1.7 : -4.2, zIndex: reviews.length - position }}
            initial={false} transition={reduceMotion ? { duration: 0 } : { duration: 0.72, ease: [0.22, 0.72, 0.24, 1] }}>
            <div className="auth-review__content"><div className="auth-review__avatars"><BlobatarAvatar name={review.username} active={isActive} size={50} /></div><div><b>{review.username}</b><small>{review.artist} · {review.album}</small></div><strong aria-label={`${review.rating} de 5 estrellas`}>{starsForRating(review.rating)}</strong><p>“{review.comment}”</p></div>
          </motion.article>;
        })}
      </div>
      <div className="auth-review__dots" aria-label={`Comentario ${activeIndex + 1} de ${reviews.length}`}>
        {reviews.map((review, index) => (
          <button
            key={review.username}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? 'active' : ''}
            aria-label={`Ver reseña de ${review.username}`}
            style={{
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              display: 'inline-block',
            }}
          />
        ))}
      </div>
    </section>
  );
};
