import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_DEEZER_ALBUMS, getAlbumTracks } from '../../../shared/services/deezer-service';
import { usePlayer } from '../../../shared/context/player-context';

const trendingAlbums = DEFAULT_DEEZER_ALBUMS;

const tabs = [
  { id: 'week', label: 'Esta semana' },
  { id: 'acclaimed', label: 'Más aclamados' },
  { id: 'news', label: 'Novedades' },
  { id: 'classics', label: 'Clásicos' },
];

export const TrendingGrid = () => {
  const [activeTab, setActiveTab] = useState('week');
  const { playTrack, currentTrack, isPlaying, toggleTrack, openReviewModal } = usePlayer();

  const handlePlayAlbum = async (album) => {
    if (album.topTrack?.preview) {
      toggleTrack({
        id: album.id,
        title: album.topTrack.title || album.title,
        artist: album.artist,
        album: album.title,
        cover: album.cover,
        preview: album.topTrack.preview,
      });
      return;
    }

    try {
      const tracks = await getAlbumTracks(album.id);
      const playable = tracks.find((t) => t.preview) || tracks[0];
      if (playable && playable.preview) {
        playTrack({
          id: playable.id,
          title: playable.title,
          artist: album.artist,
          album: album.title,
          cover: album.cover,
          preview: playable.preview,
        });
      }
    } catch (err) {
      console.error('Error al reproducir preview de álbum:', err);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-[#5c1d5e] dark:text-pink-300 font-extrabold">
              RADAR MUSICAL
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#231123] dark:text-[#FAF5F8] font-extrabold">
              Exploración — Álbumes en Tendencia
            </h2>
          </div>

          {/* Filter Tabs con bordes fluidos y animación con Framer Motion */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#ede0eb] dark:bg-[#1f1020] border border-[#e2cedf] dark:border-white/10 self-start md:self-auto gap-0.5 shadow-inner transition-colors">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none z-10 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
                  }`}
                  type="button"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-trending-pill"
                      className="absolute inset-0 bg-[#B80C09] rounded-full shadow-[0_2px_10px_rgba(184,12,9,0.4)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Albums Responsive Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingAlbums.map((album) => (
            <motion.div
              key={album.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] hover:shadow-md dark:hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.6)] hover:border-[#B80C09]/40 transition-all duration-300"
            >
              {/* Album Image & Hover Actions */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f8e9f6] dark:bg-[#231123] mb-3 shadow-xs">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={album.title}
                  src={album.cover}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <button
                    onClick={() => openReviewModal(album)}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-[#B80C09] text-white text-xs uppercase font-bold flex items-center gap-1 shadow-md backdrop-blur-md transition-colors cursor-pointer"
                    type="button"
                    title="Escribir crítica"
                  >
                    <span className="material-symbols-outlined text-[16px]">rate_review</span>
                    <span>Criticar</span>
                  </button>
                  <button
                    onClick={() => handlePlayAlbum(album)}
                    aria-label={`Reproducir muestra de ${album.title}`}
                    title={currentTrack?.album === album.title && isPlaying ? 'Pausar' : 'Escuchar muestra de 30s'}
                    className={`w-9 h-9 rounded-full ${
                      currentTrack?.album === album.title && isPlaying ? 'bg-[#B80C09] text-white' : 'bg-white text-[#231123]'
                    } flex items-center justify-center hover:scale-110 transition-transform shadow-md cursor-pointer`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {currentTrack?.album === album.title && isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Album Title & Rating */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-base text-[#231123] dark:text-[#FAF5F8] font-bold truncate">
                  {album.title}
                </span>
                <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-bold shrink-0">
                  <span
                    className="material-symbols-outlined text-[13px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>{album.rating}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] font-medium truncate">
                {album.artist}
              </p>

              <div className="flex items-center justify-between text-[#81737e] dark:text-[#B89CB0] text-xs mt-2 pt-2 border-t border-[#e6d5e2]/60 dark:border-white/10">
                <span>{album.year}</span>
                <span className="text-[#4B2840] dark:text-pink-300 font-semibold">{album.genre}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Discovery Bottom Banner CTA */}
        <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#4B2840] via-[#5c1d5e] to-[#231123] border border-white/10 overflow-hidden p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          {/* Ambient interior radial highlights */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#B80C09]/20 blur-[80px] pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-purple-500/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 self-center md:self-start text-pink-200 text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#B80C09]">album</span>
              <span>Bitácora de Escucha Personal</span>
            </div>
            <h3 className="text-2xl sm:text-3xl text-white font-extrabold">
              ¿Listo para registrar tu viaje musical?
            </h3>
            <p className="text-sm sm:text-base text-white/85">
              Califica cada surco, escribe ensayos detallados y conecta con audiófilos que sienten la música con la misma intensidad que tú.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3.5 rounded-xl bg-[#B80C09] text-white text-sm uppercase tracking-wider shadow-[0_10px_25px_-6px_rgba(184,12,9,0.6)] hover:bg-[#9c0a07] transition-all font-bold cursor-pointer"
              type="button"
            >
              Crear Cuenta Gratis
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm uppercase tracking-wider backdrop-blur-md transition-all font-semibold cursor-pointer"
              type="button"
            >
              Explorar Catálogo Completo
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingGrid;
