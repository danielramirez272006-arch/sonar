import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { useAuth } from '../../shared/context/auth-context';
import { usePlayer } from '../../shared/context/player-context';
import { interactionsService } from '../../shared/services/interactions-service';
import { handleImageFallbackError, getFallbackCoverForAlbum } from '../../shared/services/recommendations-service';

export const SavedAlbumsPage = () => {
  const { user } = useAuth();
  const { playTrack, openReviewModal, currentTrack, isPlaying } = usePlayer();
  const userId = user?.id || '1';

  const [savedAlbums, setSavedAlbums] = useState([]);
  const [activeTag, setActiveTag] = useState('Todos');

  useEffect(() => {
    const loadSaved = () => {
      setSavedAlbums(interactionsService.getUserSavedAlbums(userId));
    };
    loadSaved();

    const handleCollectionChange = () => {
      loadSaved();
    };

    window.addEventListener('sonar:collection-changed', handleCollectionChange);
    return () => window.removeEventListener('sonar:collection-changed', handleCollectionChange);
  }, [userId]);

  const handleRemove = (album) => {
    const res = interactionsService.toggleSaveAlbum(userId, album);
    setSavedAlbums(res.savedAlbums);
  };

  const tags = ['Todos', '🎵 Canciones', '💿 Álbumes', 'Favoritos', 'Colección Vinilo', 'Por Escuchar'];

  const filtered = savedAlbums.filter((a) => {
    if (activeTag === 'Todos') return true;
    if (activeTag === '🎵 Canciones') return a.type === 'track' || Boolean(a.trackId);
    if (activeTag === '💿 Álbumes') return a.type !== 'track' && !a.trackId;
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
              Mis Canciones & Álbumes Guardados
            </h1>
            <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Colección exclusiva de {user?.username || 'tu perfil'} con todas tus canciones y discos favoritos.
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
              No tienes elementos en la categoría &ldquo;{activeTag}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-md">
              Explora canciones o álbumes en el buscador o el reproductor y presiona el botón de marcador para guardarlos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((item) => {
              const isItemTrack = item.type === 'track' || Boolean(item.trackId);
              const isCurrentlyPlaying = (currentTrack?.id === item.id || currentTrack?.title === item.title) && isPlaying;

              return (
                <motion.article
                  key={item.id || item.title}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="group flex flex-col p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs hover:shadow-lg hover:border-[#B80C09]/40 transition-all relative"
                >
                  {/* Carátula Cuadrada */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-[#231123] mb-3 shadow-xs">
                    <img
                      src={item.cover || getFallbackCoverForAlbum(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => handleImageFallbackError(e, item)}
                    />
                    
                    {/* Badge tipo */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-extrabold shadow-xs">
                        {isItemTrack ? '🎵 Canción' : '💿 Álbum'}
                      </span>
                      {item.collectionTag && item.collectionTag !== 'Favoritos' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#B80C09]/90 text-white text-[9px] font-bold">
                          {item.collectionTag}
                        </span>
                      )}
                    </div>

                    {/* Botón reproducir al hacer hover */}
                    <button
                      type="button"
                      onClick={() =>
                        playTrack({
                          id: item.id,
                          deezerId: item.deezerId || item.id,
                          trackId: isItemTrack ? item.id : null,
                          title: item.title,
                          artist: item.artist,
                          album: item.album || item.title,
                          cover: item.cover,
                          preview: item.previewUrl || item.preview,
                        })
                      }
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity cursor-pointer ${
                        isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      title={isCurrentlyPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      <span className="material-symbols-outlined text-[36px] bg-[#B80C09] p-2 rounded-full shadow-lg">
                        {isCurrentlyPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    {/* Botón Quitar de Colección */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      title="Quitar de mi colección"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#B80C09] text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* Título y Artista */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#231123] dark:text-white truncate" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] truncate font-medium">
                      {item.artist} {item.year ? `· ${item.year}` : ''}
                    </p>

                    <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-[#e6d5e2]/60 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => openReviewModal(item)}
                        className="text-[11px] font-bold text-[#B80C09] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">rate_review</span>
                        Criticar
                      </button>
                      <span className="text-[10px] text-gray-400">
                        {item.addedAt || 'Reciente'}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedAlbumsPage;


