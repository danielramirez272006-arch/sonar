import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../../shared/context/player-context';

const albumVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const AlbumOfTheWeek = () => {
  const { playTrack, toggleTrack, currentTrack, isPlaying, openReviewModal } = usePlayer();

  const inRainbowsTrack = {
    id: 138546803,
    title: '15 Step',
    artist: 'Radiohead',
    album: 'In Rainbows',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    preview: 'https://cdnt-preview.dzcdn.net/api/1/1/5/3/f/0/53faff1741bb65b8ddbc11780555c546.mp3',
  };

  const isCurrentPlaying = currentTrack?.id === inRainbowsTrack.id && isPlaying;
  return (
    <motion.section
      variants={albumVariants}
      className="relative w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16 overflow-hidden bg-gradient-to-b from-white via-[#fff7fa] to-[#fff7fa] dark:from-[#231123] dark:via-[#1f0f1f] dark:to-[#231123] transition-colors duration-300"
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -top-24 left-1/4 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-rose-200/40 dark:bg-[#B80C09]/15 blur-[90px] sm:blur-[130px] pointer-events-none -z-10 transition-colors duration-300" />
      <div className="absolute top-1/3 right-10 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-purple-200/35 dark:bg-[#4B2840]/30 blur-[80px] sm:blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <div className="max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
        {/* Vinyl & Sleeve Presentation (Mobile Stacks on Top, Desktop on Left) */}
        <div className="w-full lg:col-span-6 flex justify-center items-center py-2 sm:py-4">
          <div className="relative group cursor-pointer select-none max-w-full">
            {/* Slide-out Vinyl Record */}
            <div className="absolute top-2 sm:top-4 right-0 w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] rounded-full bg-[#181119] shadow-[0_16px_40px_rgba(0,0,0,0.45)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-700 ease-out transform translate-x-6 sm:translate-x-10 group-hover:translate-x-16 sm:group-hover:translate-x-28 md:group-hover:translate-x-36 group-hover:rotate-45">
              {/* Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute inset-5 sm:inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-8 sm:inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-12 sm:inset-14 rounded-full border border-white/10" />
              <div className="absolute inset-16 sm:inset-20 rounded-full border border-white/10" />
              <div className="absolute inset-22 sm:inset-28 rounded-full border border-white/10" />

              {/* Vinyl Center Label */}
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-[#B80C09] flex flex-col items-center justify-center shadow-inner relative p-2 sm:p-3 text-center ring-2 ring-white/20">
                <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#181119] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] mb-0.5 sm:mb-1" />
                <span className="text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-tighter text-white font-bold leading-none">
                  RADIOHEAD
                </span>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] text-white/80 tracking-widest mt-0.5 font-medium">
                  SIDE A · 33⅓ RPM
                </span>
              </div>
              {/* Dynamic sheen reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Album Sleeve Outer Container */}
            <div className="relative z-10 w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] rounded-2xl overflow-hidden shadow-[0_20px_45px_-12px_rgba(75,40,64,0.2)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7)] bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 transition-transform duration-500 group-hover:-translate-y-1 flex items-center justify-center">
              <img
                className="w-full h-full object-cover"
                alt="In Rainbows by Radiohead"
                src="https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

              {/* Badge overlay on cover */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 rounded-md bg-white/95 dark:bg-[#231123]/90 backdrop-blur-md flex items-center gap-1.5 shadow-md border border-white/60 dark:border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-ping" />
                <span className="text-[10px] sm:text-[11px] uppercase text-[#231123] dark:text-white tracking-wider font-bold">
                  33 RPM LP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Editorial Content & Metadata */}
        <div className="w-full lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 lg:pl-4 text-left">
          {/* Editorial Badge */}
          <div className="inline-flex items-center gap-2 self-start px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c1d5e] dark:text-pink-200 shadow-xs">
            <span
              className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#B80C09]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              ÁLBUM DE LA SEMANA — ELECCIÓN EDITORIAL
            </span>
          </div>

          {/* Master Title & Metadata */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#231123] dark:text-white tracking-tight leading-tight">
              In Rainbows
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm md:text-base text-[#5c435a] dark:text-gray-300">
              <span className="font-bold text-[#4B2840] dark:text-pink-300">Radiohead</span>
              <span className="text-[#d4c0cf] dark:text-white/20">·</span>
              <span>(2007)</span>
              <span className="text-[#d4c0cf] dark:text-white/20">·</span>
              <span>10 Canciones</span>
              <span className="text-[#d4c0cf] dark:text-white/20">·</span>
              <span>42 min</span>
              <span className="text-[#d4c0cf] dark:text-white/20">·</span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c1d5e] dark:text-gray-200 text-[11px] sm:text-xs uppercase font-semibold">
                Art Rock / Experimental
              </span>
            </div>
          </div>

          {/* Interactive Rating Bar */}
          <div className="flex items-center gap-3 sm:gap-4 py-1">
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#231123] dark:text-white">
                4.8
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm text-[#5c435a] dark:text-gray-400">
                / 5.0 (24,812 calificaciones)
              </span>
            </div>
          </div>

          {/* Editorial Synopsis */}
          <blockquote className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-md">
            <p className="text-xs sm:text-sm md:text-base text-[#231123]/90 dark:text-gray-100 leading-relaxed italic">
              “Una obra maestra visceral de texturas digitales y calidez analógica. Una experiencia sónica introspectiva y universal que redefinió el canon de la música moderna.”
            </p>
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs text-[#5c435a] dark:text-gray-400 border-t border-[#e6d5e2]/60 dark:border-white/10 pt-2 sm:pt-2.5">
              <span>— Consejo Editorial Sonar</span>
              <span className="font-bold text-[#5c1d5e] dark:text-pink-300 uppercase tracking-wider">
                Criterio Impecable
              </span>
            </div>
          </blockquote>

          {/* Community Social Signals */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 text-[11px] sm:text-xs font-medium shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-[#B80C09]">headphones</span>
              <span>89.4k escuchas</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 text-[11px] sm:text-xs font-medium shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-purple-600 dark:text-pink-300">playlist_add_check</span>
              <span>14.2k en listas</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c1d5e] dark:text-pink-200 text-[11px] sm:text-xs font-bold">
              <span className="material-symbols-outlined text-[15px] text-[#B80C09]">military_tech</span>
              <span>#1 en Lo Mejor de 2007</span>
            </div>
          </div>

          {/* Action CTA Suite */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleTrack(inRainbowsTrack)}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#B80C09] text-white text-xs sm:text-sm uppercase tracking-wider shadow-[0_8px_24px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] transition-all font-bold cursor-pointer"
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
              onClick={() => openReviewModal({ title: 'In Rainbows', artist: 'Radiohead' })}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#4B2840] dark:text-white text-xs sm:text-sm uppercase tracking-wider shadow-xs hover:bg-[#f8e9f6] dark:hover:bg-[#5d3350] transition-all font-semibold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#B80C09]">
                rate_review
              </span>
              <span>Escribir Reseña</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Guardar álbum en lista"
              className="p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] hover:border-[#B80C09] transition-colors shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">bookmark_add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AlbumOfTheWeek;
