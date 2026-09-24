import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../context/player-context';
import { useAuth } from '../../context/auth-context';
import { useAccessibility } from '../../context/accessibility-context';
import { getTracksForAlbum } from '../../services/deezer-service';
import { interactionsService } from '../../services/interactions-service';

export const GlobalAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    toggleTrack,
    playTrack,
    seek,
    closePlayer,
    openReviewModal,
  } = usePlayer();

  const { announce } = useAccessibility();
  const { user } = useAuth();
  const userId = user?.id || null;

  const [showTracklist, setShowTracklist] = useState(false);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [savedMap, setSavedMap] = useState({});

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

  // Cargar las canciones del álbum actual cuando cambie la pista
  useEffect(() => {
    if (!currentTrack) {
      setAlbumTracks([]);
      setShowTracklist(false);
      return;
    }

    let isMounted = true;
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

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.album, currentTrack?.id, currentTrack?.deezerId]);

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed bottom-5 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-[480px] md:max-w-[540px] flex flex-col gap-2.5 p-3 select-none backdrop-blur-2xl"
        style={{
          backgroundColor: '#1c0d1cee', /* Midnight Violet oscuro translúcido */
          color: '#DCDCDD',              /* Alabaster Grey */
          borderRadius: '24px',          /* Cápsula moderna */
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(184, 12, 9, 0.18)',
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
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          title="Saltar en la muestra de audio"
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
        <div className="flex items-center justify-between gap-2.5 px-0.5">
          {/* Portada + Título + Artista */}
          <div
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group/meta"
            onClick={() => setShowTracklist((prev) => !prev)}
            title="Ver canciones del álbum"
          >
            <div
              className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 overflow-hidden shadow-md flex items-center justify-center rounded-xl"
              style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              <img
                src={currentTrack.cover || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg'}
                alt={currentTrack.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
                }}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'rotate-180 scale-105' : ''}`}
              />
              {isPlaying && !isLoading && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-[#B80C09] animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-rose-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-white animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold truncate text-white group-hover/meta:text-rose-300 transition-colors">
                  {currentTrack.title}
                </span>
                <span className="px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#B80C09]/30 text-rose-300 border border-[#B80C09]/40 shrink-0">
                  {isLoading ? 'Cargando...' : '30s'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] truncate opacity-75 text-gray-300">
                {currentTrack.artist} {currentTrack.album && currentTrack.album !== currentTrack.title ? `· ${currentTrack.album}` : ''}
              </span>
            </div>
          </div>

          {/* Controles: Guardar Favorito + Selector de Canciones + Play/Pausa + Botón Criticar + Cerrar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botón Favorito / Guardar Pista o Álbum Actual */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleSaveCurrent}
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
              onClick={() => setShowTracklist((prev) => !prev)}
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

            {/* Play / Pause */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggleTrack(currentTrack)}
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
              <span className="hidden sm:inline">Criticar</span>
            </motion.button>

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

        {/* Sección Expandible: Canciones de este Álbum */}
        <AnimatePresence>
          {showTracklist && (
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

                          {/* Botón favorito / guardar canción */}
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

                          {/* Botón reproducir esta canción */}
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

                          {/* Botón criticar esta canción individualmente */}
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
