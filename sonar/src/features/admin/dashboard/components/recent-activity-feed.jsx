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
      staggerChildren: 0.08,
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
 * Rediseñado con Glassmorphism minimalista, micro-interacciones hover y contrastes tipográficos refinados.
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
      className={`bg-white/70 dark:bg-sonar-surface/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/70 dark:border-sonar-surface shadow-lg ${className}`}
    >
      {/* Cabecera del componente con tipografía tracking-tight */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-sonar-text tracking-tight">
          Actividad Reciente
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-sonar-text/70 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span>Actualizado en vivo</span>
        </div>
      </div>

      {/* Lista de acciones con animación escalonada e interacción hover */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        {activities.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex items-center justify-between gap-3 py-2.5 px-3 -mx-2 rounded-lg hover:bg-gray-50/50 dark:hover:bg-sonar-accent/40 transition-all duration-200 cursor-default"
          >
            {/* Lado izquierdo: Punto indicador + Texto formateado */}
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.isAlert
                    ? 'bg-[#B80C09] dark:bg-sonar-alert shadow-[0_0_8px_#B80C09]'
                    : 'bg-gray-400 dark:bg-sonar-text/40'
                }`}
              />
              <p className="text-xs sm:text-sm text-gray-700 dark:text-sonar-text truncate">
                <span className="font-bold text-gray-900 dark:text-sonar-text">
                  {item.user}
                </span>{' '}
                <span className="text-gray-600 dark:text-sonar-text/80">{item.action}</span>{' '}
                <span className="italic font-medium text-gray-800 dark:text-sonar-text">
                  {item.target}
                </span>
              </p>
            </div>

            {/* Lado derecho: Tiempo relativo con contraste gris sofisticado */}
            <span className="text-[11px] sm:text-xs text-gray-400 dark:text-sonar-text/60 shrink-0 font-medium whitespace-nowrap ml-2">
              {item.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentActivityFeed;
