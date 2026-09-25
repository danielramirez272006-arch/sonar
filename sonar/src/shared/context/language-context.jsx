import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGES } from '../config/i18n';

export { LANGUAGES, useTranslation };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { t, i18n: i18nInstance } = useTranslation();

  const currentLang = (i18nInstance.language || 'es').split('-')[0];

  const changeLanguage = (langCode) => {
    i18nInstance.changeLanguage(langCode);
    localStorage.setItem('sonar_language', langCode);
    document.documentElement.lang = langCode;
    window.dispatchEvent(new CustomEvent('sonar:language-changed', { detail: langCode }));
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const currentLanguageObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        changeLanguage,
        t,
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

