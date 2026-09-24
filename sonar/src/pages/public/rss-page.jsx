import React, { useState } from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';
import Toast from '../../shared/components/ui/toast';

export const RssPage = () => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setToastMessage(`¡Te has suscrito exitosamente con ${email}! Recibirás el despacho ${frequency === 'weekly' ? 'semanal' : 'mensual'}.`);
    setEmail('');
  };

  const copyRssUrl = () => {
    navigator.clipboard.writeText('https://api.sonar.audio/feed/rss.xml');
    setToastMessage('URL del feed RSS copiada al portapapeles');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80C09] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-black text-[#5c1d5e] dark:text-pink-300">
              DESPACHO AUDIÓFILO & SINCRONIZACIÓN RSS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-3">
            Boletín & Feed RSS
          </h1>
          <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] font-medium">
            Recibe las críticas destacadas, los prensajes en vinilo recién catalogados y los ensayos más leídos directamente en tu correo o lector RSS.
          </p>
        </header>

        {/* Formulario de Suscripción */}
        <section className="p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-lg mb-8 text-left">
          <h2 className="text-xl font-black text-[#231123] dark:text-white mb-2">
            Suscríbete al Despacho Sonar
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed mb-6">
            Cero spam. Solo criterio, análisis de frecuencias analógicas y recomendaciones discográficas seleccionadas por humanos.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@audiophile.com"
                className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm font-medium text-[#231123] dark:text-white focus:outline-none focus:border-[#B80C09]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#B80C09] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#9c0a07] transition-all cursor-pointer shadow-md shrink-0"
              >
                Suscribirme
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#5c435a] dark:text-[#B89CB0]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === 'weekly'}
                  onChange={() => setFrequency('weekly')}
                  className="accent-[#B80C09]"
                />
                <span>Edición Semanal (Viernes de Lanzamientos)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === 'monthly'}
                  onChange={() => setFrequency('monthly')}
                  className="accent-[#B80C09]"
                />
                <span>Compendio Mensual</span>
              </label>
            </div>
          </form>
        </section>

        {/* Enlace RSS Feed Nativo */}
        <section className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs text-left">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#231123] dark:text-white mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B80C09] text-[20px]">rss_feed</span>
                <span>Feed XML / RSS 2.0</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#d8c5d3]">
                Para lectores como Feedly, NetNewsWire o Reeder.
              </p>
            </div>
            <button
              onClick={copyRssUrl}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#231123] hover:bg-[#B80C09] hover:text-white text-xs font-bold text-[#231123] dark:text-white transition-colors cursor-pointer shrink-0"
            >
              Copiar Enlace RSS
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RssPage;
