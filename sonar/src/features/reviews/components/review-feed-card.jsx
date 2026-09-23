import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { usePlayer } from '../../../shared/context/player-context';
import { interactionsService } from '../../../shared/services/interactions-service';
import { socialService } from '../../../shared/services/social-service';
import { Avatar } from '../../../shared/components/ui/avatar';
import CommentSection from './comment-section';
import LikeButton from '../../../shared/components/ui/like-button';

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
    userId: '1',
    userName: 'Sofía Sound',
    userHandle: '@sofia_sound',
    avatarUrl: '',
    date: 'Hace 2 horas',
    rating: 5,
    albumTitle: 'In Rainbows',
    artist: 'Radiohead',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    content:
      'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
    likesCount: 142,
    commentsCount: 18,
    tags: ['Art Rock', 'Hi-Fi'],
  },
}) => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const currentUserId = user?.id || 'guest';

  const authorId = String(review.userId || review.userHandle || review.userName || 'author');
  const isSelf = user && String(user.id) === authorId;

  const [likes, setLikes] = useState(review.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(review.commentsCount || 0);
  const [isSavedInCollection, setIsSavedInCollection] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isFollowingArtist, setIsFollowingArtist] = useState(false);

  useEffect(() => {
    const likedIds = interactionsService.getLikedReviewIds(currentUserId);
    setIsLiked(likedIds.includes(review.id));
    const isSaved = interactionsService.isAlbumSaved(currentUserId, review.albumTitle);
    setIsSavedInCollection(isSaved);
    const existingComments = interactionsService.getCommentsForReview(review.id);
    if (existingComments.length > 0) {
      setCommentsCount(existingComments.length);
    }
    setIsFollowingUser(socialService.isFollowingUser(currentUserId, authorId));
    setIsFollowingArtist(socialService.isFollowingArtist(currentUserId, review.artist));

    const handleUserFollowChange = (e) => {
      if (e.detail?.targetUserId === authorId) {
        setIsFollowingUser(e.detail.isFollowing);
      }
    };
    const handleArtistFollowChange = (e) => {
      if (e.detail?.artistName?.toLowerCase() === review.artist?.toLowerCase()) {
        setIsFollowingArtist(e.detail.isFollowing);
      }
    };

    window.addEventListener('sonar:follow-user-changed', handleUserFollowChange);
    window.addEventListener('sonar:follow-artist-changed', handleArtistFollowChange);
    return () => {
      window.removeEventListener('sonar:follow-user-changed', handleUserFollowChange);
      window.removeEventListener('sonar:follow-artist-changed', handleArtistFollowChange);
    };
  }, [review.id, review.albumTitle, review.artist, currentUserId, authorId]);

  const handleLike = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const nextState = interactionsService.toggleReviewLike(review.id, currentUserId);
    setIsLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleToggleSave = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleSaveAlbum(currentUserId, {
      title: review.albumTitle,
      artist: review.artist,
      cover: review.cover,
      rating: review.rating,
    });
    setIsSavedInCollection(res.isSaved);
  };

  const handleToggleFollowUser = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const next = socialService.toggleFollowUser(currentUserId, authorId, {
      name: review.userName,
      handle: review.userHandle,
      avatarUrl: review.avatarUrl,
    });
    setIsFollowingUser(next);
  };

  const handleToggleFollowArtist = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const next = socialService.toggleFollowArtist(currentUserId, review.artist, {
      cover: review.cover,
      genre: review.tags?.[0] || 'Música',
    });
    setIsFollowingArtist(next);
  };

  const handlePlayReviewAlbum = () => {
    playTrack({
      id: review.id,
      deezerId: review.deezerId,
      title: review.albumTitle,
      artist: review.artist,
      album: review.albumTitle,
      cover: review.cover,
      preview: review.previewUrl || review.preview,
    });
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="w-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_25px_-4px_rgba(0,0,0,0.4)] transition-colors duration-300 flex flex-col gap-4"
    >
      {/* Cabecera: Avatar con nombre, fecha y botón Seguir Usuario */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            name={review.userName}
            src={review.avatarUrl}
            size="md"
            className="w-10 h-10 ring-2 ring-[#e6d5e2]/60 dark:ring-white/15"
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[#231123] dark:text-white leading-tight">
                {review.userName}
              </span>
              {!isSelf && (
                <button
                  type="button"
                  onClick={handleToggleFollowUser}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    isFollowingUser
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'border border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white'
                  }`}
                >
                  {isFollowingUser ? '✓ Siguiendo' : '+ Seguir'}
                </button>
              )}
            </div>
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

      {/* Cuerpo: Cuadro con carátula, artista y botón Seguir Artista */}
      <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 relative group">
        {/* Carátula con botón de reproducción */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-[#180e1a] shadow-xs relative group/cover">
          <img
            src={review.cover}
            alt={review.albumTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
            }}
          />
          <button
            type="button"
            onClick={handlePlayReviewAlbum}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
            title="Escuchar muestra"
          >
            <span className="material-symbols-outlined text-[26px]">play_circle</span>
          </button>
        </div>

        {/* Título de Álbum, Artista y Acciones */}
        <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
                {review.albumTitle}
              </h4>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                — {review.artist}
              </span>

              {/* Badge Canción vs Álbum */}
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${
                review.type === 'track' || review.trackTitle
                  ? 'bg-rose-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-rose-300 border-[#B80C09]/30'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800/40'
              }`}>
                {review.type === 'track' || review.trackTitle ? '🎵 Canción' : '💿 Álbum'}
              </span>

              {/* Botón Seguir Artista */}
              <button
                type="button"
                onClick={handleToggleFollowArtist}
                className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isFollowingArtist
                    ? 'bg-rose-50 text-[#B80C09] border-rose-200 dark:bg-[#B80C09]/20 dark:text-rose-300 dark:border-[#B80C09]/40 shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-[#B80C09] hover:text-white dark:hover:bg-[#B80C09] dark:hover:text-white'
                }`}
                title={isFollowingArtist ? `Sigues a ${review.artist}` : `Seguir a ${review.artist}`}
              >
                <span className="material-symbols-outlined text-[12px]">
                  {isFollowingArtist ? 'done' : 'favorite'}
                </span>
                <span>{isFollowingArtist ? 'Siguiendo' : 'Seguir Artista'}</span>
              </button>
            </div>

            {/* Botón Guardar en Colección Propia */}
            <button
              type="button"
              onClick={handleToggleSave}
              title={isSavedInCollection ? 'En tu colección' : 'Guardar en tu colección'}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isSavedInCollection
                  ? 'text-[#B80C09] bg-[#B80C09]/10'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] hover:bg-gray-200 dark:hover:bg-white/10'
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

          <p className="text-xs sm:text-sm text-[#231123]/90 dark:text-gray-200 leading-relaxed line-clamp-3">
            “{review.content}”
          </p>

          {/* Tags de género / hashtags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-pink-950/40 text-[#B80C09] dark:text-pink-300 text-[10px] font-bold"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pie: Acciones Me gusta y Comentar */}
      <div className="flex items-center gap-6 pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10 text-xs font-semibold text-[#5c435a] dark:text-[#B89CB0]">
        <LikeButton
          isLiked={isLiked}
          likesCount={likes}
          onToggleLike={handleLike}
          size="md"
        />

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            showComments ? 'text-[#B80C09] font-bold' : 'hover:text-[#B80C09]'
          }`}
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
          <span>{commentsCount} comentarios</span>
        </button>
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

export default ReviewFeedCard;
