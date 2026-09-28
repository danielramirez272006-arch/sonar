import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { useTranslation } from '../../shared/context/language-context.jsx';

export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Cabecera Principal */}
        <header className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#B80C09] dark:text-[#ff6b68] mb-2 block">
            {t('page.about.eyebrow')}
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-3"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            {t('page.about.title')}
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#5c1d5e] dark:text-pink-300 tracking-tight">
            {t('page.about.subtitle')}
          </p>
        </header>

        {/* Cuerpo del Artículo */}
        <article className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
          <p>
            {t('page.about.intro1')}
          </p>

          <p>
            {t('page.about.intro2')}
          </p>

          {/* Sección de Pilares */}
          <section className="pt-6">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight mb-5"
              style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              {t('page.about.pillars')}
            </h2>

            <ul className="space-y-4 list-none p-0">
              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • {t('page.about.immersiveTitle')}:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  {t('page.about.immersiveText')}
                </span>
              </li>

              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • {t('page.about.curationTitle')}:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  {t('page.about.curationText')}
                </span>
              </li>

              <li className="p-5 rounded-2xl bg-gray-50 dark:bg-[#4B2840]/50 border border-gray-200/80 dark:border-white/10 shadow-xs transition-colors">
                <strong className="text-[#231123] dark:text-white font-bold block text-lg mb-1">
                  • {t('page.about.aiTitle')}:
                </strong>
                <span className="text-gray-600 dark:text-[#B89CB0]">
                  {t('page.about.aiText')}
                </span>
              </li>
            </ul>
          </section>

          {/* Cierre Destacado */}
          <aside className="mt-10 p-6 sm:p-8 rounded-2xl bg-linear-to-r from-[#5c1d5e] to-[#231123] text-white shadow-lg border border-white/10 text-center sm:text-left">
            <p className="text-lg sm:text-xl font-bold leading-relaxed tracking-tight text-white">
              {t('page.about.quote')}
            </p>
          </aside>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
