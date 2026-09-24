import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';
import { useAccessibility } from '../../shared/context/accessibility-context';
import { subscribeNewsletterWebhook } from '../../shared/services/n8n-webhooks';

// Catálogo curado de noticias musicales audiófilas
export const NEWS_ARTICLES = [
  {
    id: 'radiohead-in-rainbows-45rpm-reissue',
    title: 'Radiohead Anuncia Reedición Audiófila de "In Rainbows" en Doble Vinilo de 45 RPM Masterizado en Abbey Road',
    category: 'Lanzamientos',
    date: '24 Septiembre, 2026',
    author: 'Julián Andrade',
    role: 'Editor en Jefe',
    readTime: '4 min',
    featured: true,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    summary: 'El legendario álbum de 2007 recibe una masterización a media velocidad (half-speed) directa de las cintas analógicas de 1/2 pulgada, con un rango dinámico sin precedentes.',
    content: `Radiohead y el sello XL Recordings han confirmado el lanzamiento de una edición de referencia audiófila de "In Rainbows", masterizada por Miles Showell en los míticos Abbey Road Studios de Londres.

El proceso de corte se realizó a 45 revoluciones por minuto en dos vinilos vírgenes de 180 gramos, lo que permite duplicar el espacio físico del surco para frecuencias graves profundas y una respuesta transitoria ultrarrápida en temas como "15 Step" y "Nude".

"Queríamos que el oyente pudiera experimentar la textura de la batería de Phil Selway y la reverberación de placa EMT en la voz de Thom Yorke con la fidelidad exacta con la que fue grabada en la mansión de Tottenham House", explicó el equipo técnico de masterización.

La edición incluirá además un folleto con notas de producción de Nigel Godrich y ensayos fotográficos inéditos de las sesiones de 2006.`,
    trackPreview: {
      id: 3135556,
      title: '15 Step',
      artist: 'Radiohead',
      album: 'In Rainbows',
      cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    }
  },
  {
    id: 'primavera-glastonbury-festivales-2027',
    title: 'Festivales Revelan Carteles con Actos Estelares de Electrónica Experimental y Post-Punk',
    category: 'Festivales',
    date: '23 Septiembre, 2026',
    author: 'Elena Rostova',
    role: 'Corresponsal Internacional',
    readTime: '5 min',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    summary: 'Primavera Sound y Glastonbury confirman a Aphex Twin, Massive Attack, Portishead y The Smile en escenarios con sistemas de sonido inmersivo L-Acoustics L-ISA.',
    content: `La temporada de festivales 2027 promete ser un hito para los amantes de la acústica de alta precisión. Las organizaciones de Primavera Sound y Glastonbury han anunciado que sus escenarios principales estarán equipados con sistemas de sonido espacial L-Acoustics L-ISA de 360 grados.

Entre los actos destacados se encuentran el regreso a los escenarios de Massive Attack con una producción centrada en la neutralidad de carbono, presentaciones exclusivas de Aphex Twin con sintetizadores modulares analógicos en directo y sesiones especiales de The Smile.

Los asistentes podrán disfrutar de una claridad en la mezcla estéreo y multicanal donde la distorsión armónica se reduce a menos del 0.05% en cualquier punto del recinto.`,
    trackPreview: {
      id: 1109731,
      title: 'Teardrop',
      artist: 'Massive Attack',
      album: 'Mezzanine',
      cover: 'https://cdn-images.dzcdn.net/images/cover/1b73059129e924a1b066ffdc5a363da6/500x500-000000-80-0-0.jpg',
    }
  },
  {
    id: 'hardware-pro-ject-balanced-turntables',
    title: 'Pro-Ject y Audio-Technica Presentan Nueva Línea de Tocadiscos con Conexión Balanceada True XLR',
    category: 'Hi-Fi & Hardware',
    date: '22 Septiembre, 2026',
    author: 'Valeria Montero',
    role: 'Ingeniera Acústica',
    readTime: '6 min',
    cover: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&q=80&w=800',
    summary: 'La transmisión balanceada de señales fonocaptoras MC elimina por completo las interferencias de radiofrecuencia (RFI) y el zumbido de masa en sistemas domésticos.',
    content: `La conexión balanceada (True Balanced) ha dado el salto definitivo al mercado del vinilo de alta fidelidad. Los nuevos modelos de Pro-Ject y Audio-Technica incorporan salidas balanceadas mini-XLR y XLR completas directamente desde la cápsula de bobina móvil (MC).

Dado que las cápsulas MC generan microvoltajes extremadamente sensibles a interferencias electromagnéticas generadas por routers Wi-Fi y transformadores, el circuito balanceado cancela el ruido de modo común, logrando una relación señal/ruido superior a 90 dB.

"Es el mayor avance en claridad de fondo y rango dinámico en la reproducción de vinilo de los últimos 20 años", afirmó el panel de ingenieros en la presentación de Berlín.`,
    trackPreview: null
  },
  {
    id: 'pink-floyd-wish-you-were-here-50th',
    title: 'Pink Floyd: La Disección Acústica de las Cintas Maestras de "Wish You Were Here"',
    category: 'Crónicas',
    date: '20 Septiembre, 2026',
    author: 'Carlos Echeverría',
    role: 'Historiador Musical',
    readTime: '7 min',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    summary: 'Un recorrido por el tratamiento de sintetizadores Minimoog, guías de guitarra de 12 cuerdas acústicas de David Gilmour y la espacialidad de Abbey Road.',
    content: `A cinco décadas de su publicación, "Wish You Were Here" sigue siendo considerado el estándar de oro en dinámica de grabación analógica.

El solo de cuatro notas de David Gilmour en "Shine On You Crazy Diamond" fue grabado usando una Fender Stratocaster conectada a un amplificador Hiwatt DR103 emparejado con un eco de cinta Binson Echorec. La interacción entre la resonancia de las válvulas y la reverberación natural de los techos altos del Estudio 3 de Abbey Road creó una profundidad de campo que aún desafía las emulaciones digitales modernas.

En este reportaje exploramos los secretos de cinta de 2 pulgadas y 16 pistas utilizados por Brian Humphries.`,
    trackPreview: {
      id: 3105001,
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      cover: 'https://cdn-images.dzcdn.net/images/cover/989cb5103a8914ba08a287f94ca3aa14/500x500-000000-80-0-0.jpg',
    }
  },
  {
    id: 'sellos-independientes-vinilo-records-2026',
    title: 'Warp, Ninja Tune y 4AD Reportan Récord en Soporte Físico y Firman Manifiesto Contra la Hipercompresión',
    category: 'Industria & Sellos',
    date: '18 Septiembre, 2026',
    author: 'Mateo Solís',
    role: 'Analista de Industria',
    readTime: '4 min',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    summary: 'Más de 40 sellos independientes internacionales acuerdan estándares mínimos de rango dinámico (DR12+) para todos sus lanzamientos en streaming y vinilo.',
    content: `Una alianza de sellos discográficos independientes europeos y americanos ha lanzado la iniciativa "Dynamic Sound Guarantee". El pacto prohíbe el uso de limitadores extremos en las etapas de masterización digital para preservar la respiración y los contrastes tímbricos de la música.

Las ventas de vinilos y casetes en estos sellos crecieron un 28% interanual en 2026, impulsadas por un público joven que busca conectar con el objeto físico y la escucha sin distracciones.`,
    trackPreview: null
  },
  {
    id: 'daft-punk-discovery-analog-sidechain',
    title: 'El Legado Técnico de Daft Punk: El Sampler E-mu SP-1200 y el Sonido Francés',
    category: 'Crónicas',
    date: '15 Septiembre, 2026',
    author: 'Julián Andrade',
    role: 'Editor en Jefe',
    readTime: '6 min',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    summary: 'Cómo los compresores Alesis 3630 y el filtrado analógico crearon la estética sónica inimitable del French Touch en "Discovery".',
    content: `El sonido de "Discovery" de Daft Punk no fue producto de plugins digitales, sino del uso creativo de hardware asequible llevado al límite. El compresor Alesis 3630, conocido por su carácter agresivo, fue utilizado en cadena lateral (sidechain) para forzar la mezcla entera a agacharse con cada golpe de bombo de 909.

Ese efecto de bombeo, combinado con convertidores de 12 bits y filtros analógicos Moog, definió el sonido de la música electrónica del nuevo milenio.`,
    trackPreview: {
      id: 3135558,
      title: 'One More Time',
      artist: 'Daft Punk',
      album: 'Discovery',
      cover: 'https://cdn-images.dzcdn.net/images/cover/2e018122cb56986277102d204f6b1628/500x500-000000-80-0-0.jpg',
    }
  }
];

