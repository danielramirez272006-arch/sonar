import React from 'react';
import { motion } from 'framer-motion';

/**
 * EmptyState Component
 *
 * Componente reutilizable para mostrar estados vacíos (ej. sin resultados de búsqueda,
 * sin discos guardados o listas vacías).
 *
 * @param {Object} props
 * @param {string} props.title - Título principal del estado vacío.
 * @param {string} props.description - Descripción o mensaje explicativo secundario.
 * @param {string} [props.actionText] - Texto opcional para mostrar un botón de acción.
 * @param {Function} [props.onAction] - Función callback al presionar el botón de acción.
 * @param {React.ReactNode|string} [props.icon] - Ícono o elemento visual opcional (por defecto usa 'album').
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor principal.
 */
export const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'album',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      {/* Círculo suave superior con ícono en color de acento */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-[#f8e9f6] dark:bg-[#4B2840] mb-6 shadow-sm transition-colors duration-200">
        {typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[36px] sm:text-[44px] text-[#B80C09] select-none">
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>

      {/* Título */}
      {title && (
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 max-w-md">
          {title}
        </h3>
      )}

      {/* Descripción sutil */}
      {description && (
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm sm:max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {/* Botón de acción (opcional) */}
      {actionText && (
        <motion.button
          type="button"
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-[#B80C09] hover:bg-[#9c0a07] shadow-md shadow-[#B80C09]/20 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B80C09]/50 focus:ring-offset-2 dark:focus:ring-offset-[#231123]"
        >
          {actionText}
        </motion.button>
      )}
    </div>
  );
};

export default EmptyState;
