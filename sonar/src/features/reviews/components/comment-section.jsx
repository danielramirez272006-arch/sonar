import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { useAccessibility } from '../../../shared/context/accessibility-context';
import { interactionsService } from '../../../shared/services/interactions-service';
import { ReportModal } from '../../../shared/components/ui/report-modal';

export const CommentSection = ({ reviewId, onCommentCountChange }) => {
  const { user } = useAuth();
  const { playAudioCue } = useAccessibility();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [dislikedCommentIds, setDislikedCommentIds] = useState([]);
  const [reportedCommentIds, setReportedCommentIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para responder a un comentario o respuesta específica
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyTargetUser, setReplyTargetUser] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Estado para el modal de reporte
  const [reportingTarget, setReportingTarget] = useState(null);
  const [reportSubmittedToast, setReportSubmittedToast] = useState(false);

  const userId = user?.id || null;

  useEffect(() => {
    if (reviewId) {
      const initialComments = interactionsService.getCommentsForReview(reviewId);
      setComments(initialComments);
      const likes = interactionsService.getLikedCommentIds(userId);
      setLikedCommentIds(likes);
      const dislikes = interactionsService.getDislikedCommentIds(userId);
      setDislikedCommentIds(dislikes);
      const reported = interactionsService.getReportedCommentIds(userId);
      setReportedCommentIds(reported);
    }
  }, [reviewId, userId]);

  const calculateTotalComments = (list) => {
    return list.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
  };

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
        onCommentCountChange(calculateTotalComments(updated));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartReply = (parentCommentId, targetUser = null) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    setReplyingToCommentId(parentCommentId);
    setReplyTargetUser(targetUser);
    if (targetUser?.userName) {
      setReplyText(`@${targetUser.userName} `);
    } else {
      setReplyText('');
    }
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const replyPayload = {
        userName: user?.username || user?.name || 'Oyente Sonar',
        userHandle: user?.username ? `@${user.username.toLowerCase().replace(/\s+/g, '_')}` : '@sonar_fan',
        avatarLetter: (user?.username || user?.name || 'S').charAt(0).toUpperCase(),
        avatarBg: user?.avatarBg || '#B80C09',
        content: replyText.trim(),
      };

      const res = interactionsService.addReplyToComment(reviewId, commentId, replyPayload);
      setComments(res.comments);
      setReplyText('');
      setReplyingToCommentId(null);
      setReplyTargetUser(null);
      if (onCommentCountChange) {
        onCommentCountChange(calculateTotalComments(res.comments));
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleToggleCommentLike = (commentId) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleCommentLike(commentId, userId);
    setLikedCommentIds((prev) =>
      res.isLiked ? [...prev, commentId] : prev.filter((id) => id !== commentId)
    );
    setDislikedCommentIds((prev) => prev.filter((id) => id !== commentId));

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hadDislike = dislikedCommentIds.includes(commentId);
          return {
            ...c,
            likes: res.isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1),
            dislikes: res.isLiked && hadDislike ? Math.max(0, (c.dislikes || 0) - 1) : (c.dislikes || 0),
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === commentId) {
                const hadDislike = dislikedCommentIds.includes(commentId);
                return {
                  ...r,
                  likes: res.isLiked ? (r.likes || 0) + 1 : Math.max(0, (r.likes || 0) - 1),
                  dislikes: res.isLiked && hadDislike ? Math.max(0, (r.dislikes || 0) - 1) : (r.dislikes || 0),
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleToggleCommentDislike = (commentId) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleCommentDislike(commentId, userId);
    setDislikedCommentIds((prev) =>
      res.isDisliked ? [...prev, commentId] : prev.filter((id) => id !== commentId)
    );
    setLikedCommentIds((prev) => prev.filter((id) => id !== commentId));

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hadLike = likedCommentIds.includes(commentId);
          return {
            ...c,
            dislikes: res.isDisliked ? (c.dislikes || 0) + 1 : Math.max(0, (c.dislikes || 0) - 1),
            likes: res.isDisliked && hadLike ? Math.max(0, (c.likes || 0) - 1) : (c.likes || 0),
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === commentId) {
                const hadLike = likedCommentIds.includes(commentId);
                return {
                  ...r,
                  dislikes: res.isDisliked ? (r.dislikes || 0) + 1 : Math.max(0, (r.dislikes || 0) - 1),
                  likes: res.isDisliked && hadLike ? Math.max(0, (r.likes || 0) - 1) : (r.likes || 0),
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const handleOpenReport = (target) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    setReportingTarget(target);
  };

  const handleProcessReport = async (reportPayload) => {
    interactionsService.reportComment(userId, {
      ...reportPayload,
      commentId: reportingTarget?.id,
      commentText: reportingTarget?.content,
      commentUser: reportingTarget?.userName,
    });

    if (reportingTarget?.id) {
      setReportedCommentIds((prev) => [...prev, reportingTarget.id]);
    }
    setReportSubmittedToast(true);
    setTimeout(() => setReportSubmittedToast(false), 4500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-3 pt-3 border-t border-[#e6d5e2]/80 dark:border-white/10 relative"
    >
      {/* Toast de confirmación de reporte */}
      <AnimatePresence>
        {reportSubmittedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Comentario reportado para moderación. ¡Gracias por mantener la comunidad segura!</span>
            </div>
            <button
              onClick={() => setReportSubmittedToast(false)}
              className="p-1 hover:bg-black/10 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario para agregar comentario principal */}
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
      <div className="flex flex-col gap-3 mt-1 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] italic py-2 text-center">
            Sé el primero en comentar esta reseña.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isLiked = likedCommentIds.includes(comment.id);
              const isDisliked = dislikedCommentIds.includes(comment.id);
              const isReported = reportedCommentIds.includes(comment.id);
              const isReplying = replyingToCommentId === comment.id;

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 dark:bg-[#231123]/50 border border-[#e6d5e2]/60 dark:border-white/5"
                >
                  <div className="flex items-start gap-2.5">
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
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isReported && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Reportado
                            </span>
                          )}
                          <span className="text-[10px] text-[#81737e] dark:text-[#B89CB0]/70">
                            {comment.timestamp}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#231123]/90 dark:text-gray-200 mt-1 leading-relaxed break-words">
                        {comment.content}
                      </p>

                      {/* Botones de acción del comentario (Corazón, Corazón Roto, Responder, Reportar) */}
                      <div className="flex items-center gap-3 sm:gap-4 mt-2">
                        {/* Botón Corazón (Me gusta) */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.88 }}
                          type="button"
                          onClick={() => {
                            playAudioCue('like');
                            handleToggleCommentLike(comment.id);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            isLiked
                              ? 'bg-rose-500/15 dark:bg-rose-500/25 text-[#B80C09] dark:text-rose-300 border border-rose-500/30 shadow-xs font-black'
                              : 'bg-black/5 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] dark:hover:text-rose-400 border border-black/5 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-900/40'
                          }`}
                          title="Me gusta (Corazón)"
                        >
                          <span
                            className="material-symbols-outlined text-[15px] transition-transform duration-200"
                            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            favorite
                          </span>
                          <span className="font-mono text-[11px] font-bold">{comment.likes || 0}</span>
                        </motion.button>

                        {/* Botón Corazón Roto (No me gusta) */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.88 }}
                          type="button"
                          onClick={() => {
                            playAudioCue('click');
                            handleToggleCommentDislike(comment.id);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            isDisliked
                              ? 'bg-purple-500/15 dark:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 shadow-xs font-black'
                              : 'bg-black/5 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[#5c435a]/80 dark:text-[#B89CB0]/80 hover:text-purple-600 dark:hover:text-purple-300 border border-black/5 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-900/40'
                          }`}
                          title="No me gusta (Corazón roto)"
                        >
                          <span
                            className="material-symbols-outlined text-[15px] transition-transform duration-200"
                            style={{ fontVariationSettings: isDisliked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            heart_broken
                          </span>
                          <span className="font-mono text-[11px] font-bold">{comment.dislikes || 0}</span>
                        </motion.button>

                        {/* Botón Responder */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isReplying) {
                              setReplyingToCommentId(null);
                              setReplyTargetUser(null);
                            } else {
                              handleStartReply(comment.id, comment);
                            }
                          }}
                          className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                            isReplying
                              ? 'text-[#B80C09]'
                              : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">reply</span>
                          {isReplying ? 'Cancelar' : 'Responder'}
                        </button>

                        {/* Botón Reportar Comentario */}
                        <button
                          type="button"
                          onClick={() => handleOpenReport(comment)}
                          disabled={isReported}
                          title="Reportar este comentario si es inapropiado o subido de tono"
                          className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ml-auto ${
                            isReported
                              ? 'text-amber-500/60 cursor-not-allowed'
                              : 'text-[#5c435a]/70 dark:text-[#B89CB0]/70 hover:text-red-500'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">flag</span>
                          <span className="hidden sm:inline">{isReported ? 'Reportado' : 'Reportar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Respuestas anidadas (Replies con su propio botón de responder y reacciones) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-7 sm:ml-9 flex flex-col gap-2 mt-1 pt-2 border-t border-[#e6d5e2]/40 dark:border-white/5">
                      {comment.replies.map((reply) => {
                        const isReplyLiked = likedCommentIds.includes(reply.id);
                        const isReplyDisliked = dislikedCommentIds.includes(reply.id);
                        const isReplyReported = reportedCommentIds.includes(reply.id);

                        return (
                          <div
                            key={reply.id}
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-[#1f1020]/70 border border-[#e6d5e2]/40 dark:border-white/5"
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-xs"
                              style={{ backgroundColor: reply.avatarBg || '#75527b' }}
                            >
                              {reply.avatarLetter || reply.userName?.charAt(0) || 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="flex items-baseline gap-1 truncate">
                                  <span className="text-xs font-bold text-[#231123] dark:text-white truncate">
                                    {reply.userName}
                                  </span>
                                  <span className="text-[10px] text-[#5c435a] dark:text-[#B89CB0] truncate">
                                    {reply.userHandle}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isReplyReported && (
                                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                      Reportado
                                    </span>
                                  )}
                                  <span className="text-[9px] text-[#81737e] dark:text-[#B89CB0]/70">
                                    {reply.timestamp}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-[#231123]/90 dark:text-gray-200 mt-0.5 leading-snug break-words">
                                {reply.content}
                              </p>

                              {/* Botones de acción en respuestas: Corazón, Corazón Roto, Responder a la respuesta, Reportar */}
                              <div className="flex items-center gap-3 mt-1.5">
                                {/* Corazón */}
                                <motion.button
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.88 }}
                                  type="button"
                                  onClick={() => {
                                    playAudioCue('like');
                                    handleToggleCommentLike(reply.id);
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                                    isReplyLiked
                                      ? 'bg-rose-500/15 dark:bg-rose-500/25 text-[#B80C09] dark:text-rose-300 border border-rose-500/30 font-black'
                                      : 'bg-black/5 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] dark:hover:text-rose-400 border border-black/5 dark:border-white/10'
                                  }`}
                                  title="Me gusta"
                                >
                                  <span
                                    className="material-symbols-outlined text-[13px]"
                                    style={{ fontVariationSettings: isReplyLiked ? "'FILL' 1" : "'FILL' 0" }}
                                  >
                                    favorite
                                  </span>
                                  <span className="font-mono text-[10px] font-bold">{reply.likes || 0}</span>
                                </motion.button>

                                {/* Corazón Roto */}
                                <motion.button
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.88 }}
                                  type="button"
                                  onClick={() => {
                                    playAudioCue('click');
                                    handleToggleCommentDislike(reply.id);
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                                    isReplyDisliked
                                      ? 'bg-purple-500/15 dark:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-black'
                                      : 'bg-black/5 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[#5c435a]/80 dark:text-[#B89CB0]/80 hover:text-purple-600 dark:hover:text-purple-300 border border-black/5 dark:border-white/10'
                                  }`}
                                  title="No me gusta"
                                >
                                  <span
                                    className="material-symbols-outlined text-[13px]"
                                    style={{ fontVariationSettings: isReplyDisliked ? "'FILL' 1" : "'FILL' 0" }}
                                  >
                                    heart_broken
                                  </span>
                                  <span className="font-mono text-[10px] font-bold">{reply.dislikes || 0}</span>
                                </motion.button>

                                {/* Botón Responder a esta respuesta para continuar la conversación */}
                                <button
                                  type="button"
                                  onClick={() => handleStartReply(comment.id, reply)}
                                  className="flex items-center gap-0.5 text-[10px] font-bold text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] transition-colors cursor-pointer"
                                  title={`Responder a ${reply.userName}`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">reply</span>
                                  <span>Responder</span>
                                </button>

                                {/* Reportar respuesta */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenReport({ ...reply, isReply: true })}
                                  disabled={isReplyReported}
                                  title="Reportar esta respuesta"
                                  className={`flex items-center gap-0.5 text-[10px] transition-colors cursor-pointer ml-auto ${
                                    isReplyReported
                                      ? 'text-amber-500/60 cursor-not-allowed'
                                      : 'text-[#5c435a]/60 dark:text-[#B89CB0]/60 hover:text-red-500'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">flag</span>
                                  <span>{isReplyReported ? 'Reportado' : 'Reportar'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Formulario inline para responder (para el comentario o para continuar la charla con una persona) */}
                  {isReplying && (
                    <motion.form
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={(e) => handleAddReply(e, comment.id)}
                      className="ml-7 sm:ml-9 mt-1 flex flex-col gap-1.5 bg-white dark:bg-[#1f1020] p-2.5 rounded-xl border border-[#B80C09]/30 shadow-xs"
                    >
                      {replyTargetUser && (
                        <div className="flex items-center justify-between text-[11px] text-[#B80C09] font-bold px-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">reply</span>
                            Respondiendo a {replyTargetUser.userName} ({replyTargetUser.userHandle})
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyTargetUser(null)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                            title="Quitar mención directa"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={
                            replyTargetUser
                              ? `Escribe tu respuesta para ${replyTargetUser.userName}...`
                              : `Respondiendo al hilo de ${comment.userName}...`
                          }
                          autoFocus
                          className="flex-1 text-xs bg-transparent border-none text-[#231123] dark:text-white placeholder:text-[#5c435a]/60 dark:placeholder:text-[#B89CB0]/60 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToCommentId(null);
                            setReplyTargetUser(null);
                          }}
                          className="px-2.5 py-1 text-[11px] text-gray-500 hover:text-gray-700 dark:text-gray-400 cursor-pointer font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={!replyText.trim() || isSubmittingReply}
                          className="px-3 py-1 rounded-lg bg-[#B80C09] text-white text-[11px] font-bold hover:bg-[#B80C09]/90 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          Responder
                        </button>
                      </div>
                    </motion.form>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Modal de Reporte Moderno con Glassmorphism */}
      <ReportModal
        isOpen={Boolean(reportingTarget)}
        target={reportingTarget}
        onClose={() => setReportingTarget(null)}
        onSubmitReport={handleProcessReport}
      />
    </motion.div>
  );
};

export default CommentSection;