const CATEGORIES = [
  'Todas',
  'Lanzamientos',
  'Festivales',
  'Hi-Fi & Hardware',
  'Industria & Sellos',
  'Crónicas',
];

const BREAKING_TICKERS = [
  '🔴 EN VIVO: Radiohead confirma edición 45 RPM de "In Rainbows" con corte directo en Abbey Road',
  '🎪 FESTIVALES 2027: Primavera Sound y Glastonbury implementarán sonido espacial 360°',
  '🎛️ HARDWARE: Pro-Ject presenta nuevos tocadiscos con salidas balanceadas True XLR',
  '💿 DISCOGRAFÍA: Sellos independientes acuerdan estándar de rango dinámico DR12+',
  '🎧 AUDIO LOSSLESS: Deezer y Sonar expanden catálogo FLAC 24-bit/96kHz'
];

export const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  // Estado del Formulario de Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(['Lanzamientos', 'Hi-Fi & Hardware', 'Festivales']);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);

  const { playTrack, toggleTrack, currentTrack, isPlaying } = usePlayer();
  const { speak, stopSpeaking, isSpeaking, playAudioCue, announce } = useAccessibility();

  // Filtrado de noticias
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Todas' || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = NEWS_ARTICLES.find((a) => a.featured) || NEWS_ARTICLES[0];

  // Manejo de Suscripción a Newsletter vía n8n Webhook
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

      {/* Cinta de Noticias de Última Hora (Breaking News Marquee) */}
      <div className="bg-[#231123] dark:bg-[#150915] text-white border-b border-white/10 overflow-hidden py-2.5 px-4">
        <div className="max-w-[1440px] mx-auto flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-[#B80C09] text-white text-[10px] font-black uppercase tracking-widest shrink-0 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>RADAR EN VIVO</span>
          </span>
          <div className="overflow-hidden whitespace-nowrap relative flex-1 text-xs font-semibold text-[#f8e9f6]/90">
            <div className="inline-block animate-marquee">
              {BREAKING_TICKERS.join('  ·  ·  ·  ')}
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">
        
        {/* Encabezado Principal */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e6d5e2] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
                PERIODISMO MUSICAL & RADAR DE ACTUALIDAD
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#231123] dark:text-white">
              Noticias & Novedades Sónicas
            </h1>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
              Análisis de nuevos lanzamientos, reediciones audiófilas de alta fidelidad, tecnología analógica y los movimientos más trascendentes del ecosistema musical.
            </p>
          </div>

          {/* Buscador Rápido de Noticias */}
          <div className="w-full md:w-80 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar noticias, artistas, sellos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium bg-white dark:bg-[#4B2840]/60 border border-[#e6d5e2] dark:border-white/10 text-[#231123] dark:text-white placeholder-[#876a84] dark:placeholder-gray-400 focus:outline-none focus:border-[#B80C09] shadow-xs transition-all"
            />
          </div>
        </header>

        {/* NOTICIA DESTACADA (HERO STORY) */}
        {!searchQuery && selectedCategory === 'Todas' && featuredArticle && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden bg-white dark:bg-[#2e192c] border border-[#e6d5e2] dark:border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative group"
          >
            {/* Imagen Destacada */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
              <img
                src={featuredArticle.cover}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#B80C09] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                ⭐ PORTADA PRINCIPAL · {featuredArticle.category}
              </div>
            </div>

            {/* Contenido Destacado */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime} de lectura</span>
                  <span>•</span>
                  <span className="text-[#B80C09] dark:text-rose-300 font-extrabold">{featuredArticle.author}</span>
                </div>

                <h2
                  onClick={() => setActiveArticleModal(featuredArticle)}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-rose-300 transition-colors cursor-pointer leading-tight"
                >
                  {featuredArticle.title}
                </h2>

                <p className="text-sm text-[#5c435a] dark:text-[#DCDCDD] leading-relaxed line-clamp-4">
                  {featuredArticle.summary}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e6d5e2] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveArticleModal(featuredArticle)}
                  className="px-5 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>Leer Artículo Completo</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                {featuredArticle.trackPreview && (
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
                    className="px-4 py-2.5 rounded-xl bg-[#f8e9f6] dark:bg-white/10 hover:bg-rose-100 dark:hover:bg-white/20 text-[#B80C09] dark:text-rose-200 text-xs font-bold transition-all cursor-pointer border border-rose-200 dark:border-white/10 flex items-center gap-1.5"
                    title="Escuchar muestra de audio relacionada"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {currentTrack?.title === featuredArticle.trackPreview.title && isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>Escuchar Muestra</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speak(featuredArticle.summary, featuredArticle.title);
                    }
                  }}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${
                    isSpeaking
                      ? 'bg-[#B80C09] text-white border-[#B80C09] animate-pulse'
                      : 'bg-white dark:bg-white/5 text-[#5c435a] dark:text-gray-200 border-[#e6d5e2] dark:border-white/10 hover:text-[#B80C09]'
                  }`}
                  title="Escuchar noticia narrada en voz alta (TTS)"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSpeaking ? 'stop' : 'record_voice_over'}
                  </span>
                </button>
              </div>
            </div>
          </motion.section>
        )}

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

        {/* Cuadrícula de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
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
                  {article.trackPreview && (
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-rose-400">audiotrack</span>
                      <span>Audio</span>
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0]">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3
                    onClick={() => setActiveArticleModal(article)}
                    className="text-lg font-black text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-rose-300 transition-colors cursor-pointer leading-snug line-clamp-2"
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
                  Por {article.author}
                </span>

                <div className="flex items-center gap-2">
                  {article.trackPreview && (
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
                        {currentTrack?.title === article.trackPreview.title && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  )}

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
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#4B2840]/30 rounded-3xl border border-[#e6d5e2] dark:border-white/10 p-8">
            <span className="material-symbols-outlined text-4xl text-[#B80C09]">newspaper</span>
            <h3 className="text-lg font-bold">No se encontraron noticias con estos términos</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prueba buscando por otro término como &ldquo;vinilo&rdquo;, &ldquo;Radiohead&rdquo;, &ldquo;festivales&rdquo; o selecciona &ldquo;Todas&rdquo;.
            </p>
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

            {/* Selector de Temas de Interés */}
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

                {/* Reproductor de muestra si aplica */}
                {activeArticleModal.trackPreview && (
                  <div className="p-4 rounded-2xl bg-[#f8e9f6] dark:bg-white/5 border border-rose-200 dark:border-white/10 flex items-center justify-between gap-4 mt-6">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeArticleModal.trackPreview.cover}
                        alt={activeArticleModal.trackPreview.title}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs uppercase font-bold text-[#B80C09] dark:text-rose-300">Pista Destacada</span>
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
                      className="px-4 py-2 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {currentTrack?.title === activeArticleModal.trackPreview.title && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      <span>Reproducir</span>
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
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default NewsPage;
