import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';

export const VinylModePage = () => {
  const { currentTrack, isPlaying, toggleTrack, playTrack } = usePlayer();
  const [rpmSpeed, setRpmSpeed] = useState('33'); // '33' | '45'
  const [armAngle, setArmAngle] = useState(isPlaying ? 24 : 0);

  // Álbum de muestra por defecto si no hay nada sonando
  const albumData = currentTrack || {
    id: 14880659,
    deezerId: 14880659,
    title: 'In Rainbows',
    artist: 'Radiohead',
    album: 'In Rainbows',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
  };

  const isCurrentPlaying = isPlaying;

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

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#140b16] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 flex flex-col items-center justify-center">
        {/* Cabecera */}
        <div className="text-center mb-10 max-w-2xl">
          <span className="text-xs uppercase tracking-widest font-black text-[#B80C09] dark:text-pink-300 mb-2 block">
            EXPERIENCIA AUDIÓFILA ANALÓGICA
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#231123] dark:text-white">
            Tocadiscos Sonar 33⅓ RPM
          </h1>
          <p className="text-sm text-[#5c435a] dark:text-gray-400 mt-2 leading-relaxed">
            Modo inmersivo de reproducción de vinilo con renderizado analógico y surcos en alta definición.
          </p>
        </div>

        {/* Chasis del Tocadiscos de Alta Fidelidad */}
        <div className="relative w-full max-w-4xl p-8 sm:p-12 rounded-[40px] bg-gradient-to-b from-[#281628] via-[#1f0f20] to-[#120713] text-white border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
          {/* Plato Giratorio y Vinilo */}
          <div className="relative flex items-center justify-center">
            {/* Plato de Aluminio Pulido */}
            <div className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#201c22] border-4 border-[#3a333d] shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center p-4">
              {/* Disco de Vinilo con Rotación */}
              <div
                className={`relative w-full h-full rounded-full bg-[#0d090e] border border-white/10 flex items-center justify-center shadow-2xl transition-all ${
                  isCurrentPlaying ? 'animate-spin-slow' : ''
                }`}
                style={{
                  animationDuration: rpmSpeed === '45' ? '4s' : '5.8s',
                }}
              >
                {/* Surcos Analógicos Concéntricos */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />
                <div className="absolute inset-16 rounded-full border border-white/5" />
                <div className="absolute inset-20 rounded-full border border-white/5" />
                <div className="absolute inset-24 rounded-full border border-white/5" />

                {/* Brillo de Reflejo de Luz en los Surcos */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                {/* Etiqueta Central con Portada */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/30 shadow-inner relative flex items-center justify-center">
                  <img
                    src={albumData.cover}
                    alt={albumData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Husillo Central de Metal */}
                  <div className="absolute w-5 h-5 rounded-full bg-[#d4d4d8] border border-gray-600 shadow-md" />
                </div>
              </div>
            </div>

            {/* Brazo Fonocaptor Analógico (Tonearm) */}
            <div
              className={`hidden sm:block absolute top-2 right-2 w-8 h-48 origin-top transition-transform duration-1000 pointer-events-none ${
                isCurrentPlaying ? 'rotate-[22deg]' : 'rotate-0'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#524456] border-2 border-gray-400 mx-auto" />
              <div className="w-1.5 h-36 bg-gradient-to-b from-gray-300 to-gray-500 mx-auto shadow-md" />
              <div className="w-4 h-8 bg-[#B80C09] rounded-xs mx-auto -mt-1 shadow-md flex items-center justify-center">
                <div className="w-1 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Panel de Controles y Ecualizador Analógico */}
          <div className="w-full lg:w-80 flex flex-col gap-6 text-left">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B80C09] block mb-1">
                DISCO EN REPRODUCCIÓN
              </span>
              <h3 className="text-xl font-black text-white truncate">
                {albumData.title}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {albumData.artist}
              </p>
            </div>

            {/* Selector de Velocidad 33 / 45 RPM */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-xs font-bold text-gray-300">Velocidad del Plato</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRpmSpeed('33')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    rpmSpeed === '33' ? 'bg-[#B80C09] text-white shadow-md' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  33⅓ RPM
                </button>
                <button
                  type="button"
                  onClick={() => setRpmSpeed('45')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    rpmSpeed === '45' ? 'bg-[#B80C09] text-white shadow-md' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  45 RPM
                </button>
              </div>
            </div>

            {/* Botón Principal Start / Stop */}
            <button
              type="button"
              onClick={handlePlayToggle}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                isCurrentPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#B80C09] hover:bg-[#9c0a07] text-white shadow-[0_10px_30px_rgba(184,12,9,0.5)]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isCurrentPlaying ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{isCurrentPlaying ? 'Levantar Aguja / Pausar' : 'Bajar Aguja al Surco'}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VinylModePage;
