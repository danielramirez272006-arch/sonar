import React, { useState } from 'react';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import EngineStatusModal from '../ui/engine-status-modal';
import { useAuth } from '../../context/auth-context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/language-context';
import { LanguageSelector } from '../ui/language-selector';

export const Footer = () => {
  const { user } = useAuth() || {};
  const { t } = useTranslation();
  const [isEngineOpen, setIsEngineOpen] = useState(false);

  return (
    <footer className="w-full bg-[#fdf8fb] dark:bg-[#1a0c1a] border-t border-[#e8dbe6] dark:border-white/10 pt-12 pb-8 transition-colors duration-300 text-left">
      <EngineStatusModal isOpen={isEngineOpen} onClose={() => setIsEngineOpen(false)} />

      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Summary con Logo Animado */}
          <div className="lg:col-span-2 flex flex-col gap-2 text-left">
            <div className="mb-3">
              <AnimatedLogo size="sm" onClick={() => { window.location.hash = '#explore'; }} />
            </div>
            <p className="text-[#3c253a] dark:text-[#d8c5d3] max-w-sm leading-relaxed text-sm font-medium">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                aria-label="Podcasts Sonar"
                title="Sesiones y Podcasts Sonar"
                className="w-9 h-9 rounded-xl bg-[#f0e2ee] dark:bg-white/10 border border-[#ddcadb] dark:border-white/10 flex items-center justify-center text-[#231123] dark:text-white hover:text-white hover:bg-[#B80C09] dark:hover:bg-[#B80C09] transition-all shadow-xs"
                href="#podcasts"
              >
                <span className="material-symbols-outlined text-[18px]">podcasts</span>
              </a>
              <a
                aria-label="Modo Tocadiscos Vinilo"
                title="Modo Tocadiscos Inmersivo 33⅓ RPM"
                className="w-9 h-9 rounded-xl bg-[#f0e2ee] dark:bg-white/10 border border-[#ddcadb] dark:border-white/10 flex items-center justify-center text-[#231123] dark:text-white hover:text-white hover:bg-[#B80C09] dark:hover:bg-[#B80C09] transition-all shadow-xs"
                href="#album"
              >
                <span className="material-symbols-outlined text-[18px]">album</span>
              </a>
              <a
                aria-label="Boletín y Feed RSS"
                title="Boletín y Feed RSS Audiófilo"
                className="w-9 h-9 rounded-xl bg-[#f0e2ee] dark:bg-white/10 border border-[#ddcadb] dark:border-white/10 flex items-center justify-center text-[#231123] dark:text-white hover:text-white hover:bg-[#B80C09] dark:hover:bg-[#B80C09] transition-all shadow-xs"
                href="#rss_feed"
              >
                <span className="material-symbols-outlined text-[18px]">rss_feed</span>
              </a>
            </div>
          </div>

          {/* Links Col 1: Plataforma */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs uppercase tracking-wider text-[#231123] dark:text-white font-black">
              {t('footer.platform')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm list-none p-0 m-0">
              <li><a href="#explore" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.explore_discs')}</a></li>
              <li><a href="#reviews" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.reviews_month')}</a></li>
              <li><a href="#lists" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.essential_lists')}</a></li>
              <li><a href="#community" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.community_audiophile')}</a></li>
            </ul>
          </div>

          {/* Links Col 2: Recursos */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs uppercase tracking-wider text-[#231123] dark:text-white font-black">
              {t('footer.resources')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm list-none p-0 m-0">
              <li><a href="#collections" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.collections_vinyl')}</a></li>
              {user?.role === 'admin' && (
                <li>
                  <a href="#api" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors flex items-center gap-1.5">
                    <span>{t('footer.developer_api')}</span>
                    <span className="text-[10px] bg-[#B80C09] text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase">Admin</span>
                  </a>
                </li>
              )}
              <li><a href="#noticias" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.news_radar')}</a></li>
              <li><a href="#blog" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#labels" className="text-[#3c253a] dark:text-[#d8c5d3] hover:text-[#B80C09] dark:hover:text-[#ff6b68] font-semibold transition-colors">{t('footer.record_labels')}</a></li>
            </ul>
          </div>

          {/* Links Col 3: Selector de Idioma Footer */}
          <div className="flex flex-col justify-end gap-3 text-left">
            <LanguageSelector variant="navbar" />
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-[#e8dbe6] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-[#523c50] dark:text-gray-400 font-medium">
            © 2026 Sonar Audio Media Inc. {t('footer.rights')}
          </p>
          <button
            type="button"
            onClick={() => setIsEngineOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0e2ee] dark:bg-white/10 border border-[#ddcadb] dark:border-white/10 text-xs text-[#231123] dark:text-white hover:border-[#B80C09] hover:text-[#B80C09] transition-all cursor-pointer font-bold shadow-xs"
            title="Ver telemetría y estado del sistema"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Sonar Engine v2.4 Activo</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
