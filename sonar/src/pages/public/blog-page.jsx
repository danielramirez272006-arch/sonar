import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

const BLOG_POSTS = [
  {
    id: 'el-arte-de-la-escucha-atenta',
    title: 'El Arte de la Escucha Atenta en la Era del Algoritmo Acelerado',
    date: '21 Septiembre, 2026',
    author: 'Julián Andrade',
    role: 'Editor de Cultura Sónica',
    readTime: '6 min de lectura',
    category: 'Filosofía & Ensayo',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    summary: 'Cómo los algoritmos de recomendación inmediata han erosionado la paciencia auditiva y por qué sentarse a escuchar un disco completo de principio a fin sigue siendo un acto de resistencia cultural.',
    content: `Vivimos en una época dominada por la inmediatez acústica. Las plataformas de streaming masivo han condicionado el cerebro oyente a buscar estímulos en los primeros 5 segundos de una pista. Si un tema no presenta un gancho inmediato, el dedo se desliza inevitablemente hacia el siguiente surco digital.

En Sonar sostenemos la tesis contraria: las obras musicales más trascendentes requieren tiempo de digestión, repetición y silencio contextual. Cuando escuchamos un álbum completo como "In Rainbows" de Radiohead o "Vespertine" de Björk, no estamos consumiendo tracks aislados; estamos recorriendo una dramaturgia sónica planificada meticulosamente por sus creadores.

Recuperar el hábito del álbum como unidad de sentido no solo mejora nuestra apreciación musical, sino que recalibra nuestra capacidad de concentración en un mundo hiperfragmentado.`
  },
  {
    id: 'guia-calibracion-capsula-fonocaptora',
    title: 'Guía Definitiva: Cómo Calibrar la Cápsula Fonocaptora de tu Tocadiscos',
    date: '15 Septiembre, 2026',
    author: 'Valeria Montero',
    role: 'Ingeniera Acústica',
    readTime: '8 min de lectura',
    category: 'Hardware & Audio',
    cover: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&q=80&w=800',
    summary: 'Alineación Baerwald vs Stevenson, ajuste de fuerza de apoyo (VTF), control de anti-skate y calibración del ángulo de seguimiento vertical (VTA) explicados paso a paso.',
    content: `Una aguja mal alineada no solo deteriora la imagen estéreo y genera distorsión sibilante en los agudos, sino que desgasta irreversiblemente las paredes del surco de tus vinilos favoritos.

Para lograr una lectura perfecta:
1. Utiliza una plantilla de alineación (Protractor) de dos puntos.
2. Ajusta el peso de tracking con una báscula digital de precisión (generalmente entre 1.8g y 2.0g según el fabricante).
3. Regula el anti-skating para contrarrestar la fuerza centrípeta que empuja el brazo hacia el centro del plato.

El resultado será un suelo de ruido ultra bajo, una separación instrumental nítida y una respuesta de graves profunda y controlada.`
  },
  {
    id: 'historia-warp-records',
    title: 'Warp Records y la Invención de la Electrónica Inteligente (IDM)',
    date: '08 Septiembre, 2026',
    author: 'Carlos Echeverría',
    role: 'Historiador Musical',
    readTime: '10 min de lectura',
    category: 'Historia Discográfica',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    summary: 'De los almacenes industriales de Sheffield a la vanguardia sonora mundial: la historia de cómo Aphex Twin, Boards of Canada y Autechre redefinieron la música electrónica.',
    content: `A principios de los noventa, la serie "Artificial Intelligence" de Warp Records sentó una premisa audaz: la música electrónica no estaba destinada únicamente a las pistas de baile de los clubes nocturnos, sino a la escucha atenta en la sala de estar.

A través de sintetizadores modulares analógicos y ritmos sincopados matemáticos, Warp construyó un catálogo legendario que sigue influenciando la producción musical tres décadas después.`
  }
];

export const BlogPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              BITÁCORA SÓNICA & PERIODISMO AUDIÓFILO
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#231123] dark:text-white">
            Blog Sonar
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] max-w-2xl mt-2 font-medium">
            Reflexiones sobre cultura musical, guías de hardware analógico de alta fidelidad e historias fascinantes detrás de las mejores grabaciones del canon moderno.
          </p>
        </header>

        {/* Artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedArticle(post)}
              className="flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-md hover:border-[#B80C09]/40 transition-all cursor-pointer group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#B80C09] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#5c435a] dark:text-[#B89CB0] font-semibold mb-2">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#231123] dark:text-white mb-3 group-hover:text-[#B80C09] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#e6d5e2]/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#5c1d5e] dark:text-pink-300">
                <span>Por {post.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Leer completo</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Modal de Lectura Completa */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#B80C09] dark:text-pink-300 font-extrabold uppercase tracking-wider mb-2">
                <span>{selectedArticle.category}</span>
                <span>·</span>
                <span>{selectedArticle.date}</span>
                <span>·</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231123] dark:text-white mb-4 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#B80C09] text-white flex items-center justify-center font-bold text-sm">
                  {selectedArticle.author[0]}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#231123] dark:text-white block">
                    {selectedArticle.author}
                  </span>
                  <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                    {selectedArticle.role}
                  </span>
                </div>
              </div>

              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img
                  src={selectedArticle.cover}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#d8c5d3] whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default BlogPage;
