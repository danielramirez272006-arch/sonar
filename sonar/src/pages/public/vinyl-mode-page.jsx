import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';
import { searchAlbums, DEFAULT_DEEZER_ALBUMS } from '../../shared/services/deezer-service';

// Colores de edición de vinilo
const VINYL_EDITIONS = [
  {
    id: 'classic',
    name: 'Obsidiana Clásico',
    bg: 'radial-gradient(circle, #1a161b 0%, #0d0a0e 70%, #050406 100%)',
    accent: '#2a242c',
    sheen: 'rgba(255,255,255,0.14)',
    grooveBorder: 'rgba(255,255,255,0.06)',
  },
  {
    id: 'crimson',
    name: 'Rojo Carmesí Translúcido',
    bg: 'radial-gradient(circle, #5c0806 0%, #8a0b08 40%, #450504 80%, #200202 100%)',
    accent: '#B80C09',
    sheen: 'rgba(255,200,200,0.22)',
    grooveBorder: 'rgba(255,200,200,0.1)',
  },
  {
    id: 'gold',
    name: 'Oro Champagne Edición Limitada',
    bg: 'radial-gradient(circle, #4a3b1a 0%, #7a622a 40%, #3d3013 80%, #1c1507 100%)',
    accent: '#d4af37',
    sheen: 'rgba(255,235,170,0.25)',
    grooveBorder: 'rgba(255,225,140,0.12)',
  },
  {
    id: 'cobalt',
    name: 'Azul Cobalto Profundo',
    bg: 'radial-gradient(circle, #0c2340 0%, #1a3f6f 40%, #08172b 80%, #040c17 100%)',
    accent: '#2563eb',
    sheen: 'rgba(180,220,255,0.22)',
    grooveBorder: 'rgba(180,220,255,0.1)',
  },
  {
    id: 'marble',
    name: 'Humo Marmolado',
    bg: 'radial-gradient(circle, #2d262e 0%, #3f3542 35%, #1f1a21 70%, #120e14 100%)',
    accent: '#8b7a91',
    sheen: 'rgba(240,230,255,0.2)',
    grooveBorder: 'rgba(255,255,255,0.08)',
  },
];

