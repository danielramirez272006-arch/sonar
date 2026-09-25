import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../context/language-context';
import { LanguageSelector } from '../ui/language-selector';

/**
 * MobileMenu Component
 *
 * Menú lateral (Off-canvas / Sidebar) para navegación en dispositivos móviles.
 * Se desliza desde la derecha y cuenta con overlay semitransparente.
 */
export const MobileMenu = ({
  isOpen = false,
  onClose = () => {},
  links: customLinks = null,
}) => {
  const { t } = useLanguage();

  const defaultLinks = [
    { name: t('nav.explore'), path: '#explore' },
    { name: t('nav.news'), path: '#noticias' },
    { name: t('nav.community'), path: '#community' },
    { name: t('nav.profile'), path: '#usuario' },
  ];

  const links = customLinks || defaultLinks;

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
            className="fixed top-0 right-0 h-full w-72 z-50 shadow-2xl bg-white dark:bg-[#231123] p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Cabecera con título y botón de cerrar (X) */}
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100 dark:border-white/10">
                <span className="font-extrabold text-sm tracking-wider uppercase text-[#B80C09]">
                  Navegación
                </span>
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

              {/* Lista de enlaces de navegación SPA */}
              <nav className="flex flex-col gap-3">
                {links.map((link, index) => {
                  const targetPath = link.path ? (link.path.startsWith('#') ? link.path : `#${link.path.replace(/^\//, '')}`) : '#explore';
                  return (
                    <a
                      key={index}
                      href={targetPath}
                      onClick={() => onClose()}
                      className="text-black dark:text-white hover:text-[#B80C09] dark:hover:text-[#B80C09] font-medium text-lg transition-colors py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 no-underline flex items-center justify-between"
                    >
                      <span>{link.name || link.label}</span>
                      <span className="material-symbols-outlined text-[18px] opacity-40">chevron_right</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Bloque de Selección de Idioma para Móvil */}
            <div className="pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                {t('common.language')} / Language
              </h4>
              <LanguageSelector variant="footer" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
