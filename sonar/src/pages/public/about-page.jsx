import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Cabecera Principal */}
        <header className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#B80C09] dark:text-[#ff6b68] mb-2 block">
            MANIFIESTO SONAR
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-3"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Acerca de Sonar
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#5c1d5e] dark:text-pink-300 tracking-tight">
            La música nos reúne. El criterio nos define.
          </p>
        </header>

        {/* Cuerpo del Artículo */}
        <article className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
          <p>
            Sonar nació de una premisa fundamental: escuchar música es una experiencia universal, pero entenderla es un arte. Somos una plataforma social diseñada específicamente para audiófilos, críticos y exploradores sonoros que buscan ir más allá de la superficie de un álbum.
          </p>

          <p>
            Nuestra misión es revolucionar la crítica musical inmersiva. A diferencia de las plataformas tradicionales que se limitan a calificaciones numéricas, Sonar combina la sensibilidad de la curaduría humana con el poder analítico de la inteligencia artificial. Esta sinergia permite desglosar contextos históricos, texturas sonoras y análisis líricos profundos, entregando a nuestra comunidad una comprensión tridimensional de cada obra.
          </p>

          {/* Sección de Pilares */}
          <section className="pt-6">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight mb-5"
              style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Lo que nos define
            </h2>

            <ul className="space-y-4 list-none p-0">
              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • Crítica Inmersiva:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  Un espacio donde las reseñas no son simples opiniones, sino ensayos sonoros estructurados y respetados por la comunidad.
                </span>
              </li>

              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • Curaduría Especializada:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  Herramientas diseñadas para archivar, categorizar y descubrir música con un nivel de detalle pensado para verdaderos coleccionistas digitales.
                </span>
              </li>

              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • Análisis Impulsado por IA:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  Tecnología de vanguardia que asiste a nuestros usuarios desentrañando el contexto lírico, las influencias musicales y la complejidad técnica detrás de sus canciones favoritas.
                </span>
              </li>
            </ul>
          </section>

          {/* Cierre Destacado */}
          <aside className="mt-10 p-6 sm:p-8 rounded-2xl bg-linear-to-r from-[#5c1d5e] to-[#231123] text-white shadow-lg border border-white/10 text-center sm:text-left">
            <p className="text-lg sm:text-xl font-bold leading-relaxed tracking-tight text-white">
              «En Sonar, creemos que cada álbum tiene una historia. Nosotros construimos el espacio para que tú la cuentes.»
            </p>
          </aside>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
