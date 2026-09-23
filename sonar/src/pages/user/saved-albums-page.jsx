import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';

export const SavedAlbumsPage = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const userId = user?.id || '1';

  const [savedAlbums, setSavedAlbums] = useState([]);
  const [activeTag, setActiveTag] = useState('Todos');

  useEffect(() => {
    setSavedAlbums(interactionsService.getUserSavedAlbums(userId));
  }, [userId]);

  const handleRemove = (album) => {
    const res = interactionsService.toggleSaveAlbum(userId, album);
    setSavedAlbums(res.savedAlbums);
  };

  const tags = ['Todos', 'Favoritos', 'Colección Vinilo', 'Por Escuchar'];

  const filtered = savedAlbums.filter((a) => {
    if (activeTag === 'Todos') return true;
    return a.collectionTag === activeTag;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B80C09] font-extrabold">
              BIBLIOTECA PERSONAL
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white tracking-tight mt-1">
              Mis Colecciones & Álbumes Guardados
            </h1>
            <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Colección exclusiva de {user?.username || 'tu perfil'} organizada por categorías.
            </p>
          </div>

          {/* Filtros de Colección */}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTag === tag
                    ? 'bg-[#B80C09] text-white shadow-xs'
                    : 'bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 hover:border-[#B80C09]/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-center flex flex-col items-center gap-3 my-6">
            <span className="material-symbols-outlined text-[48px] text-[#5c435a] dark:text-[#B89CB0]">
              bookmark_border
            </span>
            <h3 className="text-lg font-bold text-[#231123] dark:text-white">
              No tienes discos en la categoría &ldquo;{activeTag}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md">
              Explora las recomendaciones del portal y presiona el botón de marcador para guardarlos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((album) => (
              <motion.article
                key={album.id || album.title}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="group flex flex-col p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-lg hover:border-[#B80C09]/40 transition-all relative"
              >
                {/* Carátula Cuadrada */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-[#231123] mb-3 shadow-xs">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-extrabold shadow-xs">
                    {album.collectionTag || 'Colección'}
                  </div>

                  {/* Botón reproducir al hacer hover */}
                  <button
                    type="button"
                    onClick={() =>
                      playTrack({
                        id: album.id,
                        deezerId: album.deezerId || album.id,
                        title: album.title,
                        artist: album.artist,
                        album: album.title,
                        cover: album.cover,
                        preview: album.previewUrl || album.preview,
                      })
                    }
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[32px]">play_circle</span>
                  </button>

                  {/* Botón Quitar de Colección */}
                  <button
                    type="button"
                    onClick={() => handleRemove(album)}
                    title="Quitar de mi colección"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#B80C09] text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedAlbumsPage;

