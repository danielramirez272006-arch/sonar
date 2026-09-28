import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './locales/es.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import { ADMIN_TRANSLATIONS } from './locales/admin-messages.js';
import { PAGE_TRANSLATIONS } from './locales/page-messages.js';
import { UI_TRANSLATIONS } from './locales/ui-messages.js';
import { INTERFACE_TRANSLATIONS } from './locales/interface-messages.js';
import { PROFILE_TRANSLATIONS } from './locales/profile-messages.js';
import { CONTROLS_TRANSLATIONS } from './locales/controls-messages.js';
import { DETAILS_TRANSLATIONS } from './locales/details-messages.js';
import { FAMILY_TRANSLATIONS } from './locales/family-messages.js';
import { STATE_TRANSLATIONS } from './locales/state-messages.js';
import { FEEDBACK_TRANSLATIONS } from './locales/feedback-messages.js';

export const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const TRANSLATIONS = { es, en, zh, fr, it, ja };

const spanishMessages = { ...es, ...ADMIN_TRANSLATIONS.es, ...PAGE_TRANSLATIONS.es };
export const resources = Object.fromEntries(
  Object.entries(TRANSLATIONS).map(([language, base]) => {
    const translation = { ...base, ...ADMIN_TRANSLATIONS[language], ...PAGE_TRANSLATIONS[language] };
    return [language, {
      translation,
      ui: {
        ...Object.fromEntries(Object.entries(spanishMessages).map(([key, source]) => [source, translation[key]])),
        ...UI_TRANSLATIONS[language],
        ...INTERFACE_TRANSLATIONS[language],
        ...PROFILE_TRANSLATIONS[language],
        ...CONTROLS_TRANSLATIONS[language],
        ...DETAILS_TRANSLATIONS[language],
        ...FAMILY_TRANSLATIONS[language],
        ...STATE_TRANSLATIONS[language],
        ...FEEDBACK_TRANSLATIONS[language],
      },
    }];
  }),
);

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'es',
      supportedLngs: LANGUAGES.map(({ code }) => code),
      detection: {
        order: ['localStorage'],
        caches: ['localStorage'],
        lookupLocalStorage: 'sonar_language',
      },
      interpolation: { escapeValue: false },
    });
}

export default i18n;
