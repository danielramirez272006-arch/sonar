import React from 'react';
import { motion } from 'framer-motion';

/**
 * UserRankBar Component
 *
 * Componente de gamificación que muestra el rango actual del usuario y su barra de
 * progreso animada hacia el siguiente nivel según las reseñas publicadas.
 * Estilizado con acabado Glassmorphism, resplandor neón en la barra e ícono de rango.
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
      className={`bg-white/70 dark:bg-[#231123]/70 backdrop-blur-lg rounded-xl p-6 border border-gray-200/70 dark:border-white/10 shadow-lg ${className}`}
    >
      {/* Cabecera del componente */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5 font-medium">
            Rango actual
          </span>
          <div className="flex items-center gap-2">
            {/* Ícono sutil de trofeo / medalla */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B80C09"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
              <path d="M6 4h12a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
            </svg>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              {currentRank}
            </h4>
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
          {currentReviews} / {targetReviews} Reseñas
        </span>
      </div>

      {/* Barra de progreso con brillo Neón */}
      <div className="w-full h-3 bg-gray-200/80 dark:bg-gray-800/80 rounded-full overflow-hidden p-0.5">
        <motion.div
          className="bg-[#B80C09] h-full rounded-full shadow-[0_0_10px_#B80C09]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Pie del componente */}
      <p className="mt-3 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
        Faltan {remainingReviews} reseñas para alcanzar el rango:{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {nextRank}
        </span>
      </p>
    </div>
  );
};

export default UserRankBar;
