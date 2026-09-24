import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';
import { useAuth } from '../../shared/context/auth-context';
import Toast from '../../shared/components/ui/toast';

const FEATURED_EDITORIAL_REVIEWS = [
  {
    id: 1,
    albumTitle: 'In Rainbows',
    artist: 'Radiohead',
    year: '2007',
    genre: 'Art Rock',
    rating: 5.0,
    reviewer: 'Mateo Valenzuela',
    role: 'Editor Senior de Audio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
    deezerId: 14880659,
    trackId: 138546803,
    title: 'La cima del balance analógico-digital en el siglo XXI',
    snippet: 'Radiohead despojó las capas de frialdad tecnológica de Kid A para abrazar una calidez orgánica insólita. "Reckoner" y "Nude" son catedrales armónicas donde la batería de Phil Selway y la reverberación vocal de Yorke alcanzan una fidelidad milimétrica.',
    fullReview: 'Diez temas, ni un solo segundo de relleno. In Rainbows no solo transformó la distribución discográfica en 2007, sino que cimentó un nuevo estándar de producción sonora. Cada arpegio de Jonny Greenwood y cada línea de bajo de Colin Greenwood respiran en un campo estéreo envolvente. Para audiófilos, el prensado en vinilo doble a 45 RPM es una pieza obligatoria en cualquier colección.',
    likes: 342,
    badge: 'Selección Editorial',
    tags: ['Mastering Impecable', 'Vinilo Esencial', 'Obra Maestra'],
  },
  {
    id: 2,
    albumTitle: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    genre: 'Psicodelia',
    rating: 4.8,
    reviewer: 'Sofia Chen',
    role: 'Crítica Musical & Ingeniera de Mezcla',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg',
    deezerId: 10709540,
    trackId: 102379366,
    title: 'Psicodelia sintética con compresión milimétrica',
    snippet: 'Kevin Parker reinventó el sonido de la década. El tratamiento de la fase en "Let It Happen" y la calidez del sintetizador Roland Juno-106 generan una espacialidad tridimensional que premia el uso de monitores de alta gama.',
    fullReview: 'Currents es una lección magistral de masterización moderna. El bombo y el bajo están saturados al punto exacto de ebullición sin distorsionar la imagen estéreo. Las texturas son sedosas, brillantes y adictivas.',
    likes: 289,
    badge: 'Voto de la Comunidad',
    tags: ['Ingeniería de Audio', 'Psicodelia Pop'],
  },
  {
    id: 3,
    albumTitle: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    genre: 'Hip-Hop Experimental',
    rating: 5.0,
    reviewer: 'Alejandro Ramos',
    role: 'Curador de Jazz & Hip-Hop',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg',
    deezerId: 9896728,
    trackId: 9896730,
    title: 'Monumento sociopolítico con orquestación de Free Jazz',
    snippet: 'La presencia de Thundercat en el bajo de seis cuerdas, Kamasi Washington en los vientos y Terrace Martin en la producción convirtió este disco en una suite de jazz y funk que desafía el canon del rap contemporáneo.',
    fullReview: 'Un testimonio visceral y orquestal. Desde los microtonos de saxofón hasta la crudeza poética de "How Much a Dollar Cost", TPAB no busca complacer, sino conmover y confrontar.',
    likes: 512,
    badge: 'Puntuación Perfecta',
    tags: ['Jazz Fusion', 'Lírica Trascendental', 'Clásico'],
  },
  {
    id: 4,
    albumTitle: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    genre: 'Ambient & Drone',
    rating: 4.9,
    reviewer: 'Camila Delgado',
    role: 'Especialista en Música Electrónica',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg',
    deezerId: 537883642,
    trackId: 541097242,
    title: 'Microrritmos domésticos y arpas celestiales',
    snippet: 'Grabado a base de samples de cartas barajándose, hielo resquebrajándose y cajas de música, Vespertine es una de las declaraciones de intimidad acústica más puras en la historia de la música grabada.',
    fullReview: 'Una arquitectura sonora frágil pero monumental. Björk y Matmos lograron que el silencio y los susurros tengan el mismo peso emocional que un coro sinfónico completo.',
    likes: 198,
    badge: 'Selección Editorial',
    tags: ['Vanguardia', 'Micro-sonidos', 'Imprescindible'],
  }
];

