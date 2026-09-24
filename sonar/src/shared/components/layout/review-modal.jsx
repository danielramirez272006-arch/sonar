import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeReviewModal();
      }
    };
    if (reviewModalAlbum) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviewModalAlbum, closeReviewModal]);

  if (!reviewModalAlbum) return null;

  // Si el usuario NO ha iniciado sesión, mostrar pantalla de bloqueo para autenticarse
  if (!user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-start p-4 overflow-y-auto"
          onClick={closeReviewModal}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            className="relative w-full max-w-md p-6 sm:p-8 my-auto rounded-3xl bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] border border-gray-200 dark:border-white/10 shadow-2xl text-center flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar visible */}
            <button
              type="button"
              onClick={closeReviewModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-[#B80C09] text-gray-700 hover:text-white dark:bg-white/10 dark:hover:bg-[#B80C09] dark:text-white flex items-center justify-center transition-colors cursor-pointer border border-gray-200 dark:border-white/10 shadow-xs"
              title="Cerrar (Esc)"
              aria-label="Cerrar ventana"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-[#B80C09]/20 border border-rose-200 dark:border-[#B80C09]/30 flex items-center justify-center text-[#B80C09] dark:text-rose-400">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-widest font-black text-[#B80C09]">
                Acceso para Miembros
              </span>
              <h3 className="text-2xl font-black tracking-tight">
                Inicia Sesión para Criticar
              </h3>
              <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
                Debes tener una cuenta activa en Sonar para calificar música y publicar tus análisis en la comunidad.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  closeReviewModal();
                  window.location.hash = '#login';
                }}
                className="w-full py-3.5 rounded-2xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeReviewModal();
                  window.location.hash = '#register';
                }}
                className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#231123] dark:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Crear una Cuenta</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const isTrack = reviewModalAlbum.type === 'track' || Boolean(reviewModalAlbum.trackId) || Boolean(reviewModalAlbum.title && reviewModalAlbum.album && reviewModalAlbum.title !== reviewModalAlbum.album);
  const initialType = reviewModalAlbum.type || (isTrack ? 'track' : 'album');
  const songTitle = isTrack ? reviewModalAlbum.title : (reviewModalAlbum.trackTitle || reviewModalAlbum.songTitle || '');
  const albumTitle = reviewModalAlbum.album || (isTrack ? (reviewModalAlbum.albumTitle || 'Sencillo') : reviewModalAlbum.title) || 'Álbum';
  const artistName = reviewModalAlbum.artist || 'Artista';
  const cover = reviewModalAlbum.cover || reviewModalAlbum.cover_medium || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
  const deezerId = reviewModalAlbum.deezerId || reviewModalAlbum.id;

  const handleReviewSubmit = async (reviewData) => {
    const effectiveUserId = String(user.id);
    const effectiveUserName = user.name || user.username || 'Usuario Sonar';
    const effectiveUserHandle = user.username ? `@${user.username}` : '@usuario';

    const isReviewingSong = reviewData.type === 'track';
    const targetTitle = isReviewingSong && reviewData.trackTitle
      ? reviewData.trackTitle
      : albumTitle;

    const saved = await createReview({
      userId: effectiveUserId, userName: effectiveUserName,
      albumId: String(reviewModalAlbum.albumId || deezerId), albumTitle: targetTitle,
      parentAlbum: albumTitle, type: reviewData.type || 'album',
      trackTitle: isReviewingSong ? targetTitle : '', artist: artistName, cover,
      rating: reviewData.rating, content: reviewData.reviewText,
      hasSpoilers: reviewData.hasSpoilers, status: 'pending_moderation', aiFlagged: false,
    });
    interactionsService.addUserReview(effectiveUserId, { ...saved, userHandle: effectiveUserHandle });
    window.dispatchEvent(new CustomEvent('sonar:review-created', { detail: saved }));
    setToastMessage('Cr?tica enviada a moderaci?n para ' + targetTitle + '.');
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 overflow-y-auto"
          onClick={closeReviewModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative w-full max-w-2xl my-auto py-4 sm:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <ReviewForm
              initialType={initialType}
              trackTitle={songTitle}
              albumTitle={albumTitle}
              artistName={artistName}
              onSubmit={handleReviewSubmit}
              onClose={closeReviewModal}
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
