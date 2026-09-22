import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Encabezado */}
        <header className="mb-10 pb-6 border-b border-gray-200 dark:border-white/10">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#B80C09] dark:text-[#ff6b68] mb-2 block">
            MARCO LEGAL Y CONVIVENCIA
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#231123] dark:text-white mb-2"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-[#B89CB0]">
            Última actualización: Septiembre de 2026
          </p>
        </header>

        {/* Contenido Legal Estructurado */}
        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-[#d8c5d3]">
          {/* Sección 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Bienvenido a Sonar. Al acceder, registrarte o utilizar nuestros servicios de curaduría, análisis y reseñas musicales, aceptas estar legalmente vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de este contrato, te solicitamos que no utilices nuestros servicios.
            </p>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              2. Cuentas y Seguridad del Usuario
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Para interactuar con la comunidad, deberás crear una cuenta. Eres el único responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades que ocurran bajo tu perfil. Sonar se reserva el derecho de suspender o cancelar cuentas que violen nuestros lineamientos de seguridad o provean información fraudulenta.
            </p>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              3. Contenido Generado por el Usuario y Moderación
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Sonar fomenta el debate crítico y la pasión por la música. Sin embargo, nos regimos por un estándar estricto de moderación comunitaria y respeto recíproco:
            </p>
            <ul className="space-y-2.5 list-disc pl-6 text-gray-600 dark:text-[#B89CB0]">
              <li>
                Conservas los derechos de autor sobre las reseñas que publicas, pero otorgas a Sonar una licencia global para mostrarlas;
              </li>
              <li>
                Está estrictamente prohibido publicar contenido de odio o que infrinja el copyright;
              </li>
              <li>
                Nuestro equipo editorial y nuestros sistemas automatizados se reservan el derecho de ocultar o eliminar reseñas que incumplan estos estándares sin previo aviso.
              </li>
            </ul>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              4. Uso de la Inteligencia Artificial
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Las funcionalidades de análisis lírico y contextual de Sonar son impulsadas por motores de inteligencia artificial. Aunque nos esforzamos por mantener la más alta precisión, los resultados generados por IA se proporcionan "tal cual" y con fines puramente analíticos y de entretenimiento. Sonar no garantiza la exactitud absoluta de las interpretaciones generadas por estos modelos.
            </p>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              5. Propiedad Intelectual
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Todo el diseño de la plataforma, logotipos, código fuente (incluyendo la arquitectura Feature-Sliced), interfaces y textos estructurales son propiedad exclusiva de Sonar. Las portadas de los álbumes se utilizan bajo el principio de "Uso Justo" (Fair Use) exclusivamente para fines de crítica y catalogación.
            </p>
          </section>

          {/* Sección 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#231123] dark:text-white tracking-tight">
              6. Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-gray-600 dark:text-[#B89CB0]">
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la República de Costa Rica. Cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales competentes en dicho territorio.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
