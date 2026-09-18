import React from 'react';
import { AnimatedLogo } from '../ui/animated-logo';

export const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#1b0c1b] border-t border-[#e6d5e2] dark:border-white/10 mt-12 transition-colors duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Summary */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AnimatedLogo />
            </div>
            <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] max-w-sm leading-relaxed transition-colors">
              Espacio editorial y red social para melómanos y coleccionistas. Crítica de discos, archivos de vinilo y exploración auditiva de alta fidelidad.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {['podcasts', 'album', 'rss_feed'].map((icon) => (
                <a
                  key={icon}
                  aria-label={icon}
                  className="w-9 h-9 rounded-xl bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center text-[#5c1d5e] dark:text-[#FAF5F8] hover:text-[#B80C09] dark:hover:text-[#B80C09] hover:bg-white dark:hover:bg-[#5d3350] transition-colors shadow-2xs"
                  href={`#${icon}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-[#231123] dark:text-[#FAF5F8] font-bold">
              Plataforma
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] list-none p-0">
              <li className="hover:text-[#B80C09] transition-colors"><a href="#explorar">Explorar Discos</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#reseñas">Críticas del Mes</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#listas">Listas Esenciales</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#comunidad">Comunidad Audiófila</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-[#231123] dark:text-[#FAF5F8] font-bold">
              Recursos
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] list-none p-0">
              <li className="hover:text-[#B80C09] transition-colors"><a href="#colecciones">Colecciones Vinilo</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#api">API para Desarrolladores</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#blog">Blog Sonar</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#directorio">Directorio de Sellos</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-[#231123] dark:text-[#FAF5F8] font-bold">
              Legal & Privacidad
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] list-none p-0">
              <li className="hover:text-[#B80C09] transition-colors"><a href="#privacidad">Privacidad</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#terminos">Términos de Uso</a></li>
              <li className="hover:text-[#B80C09] transition-colors"><a href="#pautas">Pautas Editoriales</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-[#e6d5e2] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-[#81737e] dark:text-[#B89CB0]">
            © 2026 Sonar Audio Media Inc. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#81737e] dark:text-[#B89CB0] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Sonar Engine v2.4 Activo
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
