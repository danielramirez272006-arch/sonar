import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../../shared/context/player-context';
import { useAuth } from '../../../shared/context/auth-context';
import { interactionsService } from '../../../shared/services/interactions-service';
import Toast from '../../../shared/components/ui/toast';

export const ALL_SPOTLIGHT_ALBUMS = [
  {
    id: 14880659,
    trackId: 138546803,
    deezerId: 14880659,
    title: 'In Rainbows',
    artist: 'Radiohead',
    year: '2007',
    tracksCount: '10 Canciones',
    duration: '42 min',
    genre: 'Art Rock',
    rating: 4.8,
    reviewsCount: '24,812 calificaciones',
    labelColor: '#B80C09',
    quote: '“Una obra maestra visceral de texturas digitales y calidez analógica. Una experiencia sónica introspectiva y universal que redefinió el canon de la música moderna.”',
    editorialTag: 'Criterio Impecable',
    badgeHonor: '#1 en Lo Mejor de 2007',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 10709540,
    trackId: 102379366,
    deezerId: 10709540,
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    tracksCount: '13 Canciones',
    duration: '51 min',
    genre: 'Psicodelia',
    rating: 4.7,
    reviewsCount: '31,450 calificaciones',
    labelColor: '#6366f1',
    quote: '“Kevin Parker encapsuló la transformación del pop psicodélico del siglo XXI con líneas de bajo memorables y producción hiper-detallada.”',
    editorialTag: 'Joya Psicodélica',
    badgeHonor: '#1 en Álbumes de 2015',
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 344137457,
    trackId: 344137467,
    deezerId: 344137457,
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    tracksCount: '17 Canciones',
    duration: '60 min',
    genre: 'Neo-Soul',
    rating: 4.9,
    reviewsCount: '42,100 calificaciones',
    labelColor: '#059669',
    quote: '“Una obra minimalista e íntima que redefinió el R&B moderno a través de confesiones crudas, guitarras reverberadas y una atmósfera inigualable.”',
    editorialTag: 'Hito Generacional',
    badgeHonor: '#1 en R&B de la Década',
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 537883642,
    trackId: 541097242,
    deezerId: 537883642,
    title: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    tracksCount: '12 Canciones',
    duration: '55 min',
    genre: 'Ambient & Drone',
    rating: 4.9,
    reviewsCount: '18,920 calificaciones',
    labelColor: '#0284c7',
    quote: '“Una oda a la intimidad acústica creada a partir de micro-sonidos domésticos, arpas celestiales y la voz más etérea de nuestra época.”',
    editorialTag: 'Vanguardia Sonora',
    badgeHonor: 'Obra Maestra del Siglo XXI',
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 9896728,
    trackId: 9896730,
    deezerId: 9896728,
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    tracksCount: '16 Canciones',
    duration: '78 min',
    genre: 'Hip-Hop Experimental',
    rating: 5.0,
    reviewsCount: '58,320 calificaciones',
    labelColor: '#d97706',
    quote: '“Fusión monumental de free-jazz, funk y poesía de calle. Una cátedra de orquestación analógica que trasciende géneros.”',
    editorialTag: 'Magnum Opus',
    badgeHonor: 'Puntuación Perfecta Sonar',
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg',
  },
  {
    id: 302127,
    trackId: 3135556,
    deezerId: 302127,
    title: 'Discovery',
    artist: 'Daft Punk',
    year: '2001',
    tracksCount: '14 Canciones',
    duration: '60 min',
    genre: 'Electrónica',
    rating: 4.8,
    reviewsCount: '36,190 calificaciones',
    labelColor: '#7c3aed',
    quote: '“El pináculo del French Touch: compresión analógica, sintetizadores vintage y líneas de bajo que marcaron la historia de la música electrónica.”',
    editorialTag: 'Clásico del House',
    badgeHonor: 'Imprescindible en Vinilo',
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg',
  },
];

