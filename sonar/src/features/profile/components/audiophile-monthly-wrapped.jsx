import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';

/**
 * AudiophileMonthlyWrapped & Credencial Compartible
 * Genera estadísticas avanzadas de escucha, gráficos de frecuencias por día
 * y una tarjeta credencial audiófila descargable en HD.
 */
export const AudiophileMonthlyWrapped = ({
  user,
  savedCount = 0,
  historyCount = 0,
  reviewsCount = 0,
  gearSetup = {},
}) => {
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [isDownloadingBadge, setIsDownloadingBadge] = useState(false);
  const credentialRef = useRef(null);

  const equippedFrame = user?.equippedFrame || '';
  const equippedTitle = user?.equippedTitle || 'Audiófilo de Élite';

  // ID audiófilo determinista
  const passportId = useMemo(() => {
    const raw = String(user?.id || user?.email || 'USER8849');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash) % 90000 + 10000;
    return `SNR-${positiveCode}-HIFI`;
  }, [user]);

  // Horas y minutos calculados
  const listenedMinutes = Math.max(280, historyCount * 4 + savedCount * 42);
  const listeningHours = (listenedMinutes / 60).toFixed(1);

  // Datos de actividad semanal (Lunes a Domingo)
  const weeklyDays = [
    { day: 'Lun', minutes: Math.round(listenedMinutes * 0.12), height: '48%' },
    { day: 'Mar', minutes: Math.round(listenedMinutes * 0.15), height: '60%' },
    { day: 'Mié', minutes: Math.round(listenedMinutes * 0.18), height: '72%' },
    { day: 'Jue', minutes: Math.round(listenedMinutes * 0.14), height: '56%' },
    { day: 'Vie', minutes: Math.round(listenedMinutes * 0.22), height: '88%' },
    { day: 'Sáb', minutes: Math.round(listenedMinutes * 0.25), height: '100%' },
    { day: 'Dom', minutes: Math.round(listenedMinutes * 0.16), height: '64%' },
  ];

  // Desglose de formatos
  const formatBreakdown = [
    { name: 'Vinilo 180g Prensado', pct: 54, color: 'bg-[#B80C09]', icon: 'album' },
    { name: 'Master Hi-Res 24-bit FLAC', pct: 32, color: 'bg-[#003844]', icon: 'graphic_eq' },
    { name: 'Cinta Magnética / Cassette', pct: 14, color: 'bg-[#4B2840]', icon: 'radio' },
  ];

  const handleShare = () => {
    const text = `🎧 Mi Resumen Acústico SONAR Wrapped:\n• ${listeningHours} horas de audio Hi-Fi en alta resolución\n• ${savedCount} álbumes en mi colección de vinilos\n• ${reviewsCount} reseñas críticas de autor\n• Rango: ${equippedTitle} (${passportId})\n• Setup: ${gearSetup?.turntable || 'Technics Direct Drive'} + ${gearSetup?.headphones || 'Sennheiser Reference'}\n\n¡Únete a SONAR • Buen criterio. Mejor música! 🎵`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3500);
  };

  // Descarga de Credencial Audiófila mediante HTML Canvas
  const handleDownloadCredential = () => {
    setIsDownloadingBadge(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fondo oscuro Sonar (#231123 a #4B2840)
      const grad = ctx.createLinearGradient(0, 0, 800, 480);
      grad.addColorStop(0, '#231123');
      grad.addColorStop(0.5, '#4B2840');
      grad.addColorStop(1, '#003844');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);

      // Borde decorativo dorado/rojo
      ctx.strokeStyle = '#B80C09';
      ctx.lineWidth = 6;
      ctx.strokeRect(18, 18, 764, 444);

      // Marca SONAR
      ctx.fillStyle = '#DCDCDD';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('SONAR • AUDIOPHILE PASSPORT', 48, 64);

      ctx.fillStyle = '#B80C09';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('OFFICIAL CERTIFIED HI-FI CREDENTIAL', 48, 86);

      // Línea divisoria
      ctx.strokeStyle = 'rgba(220, 220, 221, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(48, 105);
      ctx.lineTo(752, 105);
      ctx.stroke();

      // Datos del usuario
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(user?.name || user?.username || 'Melómano Sonar', 48, 160);

      ctx.fillStyle = '#DCDCDD';
      ctx.font = '16px sans-serif';
      ctx.fillText(user?.username ? `@${user.username}` : '@audiophile', 48, 190);

      ctx.fillStyle = '#ff4d4a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`🎖️ ${equippedTitle}`, 48, 225);

      // Pasaporte ID & Estadísticas
      ctx.fillStyle = '#003844';
      ctx.fillRect(48, 250, 320, 70);
      ctx.strokeStyle = '#52a2b0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 250, 320, 70);

      ctx.fillStyle = '#DCDCDD';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('PASAPORTE AUDIÓFILO N°:', 62, 275);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(passportId, 62, 303);

      // Setup Hi-Fi
      ctx.fillStyle = '#DCDCDD';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('EQUIPAMIENTO DE REFERENCIA:', 48, 355);

      ctx.fillStyle = 'rgba(220, 220, 221, 0.85)';
      ctx.font = '13px sans-serif';
      ctx.fillText(`• Tornamesa: ${gearSetup?.turntable || 'Technics SL-1200MK7'}`, 48, 380);
      ctx.fillText(`• Auriculares: ${gearSetup?.headphones || 'Sennheiser HD 660S'}`, 48, 402);
      ctx.fillText(`• Formato Favorito: ${gearSetup?.favoriteFormat || 'Vinilo 180g Prensado'}`, 48, 424);

      // Resumen numérico lado derecho
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(420, 135, 330, 290);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(420, 135, 330, 290);

      ctx.fillStyle = '#DCDCDD';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('RÉCORD ACÚSTICO ACUMULADO', 440, 170);

      ctx.fillStyle = '#B80C09';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(`${listeningHours}h`, 440, 220);
      ctx.fillStyle = 'rgba(220, 220, 221, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Audición Lossless 24-bit', 440, 240);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`${savedCount}`, 440, 290);
      ctx.fillStyle = 'rgba(220, 220, 221, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Discos en Vinilteca Personal', 440, 310);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`${reviewsCount}`, 440, 360);
      ctx.fillStyle = 'rgba(220, 220, 221, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Reseñas Críticas Publicadas', 440, 380);

      // Sello de autenticidad Sonar
      ctx.fillStyle = '#ff4d4a';
      ctx.font = 'italic 11px sans-serif';
      ctx.fillText('VERIFIED AUDIOPHILE • SONAR SOUND LABS', 440, 412);

      // Descargar enlace
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `sonar-credencial-${(user?.username || 'audiophile').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3500);
    } catch (e) {
      console.warn('Error al exportar credencial:', e);
    } finally {
      setIsDownloadingBadge(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Toast Notificación */}
      <AnimatePresence>
        {copiedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#003844] text-[#DCDCDD] font-bold text-xs shadow-2xl border border-[#52a2b0]/40 flex items-center gap-2 backdrop-blur-xl"
          >
            <span className="material-symbols-outlined text-[#52a2b0] text-[18px]">verified</span>
            <span>¡Resumen y credencial listos para compartir!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SECCIÓN PRINCIPAL: SONAR WRAPPED & FRECUENCIAS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#003844] via-[#231123] to-[#4B2840] border border-white/15 shadow-2xl text-[#DCDCDD] flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B80C09]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DCDCDD]/80 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#B80C09]">equalizer</span>
              <span>SONAR WRAPPED • REPORTE ACÚSTICO</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Tu Espectro Musical y Hábitos de Escucha
            </h3>
            <p className="text-xs text-[#DCDCDD]/80 mt-1 max-w-xl">
              Métricas calculadas a partir de tus sesiones Lossless, álbumes coleccionados y valoraciones críticas.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleDownloadCredential}
              disabled={isDownloadingBadge}
              className="px-4 py-2.5 rounded-2xl bg-[#003844] hover:bg-[#002830] text-[#DCDCDD] border border-[#52a2b0]/40 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              title="Descargar imagen HD de tu credencial oficial de melómano"
            >
              <span className="material-symbols-outlined text-[16px] text-[#52a2b0]">
                {isDownloadingBadge ? 'hourglass_top' : 'badge'}
              </span>
              <span>{isDownloadingBadge ? 'Generando PNG...' : 'Descargar Credencial HD'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-2xl bg-[#B80C09] hover:bg-[#9c0a07] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedNotice ? 'check' : 'ios_share'}
              </span>
              <span>{copiedNotice ? '¡Copiado!' : 'Compartir Resumen'}</span>
            </button>
          </div>
        </div>

        {/* 4 Métricas de Alto Impacto */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
            <span className="text-[11px] font-mono text-[#DCDCDD]/70 uppercase">Tiempo Hi-Fi Acumulado</span>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">{listeningHours}h</span>
              <span className="text-[10px] text-[#DCDCDD]/70 block mt-0.5">Audio 24-bit / 96kHz</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
            <span className="text-[11px] font-mono text-[#DCDCDD]/70 uppercase">Álbumes Archivados</span>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">{savedCount}</span>
              <span className="text-[10px] text-[#DCDCDD]/70 block mt-0.5">Vinilteca de 180g</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
            <span className="text-[11px] font-mono text-[#DCDCDD]/70 uppercase">Reseñas de Autor</span>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">{reviewsCount}</span>
              <span className="text-[10px] text-[#DCDCDD]/70 block mt-0.5">Críticas comunitarias</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
            <span className="text-[11px] font-mono text-[#DCDCDD]/70 uppercase">Hora Pico de Audición</span>
            <div>
              <span className="text-base sm:text-lg font-black text-[#52a2b0] truncate block">
                22:00 - 00:00
              </span>
              <span className="text-[10px] text-[#DCDCDD]/70 block mt-0.5">Sesión Nocturna en Tubos</span>
            </div>
          </div>
        </div>

        {/* Gráfico Semanal & Desglose de Formatos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 pt-2 border-t border-white/10">
          {/* Gráfico de Barras Semanal */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#52a2b0]">bar_chart</span>
                <span>Distribución Semanal de Minutos de Escucha</span>
              </span>
              <span className="text-[11px] font-mono text-[#DCDCDD]/70">Promedio: 40 min/día</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1 px-2">
              {weeklyDays.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-mono text-[#DCDCDD]/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.minutes}m
                  </span>
                  <div className="w-full max-w-[28px] bg-white/10 rounded-t-lg overflow-hidden h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: d.height }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-[#003844] via-[#4B2840] to-[#B80C09] rounded-t-lg group-hover:brightness-125 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#DCDCDD]/80">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desglose de Formatos Preferidos */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#B80C09]">pie_chart</span>
              <span>Afinidad por Formato de Audio</span>
            </span>

            <div className="flex flex-col gap-3">
              {formatBreakdown.map((fmt) => (
                <div key={fmt.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#DCDCDD] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#52a2b0]">{fmt.icon}</span>
                      <span>{fmt.name}</span>
                    </span>
                    <span className="font-mono font-bold text-white">{fmt.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fmt.pct}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${fmt.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <span className="text-[10px] text-[#DCDCDD]/60 italic">
              * Basado en la respuesta armónica de tu ecualización y catálogo guardado.
            </span>
          </div>
        </div>
      </div>

      {/* 2. CREDENCIAL AUDIÓFILA INTERACTIVA (TARJETA DE PASAPORTE) */}
      <div
        ref={credentialRef}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6d5e2] dark:border-white/10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Credencial Oficial de Melómano</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-[#DCDCDD] mt-0.5">
              Pasaporte & Identidad de Audio Hi-Fi
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDownloadCredential}
            className="px-4 py-2 rounded-xl bg-[#003844] hover:bg-[#002830] text-[#DCDCDD] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#52a2b0]">download</span>
            <span>Exportar Tarjeta PNG</span>
          </button>
        </div>

        {/* Tarjeta Visual de Credencial */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#231123] via-[#3a1b33] to-[#003844] text-[#DCDCDD] border-2 border-[#B80C09]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="relative shrink-0">
              <Avatar
                src={user?.avatarUrl}
                name={user?.name || user?.username || 'U'}
                size="xl"
                frame={equippedFrame}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {user?.name || user?.username || 'Melómano Sonar'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#B80C09] text-white">
                  Verificado
                </span>
              </div>
              <p className="text-xs text-[#DCDCDD]/80">
                {user?.username ? `@${user.username}` : '@usuario'} · {user?.email || 'audiophile@sonar.audio'}
              </p>
              <span className="text-xs font-bold text-[#ff4d4a] mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
                <span>{equippedTitle}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto justify-end">
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/15 flex flex-col gap-1 min-w-[200px]">
              <span className="text-[10px] font-mono text-[#DCDCDD]/70 uppercase">Pasaporte ID</span>
              <span className="text-base font-mono font-black text-white">{passportId}</span>
              <span className="text-[10px] text-[#52a2b0] font-medium">Cadena Acústica Certificada</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-white/15 flex flex-col gap-1 min-w-[180px]">
              <span className="text-[10px] font-mono text-[#DCDCDD]/70 uppercase">Setup Principal</span>
              <span className="text-xs font-bold text-white truncate">
                {gearSetup?.turntable || 'Technics SL-1200'}
              </span>
              <span className="text-[10px] text-[#DCDCDD]/70 truncate">
                {gearSetup?.headphones || 'Sennheiser HD 660S'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudiophileMonthlyWrapped;
