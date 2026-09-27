import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import { useTranslation } from '../../shared/context/language-context.jsx';

export const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Encabezado */}
        <header className="mb-10 pb-6 border-b border-gray-200 dark:border-white/10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#B80C09] dark:text-[#ff6b68] mb-2 block">
            {t('page.terms.eyebrow')}
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-2"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            {t('page.terms.title')}
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-[#B89CB0]">
            {t('page.terms.updated')}
          </p>
        </header>

        {/* Contenido Legal Estructurado */}
        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
          {/* Sección 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.acceptanceTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.acceptanceText')}
            </p>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.accountsTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.accountsText')}
            </p>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.contentTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.contentIntro')}
            </p>
            <ul className="space-y-2.5 list-disc pl-6 text-gray-600 dark:text-[#B89CB0]">
              <li>
                {t('page.terms.rights')}
              </li>
              <li>
                {t('page.terms.noHate')}
              </li>
              <li>
                {t('page.terms.moderation')}
              </li>
            </ul>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.aiTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.aiText')}
            </p>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.ipTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.ipText')}
            </p>
          </section>

          {/* Sección 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              {t('page.terms.lawTitle')}
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              {t('page.terms.lawText')}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
