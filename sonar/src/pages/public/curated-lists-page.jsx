import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';

const CURATED_LISTS = [
  {
    id: 'art-rock-essentials',
    title: '50 Obras Maestras del Art Rock & Vanguardia',
    curator: 'Consejo Editorial Sonar',
    tag: 'Esencial Histórico',
    description: 'De las experimentaciones analógicas de los 70s hasta la deconstrucción digital contemporánea. Discos que redefinieron los límites sonoros del rock.',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    albumsCount: 50,
    duration: '38 hrs',
    featuredAlbums: [
      { id: 14880659, title: 'In Rainbows', artist: 'Radiohead', year: '2007', cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg' },
      { id: 9896728, title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', year: '2015', cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg' },
      { id: 537883642, title: 'Vespertine', artist: 'Björk', year: '2001', cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg' }
    ]
  },
  {
    id: 'ambient-drone-canon',
    title: 'Top 25: La Arquitectura del Silencio & Ambient',
    curator: 'Comité de Acústica Experimental',
    tag: 'Inmersión Sonora',
    description: 'Paisajes sonoros generativos, texturas minimalistas y grabaciones de campo diseñadas para la escucha en auriculares de campo abierto.',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    albumsCount: 25,
    duration: '21 hrs',
    featuredAlbums: [
      { id: 537883642, title: 'Vespertine', artist: 'Björk', year: '2001', cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg' },
      { id: 302127, title: 'Discovery', artist: 'Daft Punk', year: '2001', cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg' },
      { id: 10709540, title: 'Currents', artist: 'Tame Impala', year: '2015', cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg' }
    ]
  },
  {
    id: 'vinyl-audiophile-pressings',
    title: 'Prensajes de Vinilo con Rango Dinámico Excepcional',
    curator: 'Sociedad de Audiófilos de Sonar',
    tag: 'Vinilo 180g',
    description: 'Álbumes masterizados a media velocidad (half-speed mastering) y cortados directamente desde las cintas maestras analógicas.',
    banner: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&q=80&w=800',
    albumsCount: 18,
    duration: '14 hrs',
    featuredAlbums: [
      { id: 14880659, title: 'In Rainbows', artist: 'Radiohead', year: '2007', cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg' },
      { id: 344137457, title: 'Blonde', artist: 'Frank Ocean', year: '2016', cover: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/1000x1000-000000-80-0-0.jpg' },
      { id: 302127, title: 'Discovery', artist: 'Daft Punk', year: '2001', cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg' }
    ]
  }
];

export const CuratedListsPage = () => {
  const { playTrack } = usePlayer();
  const [activeListId, setActiveListId] = useState(CURATED_LISTS[0].id);

  const activeList = CURATED_LISTS.find(l => l.id === activeListId) || CURATED_LISTS[0];

  const handlePlayFirstAlbum = (list) => {
    if (list.featuredAlbums && list.featuredAlbums.length > 0) {
      const alb = list.featuredAlbums[0];
      playTrack({
        id: alb.id,
        deezerId: alb.id,
        title: alb.title,
        artist: alb.artist,
        album: alb.title,
        cover: alb.cover,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              GUÍAS DEFINITIVAS & ANTOLOGÍAS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
            Listas Esenciales
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
            Selecciones temáticas exhaustivas curadas con rigor analítico por el consejo editorial de Sonar para explorar la historia musical disco a disco.
          </p>
        </header>

        {/* Lista de Colecciones Curadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {CURATED_LISTS.map(list => (
            <motion.div
              key={list.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveListId(list.id)}
              className={`flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#4B2840] border transition-all cursor-pointer shadow-md ${
                activeListId === list.id
                  ? 'border-[#B80C09] ring-2 ring-[#B80C09]/20'
                  : 'border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
              }`}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={list.banner}
                  alt={list.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                  <span className="px-2.5 py-1 rounded-full bg-[#B80C09] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {list.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#231123] dark:text-white mb-2 leading-snug">
                    {list.title}
                  </h3>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed mb-4">
                    {list.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#5c1d5e] dark:text-pink-200">
                  <span>{list.albumsCount} Álbumes · {list.duration}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayFirstAlbum(list);
                    }}
                    className="p-2 rounded-full bg-[#B80C09] text-white flex items-center justify-center hover:scale-105 transition-transform"
                    title="Reproducir lista"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sección de Detalle de Lista Activa */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
                DISCOS INCLUIDOS EN LA SELECCIÓN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white mt-1">
                {activeList.title}
              </h2>
            </div>
            <button
              onClick={() => handlePlayFirstAlbum(activeList)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B80C09] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#9c0a07] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Comenzar Reproducción</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.featuredAlbums.map((alb, idx) => (
              <div
                key={alb.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09] transition-all"
              >
                <span className="font-mono text-base font-bold text-gray-400 w-6 text-center">
                  #{idx + 1}
                </span>
                <img
                  src={alb.cover}
                  alt={alb.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#231123] dark:text-white truncate">
                    {alb.title}
                  </h4>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate">
                    {alb.artist} · {alb.year}
                  </p>
                </div>
                <button
                  onClick={() =>
                    playTrack({
                      id: alb.id,
                      deezerId: alb.id,
                      title: alb.title,
                      artist: alb.artist,
                      album: alb.title,
                      cover: alb.cover,
                    })
                  }
                  className="p-2 rounded-xl bg-white dark:bg-[#4B2840] text-[#231123] dark:text-white hover:bg-[#B80C09] hover:text-white shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CuratedListsPage;
