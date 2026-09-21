import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import ProfileHeader from '../../features/profile/components/profile-header';

const mockAlbums = [
  {
    id: 1,
    title: 'In Rainbows',
    artist: 'Radiohead',
    year: '2007',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 2,
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    year: '2013',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Untrue',
    artist: 'Burial',
    year: '2007',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 4,
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
  },
];

export const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal Centrado */}
      <main className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Encabezado del Perfil */}
        <ProfileHeader />

        {/* Navegación por Pestañas (Tabs) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8 border-b border-[#e6d5e2] dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative ${
                activeTab === 'reviews'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span>Mis Reseñas (142)</span>
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
              onClick={() => setActiveTab('saved')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all cursor-pointer relative ${
                activeTab === 'saved'
                  ? 'text-[#B80C09]'
                  : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
              }`}
            >
              <span>Discos Guardados (48)</span>
              {activeTab === 'saved' && (
                <motion.div
                  layoutId="dashboard-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B80C09]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Cuadrícula de 4 Tarjetas de Álbumes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {mockAlbums.map((album) => (
              <motion.article
                key={album.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="group flex flex-col p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.4)] hover:shadow-lg dark:hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.6)] hover:border-[#B80C09]/40 transition-all cursor-pointer"
              >
                {/* Carátula Cuadrada */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-[#231123] mb-3 shadow-xs">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Badge de Puntuación */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                    <span className="text-amber-400">★</span>
                    <span>{album.rating}</span>
                  </div>
                </div>

                {/* Título y Artista */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate">
                    {album.title}
                  </h3>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate font-medium">
                    {album.artist} · {album.year}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
