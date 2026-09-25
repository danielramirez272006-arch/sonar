import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';

export const AudiophilePassportTab = ({
  user,
  savedAlbums = [],
  userReviews = [],
  recentlyPlayed = [],
  followedArtists = [],
  followedUsers = [],
  gearSetup = {},
  onExportBackup,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Generar ID audiófilo determinista o con el ID del usuario
  const passportNumber = useMemo(() => {
    const raw = String(user?.id || user?.email || 'USER8849');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash) % 90000 + 10000;
    return `SNR-${positiveCode}-HIFI`;
  }, [user]);

  // Cálculos de estadísticas
  const stats = useMemo(() => {
    // Calificación promedio de reseñas
    let avgRating = 0;
    if (userReviews.length > 0) {
      const sum = userReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
      avgRating = (sum / userReviews.length).toFixed(1);
    } else {
      avgRating = '5.0';
    }

    // Distribución de géneros según álbumes guardados y preferencias
    const genresCount = {};
    const prefs = user?.preferences || ['Art Rock', 'Electrónica', 'Jazz Fusion'];
    
    // Asignar base a preferencias
    prefs.forEach((pref) => {
      genresCount[pref] = (genresCount[pref] || 0) + 3;
    });

    // Sumar géneros de álbumes guardados
    savedAlbums.forEach((item) => {
      const g = item.genre || item.tag || 'Rock';
      genresCount[g] = (genresCount[g] || 0) + 1;
    });

    const totalPoints = Object.values(genresCount).reduce((a, b) => a + b, 0) || 1;
    const genreDistribution = Object.entries(genresCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.min(100, Math.round((count / totalPoints) * 100)),
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Rango Audiófilo
    let rankTitle = 'Melómano Iniciado';
    let rankColor = '#003844';
    if (userReviews.length >= 10 || savedAlbums.length >= 20) {
      rankTitle = 'Maestro de la Frecuencia (Master Audiophile)';
      rankColor = '#B80C09';
    } else if (userReviews.length >= 4 || savedAlbums.length >= 8) {
      rankTitle = 'Curador Hi-Fi Avanzado';
      rankColor = '#4B2840';
    } else if (userReviews.length >= 1 || savedAlbums.length >= 3) {
      rankTitle = 'Explorador Acústico';
      rankColor = '#003844';
    }

    return {
      avgRating,
      genreDistribution,
      rankTitle,
      rankColor,
      totalSaved: savedAlbums.length,
      totalReviews: userReviews.length,
      totalHistory: recentlyPlayed.length,
      totalFollowing: followedArtists.length + followedUsers.length,
    };
  }, [user, userReviews, savedAlbums, recentlyPlayed, followedArtists, followedUsers]);

  // Lista de insignias y logros calculados dinámicamente
  const badges = useMemo(() => [
    {
      id: 'gear-master',
      title: 'Oído de Alta Fidelidad',
      category: 'Equipamiento',
      icon: 'headphones',
      description: 'Configuraste tu setup de audición Hi-Fi (Tornamesa, DAC o Audífonos de referencia).',
      unlocked: Boolean(gearSetup?.turntable || gearSetup?.headphones || gearSetup?.dac),
      progress: gearSetup?.turntable || gearSetup?.headphones ? 100 : 0,
      rewardText: '+150 Puntos de Prestigio Acústico',
    },
    {
      id: 'vinyl-keeper',
      title: 'Coleccionista 180g',
      category: 'Colecciones',
      icon: 'album',
      description: 'Has guardado más de 3 álbumes en tus colecciones de sonido maestro.',
      unlocked: savedAlbums.length >= 3,
      progress: Math.min(100, Math.round((savedAlbums.length / 3) * 100)),
      rewardText: 'Acceso a Filtro de Prensados Especiales',
    },
    {
      id: 'author-critic',
      title: 'Crítico Verificado',
      category: 'Reseñas',
      icon: 'rate_review',
      description: 'Publicaste al menos 2 reseñas analíticas en la comunidad de SONAR.',
      unlocked: userReviews.length >= 2,
      progress: Math.min(100, Math.round((userReviews.length / 2) * 100)),
      rewardText: 'Emblema Dorado en Comentarios',
    },
    {
      id: 'sonic-radar',
      title: 'Radar de Vanguardia',
      category: 'Exploración',
      icon: 'sensors',
      description: 'Sigues a 2 o más artistas de diferentes corrientes sonoras.',
      unlocked: followedArtists.length >= 2,
      progress: Math.min(100, Math.round((followedArtists.length / 2) * 100)),
      rewardText: 'Recomendaciones Tempranas de Lanzamientos',
    },
    {
      id: 'community-pulse',
      title: 'Conector de Onda',
      category: 'Comunidad',
      icon: 'diversity_3',
      description: 'Conectaste con otros audiófilos siguiendo sus perfiles.',
      unlocked: followedUsers.length >= 1,
      progress: Math.min(100, Math.round((followedUsers.length / 1) * 100)),
      rewardText: 'Mención en Tablón Comunitario',
    },
    {
      id: 'golden-taste',
      title: 'Gusto Exquisito',
      category: 'Afinidad',
      icon: 'award_star',
      description: 'Mantienes un estándar crítico refinado en tus valoraciones musicales.',
      unlocked: Number(stats.avgRating) >= 4.0 && userReviews.length >= 1,
      progress: userReviews.length >= 1 ? 100 : 50,
      rewardText: 'Insignia de Curaduría Destacada',
    },
  ], [gearSetup, savedAlbums, userReviews, followedArtists, followedUsers, stats.avgRating]);

  const handleCopyPassport = () => {
    const url = `${window.location.origin}/#user-profile`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <section className="flex flex-col gap-8">
      {/* 1. TARJETA PASAPORTE AUDIÓFILO HOLOGRÁFICA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#231123] via-[#35182d] to-[#003844] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        {/* Fondo con patrones y resplandor Hi-Fi */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#B80C09]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#003844]/40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
          {/* Lado Izquierdo: Identidad y Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-[#B80C09] via-white/30 to-[#003844] shadow-lg">
                {user?.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    name={user?.name || 'Usuario'}
                    size="xl"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#4B2840] flex items-center justify-center overflow-hidden">
                    <BlobatarAvatar name={user?.name || 'Audiófilo'} size={96} active={true} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#B80C09] text-white text-[10px] font-black tracking-widest uppercase border border-white/20 shadow-md">
                HI-FI PRO
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left gap-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-mono tracking-widest text-[#DCDCDD]/70 uppercase bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                  PASAPORTE AUDIÓFILO #{passportNumber}
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SISTEMA CALIBRADO
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {user?.name || 'Melómano Sonar'}
              </h2>
              <p className="text-sm font-medium text-pink-200/80">
                {user?.username ? `@${user.username.replace('@', '')}` : '@audiophile'} • Rango:{' '}
                <span className="text-white font-bold">{stats.rankTitle}</span>
              </p>

              {/* Resumen de equipamiento en miniatura */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-[#4B2840]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-[#B80C09]">album</span>
                  <span>{gearSetup.turntable || 'Technics Direct Drive'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-[#4B2840]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-cyan-300">headphones</span>
                  <span>{gearSetup.headphones || 'Sennheiser Open-Back'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Acciones y Código QR Estilizado */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:justify-between lg:items-end gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 lg:border-l border-white/10 lg:pl-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPassport}
                className="px-4 py-2.5 rounded-xl bg-white text-[#231123] hover:bg-gray-100 font-bold text-xs tracking-wide transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#B80C09]">
                  {copiedLink ? 'check_circle' : 'share'}
                </span>
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Pasaporte'}</span>
              </button>

              {onExportBackup && (
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 flex items-center justify-center cursor-pointer"
                  title="Descargar Respaldo JSON"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/60 uppercase font-mono tracking-wider block">
                Frecuencia de Muestreo
              </span>
              <span className="text-xs font-mono font-bold text-pink-300">
                192 kHz / 24-bit Hi-Res FLAC
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. CUADRÍCULA DE MÉTRICAS AUDIÓFILAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Métrica 1: Álbumes Guardados */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              En Colección
            </span>
            <span className="p-2 rounded-xl bg-red-50 dark:bg-[#B80C09]/20 text-[#B80C09]">
              <span className="material-symbols-outlined text-[20px]">collections_bookmark</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalSaved}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              Álbumes y vinilos archivados
            </p>
          </div>
        </motion.div>

        {/* Métrica 2: Promedio de Reseñas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              Veredicto Crítico
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-500">
              <span className="material-symbols-outlined text-[20px]">star</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
                {stats.avgRating}
              </span>
              <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">/ 5.0</span>
            </div>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'reseña publicada' : 'reseñas publicadas'}
            </p>
          </div>
        </motion.div>

        {/* Métrica 3: Historial y Escuchas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              Sesiones de Escucha
            </span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-[#003844]/40 text-[#003844] dark:text-teal-300">
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalHistory}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              Pistas en alta definición
            </p>
          </div>
        </motion.div>

        {/* Métrica 4: Red Musical */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              Red Acústica
            </span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalFollowing}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              Artistas y audiófilos seguidos
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. DISTRIBUCIÓN DE GÉNEROS Y AFINIDAD ACÚSTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución Espectral */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-[#B80C09]">tune</span>
              <h3 className="text-base font-bold text-[#231123] dark:text-white">
                Distribución de Afinidad Sonora
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#B80C09] dark:text-pink-300">
              Top 5 Géneros
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {stats.genreDistribution.map((item, idx) => {
              const colors = [
                'from-[#B80C09] to-[#d62828]',
                'from-[#4B2840] to-[#6a395b]',
                'from-[#003844] to-[#005f73]',
                'from-[#5c1d5e] to-[#802a83]',
                'from-amber-600 to-amber-500',
              ];
              const activeColor = colors[idx % colors.length];

              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#231123] dark:text-[#DCDCDD]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B80C09]" />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${activeColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
            Calculado en tiempo real en base a tus preferencias seleccionadas, reproducciones y colecciones guardadas.
          </p>
        </div>

        {/* Resumen de Calibración Hi-Fi */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#4B2840]/30 to-[#231123]/60 dark:from-[#35182d] dark:to-[#231123] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-teal-400">speed</span>
            <h3 className="text-base font-bold text-[#231123] dark:text-white">
              Calibración del Sistema
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">Fuente Preferida</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.favoriteFormat || 'Vinilo 180g Prensado Japonés'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">DAC / Procesador</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.dac || 'Cambridge Audio DacMagic 200M'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">Cápsula / Aguja</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.stylus || 'Ortofon 2M Blue'}
              </span>
            </div>
          </div>

          <a
            href="#audiophile_gear"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('sonar:navigate-tab', { detail: 'audiophile_gear' }));
            }}
            className="text-xs font-bold text-[#B80C09] dark:text-pink-300 hover:underline flex items-center justify-center gap-1 mt-1"
          >
            <span>Ajustar Equipamiento</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* 4. MURO DE INSIGNIAS Y LOGROS AUDIÓFILOS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-amber-500">workspace_premium</span>
            <div>
              <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                Insignias & Logros Acústicos
              </h3>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                Desbloquea hitos escuchando, reseñando y configurando tu experiencia Hi-Fi.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
            {badges.filter((b) => b.unlocked).length} de {badges.length} Desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] dark:border-white/10 shadow-xs hover:border-[#B80C09]'
                  : 'bg-gray-50/70 dark:bg-black/20 border-gray-200 dark:border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-[#B80C09] to-[#003844] text-white shadow-md'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{badge.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c435a] dark:text-pink-300/80">
                      {badge.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#231123] dark:text-white">
                      {badge.title}
                    </h4>
                  </div>
                </div>

                {badge.unlocked ? (
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Obtenido
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                    {badge.progress}%
                  </span>
                )}
              </div>

              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] line-clamp-2">
                {badge.description}
              </p>

              <div className="pt-2 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between text-[11px] font-medium">
                <span className="text-[#B80C09] dark:text-pink-300 font-bold">{badge.rewardText}</span>
                <span className="material-symbols-outlined text-[14px] text-gray-400">info</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Insignia */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/15 shadow-2xl text-[#231123] dark:text-white flex flex-col gap-5 relative"
            >
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedBadge.unlocked
                      ? 'bg-gradient-to-tr from-[#B80C09] to-[#003844] text-white shadow-xl'
                      : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">{selectedBadge.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B80C09] dark:text-pink-300">
                    {selectedBadge.category}
                  </span>
                  <h3 className="text-lg font-black">{selectedBadge.title}</h3>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedBadge.unlocked ? 'Logro Desbloqueado' : `Progreso actual: ${selectedBadge.progress}%`}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#5c435a] dark:text-[#DCDCDD] leading-relaxed">
                {selectedBadge.description}
              </p>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Recompensa Acústica</span>
                <span className="text-sm font-bold text-[#B80C09] dark:text-pink-200">
                  {selectedBadge.rewardText}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AudiophilePassportTab;
