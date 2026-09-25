import '../../Styles/news-catalog.css';
import { matchesNewsSearch } from '../../shared/services/news-search.js';
import { NewsVinyl } from './news-vinyl.jsx';
import { NewsLabels } from './news-labels.jsx';
import { useAuth } from '../../shared/context/auth-context.jsx';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';
import { useAccessibility } from '../../shared/context/accessibility-context';
import { subscribeNewsletterWebhook } from '../../shared/services/n8n-webhooks';
import { toNewsArticle, isNewsVisible } from '../../shared/services/news-service.js';
import { getCatalog } from '../../shared/services/catalog-service.js';

// Catálogo curado de noticias musicales audiófilas con audios locales y crónicas narradas

const CATEGORIES = [
  'Todas',
  'Lanzamientos',
  'Festivales',
  'Hi-Fi & Hardware',
  'Industria & Sellos',
  'Crónicas',
];

/** Lee los parámetros de búsqueda que envía la barra de la navbar (#noticias?q=...&abrir=...). */
function readNewsHashParams() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  const [path, query = ''] = hash.split('?');
  if (path.toLowerCase() !== 'noticias') return null;
  return new URLSearchParams(query);
}


export const NewsPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [newsError, setNewsError] = useState('');
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsRefresh, setNewsRefresh] = useState(0);
  useEffect(() => {
    let active = true;

    Promise.all([getCatalog('announcements'), getCatalog('labels', true), getCatalog('vinyl', true)]).then(([rows, seals, vinyls]) => {
      if (active) { setLabels(seals); setEditions(vinyls); setArticles(rows.filter(row => isNewsVisible(row)).map(row => toNewsArticle(row, seals))); setNewsError(''); }
    }).catch(error => { if (active) setNewsError(error.message); }).finally(() => { if (active) setNewsLoading(false); });
    return () => { active = false; };
  }, [newsRefresh]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState(() => readNewsHashParams()?.get('q') || '');
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [activeReleaseModal, setActiveReleaseModal] = useState(null);
  const deepLinkRef = useRef(readNewsHashParams());

  // Sincroniza la búsqueda con la barra de la navbar (#noticias?q=termino&abrir=id)
  useEffect(() => {
    const syncFromHash = () => {
      const params = readNewsHashParams();
      if (!params) return;
      deepLinkRef.current = params;
      setSearchQuery(params.get('q') || '');
      setSelectedLabel(params.get('sello') || '');
      setSelectedCategory('Todas');
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Estado de Suscripción Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(['Lanzamientos', 'Hi-Fi & Hardware', 'Festivales']);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);

  const { playTrack, toggleTrack, currentTrack, isPlaying } = usePlayer();
  const { speak, stopSpeaking, isSpeaking, playAudioCue, announce } = useAccessibility();

  // Lanzamientos Destacados desde la API
  const [featuredReleases, setFeaturedReleases] = useState([]);
  const [releasesLoading, setReleasesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCatalog('releases')
      .then((data) => {
        if (active) {
          setFeaturedReleases(data.filter((r) => r.status === 'published'));
          setReleasesLoading(false);
        }
      })
      .catch(() => { if (active) setReleasesLoading(false); });
    return () => { active = false; };
  }, []);

  // Abre el recurso solicitado desde la navbar una vez que el catálogo está cargado
  useEffect(() => {
    if (newsLoading || releasesLoading) return;
    const params = deepLinkRef.current;
    if (!params) return;

    const articleId = params.get('abrir');
    if (articleId) {
      const article = articles.find((item) => String(item.id) === articleId);
      if (article) {
        deepLinkRef.current = null;
        setActiveArticleModal(article);
        return;
      }
    }

    const vinylId = params.get('vinilo');
    if (vinylId) {
      const edition = editions.find((item) => String(item.id) === vinylId);
      if (edition) {
        deepLinkRef.current = null;
        setSelectedEdition(edition);
        return;
      }
    }

    const releaseId = params.get('lanzamiento');
    if (releaseId) {
      const release = featuredReleases.find((item) => String(item.id) === releaseId);
      if (release) {
        deepLinkRef.current = null;
        setActiveReleaseModal(release);
        return;
      }
    }

    const labelId = params.get('sello');
    if (labelId && labels.some((label) => String(label.id) === labelId)) {
      deepLinkRef.current = null;
      setSelectedLabel(labelId);
    }
  }, [newsLoading, releasesLoading, articles, editions, featuredReleases, labels]);

  // Filtrado de artículos
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Todas' || article.category === selectedCategory;
      const matchesQuery = matchesNewsSearch(searchQuery, article.title, article.summary, article.content, article.author, article.category, article.labelName, article.artist, article.album);

      return matchesCategory && matchesQuery && (!selectedLabel || String(article.labelId) === selectedLabel);
    });
  }, [articles, selectedCategory, searchQuery, selectedLabel]);

  const visibleLabels = labels.filter(label => matchesNewsSearch(searchQuery, label.name, label.country, label.description));
  const visibleEditions = editions.filter(edition => (!selectedLabel || String(edition.labelId) === selectedLabel) && matchesNewsSearch(searchQuery, edition.title, edition.artist, edition.format, edition.color, edition.description, edition.catalogNumber, labels.find(label => String(label.id) === String(edition.labelId))?.name));
  const visibleReleases = featuredReleases.filter(release => (!selectedLabel || String(release.labelId) === selectedLabel) && matchesNewsSearch(searchQuery, release.title, release.artist, release.genre, release.description, labels.find(label => String(label.id) === String(release.labelId))?.name));
  const resultCount = filteredArticles.length + visibleLabels.length + visibleEditions.length + visibleReleases.length;
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const sideArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 2);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setSubscriptionError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionError(null);
    setSubscriptionSuccess(null);

    try {
      playAudioCue('click');
      const response = await subscribeNewsletterWebhook({
        email: newsletterEmail,
        name: newsletterName,
        topics: selectedTopics,
      });

      if (response && response.success) {
        playAudioCue('success');
        setSubscriptionSuccess(response.message || '¡Te has suscrito con éxito al boletín semanal!');
        announce('Suscripción a la newsletter confirmada con éxito.');
        setNewsletterEmail('');
        setNewsletterName('');
      } else {
        throw new Error(response?.message || 'No se pudo procesar la suscripción.');
      }
    } catch (err) {
      console.warn('Error en suscripción a newsletter:', err);
      setSubscriptionError(err.message || 'Error al conectar con el servicio de boletín.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-10">
        
        {/* Cabecera Editorial Principal */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#e6d5e2] dark:border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
                PERIODISMO & CRÓNICA AUDIÓFILA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#231123] dark:text-white">
              Radar Musical & Actualidad
            </h1>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl font-medium leading-relaxed">
              Nuevos lanzamientos, reediciones de referencia analógica, tecnología de alta fidelidad y movimientos clave en el canon moderno.
            </p>
          </div>

          {/* Buscador de Noticias */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a186a0] dark:text-[#B89CB0] text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="search"
                placeholder="Buscar noticias, artistas, sellos o vinilos…"
                aria-label="Buscar en Noticias"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedLabel(''); setSelectedCategory('Todas'); }}
                className="w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-semibold bg-white dark:bg-[#4B2840]/60 border border-[#e6d5e2] dark:border-white/10 text-[#231123] dark:text-white placeholder-[#a186a0] dark:placeholder-gray-400 focus:outline-none focus:border-[#B80C09] focus:shadow-[0_0_0_4px_rgba(184,12,9,0.12)] shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedLabel(''); setSelectedCategory('Todas'); }}
                  aria-label="Limpiar búsqueda de noticias"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full grid place-items-center text-[#a186a0] dark:text-[#B89CB0] hover:text-[#B80C09] hover:bg-[#f8e9f6] dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-[#5c435a] dark:text-[#B89CB0]">
              {searchQuery.trim()
                ? `${resultCount} ${resultCount === 1 ? 'coincidencia' : 'coincidencias'} para “${searchQuery.trim()}”`
                : 'Busca dentro del contenido de las noticias, sellos y ediciones de vinilo.'}
            </p>
          </div>
        </header>
        {user?.role === 'admin' && <a href="#admin-catalog-announcements" className="primary-button">Administrar noticias en Anuncios</a>}
        {newsLoading && <p role="status">Cargando noticias…</p>}
        {newsError && <div role="alert"><p>No se pudieron cargar las noticias: {newsError}</p><button onClick={() => { setNewsLoading(true); setNewsRefresh(value => value + 1) }}>Reintentar</button></div>}

        {/* SECCIÓN EDITORIAL DE PORTADA (REVISTA / EDITORIAL HERO) */}
        {featuredArticle && !searchQuery && selectedCategory === 'Todas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Historia Principal de Portada (8 Columnas) */}
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 rounded-3xl overflow-hidden bg-white dark:bg-[#2e192c] border border-[#e6d5e2] dark:border-white/10 shadow-lg hover:border-[#B80C09]/40 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setActiveArticleModal(featuredArticle)}
            >
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                  src={featuredArticle.cover}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#B80C09] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  PORTADA DE LA SEMANA · {featuredArticle.category}
                </div>

                <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold">
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime} de lectura</span>
                    <span>•</span>
                    <span className="text-rose-300 font-bold">{featuredArticle.author}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white group-hover:text-rose-200 transition-colors">
                    {featuredArticle.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#e6d5e2]/60 dark:border-white/5">
                <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#DCDCDD] line-clamp-2 leading-relaxed flex-1">
                  {featuredArticle.summary}
                </p>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Botón de Audiocrónica Narrada Local */}
                  {featuredArticle.audioNarration && (
                    <button
                      type="button"
                      onClick={() => {
                        playAudioCue('play');
                        if (currentTrack?.id === featuredArticle.audioNarration.id && isPlaying) {
                          toggleTrack(currentTrack);
                        } else {
                          playTrack(featuredArticle.audioNarration);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#B80C09] text-white hover:bg-[#960a07] text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                      title="Escuchar crónica sonora en audio"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {currentTrack?.id === featuredArticle.audioNarration.id && isPlaying ? 'pause' : 'headphones'}
                      </span>
                      <span className="hidden sm:inline">
                        {currentTrack?.id === featuredArticle.audioNarration.id && isPlaying ? 'Pausar Crónica' : 'Escuchar Crónica'}
                      </span>
                    </button>
                  )}

                  {featuredArticle.trackPreview && !featuredArticle.audioNarration && (
                    <button
                      type="button"
                      onClick={() => {
                        playAudioCue('play');
                        if (currentTrack?.title === featuredArticle.trackPreview.title && isPlaying) {
                          toggleTrack(currentTrack);
                        } else {
                          playTrack(featuredArticle.trackPreview);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#f8e9f6] dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[#B80C09] dark:text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-rose-200 dark:border-white/10"
                      title="Escuchar muestra de audio"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {currentTrack?.title === featuredArticle.trackPreview.title && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span className="hidden sm:inline">Muestra</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveArticleModal(featuredArticle)}
                    className="px-4 py-2 rounded-xl bg-[#231123] dark:bg-white/10 hover:bg-[#B80C09] text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>Leer</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.article>

            {/* Historias Secundarias Destacadas (4 Columnas) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#e6d5e2] dark:border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-[#B80C09] dark:text-rose-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>Tendencias Sónicas</span>
                </span>
                <span className="text-[11px] font-bold text-gray-500">Últimas 48h</span>
              </div>

              {sideArticles.map((article) => (
                <motion.article
                  key={article.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setActiveArticleModal(article)}
                  className="rounded-2xl p-4 bg-white dark:bg-[#2e192c] border border-[#e6d5e2] dark:border-white/10 shadow-sm hover:border-[#B80C09]/40 transition-all flex flex-col justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex gap-3.5">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#B80C09]/15 text-[#B80C09] dark:text-rose-300">
                          {article.category}
                        </span>
                        {article.audioNarration && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">headphones</span>
                            <span>Audio</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <span className="text-[10px] text-[#81737e] dark:text-[#B89CB0] block font-semibold">
                        {article.date} · {article.readTime}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECCIÓN: LANZAMIENTOS DESTACADOS (desde Admin)
            ═══════════════════════════════════════════════ */}
        {(releasesLoading || visibleReleases.length > 0) && (
          <section className="space-y-5">
            {/* Cabecera de sección */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6d5e2] dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#B80C09]/10 dark:bg-[#B80C09]/20">
                  <span className="material-symbols-outlined text-[16px] text-[#B80C09]">new_releases</span>
                </span>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#B80C09] dark:text-rose-400">LANZAMIENTOS DESTACADOS</span>
                  <p className="text-[11px] text-[#5c435a] dark:text-[#B89CB0] font-medium">Selección editorial · Actualizado por el equipo Sonar</p>
                </div>
              </div>
              {!releasesLoading && visibleReleases.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#B80C09]/10 text-[#B80C09] dark:text-rose-300 text-[10px] font-black">
                  {visibleReleases.length} {visibleReleases.length === 1 ? 'lanzamiento' : 'lanzamientos'}
                </span>
              )}
            </div>

            {releasesLoading ? (
              // Skeleton cargando
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl bg-[#e6d5e2]/40 dark:bg-white/5 animate-pulse h-64" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleReleases.map((release) => {
                  const releaseDate = release.releaseDate
                    ? new Date(release.releaseDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                    : null;
                  const typeLabel = release.type || 'Álbum';
                  const typeColor = {
                    'Sencillo': 'bg-rose-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-rose-300 border-[#B80C09]/30',
                    'EP': 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300/40',
                    'Vinilo': 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300/40',
                  }[typeLabel] || 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-300/40';

                  return (
                    <motion.article
                      key={release.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setActiveReleaseModal(release)}
                      className="rounded-2xl overflow-hidden bg-white dark:bg-[#2e192c] border border-[#e6d5e2] dark:border-white/10 shadow-sm hover:border-[#B80C09]/40 hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                    >
                      {/* Portada */}
                      <div className="relative w-full aspect-square overflow-hidden bg-[#f0e0ed] dark:bg-[#231123]">
                        {release.cover ? (
                          <img
                            src={release.cover}
                            alt={`Portada de ${release.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-[#B89CB0]/40">album</span>
                          </div>
                        )}

                        {/* Badge de tipo */}
                        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${typeColor}`}>
                          {typeLabel === 'Vinilo' ? '💿' : typeLabel === 'Sencillo' ? '🎵' : typeLabel === 'EP' ? '🎶' : '📀'} {typeLabel}
                        </span>

                        {/* Indicador de ver detalle al hover */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 text-xs font-black text-[#231123] dark:text-white shadow-md flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            Ver descripción
                          </span>
                        </div>

                        {/* Botón reproducir si tiene enlace */}
                        {release.externalUrl && (
                          <a
                            href={release.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B80C09] z-10"
                            title={`Escuchar ${release.title} en Deezer/Spotify`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          </a>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-1.5 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <h3 className="text-sm font-black text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-rose-300 transition-colors leading-snug line-clamp-1">
                              {release.title}
                            </h3>
                            <p className="text-xs font-semibold text-[#5c435a] dark:text-[#B89CB0] truncate mt-0.5">
                              {release.artist}
                            </p>
                          </div>
                        </div>

                        {release.genre && (
                          <span className="text-[10px] font-bold text-[#876a84] dark:text-[#B89CB0] uppercase tracking-wider">
                            {release.genre}
                          </span>
                        )}

                        {release.description && (
                          <p className="text-[11px] text-[#5c435a] dark:text-[#DCDCDD] leading-relaxed line-clamp-2 mt-0.5">
                            {release.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e6d5e2]/60 dark:border-white/5">
                          {releaseDate && (
                            <span className="text-[10px] font-bold text-[#876a84] dark:text-[#B89CB0] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                              {releaseDate}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-lg bg-[#f8e9f6] dark:bg-white/10 group-hover:bg-[#B80C09] group-hover:text-white text-[#B80C09] dark:text-rose-300 text-[10px] font-black transition-colors flex items-center gap-1 border border-rose-200/50 dark:border-white/10">
                            <span className="material-symbols-outlined text-[12px]">info</span>
                            Ver más
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {searchQuery.trim() && !newsLoading && !releasesLoading && <div className="news-search-summary" role="status"><span>{resultCount} resultados para <strong>«{searchQuery.trim()}»</strong></span><button onClick={() => { setSearchQuery(''); setSelectedLabel(''); setSelectedCategory('Todas'); }}>Limpiar búsqueda</button></div>}
        <NewsVinyl editions={visibleEditions} labels={labels} articles={articles} selected={selectedEdition} onSelect={setSelectedEdition} onArticle={setActiveArticleModal} />
        <NewsLabels
          labels={visibleLabels}
          articles={articles}
          editions={editions}
          releases={featuredReleases}
          selected={selectedLabel}
          onSelect={(labelId) => { setSelectedLabel(labelId); setSelectedCategory('Todas'); setSearchQuery('') }}
          onClear={() => setSelectedLabel('')}
        />

        {/* Pestañas de Filtro por Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#B80C09] text-white shadow-md'
                  : 'bg-white dark:bg-[#4B2840]/60 border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 hover:border-[#B80C09]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Todas las Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            const isArticleAudioPlaying =
              (article.audioNarration && currentTrack?.id === article.audioNarration.id && isPlaying) ||
              (article.trackPreview && currentTrack?.title === article.trackPreview.title && isPlaying);

            return (
              <motion.article
                key={article.id}
                whileHover={{ y: -4 }}
                className="flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#2e192c] border border-[#e6d5e2] dark:border-white/10 shadow-md hover:border-[#B80C09]/40 hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Portada */}
                  <div
                    className="relative h-48 sm:h-52 w-full overflow-hidden cursor-pointer"
                    onClick={() => setActiveArticleModal(article)}
                  >
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#B80C09] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {article.category}
                    </div>

                    {/* Badge de Audio Crónica */}
                    {article.audioNarration ? (
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[10px] font-black flex items-center gap-1.5 border border-rose-500/30">
                        <span className="material-symbols-outlined text-[14px] text-rose-400">headphones</span>
                        <span>Audiocrónica</span>
                      </span>
                    ) : article.trackPreview ? (
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-rose-400">audiotrack</span>
                        <span>Muestra</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Contenido */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0]">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3
                      onClick={() => setActiveArticleModal(article)}
                      className="text-base sm:text-lg font-black text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-rose-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Pie de Tarjeta */}
                <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-white/5 mt-2">
                  <span className="text-[11px] font-bold text-[#231123] dark:text-gray-300">
                    {article.labelName && <span className="block font-bold">Sello: {article.labelName}</span>}{article.artist && <span className="block">Artistas: {article.artist}</span>}Por {article.author}{user?.role === 'admin' && <a href={`#admin-catalog-announcements?edit=${encodeURIComponent(article.id)}`} onClick={event => event.stopPropagation()} className="block underline mt-2">Editar noticia</a>}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Botón Escuchar Audiocrónica o Track Preview */}
                    {article.audioNarration ? (
                      <button
                        type="button"
                        onClick={() => {
                          playAudioCue('play');
                          if (currentTrack?.id === article.audioNarration.id && isPlaying) {
                            toggleTrack(currentTrack);
                          } else {
                            playTrack(article.audioNarration);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#f8e9f6] dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[#B80C09] dark:text-rose-300 flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer border border-rose-200 dark:border-white/10"
                        title="Escuchar audiocrónica narrada"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isArticleAudioPlaying ? 'pause' : 'headphones'}
                        </span>
                        <span className="hidden sm:inline">Audio</span>
                      </button>
                    ) : article.trackPreview ? (
                      <button
                        type="button"
                        onClick={() => {
                          playAudioCue('play');
                          if (currentTrack?.title === article.trackPreview.title && isPlaying) {
                            toggleTrack(currentTrack);
                          } else {
                            playTrack(article.trackPreview);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[#f8e9f6] dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[#B80C09] dark:text-rose-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                        title={`Escuchar muestra de ${article.trackPreview.title}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isArticleAudioPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setActiveArticleModal(article)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[11px] font-extrabold text-[#231123] dark:text-white transition-colors cursor-pointer"
                    >
                      Leer
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {!newsLoading && !releasesLoading && !newsError && resultCount === 0 && (
          <div className="relative overflow-hidden py-16 px-6 text-center rounded-[32px] bg-[var(--bg-page)] border border-[var(--border-subtle)]">
            <div className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col items-center gap-4">
              <span className="w-20 h-20 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] grid place-items-center shadow-lg">
                <span className="material-symbols-outlined text-4xl text-[var(--color-accent)]">
                  {searchQuery.trim() ? 'search_off' : 'newspaper'}
                </span>
              </span>
              <div className="space-y-2 max-w-xl">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-main)]">
                  {searchQuery.trim()
                    ? <>No existe contenido para &ldquo;{searchQuery.trim()}&rdquo;</>
                    : 'Todavía no hay noticias publicadas'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {searchQuery.trim()
                    ? 'Prueba con otros términos como «vinilo», «Radiohead», «festivales» o «Daft Punk», o selecciona la categoría «Todas».'
                    : 'Cuando el equipo editorial publique anuncios, lanzamientos y reediciones aparecerán en este radar.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {['vinilo', 'festivales', 'Radiohead', 'Daft Punk'].map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => { setSearchQuery(suggestion); setSelectedLabel(''); setSelectedCategory('Todas'); }}
                    className="px-3.5 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedLabel(''); setSelectedCategory('Todas'); }}
                    className="px-4 py-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-black transition-colors cursor-pointer"
                  >
                    Ver todas las noticias
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN DE SUSCRIPCIÓN AL BOLETÍN AUDIÓFILO (NEWSLETTER CON N8N WEBHOOK) */}
        <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#231123] via-[#3a1537] to-[#120512] text-white p-6 sm:p-10 lg:p-12 border border-white/15 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B80C09]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#B80C09] text-white text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span>BOLETÍN SEMANAL SONAR</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-rose-200 border border-white/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>n8n Webhook Automatizado</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Recibe el Radar Audiófilo en tu Correo
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Cada viernes enviamos una selección con los 5 mejores lanzamientos en alta fidelidad, crónicas de conciertos, comparativas de hardware analógico y avisos de preventas de vinilos limitados.
              </p>
            </div>

            {/* Selector de Temas */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-200 uppercase tracking-wider block">
                Selecciona los temas que te interesan:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'Lanzamientos', label: '💿 Estrenos & Álbumes' },
                  { id: 'Hi-Fi & Hardware', label: '🎛️ Hi-Fi & Tocadiscos' },
                  { id: 'Festivales', label: '🎟️ Festivales & Giras' },
                  { id: 'Industria', label: '🏛️ Sellos & Crónicas' },
                ].map((topic) => {
                  const isChecked = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isChecked
                          ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-xs'
                          : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span>{topic.label}</span>
                      {isChecked && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre o alias melómano (opcional)"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  className="sm:col-span-4 px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B80C09] focus:bg-white/15 transition-all"
                />

                <input
                  type="email"
                  required
                  placeholder="tu_correo@ejemplo.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="sm:col-span-5 px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#B80C09] focus:bg-white/15 transition-all"
                />

                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="sm:col-span-3 px-5 py-3 rounded-2xl bg-[#B80C09] hover:bg-[#960a07] text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Suscribirme</span>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mensajes de Feedback */}
              {subscriptionSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                  <span>{subscriptionSuccess}</span>
                </motion.div>
              )}

              {subscriptionError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-rose-400 text-[18px]">error</span>
                  <span>{subscriptionError}</span>
                </motion.div>
              )}

              <p className="text-[11px] text-gray-400">
                🔒 Cero spam. Solo criterio sonoro y curaduría audiófila de calidad. Puedes darte de baja con un clic cuando quieras.
              </p>
            </form>
          </div>
        </section>

      </main>

      {/* MODAL INMERSIVO DE LECTURA DE ARTÍCULO */}
      <AnimatePresence>
        {activeArticleModal && (
          <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              className="w-full max-w-3xl bg-white dark:bg-[#2e192c] text-[#231123] dark:text-[#FAF5F8] rounded-3xl border border-[#e6d5e2] dark:border-white/15 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Imagen y Botón Cerrar */}
              <div className="relative h-64 sm:h-80 w-full shrink-0">
                <img
                  src={activeArticleModal.cover}
                  alt={activeArticleModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveArticleModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-[#B80C09] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  aria-label="Cerrar noticia"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#B80C09] text-white text-[10px] font-black uppercase tracking-wider">
                    {activeArticleModal.category}
                  </span>
                  <h2 id="article-modal-title" className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                    {activeArticleModal.title}
                  </h2>
                </div>
              </div>

              {/* Contenido del Artículo */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-[#231123]/90 dark:text-gray-200">
                {editions.some(edition => String(edition.id) === String(activeArticleModal.vinylId)) && <button className="vinyl-news-link" onClick={() => { setSelectedEdition(editions.find(edition => String(edition.id) === String(activeArticleModal.vinylId))); setActiveArticleModal(null) }}>Ver edición de vinilo →</button>}
                {activeArticleModal.labelName && <p><strong>Sello discográfico:</strong> {activeArticleModal.labelName}</p>}
                {activeArticleModal.artist && <p><strong>Artistas:</strong> {activeArticleModal.artist}</p>}
                {activeArticleModal.album && <p><strong>Álbum:</strong> {activeArticleModal.album}</p>}
                {activeArticleModal.eventDate && <p><strong>Fecha del lanzamiento o fichaje:</strong> {activeArticleModal.eventDate}</p>}
                {activeArticleModal.sourceUrl && <a href={activeArticleModal.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Consultar anuncio oficial ↗</a>}
                {/* Metadatos */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-white/10 text-xs text-[#5c435a] dark:text-[#B89CB0]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#B80C09] dark:text-rose-300">{activeArticleModal.author}</span>
                    <span>·</span>
                    <span>{activeArticleModal.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{activeArticleModal.date}</span>
                    <span>·</span>
                    <span>{activeArticleModal.readTime}</span>
                  </div>
                </div>

                {/* Texto del Reportaje */}
                <div className="whitespace-pre-line space-y-4 text-sm sm:text-base font-medium">
                  {activeArticleModal.content}
                </div>

                {/* Reproductor de Crónica Sonora Narrada Local */}
                {activeArticleModal.audioNarration && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#B80C09]/15 via-[#5c1d5e]/15 to-transparent border border-[#B80C09]/30 flex items-center justify-between gap-4 mt-6">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#B80C09] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[24px]">headphones</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#B80C09] dark:text-rose-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-pulse" />
                          <span>Audiocrónica Narrada (Sonido de Estudio)</span>
                        </span>
                        <span className="text-sm font-black text-[#231123] dark:text-white truncate">
                          {activeArticleModal.audioNarration.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {activeArticleModal.audioNarration.artist}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playAudioCue('play');
                        if (currentTrack?.id === activeArticleModal.audioNarration.id && isPlaying) {
                          toggleTrack(currentTrack);
                        } else {
                          playTrack(activeArticleModal.audioNarration);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition-transform hover:scale-105"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {currentTrack?.id === activeArticleModal.audioNarration.id && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span>{currentTrack?.id === activeArticleModal.audioNarration.id && isPlaying ? 'Pausar' : 'Escuchar Crónica'}</span>
                    </button>
                  </div>
                )}

                {/* Reproductor de muestra musical si aplica */}
                {activeArticleModal.trackPreview && (
                  <div className="p-4 rounded-2xl bg-[#f8e9f6] dark:bg-white/5 border border-rose-200 dark:border-white/10 flex items-center justify-between gap-4 mt-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeArticleModal.trackPreview.cover}
                        alt={activeArticleModal.trackPreview.title}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs uppercase font-bold text-[#B80C09] dark:text-rose-300">Pista / Muestra Musical</span>
                        <span className="text-sm font-black text-[#231123] dark:text-white truncate">
                          {activeArticleModal.trackPreview.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {activeArticleModal.trackPreview.artist}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playAudioCue('play');
                        if (currentTrack?.title === activeArticleModal.trackPreview.title && isPlaying) {
                          toggleTrack(currentTrack);
                        } else {
                          playTrack(activeArticleModal.trackPreview);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#231123] dark:bg-white/10 hover:bg-[#B80C09] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {currentTrack?.title === activeArticleModal.trackPreview.title && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span>Muestra</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pie del Modal con Botones TTS y Cerrar */}
              <div className="p-4 sm:p-6 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-black/20 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speak(`${activeArticleModal.title}. ${activeArticleModal.content}`, activeArticleModal.title);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSpeaking
                      ? 'bg-[#B80C09] text-white animate-pulse'
                      : 'bg-white dark:bg-white/10 text-[#5c435a] dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:text-[#B80C09]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSpeaking ? 'stop' : 'record_voice_over'}
                  </span>
                  <span>{isSpeaking ? 'Detener Lectura' : 'Escuchar Noticia'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveArticleModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#B80C09] text-white text-xs font-bold hover:bg-[#960a07] transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL DE DETALLE / DESCRIPCIÓN COMPLETA DE LANZAMIENTO */}
        {activeReleaseModal && (
          <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="release-modal-title"
              className="w-full max-w-2xl bg-white dark:bg-[#2e192c] text-[#231123] dark:text-[#FAF5F8] rounded-3xl border border-[#e6d5e2] dark:border-white/15 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Encabezado con portada */}
              <div className="relative h-64 sm:h-72 w-full shrink-0 bg-[#231123]">
                {activeReleaseModal.cover ? (
                  <img
                    src={activeReleaseModal.cover}
                    alt={activeReleaseModal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#5c1d5e]">
                    <span className="material-symbols-outlined text-7xl text-white/40">album</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Botón cerrar */}
                <button
                  type="button"
                  onClick={() => setActiveReleaseModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-[#B80C09] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  aria-label="Cerrar modal"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                {/* Título y Artista en cabecera de portada */}
                <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#B80C09] text-white text-[10px] font-black uppercase tracking-wider">
                      {activeReleaseModal.type || 'Lanzamiento'}
                    </span>
                    {activeReleaseModal.genre && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {activeReleaseModal.genre}
                      </span>
                    )}
                  </div>
                  <h2 id="release-modal-title" className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {activeReleaseModal.title}
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-rose-200">
                    {activeReleaseModal.artist}
                  </p>
                </div>
              </div>

              {/* Contenido / Descripción completa */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm leading-relaxed">
                {activeReleaseModal.releaseDate && (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#876a84] dark:text-[#B89CB0]">
                    <span className="material-symbols-outlined text-[16px] text-[#B80C09]">calendar_today</span>
                    <span>Fecha de Lanzamiento: {new Date(activeReleaseModal.releaseDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#B80C09] dark:text-rose-400">
                    Descripción Editorial
                  </h3>
                  <div className="whitespace-pre-line text-sm sm:text-base font-medium text-[#231123]/90 dark:text-gray-200 leading-relaxed bg-[#f8e9f6]/40 dark:bg-white/5 p-4 rounded-2xl border border-rose-200/40 dark:border-white/5">
                    {activeReleaseModal.description || 'No hay descripción detallada disponible para este lanzamiento.'}
                  </div>
                </div>

                {activeReleaseModal.externalUrl && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#B80C09]/15 via-[#5c1d5e]/15 to-transparent border border-[#B80C09]/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-3xl text-[#B80C09]">headphones</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase text-[#B80C09] dark:text-rose-300">Escuchar en Plataformas</p>
                        <p className="text-xs text-[#5c435a] dark:text-gray-300 truncate">Sigue el enlace externo para reproducir el álbum/sencillo</p>
                      </div>
                    </div>
                    <a
                      href={activeReleaseModal.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
                    >
                      <span>Escuchar</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Pie del modal */}
              <div className="p-4 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-black/20 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speak(`${activeReleaseModal.title} de ${activeReleaseModal.artist}. ${activeReleaseModal.description || ''}`, activeReleaseModal.title);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSpeaking
                      ? 'bg-[#B80C09] text-white animate-pulse'
                      : 'bg-white dark:bg-white/10 text-[#5c435a] dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:text-[#B80C09]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSpeaking ? 'stop' : 'record_voice_over'}
                  </span>
                  <span>{isSpeaking ? 'Detener Lectura' : 'Escuchar Descripción'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReleaseModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#B80C09] text-white text-xs font-extrabold hover:bg-[#960a07] transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default NewsPage;
