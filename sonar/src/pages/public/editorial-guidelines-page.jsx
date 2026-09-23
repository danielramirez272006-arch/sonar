import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const EditorialGuidelinesPage = () => {
  const ratingScale = [
    { stars: '5.0', label: 'Obra Maestra Incontestable', desc: 'Producción revolucionaria, cohesión conceptual impecable y relevancia histórica que trasciende su época.' },
    { stars: '4.0 - 4.9', label: 'Excelente / Imprescindible', desc: 'Álbum sobresaliente con musicalidad de alto calibre y gran balance estético con mínimas fisuras.' },
    { stars: '3.0 - 3.9', label: 'Notable / Recomendado', desc: 'Trabajo sólido con momentos brillantes, aunque con cierta inconsistencia en el orden de pistas o mezcla.' },
    { stars: '2.0 - 2.9', label: 'Mediocre / Derivativo', desc: 'Falta de originalidad conceptual, problemas evidentes en la masterización o ejecución compositiva pobre.' },
    { stars: '1.0 - 1.9', label: 'Deficiente / Fallido', desc: 'Producción defectuosa, carencia de intención artística clara o ejecución desprovista de criterio.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <header className="border-b border-[#e6d5e2] dark:border-white/10 pb-8 mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#B80C09] dark:text-[#ff6b68] mb-2 block">
            CÓDIGO DE CRITERIO & ESTÁNDARES AUDIÓFILOS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-3">
            Pautas Editoriales
          </h1>
          <p className="text-base sm:text-lg text-[#5c1d5e] dark:text-pink-300 font-bold">
            La crítica en Sonar no es un desahogo de opinión, sino un ejercicio de apreciación estética fundamentada.
          </p>
        </header>

        <article className="space-y-10 text-left">
          {/* Escala de Puntuación */}
          <section>
            <h2 className="text-2xl font-black text-[#231123] dark:text-white mb-5">
              1. Escala Oficial de Puntuación Sonar
            </h2>
            <div className="space-y-3">
              {ratingScale.map((item) => (
                <div
                  key={item.stars}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-[#B80C09] text-white font-mono font-black text-sm shrink-0">
                      ★ {item.stars}
                    </span>
                    <strong className="text-base font-bold text-[#231123] dark:text-white">
                      {item.label}
                    </strong>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] max-w-md">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Principios de Redacción */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#231123] dark:text-white mb-4">
              2. Principios Fundamentales para Escribir una Crítica
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <h3 className="text-base font-bold text-[#231123] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B80C09] text-[20px]">graphic_eq</span>
                  <span>Análisis de Producción</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed">
                  Evalúa la espacialidad estéreo, la dinámica de volumen, la compresión y la fidelidad del timbre analógico o digital.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <h3 className="text-base font-bold text-[#231123] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B80C09] text-[20px]">history_edu</span>
                  <span>Contexto Histórico</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed">
                  Sitúa el disco dentro de la trayectoria del artista y el momento sociocultural en que fue concebido.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <h3 className="text-base font-bold text-[#231123] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B80C09] text-[20px]">psychology</span>
                  <span>Rigor Argumentativo</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed">
                  Evita frases vacías como "no me gustó". Explica qué elementos armónicos, rítmicos o líricos fallan o destacan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs">
                <h3 className="text-base font-bold text-[#231123] dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B80C09] text-[20px]">verified_user</span>
                  <span>Tolerancia Cero a la Toxicidad</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#d8c5d3] leading-relaxed">
                  Los ataques personales o discriminatorios hacia artistas o miembros de la comunidad resultan en la suspensión inmediata de la cuenta.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default EditorialGuidelinesPage;
