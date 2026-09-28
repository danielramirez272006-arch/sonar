import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { useTranslation } from 'react-i18next';
import { interactionsService } from '../../../shared/services/interactions-service';
import CommentSection from '../../reviews/components/comment-section';
import LikeButton from '../../../shared/components/ui/like-button';
import { TTSButton } from '../../../shared/components/a11y/tts-button';
import { handleImageFallbackError, getFallbackCoverForAlbum } from '../../../shared/services/recommendations-service';

const initialReviewsData = [
  {
    id: 1,
    author: '@sofia_sound',
    userName: 'Sofía Sound',
    badge: 'Crítica Verificada',
    badgeIcon: 'verified',
    badgeColor: 'text-[#B80C09]',
    avatarLetter: 'S',
    avatarBg: '#5c1d5e',
    rating: 5,
    text: "“Cada surco de este álbum parece respirar con una pulsación biológica. 'Reckoner' y 'Nude' alcanzan un nivel de producción y vulnerabilidad que pocos discos en la historia moderna han logrado igualar. Una lección de sobriedad y espacialidad acústica.”",
    album: {
      title: 'In Rainbows',
      artist: 'Radiohead · 2007',
      cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    },
    likes: 842,
    comments: 64,
    timeAgo: 'Hace 2 horas',
  },
  {
    id: 2,
    author: '@marcos_vinyl',
    userName: 'Marcos Vinyl',
    badge: 'Top Reseñador',
    badgeIcon: 'award_star',
    badgeColor: 'text-amber-500',
    avatarLetter: 'M',
    avatarBg: '#4B2840',
    rating: 4.5,
    text: "“Un torbellino de ritmos hipnóticos y sintetizadores etéreos. La mezcla envolvente en vinilo te sumerge en una atmósfera lúcida de la que no quieres salir jamás. El rango dinámico en pista analógica es demoledor.”",
    album: {
      title: 'Discovery',
      artist: 'Daft Punk · 2001',
      cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    },
    likes: 619,
    comments: 38,
    timeAgo: 'Hace 5 horas',
  },
  {
    id: 3,
    author: '@elena_analog',
    userName: 'Elena Analog',
    badge: 'Curadora',
    badgeIcon: 'auto_awesome',
    badgeColor: 'text-[#5c1d5e] dark:text-pink-300',
    avatarLetter: 'E',
    avatarBg: '#75527b',
    rating: 5,
    text: "“La perfecta intersección entre melancolía nocturna y poesía lírica. Un viaje sonoro indispensable para entender la evolución de la música urbana experimental en la última década.”",
    album: {
      title: 'Vespertine',
      artist: 'Björk · 2001',
      cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    },
    likes: 523,
    comments: 47,
    timeAgo: 'Hace 1 día',
  },
];

