import React, { useState } from 'react';

export const FavoriteButton = ({ initialFavorite = false, onToggle = () => {} }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleClick = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    onToggle(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
      className={`p-3 rounded-full border transition-all cursor-pointer ${
        isFavorite
          ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-md'
          : 'bg-white/10 dark:bg-white/5 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <span className="text-lg leading-none">{isFavorite ? '♥' : '♡'}</span>
    </button>
  );
};

export default FavoriteButton;
