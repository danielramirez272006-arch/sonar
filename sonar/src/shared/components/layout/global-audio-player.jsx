import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';
import { useAuth } from '../../context/auth-context';
import { useAccessibility } from '../../context/accessibility-context';
import { getTracksForAlbum, isExplicitTrack } from '../../services/deezer-service';
import { interactionsService } from '../../services/interactions-service';
import { getLyricsForTrack } from '../../services/lyrics-service';

export const GlobalAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackSpeed = 1,
    setPlaybackSpeed,
    skipSeconds,
    toggleTrack,
    playTrack,
    seek,
    closePlayer,
    openReviewModal,
    explicitLockModal,
    closeExplicitLockModal,
    unlockExplicitWithPin,
  } = usePlayer();

  const { announce, playAudioCue, speak, isSpeaking, stopSpeaking } = useAccessibility();
  const { user } = useAuth();
  const userId = user?.id || null;

  const [showTracklist, setShowTracklist] = useState(false);
  const [showPodcastNotes, setShowPodcastNotes] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [drawerTab, setDrawerTab] = useState('lyrics'); // 'lyrics' | 'info'
  const [albumTracks, setAlbumTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [lyricsData, setLyricsData] = useState(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [savedMap, setSavedMap] = useState({});
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [parentPinInput, setParentPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const isPodcast = Boolean(
    currentTrack?.isPodcast ||
    currentTrack?.type === 'podcast' ||
    currentTrack?.audioUrl?.includes('/audio/') ||
    currentTrack?.preview?.includes('/audio/') ||
    currentTrack?.album?.includes('Podcast') ||
    currentTrack?.album === 'Sesiones Sonar Podcast'
  );

  // Cargar estado de guardados
  const refreshSavedMap = () => {
    if (!userId) {
      setSavedMap({});
      return;
    }
    const saved = interactionsService.getUserSavedAlbums(userId);
    const map = {};
    saved.forEach((item) => {
      const idKey = String(item.id);
      const trackIdKey = String(item.trackId || '');
      const titleKey = item.title.toLowerCase();
      map[idKey] = true;
      if (trackIdKey) map[trackIdKey] = true;
      map[titleKey] = true;
    });
    setSavedMap(map);
  };

  useEffect(() => {
    refreshSavedMap();
    const handleCollectionChange = () => refreshSavedMap();
    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => window.removeEventListener('sonar:collection-changed', handleCollectionChange);
  }, [userId]);

  // Cargar pistas del álbum y letras al cambiar la canción
  useEffect(() => {
    if (!currentTrack) {
      setAlbumTracks([]);
      setLyricsData(null);
      setShowTracklist(false);
      return;
    }

    let isMounted = true;

    // 1. Cargar pistas del álbum
    async function loadTracks() {
      setIsLoadingTracks(true);
      try {
        const list = await getTracksForAlbum(currentTrack);
        if (isMounted) {
          setAlbumTracks(list || []);
        }
      } catch (err) {
        console.warn('Error cargando pistas del álbum:', err);
      } finally {
        if (isMounted) {
          setIsLoadingTracks(false);
        }
      }
    }

    // 2. Cargar letras de la canción desde API pública (LRCLIB / Lyrics.ovh)
    async function loadLyrics() {
      if (isPodcast) return;
      setIsLoadingLyrics(true);
      try {
        const lyrics = await getLyricsForTrack({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album,
          duration: duration || currentTrack.duration,
        });
        if (isMounted) {
          setLyricsData(lyrics);
        }
      } catch (err) {
        console.warn('Error cargando letras:', err);
      } finally {
        if (isMounted) {
          setIsLoadingLyrics(false);
        }
      }
    }

    loadTracks();
    loadLyrics();

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.title, currentTrack?.artist, currentTrack?.album, currentTrack?.id, currentTrack?.deezerId, isPodcast]);

  const getNormalizedRoute = () => {
    if (typeof window === 'undefined') return '';
    const hash = (window.location.hash || '').replace(/^#/, '').toLowerCase().split('?')[0];
    const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase().split('?')[0];
    return hash || path;
  };

  const [currentRoute, setCurrentRoute] = useState(getNormalizedRoute);

  useEffect(() => {
    const handleLocationChange = () => setCurrentRoute(getNormalizedRoute());
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (currentTrack?.title) {
      announce(`Reproduciendo ahora: ${currentTrack.title} de ${currentTrack.artist || 'Artista'}`);
    }
  }, [currentTrack?.title, currentTrack?.artist, announce]);

  const isExcludedPage = Boolean(
    currentRoute === 'login' ||
    currentRoute === 'register' ||
    currentRoute === 'forgot-password' ||
    currentRoute === 'recuperar-password' ||
    currentRoute === 'recuperar-contrasena' ||
    currentRoute === 'reset-password' ||
    currentRoute === 'album' ||
    currentRoute === 'vinyl' ||
    currentRoute === 'vinilo' ||
    currentRoute === 'vinyl-mode' ||
    currentRoute === 'tocadiscos' ||
    currentRoute === 'admin' ||
    currentRoute === 'dashboard' ||
    currentRoute === 'moderacion' ||
    currentRoute === 'usuarios' ||
    currentRoute === 'admin-reports' ||
    currentRoute === 'admin-reviews' ||
    currentRoute.startsWith('admin-catalog') ||
    currentRoute.startsWith('admin-') ||
    currentRoute.startsWith('admin/') ||
    currentRoute.startsWith('dashboard/') ||
    currentRoute.startsWith('moderacion/') ||
    currentRoute.startsWith('usuarios/')
  );

  if ((!currentTrack || isExcludedPage) && !explicitLockModal?.isOpen) return null;

  const isCurrentTrackSaved = Boolean(
    currentTrack && (
      savedMap[String(currentTrack.id)] ||
      savedMap[String(currentTrack.trackId || '')] ||
      savedMap[currentTrack.title?.toLowerCase()]
    )
  );

  const handleToggleSaveCurrent = (e) => {
    e?.stopPropagation();
    if (!currentTrack) return;
    const effectiveId = userId || 'guest_user';
    interactionsService.toggleSaveAlbum(effectiveId, currentTrack, 'Favoritos');
    refreshSavedMap();
  };

  const handleToggleSaveItem = (item, e) => {
    e?.stopPropagation();
    const effectiveId = userId || 'guest_user';
    interactionsService.toggleSaveAlbum(effectiveId, {
      ...item,
      album: currentTrack?.album || currentTrack?.title,
      artist: item.artist || currentTrack?.artist,
      cover: item.cover || currentTrack?.cover,
      type: 'track',
    }, 'Favoritos');
    refreshSavedMap();
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const defaultFallbackCover = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';

  return (
    <>
      <AnimatePresence>
        {currentTrack && !isExcludedPage && (
          <motion.div
            initial={{ y: 70, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 70, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-50 w-[calc(100%-1.5rem)] sm:w-[600px] md:w-[680px] max-w-[720px] flex flex-col gap-2.5 p-3 sm:p-4 select-none backdrop-blur-2xl transition-all duration-300"
            style={{
              backgroundColor: 'rgba(35, 17, 35, 0.94)',
              color: '#DCDCDD',
              borderRadius: '24px',
              border: '1px solid rgba(75, 40, 64, 0.7)',
              boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 25px rgba(184, 12, 9, 0.18), inset 0 1px 0 rgba(220, 220, 221, 0.12)',
            }}
          >
            {/* Barra de progreso interactiva superior con degradado oficial */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPercent = clickX / rect.width;
                seek(newPercent * duration);
              }}
              className="relative w-full h-1.5 hover:h-2 rounded-full cursor-pointer overflow-hidden transition-all duration-200 group"
              style={{ backgroundColor: 'rgba(75, 40, 64, 0.55)' }}
              title="Saltar en la pista de audio"
            >
              <div
                className="h-full rounded-full transition-all duration-100 relative"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #003844 0%, #4B2840 35%, #B80C09 80%, #ff4d4a 100%)',
                }}
              />
            </div>

            {/* Fila Principal de Controles y Metadatos */}
            <div className="flex items-center justify-between gap-2 sm:gap-3.5 px-0.5">
              {/* Portada de Vinilo + Título + Artista */}
              <div
                className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 cursor-pointer group/meta overflow-hidden pr-1"
                onClick={() => {
                  if (isPodcast) {
                    setShowPodcastNotes((prev) => !prev);
                  } else {
                    setShowTracklist((prev) => !prev);
                  }
                }}
                title={isPodcast ? 'Ver notas del episodio' : 'Ver canciones del álbum'}
              >
                {/* Carátula / Vinilo giratorio */}
                <div
                  className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 overflow-hidden shadow-lg flex items-center justify-center rounded-xl bg-[#231123] border border-[#4B2840]"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(220, 220, 221, 0.1)',
                  }}
                >
                  <img
                    src={currentTrack.cover || defaultFallbackCover}
                    alt={currentTrack.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultFallbackCover;
                    }}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'rotate-180 scale-105' : ''}`}
                  />
                  {isPlaying && !isLoading && (
                    <div className="absolute inset-0 bg-[#231123]/60 backdrop-blur-[1px] flex items-center justify-center gap-0.5">
                      <span className="w-0.5 h-3 bg-[#B80C09] animate-pulse" />
                      <span className="w-0.5 h-4 bg-[#003844] animate-bounce" />
                      <span className="w-0.5 h-2.5 bg-[#DCDCDD] animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Metadatos: Título, Artista y Badges */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-xs sm:text-sm font-bold truncate text-[#DCDCDD] group-hover/meta:text-white transition-colors">
                      {currentTrack.title}
                    </span>
                    {isExplicitTrack(currentTrack) && (
                      <span
                        className="px-1 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-[#4B2840] text-rose-300 border border-rose-500/30 shrink-0"
                        title="Contenido Explícito (Explicit Lyrics)"
                        aria-label="Contenido Explícito"
                      >
                        E
                      </span>
                    )}
                    {isPodcast ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#B80C09] text-white shadow-xs shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Podcast</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded-md text-[8px] font-extrabold uppercase tracking-wider bg-[#4B2840]/80 text-[#DCDCDD] border border-white/10 shrink-0">
                        {isLoading ? '...' : '30s'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] truncate text-[#DCDCDD]/70 font-medium">
                    {currentTrack.artist} {currentTrack.album && currentTrack.album !== currentTrack.title ? `· ${currentTrack.album}` : ''}
                  </span>
                </div>
              </div>

              {/* CONTROLES: MÚSICA VS PODCAST */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {isPodcast ? (
                  <>
                    {/* Rebobinar 15s */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => skipSeconds?.(-15)}
                      className="w-8 h-8 rounded-xl bg-[#4B2840]/60 hover:bg-[#4B2840] text-[#DCDCDD] border border-white/10 flex items-center justify-center cursor-pointer transition-colors"
                      title="Retroceder 15 segundos"
                    >
                      <span className="material-symbols-outlined text-[17px]">replay_10</span>
                    </motion.button>

                    {/* Play / Pause Principal */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => toggleTrack(currentTrack)}
                      disabled={isLoading}
                      aria-label={isPlaying ? 'Pausar Podcast' : 'Reproducir Podcast'}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shadow-[0_0_20px_rgba(184,12,9,0.45)] cursor-pointer transition-all disabled:opacity-60 border border-white/20"
                      style={{
                        background: 'linear-gradient(135deg, #B80C09 0%, #850705 100%)',
                      }}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[22px]">
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      )}
                    </motion.button>

                    {/* Adelantar 15s */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => skipSeconds?.(15)}
                      className="w-8 h-8 rounded-xl bg-[#4B2840]/60 hover:bg-[#4B2840] text-[#DCDCDD] border border-white/10 flex items-center justify-center cursor-pointer transition-colors"
                      title="Adelantar 15 segundos"
                    >
                      <span className="material-symbols-outlined text-[17px]">forward_10</span>
                    </motion.button>

                    {/* Selector de Velocidad */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        const speeds = [1, 1.25, 1.5, 2];
                        const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                        setPlaybackSpeed?.(next);
                      }}
                      className="h-8 px-2 rounded-xl bg-[#4B2840]/60 hover:bg-[#4B2840] text-[#DCDCDD] font-mono text-[10px] sm:text-xs font-black cursor-pointer border border-white/10 transition-colors flex items-center justify-center"
                      title="Cambiar velocidad de reproducción"
                    >
                      {playbackSpeed}x
                    </motion.button>

                    {/* Notas / Info del Podcast */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        playAudioCue('click');
                        setShowPodcastNotes((prev) => !prev);
                      }}
                      className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        showPodcastNotes
                          ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                          : 'bg-[#4B2840]/60 hover:bg-[#4B2840] border-white/10 text-[#DCDCDD]'
                      }`}
                      title="Notas del episodio"
                    >
                      <span className="material-symbols-outlined text-[15px]">description</span>
                      <span className="hidden md:inline">Notas</span>
                    </motion.button>

                    {/* CC / Transcripción (Dark Teal) */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        playAudioCue('toggle');
                        setShowTranscript((prev) => !prev);
                      }}
                      className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        showTranscript
                          ? 'bg-[#003844] text-white border-[#005769] shadow-[0_0_12px_rgba(0,56,68,0.5)]'
                          : 'bg-[#4B2840]/60 hover:bg-[#4B2840] border-white/10 text-[#DCDCDD]'
                      }`}
                      title="Ver Transcripción y Subtítulos Accesibles (CC)"
                    >
                      <span className="material-symbols-outlined text-[16px]">closed_caption</span>
                      <span className="hidden sm:inline">CC</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* Botón Guardar en Favoritos */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => {
                        playAudioCue('like');
                        handleToggleSaveCurrent(e);
                      }}
                      className={`w-8 h-8 rounded-xl transition-all cursor-pointer flex items-center justify-center border ${
                        isCurrentTrackSaved
                          ? 'text-[#ff4d4a] bg-[#B80C09]/20 border-rose-500/40 shadow-[0_0_10px_rgba(184,12,9,0.3)]'
                          : 'text-[#DCDCDD]/80 hover:text-[#DCDCDD] bg-[#4B2840]/60 hover:bg-[#4B2840] border-white/10'
                      }`}
                      title={isCurrentTrackSaved ? 'En tus favoritos' : 'Guardar en favoritos'}
                    >
                      <span
                        className="material-symbols-outlined text-[17px]"
                        style={{ fontVariationSettings: isCurrentTrackSaved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </motion.button>

                    {/* Botón Pistas del Álbum */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playAudioCue('click');
                        setShowTracklist((prev) => !prev);
                      }}
                      className={`h-8 px-2 sm:px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        showTracklist
                          ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                          : 'bg-[#4B2840]/60 hover:bg-[#4B2840] border-white/10 text-[#DCDCDD]'
                      }`}
                      title={showTracklist ? 'Ocultar canciones del álbum' : 'Ver canciones de este álbum'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showTracklist ? 'expand_more' : 'queue_music'}
                      </span>
                      <span className="hidden sm:inline font-semibold">
                        {albumTracks.length > 0 ? `(${albumTracks.length})` : 'Pistas'}
                      </span>
                    </motion.button>

                    {/* Botón Letras y Transcripción (CC en Dark Teal) */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        playAudioCue('toggle');
                        setShowTranscript((prev) => !prev);
                      }}
                      className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        showTranscript
                          ? 'bg-[#003844] text-white border-[#005769] shadow-[0_0_14px_rgba(0,56,68,0.5)]'
                          : 'bg-[#4B2840]/60 hover:bg-[#4B2840] border-white/10 text-[#DCDCDD]'
                      }`}
                      title="Ver Letras de la Canción y Transcripción (CC)"
                    >
                      <span className="material-symbols-outlined text-[16px]">closed_caption</span>
                      <span className="hidden sm:inline font-bold">CC</span>
                    </motion.button>

                    {/* Play / Pause Principal */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        playAudioCue('play');
                        toggleTrack(currentTrack);
                      }}
                      disabled={isLoading}
                      aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shadow-[0_0_20px_rgba(184,12,9,0.5)] cursor-pointer transition-all disabled:opacity-60 border border-white/20"
                      style={{
                        background: 'linear-gradient(135deg, #B80C09 0%, #850705 100%)',
                      }}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[22px]">
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      )}
                    </motion.button>

                    {/* Botón Criticar */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openReviewModal(currentTrack)}
                      className="h-8 px-2.5 rounded-xl bg-[#4B2840]/60 hover:bg-[#4B2840] border border-white/10 text-[#DCDCDD] text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                      title="Escribir una crítica"
                    >
                      <span className="material-symbols-outlined text-[14px] text-rose-400">rate_review</span>
                      <span className="hidden md:inline">Criticar</span>
                    </motion.button>
                  </>
                )}

                {/* Separador vertical sutil */}
                <div className="w-px h-4 bg-white/10 mx-0.5 shrink-0" />

                {/* Cerrar Reproductor */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => closePlayer()}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-[#DCDCDD]/60 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  title="Cerrar reproductor"
                >
                  <span className="material-symbols-outlined text-[17px]">close</span>
                </motion.button>
              </div>
            </div>

            {/* Sección Expandible: Notas del Podcast */}
            <AnimatePresence>
              {isPodcast && showPodcastNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full overflow-hidden flex flex-col pt-3 border-t border-white/10 gap-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">podcasts</span>
                      <span>{currentTrack.artist || 'Podcast Sonar'}</span>
                    </span>
                    {currentTrack.hosts && (
                      <span className="text-[11px] text-[#DCDCDD]/80">
                        Voces: <strong>{currentTrack.hosts}</strong>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#DCDCDD] leading-relaxed max-h-36 overflow-y-auto pr-1">
                    {currentTrack.description || 'Análisis acústico y disección sonora del episodio.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sección Expandible: Letras Oficiales & Transcripción CC (Dark Teal & Blackberry Cream) */}
            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full overflow-hidden flex flex-col pt-3 border-t border-white/10 gap-2.5 text-left"
                  role="region"
                  aria-label="Letras y transcripción accesible del audio actual"
                >
                  {/* Pestañas: Letras vs Ficha Técnica */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDrawerTab('lyrics')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                          drawerTab === 'lyrics'
                            ? 'bg-[#003844] text-white border border-[#005769] shadow-xs'
                            : 'text-[#DCDCDD]/80 hover:text-white bg-[#4B2840]/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">lyrics</span>
                        <span>Letras (Lyrics)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDrawerTab('info')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                          drawerTab === 'info'
                            ? 'bg-[#003844] text-white border border-[#005769] shadow-xs'
                            : 'text-[#DCDCDD]/80 hover:text-white bg-[#4B2840]/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">info</span>
                        <span>Ficha Técnica</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Botón Leer en Voz Alta (TTS) */}
                      <button
                        type="button"
                        onClick={() => {
                          const textToRead = drawerTab === 'lyrics' && lyricsData?.plainLyrics
                            ? `${currentTrack.title} por ${currentTrack.artist}. Letra: ${lyricsData.plainLyrics}`
                            : `${currentTrack.title} por ${currentTrack.artist}. Álbum: ${currentTrack.album || currentTrack.title}. ${currentTrack.description || ''}`;
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            speak(textToRead, currentTrack.title);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isSpeaking ? 'bg-[#B80C09] text-white animate-pulse' : 'bg-[#4B2840]/80 hover:bg-[#4B2840] text-[#DCDCDD]'
                        }`}
                        title="Escuchar en voz alta con sintetizador TTS"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {isSpeaking ? 'stop' : 'record_voice_over'}
                        </span>
                        <span>{isSpeaking ? 'Detener Voz' : 'Leer Voz'}</span>
                      </button>

                      {/* Botón Copiar */}
                      <button
                        type="button"
                        onClick={() => {
                          const text = drawerTab === 'lyrics' && lyricsData?.plainLyrics
                            ? `${currentTrack.title} - ${currentTrack.artist}\n\n${lyricsData.plainLyrics}`
                            : `${currentTrack.title} - ${currentTrack.artist}\nÁlbum: ${currentTrack.album || currentTrack.title}\n${currentTrack.description || ''}`;
                          navigator.clipboard?.writeText(text);
                          setCopiedTranscript(true);
                          announce('Letra o texto copiado al portapapeles');
                          setTimeout(() => setCopiedTranscript(false), 2500);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#4B2840]/80 hover:bg-[#4B2840] text-[#DCDCDD] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copiar texto al portapapeles"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {copiedTranscript ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedTranscript ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Contenedor del contenido */}
                  <div className="p-3.5 rounded-xl bg-[#1b0b1b]/80 border border-[#4B2840]/60 max-h-52 overflow-y-auto space-y-2.5 text-xs leading-relaxed text-[#DCDCDD]">
                    {drawerTab === 'lyrics' ? (
                      isLoadingLyrics ? (
                        <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#003844] text-cyan-300">
                          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          <span>Buscando letras oficiales en base de datos Sonar...</span>
                        </div>
                      ) : lyricsData?.instrumental ? (
                        <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-[#DCDCDD]">
                          <span className="material-symbols-outlined text-[28px] text-rose-400">music_off</span>
                          <p className="text-sm font-bold text-white">Pieza Instrumental</p>
                          <p className="text-xs text-[#DCDCDD]/80 max-w-sm">
                            {lyricsData.plainLyrics || 'Esta pista es una composición instrumental pura sin letra vocal registrada.'}
                          </p>
                        </div>
                      ) : lyricsData?.plainLyrics ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[11px] font-mono text-cyan-300 font-bold">
                            <span>{currentTrack.title} — {currentTrack.artist}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#003844] text-white font-bold">
                              {lyricsData.source}
                            </span>
                          </div>
                          <div className="whitespace-pre-line font-sans text-xs leading-relaxed text-gray-100 selection:bg-[#003844] selection:text-white">
                            {lyricsData.plainLyrics}
                          </div>
                        </div>
                      ) : (
                        <div className="py-5 text-center space-y-2.5">
                          <span className="material-symbols-outlined text-[26px] text-cyan-400/80">lyrics</span>
                          <div>
                            <p className="text-[#DCDCDD] font-bold text-xs">Letra no disponible temporalmente</p>
                            <p className="text-[11px] text-[#DCDCDD]/60 mt-0.5">
                              {isPodcast
                                ? 'Para episodios de podcast, consulta la pestaña de Ficha Técnica.'
                                : 'No se encontró transcripción abierta para esta canción.'}
                            </p>
                          </div>

                          <div className="flex items-center justify-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (!currentTrack) return;
                                setIsLoadingLyrics(true);
                                getLyricsForTrack({
                                  title: currentTrack.title,
                                  artist: currentTrack.artist,
                                  album: currentTrack.album,
                                  duration: duration || currentTrack.duration,
                                })
                                  .then((res) => setLyricsData(res))
                                  .catch(() => {})
                                  .finally(() => setIsLoadingLyrics(false));
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#003844] hover:bg-[#005769] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span className="material-symbols-outlined text-[13px]">refresh</span>
                              <span>Reintentar Búsqueda</span>
                            </button>

                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(`${currentTrack.artist} ${currentTrack.title} lyrics`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#4B2840]/80 hover:bg-[#4B2840] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                              <span>Buscar en Google</span>
                            </a>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300 font-bold">
                          <span className="px-1.5 py-0.5 rounded bg-[#003844]">00:00 - {formatTime(duration || 180)}</span>
                          <span>{currentTrack.title}</span>
                        </div>
                        <p>
                          {currentTrack.description ||
                            (isPodcast
                              ? 'Episodio curado de Sonar Podcast. Debate acústico, dinámica de mezcla y análisis de producción.'
                              : `Composición musical de ${currentTrack.artist} en el álbum "${currentTrack.album || currentTrack.title}". Grabación masterizada en alta fidelidad.`)}
                        </p>
                        {currentTrack.hosts && (
                          <p className="text-[11px] text-[#DCDCDD]/70">
                            <strong>Interlocutores / Mesa de análisis:</strong> {currentTrack.hosts}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sección Expandible: Canciones de este Álbum */}
            <AnimatePresence>
              {!isPodcast && showTracklist && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full overflow-hidden flex flex-col pt-2 border-t border-white/10"
                >
                  {/* Encabezado del Tracklist */}
                  <div className="flex items-center justify-between pb-2 text-xs font-bold text-[#DCDCDD]/80">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[16px] text-[#B80C09]">album</span>
                      <span className="truncate">
                        Álbum: <strong className="text-white">{currentTrack.album || currentTrack.title}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-rose-300 bg-[#B80C09]/20 px-2 py-0.5 rounded-md shrink-0 border border-[#B80C09]/30">
                      {albumTracks.length} {albumTracks.length === 1 ? 'Canción' : 'Canciones'}
                    </span>
                  </div>

                  {/* Lista Scrollable de Canciones */}
                  <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                    {isLoadingTracks ? (
                      <div className="py-4 flex items-center justify-center gap-2 text-xs text-[#DCDCDD]/70">
                        <div className="w-4 h-4 border-2 border-[#B80C09] border-t-transparent rounded-full animate-spin" />
                        <span>Cargando canciones del álbum...</span>
                      </div>
                    ) : albumTracks.length === 0 ? (
                      <div className="py-3 text-center text-xs text-[#DCDCDD]/60 italic">
                        No se encontraron más canciones para este álbum.
                      </div>
                    ) : (
                      albumTracks.map((track, idx) => {
                        const isCurrentSelected = currentTrack.title === track.title || currentTrack.id === track.id;
                        const isTrackPlaying = isCurrentSelected && isPlaying;
                        const isTrackSaved = Boolean(
                          savedMap[String(track.id)] ||
                          savedMap[String(track.trackId || '')] ||
                          savedMap[track.title?.toLowerCase()]
                        );

                        return (
                          <div
                            key={track.id || idx}
                            className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer group ${
                              isCurrentSelected
                                ? 'bg-[#4B2840] border border-[#B80C09]/40 text-white'
                                : 'hover:bg-[#4B2840]/50 text-[#DCDCDD]'
                            }`}
                            onClick={() => {
                              playTrack({
                                ...track,
                                album: currentTrack.album || currentTrack.title,
                                artist: track.artist || currentTrack.artist,
                                cover: track.cover || currentTrack.cover,
                              });
                            }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="w-5 text-center text-[10px] font-mono opacity-60 shrink-0">
                                {isTrackPlaying ? (
                                  <span className="material-symbols-outlined text-[14px] text-[#B80C09] animate-pulse">
                                    graphic_eq
                                  </span>
                                ) : (
                                  `${idx + 1}`
                                )}
                              </span>

                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  <span className={`text-xs font-bold truncate ${isCurrentSelected ? 'text-rose-300' : 'text-white'}`}>
                                    {track.title}
                                  </span>
                                  {isExplicitTrack(track) && (
                                    <span
                                      className="px-1 py-0.1 rounded text-[7px] font-black uppercase bg-[#4B2840] text-[#DCDCDD] border border-gray-500/40 shrink-0"
                                      title="Contenido Explícito"
                                    >
                                      E
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#DCDCDD]/60 truncate">
                                  {track.artist || currentTrack.artist}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] font-mono opacity-60 text-[#DCDCDD]/70 hidden sm:inline">
                                {formatTime(track.duration || 180)}
                              </span>

                              {/* Botón favorito */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleSaveItem(track, e)}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  isTrackSaved
                                    ? 'text-[#ff4d4a] bg-[#B80C09]/20'
                                    : 'text-[#DCDCDD]/60 hover:text-white hover:bg-white/10'
                                }`}
                                title={isTrackSaved ? 'Canción en favoritos' : 'Guardar canción en favoritos'}
                              >
                                <span
                                  className="material-symbols-outlined text-[16px]"
                                  style={{ fontVariationSettings: isTrackSaved ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                  bookmark
                                </span>
                              </button>

                              {/* Botón reproducir */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (isCurrentSelected) {
                                    toggleTrack(currentTrack);
                                  } else {
                                    playTrack({
                                      ...track,
                                      album: currentTrack.album || currentTrack.title,
                                      artist: track.artist || currentTrack.artist,
                                      cover: track.cover || currentTrack.cover,
                                    });
                                  }
                                }}
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                                  isCurrentSelected && isPlaying
                                    ? 'bg-[#B80C09] text-white shadow-xs'
                                    : 'bg-[#4B2840] hover:bg-[#B80C09] text-white'
                                }`}
                                title={isTrackPlaying ? 'Pausar' : `Reproducir ${track.title}`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isTrackPlaying ? 'pause' : 'play_arrow'}
                                </span>
                              </button>

                              {/* Botón criticar */}
                              <button
                                type="button"
                                onClick={() => {
                                  openReviewModal({
                                    id: track.id,
                                    trackId: track.id,
                                    title: track.title,
                                    album: currentTrack.album || currentTrack.title,
                                    artist: track.artist || currentTrack.artist,
                                    cover: track.cover || currentTrack.cover,
                                    type: 'track',
                                  });
                                }}
                                className="p-1 rounded-lg text-[#DCDCDD]/60 hover:text-rose-300 hover:bg-white/10 transition-colors cursor-pointer"
                                title={`Criticar ${track.title}`}
                              >
                                <span className="material-symbols-outlined text-[15px]">rate_review</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE DESBLOQUEO DE CONTROL PARENTAL */}
      <AnimatePresence>
        {explicitLockModal?.isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="parental-lock-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-md bg-[#231123] border border-[#B80C09]/40 rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-4 text-center"
              style={{
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(184, 12, 9, 0.25)',
              }}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#B80C09]/20 text-[#ff4d4a] border border-[#B80C09]/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-[30px]">lock</span>
              </div>

              <div>
                <h3 id="parental-lock-title" className="text-lg font-black text-white flex items-center justify-center gap-2">
                  <span>Contenido Explícito Bloqueado</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#4B2840] text-rose-300 border border-rose-500/40">
                    E
                  </span>
                </h3>
                <p className="text-xs text-[#DCDCDD]/80 mt-1">
                  {explicitLockModal.reason || 'Esta canción está clasificada con lenguaje explícito no apto para menores.'}
                </p>
              </div>

              {explicitLockModal.track && (
                <div className="p-3 rounded-2xl bg-[#4B2840]/60 border border-white/10 flex items-center gap-3 text-left">
                  <img
                    src={explicitLockModal.track.cover || defaultFallbackCover}
                    alt={explicitLockModal.track.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{explicitLockModal.track.title}</h4>
                    <p className="text-[11px] text-[#DCDCDD]/70 truncate">{explicitLockModal.track.artist}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#B80C09]/40 text-rose-300 border border-[#B80C09]/50">
                      Filtro Parental Sonar
                    </span>
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPinError('');
                  const res = unlockExplicitWithPin(parentPinInput);
                  if (!res.success) {
                    setPinError(res.error || 'PIN incorrecto');
                  } else {
                    setParentPinInput('');
                  }
                }}
                className="flex flex-col gap-3"
              >
                <label htmlFor="parental-pin-input" className="text-xs text-[#DCDCDD] font-medium">
                  Ingresa el PIN de 4 dígitos para autorizar la reproducción:
                </label>
                <input
                  id="parental-pin-input"
                  type="password"
                  maxLength={8}
                  autoFocus
                  placeholder="••••"
                  value={parentPinInput}
                  onChange={(e) => {
                    setParentPinInput(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-2 px-4 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-hidden focus:border-[#ff4d4a]"
                />
                {pinError && (
                  <span className="text-xs text-rose-400 font-bold" role="alert">
                    {pinError}
                  </span>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setParentPinInput('');
                      setPinError('');
                      closeExplicitLockModal();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#4B2840] hover:bg-[#4B2840]/80 text-xs font-bold text-[#DCDCDD] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#B80C09] to-[#850705] hover:brightness-110 text-xs font-black text-white shadow-md cursor-pointer transition-all"
                  >
                    Desbloquear
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAudioPlayer;

