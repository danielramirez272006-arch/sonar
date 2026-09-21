import React from 'react';

export const AlbumCoverLarge = ({ coverUrl, title = 'Álbum', artist = 'Artista' }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
      {coverUrl ? (
        <img src={coverUrl} alt={`${title} - ${artist}`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-[#3d2034] flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl mb-2">💿</span>
          <span className="font-bold text-white text-sm">{title}</span>
          <span className="text-xs text-[#B89CB0]">{artist}</span>
        </div>
      )}
    </div>
  );
};

export default AlbumCoverLarge;
