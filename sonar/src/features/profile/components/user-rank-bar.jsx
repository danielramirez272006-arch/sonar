import React from 'react';
import { motion } from 'framer-motion';

/**
 * UserRankBar Component
 *
 * Componente de gamificación que muestra el rango actual del usuario y su barra de
 * progreso animada hacia el siguiente nivel según las reseñas publicadas.
 *
 * @param {Object} props
 * @param {string} [props.currentRank] - Nombre del rango actual del usuario.
 * @param {number} [props.currentReviews] - Cantidad actual de reseñas realizadas.
 * @param {number} [props.targetReviews] - Total de reseñas requeridas para el próximo rango.
 * @param {string} [props.nextRank] - Nombre del siguiente rango a desbloquear.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export const UserRankBar = ({
  currentRank = 'Crítico Novato',
  currentReviews = 7,
  targetReviews = 10,
  nextRank = 'Experto Sonoro',
  className = '',
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentReviews / targetReviews) * 100))
  );
  const remainingReviews = Math.max(0, targetReviews - currentReviews);

  return (
    <div
      className={`bg-white dark:bg-[#231123] rounded-xl p-6 border border-gray-200 dark:border-[#4B2840]/50 shadow-sm ${className}`}
    >
      {/* Cabecera del componente */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">
            Rango actual
          </span>
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {currentRank}
          </h4>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
          {currentReviews} / {targetReviews} Reseñas
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="bg-[#B80C09] h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Pie del componente */}
      <p className="mt-2.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
        Faltan {remainingReviews} reseñas para alcanzar el rango:{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {nextRank}
        </span>
      </p>
    </div>
  );
};

export default UserRankBar;
