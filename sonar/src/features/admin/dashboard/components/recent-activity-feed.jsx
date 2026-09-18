import React from 'react';
import { motion } from 'framer-motion';

/**
 * Mock data: Actividades recientes en el panel de administración
 */
const mockActivities = [
  {
    id: 1,
    user: 'Sofía Sound',
    action: 'publicó una reseña en',
    target: 'Álbum: Brat',
    time: 'Hace 5 min',
    isAlert: false,
  },
  {
    id: 2,
    user: 'Carlos Ruiz',
    action: 'reportó un comentario de',
    target: 'Usuario: xX_rocker_Xx',
    time: 'Hace 12 min',
    isAlert: true,
  },
  {
    id: 3,
    user: 'Mateo Rivaes',
    action: 'calificó con 5 estrellas',
    target: 'Álbum: In Rainbows',
    time: 'Hace 25 min',
    isAlert: false,
  },
  {
    id: 4,
    user: 'Sistema IA',
    action: 'detectó posible spam en',
    target: 'Reseña #4812',
    time: 'Hace 40 min',
    isAlert: true,
  },
  {
    id: 5,
    user: 'Lucía Vega',
    action: 'guardó en favoritos',
    target: 'Álbum: Discovery',
    time: 'Hace 1 hora',
    isAlert: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/**
 * RecentActivityFeed Component
 *
 * Muestra una lista de eventos y acciones recientes en tiempo real para el panel de administración.
 *
 * @param {Object} props
 * @param {Array} [props.activities] - Lista de actividades a renderizar.
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor.
 */
export const RecentActivityFeed = ({
  activities = mockActivities,
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#231123] rounded-xl p-6 border border-gray-200 dark:border-[#4B2840]/50 shadow-sm ${className}`}
    >
      {/* Cabecera del componente */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Actividad Reciente
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Actualizado en vivo</span>
        </div>
      </div>

      {/* Lista de acciones con animación escalonada */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col divide-y divide-gray-100 dark:divide-white/5"
      >
        {activities.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
          >
            {/* Lado izquierdo: Punto indicador + Texto formateado */}
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.isAlert
                    ? 'bg-[#B80C09]'
                    : 'bg-gray-400 dark:bg-gray-500'
                }`}
              />
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 truncate">
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.user}
                </span>{' '}
                <span>{item.action}</span>{' '}
                <span className="italic font-medium text-gray-800 dark:text-gray-300">
                  {item.target}
                </span>
              </p>
            </div>

            {/* Lado derecho: Tiempo relativo */}
            <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 shrink-0 font-medium whitespace-nowrap">
              {item.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentActivityFeed;
