import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/avatar';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { useTheme } from '../../context/theme-context';
import { useAuth } from '../../context/auth-context';
import { usePlayer } from '../../context/player-context';
import { useLanguage } from '../../context/language-context';
import { LanguageSelector } from '../ui/language-selector';
import { searchEverything, buildNewsHash, NEWS_KINDS } from '../../services/global-search';

const SEARCH_SCOPES = [
  { id: 'all', label: 'Todo', icon: 'apps' },
  { id: 'tracks', label: 'Canciones', icon: 'music_note' },
  { id: 'news', label: 'Noticias', icon: 'newspaper' },
];

export const Navbar = ({
  links = [
    { id: 'explore', label: 'Explorar', path: '#explore' },
    { id: 'noticias', label: 'Noticias', path: '#noticias' },
    { id: 'community', label: 'Comunidad', path: '#community' },
  ],
  onNavigate = () => {},
  onSearch = null,
  showSearch = true,
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || 'explore';
  });
  const [navSearch, setNavSearch] = useState('');
  const [navScope, setNavScope] = useState('all');
  const [navResults, setNavResults] = useState({ tracks: [], news: [] });
  const [isNavSearching, setIsNavSearching] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navDropdownRef = useRef(null);
  const navDebounceRef = useRef(null);

  const { isDark, toggleTheme } = useTheme();
  const { user: authUser, isAuthenticated, logout, isJunior, isParentalControlActive } = useAuth();
  const { toggleTrack, currentTrack, isPlaying } = usePlayer();
  const { t } = useLanguage();

  const totalResults = navResults.tracks.length + navResults.news.length;
  const flatResults = useMemo(
    () => [
      ...navResults.tracks.map((item) => ({ kind: 'track', item })),
      ...navResults.news.map((item) => ({ kind: 'news', item })),
    ],
    [navResults]
  );

  const resetNavSearch = useCallback(() => {
    setNavSearch('');
    setNavResults({ tracks: [], news: [] });
    setIsNavSearching(false);
    setIsNavDropdownOpen(false);
    setHasSearched(false);
    setActiveIndex(-1);
    setNavScope('all');
    if (navDebounceRef.current) {
      clearTimeout(navDebounceRef.current);
      navDebounceRef.current = null;
    }
  }, []);

  const [userPoints, setUserPoints] = useState(() => {
    try {
      return Number(localStorage.getItem('sonar_user_points') || authUser?.sonarPoints || 1250);
    } catch {
      return 1250;
    }
  });

  const [equippedFrame, setEquippedFrame] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_frame') || authUser?.equippedFrame || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const handleCustomizationChange = (e) => {
      if (e.detail?.equippedFrame !== undefined) setEquippedFrame(e.detail.equippedFrame);
    };
    const handlePointsAwarded = () => {
      try {
        const p = Number(localStorage.getItem('sonar_user_points') || 1250);
        setUserPoints(p);
      } catch {}
    };
    window.addEventListener('sonar:profile-customization-changed', handleCustomizationChange);
    window.addEventListener('sonar:points-awarded', handlePointsAwarded);
    return () => {
      window.removeEventListener('sonar:profile-customization-changed', handleCustomizationChange);
      window.removeEventListener('sonar:points-awarded', handlePointsAwarded);
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setActiveTab(hash.split('?')[0] || 'explore');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setIsNavDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (navDebounceRef.current) clearTimeout(navDebounceRef.current);
    };
  }, []);

  const handleNavClick = (link) => {
    setActiveTab(link.id);
    if (link.path) {
      window.location.hash = link.path.startsWith('#') ? link.path : `#${link.path.replace(/^\//, '')}`;
    }
    onNavigate(link.id);
  };

  const goToSongs = useCallback(
    (term) => {
      setIsNavDropdownOpen(false);
      sessionStorage.setItem('sonar_pending_search', term);
      if (onSearch) onSearch(term);
      window.dispatchEvent(new CustomEvent('sonar:search', { detail: term }));

      if (window.location.hash !== '#explore' && window.location.hash !== '') {
        window.location.hash = '#explore';
      } else {
        setTimeout(() => {
          document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    },
    [onSearch]
  );

  const goToNews = useCallback((term, item) => {
    setIsNavDropdownOpen(false);
    window.location.hash = buildNewsHash(term, item ? { kind: item.kind, id: item.id } : undefined);
  }, []);

  const handleNavSearchChange = (e) => {
    const val = e.target.value;
    setNavSearch(val);
    setActiveIndex(-1);

    if (navDebounceRef.current) clearTimeout(navDebounceRef.current);

    if (!val.trim()) {
      resetNavSearch();
      return;
    }

    setIsNavSearching(true);
    setHasSearched(false);
    setIsNavDropdownOpen(true);

    navDebounceRef.current = setTimeout(async () => {
      try {
        const { tracks, news } = await searchEverything(val.trim(), { scope: navScope });
        setNavResults({ tracks, news });
        setHasSearched(true);
      } catch (err) {
        console.error('Error en búsqueda de navbar:', err);
        setNavResults({ tracks: [], news: [] });
        setHasSearched(true);
      } finally {
        setIsNavSearching(false);
      }
    }, 280);
  };

  const runSearchNow = useCallback(
    (term, scope) => {
      if (navDebounceRef.current) clearTimeout(navDebounceRef.current);
      if (!term) return;
      setIsNavSearching(true);
      setHasSearched(false);
      setIsNavDropdownOpen(true);
      searchEverything(term, { scope })
        .then(({ tracks, news }) => {
          setNavResults({ tracks, news });
          setHasSearched(true);
        })
        .catch((err) => {
          console.error('Error en búsqueda de navbar:', err);
          setNavResults({ tracks: [], news: [] });
          setHasSearched(true);
        })
        .finally(() => setIsNavSearching(false));
    },
    []
  );

  const handleNavSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const term = navSearch.trim();
    if (!term) return;

    if (navScope === 'news') {
      goToNews(term);
      return;
    }
    if (navScope === 'all' && navResults.news.length > 0 && navResults.tracks.length === 0) {
      goToNews(term);
      return;
    }
    goToSongs(term);
  };

  const handleSelectResult = useCallback(
    (result) => {
      if (!result) return;
      if (result.kind === 'track') {
        setNavSearch(result.item.title);
        goToSongs(result.item.title);
        return;
      }
      goToNews(result.item.title, result.item);
    },
    [goToNews, goToSongs]
  );

  const handleSelectNavAlbum = (album) => {
    setNavSearch(album.title);
    goToSongs(album.title);
  };

  const handleNavKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsNavDropdownOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!flatResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsNavDropdownOpen(true);
      setActiveIndex((i) => (i + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsNavDropdownOpen(true);
      setActiveIndex((i) => (i <= 0 ? flatResults.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelectResult(flatResults[activeIndex]);
    }
  };

  const displayName = authUser?.username || authUser?.name || 'Mi Perfil';

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--bg-navbar)] border-b border-[var(--border-subtle)] backdrop-blur-md transition-colors duration-300 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Izquierda: Logo principal animado */}
        <div className="shrink-0">
          <AnimatedLogo
            onClick={() => {
              window.location.hash = '#explore';
            }}
          />
        </div>

        {/* Centro: Buscador global (canciones + contenido editorial) */}
        {showSearch && (
          <div ref={navDropdownRef} className="hidden md:flex relative flex-1 max-w-[440px] mx-2 lg:mx-4">
            <form onSubmit={handleNavSearchSubmit} className="w-full" role="search">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[var(--text-muted)] pointer-events-none">
                  search
                </span>
                <input
                  type="search"
                  role="combobox"
                  aria-expanded={isNavDropdownOpen}
                  aria-controls="sonar-search-results"
                  aria-autocomplete="list"
                  aria-label="Buscar canciones, artistas y noticias"
                  placeholder="Busca canciones, artistas o noticias…"
                  value={navSearch}
                  onChange={handleNavSearchChange}
                  onKeyDown={handleNavKeyDown}
                  onFocus={() => {
                    if (navSearch.trim()) setIsNavDropdownOpen(true);
                  }}
                  className="w-full pl-10 pr-20 py-2.5 rounded-2xl text-[13px] font-medium bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:bg-[var(--bg-card)] focus:shadow-[0_0_0_4px_rgba(184,12,9,0.12)] transition-all"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isNavSearching && (
                    <div className="w-3.5 h-3.5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                  )}
                  {navSearch && (
                    <button
                      type="button"
                      onClick={resetNavSearch}
                      className="w-6 h-6 rounded-full grid place-items-center text-[var(--text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--bg-surface-secondary)] transition-colors cursor-pointer"
                      aria-label="Limpiar búsqueda"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Panel de resultados unificados */}
            <AnimatePresence>
              {isNavDropdownOpen && navSearch.trim() && (
                <motion.div
                  id="sonar-search-results"
                  role="listbox"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-3xl bg-[var(--bg-navbar)] backdrop-blur-2xl border border-[var(--border-subtle)] shadow-[0_28px_60px_-18px_rgba(35,17,35,0.45)] z-50 overflow-hidden"
                >
                  {/* Selector de alcance */}
                  <div className="flex items-center gap-1 p-2 border-b border-[var(--border-subtle)]">
                    {SEARCH_SCOPES.map((scope) => {
                      const isActiveScope = navScope === scope.id;
                      const scopeCount =
                        scope.id === 'tracks'
                          ? navResults.tracks.length
                          : scope.id === 'news'
                            ? navResults.news.length
                            : totalResults;
                      return (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => {
                            setNavScope(scope.id);
                            setActiveIndex(-1);
                            runSearchNow(navSearch.trim(), scope.id);
                          }}
                          aria-pressed={isActiveScope}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                            isActiveScope
                              ? 'bg-[var(--color-sonar-base)] dark:bg-[var(--color-sonar-surface)] text-white dark:text-[var(--color-sonar-text)] shadow-sm'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-secondary)]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{scope.icon}</span>
                          <span>{scope.label}</span>
                          {hasSearched && !isActiveScope && scopeCount > 0 && (
                            <span className="text-[9px] opacity-70">{scopeCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="max-h-[min(58vh,460px)] overflow-y-auto">
                    {/* Cargando */}
                    {isNavSearching && !hasSearched && (
                      <div className="p-2.5 flex flex-col gap-1.5">
                        {[0, 1, 2].map((row) => (
                          <div
                            key={row}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-[var(--bg-surface-secondary)]/60 animate-pulse"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[var(--border-subtle)]" />
                            <div className="flex-1 flex flex-col gap-1.5">
                              <div className="h-2.5 w-2/3 rounded-full bg-[var(--border-subtle)]" />
                              <div className="h-2 w-1/3 rounded-full bg-[var(--border-subtle)]" />
                            </div>
                          </div>
                        ))}
                        <p className="text-[10px] text-center text-[var(--text-secondary)] pt-1 font-semibold">
                          Buscando en Deezer y en el contenido editorial de Sonar…
                        </p>
                      </div>
                    )}

                    {/* Sin resultados: "No existe" */}
                    {!isNavSearching && hasSearched && totalResults === 0 && (
                      <div className="px-6 py-8 flex flex-col items-center text-center gap-2.5">
                        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--bg-surface-secondary)] to-[var(--border-subtle)] grid place-items-center">
                          <span className="material-symbols-outlined text-[26px] text-[var(--color-accent)]">
                            search_off
                          </span>
                        </span>
                        <p className="text-sm font-black text-[var(--text-main)]">
                          No existe &ldquo;{navSearch.trim()}&rdquo;
                        </p>
                        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] max-w-[270px]">
                          No encontramos canciones, noticias, sellos ni vinilos con ese término. Prueba con
                          &ldquo;Radiohead&rdquo;, &ldquo;vinilo&rdquo; o &ldquo;festivales&rdquo;.
                        </p>
                      </div>
                    )}

                    {/* Resultados */}
                    {!isNavSearching && totalResults > 0 && (
                      <div className="p-1.5 flex flex-col gap-1">
                        {navResults.tracks.length > 0 && (
                          <div className="flex flex-col gap-0.5">
                            <div className="px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--text-secondary)] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[12px] text-[var(--color-accent)]">
                                music_note
                              </span>
                              <span>Canciones</span>
                              <span className="opacity-60">({navResults.tracks.length})</span>
                            </div>
                            {navResults.tracks.map((song, index) => {
                              const isItemPlaying =
                                (currentTrack?.id === song.id || currentTrack?.title === song.title) && isPlaying;
                              const isActive = activeIndex === index;
                              return (
                                <div
                                  key={`track-${song.id}`}
                                  role="option"
                                  aria-selected={isActive}
                                  className={`group flex items-center justify-between gap-2 p-2 rounded-2xl transition-colors ${
                                    isActive
                                      ? 'bg-[var(--bg-surface-secondary)]'
                                      : 'hover:bg-[var(--bg-card-hover)]'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleSelectNavAlbum(song)}
                                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                                  >
                                    {song.cover ? (
                                      <img
                                        src={song.cover}
                                        alt=""
                                        className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0"
                                      />
                                    ) : (
                                      <span className="w-10 h-10 rounded-xl bg-[var(--bg-surface-secondary)] grid place-items-center shrink-0">
                                        <span className="material-symbols-outlined text-[16px] text-[var(--color-accent)]">
                                          music_note
                                        </span>
                                      </span>
                                    )}
                                    <span className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold text-[var(--text-main)] truncate">
                                        {song.title}
                                      </span>
                                      <span className="text-[10px] text-[var(--text-secondary)] truncate">
                                        {song.artist}
                                        {song.album && song.album !== song.title ? ` · ${song.album}` : ''}
                                      </span>
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleTrack({
                                        id: song.id,
                                        trackId: song.id,
                                        deezerId: song.id,
                                        title: song.title,
                                        artist: song.artist,
                                        album: song.album || song.title,
                                        cover: song.cover,
                                        preview: song.preview,
                                      })
                                    }
                                    className="w-7 h-7 rounded-full bg-[var(--color-accent)] text-white grid place-items-center shrink-0 shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                    title="Reproducir muestra (30s)"
                                    aria-label={`Reproducir ${song.title}`}
                                  >
                                    <span className="material-symbols-outlined text-[15px]">
                                      {isItemPlaying ? 'pause' : 'play_arrow'}
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {navResults.news.length > 0 && (
                          <div className="flex flex-col gap-0.5">
                            <div className="px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--text-secondary)] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[12px] text-[var(--color-accent)]">
                                newspaper
                              </span>
                              <span>Noticias</span>
                              <span className="opacity-60">({navResults.news.length})</span>
                            </div>
                            {navResults.news.map((item, index) => {
                              const offset = navResults.tracks.length;
                              const isActive = activeIndex === offset + index;
                              const kind = NEWS_KINDS[item.kind] || { label: 'Contenido', icon: 'article' };
                              return (
                                <button
                                  key={`${item.kind}-${item.id}`}
                                  type="button"
                                  role="option"
                                  aria-selected={isActive}
                                  onClick={() => handleSelectResult({ kind: 'news', item })}
                                  className={`group flex items-center gap-2.5 p-2 rounded-2xl text-left transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-[var(--bg-surface-secondary)]'
                                      : 'hover:bg-[var(--bg-card-hover)]'
                                  }`}
                                >
                                  {item.cover ? (
                                    <img
                                      src={item.cover}
                                      alt=""
                                      className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0"
                                    />
                                  ) : (
                                    <span className="w-10 h-10 rounded-xl bg-[var(--bg-surface-secondary)] grid place-items-center shrink-0">
                                      <span className="material-symbols-outlined text-[16px] text-[var(--color-accent)]">
                                        {kind.icon}
                                      </span>
                                    </span>
                                  )}
                                  <span className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs font-bold text-[var(--text-main)] truncate">
                                      {item.title}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-secondary)] truncate">
                                      <span className="font-black text-[var(--color-accent)]">
                                        {kind.label}
                                      </span>
                                      {item.subtitle ? ` · ${item.subtitle}` : ''}
                                    </span>
                                  </span>
                                  <span className="material-symbols-outlined text-[16px] text-[var(--border-medium)] group-hover:text-[var(--color-accent)] shrink-0">
                                    arrow_forward
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Acciones de resultados completos */}
                  {hasSearched && totalResults > 0 && (
                    <div className="p-2 border-t border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-surface-secondary)]/70">
                      {navResults.news.length > 0 && (
                        <button
                          type="button"
                          onClick={handleNavSearchSubmit}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[11px] font-black transition-colors cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">newspaper</span>
                          <span className="truncate">Ver noticias de &ldquo;{navSearch.trim()}&rdquo;</span>
                        </button>
                      )}
                      {navResults.tracks.length > 0 && navScope !== 'news' && (
                        <button
                          type="button"
                          onClick={() => goToSongs(navSearch.trim())}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-accent)] text-[11px] font-black text-[var(--text-main)] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">music_note</span>
                          <span className="truncate">Ver canciones de &ldquo;{navSearch.trim()}&rdquo;</span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
                  className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-[#231123] dark:text-white'
                      : 'text-[#482d46] hover:text-[#B80C09] dark:text-[#d8c5d3] dark:hover:text-white'
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

          {/* Selector de Idioma (i18n) */}
          <LanguageSelector variant="navbar" />

          {/* Separador vertical */}
          <div className="w-[1px] h-6 bg-[#e6d5e2] dark:border-white/10 transition-colors hidden xs:block" />

          {/* Avatar del usuario o Botón de Ingreso */}
          {isAuthenticated && authUser ? (
            <div className="flex items-center gap-2">
              {/* Badge visual de Modo Junior / Parental Control */}
              {(isJunior || isParentalControlActive) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.location.hash = '#usuario';
                    sessionStorage.setItem('sonar_active_profile_tab', 'parental_control');
                    window.dispatchEvent(new CustomEvent('sonar:navigate-tab', { detail: 'parental_control' }));
                  }}
                  title="Modo Kids y Control Parental activo. Clic para administrar."
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4B2840]/15 dark:bg-[#4B2840]/40 text-[#4B2840] dark:text-[#DCDCDD] border border-[#4B2840]/30 text-[11px] font-black tracking-wide cursor-pointer shadow-xs hover:bg-[#4B2840]/25 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">child_care</span>
                  <span>Modo Kids</span>
                </motion.button>
              )}

              {/* Badge Sonar Coins / Boutique */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.hash = '#usuario';
                  sessionStorage.setItem('sonar_active_profile_tab', 'recompensas');
                  window.dispatchEvent(new CustomEvent('sonar:navigate-tab', { detail: 'recompensas' }));
                }}
                title="Tus Sonar Coins acumuladas. Clic para canjear en la Boutique."
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#003844]/10 dark:bg-[#003844]/40 text-[#003844] dark:text-[#DCDCDD] border border-[#003844]/30 text-[11px] font-mono font-black tracking-wide cursor-pointer shadow-xs hover:bg-[#003844]/20 transition-all"
              >
                <span className="material-symbols-outlined text-[14px] text-[#003844] dark:text-[#52a2b0]">toll</span>
                <span>{userPoints.toLocaleString()}</span>
              </motion.button>

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
                  avatarHue={authUser?.avatarHue}
                  avatarTone={authUser?.avatarTone}
                  avatarSeed={authUser?.avatarSeed}
                  avatarStyle={authUser?.avatarStyle}
                  avatarIcon={authUser?.avatarIcon}
                  frame={equippedFrame}
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
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-[#231123] dark:text-white hover:text-[#B80C09] dark:hover:text-[#ff6b68] bg-[#f0e2ee] dark:bg-white/10 border border-[#ddcadb] dark:border-white/10 transition-all shadow-2xs cursor-pointer"
              >
                Ingresar
              </a>
              <a
                href="#register"
                className="px-3.5 py-1.5 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
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
