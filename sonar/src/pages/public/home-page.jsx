import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import AlbumOfTheWeek from '../../features/home/components/album-of-the-week';
import HeroSearch from '../../features/home/components/hero-search';
import FeaturedReviews from '../../features/home/components/featured-reviews';
import TrendingGrid from '../../features/home/components/trending-grid';
import Footer from '../../shared/components/layout/footer';
import Skeleton from '../../shared/components/ui/loader';
import { searchAlbums, getAlbumTracks, isKidsSafeTrack } from '../../shared/services/deezer-service';
import { usePlayer } from '../../shared/context/player-context';
import { useAuth } from '../../shared/context/auth-context';
import { interactionsService } from '../../shared/services/interactions-service';
import { handleImageFallbackError, getFallbackCoverForAlbum } from '../../shared/services/recommendations-service';

const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const HomePageSkeleton = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-10 py-8 flex flex-col gap-12">
      {/* Skeleton Hero / Álbum de la semana */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
        <div className="lg:col-span-6 flex justify-center items-center">
          <Skeleton
            variant="rounded"
            className="w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] shadow-md"
          />
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4">
          <Skeleton width="220px" height="26px" variant="rounded" />
          <Skeleton width="85%" height="48px" variant="rounded" />
          <Skeleton width="60%" height="20px" variant="text" />
          <Skeleton width="180px" height="28px" variant="rounded" />
          <Skeleton width="100%" height="90px" variant="rounded" />
          <div className="flex gap-3 pt-2">
            <Skeleton width="140px" height="44px" variant="rounded" />
            <Skeleton width="140px" height="44px" variant="rounded" />
            <Skeleton width="44px" height="44px" variant="rounded" />
          </div>
        </div>
      </div>

      {/* Skeleton Hero Search */}
      <div className="flex flex-col items-center gap-4 py-8 max-w-[700px] mx-auto w-full">
        <Skeleton width="75%" height="44px" variant="rounded" />
        <Skeleton width="90%" height="20px" variant="text" />
        <Skeleton width="100%" height="56px" variant="rounded" className="mt-2" />
      </div>

      {/* Skeleton Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} height="240px" variant="rounded" />
        ))}
      </div>
    </div>
  );
};

export const HomePage = () => {
  const { user, isJunior, isParentalControlActive } = useAuth();
  const userId = user?.id || '1';
  const isKidsActive = Boolean(isJunior || isParentalControlActive);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideExplicitInSearch, setHideExplicitInSearch] = useState(() => isKidsActive);
  const [savedCollection, setSavedCollection] = useState([]);
  const resultsRef = React.useRef(null);
  const { playTrack, currentTrack, isPlaying, toggleTrack, openReviewModal } = usePlayer();

  useEffect(() => {
    const loadSaved = () => {
      setSavedCollection(interactionsService.getUserSavedAlbums(userId));
    };
    loadSaved();

    const handleCollectionChange = () => {
      loadSaved();
    };
    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => window.removeEventListener('sonar:collection-changed', handleCollectionChange);
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleFavorite = (song, e) => {
    e?.stopPropagation?.();
    interactionsService.toggleSaveAlbum(userId, {
      id: song.id,
      trackId: song.id,
      deezerId: song.deezerId || song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || song.albumTitle || song.title,
      cover: song.cover,
      preview: song.preview,
      previewUrl: song.preview,
      type: 'track',
    });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query || !query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAlbums(query);
      setSearchResults(results);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Error buscando álbumes en Deezer:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Recuperar búsqueda pendiente si se envió desde otra página
    const pendingSearch = sessionStorage.getItem('sonar_pending_search');
    if (pendingSearch) {
      sessionStorage.removeItem('sonar_pending_search');
      handleSearch(pendingSearch);
    }

    const handleGlobalSearch = (e) => {
      if (e.detail) {
        handleSearch(e.detail);
      }
    };
    window.addEventListener('sonar:search', handleGlobalSearch);
    return () => window.removeEventListener('sonar:search', handleGlobalSearch);
  }, []);

  const handlePlaySearchResult = (item) => {
    if (!item) return;
    playTrack({
      id: item.id,
      deezerId: item.deezerId || item.id,
      trackId: item.id,
      title: item.title,
      artist: item.artist,
      album: item.album || item.albumTitle || item.title,
      cover: item.cover,
      preview: item.preview,
    });
  };

  return (
    <div className="min-h-screen bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] flex flex-col transition-colors duration-300">
      {/* Barra de Navegación fija con buscador rápido integrado */}
      <Navbar onSearch={handleSearch} />

      <main className="w-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomePageSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={pageContainerVariants}
              initial="hidden"
              animate="visible"
              className="w-full flex-1 flex flex-col"
            >
              {/* Álbum de la Semana (Hero Vinilo) */}
              <AlbumOfTheWeek />

              {/* Buscador Principal */}
              <HeroSearch onSearch={handleSearch} onSubmit={handleSearch} />

              {/* Resultados de Búsqueda Deezer en Vivo */}
              {searchQuery && (
                <section id="search-results" ref={resultsRef} className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 scroll-mt-20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#e6d5e2] dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#231123] dark:text-[#FAF5F8]">
                        Canciones en Deezer para &ldquo;{searchQuery}&rdquo;
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {(isJunior || isParentalControlActive) && (
                        <button
                          type="button"
                          onClick={() => setHideExplicitInSearch(!hideExplicitInSearch)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            hideExplicitInSearch
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                              : 'bg-gray-100 dark:bg-white/10 text-[#5c435a] dark:text-[#B89CB0] border-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {hideExplicitInSearch ? 'check_circle' : 'filter_alt'}
                          </span>
                          <span>{hideExplicitInSearch ? 'Ocultando 18+ (Activo)' : 'Ocultar explícitas [18+]'}</span>
                        </button>
                      )}
                      <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-semibold">
                        {searchResults.filter(s => !hideExplicitInSearch || (!s.explicit && !s.explicit_lyrics)).length} canciones
                      </span>
                    </div>
                  </div>

                  {isSearching ? (
                    <div className="flex items-center justify-center py-12 text-[#5c435a] dark:text-[#B89CB0]">
                      <span className="material-symbols-outlined animate-spin text-[32px] text-[#B80C09] mr-2">
                        progress_activity
                      </span>
                      <span>Buscando canciones en la biblioteca de Deezer...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-10 text-[#5c435a] dark:text-[#B89CB0]">
                      No se encontraron canciones en Deezer para &ldquo;{searchQuery}&rdquo;.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                      {searchResults
                        .filter(s => !hideExplicitInSearch || isKidsSafeTrack(s))
                        .slice(0, 12)
                        .map((song) => {
                        const isSaved = savedCollection.some(
                          (a) =>
                            String(a.id) === String(song.id) ||
                            String(a.trackId || '') === String(song.id) ||
                            (a.title && a.title.toLowerCase() === song.title.toLowerCase())
                        );

                        return (
                          <motion.div
                            key={song.id}
                            whileHover={{ y: -4 }}
                            className="group flex flex-col p-3 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-md transition-all relative"
                          >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-black/10">
                              <img
                                src={song.cover}
                                alt={song.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {Boolean(song.explicit || song.explicit_lyrics) && (
                                <span className="absolute top-2 left-2 px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-black/80 text-rose-300 border border-rose-500/40 z-10">
                                  18+
                                </span>
                              )}
                              {isSaved && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-xs z-10">
                                  <span className="material-symbols-outlined text-[14px]">bookmark</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                <button
                                  onClick={() => handlePlaySearchResult(song)}
                                  className="w-9 h-9 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                  title="Escuchar muestra (30s)"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    {(currentTrack?.id === song.id || currentTrack?.title === song.title) && isPlaying ? 'pause' : 'play_arrow'}
                                  </span>
                                </button>
                                <button
                                  onClick={() => openReviewModal(song)}
                                  className="w-9 h-9 rounded-full bg-white text-[#231123] flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                  title="Escribir crítica"
                                >
                                  <span className="material-symbols-outlined text-[18px]">rate_review</span>
                                </button>
                                <button
                                  onClick={(e) => handleToggleFavorite(song, e)}
                                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer ${
                                    isSaved ? 'bg-[#B80C09] text-white' : 'bg-white text-[#231123]'
                                  }`}
                                  title={isSaved ? 'Quitar de favoritos' : 'Guardar canción en favoritos'}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {isSaved ? 'bookmark_added' : 'bookmark_add'}
                                  </span>
                                </button>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-[#FAF5F8] truncate" title={song.title}>
                              {song.title}
                            </span>
                            <span className="text-[11px] text-[#5c435a] dark:text-[#B89CB0] truncate" title={song.artist}>
                              {song.artist}
                            </span>
                            {song.album && song.album !== song.title && (
                              <span className="text-[10px] text-gray-400 dark:text-gray-400 truncate mt-0.5">
                                {song.album}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* Reseñas Destacadas */}
              <FeaturedReviews />

              {/* Cuadrícula de Tendencias & Banner */}
              <TrendingGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default HomePage;
