import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import ReviewFeedCard from '../../features/reviews/components/review-feed-card';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { Avatar } from '../../shared/components/ui/avatar';
import { getReviews, getUsers, createReview } from '../../shared/services/api-client';
import { searchAlbums, DEFAULT_DEEZER_ALBUMS } from '../../shared/services/deezer-service';
import { interactionsService } from '../../shared/services/interactions-service';
import { socialService } from '../../shared/services/social-service';
import Toast from '../../shared/components/ui/toast';

const INITIAL_SEED_REVIEWS = [
  {
    id: 'seed-1',
    userId: '1',
    userName: 'Sofía Sound',
    userHandle: '@sofia_sound',
    avatarUrl: '',
    date: 'Hace 20 min',
    rating: 5,
    albumTitle: 'In Rainbows',
    artist: 'Radiohead',
    deezerId: 14880659,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    content:
      'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
    likesCount: 142,
    commentsCount: 18,
    tags: ['Art Rock', 'Hi-Fi'],
  },
  {
    id: 'seed-2',
    userId: '2',
    userName: 'Marcos Vinyl',
    userHandle: '@marcos_vinyl',
    avatarUrl: '',
    date: 'Hace 1 hora',
    rating: 4.5,
    albumTitle: 'Discovery',
    artist: 'Daft Punk',
    deezerId: 302127,
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    content:
      'El trabajo de compresión y dinámica en pista analógica es demoledor. Giorgio by Moroder es un homenaje absoluto a la historia de los sintetizadores modulares.',
    likesCount: 98,
    commentsCount: 12,
    tags: ['Electrónica', 'Sintetizadores'],
  },
  {
    id: 'seed-3',
    userId: '3',
    userName: 'Elena Analog',
    userHandle: '@elena_analog',
    avatarUrl: '',
    date: 'Hace 3 horas',
    rating: 5,
    albumTitle: 'Vespertine',
    artist: 'Björk',
    deezerId: 537883642,
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    content:
      'Melancolía nocturna capturada en vinilo craquelado. La textura de las voces sampleadas crea una atmósfera lluviosa e íntima difícil de replicar.',
    likesCount: 76,
    commentsCount: 9,
    tags: ['Glitch Pop', 'Ambient'],
  },
  {
    id: 'seed-4',
    userId: '4',
    userName: 'Carlos Beats',
    userHandle: '@carlos_beats',
    avatarUrl: '',
    date: 'Hace 5 horas',
    rating: 4.8,
    albumTitle: 'Currents',
    artist: 'Tame Impala',
    deezerId: 10709540,
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
    content:
      'Un renacimiento psicodélico impecable. Los bajos envolventes de "Let It Happen" demuestran un estándar de masterización asombroso para la era digital.',
    likesCount: 64,
    commentsCount: 7,
    tags: ['Psicodelia', 'Mastering'],
  },
];

