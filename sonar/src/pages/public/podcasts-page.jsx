import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';
import Toast from '../../shared/components/ui/toast';

const DEFAULT_PODCAST_EPISODES = [
  {
    id: 'base-1',
    title: 'Ep. 44: La orquestación del Free Jazz en "To Pimp a Butterfly"',
    show: 'Sesiones Sonar • Disección Pista por Pista',
    duration: '52 min',
    date: '23 Sep 2026',
    hosts: 'Alejandro Ramos & Sofia Chen',
    description: 'Análisis de la presencia de Thundercat en el bajo, los arreglos de vientos de Kamasi Washington y cómo se mezcló para mantener la pegada del hip-hop con la dinámica del jazz en vivo.',
    deezerId: 9896728,
    audioUrl: null,
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 'base-2',
    title: 'Ep. 43: Compresión analógica y sampleo vintage en "Discovery"',
    show: 'Frecuencia Analógica',
    duration: '44 min',
    date: '19 Sep 2026',
    hosts: 'Camila Delgado & Mateo Valenzuela',
    description: 'Daft Punk y el arte de usar compresores Alesis 3630 para crear el efecto de bombeo del French House y cómo aislar micro-samples de vinilos de los 70s y 80s.',
    deezerId: 302127,
    audioUrl: null,
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 'base-3',
    title: 'Ep. 42: La ingeniería secreta detrás de "In Rainbows"',
    show: 'Sesiones Sonar • Disección Pista por Pista',
    duration: '48 min',
    date: '12 Sep 2026',
    hosts: 'Mateo Valenzuela & Sofia Chen',
    description: 'Analizamos las cintas multipista de 2007: el uso de sintetizadores analógicos, la compresión de la caja de Phil Selway y la reverberación de placa de Thom Yorke.',
    deezerId: 14880659,
    audioUrl: null,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 'base-4',
    title: 'Ep. 41: ¿Por qué el vinilo sigue sonando más cálido?',
    show: 'Laboratorio Acústico',
    duration: '35 min',
    date: '05 Sep 2026',
    hosts: 'Valeria Montero (Ingeniera de Mastering)',
    description: 'Mitos y verdades sobre la distorsión armónica de segundo orden, la curva de ecualización RIAA y las ventajas físicas de prensar a 45 RPM.',
    deezerId: 10709540,
    audioUrl: null,
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 'base-5',
    title: 'Ep. 40: De Sheffield al infinito — El legado sonoro de Warp Records',
    show: 'Crónicas del Vinilo',
    duration: '54 min',
    date: '28 Ago 2026',
    hosts: 'Carlos Echeverría',
    description: 'Un recorrido por la historia de Aphex Twin, Boards of Canada y el nacimiento de la Intelligent Dance Music (IDM).',
    deezerId: 537883642,
    audioUrl: null,
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg'
  }
];

