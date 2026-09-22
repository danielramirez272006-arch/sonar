import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-sonar-base border-t border-gray-200 dark:border-sonar-surface pt-12 pb-8 transition-colors duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Summary con Logo Público */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <img src="/logo-sonar.svg" alt="Sonar Logo" className="h-8 w-auto mb-4" />
            <p className="text-gray-500 dark:text-sonar-text/80 max-w-sm leading-relaxed text-sm">
              Un espacio para escuchar con atención. Y compartir con criterio. Plataforma dedicada a la crítica musical inmersiva y archivos de vinilo de alta fidelidad.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {['podcasts', 'album', 'rss_feed'].map((icon) => (
                <a
                  key={icon}
                  aria-label={icon}
                  className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-sonar-surface border border-gray-200 dark:border-sonar-surface flex items-center justify-center text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors shadow-2xs"
                  href={`#${icon}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-900 dark:text-sonar-text font-bold">
              Plataforma
            </h4>
            <ul className="flex flex-col gap-2 text-sm list-none p-0">
              <li><a href="#explore" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Explorar Discos</a></li>
              <li><a href="#reviews" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Críticas del Mes</a></li>
              <li><a href="#lists" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Listas Esenciales</a></li>
              <li><a href="#community" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Comunidad Audiófila</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-900 dark:text-sonar-text font-bold">
              Recursos
            </h4>
            <ul className="flex flex-col gap-2 text-sm list-none p-0">
              <li><a href="#collections" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Colecciones Vinilo</a></li>
              <li><a href="#api" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">API para Desarrolladores</a></li>
              <li><a href="#blog" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Blog Sonar</a></li>
              <li><a href="#labels" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Directorio de Sellos</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-900 dark:text-sonar-text font-bold">
              Legal & Privacidad
            </h4>
            <ul className="flex flex-col gap-2 text-sm list-none p-0">
              <li><a href="#about" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Acerca de Sonar</a></li>
              <li><a href="#terms" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Términos de Uso</a></li>
              <li><a href="#guidelines" className="text-gray-700 dark:text-sonar-text hover:text-sonar-alert dark:hover:text-sonar-alert transition-colors">Pautas Editoriales</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-sonar-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-gray-500 dark:text-sonar-text/60">
            © 2026 Sonar Audio Media Inc. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-sonar-text/70 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Sonar Engine v2.4 Activo
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
