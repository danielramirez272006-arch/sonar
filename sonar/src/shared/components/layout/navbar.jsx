import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/avatar';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { useTheme } from '../../context/theme-context';
import { useAuth } from '../../context/auth-context';

export const Navbar = ({
  links = [
    { id: 'explore', label: 'Explorar', path: '#explore' },
    { id: 'community', label: 'Comunidad', path: '#community' },
  ],
  onNavigate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || 'explore';
  });
  const { isDark, toggleTheme } = useTheme();
  const { user: authUser, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setActiveTab(hash || 'explore');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavClick = (link) => {
    setActiveTab(link.id);
    if (link.path) {
      window.location.hash = link.path.startsWith('#') ? link.path : `#${link.path.replace(/^\//, '')}`;
    }
    onNavigate(link.id);
  };

  const displayName = authUser?.username || authUser?.name || 'Mi Perfil';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#180c18]/95 border-b border-[#e6d5e2] dark:border-white/10 backdrop-blur-md transition-colors duration-300 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-4">
        {/* Izquierda: Logo principal animado */}
        <AnimatedLogo
          onClick={() => {
            window.location.hash = '#explore';
          }}
        />

        {/* Derecha: Enlaces, Botón de Tema & Avatar / Auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Enlaces de navegación con fondo transparente/translúcido en modo oscuro */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-[#231123] dark:text-white'
                      : 'text-[#5c435a] hover:text-[#231123] dark:text-gray-300 dark:hover:text-white dark:bg-transparent'
                  }`}
                >
                  {link.label}

                  {/* Indicador translúcido de tab activo */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-[#f8e9f6] dark:bg-white/10 border border-[#e6d5e2] dark:border-white/15 rounded-xl -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Botón Switch Modo Blanco / Modo Negro con fondo translúcido */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            type="button"
            aria-label="Cambiar tema"
            title={isDark ? 'Cambiar a Modo Blanco' : 'Cambiar a Modo Negro'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#f8e9f6] dark:bg-white/5 text-[#231123] dark:text-gray-200 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09] dark:hover:border-white/20 hover:text-[#B80C09] dark:hover:text-[#ff6b68] dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
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
          <div className="w-[1px] h-6 bg-[#e6d5e2] dark:border-white/10 transition-colors hidden xs:block" />

          {/* Avatar del usuario o Botón de Ingreso */}
          {isAuthenticated && authUser ? (
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { window.location.hash = authUser.role === 'admin' ? '#admin' : '#usuario'; }}
                className="flex items-center gap-2.5 p-1 pr-3 sm:pr-3.5 rounded-full bg-[#f8e9f6] dark:bg-white/5 border border-[#e6d5e2] dark:border-white/10 hover:dark:bg-white/10 cursor-pointer transition-all shadow-xs"
              >
                <Avatar
                  src={authUser?.avatarUrl}
                  name={displayName}
                  size="sm"
                />
                <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-[#FAF5F8] hidden sm:inline-block max-w-[120px] truncate">
                  {displayName}
                </span>
              </motion.div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.hash = '#explore';
                }}
                title="Cerrar sesión"
                className="p-2 rounded-xl text-[#5c435a] dark:text-[#B89CB0] hover:text-[#B80C09] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="#login"
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-[#231123] dark:text-white hover:text-[#B80C09] transition-colors"
              >
                Ingresar
              </a>
              <a
                href="#register"
                className="px-3.5 py-1.5 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                Registrarse
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
