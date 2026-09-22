import React, { useState } from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const ReviewFeedCard = ({
  review = {
    id: 1,
    userName: 'Sofía Sound',
    userHandle: '@sofia_sound',
    avatarLetter: 'S',
    avatarBg: '#5c1d5e',
    date: 'Hace 2 horas',
    rating: 5,
    albumTitle: 'In Rainbows',
    artist: 'Radiohead',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    content:
      'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
    likesCount: 142,
    commentsCount: 18,
  },
}) => {
  const [likes, setLikes] = useState(review.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="w-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_25px_-4px_rgba(0,0,0,0.4)] transition-colors duration-300 flex flex-col gap-4"
    >
      {/* Cabecera: Avatar simple con inicial, Nombre y Fecha */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Círculo simple con inicial */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs ring-2 ring-[#e6d5e2] dark:ring-white/15"
            style={{ backgroundColor: review.avatarBg || '#5c1d5e' }}
          >
            {review.avatarLetter || review.userName?.charAt(0) || 'U'}
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-[#231123] dark:text-white leading-tight">
              {review.userName}
            </span>
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
              {review.userHandle} · {review.date}
            </span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-extrabold border border-[#e6d5e2] dark:border-white/10">
          <span className="text-[#B80C09]">★</span>
          <span>{review.rating} / 5</span>
        </div>
      </div>

      {/* Cuerpo: Cuadro con carátula y reseña */}
      <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
        {/* Carátula */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-[#180e1a] shadow-xs">
          <img
            src={review.cover}
            alt={review.albumTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Título de Álbum y Texto de la Reseña */}
        <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 truncate">
            <h4 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
              {review.albumTitle}
            </h4>
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
              — {review.artist}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#231123]/90 dark:text-gray-200 leading-relaxed line-clamp-3">
            “{review.content}”
          </p>
        </div>
      </div>

      {/* Pie: Acciones Me gusta y Comentar */}
      <div className="flex items-center gap-6 pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10 text-xs font-semibold text-[#5c435a] dark:text-[#B89CB0]">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            isLiked ? 'text-[#B80C09] font-bold' : 'hover:text-[#B80C09]'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isLiked ? '#B80C09' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isLiked ? 'text-[#B80C09]' : ''}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>{likes}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-[#B80C09] transition-colors cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span>{review.commentsCount} comentarios</span>
        </button>
      </div>
    </motion.article>
  );
};

export default ReviewFeedCard;
