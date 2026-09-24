import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';
import { useAuth } from '../../context/auth-context';
import { useAccessibility } from '../../context/accessibility-context';
import { getTracksForAlbum } from '../../services/deezer-service';
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

  const [currentHash, setCurrentHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (currentTrack?.title) {
      announce(`Reproduciendo ahora: ${currentTrack.title} de ${currentTrack.artist || 'Artista'}`);
    }
  }, [currentTrack?.title, currentTrack?.artist, announce]);

  const isVinylPage = currentHash === '#album' || currentHash === '#vinilo' || currentHash === '#vinyl-mode';
  if (!currentTrack || isVinylPage) return null;

  const isCurrentTrackSaved = Boolean(
    savedMap[String(currentTrack.id)] ||
    savedMap[String(currentTrack.trackId || '')] ||
    savedMap[currentTrack.title?.toLowerCase()]
  );

  const handleToggleSaveCurrent = (e) => {
    e?.stopPropagation();
    const effectiveId = userId || 'guest_user';
    interactionsService.toggleSaveAlbum(effectiveId, currentTrack, 'Favoritos');
    refreshSavedMap();
  };

  const handleToggleSaveItem = (item, e) => {
    e?.stopPropagation();
    const effectiveId = userId || 'guest_user';
    interactionsService.toggleSaveAlbum(effectiveId, {
      ...item,
      album: currentTrack.album || currentTrack.title,
      artist: item.artist || currentTrack.artist,
      cover: item.cover || currentTrack.cover,
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
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed bottom-5 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-[500px] md:w-[560px] lg:w-[600px] flex flex-col gap-2.5 p-3 select-none backdrop-blur-2xl"
        style={{
          backgroundColor: '#1c0d1cf2',
          color: '#DCDCDD',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(184, 12, 9, 0.2)',
        }}
      >
        {/* Barra de progreso de audio interactiva superior */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPercent = clickX / rect.width;
            seek(newPercent * duration);
          }}
          className="relative w-full h-1.5 rounded-full cursor-pointer overflow-hidden group"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          title="Saltar en la pista de audio"
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #5c1d5e 0%, #B80C09 100%)',
            }}
          />
        </div>

        {/* Fila Principal de Controles y Metadatos */}
        <div className="flex items-center justify-between gap-3 px-1">
          {/* Portada + Título + Artista */}
          <div
            className="flex items-center gap-2.5 min-w-[130px] sm:min-w-[170px] flex-1 cursor-pointer group/meta overflow-hidden"
            onClick={() => {
              if (isPodcast) {
                setShowPodcastNotes((prev) => !prev);
              } else {
                setShowTracklist((prev) => !prev);
              }
            }}
            title={isPodcast ? 'Ver notas del episodio' : 'Ver canciones del álbum'}
          >
            {/* Vinilo / Portada del Álbum */}
            <div
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 overflow-hidden shadow-lg flex items-center justify-center rounded-xl bg-[#2e192c]"
              style={{ border: '1px solid rgba(255, 255, 255, 0.18)' }}
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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-[#B80C09] animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-rose-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-white animate-pulse" />
                </div>
              )}
            </div>

            {/* Metadatos: Título, Artista y Badge */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold truncate text-white group-hover/meta:text-rose-300 transition-colors">
                  {currentTrack.title}
                </span>
                {isPodcast ? (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Podcast</span>
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wider bg-[#B80C09]/25 text-rose-300 border border-[#B80C09]/35 shrink-0">
                    {isLoading ? '...' : '30s'}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] truncate opacity-75 text-gray-300">
                {currentTrack.artist} {currentTrack.album && currentTrack.album !== currentTrack.title ? `· ${currentTrack.album}` : ''}
              </span>
            </div>
          </div>

          {/* CONTROLES: ADAPTADOS PARA PODCAST VS MÚSICA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isPodcast ? (
              <>
                {/* Rebobinar 15 segundos */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => skipSeconds?.(-15)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Retroceder 15 segundos"
                >
                  <span className="material-symbols-outlined text-[16px]">replay_10</span>
                </motion.button>

                {/* Play / Pause */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => toggleTrack(currentTrack)}
                  disabled={isLoading}
                  aria-label={isPlaying ? 'Pausar Podcast' : 'Reproducir Podcast'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B80C09] hover:bg-[#9c0a07] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[19px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  )}
                </motion.button>

                {/* Adelantar 15 segundos */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => skipSeconds?.(15)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Adelantar 15 segundos"
                >
                  <span className="material-symbols-outlined text-[16px]">forward_10</span>
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
                  className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] sm:text-xs font-black cursor-pointer border border-white/10 transition-colors"
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
                  className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    showPodcastNotes
                      ? 'bg-[#B80C09] text-white border-[#B80C09]'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  title="Notas del episodio"
                >
                  <span className="material-symbols-outlined text-[14px]">description</span>
                  <span className="hidden md:inline">Notas</span>
                </motion.button>

                {/* Subtítulos / Transcripción Accesible CC */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    playAudioCue('toggle');
                    setShowTranscript((prev) => !prev);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                    showTranscript
                      ? 'bg-amber-500 text-black border-amber-400 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-amber-300'
                  }`}
                  title="Ver Transcripción y Subtítulos Accesibles (CC)"
                >
                  <span className="material-symbols-outlined text-[15px]">closed_caption</span>
                  <span className="hidden md:inline">CC</span>
                </motion.button>
              </>
            ) : (
              <>
                {/* Botón Favorito */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    playAudioCue('like');
                    handleToggleSaveCurrent(e);
                  }}
                  className={`p-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                    isCurrentTrackSaved
                      ? 'text-[#B80C09] bg-[#B80C09]/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={isCurrentTrackSaved ? 'En tus favoritos' : 'Guardar en favoritos'}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: isCurrentTrackSaved ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                </motion.button>

                {/* Botón Selector de Canciones del Álbum */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playAudioCue('click');
                    setShowTracklist((prev) => !prev);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    showTracklist
                      ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  title={showTracklist ? 'Ocultar canciones del álbum' : 'Ver canciones de este álbum'}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {showTracklist ? 'expand_more' : 'queue_music'}
                  </span>
                  <span className="hidden sm:inline">
                    Canciones {albumTracks.length > 0 ? `(${albumTracks.length})` : ''}
                  </span>
                </motion.button>

                {/* Botón Letras y Transcripción Accesible (CC / Lyrics) */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    playAudioCue('toggle');
                    setShowTranscript((prev) => !prev);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                    showTranscript
                      ? 'bg-amber-500 text-black border-amber-400 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-amber-300'
                  }`}
                  title="Ver Letras de la Canción y Transcripción (CC)"
                >
                  <span className="material-symbols-outlined text-[15px]">closed_caption</span>
                  <span className="hidden sm:inline">CC</span>
                </motion.button>

                {/* Play / Pause */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    playAudioCue('play');
                    toggleTrack(currentTrack);
                  }}
                  disabled={isLoading}
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B80C09] hover:bg-[#9c0a07] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[19px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  )}
                </motion.button>

                {/* Botón Criticar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openReviewModal(currentTrack)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Escribir una crítica"
                >
                  <span className="material-symbols-outlined text-[13px] text-rose-400">rate_review</span>
                  <span className="hidden md:inline">Criticar</span>
                </motion.button>
              </>
            )}

            {/* Cerrar Reproductor */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => closePlayer()}
              className="w-7 h-7 rounded-full text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              title="Cerrar reproductor"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
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
                  <span className="text-[11px] text-gray-300">
                    Voces: <strong>{currentTrack.hosts}</strong>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-200 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {currentTrack.description || 'Análisis acústico y disección sonora del episodio.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sección Expandible: Letras Oficiales (Lyrics API) y Transcripción Accesible (CC) */}
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
              {/* Encabezado con pestañas: Letras vs Ficha Técnica */}
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawerTab('lyrics')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                      drawerTab === 'lyrics'
                        ? 'bg-amber-400 text-black font-black shadow-xs'
                        : 'text-gray-300 hover:text-white bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">lyrics</span>
                    <span>Letras (Lyrics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDrawerTab('info')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                      drawerTab === 'info'
                        ? 'bg-amber-400 text-black font-black shadow-xs'
                        : 'text-gray-300 hover:text-white bg-white/5'
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
                      isSpeaking ? 'bg-[#B80C09] text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
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
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
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
              <div className="p-3.5 rounded-xl bg-black/45 border border-white/5 max-h-52 overflow-y-auto space-y-2.5 text-xs leading-relaxed text-gray-200">
                {drawerTab === 'lyrics' ? (
                  isLoadingLyrics ? (
                    <div className="py-6 flex items-center justify-center gap-2 text-xs text-amber-300">
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>Buscando letras oficiales en LRCLIB API...</span>
                    </div>
                  ) : lyricsData?.plainLyrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[11px] font-mono text-amber-300/90 font-bold">
                        <span>{currentTrack.title} — {currentTrack.artist}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          {lyricsData.source}
                        </span>
                      </div>
                      <div className="whitespace-pre-line font-sans text-xs leading-relaxed text-gray-100 selection:bg-amber-500 selection:text-black">
                        {lyricsData.plainLyrics}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center space-y-1">
                      <p className="text-gray-300 font-semibold">No se encontró letra registrada para esta canción.</p>
                      <p className="text-[11px] text-gray-400">
                        {isPodcast
                          ? 'Para episodios de podcast, consulta la pestaña de Ficha Técnica.'
                          : 'Puedes escuchar la muestra de audio en alta fidelidad.'}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300/90 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20">00:00 - {formatTime(duration || 180)}</span>
                      <span>{currentTrack.title}</span>
                    </div>
                    <p>
                      {currentTrack.description ||
                        (isPodcast
                          ? 'Episodio curado de Sonar Podcast. Debate acústico, dinámica de mezcla y análisis de producción.'
                          : `Composición musical de ${currentTrack.artist} en el álbum "${currentTrack.album || currentTrack.title}". Grabación masterizada en alta fidelidad.`)}
                    </p>
                    {currentTrack.hosts && (
                      <p className="text-[11px] text-gray-400">
                        <strong>Interlocutores / Mesa de análisis:</strong> {currentTrack.hosts}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sección Expandible: Canciones de este Álbum (solo música) */}
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
              <div className="flex items-center justify-between pb-2 text-xs font-bold text-gray-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[16px] text-[#B80C09]">album</span>
                  <span className="truncate">
                    Álbum: <strong className="text-white">{currentTrack.album || currentTrack.title}</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-300 bg-[#B80C09]/20 px-2 py-0.5 rounded-md shrink-0">
                  {albumTracks.length} {albumTracks.length === 1 ? 'Canción' : 'Canciones'}
                </span>
              </div>

              {/* Lista Scrollable de Canciones */}
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                {isLoadingTracks ? (
                  <div className="py-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 border-2 border-[#B80C09] border-t-transparent rounded-full animate-spin" />
                    <span>Cargando canciones del álbum...</span>
                  </div>
                ) : albumTracks.length === 0 ? (
                  <div className="py-3 text-center text-xs text-gray-400 italic">
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
                            ? 'bg-white/15 border border-[#B80C09]/40 text-white'
                            : 'hover:bg-white/10 text-gray-200'
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
                            <span className={`text-xs font-bold truncate ${isCurrentSelected ? 'text-rose-300' : 'text-white'}`}>
                              {track.title}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate">
                              {track.artist || currentTrack.artist}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] font-mono opacity-60 text-gray-400 hidden sm:inline">
                            {formatTime(track.duration || 180)}
                          </span>

                          {/* Botón favorito */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleSaveItem(track, e)}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              isTrackSaved
                                ? 'text-[#B80C09] bg-[#B80C09]/15'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
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
                                : 'bg-white/10 hover:bg-[#B80C09] text-white'
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
                            className="p-1 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-white/10 transition-colors cursor-pointer"
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
    </AnimatePresence>
  );
};

export default GlobalAudioPlayer;
