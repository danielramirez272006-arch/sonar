import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const reviews = [
  { user: 'Mara R.', album: 'Heaven or Las Vegas', artist: 'Cocteau Twins', comment: 'Una escucha que convierte cada detalle en una pequeña constelación.', initials: ['MR', 'CT'] },
  { user: 'Leo A.', album: 'Vespertine', artist: 'Björk', comment: 'Íntimo y enorme a la vez; justo el tipo de hallazgo que quiero guardar.', initials: ['LA', 'BJ'] },
  { user: 'Inés V.', album: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', comment: 'La comunidad encontró capas que no había escuchado en años de volver al álbum.', initials: ['IV', 'KL'] },
];

const positionInStack = (index, activeIndex) => (index - activeIndex + reviews.length) % reviews.length;

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
          return <motion.article key={review.album} className="auth-review__card" aria-hidden={!isActive}
            animate={{ y: position === 0 ? 0 : position === 1 ? 16 : -19, scale: position === 0 ? 1 : position === 1 ? 0.955 : 0.91, opacity: position === 0 ? 1 : position === 1 ? 0.7 : 0.42, rotate: position === 0 ? -3 : position === 1 ? -1.7 : -4.2, zIndex: reviews.length - position }}
            initial={false} transition={reduceMotion ? { duration: 0 } : { duration: 0.72, ease: [0.22, 0.72, 0.24, 1] }}>
            <div className="auth-review__content"><div className="auth-review__avatars" aria-hidden="true">{review.initials.map((initial) => <span key={initial}>{initial}</span>)}</div><div><b>{review.user}</b><small>{review.artist} · {review.album}</small></div><strong aria-label="Cinco de cinco estrellas">★★★★★</strong><p>“{review.comment}”</p></div>
          </motion.article>;
        })}
      </div>
    </section>
  );
};
