import { useReviews } from '../../features/reviews/use-reviews.js';

import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import ReviewFeedCard from '../../features/reviews/components/review-feed-card';

const mockFeedReviews = [
  {
    id: 1,
    userName: 'Sofía Sound',
    userHandle: '@sofia_sound',
    avatarLetter: 'S',
    avatarBg: '#5c1d5e',
    date: 'Hace 20 min',
    rating: 5,
    albumTitle: 'In Rainbows',
    artist: 'Radiohead',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    content:
      'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
    likesCount: 142,
    commentsCount: 18,
  },
  {
    id: 2,
    userName: 'Marcos Vinyl',
    userHandle: '@marcos_vinyl',
    avatarLetter: 'M',
    avatarBg: '#B80C09',
    date: 'Hace 1 hora',
    rating: 4.5,
    albumTitle: 'Discovery',
    artist: 'Daft Punk',
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    content:
      'El trabajo de compresión y dinámica en pista analógica es demoledor. Giorgio by Moroder es un homenaje absoluto a la historia de los sintetizadores modulares.',
    likesCount: 98,
    commentsCount: 12,
  },
  {
    id: 3,
    userName: 'Elena Analog',
    userHandle: '@elena_analog',
    avatarLetter: 'E',
    avatarBg: '#75527b',
    date: 'Hace 3 horas',
    rating: 5,
    albumTitle: 'Vespertine',
    artist: 'Björk',
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    content:
      'Melancolía nocturna capturada en vinilo craquelado. La textura de las voces sampleadas crea una atmósfera lluviosa e íntima difícil de replicar.',
    likesCount: 76,
    commentsCount: 9,
  },
  {
    id: 4,
    userName: 'Carlos Beats',
    userHandle: '@carlos_beats',
    avatarLetter: 'C',
    avatarBg: '#231123',
    date: 'Hace 5 horas',
    rating: 4.8,
    albumTitle: 'Currents',
    artist: 'Tame Impala',
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
    content:
      'Un renacimiento psicodélico impecable. Los bajos envolventes de "Let It Happen" demuestran un estándar de masterización asombroso para la era digital.',
    likesCount: 64,
    commentsCount: 7,
  },
];

const mockFeaturedUsers = [
  {
    id: 1,
    name: 'Valeria Moreno',
    handle: '@val_acoustics',
    initial: 'V',
    bg: '#5c1d5e',
    reviews: '312 reseñas',
  },
  {
    id: 2,
    name: 'Rodrigo Bass',
    handle: '@rodrigo_hifi',
    initial: 'R',
    bg: '#B80C09',
    reviews: '245 reseñas',
  },
  {
    id: 3,
    name: 'Camila Synth',
    handle: '@camila_sound',
    initial: 'C',
    bg: '#4B2840',
    reviews: '189 reseñas',
  },
  {
    id: 4,
    name: 'Andrés Groove',
    handle: '@andres_groove',
    initial: 'A',
    bg: '#33182b',
    reviews: '154 reseñas',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const CommunityPage = () => {
  const { reviews, isLoading, error, fetchReviews } = useReviews();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Principal (2 columnas en pantallas grandes): Feed de Actividad */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#e6d5e2] dark:border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
                  FEED EN VIVO
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight mt-1">
                  Actividad Reciente
                </h1>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#5c435a] dark:text-[#B89CB0]">
                Actualizado ahora
              </span>
            </div>

            {/* Lista de Reseñas en Cascada con Framer Motion */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-5"
            >
              {isLoading && <p role="status">Cargando reseñas…</p>}{error && <p role="alert">{error} <button onClick={fetchReviews}>Reintentar</button></p>}{reviews.filter(review => review.status === 'approved').map(review => <ReviewFeedCard key={`api-${review.id}`} review={{ ...review, userName: review.userName || `Usuario ${review.userId}`, albumTitle: review.albumTitle || `Álbum ${review.albumId}`, date: review.createdAt ? new Date(review.createdAt).toLocaleDateString('es') : 'Archivo' }} />)}{mockFeedReviews.map((review) => (
                <ReviewFeedCard key={review.id} review={review} />
              ))}
            </motion.div>
          </div>

          {/* Columna Lateral (1 columna): Usuarios Destacados */}
          <aside className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_8px_30px_-4px_rgba(75,40,64,0.06)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] transition-colors duration-300 flex flex-col gap-5">
              {/* Header de la caja lateral */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e6d5e2]/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] text-[#B80C09]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#231123] dark:text-white">
                    Usuarios Destacados
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c1d5e] dark:text-pink-300">
                  Top Críticos
                </span>
              </div>

              {/* Lista de Usuarios */}
              <div className="flex flex-col gap-4">
                {mockFeaturedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#231123]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs ring-2 ring-[#e6d5e2]/60 dark:ring-white/15"
                        style={{ backgroundColor: user.bg }}
                      >
                        {user.initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[#231123] dark:text-white truncate">
                          {user.name}
                        </span>
                        <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                          {user.handle} · {user.reviews}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl border border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
                    >
                      Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
