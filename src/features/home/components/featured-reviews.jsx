import React from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  {
    id: 1,
    author: '@sofia_sound',
    badge: 'Crítica Verificada',
    badgeIcon: 'verified',
    badgeColor: 'text-[#B80C09]',
    avatarLetter: 'S',
    avatarBg: '#5c1d5e',
    rating: 5,
    text: "“Cada surco de este álbum parece respirar con una pulsación biológica. 'Reckoner' y 'Nude' alcanzan un nivel de producción y vulnerabilidad que pocos discos en la historia moderna han logrado igualar. Una lección de sobriedad y espacialidad acústica.”",
    album: {
      title: 'In Rainbows',
      artist: 'Radiohead · 2007',
      cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    },
    likes: 842,
    comments: 64,
    timeAgo: 'Hace 2 horas',
  },
  {
    id: 2,
    author: '@marcos_vinyl',
    badge: 'Top Reseñador',
    badgeIcon: 'award_star',
    badgeColor: 'text-amber-500',
    avatarLetter: 'M',
    avatarBg: '#4B2840',
    rating: 4.5,
    text: "“Un torbellino de ritmos hipnóticos y sintetizadores etéreos. La mezcla envolvente en vinilo te sumerge en una atmósfera lúcida de la que no quieres salir jamás. El rango dinámico en pista analógica es demoledor.”",
    album: {
      title: 'Random Access Memories',
      artist: 'Daft Punk · 2013',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    likes: 619,
    comments: 38,
    timeAgo: 'Hace 5 horas',
  },
  {
    id: 3,
    author: '@elena_analog',
    badge: 'Curadora',
    badgeIcon: 'auto_awesome',
    badgeColor: 'text-[#5c1d5e] dark:text-pink-300',
    avatarLetter: 'E',
    avatarBg: '#75527b',
    rating: 5,
    text: "“La perfecta intersección entre melancolía nocturna y poesía lírica. Un viaje sonoro indispensable para entender la evolución de la música urbana experimental en la última década.”",
    album: {
      title: 'Untrue',
      artist: 'Burial · 2007',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    },
    likes: 523,
    comments: 47,
    timeAgo: 'Hace 1 día',
  },
];

export const FeaturedReviews = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
              DISCURSO & ANÁLISIS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#231123] dark:text-[#FAF5F8] font-extrabold mt-1">
              Reseñas Destacadas
            </h2>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Voces críticas y oyentes apasionados compartiendo su perspectiva musical en alta resolución.
            </p>
          </div>
          <a
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c1d5e] dark:text-pink-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors group cursor-pointer"
            href="#reviews"
          >
            <span>Ver todas (1.2k)</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>

        {/* 3 Featured Critique Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsData.map((review) => (
            <motion.article
              key={review.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_6px_24px_-4px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.4)] hover:shadow-md dark:hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6)] hover:border-[#B80C09]/40 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                {/* Review Author Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-base ring-2 ring-[#e6d5e2] dark:ring-white/15 shrink-0 shadow-xs"
                      style={{ backgroundColor: review.avatarBg }}
                    >
                      {review.avatarLetter}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base text-[#231123] dark:text-[#FAF5F8] font-bold leading-snug">
                        {review.author}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#5c1d5e] dark:text-pink-200 font-semibold">
                        <span
                          className={`material-symbols-outlined text-[13px] ${review.badgeColor}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {review.badgeIcon}
                        </span>
                        <span>{review.badge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {i < Math.floor(review.rating)
                          ? 'star'
                          : review.rating % 1 !== 0 && i === Math.floor(review.rating)
                          ? 'star_half'
                          : 'star'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Text Excerpt */}
                <p className="text-sm sm:text-base text-[#231123]/90 dark:text-[#FAF5F8]/90 leading-relaxed">
                  {review.text}
                </p>

                {/* Album Reference Strip */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fff7fa] dark:bg-[#231123]/80 border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-xs border border-white dark:border-white/10 bg-[#4B2840]">
                    <img
                      className="w-full h-full object-cover"
                      alt={review.album.title}
                      src={review.album.cover}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-[#231123] dark:text-[#FAF5F8] font-bold truncate">
                      {review.album.title}
                    </span>
                    <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                      {review.album.artist}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Metadata */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e6d5e2]/70 dark:border-white/10">
                <div className="flex items-center gap-4 text-[#5c435a] dark:text-[#B89CB0] text-xs font-medium">
                  <button className="flex items-center gap-1 hover:text-[#B80C09] transition-colors cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[16px] text-[#B80C09]">favorite</span>
                    <span>{review.likes} likes</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#231123] dark:hover:text-[#FAF5F8] transition-colors cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                    <span>{review.comments} comentarios</span>
                  </button>
                </div>
                <span className="text-xs text-[#81737e] dark:text-[#B89CB0]/70">
                  {review.timeAgo}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
