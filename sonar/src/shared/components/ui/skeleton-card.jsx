import React from 'react';

/**
 * SkeletonCard Component
 *
 * Componente visual de carga (placeholder) tipo Skeleton para tarjetas de discos o reseñas.
 * Utiliza la utilidad `animate-pulse` de Tailwind CSS y adapta sus tonos al modo claro y oscuro.
 *
 * @param {Object} props
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor.
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg p-4 bg-gray-100 dark:bg-[#4B2840] ${className}`}
    >
      {/* Cuadro superior para simular carátula/avatar */}
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-600 rounded-md mb-4" />

      {/* Línea simulando título */}
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />

      {/* Línea simulando artista o subtítulo */}
      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
};

export default SkeletonCard;
