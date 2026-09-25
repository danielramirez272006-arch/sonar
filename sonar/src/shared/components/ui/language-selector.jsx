import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/language-context';

export function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { currentLang, changeLanguage, languages, currentLanguageObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'footer') {
    return (
      <div className={`lang-selector-footer ${className}`} ref={dropdownRef}>
        <div className="lang-footer-label">
          <Globe size={16} />
          <span>{currentLanguageObj.flag} {currentLanguageObj.label}</span>
        </div>
        <div className="lang-footer-options">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-option-pill ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => handleSelect(lang.code)}
              aria-label={`Cambiar idioma a ${lang.label}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`lang-selector-container ${variant} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="lang-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Seleccionar idioma / Select language"
      >
        <Globe size={18} className="lang-icon" />
        <span className="lang-flag">{currentLanguageObj.flag}</span>
        <span className="lang-code">{currentLanguageObj.code.toUpperCase()}</span>
        <ChevronDown size={14} className={`lang-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">Idioma / Language</div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-dropdown-item ${currentLang === lang.code ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="lang-item-flag">{lang.flag}</span>
              <span className="lang-item-label">{lang.label}</span>
              {currentLang === lang.code && <Check size={16} className="lang-item-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
