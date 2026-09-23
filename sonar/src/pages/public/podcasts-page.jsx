import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';

const PODCAST_EPISODES = [
  {
    id: 1,
    title: 'Ep. 44: La orquestación del Free Jazz en "To Pimp a Butterfly"',
    show: 'Sesiones Sonar • Disección Pista por Pista',
    duration: '52 min',
    date: '23 Sep 2026',
    hosts: 'Alejandro Ramos & Sofia Chen',
    description: 'Análisis de la presencia de Thundercat en el bajo, los arreglos de vientos de Kamasi Washington y cómo se mezcló para mantener la pegada del hip-hop con la dinámica del jazz en vivo.',
    deezerId: 9896728,
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 2,
    title: 'Ep. 43: Compresión analógica y sampleo vintage en "Discovery"',
    show: 'Frecuencia Analógica',
    duration: '44 min',
    date: '19 Sep 2026',
    hosts: 'Camila Delgado & Mateo Valenzuela',
    description: 'Daft Punk y el arte de usar compresores Alesis 3630 para crear el efecto de bombeo del French House y cómo aislar micro-samples de vinilos de los 70s y 80s.',
    deezerId: 302127,
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 3,
    title: 'Ep. 42: La ingeniería secreta detrás de "In Rainbows"',
    show: 'Sesiones Sonar • Disección Pista por Pista',
    duration: '48 min',
    date: '12 Sep 2026',
    hosts: 'Mateo Valenzuela & Sofia Chen',
    description: 'Analizamos las cintas multipista de 2007: el uso de sintetizadores analógicos, la compresión de la caja de Phil Selway y la reverberación de placa de Thom Yorke.',
    deezerId: 14880659,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 4,
    title: 'Ep. 41: ¿Por qué el vinilo sigue sonando más cálido?',
    show: 'Laboratorio Acústico',
    duration: '35 min',
    date: '05 Sep 2026',
    hosts: 'Valeria Montero (Ingeniera de Mastering)',
    description: 'Mitos y verdades sobre la distorsión armónica de segundo orden, la curva de ecualización RIAA y las ventajas físicas de prensar a 45 RPM.',
    deezerId: 10709540,
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg'
  },
  {
    id: 5,
    title: 'Ep. 40: De Sheffield al infinito — El legado sonoro de Warp Records',
    show: 'Crónicas del Vinilo',
    duration: '54 min',
    date: '28 Ago 2026',
    hosts: 'Carlos Echeverría',
    description: 'Un recorrido por la historia de Aphex Twin, Boards of Canada y el nacimiento de la Intelligent Dance Music (IDM).',
    deezerId: 537883642,
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg'
  }
];

export const PodcastsPage = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10">
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
        </header>

        <div className="flex flex-col gap-6">
          {PODCAST_EPISODES.map((ep) => {
            const isCurrent = currentTrack?.deezerId === ep.deezerId && isPlaying;

            return (
              <motion.div
                key={ep.id}
                whileHover={{ x: 4 }}
                className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-md"
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img src={ep.cover} alt={ep.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[32px]">podcasts</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 text-xs text-[#5c435a] dark:text-[#B89CB0] font-bold mb-1">
                    <span className="text-[#B80C09] dark:text-pink-300 uppercase tracking-wider font-extrabold">{ep.show}</span>
                    <span>·</span>
                    <span>{ep.date}</span>
                    <span>·</span>
                    <span>{ep.duration}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#231123] dark:text-white mb-2">
                    {ep.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed mb-3">
                    {ep.description}
                  </p>

                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Voces: {ep.hosts}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    playTrack({
                      id: ep.deezerId,
                      deezerId: ep.deezerId,
                      title: ep.title,
                      artist: ep.show,
                      album: 'Sesiones Sonar Podcast',
                      cover: ep.cover,
                    })
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#B80C09] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#9c0a07] transition-all cursor-pointer shadow-md shrink-0 w-full md:w-auto justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isCurrent ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isCurrent ? 'Pausar Sesión' : 'Escuchar Muestra'}</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PodcastsPage;
