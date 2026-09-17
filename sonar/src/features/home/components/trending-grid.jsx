import React, { useState } from 'react';
import { motion } from 'framer-motion';

const trendingAlbums = [
  {
    id: 1,
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    genre: 'Psychedelic Pop',
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    genre: 'Hip Hop / Jazz',
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    genre: 'Glitch Pop / Ambient',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Kid A',
    artist: 'Radiohead',
    year: '2000',
    genre: 'Electronic Rock',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    genre: 'R&B / Neo-Soul',
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Discovery',
    artist: 'Daft Punk',
    year: '2001',
    genre: 'French House / Disco',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: '1969',
    genre: 'Classic Rock',
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    title: 'Melodrama',
    artist: 'Lorde',
    year: '2017',
    genre: 'Art Pop',
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
  },
];

const tabs = [
  { id: 'week', label: 'Esta semana' },
  { id: 'acclaimed', label: 'Más aclamados' },
  { id: 'news', label: 'Novedades' },
  { id: 'classics', label: 'Clásicos' },
];

export const TrendingGrid = () => {
  const [activeTab, setActiveTab] = useState('week');

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

          {/* Filter Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 self-start md:self-auto gap-1 shadow-xs transition-colors">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B80C09] text-white shadow-xs'
                      : 'text-[#5c435a] hover:text-[#231123] dark:text-[#B89CB0] dark:hover:text-[#FAF5F8]'
                  }`}
                  type="button"
                >
                  {tab.label}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-[#B80C09] text-white text-xs uppercase font-bold flex items-center gap-1 shadow-md hover:bg-[#9c0a07] transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                    <span>Guardar</span>
                  </button>
                  <button
                    aria-label="Reproducir muestra"
                    className="w-8 h-8 rounded-full bg-white text-[#231123] flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
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