export const VinylModePage = () => {
  const { currentTrack, isPlaying, toggleTrack, playTrack } = usePlayer();
  const [rpmSpeed, setRpmSpeed] = useState('33'); // '33' | '45'
  const [pitch, setPitch] = useState(0); // -8% to +8%
  const [volume, setVolume] = useState(85);
  const [selectedEdition, setSelectedEdition] = useState(VINYL_EDITIONS[0]);
  const [crackleEnabled, setCrackleEnabled] = useState(true);
  const [isCrateOpen, setIsCrateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [vuLevelL, setVuLevelL] = useState(12);
  const [vuLevelR, setVuLevelR] = useState(15);

  const searchDebounceRef = useRef(null);
  const audioContextRef = useRef(null);
  const crackleGainRef = useRef(null);

  // Álbum activo
  const albumData = currentTrack || {
    id: 14880659,
    deezerId: 14880659,
    title: 'In Rainbows',
    artist: 'Radiohead',
    album: 'In Rainbows',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
  };

  const isCurrentPlaying = isPlaying;

  // Manejo de búsqueda integrada en Deezer
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await searchAlbums(searchQuery);
        setSearchResults(res || []);
      } catch (err) {
        console.error('Error buscando vinilos:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Simulación de oscilación de agujas VU cuando suena música
  useEffect(() => {
    if (!isCurrentPlaying) {
      setVuLevelL(4);
      setVuLevelR(4);
      return;
    }

    const interval = setInterval(() => {
      const base = 45 + Math.random() * 35;
      setVuLevelL(Math.min(95, Math.max(10, base + (Math.random() * 20 - 10))));
      setVuLevelR(Math.min(95, Math.max(10, base + (Math.random() * 20 - 10))));
    }, 140);

    return () => clearInterval(interval);
  }, [isCurrentPlaying]);

  // Generador de sonido sutil de crepitar analógico (Web Audio API)
  useEffect(() => {
    if (!crackleEnabled || !isCurrentPlaying) {
      if (crackleGainRef.current) {
        crackleGainRef.current.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.1);
      }
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Buffer de ruido con impulsos de púa (crackle)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Ruido rosa de fondo muy bajo
        const white = Math.random() * 2 - 1;
        // Chasquidos aleatorios (crackles)
        const isPop = Math.random() < 0.0004;
        output[i] = white * 0.015 + (isPop ? (Math.random() * 0.4 - 0.2) : 0);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filtro paso bajo para darle calidez analógica
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      crackleGainRef.current = gain;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      return () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {}
      };
    } catch {
      // Ignorar restricciones de audio del navegador si aplican
    }
  }, [crackleEnabled, isCurrentPlaying]);

  const handlePlayToggle = () => {
    if (!currentTrack) {
      playTrack({
        id: albumData.id,
        deezerId: albumData.deezerId,
        title: albumData.title,
        artist: albumData.artist,
        album: albumData.album,
        cover: albumData.cover,
      });
    } else {
      toggleTrack(albumData);
    }
  };

  const handleSelectAlbum = (album) => {
    playTrack({
      id: album.id,
      deezerId: album.deezerId || album.id,
      title: album.title,
      artist: album.artist,
      album: album.album || album.title,
      cover: album.cover_xl || album.cover || album.cover_medium,
      preview: album.preview,
    });
    setIsCrateOpen(false);
  };

  // Cálculo de velocidad de rotación según RPM y Pitch
  const baseSeconds = rpmSpeed === '45' ? 3.8 : 5.4;
  const adjustedSeconds = (baseSeconds * (1 - pitch / 100)).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fff7fa] via-[#faeff7] to-[#f4e2f0] dark:from-[#160c18] dark:via-[#120713] dark:to-[#0b040c] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300 select-none overflow-x-hidden">
      {/* Navbar con buscador oculto (showSearch={false}) */}
      <Navbar showSearch={false} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* Encabezado Principal */}
        <div className="text-center mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0e2ee] dark:bg-white/5 border border-[#ddcadb] dark:border-white/10 text-[11px] uppercase tracking-widest font-black text-[#B80C09] dark:text-rose-400 mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-pulse" />
            SISTEMA AUDIÓFILO DE ALTA PRECISIÓN · 33⅓ & 45 RPM
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#231123] dark:text-white drop-shadow-sm">
            Tocadiscos Analógico Sonar
          </h1>
          <p className="text-xs sm:text-sm text-[#4e344b] dark:text-[#d4bed0] mt-2 max-w-xl mx-auto leading-relaxed font-medium">
            Plato balanceado, brazo fonocaptor de aluminio, vúmetros iluminados y búsqueda integrada de discos en el catálogo.
          </p>
        </div>

        {/* CHATIS DEL TOCADISCOS DE ALTA FIDELIDAD */}
        <div className="relative w-full max-w-5xl rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-[#251527] via-[#1a0e1c] to-[#100712] border border-white/15 p-6 sm:p-10 lg:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Luz LED Superior de Estado del Chasis */}
          <div className="absolute top-5 left-8 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isCurrentPlaying
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
              }`}
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-white/50">
              {isCurrentPlaying ? 'MOTOR ACTIVO' : 'STANDBY'}
            </span>
          </div>

          {/* Placa metálica de modelo en la esquina superior */}
          <div className="absolute top-5 right-8 hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest text-white/40">
            SONAR AUDIO · SL-2026 HI-FI
          </div>

          {/* COLUMNA IZQUIERDA: PLATO GIRATORIO, VINILO Y BRAZO FONOCAPTOR */}
          <div className="relative flex items-center justify-center p-2 sm:p-4">
            {/* Base Exterior del Plato con Patrón Estroboscópico de Puntos */}
            <div className="relative w-[300px] h-[300px] xs:w-[350px] xs:h-[350px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#1b171f] border-[6px] border-[#382f3c] shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-center p-4">
              
              {/* Anillo Estroboscópico Metálico de Puntos */}
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-white/15 pointer-events-none animate-spin-slow opacity-60" style={{ animationDuration: '40s' }} />

              {/* Lámpara Estroboscópica Roja / Target Light */}
              <div className="absolute bottom-6 left-6 w-5 h-5 rounded-full bg-[#3a0808] border border-rose-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(184,12,9,0.5)] z-20">
                <div className={`w-2 h-2 rounded-full ${isCurrentPlaying ? 'bg-red-500 animate-ping' : 'bg-red-700'}`} />
              </div>

              {/* DISCO DE VINILO CON ROTACIÓN */}
              <div
                className="relative w-full h-full rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden transition-all duration-700"
                style={{
                  background: selectedEdition.bg,
                }}
              >
                {/* Contenedor giratorio del vinilo */}
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center transition-all ${
                    isCurrentPlaying ? 'animate-spin' : ''
                  }`}
                  style={{
                    animationDuration: `${adjustedSeconds}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                  }}
                >
                  {/* Surcos Concéntricos de Alta Precisión */}
                  <div className="absolute inset-3 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-7 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-11 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-15 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-19 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-23 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />
                  <div className="absolute inset-27 rounded-full border" style={{ borderColor: selectedEdition.grooveBorder }} />

                  {/* Separadores de pistas (Bandas de silencio entre canciones) */}
                  <div className="absolute inset-[36%] rounded-full border-2 border-black/40" />
                  <div className="absolute inset-[54%] rounded-full border-2 border-black/40" />

                  {/* Reflejo Especular Cónico de Luz Dinámica en el Vinilo */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `conic-gradient(from 45deg, transparent 0deg, ${selectedEdition.sheen} 60deg, transparent 120deg, transparent 180deg, ${selectedEdition.sheen} 240deg, transparent 300deg)`,
                    }}
                  />

                  {/* Galleta Central con Portada del Álbum / Single */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-white/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative flex items-center justify-center shrink-0">
                    <img
                      src={albumData.cover}
                      alt={albumData.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Aro decorativo de la galleta */}
                    <div className="absolute inset-0 rounded-full border border-black/30 pointer-events-none" />

                    {/* Husillo Central de Metal Cromado con Bisel 3D */}
                    <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-gray-500 via-gray-100 to-gray-400 border border-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BRAZO FONOCAPTOR EN "S" HIPERREALISTA */}
              <div
                className={`hidden sm:block absolute top-0 right-0 w-24 h-64 origin-[45px_45px] transition-transform duration-1000 ease-out pointer-events-none z-30 ${
                  isCurrentPlaying ? 'rotate-[25deg]' : 'rotate-[2deg]'
                }`}
              >
                {/* Base del Pivote y Rodamientos de Precisión */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[#4d3d52] via-[#2f2433] to-[#1b141d] border-2 border-[#6f5875] shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#94819c] via-[#5c4964] to-[#2b2030] border border-white/20 flex items-center justify-center">
                    {/* Tornillo Central Cromado */}
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 border border-gray-600 shadow-inner" />
                  </div>
                  {/* Contrapeso Metálico Posterior */}
                  <div className="absolute -top-3 w-8 h-6 rounded-sm bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 border border-gray-600 shadow-md flex items-center justify-center">
                    <span className="text-[7px] font-mono text-gray-700 font-bold">1.8g</span>
                  </div>
                </div>

                {/* Brazo Curvado en S de Aluminio Cepillado */}
                <div className="w-2.5 h-44 mx-auto -mt-2 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-full shadow-[2px_4px_8px_rgba(0,0,0,0.6)] relative">
                  {/* Portacápsulas / Cabezal Audiófilo (Headshell) */}
                  <div className="absolute bottom-0 -left-2 w-6.5 h-11 bg-gradient-to-b from-[#201c22] to-[#B80C09] rounded-t-sm rounded-b-md border border-white/20 shadow-xl flex flex-col items-center justify-between p-1">
                    <div className="w-3 h-1 bg-white/60 rounded-full" />
                    {/* Cartucho & Diamante Stylus */}
                    <div className="w-2 h-3 bg-amber-400 rounded-xs shadow-[0_0_8px_#fbbf24] flex items-center justify-center">
                      <div className="w-0.5 h-1 bg-white" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: CONSOLA DE CONTROL, VÚMETROS & BUSCADOR INTEGRADO */}
          <div className="w-full lg:w-[380px] flex flex-col gap-5 text-left">
            
            {/* TARJETA DEL DISCO EN REPRODUCCIÓN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 shadow-lg flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#B80C09] block mb-0.5">
                  DISCO EN EL PLATO
                </span>
                <h3 className="text-base sm:text-lg font-black text-white truncate drop-shadow-sm">
                  {albumData.title}
                </h3>
                <p className="text-xs text-[#c9b2c5] font-medium truncate">
                  {albumData.artist}
                </p>
              </div>

              {/* Botón para cambiar de disco en la caja de vinilos */}
              <button
                type="button"
                onClick={() => setIsCrateOpen(true)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-[#B80C09] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border border-white/10 shadow-sm"
                title="Buscar o cambiar vinilo"
              >
                <span className="material-symbols-outlined text-[16px]">album</span>
                <span>Cambiar</span>
              </button>
            </div>

            {/* MEDIDORES VÚMETROS ANALÓGICOS DUALES RETRO (VU METERS) */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#180f19] to-[#0c060d] border border-white/10 shadow-inner flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-white/50">
                <span>VÚMETRO ESTÉREO dB</span>
                <span className="text-amber-400 font-mono">ANALOG LEVEL</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Canal Izquierdo */}
                <div className="relative h-14 rounded-xl bg-gradient-to-b from-[#2b1f13] to-[#120a05] border border-amber-500/20 p-2 overflow-hidden shadow-inner flex flex-col justify-between">
                  <div className="flex justify-between text-[8px] font-mono text-amber-200/60">
                    <span>-20</span>
                    <span>-5</span>
                    <span>0</span>
                    <span className="text-red-400">+3</span>
                  </div>
                  {/* Aguja Oscilante */}
                  <div className="relative w-full h-4 flex items-end">
                    <div
                      className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-amber-400 origin-bottom transition-all duration-100 ease-out shadow-[0_0_6px_#f59e0b]"
                      style={{
                        transform: `rotate(${(vuLevelL - 50) * 0.7}deg)`,
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-amber-300">CANAL L</span>
                </div>

                {/* Canal Derecho */}
                <div className="relative h-14 rounded-xl bg-gradient-to-b from-[#2b1f13] to-[#120a05] border border-amber-500/20 p-2 overflow-hidden shadow-inner flex flex-col justify-between">
                  <div className="flex justify-between text-[8px] font-mono text-amber-200/60">
                    <span>-20</span>
                    <span>-5</span>
                    <span>0</span>
                    <span className="text-red-400">+3</span>
                  </div>
                  {/* Aguja Oscilante */}
                  <div className="relative w-full h-4 flex items-end">
                    <div
                      className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-amber-400 origin-bottom transition-all duration-100 ease-out shadow-[0_0_6px_#f59e0b]"
                      style={{
                        transform: `rotate(${(vuLevelR - 50) * 0.7}deg)`,
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-amber-300">CANAL R</span>
                </div>
              </div>
            </div>

            {/* CONTROLES: VELOCIDAD RPM & PITCH FADER */}
            <div className="grid grid-cols-2 gap-3">
              {/* Velocidad 33 / 45 RPM */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between gap-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Velocidad</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRpmSpeed('33')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      rpmSpeed === '33'
                        ? 'bg-[#B80C09] text-white shadow-md'
                        : 'bg-white/10 text-gray-400 hover:bg-white/15'
                    }`}
                  >
                    33⅓
                  </button>
                  <button
                    type="button"
                    onClick={() => setRpmSpeed('45')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      rpmSpeed === '45'
                        ? 'bg-[#B80C09] text-white shadow-md'
                        : 'bg-white/10 text-gray-400 hover:bg-white/15'
                    }`}
                  >
                    45
                  </button>
                </div>
              </div>

              {/* Pitch Control Fader ±8% */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-gray-300 uppercase tracking-wider">Pitch</span>
                  <span className={`font-mono ${pitch === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {pitch > 0 ? `+${pitch}%` : `${pitch}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-[#B80C09] cursor-pointer"
                />
              </div>
            </div>

            {/* SELECTOR DE EDICIÓN / COLOR DE VINILO & CREPITAR FX */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Edición de Vinilo</span>
                <span className="text-[11px] text-gray-400 font-medium">{selectedEdition.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {VINYL_EDITIONS.map((ed) => (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedEdition(ed)}
                    className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                      selectedEdition.id === ed.id ? 'scale-125 border-white shadow-md' : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{ background: ed.accent }}
                    title={ed.name}
                  />
                ))}
              </div>
            </div>

            {/* INTERRUPTOR DE CREPITAR ANALÓGICO (CRACKLE FX) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-400">graphic_eq</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Calidez Analógica</span>
                  <span className="text-[10px] text-gray-400">Chasquido y crepitar de púa</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCrackleEnabled(!crackleEnabled)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  crackleEnabled ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-gray-500'
                }`}
              >
                {crackleEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* BOTÓN PRINCIPAL START / STOP: BAJAR AGUJA */}
            <button
              type="button"
              onClick={handlePlayToggle}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl active:scale-98 ${
                isCurrentPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-[0_8px_25px_rgba(217,119,6,0.5)]'
                  : 'bg-[#B80C09] hover:bg-[#9c0a07] text-white shadow-[0_8px_30px_rgba(184,12,9,0.6)]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isCurrentPlaying ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{isCurrentPlaying ? 'Levantar Aguja / Pausar' : 'Bajar Aguja al Surco'}</span>
            </button>

          </div>
        </div>

        {/* MODAL / CAJA DE VINILOS (CRATE DIGGER) INTEGRADO PARA EXPLORAR Y BUSCAR */}
        <AnimatePresence>
          {isCrateOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setIsCrateOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#231225] border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Cabecera del Crate */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B80C09] text-[24px]">library_music</span>
                    <div>
                      <h3 className="text-lg font-black text-white">Caja de Vinilos (Crate)</h3>
                      <p className="text-xs text-gray-400">Busca en Deezer o elige un disco para poner en el tocadiscos</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCrateOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Barra de Búsqueda Integrada */}
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar artista o álbum (ej. Radiohead, Daft Punk, Tame Impala)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80C09] focus:bg-white/10 transition-all"
                  />
                  {isSearching && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#B80C09] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {/* Lista de Resultados de Deezer o Selección de Vinilos Curados */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 max-h-[50vh]">
                  {searchResults.length > 0 ? (
                    searchResults.map((alb) => (
                      <div
                        key={alb.id}
                        onClick={() => handleSelectAlbum(alb)}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={alb.cover_medium || alb.cover}
                            alt={alb.title}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <strong className="text-sm text-white group-hover:text-rose-400 truncate transition-colors">
                              {alb.title}
                            </strong>
                            <span className="text-xs text-gray-400 truncate">
                              {alb.artist} {alb.year ? `· ${alb.year}` : ''}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-[#B80C09] text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0"
                        >
                          Cargar Vinilo
                        </button>
                      </div>
                    ))
                  ) : searchQuery.trim() && !isSearching ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No se encontraron álbumes para &ldquo;{searchQuery}&rdquo;.
                    </div>
                  ) : (
                    <>
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 mt-1 mb-1">
                        COLECCIÓN DE VINILOS DESTACADOS
                      </span>
                      {DEFAULT_DEEZER_ALBUMS.map((alb) => (
                        <div
                          key={alb.id}
                          onClick={() => handleSelectAlbum(alb)}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={alb.cover}
                              alt={alb.title}
                              className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <strong className="text-sm text-white group-hover:text-rose-400 truncate transition-colors">
                                {alb.title}
                              </strong>
                              <span className="text-xs text-gray-400 truncate">
                                {alb.artist} · {alb.genre || alb.year}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-white/10 group-hover:bg-[#B80C09] text-white text-xs font-bold shadow-sm transition-all shrink-0"
                          >
                            Poner en Plato
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default VinylModePage;
