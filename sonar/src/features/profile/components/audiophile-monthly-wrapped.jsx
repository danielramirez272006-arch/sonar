import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const AudiophileMonthlyWrapped = ({ user, savedCount = 0, historyCount = 0, reviewsCount = 0 }) => {
  const [copiedNotice, setCopiedNotice] = useState(false);

  const topArtist = user?.preferences?.[0] ? `${user.preferences[0]} Ensemble` : 'Pink Floyd / Miles Davis';
  const listenedMinutes = Math.max(120, historyCount * 4 + savedCount * 45);
  const listeningHours = (listenedMinutes / 60).toFixed(1);

  const handleShare = () => {
    const text = `🎧 Mi resumen acústico en SONAR: ${listeningHours} horas de audio Hi-Fi, ${savedCount} vinilos guardados y afinidad con ${user?.preferences?.[0] || 'Art Rock'}. ¡Únete a SONAR!`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#003844] via-[#231123] to-[#4B2840] border border-white/15 shadow-2xl text-white flex flex-col gap-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B80C09]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300">
            FRECUENCIAS DEL MES • REPORTE HI-FI
          </span>
          <h3 className="text-2xl font-black tracking-tight mt-0.5">
            Tu Espectro Musical Mensual
          </h3>
          <p className="text-xs text-pink-200/80 mt-1">
            Resumen curado de tus hábitos de audición de alta resolución en SONAR.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-5 py-2.5 rounded-2xl bg-white text-[#231123] hover:bg-gray-100 font-bold text-xs transition-all shadow-lg flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#B80C09]">
            {copiedNotice ? 'check' : 'ios_share'}
          </span>
          <span>{copiedNotice ? '¡Copiado para Compartir!' : 'Compartir Resumen'}</span>
        </button>
      </div>

      {/* Tarjetas de Estadísticas del Mes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
          <span className="text-[11px] font-mono text-pink-200/70 uppercase">Tiempo Hi-Fi</span>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{listeningHours}h</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Audio 24-bit Lossless</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
          <span className="text-[11px] font-mono text-pink-200/70 uppercase">Álbumes Archivados</span>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{savedCount}</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Colecciones de Vinilo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
          <span className="text-[11px] font-mono text-pink-200/70 uppercase">Reseñas de Autor</span>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{reviewsCount}</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Valoraciones críticas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
          <span className="text-[11px] font-mono text-pink-200/70 uppercase">Afinidad Principal</span>
          <div>
            <span className="text-base sm:text-lg font-black text-emerald-300 truncate block">
              {user?.preferences?.[0] || 'Art Rock'}
            </span>
            <span className="text-[10px] text-white/60 block mt-0.5">94% Afinidad espectral</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudiophileMonthlyWrapped;
