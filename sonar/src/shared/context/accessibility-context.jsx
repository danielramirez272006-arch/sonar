import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'sonar_a11y_settings';

const DEFAULT_SETTINGS = {
  fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
  highContrast: false,
  colorBlindness: 'none', // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  dyslexicFont: false,
  reducedMotion: false,
  highlightLinks: false,
  bigCursor: false,
  ttsVolume: 1,
  ttsRate: 1,
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isA11yWidgetOpen, setIsA11yWidgetOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState({ message: '', priority: 'polite' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');

  const utteranceRef = useRef(null);

  // Persistir configuraciones en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignorar errores de cuota de storage
    }
  }, [settings]);

  // Aplicar clases de accesibilidad en document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Clases de tamaño de fuente
    root.classList.remove('a11y-font-large', 'a11y-font-xlarge');
    if (settings.fontSize === 'large') root.classList.add('a11y-font-large');
    if (settings.fontSize === 'xlarge') root.classList.add('a11y-font-xlarge');

    // Alto contraste
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Fuente para dislexia
    if (settings.dyslexicFont) {
      root.classList.add('a11y-dyslexic-font');
    } else {
      root.classList.remove('a11y-dyslexic-font');
    }

    // Reducción de movimiento
    if (settings.reducedMotion) {
      root.classList.add('a11y-reduced-motion');
    } else {
      root.classList.remove('a11y-reduced-motion');
    }

    // Resaltado de enlaces
    if (settings.highlightLinks) {
      root.classList.add('a11y-highlight-links');
    } else {
      root.classList.remove('a11y-highlight-links');
    }

    // Cursor grande
    if (settings.bigCursor) {
      root.classList.add('a11y-big-cursor');
    } else {
      root.classList.remove('a11y-big-cursor');
    }

    // Filtros de daltonismo
    root.classList.remove(
      'a11y-cb-protanopia',
      'a11y-cb-deuteranopia',
      'a11y-cb-tritanopia',
      'a11y-cb-achromatopsia'
    );
    if (settings.colorBlindness !== 'none') {
      root.classList.add(`a11y-cb-${settings.colorBlindness}`);
    }
  }, [settings]);

  // Manejo de atajos globales de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

      // Alt + A: Abrir/Cerrar Panel de Accesibilidad
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsA11yWidgetOpen((prev) => !prev);
        return;
      }

      // Escape: Cerrar modales de accesibilidad si están abiertos
      if (e.key === 'Escape') {
        if (isA11yWidgetOpen) setIsA11yWidgetOpen(false);
        if (isShortcutsModalOpen) setIsShortcutsModalOpen(false);
        if (isSpeaking) stopSpeaking();
        return;
      }

      // ? o Shift + / (fuera de inputs): Guía de Atajos
      if (!isInputActive && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isA11yWidgetOpen, isShortcutsModalOpen, isSpeaking]);

  // Actualizador genérico de configuración
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAllSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    announce('Se han restablecido todas las opciones de accesibilidad a los valores por defecto.');
  }, []);

  // Anunciador ARIA Live
  const announce = useCallback((message, priority = 'polite') => {
    setAriaAnnouncement({ message, priority });
    // Limpiar anuncio después de 4 segundos
    setTimeout(() => {
      setAriaAnnouncement((prev) => (prev.message === message ? { message: '', priority: 'polite' } : prev));
    }, 4000);
  }, []);

  // Text-To-Speech (Lectura por Voz)
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpeakingText('');
  }, []);

  const speak = useCallback(
    (text, title = '') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        announce('Tu navegador no soporta síntesis de voz.');
        return;
      }

      // Si ya está leyendo este mismo texto, pausar/detener
      if (isSpeaking && currentSpeakingText === text) {
        stopSpeaking();
        return;
      }

      window.speechSynthesis.cancel();

      // Limpiar texto para lectura óptima (quitar markdown, enlaces raros, emojis)
      const cleanText = text
        .replace(/[#*`_~]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/["“”]/g, '"')
        .trim();

      if (!cleanText) return;

      const fullMessage = title ? `${title}. ${cleanText}` : cleanText;
      const utterance = new SpeechSynthesisUtterance(fullMessage);
      utteranceRef.current = utterance;

      utterance.volume = settings.ttsVolume ?? 1;
      utterance.rate = settings.ttsRate ?? 1;
      utterance.lang = 'es-ES';

      // Buscar voz en español si está disponible
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find((v) => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingText('');
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentSpeakingText('');
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSpeaking, currentSpeakingText, settings.ttsVolume, settings.ttsRate, stopSpeaking, announce]
  );

  const value = {
    settings,
    updateSetting,
    resetAllSettings,
    isA11yWidgetOpen,
    setIsA11yWidgetOpen,
    toggleA11yWidget: () => setIsA11yWidgetOpen((prev) => !prev),
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    toggleShortcutsModal: () => setIsShortcutsModalOpen((prev) => !prev),
    ariaAnnouncement,
    announce,
    speak,
    stopSpeaking,
    isSpeaking,
    currentSpeakingText,
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