export const ReviewsFeedPage = () => {
  const { playTrack, toggleTrack, currentTrack, isPlaying, openReviewModal } = usePlayer();
  const { user } = useAuth() || {};
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedReview, setSelectedReview] = useState(null);
  const [likedReviews, setLikedReviews] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const genres = ['Todos', 'Art Rock', 'Psicodelia', 'Hip-Hop Experimental', 'Ambient & Drone'];

  const filteredReviews = useMemo(() => {
    if (selectedGenre === 'Todos') return FEATURED_EDITORIAL_REVIEWS;
    return FEATURED_EDITORIAL_REVIEWS.filter(r => r.genre === selectedGenre);
  }, [selectedGenre]);

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedReviews(prev => {
      const isLiked = prev[id];
      const updated = { ...prev, [id]: !isLiked };
      setToastMessage(!isLiked ? 'Añadiste una reacción de Criterio Audiófilo' : 'Reacción retirada');
      return updated;
    });
  };

  const handlePlay = (rev, e) => {
    e?.stopPropagation();
    toggleTrack({
      id: rev.deezerId || rev.id,
      deezerId: rev.deezerId,
      trackId: rev.trackId,
      title: rev.albumTitle,
      artist: rev.artist,
      album: rev.albumTitle,
      cover: rev.cover,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header de la Página */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e6d5e2] dark:border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
                CURADURÍA & ENSAYOS DE FONDO
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
              Críticas del Mes
            </h1>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
              Análisis exhaustivos, disección de producción analógica y evaluaciones sonoras elaboradas por el consejo editorial y críticos destacados de Sonar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const defaultAlbum = filteredReviews[0] || FEATURED_EDITORIAL_REVIEWS[0];
              openReviewModal({
                id: defaultAlbum?.deezerId || defaultAlbum?.id || 14880659,
                deezerId: defaultAlbum?.deezerId || 14880659,
                title: defaultAlbum?.albumTitle || 'In Rainbows',
                album: defaultAlbum?.albumTitle || 'In Rainbows',
                artist: defaultAlbum?.artist || 'Radiohead',
                cover: defaultAlbum?.cover || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
                type: 'album',
              });
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            <span>Publicar Mi Crítica</span>
          </button>
        </div>

        {/* Filtros por Género */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[#B80C09] text-white shadow-md'
                  : 'bg-white dark:bg-[#4B2840] text-[#5c435a] dark:text-[#B89CB0] border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Grid de Reseñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map(rev => {
            const isPlayingThis = (currentTrack?.album === rev.albumTitle || currentTrack?.deezerId === rev.deezerId) && isPlaying;
            const isLiked = likedReviews[rev.id];

            return (
              <motion.article
                key={rev.id}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(75,40,64,0.06)] dark:shadow-xl transition-all"
              >
                <div>
                  {/* Encabezado del Álbum & Reviewer */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-md group">
                      <img
                        src={rev.cover}
                        alt={rev.albumTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => handlePlay(rev, e)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Escuchar muestra"
                      >
                        <span className="material-symbols-outlined text-white text-[28px]">
                          {isPlayingThis ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-[10px] font-extrabold uppercase">
                          {rev.badge}
                        </span>
                        <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-semibold">
                          {rev.genre} · {rev.year}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#231123] dark:text-white truncate">
                        {rev.albumTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] font-medium">
                        {rev.artist}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, idx) => (
                            <span
                              key={idx}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-black text-[#231123] dark:text-white">
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Título de la Crítica y Snippet */}
                  <h4 className="text-base sm:text-lg font-extrabold text-[#231123] dark:text-white mb-2 leading-snug">
                    «{rev.title}»
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-[#d8c5d3] mb-4">
                    {rev.snippet}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {rev.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[11px] font-bold text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer de la tarjeta con autor y acciones */}
                <div className="pt-4 border-t border-[#e6d5e2]/80 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatar}
                      alt={rev.reviewer}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#B80C09]/30"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#231123] dark:text-white block leading-none">
                        {rev.reviewer}
                      </span>
                      <span className="text-[10px] text-[#5c435a] dark:text-[#B89CB0]">
                        {rev.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(rev.id, e)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-[#B80C09] text-white'
                          : 'bg-[#ede0eb] dark:bg-white/10 text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span>{rev.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={() =>
                        openReviewModal({
                          id: rev.deezerId || rev.id,
                          deezerId: rev.deezerId,
                          trackId: rev.trackId,
                          title: rev.albumTitle,
                          album: rev.albumTitle,
                          artist: rev.artist,
                          cover: rev.cover,
                          type: 'album',
                        })
                      }
                      className="px-3 py-1.5 rounded-full bg-[#f8e9f6] dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#B80C09] dark:text-pink-300 transition-colors cursor-pointer flex items-center gap-1"
                      title={`Escribir crítica para ${rev.albumTitle}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      <span>Criticar</span>
                    </button>

                    <button
                      onClick={() => setSelectedReview(rev)}
                      className="px-3 py-1.5 rounded-full bg-white dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-xs font-bold text-[#5c1d5e] dark:text-pink-300 hover:bg-[#f8e9f6] transition-colors cursor-pointer"
                    >
                      Leer Ensayo
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>

      {/* Modal de Ensayo Completo */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedReview.cover}
                  alt={selectedReview.albumTitle}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-black text-[#231123] dark:text-white">
                    {selectedReview.albumTitle}
                  </h3>
                  <p className="text-sm text-[#5c435a] dark:text-[#B89CB0]">
                    {selectedReview.artist} · {selectedReview.year}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-[#231123] dark:text-white mb-4">
                {selectedReview.title}
              </h2>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
                <p>{selectedReview.snippet}</p>
                <p>{selectedReview.fullReview}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedReview.avatar}
                    alt={selectedReview.reviewer}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm font-bold text-[#231123] dark:text-white block">
                      {selectedReview.reviewer}
                    </span>
                    <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                      {selectedReview.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePlay(selectedReview)}
                  className="px-4 py-2 rounded-xl bg-[#B80C09] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:bg-[#9c0a07] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Escuchar Muestra</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ReviewsFeedPage;
