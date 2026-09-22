import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import ProfileHeader from '../../features/profile/components/profile-header';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';
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
  }, [user, userId, genreFilter]);

  const handleToggleGenrePreference = (genre) => {
    const current = user?.preferences || ['Art Rock', 'Electrónica'];
    const next = current.includes(genre)
      ? current.filter((g) => g !== genre)
      : [...current, genre];
    updateUser({ preferences: next.length > 0 ? next : [genre] });
  };

  const handleToggleSaveAlbum = (album, tag = 'Favoritos') => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleSaveAlbum(userId, album, tag);
    setSavedAlbums(res.savedAlbums);
  };

  const filteredSavedAlbums = savedAlbums.filter((album) => {
    if (collectionFilter === 'Todos') return true;
    return album.collectionTag === collectionFilter;
  });

  const collectionTags = ['Todos', 'Favoritos', 'Colección Vinilo', 'Por Escuchar'];

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
                            onClick={() =>
                              playTrack({
                                id: album.id,
                                title: album.title,
                                artist: album.artist,
                                album: album.title,
                                cover: album.cover || DEFAULT_FALLBACK_COVER,
                                preview: album.previewUrl || album.preview || DEFAULT_FALLBACK_PREVIEW,
                              })
                            }
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
                        {/* Tag de Colección */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-extrabold shadow-xs">
                          {album.collectionTag || 'Colección'}
                        </div>

                        {/* Botón Quitar de Colección */}
                        <button
                          type="button"
                          onClick={() => handleToggleSaveAlbum(album)}
                          title="Quitar de mi colección"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#B80C09] text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>

                      {/* Título y Artista */}
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
                          {album.title}
                        </h3>
                        <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate font-medium">
                          {album.artist} · {album.year}
                        </p>
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
        </div>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default UserDashboardPage;

