import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import StarRating from '../../shared/components/ui/star-rating';
import ReviewForm from '../../features/reviews/components/review-form';
import ReviewFeedCard from '../../features/reviews/components/review-feed-card';
import Toast from '../../shared/components/ui/toast';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';

const mockAlbum = {
  id: 'in-rainbows',
  title: 'In Rainbows',
  artist: 'Radiohead',
  year: '2007',
  genre: 'Art Rock / Experimental',
  duration: '10 canciones · 42 min 39 s',
  rating: 4.8,
  totalReviews: '24,812 calificaciones',
  cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
  previewUrl: 'https://cdns-preview-d.dzcdn.net/stream/c-d64e83c6d1d4d12bdfd0ef48e2448ca3-3.mp3',
  lyricContext:
    'Exploración introspectiva de la vulnerabilidad humana, la obsesión y la redención en la era digital. Cada composición entrelaza texturas acústicas con meticulosas capas de sintetizadores modulares, creando una atmósfera sonora cálida pero desgarradora. El concepto lírico profundiza en la finitud, el amor obsesivo y la disolución de la identidad.',
};

export const AlbumDetailPage = () => {
  const { user } = useAuth();
  const { playTrack, isPlaying, currentTrack } = usePlayer();
  const userId = user?.id || null;

  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [albumReviews, setAlbumReviews] = useState([
    {
      id: 1,
      userName: 'Sofía Sound',
      userHandle: '@sofia_sound',
      avatarLetter: 'S',
      avatarBg: '#5c1d5e',
      date: 'Hace 2 horas',
      rating: 5,
      albumTitle: 'In Rainbows',
      artist: 'Radiohead',
      cover: mockAlbum.cover,
      content:
        'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
      likesCount: 142,
      commentsCount: 18,
    },
  ]);

  useEffect(() => {
    setIsSaved(interactionsService.isAlbumSaved(userId, mockAlbum.title));
  }, [userId]);

  const handleToggleSave = () => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const res = interactionsService.toggleSaveAlbum(userId, {
      id: mockAlbum.id,
      title: mockAlbum.title,
      artist: mockAlbum.artist,
      cover: mockAlbum.cover,
      year: mockAlbum.year,
      genre: mockAlbum.genre,
      rating: mockAlbum.rating,
    });
    setIsSaved(res.isSaved);
    setToastMessage(
      res.isSaved
        ? `¡${mockAlbum.title} agregado a tus álbumes guardados!`
        : `Eliminado de tus colecciones.`
    );
  };

  const handleReviewSubmit = (reviewData) => {
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    const newReview = {
      id: Date.now(),
      userName: user?.username || 'Usuario Sonar',
      userHandle: user?.username ? `@${user.username.toLowerCase().replace(/\s+/g, '_')}` : '@usuario',
      avatarLetter: (user?.username || 'U').charAt(0).toUpperCase(),
      avatarBg: user?.avatarBg || '#B80C09',
      date: 'Ahora mismo',
      rating: reviewData.rating || 5,
      albumTitle: mockAlbum.title,
      artist: mockAlbum.artist,
      cover: mockAlbum.cover,
      content: reviewData.reviewText,
      likesCount: 0,
      commentsCount: 0,
    };

    setAlbumReviews((prev) => [newReview, ...prev]);
    setToastMessage(`¡Tu reseña de ${mockAlbum.title} fue publicada con éxito!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Barra de Navegación Fija */}
      <Navbar />

      <main className="w-full flex-1 flex flex-col">
        {/* Header Inmersivo del Álbum */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#231123] via-[#35162d] to-gray-50 dark:to-[#231123] text-white pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
          {/* Resplandor ambiental de fondo */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#B80C09]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 lg:gap-10">
            {/* Carátula Grande */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shrink-0 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] border border-white/15 bg-[#180e1a]"
            >
              <img
                src={mockAlbum.cover}
                alt={mockAlbum.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Metadatos y Puntuación */}
            <div className="flex flex-col gap-2.5 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-pink-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-pulse" />
                  <span>{mockAlbum.genre}</span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-[#B80C09] text-white'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                  <span>{isSaved ? 'En Tu Colección' : 'Guardar en Colección'}</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {mockAlbum.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm sm:text-base text-gray-300 font-medium">
                <span className="font-bold text-white">{mockAlbum.artist}</span>
                <span className="text-white/30">·</span>
                <span>{mockAlbum.year}</span>
                <span className="text-white/30">·</span>
                <span>{mockAlbum.duration}</span>
              </div>

              {/* Calificación Promedio con StarRating */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <StarRating value={5} readOnly size={22} />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {mockAlbum.rating}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300">
                    / 5.0 ({mockAlbum.totalReviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido en 2 Columnas (Layout Grid) */}
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Columna Principal (2 espacios) */}
            <div className="md:col-span-2 flex flex-col gap-8">
              {/* Contenedor: Contexto Lírico (Poblado por IA) */}
              <article className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_8px_30px_-4px_rgba(75,40,64,0.06)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] transition-colors duration-300">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#e6d5e2]/80 dark:border-white/10 mb-4">
                  <span className="material-symbols-outlined text-[20px] text-[#B80C09]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white tracking-tight">
                    Análisis & Contexto Lírico
                  </h3>
                  <span className="ml-auto text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 border border-[#e6d5e2] dark:border-white/10">
                    Generado por IA Sonar
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#5c435a] dark:text-gray-200 leading-relaxed italic">
                  “{mockAlbum.lyricContext}”
                </p>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#81737e] dark:text-[#B89CB0] border-t border-[#e6d5e2]/50 dark:border-white/10">
                  <span>Fuente: Archivo Acústico y Análisis de Letras Sonar</span>
                  <span className="text-[#B80C09] font-bold">100% Verificado</span>
                </div>
              </article>

              {/* Formulario de Calificación y Reseña */}
              <ReviewForm
                albumTitle={mockAlbum.title}
                artistName={mockAlbum.artist}
                onSubmit={handleReviewSubmit}
              />

              {/* Reseñas de la Comunidad para este Álbum */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-extrabold text-[#231123] dark:text-white tracking-tight">
                  Críticas y Apreciaciones de la Comunidad ({albumReviews.length})
                </h3>
                <div className="flex flex-col gap-5">
                  {albumReviews.map((rev) => (
                    <ReviewFeedCard key={rev.id} review={rev} />
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Lateral (1 espacio): Simulador de Reproductor Deezer */}
            <aside className="md:col-span-1 flex flex-col gap-6 sticky top-24">
              <div className="aspect-square w-full rounded-3xl bg-[#121216] border border-white/10 p-6 flex flex-col justify-between text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                {/* Resplandor Deezer */}
                <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#B80C09]/30 rounded-full blur-[60px] pointer-events-none" />

                {/* Header del Reproductor */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09]" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/90">
                      Deezer Player
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-white/60 uppercase px-2 py-0.5 rounded-md bg-white/10">
                    FLAC · 24-bit
                  </span>
                </div>

                {/* Centro con Botón Play y Arte */}
                <div className="flex flex-col items-center justify-center my-auto z-10 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() =>
                      playTrack({
                        id: mockAlbum.id,
                        title: '15 Step',
                        artist: mockAlbum.artist,
                        album: mockAlbum.title,
                        cover: mockAlbum.cover,
                        preview: mockAlbum.previewUrl,
                      })
                    }
                    aria-label="Reproducir muestra de Deezer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(184,12,9,0.5)] cursor-pointer group-hover:bg-[#9c0a07] transition-all"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </motion.button>
                  <div className="text-center">
                    <span className="text-sm font-bold text-white block">
                      15 Step
                    </span>
                    <span className="text-xs text-white/60">
                      Vista previa de 30 segundos
                    </span>
                  </div>
                </div>

                {/* Barra de Progreso y Ecualizador */}
                <div className="flex flex-col gap-2 z-10">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-[#B80C09] rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>0:10</span>
                    <span>0:30</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AlbumDetailPage;