const POPULAR_TAGS = [
  'Todos',
  'Art Rock',
  'Psicodelia',
  'Electrónica',
  'Hi-Fi',
  'Vinilo',
  'Ambient',
  'Mastering',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const CommunityPage = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();

  // Estados principales de la API
  const [reviews, setReviews] = useState([]);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Estados de interfaz
  const [feedTab, setFeedTab] = useState('recent'); // 'recent' | 'top' | 'hot'
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [followingMap, setFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_following_users');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Composer
  const [isComposing, setIsComposing] = useState(false);
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [isSearchingAlbums, setIsSearchingAlbums] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(DEFAULT_DEEZER_ALBUMS[0]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedReviewTags, setSelectedReviewTags] = useState(['Hi-Fi', 'Art Rock']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. CARGA INICIAL DESDE LA API
  useEffect(() => {
    let isMounted = true;

    async function loadCommunityData() {
      setIsLoadingFeed(true);
      setApiError(null);

      try {
        const [apiReviews, apiUsers] = await Promise.allSettled([
          getReviews(),
          getUsers(),
        ]);

        const rawReviews = apiReviews.status === 'fulfilled' && Array.isArray(apiReviews.value)
          ? apiReviews.value
          : [];

        const rawUsers = apiUsers.status === 'fulfilled' && Array.isArray(apiUsers.value)
          ? apiUsers.value
          : [];

        if (!isMounted) return;

        // Normalizamos y vinculamos usuarios a las reseñas
        const formattedApiReviews = rawReviews
          .filter((r) => r.status !== 'rejected')
          .map((r) => {
            const author = rawUsers.find((u) => String(u.id) === String(r.userId));
            return {
              id: r.id || `rev-${Date.now()}`,
              userId: r.userId,
              userName: r.userName || author?.username || 'Audiófilo Sonar',
              userHandle: author?.email ? `@${author.email.split('@')[0]}` : `@${r.userName?.toLowerCase().replace(/\s+/g, '_') || 'usuario'}`,
              avatarUrl: author?.avatarUrl || '',
              date: r.date || 'Reciente',
              rating: Number(r.rating) || 5,
              albumTitle: r.albumTitle || r.album || 'Álbum',
              artist: r.artist || author?.username || 'Artista',
              deezerId: r.deezerId || null,
              cover: r.cover || r.coverUrl || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
              content: r.content || 'Excelente álbum y producción sonora.',
              likesCount: Number(r.likesCount) || 12,
              commentsCount: Number(r.commentsCount) || 2,
              tags: r.tags || (r.genre ? [r.genre] : ['Música']),
            };
          });

        // Combinamos las reseñas de la API con los seeds para que siempre esté viva
        const combined = [...formattedApiReviews, ...INITIAL_SEED_REVIEWS];
        // Eliminamos duplicados por ID
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setReviews(unique);

        // Usuarios destacados reales desde la API con estadísticas 100% reales
        if (rawUsers.length > 0) {
          const topUsers = rawUsers
            .filter((u) => u.role !== 'admin' || rawUsers.length <= 2)
            .slice(0, 5)
            .map((u) => {
              const userReviewsCount = unique.filter((r) => String(r.userId) === String(u.id)).length;
              const followers = socialService.getFollowersCount(u.id);
              return {
                id: u.id,
                name: u.username || 'Audiófilo',
                handle: `@${u.username?.toLowerCase().replace(/\s+/g, '_') || 'listener'}`,
                reviews: `${userReviewsCount} ${userReviewsCount === 1 ? 'reseña' : 'reseñas'}`,
                followers,
              };
            });
          setFeaturedUsers(topUsers);
        } else {
          const fallbackUsers = [
            { id: '1', name: 'Mateo Rivaes', handle: '@mateo_riva' },
            { id: '2', name: 'Valeria Moreno', handle: '@val_acoustics' },
            { id: '3', name: 'Rodrigo Bass', handle: '@rodrigo_hifi' },
          ].map((u) => {
            const userReviewsCount = unique.filter((r) => String(r.userId) === String(u.id)).length;
            const followers = socialService.getFollowersCount(u.id);
            return {
              ...u,
              reviews: `${userReviewsCount} ${userReviewsCount === 1 ? 'reseña' : 'reseñas'}`,
              followers,
            };
          });
          setFeaturedUsers(fallbackUsers);
        }
      } catch (err) {
        if (!isMounted) return;
        setApiError('Modo fuera de línea: Mostrando archivo comunitario local.');
        setReviews(INITIAL_SEED_REVIEWS);
      } finally {
        if (isMounted) setIsLoadingFeed(false);
      }
    }

    loadCommunityData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. BÚSQUEDA DINÁMICA DE ÁLBUMES EN DEEZER PARA EL COMPOSER
  useEffect(() => {
    if (!albumSearchQuery.trim()) {
      setAlbumSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAlbums(true);
      try {
        const results = await searchAlbums(albumSearchQuery);
        setAlbumSearchResults(results.slice(0, 6));
      } catch (err) {
        console.error('Error buscando álbum en Deezer:', err);
      } finally {
        setIsSearchingAlbums(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [albumSearchQuery]);

  const [toastMessage, setToastMessage] = useState(null);
  const [followingArtistsMap, setFollowingArtistsMap] = useState({});

  useEffect(() => {
    const currentId = user?.id || 'guest';
    const followedList = socialService.getFollowedUsers(currentId);
    const map = {};
    followedList.forEach((id) => {
      map[id] = true;
    });
    setFollowingMap(map);

    const followedArtList = socialService.getFollowedArtists(currentId);
    const artMap = {};
    followedArtList.forEach((a) => {
      const name = typeof a === 'string' ? a : a.name;
      if (name) artMap[name.toLowerCase()] = true;
    });
    setFollowingArtistsMap(artMap);

    const handleUserChange = (e) => {
      if (e.detail?.targetUserId) {
        setFollowingMap((prev) => ({
          ...prev,
          [e.detail.targetUserId]: e.detail.isFollowing,
        }));
      }
    };
    const handleArtistChange = (e) => {
      if (e.detail?.artistName) {
        setFollowingArtistsMap((prev) => ({
          ...prev,
          [e.detail.artistName.toLowerCase()]: e.detail.isFollowing,
        }));
      }
    };

    window.addEventListener('sonar:follow-user-changed', handleUserChange);
    window.addEventListener('sonar:follow-artist-changed', handleArtistChange);
    return () => {
      window.removeEventListener('sonar:follow-user-changed', handleUserChange);
      window.removeEventListener('sonar:follow-artist-changed', handleArtistChange);
    };
  }, [user]);

  // Toggle seguir usuarios con persistencia y feedback
  const handleToggleFollow = (fUser) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const targetId = String(fUser.id || fUser);
    const nextState = socialService.toggleFollowUser(user.id, targetId, {
      name: fUser.name,
      handle: fUser.handle,
    });
    setFollowingMap((prev) => ({ ...prev, [targetId]: nextState }));
    setToastMessage({
      title: nextState ? `¡Ahora sigues a ${fUser.name || 'este usuario'}!` : `Dejaste de seguir a ${fUser.name || 'este usuario'}`,
      type: 'success',
    });
  };

  // Toggle seguir artistas con persistencia y feedback
  const handleToggleFollowArtist = (artistName, artistData = {}) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const nextState = socialService.toggleFollowArtist(user.id, artistName, artistData);
    setFollowingArtistsMap((prev) => ({
      ...prev,
      [artistName.toLowerCase()]: nextState,
    }));
    setToastMessage({
      title: nextState ? `¡Ahora sigues a ${artistName}!` : `Dejaste de seguir a ${artistName}`,
      type: 'success',
    });
  };

  // Toggle tag en composer
  const toggleComposerTag = (tag) => {
    setSelectedReviewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 3. PUBLICAR CRÍTICA EN LA API Y EL FEED
  const handlePublishReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);

    const newReviewData = {
      id: `rev-${Date.now()}`,
      userId: user?.id || 'guest',
      userName: user?.username || 'Melómano Sonar',
      userHandle: `@${user?.username?.toLowerCase().replace(/\s+/g, '_') || 'usuario'}`,
      avatarUrl: user?.avatarUrl || '',
      date: 'Justo ahora',
      rating: Number(rating),
      albumTitle: selectedAlbum.title,
      artist: selectedAlbum.artist,
      deezerId: selectedAlbum.id,
      cover: selectedAlbum.cover || selectedAlbum.cover_medium,
      content: reviewText.trim(),
      likesCount: 0,
      commentsCount: 0,
      tags: selectedReviewTags.length > 0 ? selectedReviewTags : ['Comunidad'],
      status: 'approved',
      aiFlagged: false,
    };

    try {
      // POST al endpoint /reviews de json-server
      await createReview(newReviewData);
    } catch (err) {
      console.warn('Persistencia en API mock falló, guardando en memoria:', err);
    }

    // Registrar también en el historial de interacciones del usuario
    if (user?.id) {
      interactionsService.addReview({
        id: newReviewData.id,
        userId: user.id,
        albumTitle: newReviewData.albumTitle,
        artist: newReviewData.artist,
        cover: newReviewData.cover,
        rating: newReviewData.rating,
        content: newReviewData.content,
      });
    }

    setReviews([newReviewData, ...reviews]);
    setReviewText('');
    setAlbumSearchQuery('');
    setIsComposing(false);
    setIsSubmitting(false);
  };

  // Filtrado y ordenamiento del feed
  const filteredReviews = reviews
    .filter((rev) => {
      if (selectedTag === 'Todos') return true;
      return rev.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    })
    .sort((a, b) => {
      if (feedTab === 'top') return (b.rating * 10 + b.likesCount) - (a.rating * 10 + a.likesCount);
      if (feedTab === 'hot') return b.commentsCount - a.commentsCount;
      return typeof b.id === 'number' && typeof a.id === 'number' ? b.id - a.id : 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Banner Hero de la Comunidad */}
        <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#4B2840] via-[#5c1d5e] to-[#231123] border border-white/10 p-6 sm:p-8 mb-8 text-white shadow-lg overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B80C09]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-1.5 max-w-xl text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-pink-300 font-extrabold flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-ping" />
              ÁGORA SONORA · COMUNIDAD EN VIVO
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Diálogos audiófilos sin algoritmo complaciente.
            </h1>
            <p className="text-sm text-white/80">
              Conectado a la API en vivo de Sonar y al catálogo musical de Deezer. Publica ensayos y debate en tiempo real.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsComposing(!isComposing)}
            className="relative z-10 px-5 py-3 rounded-2xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-sm font-bold shadow-[0_4px_16px_rgba(184,12,9,0.5)] transition-all cursor-pointer flex items-center gap-2 shrink-0 select-none active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">rate_review</span>
            <span>{isComposing ? 'Cerrar Publicador' : 'Escribir una Crítica'}</span>
          </button>
        </div>

        {apiError && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* COMPOSER DESPLEGABLE CON BÚSQUEDA DEEZER EN VIVO */}
        <AnimatePresence>
          {isComposing && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="mb-8 overflow-hidden"
            >
              <form
                onSubmit={handlePublishReview}
                className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-lg flex flex-col gap-5"
              >
                <div className="flex items-center justify-between border-b border-[#e6d5e2] dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#B80C09] text-[20px]">edit_square</span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#231123] dark:text-white">
                      ¿Qué estás escuchando hoy?
                    </h3>
                  </div>
                  <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                    Publicando como <b>{user?.username || 'Invitado'}</b>
                  </span>
                </div>

                {/* Buscador de Álbumes en Deezer */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
                    Buscar álbum en Deezer API
                  </label>
                  <input
                    type="text"
                    value={albumSearchQuery}
                    onChange={(e) => setAlbumSearchQuery(e.target.value)}
                    placeholder="Escribe el nombre del álbum o artista (ej. Kid A, Discovery, Rosalía)..."
                    className="px-3.5 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#231123] text-sm text-[#231123] dark:text-white placeholder-[#5c435a]/60 dark:placeholder-gray-400 focus:outline-none focus:border-[#B80C09]"
                  />
                  {isSearchingAlbums && (
                    <span className="absolute right-3 top-9 text-xs text-[#B80C09] font-bold animate-pulse">
                      Buscando en Deezer...
                    </span>
                  )}

                  {/* Resultados flotantes de la búsqueda de Deezer */}
                  {albumSearchResults.length > 0 && (
                    <div className="absolute top-16 left-0 right-0 z-30 p-2 rounded-2xl bg-white dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/20 shadow-2xl flex flex-col gap-1 max-h-60 overflow-y-auto">
                      {albumSearchResults.map((alb) => (
                        <button
                          key={alb.id}
                          type="button"
                          onClick={() => {
                            setSelectedAlbum(alb);
                            setAlbumSearchQuery('');
                            setAlbumSearchResults([]);
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left cursor-pointer transition-colors"
                        >
                          <img src={alb.cover} alt={alb.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-[#231123] dark:text-white truncate">
                              {alb.title}
                            </span>
                            <span className="text-[11px] text-[#5c435a] dark:text-gray-300 truncate">
                              {alb.artist} · {alb.year}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Álbum Seleccionado Activo */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-rose-50/60 dark:bg-[#231123]/60 border border-[#B80C09]/20">
                  <img
                    src={selectedAlbum.cover}
                    alt={selectedAlbum.title}
                    className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#5c1d5e] dark:text-pink-300 uppercase tracking-wider">
                      Álbum Seleccionado
                    </span>
                    <strong className="text-sm text-[#231123] dark:text-white truncate">
                      {selectedAlbum.title}
                    </strong>
                    <span className="text-xs text-[#5c435a] dark:text-gray-300 truncate">
                      {selectedAlbum.artist} {selectedAlbum.year ? `(${selectedAlbum.year})` : ''}
                    </span>
                  </div>
                </div>

                {/* Calificación */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
                    Puntuación (★ {rating} / 5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                          star <= rating ? 'text-[#B80C09]' : 'text-gray-300 dark:text-white/20'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texto del Ensayo */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
                    Tu Crítica / Ensayo
                  </label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Escribe tu análisis sobre la masterización, espacialidad, letras o texturas acústicas..."
                    required
                    className="w-full p-3.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#231123] text-sm text-[#231123] dark:text-white placeholder-[#5c435a]/60 dark:placeholder-gray-400 focus:outline-none focus:border-[#B80C09] resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">Etiquetas:</span>
                  {['Art Rock', 'Hi-Fi', 'Psicodelia', 'Vinilo', 'Electrónica', 'Mastering'].map((tag) => {
                    const isSelected = selectedReviewTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleComposerTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#B80C09] text-white'
                            : 'bg-gray-100 dark:bg-[#231123] text-[#5c435a] dark:text-gray-300 border border-[#e6d5e2] dark:border-white/10'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>

                {/* Botón Enviar */}
                <div className="flex justify-end gap-3 pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c435a] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    {isSubmitting ? 'Guardando en la API...' : 'Publicar Crítica en la API'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Principal: Feed de Actividad */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header del Feed & Pestañas de Filtro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
                  FEED EN VIVO · API
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight mt-0.5">
                  Conversación Musical
                </h2>
              </div>

              {/* Pestañas de Feed */}
              <div className="inline-flex items-center p-1 rounded-full bg-[#ede0eb] dark:bg-[#1f1020] border border-[#e2cedf] dark:border-white/10 gap-0.5 self-start sm:self-auto">
                {[
                  { id: 'recent', label: 'En Vivo' },
                  { id: 'top', label: 'Aclamadas' },
                  { id: 'hot', label: 'Debatidas' },
                ].map((tab) => {
                  const isActive = feedTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFeedTab(tab.id)}
                      style={{ borderRadius: '9999px', minHeight: 'auto' }}
                      className={`relative px-3.5 sm:px-4 py-1.5 !rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer select-none z-10 !border-0 !bg-transparent ${
                        isActive
                          ? 'text-white'
                          : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-community-tab"
                          className="absolute inset-0 bg-[#B80C09] rounded-full shadow-xs"
                          style={{ borderRadius: 9999 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Píldoras de Filtro por Etiquetas / Géneros */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5c1d5e] text-white shadow-xs'
                        : 'bg-white dark:bg-[#4B2840] text-[#5c435a] dark:text-gray-300 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
                    }`}
                  >
                    {tag === 'Todos' ? '✦ Todas' : `#${tag.replace(/\s+/g, '')}`}
                  </button>
                );
              })}
            </div>

            {/* Loader de Feed */}
            {isLoadingFeed ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-[#B80C09] border-t-transparent animate-spin" />
                <p className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                  Sincronizando reseñas con la API de Sonar...
                </p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[48px] text-[#5c435a] dark:text-[#B89CB0]">
                  forum
                </span>
                <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                  No hay críticas con esta etiqueta
                </h3>
                <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md">
                  ¡Sé el primero en abrir el diálogo con la etiqueta #{selectedTag}!
                </p>
                <button
                  type="button"
                  onClick={() => setIsComposing(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#B80C09] text-white text-xs font-bold cursor-pointer"
                >
                  Escribir Crítica
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
              >
                {filteredReviews.map((review) => (
                  <ReviewFeedCard key={review.id} review={review} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Columna Lateral (Widgets de la API) */}
          <aside className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
            {/* Widget 1: Usuarios Destacados desde la API */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6d5e2]/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#B80C09]">stars</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#231123] dark:text-white">
                    Usuarios Destacados
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c1d5e] dark:text-pink-300">
                  En Vivo
                </span>
              </div>

              <div className="flex flex-col gap-3.5">
                {featuredUsers.map((fUser) => {
                  const isFollowing = Boolean(followingMap[fUser.id]);
                  return (
                    <div
                      key={fUser.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#231123]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          name={fUser.name}
                          size="md"
                          className="w-10 h-10 ring-2 ring-[#e6d5e2]/60 dark:ring-white/15"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-[#231123] dark:text-white truncate">
                            {fUser.name}
                          </span>
                          <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                            {fUser.handle} · {fUser.reviews}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFollow(fUser)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isFollowing
                            ? 'bg-emerald-600 text-white border border-emerald-600 shadow-xs'
                            : 'border border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white'
                        }`}
                      >
                        {isFollowing ? '✓ Siguiendo' : '+ Seguir'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget 2: Artistas Recomendados para Seguir */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6d5e2]/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#B80C09]">person_play</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#231123] dark:text-white">
                    Artistas de Culto
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c1d5e] dark:text-pink-300">
                  Comunidad
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { name: 'Radiohead', genre: 'Art Rock', cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg' },
                  { name: 'Tame Impala', genre: 'Psychedelic Pop', cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/250x250-000000-80-0-0.jpg' },
                  { name: 'Daft Punk', genre: 'French Touch', cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/250x250-000000-80-0-0.jpg' },
                  { name: 'Rosalía', genre: 'Flamenco Pop / Art', cover: 'https://cdn-images.dzcdn.net/images/cover/01ca573e86c12d222213d2fa15c3272d/250x250-000000-80-0-0.jpg' },
                  { name: 'Kendrick Lamar', genre: 'Hip Hop / Jazz', cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/250x250-000000-80-0-0.jpg' },
                ].map((art) => {
                  const isFollowingArtist = Boolean(followingArtistsMap[art.name.toLowerCase()]);
                  return (
                    <div key={art.name} className="flex items-center justify-between gap-3 p-1.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={art.cover} alt={art.name} className="w-9 h-9 rounded-xl object-cover shadow-2xs shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#231123] dark:text-white truncate">{art.name}</span>
                          <span className="text-[10px] text-[#5c435a] dark:text-[#B89CB0] truncate">{art.genre}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleFollowArtist(art.name, art)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isFollowingArtist
                            ? 'bg-rose-900/40 text-rose-300 border border-rose-400/30'
                            : 'border border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {isFollowingArtist ? 'check' : 'add'}
                        </span>
                        <span>{isFollowingArtist ? 'Siguiendo' : 'Seguir'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget 3: Disco Más Debatido de la Semana */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#4B2840] to-[#231123] text-white border border-white/10 shadow-lg flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B80C09]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-300">
                  DEBATE DE LA SEMANA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#B80C09] text-white text-[10px] font-black">
                  DEEZER API
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src="https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg"
                  alt="In Rainbows"
                  className="w-16 h-16 rounded-xl object-cover shadow-md shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">In Rainbows</h4>
                  <p className="text-xs text-pink-200 truncate">Radiohead (2007)</p>
                  <p className="text-[11px] text-white/70 mt-0.5">84 audiófilos debatiendo</p>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed italic border-t border-white/10 pt-3">
                “¿Es la masterización de 2007 superior a los lanzamientos contemporáneos en streaming de alta resolución?”
              </p>

              <button
                type="button"
                onClick={() => {
                  playTrack({
                    id: 14880659,
                    deezerId: 14880659,
                    title: 'In Rainbows',
                    artist: 'Radiohead',
                    album: 'In Rainbows',
                    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Escuchar Álbum del Debate</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          title={toastMessage.title}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default CommunityPage;
