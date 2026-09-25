import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import ProfileHeader from '../../features/profile/components/profile-header';
import { Avatar } from '../../shared/components/ui/avatar';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';
import { socialService } from '../../shared/services/social-service';
import {
  getRecommendationsForUser,
  GENRE_OPTIONS,
  DEFAULT_FALLBACK_COVER,
  handleImageFallbackError,
  getFallbackCoverForAlbum,
} from '../../shared/services/recommendations-service';
import ReviewFeedCard from '../../features/reviews/components/review-feed-card';
import AudiophilePassportTab from '../../features/profile/components/audiophile-passport-tab';
import VinylCrateFlip from '../../features/profile/components/vinyl-crate-flip';
import SoundSignatureSelector from '../../features/profile/components/sound-signature-selector';
import AudiophileSignalChain from '../../features/profile/components/audiophile-signal-chain';
import ListeningJournalModal from '../../features/profile/components/listening-journal-modal';
import EnhancedParentalControl from '../../features/profile/components/enhanced-parental-control';

export const UserDashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { playTrack, openReviewModal } = usePlayer();
  const userId = user?.id || null;
  const backupFileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const pendingTab = typeof window !== 'undefined' ? sessionStorage.getItem('sonar_active_profile_tab') : null;
      if (pendingTab) {
        sessionStorage.removeItem('sonar_active_profile_tab');
        return pendingTab;
      }
    } catch {}
    return 'passport';
  });
  const [collectionFilter, setCollectionFilter] = useState('Todos');
  const [savedViewMode, setSavedViewMode] = useState('grid');
  const [journalAlbum, setJournalAlbum] = useState(null);
  const [genreFilter, setGenreFilter] = useState('Todos');
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [backupNotice, setBackupNotice] = useState(null);
  const [gearSetup, setGearSetup] = useState(() => ({
    turntable: user?.audiophileSetup?.turntable || user?.gear?.turntable || 'Technics SL-1200MK7',
    headphones: user?.audiophileSetup?.headphones || user?.gear?.headphones || 'Sennheiser HD 660S',
    dac: user?.audiophileSetup?.dac || 'Cambridge Audio DacMagic 200M',
    favoriteFormat: user?.audiophileSetup?.favoriteFormat || 'Vinilo 180g Prensado Japonés',
    stylus: user?.audiophileSetup?.stylus || 'Ortofon 2M Blue',
  }));
  const [gearSavedNotice, setGearSavedNotice] = useState(false);

  // Sincronizar equipamiento cuando el usuario cambie o se actualice en perfil
  useEffect(() => {
    if (user?.audiophileSetup || user?.gear) {
      setGearSetup({
        turntable: user?.audiophileSetup?.turntable || user?.gear?.turntable || 'Technics SL-1200MK7',
        headphones: user?.audiophileSetup?.headphones || user?.gear?.headphones || 'Sennheiser HD 660S',
        dac: user?.audiophileSetup?.dac || 'Cambridge Audio DacMagic 200M',
        favoriteFormat: user?.audiophileSetup?.favoriteFormat || 'Vinilo 180g Prensado Japonés',
        stylus: user?.audiophileSetup?.stylus || 'Ortofon 2M Blue',
      });
    }
  }, [user]);

  const handleSaveGear = (e) => {
    e?.preventDefault();
    updateUser({
      audiophileSetup: gearSetup,
      gear: {
        turntable: gearSetup.turntable,
        headphones: gearSetup.headphones,
      },
    });
    setGearSavedNotice(true);
    setTimeout(() => setGearSavedNotice(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      app: 'SONAR Hi-Fi Music Ecosystem',
      version: '2.5.0',
      exportDate: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        accountType: user?.accountType,
        preferences: user?.preferences,
        audiophileSetup: gearSetup,
      },
      savedAlbums,
      userReviews,
      recentlyPlayed,
      followedArtists,
      followedUsers,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sonar-backup-${(user?.name || user?.username || 'usuario').toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setBackupNotice('¡Respaldo descargado exitosamente en formato JSON!');
    setTimeout(() => setBackupNotice(null), 4000);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json || typeof json !== 'object') {
          throw new Error('Formato de archivo inválido.');
        }

        const effectiveId = userId || 'guest_user';

        if (Array.isArray(json.savedAlbums)) {
          const currentStorage = JSON.parse(localStorage.getItem('sonar_user_saved_albums') || '{}');
          currentStorage[effectiveId] = json.savedAlbums;
          localStorage.setItem('sonar_user_saved_albums', JSON.stringify(currentStorage));
          setSavedAlbums(json.savedAlbums);
        }

        if (Array.isArray(json.recentlyPlayed)) {
          const currentRecent = JSON.parse(localStorage.getItem('sonar_user_recently_played') || '{}');
          currentRecent[effectiveId] = json.recentlyPlayed;
          localStorage.setItem('sonar_user_recently_played', JSON.stringify(currentRecent));
          setRecentlyPlayed(json.recentlyPlayed);
        }

        if (json.user?.preferences && updateUser) {
          updateUser({
            preferences: json.user.preferences,
            audiophileSetup: json.user.audiophileSetup || gearSetup,
          });
        }

        window.dispatchEvent(new CustomEvent('sonar:collection-changed'));
        setBackupNotice('¡Respaldo restaurado con éxito! Tus colecciones y preferencias se han sincronizado.');
        setTimeout(() => setBackupNotice(null), 5000);
      } catch (err) {
        setBackupNotice(`Error al importar: ${err.message || 'Archivo no válido'}`);
        setTimeout(() => setBackupNotice(null), 5000);
      } finally {
        if (backupFileInputRef.current) backupFileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

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

    // 4. Historial de reproducción reciente
    const recent = interactionsService.getRecentlyPlayed(userId);
    setRecentlyPlayed(recent);

    // 5. Artistas y Usuarios que sigue
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
    const handleRecentChange = () => {
      setRecentlyPlayed(interactionsService.getRecentlyPlayed(userId));
    };

    const handleNavigateTab = (e) => {
      if (e.detail) setActiveTab(e.detail);
    };

    window.addEventListener('sonar:navigate-tab', handleNavigateTab);
    window.addEventListener('sonar:follow-artist-changed', handleArtistChange);
    window.addEventListener('sonar:follow-user-changed', handleUserChange);
    window.addEventListener('sonar:review-created', handleReviewCreated);
    window.addEventListener('sonar:recently-played-changed', handleRecentChange);
    const handleCollectionChange = () => {
      setSavedAlbums(interactionsService.getUserSavedAlbums(userId));
    };
    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => {
      window.removeEventListener('sonar:navigate-tab', handleNavigateTab);
      window.removeEventListener('sonar:follow-artist-changed', handleArtistChange);
      window.removeEventListener('sonar:follow-user-changed', handleUserChange);
      window.removeEventListener('sonar:review-created', handleReviewCreated);
      window.removeEventListener('sonar:recently-played-changed', handleRecentChange);
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
              onClick={() => setActiveTab('passport')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'passport'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Pasaporte & Estadísticas</span>
              {activeTab === 'passport' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

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
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Historial ({recentlyPlayed.length})</span>
              {activeTab === 'history' && (
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

            <button
              type="button"
              onClick={() => setActiveTab('audiophile_gear')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'audiophile_gear'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">headphones</span>
              <span>Equipamiento Hi-Fi</span>
              {activeTab === 'audiophile_gear' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('parental_control')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'parental_control'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">toys</span>
              <span>Modo Kids & Control {user?.accountType === 'junior' ? '(Kids Activo)' : ''}</span>
              {activeTab === 'parental_control' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <div className="ml-auto flex items-center gap-2 pb-2">
              <input
                ref={backupFileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
                id="sonar-backup-file-input"
              />
              <button
                type="button"
                onClick={() => backupFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#231123] dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Restaurar tus colecciones, reseñas y preferencias desde un archivo JSON"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-600 dark:text-amber-400">upload</span>
                <span className="hidden sm:inline">Importar</span>
              </button>

              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#231123] dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Descargar respaldo JSON de tus álbumes, reseñas y configuración"
              >
                <span className="material-symbols-outlined text-[15px] text-[#B80C09]">download</span>
                <span className="hidden sm:inline">Exportar</span>
                <span className="sm:hidden">Backup</span>
              </button>
            </div>
          </div>

          {backupNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                <span>{backupNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setBackupNotice(null)}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
              >
                Cerrar
              </button>
            </motion.div>
          )}

          {/* TAB 0: PASAPORTE Y ESTADÍSTICAS AUDIÓFILAS */}
          {activeTab === 'passport' && (
            <AudiophilePassportTab
              user={user}
              savedAlbums={savedAlbums}
              userReviews={userReviews}
              recentlyPlayed={recentlyPlayed}
              followedArtists={followedArtists}
              followedUsers={followedUsers}
              gearSetup={gearSetup}
              onExportBackup={handleExportBackup}
            />
          )}

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
                  <span>Modificar géneros en perfil</span>
                </a>
              </div>

              {/* Selector interactivo de géneros en tiempo real */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['Todos', ...GENRE_OPTIONS].map((genre) => {
                  const isPref = user?.preferences?.some((p) => p.toLowerCase() === genre.toLowerCase());
                  const isCurrentFilter = genreFilter === genre;
                  return (
                    <div key={genre} className="flex items-center">
                      <button
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
                      {genre !== 'Todos' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleGenrePreference(genre);
                          }}
                          className={`-ml-2 z-10 w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                            isPref
                              ? 'bg-[#B80C09] text-white hover:bg-rose-700'
                              : 'bg-gray-200 dark:bg-white/20 text-gray-600 dark:text-gray-300 hover:bg-[#B80C09] hover:text-white'
                          }`}
                          title={isPref ? `Quitar ${genre} de favoritos` : `Añadir ${genre} a favoritos`}
                        >
                          {isPref ? '★' : '+'}
                        </button>
                      )}
                    </div>
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
                            src={album.cover || getFallbackCoverForAlbum(album)}
                            alt={album.title}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageFallbackError(e, album)}
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
              {/* Barra de Filtros y Selector de Vista */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                {/* Filtro por Categorías */}
                <div className="flex flex-wrap items-center gap-2">
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

                {/* Selector de Modo de Visualización (Grid vs 3D Crate) */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSavedViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      savedViewMode === 'grid'
                        ? 'bg-white dark:bg-[#4B2840] text-[#B80C09] dark:text-white shadow-xs'
                        : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">grid_view</span>
                    <span>Cuadrícula</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavedViewMode('crate3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      savedViewMode === 'crate3d'
                        ? 'bg-[#B80C09] text-white shadow-xs'
                        : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">album</span>
                    <span>Caja 3D</span>
                  </button>
                </div>
              </div>

              {savedViewMode === 'crate3d' ? (
                <VinylCrateFlip
                  albums={filteredSavedAlbums}
                  onPlayAlbum={handlePlayAlbum}
                  onToggleSave={handleToggleSaveAlbum}
                />
              ) : filteredSavedAlbums.length === 0 ? (
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
                          src={album.cover || getFallbackCoverForAlbum(album)}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => handleImageFallbackError(e, album)}
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

                      {/* Botón de acción rápida: Escribir reseña y Diario */}
                      <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => openReviewModal(album)}
                          className="flex-1 py-1 px-2 rounded-lg text-xs font-bold bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 hover:bg-[#B80C09] hover:text-white dark:hover:bg-[#B80C09] dark:hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">rate_review</span>
                          <span>Criticar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setJournalAlbum(album)}
                          className="py-1 px-2.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="Escribir notas íntimas en tu Diario Acústico"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit_note</span>
                          <span className="hidden sm:inline">Diario</span>
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

          {/* TAB: HISTORIAL DE ESCUCHA (RECENTLY PLAYED) */}
          {activeTab === 'history' && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[22px] text-[#B80C09]">history</span>
                  <div>
                    <p className="text-xs sm:text-sm text-[#5c435a] dark:text-pink-200">
                      Registro de canciones, pistas y podcasts reproducidos recientemente en esta sesión.
                    </p>
                  </div>
                </div>
                {recentlyPlayed.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      interactionsService.clearRecentlyPlayed(userId);
                      setRecentlyPlayed([]);
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 self-start sm:self-auto flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                    <span>Limpiar Historial</span>
                  </button>
                )}
              </div>

              {recentlyPlayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                  <span className="material-symbols-outlined text-5xl text-[#5c435a]/50 dark:text-[#B89CB0]/50 mb-3">
                    headphones
                  </span>
                  <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                    Aún no has reproducido ninguna pista
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md mt-1 mb-5">
                    Explora el catálogo o las recomendaciones para iniciar una sesión sonora en alta fidelidad.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recommendations')}
                    className="px-5 py-2.5 rounded-full bg-[#B80C09] hover:bg-[#960a07] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Explorar Recomendaciones
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentlyPlayed.map((item, idx) => (
                    <motion.article
                      key={item.id || idx}
                      whileHover={{ y: -3 }}
                      className="p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={item.cover || getFallbackCoverForAlbum(item)}
                          alt={item.title}
                          onError={(e) => handleImageFallbackError(e, item)}
                          className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-sm font-extrabold text-[#231123] dark:text-white truncate">
                            {item.title}
                          </h4>
                          <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                            {item.artist}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {item.playedAt ? new Date(item.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayAlbum(item)}
                        className="w-10 h-10 rounded-full bg-[#B80C09] hover:bg-[#960a07] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-transform hover:scale-105"
                        title="Reproducir de nuevo"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      </button>
                    </motion.article>
                  ))}
                </div>
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
                    const img = typeof art === 'string' ? '' : (art.image || art.cover);
                    const genre = typeof art === 'string' ? 'Artista' : art.genre || 'Música';
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -3 }}
                        className="p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col items-center text-center gap-3"
                      >
                        <img
                          src={img || getFallbackCoverForAlbum({ title: name, artist: name })}
                          alt={name}
                          onError={(e) => handleImageFallbackError(e, { title: name })}
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
                  {followedUsers.map((uid, idx) => {
                    const profile = socialService.getUserProfile(uid);
                    const displayName = profile?.name || `Audiófilo #${uid}`;
                    const handle = profile?.handle || `@${String(uid).toLowerCase()}`;
                    const role = profile?.role || 'Melómano';
                    const bio = profile?.bio || 'Crítico de vinilos y texturas acústicas.';

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar
                            src={profile?.avatarUrl}
                            name={displayName}
                            avatarBg={profile?.avatarBg || '#B80C09'}
                            size="md"
                            className="w-11 h-11 shrink-0 rounded-full shadow-xs"
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-sm font-bold text-[#231123] dark:text-white truncate">
                                {displayName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 font-semibold shrink-0">
                                {role}
                              </span>
                            </div>
                            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                              {handle}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                          "{bio}"
                        </p>

                        <div className="flex items-center justify-end pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                          <button
                            type="button"
                            onClick={() => handleToggleUnfollowUser(uid)}
                            className="px-3 py-1 rounded-xl border border-gray-300 dark:border-white/15 hover:border-rose-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            Siguiendo ✓
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TAB: EQUIPAMIENTO AUDIÓFILO */}
          {activeTab === 'audiophile_gear' && (
            <section className="flex flex-col gap-6">
              {/* Firma de Sonido & Ecualizador DSP */}
              <SoundSignatureSelector
                initialProfile={user?.soundProfile?.presetId || 'tube-warmth'}
                onSaveProfile={(profile) => updateUser({ soundProfile: profile })}
              />

              {/* Cadena de Señal Audiófila Visual */}
              <AudiophileSignalChain
                currentGear={gearSetup}
                onUpdateGear={(chain) => {
                  setGearSetup((prev) => ({ ...prev, ...chain }));
                  updateUser({
                    audiophileSetup: { ...gearSetup, ...chain },
                  });
                }}
              />

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#B80C09]/15 dark:bg-[#B80C09]/25 text-[#B80C09] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[30px]">headphones</span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-black text-[#231123] dark:text-white flex items-center gap-2">
                        <span>Equipamiento Hi-Fi & Calibración</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#B80C09]/15 text-[#B80C09] dark:text-pink-300 border border-[#B80C09]/30">
                          Calidad de Estudio
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                        Registra tus tornamesas, DACs y audífonos para exhibirlos en tu perfil y personalizar la respuesta acústica.
                      </p>
                    </div>
                  </div>

                  {gearSavedNotice && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto animate-fade-in">
                      ✓ Equipamiento actualizado con éxito
                    </span>
                  )}
                </div>

                {/* Resumen del Setup Actual */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#231123] text-white border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-pink-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">album</span>
                        <span>Tornamesa</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-white truncate">
                      {gearSetup.turntable || 'Sin asignar'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#231123] text-white border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-blue-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">headphones</span>
                        <span>Audífonos</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-white truncate">
                      {gearSetup.headphones || 'Sin asignar'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#231123] text-white border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">speaker</span>
                        <span>DAC / Amplificador</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-white truncate">
                      {gearSetup.dac || 'Sin asignar'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#231123] text-white border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                        <span>Formato Clave</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-white truncate">
                      {gearSetup.favoriteFormat || 'Sin asignar'}
                    </span>
                  </div>
                </div>

                {/* Formulario Interactivo */}
                <form onSubmit={handleSaveGear} className="flex flex-col gap-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Tornamesa */}
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200/70 dark:border-white/10">
                      <label className="text-xs font-black uppercase text-[#231123] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#B80C09]">album</span>
                        <span>Tornamesa / Reproductor</span>
                      </label>
                      <input
                        type="text"
                        value={gearSetup.turntable}
                        onChange={(e) => setGearSetup({ ...gearSetup, turntable: e.target.value })}
                        placeholder="Ej. Technics SL-1200MK7, Audio-Technica LP120X..."
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-white dark:bg-[#341b31] border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white focus:outline-hidden focus:border-[#B80C09]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Technics SL-1200MK7', 'Audio-Technica LP120X', 'Pro-Ject Debut Carbon', 'Rega Planar 3'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setGearSetup({ ...gearSetup, turntable: preset })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#231123] text-[#5c435a] dark:text-pink-200 border border-gray-300 dark:border-white/10 hover:border-[#B80C09]"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audífonos */}
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200/70 dark:border-white/10">
                      <label className="text-xs font-black uppercase text-[#231123] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-blue-500">headphones</span>
                        <span>Audífonos / Monitores</span>
                      </label>
                      <input
                        type="text"
                        value={gearSetup.headphones}
                        onChange={(e) => setGearSetup({ ...gearSetup, headphones: e.target.value })}
                        placeholder="Ej. Sennheiser HD 660S, Sony WH-1000XM5..."
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-white dark:bg-[#341b31] border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white focus:outline-hidden focus:border-[#B80C09]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Sennheiser HD 660S', 'Sony WH-1000XM5', 'Audio-Technica ATH-M50x', 'Beyerdynamic DT 990'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setGearSetup({ ...gearSetup, headphones: preset })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#231123] text-[#5c435a] dark:text-pink-200 border border-gray-300 dark:border-white/10 hover:border-blue-500"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DAC / Amplificador */}
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200/70 dark:border-white/10">
                      <label className="text-xs font-black uppercase text-[#231123] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-emerald-500">speaker</span>
                        <span>DAC & Amplificación</span>
                      </label>
                      <input
                        type="text"
                        value={gearSetup.dac}
                        onChange={(e) => setGearSetup({ ...gearSetup, dac: e.target.value })}
                        placeholder="Ej. Cambridge Audio DacMagic, Schiit Magni, iFi Zen DAC..."
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-white dark:bg-[#341b31] border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white focus:outline-hidden focus:border-[#B80C09]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Cambridge Audio DacMagic', 'Schiit Modi/Magni', 'iFi Zen DAC V2', 'FiiO K7 Pro'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setGearSetup({ ...gearSetup, dac: preset })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#231123] text-[#5c435a] dark:text-pink-200 border border-gray-300 dark:border-white/10 hover:border-emerald-500"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Formato Favorito */}
                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200/70 dark:border-white/10">
                      <label className="text-xs font-black uppercase text-[#231123] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-amber-500">graphic_eq</span>
                        <span>Formato Preferido de Audición</span>
                      </label>
                      <input
                        type="text"
                        value={gearSetup.favoriteFormat}
                        onChange={(e) => setGearSetup({ ...gearSetup, favoriteFormat: e.target.value })}
                        placeholder="Ej. Vinilo 180g Prensado Japonés, FLAC 24-bit/192kHz..."
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-white dark:bg-[#341b31] border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white focus:outline-hidden focus:border-[#B80C09]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Vinilo 180g Prensado Japonés', 'FLAC Lossless 24-bit/192kHz', 'Master DSD 5.6MHz', 'Cinta Analógica Reel'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setGearSetup({ ...gearSetup, favoriteFormat: preset })}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#231123] text-[#5c435a] dark:text-pink-200 border border-gray-300 dark:border-white/10 hover:border-amber-500"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Guardar Equipamiento en Perfil</span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* TAB 6: CONTROL PARENTAL Y FILTRO DE CONTENIDO */}
          {activeTab === 'parental_control' && (
            <EnhancedParentalControl />
          )}
        </div>

        {/* Modal de Diario Acústico & Sleeve Notes */}
        <ListeningJournalModal
          album={journalAlbum}
          isOpen={Boolean(journalAlbum)}
          onClose={() => setJournalAlbum(null)}
        />
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default UserDashboardPage;

