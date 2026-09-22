import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { interactionsService } from '../../../shared/services/interactions-service';
import LikeButton from '../../../shared/components/ui/like-button';

export const CommentSection = ({ reviewId, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = user?.id || null;

  useEffect(() => {
    if (reviewId) {
      const initialComments = interactionsService.getCommentsForReview(reviewId);
      setComments(initialComments);
      const likes = interactionsService.getLikedCommentIds(userId);
      setLikedCommentIds(likes);
    }
  }, [reviewId, userId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    if (!newCommentText.trim()) return;

    setIsSubmitting(true);
    try {
      const commentPayload = {
        userName: user?.username || user?.name || 'Oyente Sonar',
        userHandle: user?.username ? `@${user.username.toLowerCase().replace(/\s+/g, '_')}` : '@sonar_fan',
        avatarLetter: (user?.username || user?.name || 'S').charAt(0).toUpperCase(),
        avatarBg: user?.avatarBg || '#B80C09',
        content: newCommentText.trim(),
      };

      const created = interactionsService.addCommentToReview(reviewId, commentPayload);
      const updated = [created, ...comments];
      setComments(updated);
      setNewCommentText('');
      if (onCommentCountChange) {
        onCommentCountChange(updated.length);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCommentLike = (commentId) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const isNowLiked = interactionsService.toggleCommentLike(commentId, userId);
    setLikedCommentIds((prev) =>
      isNowLiked ? [...prev, commentId] : prev.filter((id) => id !== commentId)
    );
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: isNowLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1),
          };
        }
        return c;
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-3 pt-3 border-t border-[#e6d5e2]/80 dark:border-white/10"
    >
      {/* Formulario para agregar comentario */}
      <form onSubmit={handleAddComment} className="flex gap-2.5 items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ring-1 ring-[#e6d5e2] dark:ring-white/10"
          style={{ backgroundColor: user?.avatarBg || '#B80C09' }}
        >
          {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Escribe un comentario o apreciación acústica..."
            className="w-full py-2 px-3.5 pr-10 text-xs sm:text-sm rounded-xl bg-gray-100 dark:bg-[#1f1020] border border-[#e6d5e2] dark:border-white/10 text-[#231123] dark:text-white placeholder:text-[#5c435a]/60 dark:placeholder:text-[#B89CB0]/60 outline-hidden focus:border-[#B80C09] focus:ring-1 focus:ring-[#B80C09]/30 transition-all"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#B80C09] hover:bg-[#B80C09]/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Publicar comentario"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </form>

      {/* Lista de comentarios */}
      <div className="flex flex-col gap-2.5 mt-1 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] italic py-2 text-center">
            Sé el primero en comentar esta reseña.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isLiked = likedCommentIds.includes(comment.id);
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-[#231123]/50 border border-[#e6d5e2]/60 dark:border-white/5"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                    style={{ backgroundColor: comment.avatarBg || '#5c1d5e' }}
                  >
                    {comment.avatarLetter || comment.userName?.charAt(0) || 'U'}
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 truncate">
                        <span className="text-xs font-bold text-[#231123] dark:text-white truncate">
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-[#5c435a] dark:text-[#B89CB0] truncate">
                          {comment.userHandle}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#81737e] dark:text-[#B89CB0]/70 shrink-0">
                        {comment.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#231123]/90 dark:text-gray-200 mt-0.5 leading-snug">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <LikeButton
                        isLiked={isLiked}
                        likesCount={comment.likes || 0}
                        onToggleLike={() => handleToggleCommentLike(comment.id)}
                        size="sm"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;
