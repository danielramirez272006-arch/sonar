import { createReview } from '../../services/api-client.js';
import { useAuth } from '../../context/auth-context.jsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';
import ReviewForm from '../../../features/reviews/components/review-form';
import Toast from '../ui/toast';

export const ReviewModal = () => {
  const { user } = useAuth();
  const { reviewModalAlbum, closeReviewModal } = usePlayer();
  const [toastMessage, setToastMessage] = useState(null);

  if (!reviewModalAlbum) return null;

  const albumTitle = reviewModalAlbum.album || reviewModalAlbum.title || 'Álbum';
  const artistName = reviewModalAlbum.artist || 'Artista';

  const handleReviewSubmit = async (reviewData) => {
    if (!user) throw new Error('Inicia sesión para publicar una reseña.');
    await createReview({ userId: user.id, albumId: reviewModalAlbum.id, albumTitle, artist: artistName, content: reviewData.reviewText, rating: reviewData.rating, status: 'pending_moderation', aiFlagged: false });
    // Éxito al publicar crítica
    setToastMessage(`Crítica enviada a moderación para ${albumTitle}. Calificación: ${reviewData.rating} estrellas.`);
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
