import { useUIText } from '../../../shared/i18n/use-ui-text.js';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';
import { avatarPropsFor } from '../../../shared/components/ui/avatar-props';
import { useLanguage } from '../../../shared/context/language-context';
import AudiophileMonthlyWrapped from './audiophile-monthly-wrapped';
import AudiophileQuests from './audiophile-quests';

const buildPassportPdf = (passport) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext('2d');
  const palette = {
    violet: '#231123',
    berry: '#4B2840',
    teal: '#003844',
    red: '#B80C09',
    paper: '#F7F3F6',
    muted: '#C8B9C6',
  };
  const roundedRect = (x, y, width, height, radius, fill, stroke) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  const fitText = (value, x, y, maxWidth, size, color, weight = 500) => {
    let fontSize = size;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color;
    ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    while (ctx.measureText(String(value)).width > maxWidth && fontSize > 16) {
      fontSize -= 1;
      ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    }
    ctx.fillText(String(value), x, y, maxWidth);
  };

  const background = ctx.createLinearGradient(70, 70, 1170, 1680);
  background.addColorStop(0, palette.berry);
  background.addColorStop(0.48, palette.violet);
  background.addColorStop(1, palette.teal);
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  roundedRect(48, 48, 1144, 1658, 54, background);

  const glow = ctx.createRadialGradient(1040, 130, 10, 1040, 130, 510);
  glow.addColorStop(0, 'rgba(184, 12, 9, 0.3)');
  glow.addColorStop(1, 'rgba(184, 12, 9, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(550, 48, 642, 570);
  ctx.strokeStyle = 'rgba(220, 220, 221, 0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(68, 68, 1104, 1618, 42);
  ctx.stroke();

  ctx.fillStyle = palette.red;
  ctx.beginPath();
  ctx.arc(125, 142, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.paper;
  ctx.font = '900 27px "Segoe UI", Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', 115, 143);
  fitText('SONAR', 170, 153, 300, 44, palette.paper, 900);
  fitText(passport.labels.title.toUpperCase(), 170, 191, 650, 20, palette.muted, 700);
  roundedRect(850, 112, 270, 58, 28, 'rgba(0, 56, 68, 0.52)', 'rgba(220, 220, 221, 0.22)');
  ctx.fillStyle = '#83D1D8';
  ctx.beginPath();
  ctx.arc(884, 141, 7, 0, Math.PI * 2);
  ctx.fill();
  fitText(passport.labels.calibrated, 905, 149, 190, 17, palette.paper, 700);

  roundedRect(100, 244, 430, 52, 26, 'rgba(35, 17, 35, 0.5)', 'rgba(220, 220, 221, 0.18)');
  fitText(passport.id, 126, 278, 380, 19, '#E9C7DE', 700);
  fitText(passport.name, 100, 396, 1020, 70, palette.paper, 800);
  fitText(passport.username, 104, 442, 900, 27, palette.muted, 500);
  fitText(passport.labels.rank.toUpperCase(), 104, 526, 900, 17, '#83D1D8', 700);
  fitText(passport.rank, 100, 579, 1020, 40, palette.paper, 700);

  const metrics = [
    [passport.labels.saved, passport.saved],
    [passport.labels.reviews, passport.reviews],
    [passport.labels.sessions, passport.sessions],
    [passport.labels.following, passport.following],
  ];
  metrics.forEach(([label, value], index) => {
    const x = 100 + index * 270;
    roundedRect(x, 650, 248, 178, 25, 'rgba(247, 243, 246, 0.075)', 'rgba(220, 220, 221, 0.16)');
    fitText(label.toUpperCase(), x + 20, 699, 208, 15, palette.muted, 700);
    fitText(value, x + 20, 770, 208, 52, palette.paper, 800);
  });

  fitText(passport.labels.affinity.toUpperCase(), 100, 923, 1040, 25, palette.paper, 800);
  fitText(passport.labels.topGenres, 100, 958, 1040, 17, palette.muted, 500);
  passport.genres.forEach((genre, index) => {
    const y = 1020 + index * 91;
    fitText(genre.name, 104, y, 690, 21, palette.paper, 600);
    fitText(`${genre.percentage}%`, 1050, y, 82, 18, '#E9C7DE', 700);
    roundedRect(104, y + 20, 1028, 13, 7, 'rgba(247, 243, 246, 0.15)');
    const bar = ctx.createLinearGradient(104, 0, 1132, 0);
    bar.addColorStop(0, palette.red);
    bar.addColorStop(1, '#52A2B0');
    roundedRect(104, y + 20, Math.max(12, 1028 * genre.percentage / 100), 13, 7, bar);
  });

  fitText(passport.labels.setup.toUpperCase(), 100, 1518, 1040, 18, palette.muted, 700);
  const setup = [
    [passport.labels.source, passport.turntable],
    [passport.labels.headphones, passport.headphones],
    [passport.labels.dac, passport.dac],
  ];
  setup.forEach(([label, value], index) => {
    const x = 100 + index * 350;
    roundedRect(x, 1542, 326, 88, 18, 'rgba(35, 17, 35, 0.42)', 'rgba(220, 220, 221, 0.15)');
    fitText(label, x + 18, 1573, 290, 14, '#83D1D8', 700);
    fitText(value, x + 18, 1606, 290, 18, palette.paper, 600);
  });
  fitText(`SONAR  •  ${passport.labels.sampling}: 192 kHz / 24-bit Hi-Res FLAC`, 100, 1661, 1040, 15, palette.muted, 500);

  const jpegBase64 = canvas.toDataURL('image/jpeg', 0.96).split(',')[1];
  const jpegBinary = atob(jpegBase64);
  const jpegBytes = Uint8Array.from(jpegBinary, (char) => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const toBytes = (value) => encoder.encode(value);
  const pageStream = 'q 595 0 0 842 0 0 cm /Im0 Do Q\n';
  const imageStream = [
    toBytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`),
    jpegBytes,
    toBytes('\nendstream\nendobj\n'),
  ];
  const objects = [
    toBytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'),
    toBytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'),
    toBytes('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n'),
    imageStream,
    toBytes(`5 0 obj\n<< /Length ${pageStream.length} >>\nstream\n${pageStream}endstream\nendobj\n`),
  ];
  const chunks = [toBytes('%PDF-1.4\n')];
  const offsets = [0];
  let byteLength = chunks[0].length;
  objects.forEach((object) => {
    offsets.push(byteLength);
    const objectChunks = Array.isArray(object) ? object : [object];
    chunks.push(...objectChunks);
    byteLength += objectChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  });
  const xrefOffset = byteLength;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(toBytes(xref));
  return new Blob(chunks, { type: 'application/pdf' });
};

export const AudiophilePassportTab = ({
  user,
  savedAlbums = [],
  userReviews = [],
  recentlyPlayed = [],
  followedArtists = [],
  followedUsers = [],
  gearSetup = {},
}) => {
  const ui = useUIText();
  const { t } = useLanguage();
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
    let rankTitle = t('passport.rank_novice', 'Melómano Iniciado');
    let rankColor = '#003844';
    if (userReviews.length >= 10 || savedAlbums.length >= 20) {
      rankTitle = t('passport.rank_master', 'Maestro de la Frecuencia');
      rankColor = '#B80C09';
    } else if (userReviews.length >= 4 || savedAlbums.length >= 8) {
      rankTitle = t('passport.rank_advanced', 'Curador Hi-Fi Avanzado');
      rankColor = '#4B2840';
    } else if (userReviews.length >= 1 || savedAlbums.length >= 3) {
      rankTitle = t('passport.rank_novice', 'Melómano Iniciado');
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
  }, [user, userReviews, savedAlbums, recentlyPlayed, followedArtists, followedUsers, t]);

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

  const handleDownloadPassport = () => {
    const blob = buildPassportPdf({
      id: passportNumber,
      name: user?.name || 'Melomano Sonar',
      username: user?.username ? `@${user.username.replace('@', '')}` : '@audiophile',
      rank: stats.rankTitle,
      labels: {
        title: t('passport.title', 'Pasaporte Audiófilo'),
        calibrated: t('passport.system_calibrated', 'Sistema calibrado'),
        rank: t('passport.rank_label', 'Rango audiófilo'),
        saved: t('passport.stat_in_collection', 'En colección'),
        reviews: t('passport.stat_critical_verdict', 'Veredicto crítico'),
        sessions: t('passport.stat_listening_sessions', 'Sesiones de escucha'),
        following: t('passport.stat_acoustic_network', 'Red acústica'),
        affinity: t('passport.affinity_distribution', 'Distribución de afinidad sonora'),
        topGenres: t('passport.top_5_genres', 'Top 5 géneros'),
        setup: t('passport.system_calibration', 'Calibración del sistema'),
        source: t('passport.preferred_source', 'Fuente preferida'),
        headphones: t('passport.headphones', 'Audífonos'),
        dac: t('passport.dac_processor', 'DAC / Procesador'),
        sampling: t('passport.sampling_rate', 'Frecuencia de muestreo'),
      },
      saved: stats.totalSaved,
      reviews: stats.totalReviews,
      sessions: stats.totalHistory,
      following: stats.totalFollowing,
      rating: stats.avgRating,
      genres: stats.genreDistribution,
      turntable: gearSetup.turntable || 'Technics Direct Drive',
      headphones: gearSetup.headphones || 'Sennheiser Open-Back',
      dac: gearSetup.dac || gearSetup.amplifier || 'Not configured',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = (user?.username || user?.name || 'audiophile')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'audiophile';
    link.href = url;
    link.download = `sonar-pasaporte-${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
                {/* Avatar decide solo: foto si la hay, si no el blobatar con el
                    seed y el color del usuario. Antes eran dos ramas y median
                    72px y 96px, y solo una respetaba la configuracion.
                    Sin gaze a proposito: con los ojos siguiendo al puntero la
                    cara se ve distinta a la del perfil de arriba. */}
                <Avatar
                  {...avatarPropsFor(user)}
                  size="2xl"
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#B80C09] text-white text-[10px] font-black tracking-widest uppercase border border-white/20 shadow-md">
                HI-FI PRO
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left gap-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-mono tracking-widest text-[#DCDCDD]/70 uppercase bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                  {t('passport.title', 'PASAPORTE AUDIÓFILO')} #{passportNumber}
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('passport.system_calibrated', 'SISTEMA CALIBRADO')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {user?.name || t('passport.melomane_sonar', 'Melómano Sonar')}
              </h2>
              <p className="text-sm font-medium text-pink-200/80">
                {user?.username ? `@${user.username.replace('@', '')}` : '@audiophile'} {ui("• Rango:")}{' '}
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
                <span>{copiedLink ? t('passport.link_copied', '¡Enlace Copiado!') : t('passport.share_passport', 'Compartir Pasaporte')}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPassport}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 flex items-center justify-center cursor-pointer"
                title={ui("Descargar Pasaporte PDF")}
                aria-label={ui("Descargar Pasaporte PDF")}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/60 uppercase font-mono tracking-wider block">
                {t('passport.sampling_rate', 'Frecuencia de Muestreo')}
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
              {t('passport.stat_in_collection', 'EN COLECCIÓN')}
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
              {t('passport.stat_in_collection_sub', 'Álbumes y vinilos archivados')}
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
              {t('passport.stat_critical_verdict', 'VEREDICTO CRÍTICO')}
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
              {stats.totalReviews} {t('passport.stat_critical_verdict_sub', 'reseñas publicadas')}
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
              {t('passport.stat_listening_sessions', 'SESIONES DE ESCUCHA')}
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
              {t('passport.stat_listening_sessions_sub', 'Pistas en alta definición')}
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
              {t('passport.stat_acoustic_network', 'RED ACÚSTICA')}
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
              {t('passport.stat_acoustic_network_sub', 'Artistas y audiófilos seguidos')}
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
                {t('passport.affinity_distribution', 'Distribución de Afinidad Sonora')}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#B80C09] dark:text-pink-300">
              {t('passport.top_5_genres', 'Top 5 Géneros')}
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
            {t('passport.realtime_calc_desc', 'Calculado en tiempo real en base a tus preferencias seleccionadas, reproducciones y colecciones guardadas.')}
          </p>
        </div>

        {/* Resumen de Calibración Hi-Fi */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#4B2840]/30 to-[#231123]/60 dark:from-[#35182d] dark:to-[#231123] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-teal-400">speed</span>
            <h3 className="text-base font-bold text-[#231123] dark:text-white">
              {t('passport.system_calibration', 'Calibración del Sistema')}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.preferred_source', 'Fuente Preferida')}</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.favoriteFormat || 'Vinilo 180g Prensado Japonés'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.dac_processor', 'DAC / Procesador')}</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.dac || 'Cambridge Audio DacMagic 200M'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.cartridge_needle', 'Cápsula / Aguja')}</span>
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
            <span>{t('passport.adjust_equipment', 'Ajustar Equipamiento')}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* 4. REPORTE MENSUAL & WRAPPED */}
      <AudiophileMonthlyWrapped
        user={user}
        savedCount={savedAlbums.length}
        historyCount={recentlyPlayed.length}
        reviewsCount={userReviews.length}
      />

      {/* 5. MISIONES Y DESAFÍOS SEMANALES */}
      <AudiophileQuests />

      {/* 6. MURO DE INSIGNIAS Y LOGROS AUDIÓFILOS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-amber-500">workspace_premium</span>
            <div>
              <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                {t('passport.badges_title', 'Insignias & Logros Acústicos')}
              </h3>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                {t('passport.badges_subtitle', 'Desbloquea hitos escuchando, reseñando y configurando tu experiencia Hi-Fi.')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
            {badges.filter((b) => b.unlocked).length} / {badges.length} {t('passport.badges_unlocked_count', 'Desbloqueados')}
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
                      {t(`passport.badges.${badge.id}.category`, { defaultValue: badge.category })}
                    </span>
                    <h4 className="text-sm font-bold text-[#231123] dark:text-white">
                      {t(`passport.badges.${badge.id}.title`, { defaultValue: badge.title })}
                    </h4>
                  </div>
                </div>

                {badge.unlocked ? (
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">{ui("Obtenido")}</span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                    {badge.progress}%
                  </span>
                )}
              </div>

              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] line-clamp-2">
                {t(`passport.badges.${badge.id}.description`, { defaultValue: badge.description })}
              </p>

              <div className="pt-2 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between text-[11px] font-medium">
                <span className="text-[#B80C09] dark:text-pink-300 font-bold">{t(`passport.badges.${badge.id}.reward`, { defaultValue: badge.rewardText })}</span>
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
                    {t(`passport.badges.${selectedBadge.id}.category`, { defaultValue: selectedBadge.category })}
                  </span>
                  <h3 className="text-lg font-black">{t(`passport.badges.${selectedBadge.id}.title`, { defaultValue: selectedBadge.title })}</h3>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedBadge.unlocked ? ui("Logro Desbloqueado") : ui("Progreso actual: {{value0}}%", { value0: selectedBadge.progress })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#5c435a] dark:text-[#DCDCDD] leading-relaxed">
                {t(`passport.badges.${selectedBadge.id}.description`, { defaultValue: selectedBadge.description })}
              </p>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase">{ui("Recompensa Acústica")}</span>
                <span className="text-sm font-bold text-[#B80C09] dark:text-pink-200">
                  {t(`passport.badges.${selectedBadge.id}.reward`, { defaultValue: selectedBadge.rewardText })}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >{ui("Entendido")}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AudiophilePassportTab;
