import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';
import { useAuth } from '../../context/auth-context';
import ReviewForm from '../../../features/reviews/components/review-form';
import Toast from '../ui/toast';
import { interactionsService } from '../../services/interactions-service';
import { createReview } from '../../services/api-client';

export const ReviewModal = () => {
  const { reviewModalAlbum, closeReviewModal } = usePlayer();
  const { user } = useAuth() || {};
  const [toastMessage, setToastMessage] = useState(null);

  if (!reviewModalAlbum) return null;

  const isTrack = reviewModalAlbum.type === 'track' || Boolean(reviewModalAlbum.trackId) || Boolean(reviewModalAlbum.title && reviewModalAlbum.album && reviewModalAlbum.title !== reviewModalAlbum.album);
  const initialType = reviewModalAlbum.type || (isTrack ? 'track' : 'album');
  const songTitle = isTrack ? reviewModalAlbum.title : (reviewModalAlbum.trackTitle || reviewModalAlbum.songTitle || '');
  const albumTitle = reviewModalAlbum.album || (isTrack ? (reviewModalAlbum.albumTitle || 'Sencillo') : reviewModalAlbum.title) || 'Álbum';
  const artistName = reviewModalAlbum.artist || 'Artista';
  const cover = reviewModalAlbum.cover || reviewModalAlbum.cover_medium || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
  const deezerId = reviewModalAlbum.deezerId || reviewModalAlbum.id;

  const handleReviewSubmit = async (reviewData) => {
    const effectiveUserId = user?.id ? String(user.id) : '1';
    const effectiveUserName = user?.name || user?.username || 'Mateo Rivaes';
    const effectiveUserHandle = user?.username ? `@${user.username}` : '@mateorivaes';

    const isReviewingSong = reviewData.type === 'track';
    const targetTitle = isReviewingSong && reviewData.trackTitle
      ? reviewData.trackTitle
      : albumTitle;

    // 1. Guardar en interactionsService (LocalStorage / Store para el perfil de usuario activo)
    const newLocalReview = interactionsService.addUserReview(effectiveUserId, {
      albumTitle: targetTitle,
      parentAlbum: albumTitle,
      trackTitle: isReviewingSong ? targetTitle : '',
      type: reviewData.type || 'album',
      artist: artistName,
      cover,
      rating: reviewData.rating,
      content: reviewData.reviewText,
      userName: effectiveUserName,
      userHandle: effectiveUserHandle,
      avatarLetter: effectiveUserName.charAt(0).toUpperCase(),
      hasSpoilers: reviewData.hasSpoilers,
    });

    // 2. Sincronizar con API backend
    try {
      await createReview({
        id: `rev-${Date.now()}`,
        userId: effectiveUserId,
        albumId: deezerId ? String(deezerId) : `item_${Date.now()}`,
        albumTitle: targetTitle,
        type: reviewData.type || 'album',
        trackTitle: isReviewingSong ? targetTitle : '',
        artist: artistName,
        rating: reviewData.rating,
        content: reviewData.reviewText,
        status: 'approved',
        aiFlagged: false,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Backend API no disponible (guardado en almacenamiento local):', e);
    }

    // 3. Emitir evento para actualizar toda la interfaz en tiempo real
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:review-created', {
          detail: newLocalReview,
        })
      );
    }

    // Éxito al publicar crítica
    setToastMessage(
      isReviewingSong
        ? `¡Crítica de la canción "${targetTitle}" publicada! Calificación: ${reviewData.rating} ★.`
        : `¡Crítica del álbum "${albumTitle}" publicada! Calificación: ${reviewData.rating} ★.`
    );
    setTimeout(() => {
      closeReviewModal();
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeReviewModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative w-full max-w-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar modal */}
            <button
              onClick={closeReviewModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <ReviewForm
              initialType={initialType}
              trackTitle={songTitle}
              albumTitle={albumTitle}
              artistName={artistName}
              onSubmit={handleReviewSubmit}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};

export default ReviewModal;
