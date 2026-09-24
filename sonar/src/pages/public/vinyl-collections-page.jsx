import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';

const VINYL_VAULT_ITEMS = [
  {
    id: 'in-rainbows-box',
    title: 'In Rainbows (Discbox Edition)',
    artist: 'Radiohead',
    year: '2007',
    speed: '45 RPM (2xLP)',
    weight: '180 gramos',
    pressingPlant: 'Optimal Media, Alemania',
    matrix: 'XL-RECORDINGS / TICK001LP',
    rarity: 'Edición de Coleccionista',
    rating: 4.9,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
    description: 'El legendario Boxset que incluye dos LPs de 180 gramos cortados a 45 RPM para maximizar la velocidad tangencial de lectura de aguja y reducir la distorsión en los surcos internos.',
    deezerId: 14880659,
  },
  {
    id: 'blonde-black-friday',
    title: 'Blonde (Black Friday Promo)',
    artist: 'Frank Ocean',
    year: '2016',
    speed: '33⅓ RPM (2xLP)',
    weight: '180g Heavyweight Vinyl',
    pressingPlant: 'United Record Pressing',
    matrix: 'BO-2016-BF',
    rarity: 'Santo Grial Audiófilo',
    rating: 5.0,
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/1000x1000-000000-80-0-0.jpg',
    description: 'Prensaje original lanzado exclusivamente durante 24 horas en el Black Friday de 2016. Masterizado con amplio rango dinámico y funda gatefold texturizada.',
    deezerId: 344137457,
  },
  {
    id: 'discovery-japan',
    title: 'Discovery (Japanese Gatefold Press)',
    artist: 'Daft Punk',
    year: '2001 / Reissue 2021',
    speed: '33⅓ RPM (2xLP)',
    weight: '180 gramos Virgin Vinyl',
    pressingPlant: 'Sony DADC Japón',
    matrix: 'TOCP-65700',
    rarity: 'Edición Limitada con OBI',
    rating: 4.8,
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg',
    description: 'Vinilo prensado en compuesto de vinilo virgen silencioso con tira OBI de colección y masterización analógica que respeta los transientes del bajo comprimido de 1999-2001.',
    deezerId: 302127,
  }
];

export const VinylCollectionsPage = () => {
  const { playTrack } = usePlayer();
  const [selectedGuide, setSelectedGuide] = useState('gramaje');

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              ARCHIVOS DE ALTA FIDELIDAD & PRENSAJES 180G
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
            Colecciones de Vinilo
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
            Catálogo técnico de prensajes de vinilo de referencia, matrices de corte históricas y manuales de calibración analógica para melómanos exigentes.
          </p>
        </header>

        {/* Guía Interactiva de Calidad Analógica */}
        <section className="mb-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white">
              Guía Técnica del Coleccionista
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGuide('gramaje')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedGuide === 'gramaje'
                    ? 'bg-[#B80C09] text-white'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                140g vs 180g
              </button>
              <button
                onClick={() => setSelectedGuide('velocidad')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedGuide === 'velocidad'
                    ? 'bg-[#B80C09] text-white'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                33⅓ vs 45 RPM
              </button>
              <button
                onClick={() => setSelectedGuide('cuidado')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedGuide === 'cuidado'
                    ? 'bg-[#B80C09] text-white'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                Cuidado & Limpieza
              </button>
            </div>
          </div>

          <div className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
            {selectedGuide === 'gramaje' && (
              <p>
                <strong>¿Por qué 180 gramos?</strong> El gramaje superior no altera directamente la profundidad del surco, pero ofrece mayor estabilidad física contra el alabeo (warping), mejor amortiguación de vibraciones parásitas del plato y una durabilidad prolongada a lo largo de décadas.
              </p>
            )}
            {selectedGuide === 'velocidad' && (
              <p>
                <strong>La ventaja de los 45 RPM:</strong> Al girar un 35% más rápido, la aguja recorre más distancia de vinilo por segundo. Esto permite grabar transientes agudos más limpios y mayor separación estéreo sin distorsión por compresión de surco.
              </p>
            )}
            {selectedGuide === 'cuidado' && (
              <p>
                <strong>Preservación Óptima:</strong> Utiliza fundas interiores de polietileno antiestático (tipo MoFi Archival Sleeves), cepillos de fibra de carbono antes de cada escucha y almacena tus discos siempre en posición vertical, nunca apilados en horizontal.
              </p>
            )}
          </div>
        </section>

        {/* Bóveda de Prensajes de Referencia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VINYL_VAULT_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-lg"
            >
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 shadow-md">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
                    {item.rarity}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#231123] dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] font-semibold mb-4">
                  {item.artist} · {item.year}
                </p>

                {/* Ficha Técnica */}
                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-gray-50 dark:bg-[#231123] text-[11px] mb-4 border border-gray-100 dark:border-white/5">
                  <div>
                    <span className="text-gray-400 block">Velocidad:</span>
                    <strong className="text-[#231123] dark:text-white">{item.speed}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Peso:</span>
                    <strong className="text-[#231123] dark:text-white">{item.weight}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-gray-200 dark:border-white/5">
                    <span className="text-gray-400 block">Planta de Prensado:</span>
                    <strong className="text-[#231123] dark:text-white">{item.pressingPlant}</strong>
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-[#d8c5d3] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() =>
                  playTrack({
                    id: item.deezerId,
                    deezerId: item.deezerId,
                    title: item.title,
                    artist: item.artist,
                    album: item.title,
                    cover: item.cover,
                  })
                }
                className="w-full py-2.5 rounded-xl bg-[#B80C09] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#9c0a07] transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Muestra de Audio</span>
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VinylCollectionsPage;
