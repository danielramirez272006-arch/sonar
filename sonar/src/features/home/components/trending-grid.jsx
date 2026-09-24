import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_DEEZER_ALBUMS } from '../../../shared/services/deezer-service';
import { CATALOG_RECOMMENDATIONS } from '../../../shared/services/recommendations-service';
import { usePlayer } from '../../../shared/context/player-context';
import { useAuth } from '../../../shared/context/auth-context';
import { interactionsService } from '../../../shared/services/interactions-service';
import Toast from '../../../shared/components/ui/toast';

export const TrendingGrid = () => {
  const { user } = useAuth() || {};
  const [activeTab, setActiveTab] = useState(() => (user ? 'for-you' : 'week'));
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'trending' | 'year'
  const [toastMessage, setToastMessage] = useState(null);

  const [savedMap, setSavedMap] = useState(() => {
    const effectiveUserId = user?.id || 'guest_user';
    const list = interactionsService.getUserSavedAlbums(effectiveUserId);
    const map = {};
    list.forEach((item) => {
      if (item.id) map[String(item.id)] = true;
      if (item.deezerId) map[String(item.deezerId)] = true;
      if (item.title) map[item.title.toLowerCase()] = true;
    });
    return map;
  });

  const { playTrack, currentTrack, isPlaying, toggleTrack, openReviewModal } = usePlayer();

  const userPreferences = useMemo(() => {
    return user?.preferences || ['Art Rock', 'Electrónica'];
  }, [user]);

  const updateSavedMap = () => {
    const effectiveUserId = user?.id || 'guest_user';
    const list = interactionsService.getUserSavedAlbums(effectiveUserId);
    const map = {};
    list.forEach((item) => {
      if (item.id) map[String(item.id)] = true;
      if (item.deezerId) map[String(item.deezerId)] = true;
      if (item.title) map[item.title.toLowerCase()] = true;
    });
    setSavedMap(map);
  };

  useEffect(() => {
    updateSavedMap();
    window.addEventListener('sonar:collection-changed', updateSavedMap);
    return () => window.removeEventListener('sonar:collection-changed', updateSavedMap);
  }, [user?.id]);

  const checkIsSaved = (album) => {
    if (!album) return false;
    const albumTitle = String(album.title || '').trim().toLowerCase();
    const albumId = String(album.id || album.deezerId || '').trim();
    if (savedMap[albumId] || savedMap[albumTitle]) return true;
    return interactionsService.isAlbumSaved(user?.id, album);
  };

  const tabs = useMemo(() => {
    const list = [
      { id: 'for-you', label: 'Para ti' },
      { id: 'week', label: 'Esta semana' },
      { id: 'acclaimed', label: 'Más aclamados' },
      { id: 'news', label: 'Novedades' },
      { id: 'classics', label: 'Clásicos' },
    ];
    return list;
  }, []);

  const handleCreateAccount = () => {
    if (user) {
      window.location.hash = '#usuario';
    } else {
      window.location.hash = '#register';
    }
  };

  const handleExploreCatalog = () => {
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInput.focus();
      }, 500);
    } else {
      window.location.hash = '#explore';
      setTimeout(() => {
        const input = document.getElementById('main-search-input');
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input?.focus();
      }, 100);
    }
  };

  const handlePlayAlbum = (album) => {
    toggleTrack({
      id: album.id,
      deezerId: album.deezerId || album.id,
      title: album.topTrack?.title || album.title,
      artist: album.artist,
      album: album.title,
      cover: album.cover || album.cover_medium,
      preview: album.topTrack?.preview,
    });
  };

  const handleToggleBookmark = (album, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const effectiveUserId = user?.id || 'guest_user';
    const res = interactionsService.toggleSaveAlbum(effectiveUserId, {
      id: album.id,
      deezerId: album.deezerId || album.id,
      title: album.title,
      artist: album.artist,
      cover: album.cover || album.cover_medium,
      genre: album.genre,
      year: album.year,
      rating: album.rating,
      type: 'album',
    });

    const albumTitle = String(album.title || '').trim().toLowerCase();
    const albumId = String(album.id || album.deezerId || '').trim();
    setSavedMap((prev) => {
      const next = { ...prev };
      if (res.isSaved) {
        if (albumId) next[albumId] = true;
        if (albumTitle) next[albumTitle] = true;
      } else {
        if (albumId) delete next[albumId];
        if (albumTitle) delete next[albumTitle];
      }
      return next;
    });

    setToastMessage(res.isSaved ? `"${album.title}" guardado en tu colección` : `"${album.title}" eliminado de tu colección`);
  };

  // Filtrado y Ordenamiento inteligente según preferencias de usuario
  const processedAlbums = useMemo(() => {
    let list = [];

    if (activeTab === 'for-you') {
      // Combinar catálogo y recomendaciones personalizadas
      const allPool = [...DEFAULT_DEEZER_ALBUMS, ...CATALOG_RECOMMENDATIONS.map(r => ({
        id: r.deezerId || r.id,
        deezerId: r.deezerId,
        title: r.title,
        artist: r.artist,
        year: r.year,
        genre: r.genre,
        rating: r.rating,
        cover: r.cover,
      }))];

      // Eliminar duplicados por título
      const uniqueMap = new Map();
      allPool.forEach(item => {
        if (!uniqueMap.has(item.title)) uniqueMap.set(item.title, item);
      });
      const uniqueList = Array.from(uniqueMap.values());

      // Ponderar por preferencias del usuario
      list = uniqueList.map(album => {
        const match = userPreferences.some(
          pref => pref.toLowerCase() === album.genre.toLowerCase() || album.genre.toLowerCase().includes(pref.toLowerCase())
        );
        const affinity = match ? 95 + Math.round((album.rating || 4.5) * 0.9) : 75 + Math.round((album.rating || 4.5) * 1.5);
        return {
          ...album,
          isUserMatch: match,
          affinityPercentage: Math.min(99, affinity),
        };
      });

      // Ordenar: primero los que coinciden con las preferencias, luego por afinidad
      list.sort((a, b) => {
        if (a.isUserMatch && !b.isUserMatch) return -1;
        if (!a.isUserMatch && b.isUserMatch) return 1;
        return b.affinityPercentage - a.affinityPercentage;
      });
    } else {
      list = DEFAULT_DEEZER_ALBUMS.map(album => {
        const match = userPreferences.some(
          pref => pref.toLowerCase() === album.genre.toLowerCase() || album.genre.toLowerCase().includes(pref.toLowerCase())
        );
        return {
          ...album,
          isUserMatch: match,
          affinityPercentage: match ? 95 : 80,
        };
      });

      if (activeTab === 'acclaimed') {
        list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else if (activeTab === 'news') {
        list.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));
      } else if (activeTab === 'classics') {
        list = list.filter((a) => parseInt(a.year, 10) < 2010);
      }
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'year') {
      list.sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));
    }

    return list.slice(0, 8);
  }, [activeTab, sortBy, userPreferences]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-16 bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="max-w-[1380px] mx-auto flex flex-col gap-8">
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-[#5c1d5e] dark:text-pink-300 font-extrabold">
              RADAR MUSICAL · EXPLORACIÓN
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#231123] dark:text-[#FAF5F8] font-extrabold">
              Canciones en Tendencia
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="inline-flex items-center p-1 rounded-full bg-[#ede0eb] dark:bg-[#1f1020] border border-[#e2cedf] dark:border-white/10 gap-1 shadow-inner transition-colors">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      borderRadius: '9999px',
                      border: 'none',
                      background: 'transparent',
                      minHeight: 'auto',
                      outline: 'none',
                    }}
                    className={`relative px-3.5 sm:px-4 py-1.5 !rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer select-none z-10 !border-0 !bg-transparent !shadow-none ${
                      isActive
                        ? 'text-white'
                        : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
                    }`}
                    type="button"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-trending-pill"
                        className="absolute inset-0 bg-[#B80C09] rounded-full shadow-[0_2px_10px_rgba(184,12,9,0.4)]"
                        style={{ borderRadius: 9999 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selector de Orden y Modo de Vista */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-xs font-bold text-[#231123] dark:text-gray-200 cursor-pointer shadow-xs focus:outline-none"
              >
                <option value="rating">⭐ Calificación</option>
                <option value="trending">🔥 Popularidad</option>
                <option value="year">📅 Año</option>
              </select>

              <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#B80C09] text-white' : 'text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09]'
                  }`}
                  title="Vista Cuadrícula"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#B80C09] text-white' : 'text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09]'
                  }`}
                  title="Vista Lista"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualización de Álbumes (Grid o Lista) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processedAlbums.map((album) => {
              const isSaved = checkIsSaved(album);
              const isItemPlaying = (currentTrack?.id === album.id || currentTrack?.album === album.title) && isPlaying;
              return (
                <motion.div
                  key={album.id || album.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] hover:shadow-md dark:hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.6)] hover:border-[#B80C09]/40 transition-all duration-300 relative"
                >
                  {/* Album Image & Actions */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f8e9f6] dark:bg-[#231123] mb-3 shadow-xs">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={album.title}
                      src={album.cover}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    {/* Botón Guardar en esquina superior con prioridad de click z-30 */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(album, e)}
                      aria-label="Guardar álbum"
                      className={`absolute top-2.5 right-2.5 z-30 pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isSaved
                          ? 'bg-[#B80C09] text-white shadow-[#B80C09]/50'
                          : 'bg-black/60 text-white hover:bg-[#B80C09] hover:scale-110'
                      }`}
                      title={isSaved ? 'Quitar de tu colección' : 'Guardar en tu colección'}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {isSaved ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>

                    {/* Overlay de hover con pointer-events-none para no bloquear el botón superior */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <button
                        onClick={() => openReviewModal(album)}
                        className="pointer-events-auto px-3 py-1.5 rounded-lg bg-white/20 hover:bg-[#B80C09] text-white text-xs uppercase font-bold flex items-center gap-1 shadow-md backdrop-blur-md transition-colors cursor-pointer"
                        type="button"
                        title="Escribir crítica"
                      >
                        <span className="material-symbols-outlined text-[16px]">rate_review</span>
                        <span>Criticar</span>
                      </button>
                      <button
                        onClick={() => handlePlayAlbum(album)}
                        aria-label={`Reproducir muestra de ${album.title}`}
                        title={isItemPlaying ? 'Pausar' : 'Escuchar muestra de 30s'}
                        className={`pointer-events-auto w-9 h-9 rounded-full ${
                          isItemPlaying ? 'bg-[#B80C09] text-white' : 'bg-white text-[#231123]'
                        } flex items-center justify-center hover:scale-110 transition-transform shadow-md cursor-pointer`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isItemPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Título & Calificación */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-base text-[#231123] dark:text-[#FAF5F8] font-bold truncate">
                      {album.title}
                    </span>
                    <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-bold shrink-0">
                      <span
                        className="material-symbols-outlined text-[13px] text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span>{album.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] font-medium truncate">
                    {album.artist}
                  </p>

                  <div className="flex items-center justify-between text-[#81737e] dark:text-[#B89CB0] text-xs mt-2 pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                    <span>{album.year}</span>
                    <span className="text-[#4B2840] dark:text-pink-300 font-semibold">{album.genre}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Modo Lista Detallada */
          <div className="flex flex-col gap-3">
            {processedAlbums.map((album, idx) => {
              const isSaved = checkIsSaved(album);
              const isItemPlaying = (currentTrack?.id === album.id || currentTrack?.album === album.title) && isPlaying;
              return (
                <motion.div
                  key={album.id || album.title}
                  whileHover={{ x: 4 }}
                  className="group flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-md transition-all gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <span className="font-mono text-sm font-bold opacity-40 w-6 text-center shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
                          {album.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-[10px] font-extrabold uppercase">
                          {album.genre}
                        </span>
                      </div>
                      <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                        {album.artist} · {album.year}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#231123] dark:text-white mr-2">
                      <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{album.rating} / 5.0</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAlbum(album)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isItemPlaying ? 'bg-[#B80C09] text-white shadow-sm' : 'bg-[#ede0eb] dark:bg-white/10 text-[#231123] dark:text-white hover:bg-[#B80C09] hover:text-white'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isItemPlaying ? 'pause' : 'play_arrow'}
                        </span>
                        <span>{isItemPlaying ? 'Pausar' : 'Muestra'}</span>
                      </button>

                      <button
                        onClick={() => openReviewModal(album)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-colors cursor-pointer flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">rate_review</span>
                        <span className="hidden sm:inline">Criticar</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleBookmark(album, e)}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          isSaved ? 'text-[#B80C09]' : 'text-gray-400 hover:text-[#B80C09]'
                        }`}
                        title={isSaved ? 'Quitar de colección' : 'Guardar en colección'}
                        type="button"
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {isSaved ? 'bookmark_added' : 'bookmark_add'}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Discovery Bottom Banner CTA */}
        <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#4B2840] via-[#5c1d5e] to-[#231123] border border-white/10 overflow-hidden p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#B80C09]/20 blur-[80px] pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-purple-500/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 self-center md:self-start text-pink-200 text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#B80C09]">album</span>
              <span>Bitácora de Escucha Personal</span>
            </div>
            <h3 className="text-2xl sm:text-3xl text-white font-extrabold">
              ¿Listo para registrar tu viaje musical?
            </h3>
            <p className="text-sm sm:text-base text-white/85">
              Califica cada surco, escribe ensayos detallados y conecta con audiófilos que sienten la música con la misma intensidad que tú.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCreateAccount}
              className="px-6 py-3.5 rounded-xl bg-[#B80C09] text-white text-sm uppercase tracking-wider shadow-[0_10px_25px_-6px_rgba(184,12,9,0.6)] hover:bg-[#9c0a07] transition-all font-bold cursor-pointer"
              type="button"
            >
              {user ? 'Ir a Mi Perfil' : 'Crear Cuenta Gratis'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleExploreCatalog}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm uppercase tracking-wider backdrop-blur-md transition-all font-semibold cursor-pointer"
              type="button"
            >
              Explorar Catálogo Completo
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingGrid;