const FeaturedReviewCard = ({ review }) => {
  const { user } = useAuth();
  const userId = user?.id || null;

  const [likes, setLikes] = useState(review.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(review.comments);
  const [isSavedInCollection, setIsSavedInCollection] = useState(false);

  useEffect(() => {
    const effectiveId = userId || 'guest_user';
    const likedIds = interactionsService.getLikedReviewIds(effectiveId);
    setIsLiked(likedIds.includes(review.id));
    setIsSavedInCollection(interactionsService.isAlbumSaved(effectiveId, review.album));
    const comments = interactionsService.getCommentsForReview(review.id);
    if (comments.length > 0) {
      setCommentsCount(comments.length);
    }

    const handleCollectionChange = () => {
      setIsSavedInCollection(interactionsService.isAlbumSaved(effectiveId, review.album));
    };
    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => window.removeEventListener('sonar:collection-changed', handleCollectionChange);
  }, [review.id, review.album, userId]);

  const handleLike = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const nextLiked = interactionsService.toggleReviewLike(review.id, userId);
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleToggleSave = () => {
    const effectiveId = userId || 'guest_user';
    const res = interactionsService.toggleSaveAlbum(effectiveId, {
      title: review.album.title,
      artist: review.album.artist,
      cover: review.album.cover,
      rating: review.rating,
      type: 'album',
    });
    setIsSavedInCollection(res.isSaved);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_6px_24px_-4px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.4)] hover:shadow-md dark:hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6)] hover:border-[#B80C09]/40 transition-all duration-300"
    >
      <div className="flex flex-col gap-4">
        {/* Review Author Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-base ring-2 ring-[#e6d5e2] dark:ring-white/15 shrink-0 shadow-xs"
              style={{ backgroundColor: review.avatarBg }}
            >
              {review.avatarLetter}
            </div>
            <div className="flex flex-col">
              <span className="text-base text-[#231123] dark:text-[#FAF5F8] font-bold leading-snug">
                {review.author}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#5c1d5e] dark:text-pink-200 font-semibold">
                <span
                  className={`material-symbols-outlined text-[13px] ${review.badgeColor}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {review.badgeIcon}
                </span>
                <span>{review.badge}</span>
              </span>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {i < Math.floor(review.rating)
                  ? 'star'
                  : review.rating % 1 !== 0 && i === Math.floor(review.rating)
                  ? 'star_half'
                  : 'star'}
              </span>
            ))}
          </div>
        </div>

        {/* Review Text Excerpt */}
        <p className="text-sm sm:text-base text-[#231123]/90 dark:text-[#FAF5F8]/90 leading-relaxed">
          {review.text}
        </p>

        {/* Album Reference Strip */}
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#fff7fa] dark:bg-[#231123]/80 border border-[#e6d5e2] dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-xs border border-white dark:border-white/10 bg-[#4B2840]">
              <img
                className="w-full h-full object-cover"
                alt={review.album.title}
                src={review.album.cover || getFallbackCoverForAlbum(review.album)}
                onError={(e) => handleImageFallbackError(e, review.album)}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#231123] dark:text-[#FAF5F8] font-bold truncate">
                {review.album.title}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                {review.album.artist}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            title={isSavedInCollection ? 'En tu colección' : 'Guardar en tu colección'}
            className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isSavedInCollection
                ? 'text-[#B80C09] bg-[#B80C09]/10'
                : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: isSavedInCollection ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e6d5e2]/70 dark:border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-3 text-[#5c435a] dark:text-[#B89CB0] text-xs font-medium flex-wrap">
          <LikeButton
            isLiked={isLiked}
            likesCount={likes}
            onToggleLike={handleLike}
            size="md"
          />

          <button
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              showComments ? 'text-[#B80C09] font-bold' : 'hover:text-[#231123] dark:hover:text-[#FAF5F8]'
            }`}
            type="button"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
            <span>{commentsCount}</span>
          </button>

          <TTSButton
            text={review.text}
            title={`Crítica de ${review.userName} sobre ${review.album.title}`}
            size="sm"
            label="Escuchar"
          />
        </div>
        <span className="text-xs text-[#81737e] dark:text-[#B89CB0]/70">
          {review.timeAgo}
        </span>
      </div>

      {/* Sección Expandible de Comentarios */}
      <AnimatePresence>
        {showComments && (
          <CommentSection
            reviewId={review.id}
            onCommentCountChange={(newCount) => setCommentsCount(newCount)}
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export const FeaturedReviews = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
              DISCURSO & ANÁLISIS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#231123] dark:text-[#FAF5F8] font-extrabold mt-1">
              {t('reviews.title', 'Reseñas Destacadas')}
            </h2>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Voces críticas y oyentes apasionados compartiendo su perspectiva musical en alta resolución.
            </p>
          </div>
          <a
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c1d5e] dark:text-pink-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors group cursor-pointer"
            href="#community"
          >
            <span>{t('nav.explore', 'Ver todas las reseñas')}</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>

        {/* 3 Featured Critique Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialReviewsData.map((review) => (
            <FeaturedReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;