export const AlbumOfTheWeek = () => {
  const { user } = useAuth() || {};
  const { playTrack, toggleTrack, currentTrack, isPlaying, openReviewModal } = usePlayer();
  const [toastMessage, setToastMessage] = useState(null);

  const userPreferences = useMemo(() => {
    return user?.preferences || ['Art Rock', 'Electrónica'];
  }, [user]);

  // Ordenar los álbumes del spotlight priorizando las preferencias del usuario activo
  const sortedSpotlightAlbums = useMemo(() => {
    return [...ALL_SPOTLIGHT_ALBUMS].sort((a, b) => {
      const matchA = userPreferences.some(p => p.toLowerCase() === a.genre.toLowerCase() || a.genre.toLowerCase().includes(p.toLowerCase()));
      const matchB = userPreferences.some(p => p.toLowerCase() === b.genre.toLowerCase() || b.genre.toLowerCase().includes(p.toLowerCase()));
      if (matchA && !matchB) return -1;
      if (!matchA && matchB) return 1;
      return b.rating - a.rating;
    });
  }, [userPreferences]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Al cambiar usuario o preferencias, resetear al álbum con mayor afinidad
  useEffect(() => {
    setSelectedIndex(0);
  }, [userPreferences]);

  const currentAlbum = sortedSpotlightAlbums[selectedIndex] || sortedSpotlightAlbums[0];
  const isCurrentPlaying = (currentTrack?.id === currentAlbum.id || currentTrack?.trackId === currentAlbum.trackId || currentTrack?.title === currentAlbum.title) && isPlaying;
  const isSaved = interactionsService.isAlbumSaved(user?.id, currentAlbum.title);

  const isUserGenreMatch = userPreferences.some(
    p => p.toLowerCase() === currentAlbum.genre.toLowerCase() || currentAlbum.genre.toLowerCase().includes(p.toLowerCase())
  );

  const handleToggleSave = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleSaveAlbum(user.id, {
      id: currentAlbum.id,
      deezerId: currentAlbum.deezerId,
      title: currentAlbum.title,
      artist: currentAlbum.artist,
      cover: currentAlbum.cover,
      genre: currentAlbum.genre,
      year: currentAlbum.year,
      rating: currentAlbum.rating,
    });
    setToastMessage(res.isSaved ? `"${currentAlbum.title}" guardado en tu colección` : `"${currentAlbum.title}" eliminado de tu colección`);
  };

  const handleSurpriseMe = () => {
    const nextIdx = (selectedIndex + 1 + Math.floor(Math.random() * (sortedSpotlightAlbums.length - 1))) % sortedSpotlightAlbums.length;
    setSelectedIndex(nextIdx);
    const chosen = sortedSpotlightAlbums[nextIdx];
    playTrack({
      id: chosen.id,
      trackId: chosen.trackId,
      deezerId: chosen.deezerId,
      title: chosen.title,
      artist: chosen.artist,
      album: chosen.title,
      cover: chosen.cover,
    });
  };

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-12 pt-8 pb-12 overflow-hidden bg-gradient-to-b from-[#fff7fa] via-white to-[#fff7fa] dark:from-[#231123] dark:via-[#1c0d1c] dark:to-[#231123] transition-colors duration-300">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -top-20 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-rose-200/40 dark:bg-[#B80C09]/15 blur-[100px] sm:blur-[140px] pointer-events-none -z-10 transition-colors duration-300" />
      <div className="absolute top-1/3 right-10 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-purple-200/35 dark:bg-[#4B2840]/30 blur-[90px] sm:blur-[130px] pointer-events-none -z-10 transition-colors duration-300" />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="max-w-[1380px] mx-auto flex flex-col gap-6">
        {/* Cabecera Superior con Insignia de Personalización */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#5c1d5e] dark:text-pink-300 font-black">
              {user ? `FRECUENCIA PERSONALIZADA · @${user.username?.split(' ')[0] || user.username}` : 'VITRINA EDITORIAL AUDIÓFILA'}
            </span>
            {user && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ede0eb] dark:bg-white/10 text-[11px] font-bold text-[#5c1d5e] dark:text-pink-200">
                <span>Tus gustos:</span>
                <span className="text-[#B80C09] dark:text-pink-300 font-extrabold">{userPreferences.join(', ')}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSurpriseMe}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#4B2840] hover:bg-[#B80C09] hover:text-white dark:hover:bg-[#B80C09] border border-[#e6d5e2] dark:border-white/10 text-xs font-bold text-[#231123] dark:text-white shadow-xs transition-all cursor-pointer group"
            title="Reproducir una joya musical aleatoria"
          >
            <span className="text-sm group-hover:rotate-45 transition-transform">🎲</span>
            <span>Sorpréndeme (Ruleta)</span>
          </button>
        </div>

        {/* Presentación Principal del Vinilo y Reseña */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlbum.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Vinilo & Funda Deslizante */}
            <div className="w-full lg:col-span-6 flex justify-center items-center py-2 sm:py-6">
              <div
                onClick={() =>
                  toggleTrack({
                    id: currentAlbum.id,
                    trackId: currentAlbum.trackId,
                    deezerId: currentAlbum.deezerId,
                    title: currentAlbum.title,
                    artist: currentAlbum.artist,
                    album: currentAlbum.title,
                    cover: currentAlbum.cover,
                  })
                }
                className="relative group cursor-pointer select-none max-w-full"
                title="Haz clic para escuchar la muestra de 30s"
              >
                {/* Disco de Vinilo Deslizante con Surcos Analógicos */}
                <div
                  className={`absolute top-2 sm:top-4 right-0 w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] rounded-full bg-[#181119] shadow-[0_16px_40px_rgba(0,0,0,0.45)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-700 ease-out transform ${
                    isCurrentPlaying
                      ? 'translate-x-12 sm:translate-x-20 md:translate-x-28 rotate-180 animate-spin-slow'
                      : 'translate-x-6 sm:translate-x-10 group-hover:translate-x-12 sm:group-hover:translate-x-20 md:group-hover:translate-x-28 group-hover:rotate-45'
                  }`}
                  style={{ animationDuration: '8s' }}
                >
                  <div className="absolute inset-2 rounded-full border border-white/10" />
                  <div className="absolute inset-5 sm:inset-6 rounded-full border border-white/10" />
                  <div className="absolute inset-8 sm:inset-10 rounded-full border border-white/10" />
                  <div className="absolute inset-12 sm:inset-14 rounded-full border border-white/10" />
                  <div className="absolute inset-16 sm:inset-20 rounded-full border border-white/10" />

                  {/* Etiqueta Central del Vinilo */}
                  <div
                    className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-inner relative p-2 text-center ring-2 ring-white/20 transition-colors"
                    style={{ backgroundColor: currentAlbum.labelColor }}
                  >
                    <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#181119] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] mb-0.5" />
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-tighter text-white font-black leading-none truncate max-w-[90%]">
                      {currentAlbum.artist}
                    </span>
                    <span className="text-[7px] sm:text-[8px] text-white/80 tracking-widest mt-0.5 font-medium">
                      SIDE A · 33⅓ RPM
                    </span>
                  </div>

                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Funda Externa del Álbum */}
                <div className="relative z-10 w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] rounded-2xl overflow-hidden shadow-[0_20px_45px_-10px_rgba(75,40,64,0.2)] dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8)] bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 transition-transform duration-500 group-hover:-translate-y-1 flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt={`${currentAlbum.title} by ${currentAlbum.artist}`}
                    src={currentAlbum.cover}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                  {/* Badge LP de vinilo sobre la portada */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-md bg-white/95 dark:bg-[#231123]/90 backdrop-blur-md flex items-center gap-1.5 shadow-md border border-white/60 dark:border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-ping" />
                    <span className="text-[10px] sm:text-[11px] uppercase text-[#231123] dark:text-white tracking-wider font-extrabold">
                      33 RPM LP
                    </span>
                  </div>

                  {/* Botón flotante Play en el centro de la carátula */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">
                        {isCurrentPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Editorial & Metadatos */}
            <div className="w-full lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 lg:pl-2 text-left">
              {/* Badge de Afinidad o Destacado */}
              <div className="flex flex-wrap items-center gap-2">
                {isUserGenreMatch ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Recomendado por tu afinidad con {currentAlbum.genre}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c1d5e] dark:text-pink-200 text-xs font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[14px] text-[#B80C09]">star</span>
                    <span>Álbum Destacado de la Semana</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-white dark:bg-white/10 border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-300 text-[11px] font-bold">
                  {currentAlbum.genre}
                </span>
              </div>

              {/* Título y Artista */}
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#231123] dark:text-[#FAF5F8] tracking-tight leading-none">
                  {currentAlbum.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#5c435a] dark:text-[#B89CB0] font-semibold pt-1">
                  <span className="text-[#231123] dark:text-white font-bold">{currentAlbum.artist}</span>
                  <span>·</span>
                  <span>{currentAlbum.year}</span>
                  <span>·</span>
                  <span>{currentAlbum.tracksCount}</span>
                  <span>·</span>
                  <span>{currentAlbum.duration}</span>
                </div>
              </div>

              {/* Calificación Sonar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-[#231123] dark:text-white">
                    {currentAlbum.rating}
                  </span>
                  <span className="text-xs text-[#5c435a] dark:text-gray-400">
                    / 5.0 ({currentAlbum.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Sinopsis Editorial */}
              <blockquote className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-md">
                <p className="text-xs sm:text-sm md:text-base text-[#231123]/90 dark:text-gray-100 leading-relaxed italic">
                  {currentAlbum.quote}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-[#5c435a] dark:text-gray-400 border-t border-[#e6d5e2]/60 dark:border-white/10 pt-2">
                  <span>— Consejo Editorial Sonar</span>
                  <span className="font-bold text-[#5c1d5e] dark:text-pink-300 uppercase tracking-wider text-[11px]">
                    {currentAlbum.editorialTag}
                  </span>
                </div>
              </blockquote>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    toggleTrack({
                      id: currentAlbum.id,
                      trackId: currentAlbum.trackId,
                      deezerId: currentAlbum.deezerId,
                      title: currentAlbum.title,
                      artist: currentAlbum.artist,
                      album: currentAlbum.title,
                      cover: currentAlbum.cover,
                    })
                  }
                  className="flex items-center gap-1.5 sm:gap-2 px-5 py-3 rounded-xl bg-[#B80C09] text-white text-xs sm:text-sm uppercase tracking-wider shadow-[0_8px_24px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] transition-all font-bold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isCurrentPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isCurrentPlaying ? 'Pausar Muestra' : 'Escuchar Ahora (30s)'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openReviewModal({ title: currentAlbum.title, artist: currentAlbum.artist, cover: currentAlbum.cover, id: currentAlbum.id })}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-3 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#4B2840] dark:text-white text-xs sm:text-sm uppercase tracking-wider shadow-xs hover:bg-[#f8e9f6] dark:hover:bg-[#5d3350] transition-all font-semibold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#B80C09]">
                    rate_review
                  </span>
                  <span>Escribir Reseña</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleToggleSave}
                  aria-label="Guardar álbum en colección"
                  className={`p-3 rounded-xl border transition-colors shadow-xs cursor-pointer flex items-center justify-center ${
                    isSaved
                      ? 'bg-[#B80C09] text-white border-[#B80C09]'
                      : 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09] hover:border-[#B80C09]'
                  }`}
                  type="button"
                  title={isSaved ? 'Quitar de tu colección' : 'Guardar en tu colección'}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {isSaved ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AlbumOfTheWeek;
