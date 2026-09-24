import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'sonar_a11y_settings';

const DEFAULT_SETTINGS = {
  fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
  lineSpacing: 'normal', // 'normal' | 'relaxed' | 'loose'
  readingGuide: false,
  sepiaMode: false,
  grayscaleMode: false,
  highContrast: false,
  colorBlindness: 'none', // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  dyslexicFont: false,
  reducedMotion: false,
  highlightLinks: false,
  bigCursor: false,
  audioCues: false,
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

    // Clases de espaciado de texto e interlineado
    root.classList.remove('a11y-spacing-relaxed', 'a11y-spacing-loose');
    if (settings.lineSpacing === 'relaxed') root.classList.add('a11y-spacing-relaxed');
    if (settings.lineSpacing === 'loose') root.classList.add('a11y-spacing-loose');

    // Modo Sepia / Calidez visual
    if (settings.sepiaMode) {
      root.classList.add('a11y-sepia-mode');
    } else {
      root.classList.remove('a11y-sepia-mode');
    }

    // Modo Escala de Grises / Monocromático
    if (settings.grayscaleMode) {
      root.classList.add('a11y-grayscale');
    } else {
      root.classList.remove('a11y-grayscale');
    }

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

  // Sintetizador Web Audio API para micro-sonidos accesibles (Audio Cues)
  const audioCtxRef = useRef(null);
  const playAudioCue = useCallback(
    (type = 'click') => {
      if (!settings.audioCues || typeof window === 'undefined') return;

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioContextClass();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click' || type === 'toggle') {
          // Sonido sutil tipo pop
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'success' || type === 'like') {
          // Acorde brillante ascendente
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now); // A4
          osc.frequency.setValueAtTime(554.37, now + 0.06); // C#5
          osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'play') {
          // Tono suave armónico
          osc.type = 'sine';
          osc.frequency.setValueAtTime(329.63, now); // E4
          osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.1); // B4
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'alert') {
          // Alerta suave
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.setValueAtTime(220, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        }
      } catch {
        // Ignorar si el navegador bloquea audio antes de interacción
      }
    },
    [settings.audioCues]
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
    playAudioCue,
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
