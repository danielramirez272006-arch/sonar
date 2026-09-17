import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '../ui/animated-logo';
import { Avatar } from '../ui/avatar';
import { useTheme } from '../../context/theme-context';

export const Navbar = ({
  links = [
    { id: 'explore', label: 'Explorar' },
    { id: 'community', label: 'Comunidad' },
  ],
  user = {
    name: 'Mateo Rivaes',
    avatarUrl: '',
  },
  onNavigate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('explore');
  const { isDark, toggleTheme } = useTheme();

  const handleNavClick = (id) => {
    setActiveTab(id);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#231123]/95 border-b border-[#e6d5e2] dark:border-white/10 backdrop-blur-md transition-colors duration-300 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-4">
        {/* Izquierda: AnimatedLogo interactivo */}
        <div className="flex items-center">
          <AnimatedLogo />
        </div>

        {/* Derecha: Enlaces, Botón de Tema (Blanco/Negro) & Mock Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Enlaces de navegación */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-[#231123] dark:text-white'
                      : 'text-[#5c435a] hover:text-[#231123] dark:text-[#B89CB0] dark:hover:text-white'
                  }`}
                >
                  {link.label}

                  {/* Indicador de tab activo animado */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 rounded-xl -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Botón Switch Modo Blanco / Modo Negro */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title={isDark ? 'Cambiar a Modo Blanco' : 'Cambiar a Modo Negro'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#f8e9f6] dark:bg-[#4B2840] text-[#231123] dark:text-[#FAF5F8] border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09] dark:hover:border-[#B80C09] hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-all cursor-pointer shadow-xs"
          >
            <motion.span
              key={isDark ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-[19px] sm:text-[21px]"
            >
              {isDark ? 'light_mode' : 'dark_mode'}
            </motion.span>
          </motion.button>

          {/* Separador vertical */}
          <div className="w-[1px] h-6 bg-[#e6d5e2] dark:bg-white/10 transition-colors hidden xs:block" />

          {/* Mock Avatar del usuario */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 p-1 pr-3 sm:pr-3.5 rounded-full bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 cursor-pointer transition-all shadow-xs"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.name || 'Mateo Rivaes'}
              size="sm"
            />
            <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-[#FAF5F8] hidden sm:inline-block">
              {user?.name || 'Mi Perfil'}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
