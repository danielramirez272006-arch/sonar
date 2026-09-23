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
  const [reportedCommentIds, setReportedCommentIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para responder a un comentario específico
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Estado para el modal de reporte
  const [reportingTarget, setReportingTarget] = useState(null);
  const [reportReason, setReportReason] = useState('Lenguaje ofensivo o subido de tono');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmittedToast, setReportSubmittedToast] = useState(false);

  const userId = user?.id || null;

  const REPORT_REASONS = [
    { id: 'offensive', label: '🚫 Lenguaje ofensivo, insultos o subido de tono' },
    { id: 'harassment', label: '⚠️ Acoso, agresión o provocaciones' },
    { id: 'spam', label: '📢 Spam, publicidad no autorizada o enlaces engañosos' },
    { id: 'offtopic', label: '🔇 Contenido fuera de lugar / No musical' },
    { id: 'other', label: '❓ Otro motivo' },
  ];

  useEffect(() => {
    if (reviewId) {
      const initialComments = interactionsService.getCommentsForReview(reviewId);
      setComments(initialComments);
      const likes = interactionsService.getLikedCommentIds(userId);
      setLikedCommentIds(likes);
      const reported = interactionsService.getReportedCommentIds(userId);
      setReportedCommentIds(reported);
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
        onCommentCountChange(calculateTotalComments(updated));
      }
    } finally {
      setIsSubmitting(false);
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
      if (onCommentCountChange) {
        onCommentCountChange(calculateTotalComments(res.comments));
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const calculateTotalComments = (list) => {
    return list.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
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
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? {
                    ...r,
                    likes: isNowLiked ? (r.likes || 0) + 1 : Math.max(0, (r.likes || 0) - 1),
                  }
                : r
            ),
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
    setReportReason('Lenguaje ofensivo o subido de tono');
    setReportDetails('');
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportingTarget) return;

    interactionsService.reportComment(userId, {
      commentId: reportingTarget.id,
      commentText: reportingTarget.content,
      commentUser: reportingTarget.userName,
      reason: reportReason,
      details: reportDetails,
    });

    setReportedCommentIds((prev) => [...prev, reportingTarget.id]);
    setReportingTarget(null);
    setReportSubmittedToast(true);
    setTimeout(() => setReportSubmittedToast(false), 4000);
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

                      {/* Botones de acción del comentario */}
                      <div className="flex items-center gap-4 mt-2">
                        <LikeButton
                          isLiked={isLiked}
                          likesCount={comment.likes || 0}
                          onToggleLike={() => handleToggleCommentLike(comment.id)}
                          size="sm"
                        />

                        {/* Botón Responder */}
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToCommentId(isReplying ? null : comment.id);
                            setReplyText('');
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

                  {/* Formulario inline para responder */}
                  {isReplying && (
                    <motion.form
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={(e) => handleAddReply(e, comment.id)}
                      className="ml-9 mt-1 flex gap-2 items-center bg-white dark:bg-[#1f1020] p-2 rounded-xl border border-[#B80C09]/30"
                    >
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Respondiendo a ${comment.userName}...`}
                        autoFocus
                        className="flex-1 text-xs bg-transparent border-none text-[#231123] dark:text-white placeholder:text-[#5c435a]/60 dark:placeholder:text-[#B89CB0]/60 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setReplyingToCommentId(null)}
                        className="px-2 py-1 text-[11px] text-gray-500 hover:text-gray-700 dark:text-gray-400 cursor-pointer"
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
                    </motion.form>
                  )}

                  {/* Respuestas anidadas (Replies) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-7 sm:ml-9 flex flex-col gap-2 mt-1 pt-2 border-t border-[#e6d5e2]/40 dark:border-white/5">
                      {comment.replies.map((reply) => {
                        const isReplyLiked = likedCommentIds.includes(reply.id);
                        const isReplyReported = reportedCommentIds.includes(reply.id);

                        return (
                          <div
                            key={reply.id}
                            className="flex items-start gap-2 p-2 rounded-lg bg-white/70 dark:bg-[#1f1020]/70 border border-[#e6d5e2]/40 dark:border-white/5"
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px] shrink-0 shadow-xs"
                              style={{ backgroundColor: reply.avatarBg || '#75527b' }}
                            >
                              {reply.avatarLetter || reply.userName?.charAt(0) || 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="flex items-baseline gap-1 truncate">
                                  <span className="text-[11px] font-bold text-[#231123] dark:text-white truncate">
                                    {reply.userName}
                                  </span>
                                  <span className="text-[9px] text-[#5c435a] dark:text-[#B89CB0] truncate">
                                    {reply.userHandle}
                                  </span>
                                </div>
                                <span className="text-[9px] text-[#81737e] dark:text-[#B89CB0]/70 shrink-0">
                                  {reply.timestamp}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#231123]/90 dark:text-gray-200 mt-0.5 leading-snug break-words">
                                {reply.content}
                              </p>

                              <div className="flex items-center gap-3 mt-1">
                                <LikeButton
                                  isLiked={isReplyLiked}
                                  likesCount={reply.likes || 0}
                                  onToggleLike={() => handleToggleCommentLike(reply.id)}
                                  size="sm"
                                />

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
                                  <span className="material-symbols-outlined text-[13px]">flag</span>
                                  <span>{isReplyReported ? 'Reportado' : 'Reportar'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Modal de Reporte con botón de salir y selección de motivos */}
      <AnimatePresence>
        {reportingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-md bg-white dark:bg-[#2c1729] rounded-2xl p-6 shadow-2xl border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4 text-[#231123] dark:text-white relative"
            >
              {/* Encabezado del Modal con botón de salir (X) visible y destacado */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e6d5e2] dark:border-white/10">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined text-[24px]">report</span>
                  <h3 className="text-base sm:text-lg font-black text-[#231123] dark:text-white">
                    Reportar Comentario
                  </h3>
                </div>

                {/* Botón de salir (X) que nunca se corta */}
                <button
                  type="button"
                  onClick={() => setReportingTarget(null)}
                  title="Cerrar ventana de reporte"
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#231123] dark:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Vista previa del comentario reportado */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f1020] border border-[#e6d5e2]/60 dark:border-white/5 text-xs">
                <span className="font-bold text-[#5c435a] dark:text-[#B89CB0] block mb-1">
                  Comentario de {reportingTarget.userName} ({reportingTarget.userHandle}):
                </span>
                <p className="italic text-[#231123] dark:text-gray-200 line-clamp-2">
                  &ldquo;{reportingTarget.content}&rdquo;
                </p>
              </div>

              {/* Formulario con motivos */}
              <form onSubmit={handleSubmitReport} className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[#231123] dark:text-white">
                  ¿Por qué deseas reportar este comentario?
                </label>

                <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        reportReason === r.label
                          ? 'border-[#B80C09] bg-[#B80C09]/5 font-bold text-[#B80C09]'
                          : 'border-[#e6d5e2] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-[#5c435a] dark:text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.label}
                        checked={reportReason === r.label}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="accent-[#B80C09]"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>

                {/* Explicación opcional */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs font-semibold text-[#5c435a] dark:text-[#B89CB0]">
                    Detalles adicionales (opcional):
                  </label>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Explica qué ocurrió o por qué este comentario es inapropiado..."
                    className="w-full p-2.5 text-xs rounded-xl bg-gray-50 dark:bg-[#1f1020] border border-[#e6d5e2] dark:border-white/10 text-[#231123] dark:text-white placeholder:text-[#5c435a]/50 dark:placeholder:text-[#B89CB0]/50 outline-hidden focus:border-[#B80C09]"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e6d5e2] dark:border-white/10 mt-1">
                  <button
                    type="button"
                    onClick={() => setReportingTarget(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c435a] dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancelar / Salir
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#B80C09] hover:bg-[#960a07] shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Enviar Reporte
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentSection;

