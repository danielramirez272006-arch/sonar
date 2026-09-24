import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Megaphone,
  MessageSquareOff,
  HelpCircle,
  CheckCircle2,
  X,
  Send,
  ShieldCheck,
  Tag,
  FileText
} from 'lucide-react';

export const REPORT_REASONS = [
  {
    id: 'hate_speech',
    title: 'Lenguaje de odio o discriminación',
    description: 'Insultos, agresiones verbales, racismo, xenofobia u odio dirigido.',
    icon: ShieldAlert,
    badge: 'Prioritario',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  {
    id: 'harassment',
    title: 'Acoso o intimidación',
    description: 'Ataques personales hacia un usuario, amenazas o provocaciones continuas.',
    icon: AlertTriangle,
    badge: 'Grave',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'spam',
    title: 'Spam o enlaces fraudulentos',
    description: 'Publicidad no autorizada, mensajes repetitivos, bots o enlaces sospechosos.',
    icon: Megaphone,
    badge: 'Moderación',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'offtopic',
    title: 'Contenido fuera de lugar / No musical',
    description: 'Mensajes totalmente ajenos a la reseña, trolling o ruido comunitario.',
    icon: MessageSquareOff,
    badge: 'Comunidad',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'other',
    title: 'Otro motivo de infracción',
    description: 'Cualquier otra vulneración a los lineamientos y políticas de Sonar.',
    icon: HelpCircle,
    badge: 'General',
    badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  },
];

const QUICK_TAGS = [
  'Ataque personal',
  'Comentario tóxico',
  'Enlace sospechoso',
  'Desinformación',
  'Bot / Repetitivo',
  'Violación de privacidad'
];

export const ReportModal = ({
  isOpen,
  onClose,
  target,
  onSubmitReport,
}) => {
  const [selectedReasonId, setSelectedReasonId] = useState('hate_speech');
  const [selectedTags, setSelectedTags] = useState([]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedReasonId('hate_speech');
      setSelectedTags([]);
      setDetails('');
      setIsSubmitting(false);
      setIsSuccess(false);

      if (typeof document !== 'undefined') {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }
  }, [isOpen, target]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !target || !mounted || typeof document === 'undefined') return null;

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    const chosenReasonObj = REPORT_REASONS.find((r) => r.id === selectedReasonId) || REPORT_REASONS[0];

    const reportData = {
      targetId: target.id,
      targetType: target.isReply ? 'reply' : target.targetType || 'comment',
      targetUser: target.userName || target.userHandle || 'Usuario',
      targetContent: target.content || target.text || '',
      reasonId: selectedReasonId,
      reasonTitle: chosenReasonObj.title,
      tags: selectedTags,
      details: details.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      if (onSubmitReport) {
        await onSubmitReport(reportData);
      }
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      setSubmitError(err.message || 'No se pudo enviar el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => !isSubmitting && onClose()}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#1a0e1c]/95 dark:bg-[#150a17]/95 bg-gradient-to-b from-[#251226] via-[#1c0e1e] to-[#140816] text-white border border-[#B80C09]/30 dark:border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-5 sm:p-6.5 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Decorative ambient glow */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#B80C09]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

          {/* Success State */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 px-4 flex flex-col items-center text-center gap-4 my-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-black text-white tracking-tight">
                  ¡Reporte Enviado con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Gracias por tu colaboración. Nuestro equipo de moderación evaluará este contenido para garantizar una comunidad segura y respetuosa en Sonar.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Estado: En cola de moderación prioritaria</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#B80C09]/15 border border-[#B80C09]/30 flex items-center justify-center text-[#B80C09] shadow-[0_0_15px_rgba(184,12,9,0.2)] shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                        Reportar Contenido
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#B80C09]/20 text-rose-300 border border-[#B80C09]/30">
                        {target.isReply ? 'Respuesta' : target.targetType === 'review' ? 'Reseña' : 'Comentario'}
                      </span>
                    </div>
                    <p className="text-xs text-[#B89CB0]">
                      Selecciona el motivo que mejor describe el problema
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  title="Cerrar modal"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1 py-3.5 flex-1">
                {/* Target Preview Box */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                        style={{ backgroundColor: target.avatarBg || '#5c1d5e' }}
                      >
                        {target.avatarLetter || target.userName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        {target.userName || 'Usuario'}
                      </span>
                      <span className="text-[11px] text-[#B89CB0] truncate">
                        {target.userHandle || ''}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {target.timestamp || 'Comentario'}
                    </span>
                  </div>

                  <div className="relative pl-3 py-1 border-l-2 border-[#B80C09]/60">
                    <p className="text-xs text-gray-200 italic line-clamp-3 leading-relaxed">
                      &ldquo;{target.content}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Reason Selection Cards */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-200 flex items-center justify-between">
                    <span>Motivo principal del reporte</span>
                    <span className="text-[10px] font-normal text-rose-300/80">* Requerido</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    {submitError && <p role="alert">{submitError}</p>}
                    {REPORT_REASONS.map((reason) => {
                      const isSelected = selectedReasonId === reason.id;
                      const IconComponent = reason.icon;

                      return (
                        <div
                          key={reason.id}
                          onClick={() => setSelectedReasonId(reason.id)}
                          className={`group relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#B80C09]/20 to-[#B80C09]/5 border-[#B80C09] ring-1 ring-[#B80C09]/50 shadow-[0_4px_20px_rgba(184,12,9,0.15)]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-[#B80C09] text-white'
                                : 'bg-white/5 text-gray-400 group-hover:text-white'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs font-bold leading-snug ${
                                  isSelected ? 'text-white' : 'text-gray-200'
                                }`}
                              >
                                {reason.title}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border shrink-0 ${reason.badgeColor}`}
                              >
                                {reason.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-tight">
                              {reason.description}
                            </p>
                          </div>

                          <div className="shrink-0 mt-1">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-[#B80C09] bg-[#B80C09]'
                                  : 'border-gray-500 group-hover:border-gray-300'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Context Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#B89CB0]" />
                    <span>Etiquetas de contexto rápido (opcional)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAGS.map((tag) => {
                      const isTagSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                            isTagSelected
                              ? 'bg-[#B80C09]/20 text-rose-200 border-[#B80C09]/50 shadow-xs'
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span>{isTagSelected ? '✓' : '+'}</span>
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#B89CB0]" />
                      <span>Detalles adicionales (opcional)</span>
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {details.length}/300
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe brevemente por qué consideras que este contenido viola las normas..."
                    className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 outline-hidden focus:border-[#B80C09] focus:ring-1 focus:ring-[#B80C09]/40 transition-all resize-none"
                  />
                </div>

                {/* Disclaimer / Guidelines Info */}
                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-2 text-[11px] text-[#B89CB0]">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Los reportes son <span className="text-white font-semibold">100% anónimos</span>. Sonar sanciona el contenido que incite al odio, violencia o infracción a las guías editoriales.
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10 mt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B80C09] to-[#d61b17] hover:from-[#9c0a07] hover:to-[#B80C09] shadow-lg shadow-[#B80C09]/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Reporte</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ReportModal;
