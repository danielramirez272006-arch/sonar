import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { usePlayer } from '../../shared/context/player-context';

const RECORD_LABELS = [
  {
    id: 'warp-records',
    name: 'Warp Records',
    founded: '1989',
    country: 'Sheffield / Londres, Reino Unido',
    genres: ['IDM', 'Electrónica Experimental', 'Art Rock'],
    description: 'Pioneros del sonido electrónico de vanguardia. Casa de artistas revolucionarios como Aphex Twin, Boards of Canada, Flying Lotus y Battles.',
    logoColor: '#8015ea',
    catalogsCount: 650,
    flagshipAlbums: [
      { id: 14880659, title: 'Geogaddi', artist: 'Boards of Canada', year: '2002', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' },
      { id: 10709540, title: 'Selected Ambient Works', artist: 'Aphex Twin', year: '1992', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: '4ad',
    name: '4AD',
    founded: '1980',
    country: 'Londres, Reino Unido',
    genres: ['Post-Punk', 'Dream Pop', 'Art Rock'],
    description: 'El sello que definió la estética etérea del Dream Pop y el Post-Punk británico. Hogar de Cocteau Twins, Pixies, The National y Big Thief.',
    logoColor: '#0284c7',
    catalogsCount: 480,
    flagshipAlbums: [
      { id: 537883642, title: 'Heaven or Las Vegas', artist: 'Cocteau Twins', year: '1990', cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
      { id: 344137457, title: 'Doolittle', artist: 'Pixies', year: '1989', cover: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'blue-note',
    name: 'Blue Note Records',
    founded: '1939',
    country: 'Nueva York, Estados Unidos',
    genres: ['Hard Bop', 'Modal Jazz', 'Soul Jazz'],
    description: 'El sello de jazz más legendario de la historia. Famoso por la impecable ingeniería de sonido de Rudy Van Gelder y el diseño gráfico de Reid Miles.',
    logoColor: '#2563eb',
    catalogsCount: 1200,
    flagshipAlbums: [
      { id: 9896728, title: 'Blue Train', artist: 'John Coltrane', year: '1957', cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
      { id: 302127, title: 'Maiden Voyage', artist: 'Herbie Hancock', year: '1965', cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'ninja-tune',
    name: 'Ninja Tune',
    founded: '1990',
    country: 'Londres, Reino Unido',
    genres: ['Trip-Hop', 'Nu-Jazz', 'Breakbeat'],
    description: 'Fundado por Coldcut como un bastión de independencia creativa y sampleo de vanguardia. Casa de Bonobo, Bicep y The Cinematic Orchestra.',
    logoColor: '#d97706',
    catalogsCount: 520,
    flagshipAlbums: [
      { id: 10709540, title: 'Black Sands', artist: 'Bonobo', year: '2010', cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg' }
    ]
  }
];

export const RecordLabelsPage = () => {
  const { playTrack } = usePlayer();
  const [selectedLabel, setSelectedLabel] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              DISCOGRÁFICAS DE CULTO & CASAS EDITORIALES
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
            Directorio de Sellos
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
            Explora las identidades sonoras, filosofías analógicas y discografías de los sellos independientes que moldearon la historia de la música contemporánea.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RECORD_LABELS.map((label) => (
            <motion.div
              key={label.id}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
                      style={{ backgroundColor: label.logoColor }}
                    >
                      {label.name[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#231123] dark:text-white">
                        {label.name}
                      </h3>
                      <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                        Fundado en {label.founded} · {label.country}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#231123] text-xs font-bold text-[#5c1d5e] dark:text-pink-300">
                    {label.catalogsCount}+ LPs
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {label.genres.map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-0.5 rounded-md bg-[#f8e9f6] dark:bg-[#231123] text-[11px] font-bold text-[#5c1d5e] dark:text-pink-200"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 dark:text-[#d8c5d3] leading-relaxed mb-6">
                  {label.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  Catálogo disponible en Sonar
                </span>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#explore';
                  }}
                  className="px-4 py-2 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Explorar Discos
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecordLabelsPage;