export const PodcastsPage = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [toastMessage, setToastMessage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [customEpisodes, setCustomEpisodes] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_custom_podcasts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newPodcast, setNewPodcast] = useState({
    title: '',
    show: 'Sesiones Sonar Comunitarias',
    hosts: '',
    description: '',
    duration: '30 min',
    cover: '',
    audioUrl: '',
    audioFileName: '',
  });

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [audioUploadState, setAudioUploadState] = useState({ loading: false, success: false });

  const allEpisodes = [...customEpisodes, ...DEFAULT_PODCAST_EPISODES];

  const filteredEpisodes = allEpisodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ep.show.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ep.hosts.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploadState({ loading: true, success: false });
    const objectUrl = URL.createObjectURL(file);

    // Calcular duración si es posible
    const tempAudio = new Audio();
    tempAudio.src = objectUrl;
    tempAudio.onloadedmetadata = () => {
      const minutes = Math.floor(tempAudio.duration / 60);
      const seconds = Math.floor(tempAudio.duration % 60);
      const durStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
      setNewPodcast((prev) => ({
        ...prev,
        duration: durStr,
      }));
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setNewPodcast((prev) => ({
        ...prev,
        audioUrl: dataUrl,
        audioFileName: file.name,
      }));
      setAudioUploadState({ loading: false, success: true });
    };
    reader.onerror = () => {
      // Usar blob URL como fallback
      setNewPodcast((prev) => ({
        ...prev,
        audioUrl: objectUrl,
        audioFileName: file.name,
      }));
      setAudioUploadState({ loading: false, success: true });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewPodcast((prev) => ({
        ...prev,
        cover: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newPodcast.title.trim()) {
      setToastMessage('Por favor ingresa un título para el episodio.');
      return;
    }

    const createdEpisode = {
      id: `custom-pod-${Date.now()}`,
      title: newPodcast.title.trim(),
      show: newPodcast.show.trim() || 'Podcast Melómano',
      hosts: newPodcast.hosts.trim() || 'Comunidad Sonar',
      duration: newPodcast.duration || '25 min',
      date: 'Hoy',
      description: newPodcast.description.trim() || 'Episodio subido por la comunidad de audiófilos.',
      deezerId: `pod-${Date.now()}`,
      audioUrl: newPodcast.audioUrl || null,
      cover:
        newPodcast.cover ||
        'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
      isCustom: true,
    };

    const updated = [createdEpisode, ...customEpisodes];
    setCustomEpisodes(updated);
    try {
      localStorage.setItem('sonar_custom_podcasts', JSON.stringify(updated));
    } catch {
      // Ignorar si excede localStorage
    }

    setIsUploadModalOpen(false);
    setNewPodcast({
      title: '',
      show: 'Sesiones Sonar Comunitarias',
      hosts: '',
      description: '',
      duration: '30 min',
      cover: '',
      audioUrl: '',
      audioFileName: '',
    });
    setAudioUploadState({ loading: false, success: false });
    setToastMessage(`¡Episodio "${createdEpisode.title}" publicado con éxito!`);
  };

  const handlePlayEpisode = (ep) => {
    playTrack({
      id: ep.id || ep.deezerId,
      deezerId: ep.deezerId,
      title: ep.title,
      artist: ep.show,
      album: 'Sesiones Sonar Podcast',
      cover: ep.cover,
      preview: ep.audioUrl || null,
      previewUrl: ep.audioUrl || null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
                SESIONES SONAR & PODCASTS AUDIÓFILOS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
              Podcasts & Debates
            </h1>
            <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
              Conversaciones en profundidad entre ingenieros de mezcla, críticos y coleccionistas sobre la ciencia acústica y el arte del álbum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              <span>+ Subir Nuevo Episodio</span>
            </button>
          </div>
        </header>

        {/* Buscador de Episodios */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar episodios por título, show o invitados..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-white dark:bg-[#4B2840] text-sm text-[#231123] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#B80C09]"
            />
          </div>
        </div>

        {/* Listado de Episodios */}
        <div className="flex flex-col gap-6">
          {filteredEpisodes.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-gray-400">podcasts</span>
              <h3 className="text-lg font-bold">No se encontraron episodios</h3>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                Prueba con otro término de búsqueda o sube tu propio podcast.
              </p>
            </div>
          ) : (
            filteredEpisodes.map((ep) => {
              const isCurrent = (currentTrack?.id === ep.id || currentTrack?.deezerId === ep.deezerId || currentTrack?.title === ep.title) && isPlaying;

              return (
                <motion.div
                  key={ep.id}
                  whileHover={{ x: 4 }}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-md transition-all"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img src={ep.cover} alt={ep.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[32px]">podcasts</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 text-xs text-[#5c435a] dark:text-[#B89CB0] font-bold mb-1 flex-wrap">
                      <span className="text-[#B80C09] dark:text-pink-300 uppercase tracking-wider font-extrabold">{ep.show}</span>
                      <span>·</span>
                      <span>{ep.date}</span>
                      <span>·</span>
                      <span>{ep.duration}</span>
                      {ep.isCustom && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                          Subido por Melómano
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#231123] dark:text-white mb-2">
                      {ep.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed mb-3">
                      {ep.description}
                    </p>

                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Voces / Anfitriones: {ep.hosts}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayEpisode(ep)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#B80C09] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#9c0a07] transition-all cursor-pointer shadow-md shrink-0 w-full md:w-auto justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isCurrent ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{isCurrent ? 'Pausar Sesión' : 'Escuchar Sesión'}</span>
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal para Subir Episodio de Podcast */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#B80C09] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">mic</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#231123] dark:text-white">
                    Subir Nuevo Episodio de Podcast
                  </h3>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                    Comparte tu debate o análisis sonoro con la comunidad de audiófilos.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                {/* Selección de Archivo de Audio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                    Archivo de Audio (.mp3, .wav, .m4a, .ogg)
                  </label>
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleAudioFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    className="p-4 rounded-2xl border-2 border-dashed border-[#e6d5e2] dark:border-white/20 hover:border-[#B80C09] bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                  >
                    <span className="material-symbols-outlined text-[32px] text-[#B80C09]">
                      audiotrack
                    </span>
                    <span className="text-xs font-bold text-[#231123] dark:text-white">
                      {newPodcast.audioFileName ? newPodcast.audioFileName : 'Haz clic para seleccionar el archivo de audio'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {audioUploadState.success ? '✓ Audio cargado correctamente' : 'Formatos: MP3, WAV, AAC, M4A'}
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                    Título del Episodio
                  </label>
                  <input
                    type="text"
                    required
                    value={newPodcast.title}
                    onChange={(e) => setNewPodcast({ ...newPodcast, title: e.target.value })}
                    placeholder="ej. Ep. 45: La historia no contada del sintetizador Minimoog"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#4B2840] text-sm text-[#231123] dark:text-white focus:outline-none focus:border-[#B80C09]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre del Show / Programa */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                      Show o Programa
                    </label>
                    <input
                      type="text"
                      value={newPodcast.show}
                      onChange={(e) => setNewPodcast({ ...newPodcast, show: e.target.value })}
                      placeholder="ej. Crónicas del Vinilo"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#4B2840] text-sm text-[#231123] dark:text-white focus:outline-none focus:border-[#B80C09]"
                    />
                  </div>

                  {/* Anfitriones */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                      Voces / Anfitriones
                    </label>
                    <input
                      type="text"
                      value={newPodcast.hosts}
                      onChange={(e) => setNewPodcast({ ...newPodcast, hosts: e.target.value })}
                      placeholder="ej. Marcos Vinyl & Elena Analog"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#4B2840] text-sm text-[#231123] dark:text-white focus:outline-none focus:border-[#B80C09]"
                    />
                  </div>
                </div>

                {/* Portada */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                    Imagen de Portada (Opcional)
                  </label>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    {newPodcast.cover && (
                      <img
                        src={newPodcast.cover}
                        alt="Preview Portada"
                        className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border border-[#e6d5e2] dark:border-white/10 text-xs font-bold bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {newPodcast.cover ? 'Cambiar Imagen' : 'Seleccionar Imagen de Portada'}
                    </button>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                    Descripción / Notas del Episodio
                  </label>
                  <textarea
                    rows={3}
                    value={newPodcast.description}
                    onChange={(e) => setNewPodcast({ ...newPodcast, description: e.target.value })}
                    placeholder="Escribe de qué trata el episodio, temas técnicos discutidos o pistas analizadas..."
                    className="w-full p-3 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-[#4B2840] text-sm text-[#231123] dark:text-white focus:outline-none focus:border-[#B80C09]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#e6d5e2] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Publicar Episodio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PodcastsPage;
