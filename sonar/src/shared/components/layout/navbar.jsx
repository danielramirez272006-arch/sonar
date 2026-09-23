import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/avatar';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { useTheme } from '../../context/theme-context';
import { useAuth } from '../../context/auth-context';
import { usePlayer } from '../../context/player-context';
import { searchAlbums } from '../../services/deezer-service';

export const Navbar = ({
  links = [
    { id: 'explore', label: 'Explorar', path: '#explore' },
    { id: 'community', label: 'Comunidad', path: '#community' },
  ],
  onNavigate = () => {},
  onSearch = null,
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || 'explore';
  });
  const [navSearch, setNavSearch] = useState('');
  const [navResults, setNavResults] = useState([]);
  const [isNavSearching, setIsNavSearching] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const navDropdownRef = useRef(null);
  const navDebounceRef = useRef(null);

  const { isDark, toggleTheme } = useTheme();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { toggleTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setActiveTab(hash || 'explore');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setIsNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (link) => {
    setActiveTab(link.id);
    if (link.path) {
      window.location.hash = link.path.startsWith('#') ? link.path : `#${link.path.replace(/^\//, '')}`;
    }
    onNavigate(link.id);
  };

  const handleNavSearchChange = (e) => {
    const val = e.target.value;
    setNavSearch(val);

    if (navDebounceRef.current) clearTimeout(navDebounceRef.current);

    if (!val.trim()) {
      setNavResults([]);
      setIsNavSearching(false);
      setIsNavDropdownOpen(false);
      return;
    }

    setIsNavSearching(true);
    setIsNavDropdownOpen(true);

    navDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchAlbums(val.trim());
        setNavResults(results.slice(0, 4));
      } catch (err) {
        console.error('Error en búsqueda de navbar:', err);
      } finally {
        setIsNavSearching(false);
      }
    }, 260);
  };

  const handleNavSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!navSearch.trim()) return;
    const term = navSearch.trim();
    setIsNavDropdownOpen(false);
    
    sessionStorage.setItem('sonar_pending_search', term);

    if (onSearch) {
      onSearch(term);
    }
    window.dispatchEvent(new CustomEvent('sonar:search', { detail: term }));
    
    if (window.location.hash !== '#explore' && window.location.hash !== '') {
      window.location.hash = '#explore';
    } else {
      setTimeout(() => {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const handleSelectNavAlbum = (album) => {
    setIsNavDropdownOpen(false);
    setNavSearch(album.title);
    sessionStorage.setItem('sonar_pending_search', album.title);

    if (onSearch) {
      onSearch(album.title);
    }
    window.dispatchEvent(new CustomEvent('sonar:search', { detail: album.title }));
    
    if (window.location.hash !== '#explore' && window.location.hash !== '') {
      window.location.hash = '#explore';
    } else {
      setTimeout(() => {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const displayName = authUser?.username || authUser?.name || 'Mi Perfil';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#180c18]/95 border-b border-[#e6d5e2] dark:border-white/10 backdrop-blur-md transition-colors duration-300 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Izquierda: Logo principal animado */}
        <div className="shrink-0">
          <AnimatedLogo
            onClick={() => {
              window.location.hash = '#explore';
            }}
          />
        </div>

        {/* Centro: Barra de búsqueda rápida superior (Básica con mini preview) */}
        <div ref={navDropdownRef} className="hidden md:flex relative flex-1 max-w-[340px] mx-2 lg:mx-4">
          <form onSubmit={handleNavSearchSubmit} className="w-full">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar canciones o artistas en Sonar..."
                value={navSearch}
                onChange={handleNavSearchChange}
                onFocus={() => {
                  if (navResults.length > 0) setIsNavDropdownOpen(true);
                }}
                className="w-full pl-9 pr-14 py-1.5 rounded-full text-xs font-medium bg-[#f6ebf4] dark:bg-white/5 border border-[#e6d5e2] dark:border-white/10 text-[#231123] dark:text-white placeholder-[#876a84] dark:placeholder-gray-400 focus:outline-none focus:border-[#B80C09] focus:bg-white dark:focus:bg-[#251225] transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isNavSearching && (
                  <div className="w-3.5 h-3.5 border-2 border-[#B80C09] border-t-transparent rounded-full animate-spin" />
                )}
                {navSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setNavSearch('');
                      setNavResults([]);
                      setIsNavDropdownOpen(false);
                    }}
                    className="text-gray-400 hover:text-[#B80C09] text-xs cursor-pointer px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Menú Flotante Mini de Resultados Rápidos en Navbar */}
          <AnimatePresence>
            {isNavDropdownOpen && navResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#221022]/95 backdrop-blur-2xl border border-[#e6d5e2] dark:border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-50 flex flex-col gap-1"
              >
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#5c435a] dark:text-gray-400 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span>CANCIONES EN DEEZER</span>
                  <button
                    type="button"
                    onClick={handleNavSearchSubmit}
                    className="text-[9px] font-bold text-[#B80C09] hover:underline cursor-pointer flex items-center gap-0.5"
                    title="Ver todas las canciones"
                  >
                    <span>ENTER PARA VER MÁS</span>
                    <span className="material-symbols-outlined text-[11px]">arrow_forward</span>
                  </button>
                </div>

                {navResults.map((song) => {
                  const isItemPlaying = (currentTrack?.id === song.id || currentTrack?.title === song.title) && isPlaying;
                  return (
                    <div
                      key={song.id}
                      className="group flex items-center justify-between p-1.5 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/10 transition-colors"
                    >
                      <div
                        onClick={() => handleSelectNavAlbum(song)}
                        className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                      >
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-8 h-8 rounded-lg object-cover shadow-2xs shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#231123] dark:text-white truncate group-hover:text-[#B80C09] transition-colors">
                            {song.title}
                          </span>
                          <span className="text-[10px] text-[#5c435a] dark:text-[#B89CB0] truncate">
                            {song.artist} {song.album && song.album !== song.title ? `· ${song.album}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Mini Botón Play Directo en Navbar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrack({
                            id: song.id,
                            trackId: song.id,
                            deezerId: song.id,
                            title: song.title,
                            artist: song.artist,
                            album: song.album || song.title,
                            cover: song.cover,
                            preview: song.preview,
                          });
                        }}
                        className="w-6 h-6 rounded-full bg-[#B80C09] text-white flex items-center justify-center shrink-0 shadow-2xs hover:scale-110 transition-transform cursor-pointer ml-1"
                        title="Reproducir muestra (30s)"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isItemPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    </div>
                  );
                })}

                {/* Botón inferior: Ver todas las canciones */}
                <button
                  type="button"
                  onClick={handleNavSearchSubmit}
                  className="w-full mt-1 p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white dark:hover:bg-[#B80C09] dark:hover:text-white text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-gray-800 dark:text-gray-200 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">search</span>
                  <span>Ver todas las canciones para &ldquo;{navSearch}&rdquo;</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                  avatarBg={authUser?.avatarBg || authUser?.avatarColor}
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
