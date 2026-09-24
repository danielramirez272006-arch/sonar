import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import ProfileHeader from '../../features/profile/components/profile-header';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';
import { socialService } from '../../shared/services/social-service';
import { getAlbumTracks, searchTracks } from '../../shared/services/deezer-service';
import {
  getRecommendationsForUser,
  GENRE_OPTIONS,
  DEFAULT_FALLBACK_COVER,
  DEFAULT_FALLBACK_PREVIEW,
} from '../../shared/services/recommendations-service';
import ReviewFeedCard from '../../features/reviews/components/review-feed-card';

export const UserDashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { playTrack, openReviewModal } = usePlayer();
  const userId = user?.id || null;

  const [activeTab, setActiveTab] = useState('recommendations');
  const [collectionFilter, setCollectionFilter] = useState('Todos');
  const [genreFilter, setGenreFilter] = useState('Todos');
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  const handlePlayAlbum = (album) => {
    if (!album) return;
    playTrack({
      id: album.id,
      deezerId: album.deezerId || album.id,
      title: album.title,
      artist: album.artist,
      album: album.title,
      cover: album.cover || DEFAULT_FALLBACK_COVER,
      preview: album.previewUrl || album.preview,
    });
  };

  useEffect(() => {
    // 1. Cargar colecciones guardadas del usuario
    const saved = interactionsService.getUserSavedAlbums(userId);
    setSavedAlbums(saved);

    // 2. Generar recomendaciones personalizadas según las preferencias y filtro actual
    const recs = getRecommendationsForUser(user, genreFilter);
    setRecommendations(recs);

    // 3. Reseñas del usuario (dinámicas según ID de usuario)
    const reviews = interactionsService.getUserReviews(userId);
    setUserReviews(reviews);

    // 4. Artistas y Usuarios que sigue
    const currentId = user?.id || 'guest';
    setFollowedArtists(socialService.getFollowedArtists(currentId));
    setFollowedUsers(socialService.getFollowedUsers(currentId));

    const handleArtistChange = () => {
      setFollowedArtists(socialService.getFollowedArtists(currentId));
    };
    const handleUserChange = () => {
      setFollowedUsers(socialService.getFollowedUsers(currentId));
    };
    const handleReviewCreated = () => {
      setUserReviews(interactionsService.getUserReviews(userId));
    };

    window.addEventListener('sonar:follow-artist-changed', handleArtistChange);
    window.addEventListener('sonar:follow-user-changed', handleUserChange);
    window.addEventListener('sonar:review-created', handleReviewCreated);
    const handleCollectionChange = () => {
      setSavedAlbums(interactionsService.getUserSavedAlbums(userId));
    };
    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => {
      window.removeEventListener('sonar:follow-artist-changed', handleArtistChange);
      window.removeEventListener('sonar:follow-user-changed', handleUserChange);
      window.removeEventListener('sonar:review-created', handleReviewCreated);
      window.removeEventListener('sonar:collection-changed', handleCollectionChange);
    };
  }, [user, userId, genreFilter]);

  const handleToggleUnfollowArtist = (artistName) => {
    const currentId = user?.id || 'guest';
    socialService.toggleFollowArtist(currentId, artistName);
    setFollowedArtists(socialService.getFollowedArtists(currentId));
  };

  const handleToggleUnfollowUser = (targetUserId) => {
    const currentId = user?.id || 'guest';
    socialService.toggleFollowUser(currentId, targetUserId);
    setFollowedUsers(socialService.getFollowedUsers(currentId));
  };

  const handleToggleGenrePreference = (genre) => {
    const current = user?.preferences || ['Art Rock', 'Electrónica'];
    const next = current.includes(genre)
      ? current.filter((g) => g !== genre)
      : [...current, genre];
    updateUser({ preferences: next.length > 0 ? next : [genre] });
  };

  const handleToggleSaveAlbum = (album, tag = 'Favoritos') => {
    const effectiveId = userId || 'guest_user';
    const res = interactionsService.toggleSaveAlbum(effectiveId, album, tag);
    setSavedAlbums(res.savedAlbums);
  };

  const collectionTags = ['Todos', '🎵 Canciones', '💿 Álbumes', 'Favoritos', 'Colección Vinilo', 'Por Escuchar'];

  const filteredSavedAlbums = savedAlbums.filter((album) => {
    if (collectionFilter === 'Todos') return true;
    if (collectionFilter === '🎵 Canciones') return album.type === 'track' || album.trackId;
    if (collectionFilter === '💿 Álbumes') return album.type !== 'track' && !album.trackId;
    return album.collectionTag === collectionFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal */}
      <main className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Encabezado del Perfil */}
        <ProfileHeader user={user} actualReviewsCount={userReviews.length} />

        {/* Navegación por Pestañas (Tabs) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 sm:gap-8 border-b border-[#e6d5e2] dark:border-white/10 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('recommendations')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'recommendations'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Recomendados Para Ti ({recommendations.length})</span>
              {activeTab === 'recommendations' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
              <span>Mis Colecciones ({savedAlbums.length})</span>
              {activeTab === 'saved' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
              <span>Mis Reseñas ({userReviews.length})</span>
              {activeTab === 'reviews' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following_artists')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'following_artists'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Artistas ({followedArtists.length})</span>
              {activeTab === 'following_artists' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following_users')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'following_users'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span>Siguiendo ({followedUsers.length})</span>
              {activeTab === 'following_users' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* TAB 1: RECOMENDACIONES PERSONALIZADAS */}
          {activeTab === 'recommendations' && (
            <section className="flex flex-col gap-6">
              {/* Barra informativa de afinidad */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[22px] text-[#B80C09]">auto_awesome</span>
                  <div>
                    <p className="text-xs sm:text-sm text-[#5c435a] dark:text-pink-200">
                      Algoritmo acústico ajustado a tus gustos:{' '}
                      <strong className="text-[#231123] dark:text-white">
                        {(user?.preferences || ['Art Rock', 'Electrónica']).join(', ')}
                      </strong>.
                    </p>
                  </div>
                </div>
                <a
                  href="#profile-settings"
                  className="text-xs font-bold text-[#B80C09] hover:underline self-start sm:self-auto flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                  <span>Modificar géneros</span>
                </a>
              </div>

              {/* Selector interactivo de géneros en tiempo real */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['Todos', ...GENRE_OPTIONS].map((genre) => {
                  const isPref = user?.preferences?.some((p) => p.toLowerCase() === genre.toLowerCase());
                  const isCurrentFilter = genreFilter === genre;
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setGenreFilter(genre)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                        isCurrentFilter
                          ? 'bg-[#B80C09] text-white'
                          : isPref
                          ? 'bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 border border-[#B80C09]/40 hover:bg-[#B80C09]/10'
                          : 'bg-white dark:bg-[#4B2840] text-[#5c435a] dark:text-gray-200 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/30'
                      }`}
                    >
                      {isPref && <span className="w-1.5 h-1.5 rounded-full bg-[#B80C09]" />}
                      <span>{genre}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map((album) => {
                  const isSaved = interactionsService.isAlbumSaved(userId, album.title);
                  return (
                    <motion.article
                      key={album.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Carátula */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-black/10 shadow-xs relative group">
                          <img
                            src={album.cover}
                            alt={album.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handlePlayAlbum(album)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                            title="Reproducir muestra"
                          >
                            <span className="material-symbols-outlined text-[28px]">play_circle</span>
                          </button>
                        </div>

                        {/* Metadatos */}
                        <div className="flex flex-col min-w-0 flex-1 justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 font-bold border border-[#e6d5e2] dark:border-white/10">
                                {album.genre}
                              </span>
                              <span className="text-xs font-extrabold text-[#B80C09] flex items-center gap-0.5">
                                ★ {album.rating}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate mt-1">
                              {album.title}
                            </h3>
                            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                              {album.artist} · {album.year}
                            </p>
                          </div>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#B80C09]/10 text-[#B80C09] dark:bg-[#B80C09]/20 dark:text-pink-300">
                              {album.matchPercentage || 95}% Afinidad
                            </span>
                          </div>

                          <p className="text-[11px] text-[#5c435a] dark:text-gray-300 italic line-clamp-2 mt-1">
                            {album.matchReason}
                          </p>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-[#e6d5e2]/60 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => handleToggleSaveAlbum(album, 'Favoritos')}
                          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isSaved
                              ? 'bg-[#B80C09] text-white'
                              : 'bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 hover:bg-[#B80C09]/10 hover:text-[#B80C09]'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            bookmark
                          </span>
                          <span>{isSaved ? 'En Colección' : 'Guardar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openReviewModal(album)}
                          className="py-1.5 px-3 rounded-xl text-xs font-bold bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                          title="Escribir reseña"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit_note</span>
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          )}

          {/* TAB 2: MIS COLECCIONES / DISCOS GUARDADOS */}
          {activeTab === 'saved' && (
            <section className="flex flex-col gap-6">
              {/* Filtro por Categorías */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {collectionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCollectionFilter(tag)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      collectionFilter === tag
                        ? 'bg-[#B80C09] text-white shadow-xs'
                        : 'bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 hover:border-[#B80C09]/40'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {filteredSavedAlbums.length === 0 ? (
                <div className="p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-center flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[48px] text-[#5c435a] dark:text-[#B89CB0]">
                    library_music
                  </span>
                  <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                    No tienes discos guardados en esta categoría
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md">
                    Explora las recomendaciones personalizadas o busca álbumes para añadirlos a tus colecciones personales.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {filteredSavedAlbums.map((album) => (
                    <motion.article
                      key={album.id || album.title}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="group flex flex-col p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-lg hover:border-[#B80C09]/40 transition-all relative"
                    >
                      {/* Carátula Cuadrada */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-[#231123] mb-3 shadow-xs">
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_FALLBACK_COVER;
                          }}
                        />
                        {/* Badges de Tipo y Colección */}
                        <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 z-10">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-xs ${
                            album.type === 'track' || album.trackId
                              ? 'bg-[#B80C09] text-white'
                              : 'bg-purple-900/90 text-purple-200 border border-purple-400/30'
                          }`}>
                            {album.type === 'track' || album.trackId ? '🎵 Canción' : '💿 Álbum'}
                          </span>
                          {album.collectionTag && album.collectionTag !== 'Favoritos' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[9px] font-bold shadow-xs">
                              {album.collectionTag}
                            </span>
                          )}
                        </div>

                        {/* Botón Reproducir */}
                        <button
                          type="button"
                          onClick={() => handlePlayAlbum(album)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                          title="Reproducir muestra"
                        >
                          <span className="material-symbols-outlined text-[32px]">play_circle</span>
                        </button>

                        {/* Botón Quitar de Colección */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaveAlbum(album);
                          }}
                          title="Quitar de mi colección"
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/70 hover:bg-[#B80C09] text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>

                      {/* Título y Artista */}
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate" title={album.title}>
                          {album.title}
                        </h3>
                        <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate font-medium">
                          {album.artist} {album.album && album.album !== album.title ? `· ${album.album}` : (album.year ? `· ${album.year}` : '')}
                        </p>
                      </div>

                      {/* Botón de acción rápida: Escribir reseña */}
                      <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => openReviewModal(album)}
                          className="w-full py-1 px-2 rounded-lg text-xs font-bold bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 hover:bg-[#B80C09] hover:text-white dark:hover:bg-[#B80C09] dark:hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">rate_review</span>
                          <span>Criticar</span>
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: MIS RESEÑAS */}
          {activeTab === 'reviews' && (
            <section className="flex flex-col gap-5">
              {userReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                  <span className="material-symbols-outlined text-5xl text-[#5c435a]/50 dark:text-[#B89CB0]/50 mb-3">
                    rate_review
                  </span>
                  <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                    Aún no has escrito ninguna reseña
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md mt-1 mb-5">
                    Comparte tus análisis acústicos y reflexiones sonoras con la comunidad de Sonar.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recommendations')}
                    className="px-5 py-2.5 rounded-full bg-[#B80C09] hover:bg-[#960a07] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Explorar álbumes recomendados
                  </button>
                </div>
              ) : (
                userReviews.map((review) => (
                  <ReviewFeedCard key={review.id} review={review} />
                ))
              )}
            </section>
          )}

          {/* TAB 4: ARTISTAS QUE SIGUES */}
          {activeTab === 'following_artists' && (
            <section className="flex flex-col gap-6">
              {followedArtists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                  <span className="material-symbols-outlined text-5xl text-[#5c435a]/50 dark:text-[#B89CB0]/50 mb-3">
                    person_play
                  </span>
                  <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                    Aún no sigues a ningún artista
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md mt-1 mb-5">
                    Explora la comunidad o las reseñas para seguir a tus creadores y productores favoritos.
                  </p>
                  <a
                    href="#community"
                    className="px-5 py-2.5 rounded-full bg-[#B80C09] hover:bg-[#960a07] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                  >
                    Descubrir Artistas en la Comunidad
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {followedArtists.map((art, idx) => {
                    const name = typeof art === 'string' ? art : art.name;
                    const img = typeof art === 'string' ? 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg' : art.image;
                    const genre = typeof art === 'string' ? 'Artista' : art.genre || 'Música';
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -3 }}
                        className="p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col items-center text-center gap-3"
                      >
                        <img
                          src={img}
                          alt={name}
                          className="w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-[#B80C09]/20"
                        />
                        <div className="flex flex-col min-w-0 w-full">
                          <h4 className="text-sm font-bold text-[#231123] dark:text-white truncate">{name}</h4>
                          <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">{genre}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleUnfollowArtist(name)}
                          className="w-full py-1.5 rounded-xl border border-gray-300 dark:border-white/15 hover:border-rose-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          Dejar de seguir
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TAB 5: USUARIOS QUE SIGUES */}
          {activeTab === 'following_users' && (
            <section className="flex flex-col gap-6">
              {followedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                  <span className="material-symbols-outlined text-5xl text-[#5c435a]/50 dark:text-[#B89CB0]/50 mb-3">
                    group
                  </span>
                  <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                    Aún no sigues a ningún melómano
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md mt-1 mb-5">
                    Conecta con críticos y audiófilos destacados en la sección de Comunidad.
                  </p>
                  <a
                    href="#community"
                    className="px-5 py-2.5 rounded-full bg-[#B80C09] hover:bg-[#960a07] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                  >
                    Ver Melómanos Destacados
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followedUsers.map((uid, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5c1d5e] to-[#B80C09] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {String(uid).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-[#231123] dark:text-white truncate">
                            {uid === '1' ? 'Sofía Sound' : uid === '2' ? 'Marcos Vinyl' : `Audiófilo #${uid}`}
                          </span>
                          <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                            @{String(uid).toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleUnfollowUser(uid)}
                        className="px-3 py-1 rounded-xl border border-gray-300 dark:border-white/15 hover:border-rose-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                      >
                        Siguiendo ✓
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default UserDashboardPage;

