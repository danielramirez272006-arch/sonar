import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGES } from '../config/i18n';

export { LANGUAGES, useTranslation };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => (i18nInstance?.language || 'es').split('-')[0]);

  const changeLanguage = (langCode) => {
    i18nInstance?.changeLanguage(langCode);
    setCurrentLang(langCode);
    localStorage.setItem('sonar_language', langCode);
    document.documentElement.lang = langCode;
    window.dispatchEvent(new CustomEvent('sonar:language-changed', { detail: langCode }));
  };

  useEffect(() => {
    if (!i18nInstance) return;
    const handleLngChanged = (lng) => {
      const code = (lng || 'es').split('-')[0];
      setCurrentLang(code);
      document.documentElement.lang = code;
    };
    i18nInstance.on('languageChanged', handleLngChanged);
    return () => {
      i18nInstance.off('languageChanged', handleLngChanged);
    };
  }, [i18nInstance]);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const currentLanguageObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        changeLanguage,
        t: t || ((key, fallback) => (typeof fallback === 'string' ? fallback : key)),
        languages: LANGUAGES,
        currentLanguageObj,
        i18n: i18nInstance,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    const lang = (i18n.language || 'es').split('-')[0];
    return {
      currentLang: lang,
      changeLanguage: (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('sonar_language', code);
        document.documentElement.lang = code;
        window.dispatchEvent(new CustomEvent('sonar:language-changed', { detail: code }));
      },
      t: (key, fallback) => {
        const result = i18n.t(key, typeof fallback === 'string' ? { defaultValue: fallback } : fallback);
        return result || (typeof fallback === 'string' ? fallback : key);
      },
      languages: LANGUAGES,
      currentLanguageObj: LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
      i18n,
    };
  }
  return context;
}

