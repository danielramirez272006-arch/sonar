import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../shared/context/theme-context';
import { searchAlbums, searchTracks, searchArtists, getAlbumTracks, isKidsSafeTrack } from '../../../shared/services/deezer-service';
import { usePlayer } from '../../../shared/context/player-context';
import { useAuth } from '../../../shared/context/auth-context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../shared/context/language-context';
import { handleImageFallbackError, getFallbackCoverForAlbum } from '../../../shared/services/recommendations-service';

const SEARCH_TABS = [
  { id: 'all', label: 'Todo', icon: 'manage_search' },
  { id: 'artist', label: 'Artistas', icon: 'person' },
  { id: 'track', label: 'Canciones', icon: 'music_note' },
  { id: 'album', label: 'Álbumes', icon: 'album' },
  { id: 'lyrics', label: 'Letras', icon: 'lyrics' },
];

const SCENARIOS = [
  { id: 'rain', label: 'Día lluvioso / Café', icon: 'water_drop', query: 'Bill Evans' },
  { id: 'night', label: 'Conducir de noche', icon: 'bedtime', query: 'Kavinsky' },
  { id: 'audiophile', label: 'Auriculares de estudio', icon: 'headphones', query: 'Radiohead In Rainbows' },
  { id: 'euphoria', label: 'Euforia & Concentración', icon: 'bolt', query: 'Daft Punk' },
];

const LABELS_AND_PRODUCERS = [
  { id: 'warp', label: 'Warp Records', icon: 'sell', query: 'Aphex Twin' },
  { id: 'bluenote', label: 'Blue Note', icon: 'sell', query: 'Miles Davis' },
  { id: 'xl', label: 'XL Recordings', icon: 'sell', query: 'Radiohead' },
  { id: '4ad', label: '4AD', icon: 'sell', query: 'Cocteau Twins' },
  { id: 'eno', label: 'Brian Eno (Prod.)', icon: 'record_voice_over', query: 'Brian Eno' },
  { id: 'godrich', label: 'Nigel Godrich (Prod.)', icon: 'record_voice_over', query: 'Radiohead' },
  { id: 'rubin', label: 'Rick Rubin (Prod.)', icon: 'record_voice_over', query: 'Red Hot Chili Peppers' },
];

const DECADES = [
  { id: 'all-dec', label: 'Todas las épocas', query: 'Bowie' },
  { id: '70s', label: '70s Clásicos', query: 'Pink Floyd' },
  { id: '80s', label: '80s Sintes', query: 'Depeche Mode' },
  { id: '90s', label: '90s Grunge / IDM', query: 'Nirvana' },
  { id: '00s', label: '2000s Art Rock', query: 'The Strokes' },
  { id: '10s', label: '2010s', query: 'Tame Impala' },
  { id: '20s', label: '2020s Actual', query: 'Rosalia' },
];

