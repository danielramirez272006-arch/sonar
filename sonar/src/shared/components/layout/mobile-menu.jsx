import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * MobileMenu Component
 *
 * Menú lateral (Off-canvas / Sidebar) para navegación en dispositivos móviles.
 * Se desliza desde la derecha y cuenta con overlay semitransparente.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de visibilidad del menú lateral.
 * @param {Function} props.onClose - Función para cerrar el menú.
 * @param {Array<{ name: string, path: string }>} [props.links] - Lista de enlaces de navegación.
 */
export const MobileMenu = ({
  isOpen = false,
  onClose = () => {},
  links = [],
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay de fondo semitransparente */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-label="Cerrar menú móvil"
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Menú lateral (Off-canvas) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-64 z-50 shadow-2xl bg-white dark:bg-[#231123] p-6 flex flex-col"
          >
            {/* Cabecera con botón de cerrar (X) */}
            <div className="flex items-center justify-end mb-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="p-2 rounded-xl text-black dark:text-white hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors cursor-pointer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Lista de enlaces de navegación */}
            <nav className="flex flex-col gap-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.path || '#'}
                  onClick={onClose}
                  className="text-black dark:text-white hover:text-[#B80C09] dark:hover:text-[#B80C09] font-medium text-lg transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