const GENRES_COLORFUL = [
  { label: 'Art Rock', query: 'Radiohead Pink Floyd', bg: 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-300 border-rose-400/30' },
  { label: 'Jazz & Soul', query: 'Miles Davis John Coltrane', bg: 'from-amber-500/20 to-yellow-500/20 text-amber-700 dark:text-amber-300 border-amber-400/30' },
  { label: 'Electrónica / IDM', query: 'Daft Punk Aphex Twin', bg: 'from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-400/30' },
  { label: 'Hip Hop Clásico', query: 'Kendrick Lamar Nas', bg: 'from-purple-500/20 to-violet-500/20 text-purple-700 dark:text-purple-300 border-purple-400/30' },
  { label: 'Indie & Psicodelia', query: 'Tame Impala Beach House', bg: 'from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/30' },
  { label: 'Ambient & Chill', query: 'Brian Eno Slowdive', bg: 'from-indigo-500/20 to-sky-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400/30' },
];

const TYPEWRITER_SUGGESTIONS = [
  "Prueba 'Currents' de Tame Impala...",
  "Prueba 'Kind of Blue' de Miles Davis...",
  "Prueba 'Random Access Memories' de Daft Punk...",
  "Prueba 'Vespertine' de Björk...",
  "Prueba 'In Rainbows' de Radiohead...",
  "Prueba 'Motomami' de Rosalía...",
  "Prueba 'To Pimp A Butterfly' de Kendrick..."
];

const KIDS_TYPEWRITER_SUGGESTIONS = [
  "Prueba 'Mozart'...",
  "Prueba 'The Beatles'...",
  "Prueba 'Discovery' de Daft Punk...",
  "Prueba 'Lo-Fi para estudiar'...",
  "Prueba 'Bandas Sonoras para niños'...",
  "Prueba 'Canciones de Cuna'..."
];

const TRENDING_SEARCHES = [
  'Radiohead', 'Tame Impala', 'Miles Davis', 'Daft Punk', 'Pink Floyd', 'Rosalía', 'Kendrick Lamar', 'Björk'
];

const KIDS_TRENDING_SEARCHES = [
  'Mozart', 'The Beatles', 'Daft Punk', 'Lo-Fi Estudio', 'Bandas Sonoras', 'Clásicos Kids'
];

export const HeroSearch = ({ onSearch = () => {}, onSubmit = () => {} }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterPanel, setFilterPanel] = useState('none'); // 'none' | 'scenarios' | 'labels' | 'decades' | 'genres' | 'energy'
  const [liveResults, setLiveResults] = useState([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [previewTracklist, setPreviewTracklist] = useState(null);
  const [loadingTracklistId, setLoadingTracklistId] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(50);

  // Typewriter dynamic placeholder
  const [placeholderText, setPlaceholderText] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const recognitionRef = useRef(null);

  const { isDarkMode } = useTheme();
  const { toggleTrack, currentTrack, isPlaying } = usePlayer();
  const { isJunior, isParentalControlActive } = useAuth() || {};
  const { t } = useTranslation();
  const isKidsActive = Boolean(isJunior || isParentalControlActive);

  const currentSuggestionsPool = isKidsActive ? KIDS_TYPEWRITER_SUGGESTIONS : TYPEWRITER_SUGGESTIONS;
  const currentTrendingPool = isKidsActive ? KIDS_TRENDING_SEARCHES : TRENDING_SEARCHES;

  // Typewriter Effect
  useEffect(() => {
    if (searchValue) return;
    const currentSuggestion = currentSuggestionsPool[suggestionIdx % currentSuggestionsPool.length];
    let timeout;

    if (!isDeleting && charIdx < currentSuggestion.length) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentSuggestion.substring(0, charIdx + 1));
        setCharIdx((prev) => prev + 1);
      }, 70);
    } else if (!isDeleting && charIdx === currentSuggestion.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentSuggestion.substring(0, charIdx - 1));
        setCharIdx((prev) => prev - 1);
      }, 35);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setSuggestionIdx((prev) => (prev + 1) % currentSuggestionsPool.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, suggestionIdx, searchValue, currentSuggestionsPool]);

  // Cargar búsquedas recientes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sonar_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  // Atajo global Ctrl + K y /
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === '/' && document.activeElement !== inputRef.current && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setHoveredAlbum(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda por Voz (Speech-to-Text) con soporte nativo y asistente visual
  const toggleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    setIsListening(true);

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let spokenText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            spokenText += event.results[i][0].transcript;
          }
          if (spokenText) {
            setSearchValue(spokenText);
            if (event.results[0].isFinal) {
              executeSearch(spokenText);
              setIsListening(false);
            }
          }
        };

        recognition.onerror = (err) => {
          console.warn('Aviso de reconocimiento de voz:', err.error);
        };

        recognition.onend = () => {
          // Si terminó naturalmente
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn('No se pudo iniciar SpeechRecognition:', e);
      }
    }
  };

  const handleSimulateVoiceCommand = (phrase) => {
    setSearchValue(phrase);
    executeSearch(phrase);
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  const saveToRecentSearches = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('sonar_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('sonar_recent_searches');
    } catch {}
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
    setHighlightedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val || !val.trim()) {
      setLiveResults([]);
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    setIsDropdownOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        let results = [];
        if (activeTab === 'artist') {
          results = await searchArtists(val.trim());
        } else if (activeTab === 'track' || activeTab === 'lyrics') {
          results = await searchTracks(val.trim());
        } else {
          results = await searchAlbums(val.trim());
        }
        if (isKidsActive) {
          results = results.filter((item) => isKidsSafeTrack(item));
        }
        setLiveResults(results.slice(0, 6));
      } catch (err) {
        console.error('Error in live autocomplete:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 280);
  };

  const executeSearch = (query) => {
    if (!query || !query.trim()) return;
    saveToRecentSearches(query);
    setSearchValue(query);
    setIsDropdownOpen(false);
    setHoveredAlbum(null);
    onSubmit(query);
  };

  // Navegación con Teclado en el Autocompletado (↑, ↓, Enter, Esc, Espacio)
  const handleInputKeyDown = (e) => {
    if (!isDropdownOpen || liveResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < liveResults.length - 1 ? prev + 1 : 0;
        setHoveredAlbum(liveResults[next]);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : liveResults.length - 1;
        setHoveredAlbum(liveResults[next]);
        return next;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      setHoveredAlbum(null);
    } else if (e.key === ' ' && highlightedIndex >= 0 && highlightedIndex < liveResults.length) {
      e.preventDefault();
      const album = liveResults[highlightedIndex];
      toggleTrack({
        id: album.id,
        deezerId: album.id,
        title: album.title,
        artist: album.artist,
        album: album.title,
        cover: album.cover,
      });
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < liveResults.length) {
      e.preventDefault();
      executeSearch(liveResults[highlightedIndex].title);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      executeSearch(searchValue);
    }
  };

  const handleInspectTracklist = async (album, e) => {
    e.stopPropagation();
    if (previewTracklist?.id === album.id) {
      setPreviewTracklist(null);
      return;
    }
    setLoadingTracklistId(album.id);
    try {
      const tracks = await getAlbumTracks(album.id);
      setPreviewTracklist({
        id: album.id,
        albumTitle: album.title,
        artist: album.artist,
        cover: album.cover,
        tracks: tracks.slice(0, 4),
      });
    } catch (err) {
      console.error('Error al obtener canciones:', err);
    } finally {
      setLoadingTracklistId(null);
    }
  };

  const handleSearchSimilar = (album, e) => {
    e.stopPropagation();
    const similarQuery = `${album.artist} ${album.genre || ''}`.trim();
    executeSearch(similarQuery);
  };

  // Manejador del Slider de Energía
  const handleEnergyChange = (e) => {
    const val = Number(e.target.value);
    setEnergyLevel(val);
    let term = 'Khruangbin';
    if (val < 35) term = 'Slowdive';
    else if (val > 68) term = 'Daft Punk';
    executeSearch(term);
  };

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14 flex flex-col items-center justify-center text-center overflow-visible bg-[#fff7fa] dark:bg-[#231123] transition-colors duration-300">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] h-[220px] sm:h-[280px] bg-rose-200/40 dark:bg-[#B80C09]/15 blur-[90px] sm:blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <div className="max-w-[840px] w-full mx-auto relative z-30 flex flex-col items-center">
        {/* Título Principal y Subtítulo */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 text-[#231123] dark:text-[#FAF5F8]">
          <span className="bg-gradient-to-r from-[#231123] via-[#5c1d5e] to-[#B80C09] dark:from-white dark:via-rose-300 dark:to-[#B80C09] bg-clip-text text-transparent">
            {t('hero.title', 'Descubre. Escucha. Reseña.')}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-[560px] mb-5 font-medium">
          {t('hero.subtitle', 'Explora la enciclopedia sonora con búsqueda inteligente por voz, épocas, géneros y preescucha en vivo.')}
        </p>

        {/* Pestañas de Búsqueda Minimalistas (Segmented Control) */}
        <div className="inline-flex items-center p-1 rounded-full bg-[#f0e2ee] dark:bg-[#1a0b1b] border border-[#e0cbdd] dark:border-white/10 mb-4 gap-1 shadow-inner max-w-full overflow-x-auto">
          {SEARCH_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (searchValue.trim()) handleInputChange({ target: { value: searchValue } });
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#B80C09] text-white shadow-sm'
                    : 'text-[#5c435a] dark:text-[#B89CB0] hover:text-[#231123] dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Barra de Búsqueda Principal con Typewriter, Micrófono y Dropdown */}
        <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="w-full">
            <div className="relative w-full group">
              {/* Icono de Lupa */}
              <div className="absolute left-4.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 flex items-center gap-1.5 pointer-events-none transition-colors group-focus-within:text-[#B80C09]">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>

              {/* Input con Typewriter dinámico */}
              <input
                ref={inputRef}
                id="main-search-input"
                type="text"
                autoComplete="off"
                placeholder={
                  activeTab === 'lyrics'
                    ? 'Escribe un verso o letra...'
                    : activeTab === 'track'
                    ? 'Buscar por canción o pista...'
                    : activeTab === 'artist'
                    ? 'Buscar artista (ej: Radiohead, Björk)...'
                    : placeholderText || 'Buscar álbum, artista o melodía...'
                }
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full focus:outline-none transition-all duration-200 shadow-md focus:shadow-xl"
                style={{
                  padding: '0.9rem 11.5rem 0.9rem 3.2rem',
                  borderRadius: '9999px',
                  backgroundColor: isDarkMode ? '#2d152e' : '#ffffff',
                  color: isDarkMode ? '#FAF5F8' : '#1F2937',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid #E2D9E2',
                }}
              />

              {/* Botón de Micrófono (Búsqueda por Voz), Badge Ctrl+K y Botón Buscar */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                {/* Botón Micrófono */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md scale-110'
                      : 'text-gray-400 hover:text-[#B80C09] hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                  title={isListening ? 'Escuchando... Di el nombre del álbum o artista' : 'Buscar por voz'}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {isListening ? 'mic' : 'mic_none'}
                  </span>
                </button>

                {/* Badge Atajo Ctrl K */}
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-mono text-gray-500 dark:text-gray-300 font-bold border border-gray-200 dark:border-white/10">
                  Ctrl K
                </span>

                {isSearchingLive && (
                  <div className="w-4 h-4 border-2 border-[#B80C09] border-t-transparent rounded-full animate-spin mr-1" />
                )}

                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>{t('common.search', 'Buscar')}</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>

          {/* Banner Flotante Interactivo de Reconocimiento por Voz */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-[#B80C09]/95 via-[#7a184a]/95 to-[#3b123d]/95 backdrop-blur-2xl text-white shadow-2xl flex flex-col gap-2.5 z-50 border border-white/20 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-300 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      🎙️ {t('common.listening', 'Escuchando...')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsListening(false);
                      try {
                        recognitionRef.current?.stop();
                      } catch {}
                    }}
                    className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    ✕ {t('common.close', 'Cerrar')}
                  </button>
                </div>

                {/* Onda Sonora Animada */}
                <div className="flex items-center justify-center gap-1.5 py-1.5">
                  <span className="w-1.5 h-4 bg-rose-200 rounded-full animate-pulse" />
                  <span className="w-1.5 h-7 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="w-1.5 h-9 bg-rose-100 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1.5 h-3 bg-rose-300 rounded-full animate-pulse" />
                </div>

                {/* Comandos Rápidos de Voz */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5 border-t border-white/10">
                  <span className="text-[10px] font-bold text-rose-200">O prueba con:</span>
                  {['Radiohead', 'Rosalía', 'Daft Punk', 'Tame Impala', 'Kind of Blue'].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => handleSimulateVoiceCommand(sample)}
                      className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B80C09] text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      &ldquo;{sample}&rdquo;
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menú Desplegable Flotante con Quick Peek Card y Keyboard Navigation */}
          <AnimatePresence>
            {isDropdownOpen && !isListening && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.16 }}
                className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white/95 dark:bg-[#251225]/95 backdrop-blur-2xl border border-[#e6d5e2] dark:border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.3)] overflow-hidden text-left"
              >
                {!searchValue.trim() ? (
                  <div className="p-4 flex flex-col gap-3.5">
                    {/* Búsquedas Recientes */}
                    {recentSearches.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-[#5c435a] dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px]">history</span>
                            <span>{t('common.recent_searches', 'BÚSQUEDAS RECIENTES')}</span>
                          </span>
                          <button
                            type="button"
                            onClick={clearRecentSearches}
                            className="text-[#B80C09] hover:underline cursor-pointer font-bold text-[11px]"
                          >
                            {t('common.clear', 'Limpiar')}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => executeSearch(term)}
                              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-semibold text-[#231123] dark:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[13px] opacity-60">search</span>
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tendencias */}
                    <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-white/5 pt-3">
                      <div className="text-[11px] font-extrabold text-[#5c435a] dark:text-gray-400 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#B80C09]">trending_up</span>
                          <span>{isKidsActive ? 'TENDENCIAS FAMILIARES (MODO KIDS)' : 'TENDENCIAS GLOBALES'}</span>
                        </span>
                        {isKidsActive && (
                          <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            🛡️ Seguro
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentTrendingPool.map((term, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => executeSearch(term)}
                            className="px-3 py-1 rounded-full bg-[#f6e9f4] dark:bg-[#43233a]/70 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#5c1d5e] dark:text-pink-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B80C09] shrink-0" />
                            <span>{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 max-h-[420px] overflow-hidden">
                    {/* Lista Principal de Autocompletado */}
                    <div className={`${hoveredAlbum ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col p-2 overflow-y-auto max-h-[380px]`}>
                      <div className="px-3 py-1.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-extrabold text-[#5c435a] dark:text-gray-400">
                        <span>RESULTADOS (Usa ↑ ↓ Enter Espacio)</span>
                        <span>Enter para ver todo</span>
                      </div>

                      <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                        {liveResults.map((album, index) => {
                          const isItemPlaying = (currentTrack?.id === album.id || currentTrack?.title === album.title) && isPlaying;
                          const isHighlighted = highlightedIndex === index;
                          return (
                            <div
                              key={album.id}
                              onMouseEnter={() => setHoveredAlbum(album)}
                              className={`group flex flex-col p-2 rounded-xl transition-all ${
                                isHighlighted
                                  ? 'bg-[#ffe4ec] dark:bg-white/15 ring-1 ring-[#B80C09]'
                                  : 'hover:bg-[#fff0f4] dark:hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div
                                  onClick={() => executeSearch(album.title)}
                                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                >
                                  <img
                                    src={album.cover || getFallbackCoverForAlbum(album)}
                                    alt={album.title}
                                    className="w-10 h-10 rounded-lg object-cover shadow-xs shrink-0"
                                    onError={(e) => handleImageFallbackError(e, album)}
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs sm:text-sm font-bold text-[#231123] dark:text-white truncate group-hover:text-[#B80C09] transition-colors">
                                      {album.title}
                                    </span>
                                    <span className="text-[11px] text-[#5c435a] dark:text-[#B89CB0] truncate">
                                      {album.artist} {album.year ? `· ${album.year}` : ''}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => handleInspectTracklist(album, e)}
                                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-colors cursor-pointer"
                                    title="Ver lista de canciones"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      {loadingTracklistId === album.id ? 'progress_activity' : 'queue_music'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => handleSearchSimilar(album, e)}
                                    className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[11px] font-bold text-[#231123] dark:text-white transition-colors cursor-pointer"
                                    title="Buscar similares"
                                  >
                                    <span>✦ Similares</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTrack({
                                        id: album.id,
                                        deezerId: album.id,
                                        title: album.title,
                                        artist: album.artist,
                                        album: album.title,
                                        cover: album.cover,
                                      });
                                    }}
                                    className="w-8 h-8 rounded-full bg-[#B80C09] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform cursor-pointer"
                                    title="Reproducir muestra"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {isItemPlaying ? 'pause' : 'play_arrow'}
                                    </span>
                                  </button>
                                </div>
                              </div>

                              {previewTracklist?.id === album.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-2 p-2 rounded-xl bg-gray-50 dark:bg-[#1a0c1a] border border-gray-200 dark:border-white/5 flex flex-col gap-1"
                                >
                                  <span className="text-[10px] font-black uppercase tracking-wider text-[#5c1d5e] dark:text-pink-300">
                                    PISTAS DESTACADAS EN DEEZER:
                                  </span>
                                  {previewTracklist.tracks.map((t, idx) => (
                                    <div
                                      key={t.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTrack({
                                          id: t.id,
                                          trackId: t.id,
                                          title: t.title,
                                          artist: album.artist,
                                          album: album.title,
                                          cover: album.cover,
                                          preview: t.preview,
                                        });
                                      }}
                                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 cursor-pointer text-xs transition-colors"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="font-mono opacity-50 text-[11px]">0{idx + 1}</span>
                                        <span className="font-bold text-[#231123] dark:text-white truncate">{t.title}</span>
                                      </div>
                                      <span className="material-symbols-outlined text-[16px] text-[#B80C09]">play_circle</span>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Peek Preview Card (Lateral Flotante al Pasar Cursor) */}
                    {hoveredAlbum && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex md:col-span-5 flex-col p-4 bg-gradient-to-b from-gray-50 to-rose-50/30 dark:from-[#1d0d1e] dark:to-[#2e132e] border-l border-gray-100 dark:border-white/10 items-center justify-center text-center"
                      >
                        <img
                          src={hoveredAlbum.cover_xl || hoveredAlbum.cover || getFallbackCoverForAlbum(hoveredAlbum)}
                          alt={hoveredAlbum.title}
                          className="w-24 h-24 rounded-xl object-cover shadow-md mb-2.5"
                          onError={(e) => handleImageFallbackError(e, hoveredAlbum)}
                        />
                        <h4 className="text-xs font-bold text-[#231123] dark:text-white line-clamp-1">
                          {hoveredAlbum.title}
                        </h4>
                        <p className="text-[11px] text-[#5c435a] dark:text-gray-300 font-medium mb-2">
                          {hoveredAlbum.artist}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">star</span>
                            {hoveredAlbum.rating || '4.8'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-[#B80C09] dark:text-rose-300 text-[10px] font-bold">
                            {hoveredAlbum.year || '2024'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => executeSearch(hoveredAlbum.title)}
                          className="w-full py-1.5 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Ver Catálogo Completo
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fila Única de Micro-Chips Horizontales Minimalistas */}
        <div className="w-full mt-4 flex flex-col items-center">
          <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 py-1.5 px-4">
            {/* Chip: Moods */}
            <button
              type="button"
              onClick={() => setFilterPanel(filterPanel === 'scenarios' ? 'none' : 'scenarios')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                filterPanel === 'scenarios'
                  ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                  : 'bg-white/90 dark:bg-[#341b34]/90 text-[#231123] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">headphones</span>
              <span>Moods</span>
              <span className="material-symbols-outlined text-[14px] opacity-60">
                {filterPanel === 'scenarios' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Chip: Géneros con Colores */}
            <button
              type="button"
              onClick={() => setFilterPanel(filterPanel === 'genres' ? 'none' : 'genres')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                filterPanel === 'genres'
                  ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                  : 'bg-white/90 dark:bg-[#341b34]/90 text-[#231123] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">category</span>
              <span>Géneros</span>
              <span className="material-symbols-outlined text-[14px] opacity-60">
                {filterPanel === 'genres' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Chip: Sellos & Productores */}
            <button
              type="button"
              onClick={() => setFilterPanel(filterPanel === 'labels' ? 'none' : 'labels')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                filterPanel === 'labels'
                  ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                  : 'bg-white/90 dark:bg-[#341b34]/90 text-[#231123] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">sell</span>
              <span>Sellos</span>
              <span className="material-symbols-outlined text-[14px] opacity-60">
                {filterPanel === 'labels' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Chip: Épocas */}
            <button
              type="button"
              onClick={() => setFilterPanel(filterPanel === 'decades' ? 'none' : 'decades')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                filterPanel === 'decades'
                  ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                  : 'bg-white/90 dark:bg-[#341b34]/90 text-[#231123] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Épocas</span>
              <span className="material-symbols-outlined text-[14px] opacity-60">
                {filterPanel === 'decades' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Chip: Dial de Energía */}
            <button
              type="button"
              onClick={() => setFilterPanel(filterPanel === 'energy' ? 'none' : 'energy')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border select-none ${
                filterPanel === 'energy'
                  ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                  : 'bg-white/90 dark:bg-[#341b34]/90 text-[#231123] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Intensidad</span>
              <span className="material-symbols-outlined text-[14px] opacity-60">
                {filterPanel === 'energy' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Chip: Obras Maestras */}
            <button
              type="button"
              onClick={() => executeSearch('Kendrick Lamar To Pimp A Butterfly')}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#fbf0f8] dark:bg-[#341b34]/90 text-[#5c1d5e] dark:text-pink-300 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09] transition-all cursor-pointer shrink-0 flex items-center gap-1.5 select-none"
            >
              <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
              <span>Obras Maestras</span>
            </button>
          </div>

          {/* Subpanel Flotante Elegante cuando un filtro está abierto */}
          <AnimatePresence>
            {filterPanel !== 'none' && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="mt-2.5 p-2.5 rounded-2xl bg-white/95 dark:bg-[#281328]/95 backdrop-blur-xl border border-[#e6d5e2] dark:border-white/10 flex flex-wrap items-center justify-center gap-2 max-w-xl shadow-lg"
              >
                {/* Moods & Escenarios */}
                {filterPanel === 'scenarios' &&
                  SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        executeSearch(s.query);
                        setFilterPanel('none');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}

                {/* Píldoras de Géneros con Colores Temáticos */}
                {filterPanel === 'genres' &&
                  GENRES_COLORFUL.map((g, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        executeSearch(g.query);
                        setFilterPanel('none');
                      }}
                      className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${g.bg} border text-xs font-black shadow-2xs hover:scale-105 transition-all cursor-pointer`}
                    >
                      {g.label}
                    </button>
                  ))}

                {/* Sellos & Productores */}
                {filterPanel === 'labels' &&
                  LABELS_AND_PRODUCERS.map((lp) => (
                    <button
                      key={lp.id}
                      type="button"
                      onClick={() => {
                        executeSearch(lp.query);
                        setFilterPanel('none');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">{lp.icon}</span>
                      <span>{lp.label}</span>
                    </button>
                  ))}

                {/* Épocas */}
                {filterPanel === 'decades' &&
                  DECADES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        if (d.query) executeSearch(d.query);
                        setFilterPanel('none');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-all cursor-pointer"
                    >
                      <span>{d.label}</span>
                    </button>
                  ))}

                {/* Dial / Slider de Intensidad de Energía */}
                {filterPanel === 'energy' && (
                  <div className="w-full flex flex-col items-center gap-2 py-1 px-3">
                    <div className="flex items-center justify-between w-full text-xs font-bold text-[#5c435a] dark:text-gray-300">
                      <span>🧘 Calmo / Ambient</span>
                      <span className="text-[#B80C09] font-black">
                        {energyLevel < 35 ? 'Nivel Relajante' : energyLevel > 68 ? 'Máxima Euforia' : 'Groove Equilibrado'}
                      </span>
                      <span>🔥 Fiesta / Rave</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={energyLevel}
                      onChange={handleEnergyChange}
                      className="w-full accent-[#B80C09] cursor-pointer"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
