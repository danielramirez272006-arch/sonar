/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccessibilityProvider, useAccessibility } from '../src/shared/context/accessibility-context';
import { AccessibilityWidget } from '../src/shared/components/a11y/accessibility-widget';
import { KeyboardShortcutsModal } from '../src/shared/components/a11y/keyboard-shortcuts-modal';
import { SkipToContent } from '../src/shared/components/a11y/skip-to-content';
import { TTSButton } from '../src/shared/components/a11y/tts-button';

// Mock Web Speech API
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

class MockUtterance {
  constructor(text) {
    this.text = text;
    this.volume = 1;
    this.rate = 1;
    this.lang = 'es-ES';
  }
}

global.SpeechSynthesisUtterance = MockUtterance;
window.SpeechSynthesisUtterance = MockUtterance;

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
    getVoices: () => [{ lang: 'es-ES', name: 'Spanish Voice' }],
  },
  writable: true,
  configurable: true,
});

describe('SONAR Accessibility System (WCAG 2.1 AA/AAA)', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSpeak.mockClear();
    mockCancel.mockClear();
    document.documentElement.className = '';
  });

  const TestConsumer = () => {
    const { settings, updateSetting, resetAllSettings, announce, isSpeaking, playAudioCue } = useAccessibility();
    return (
      <div>
        <span data-testid="font-size">{settings.fontSize}</span>
        <span data-testid="high-contrast">{String(settings.highContrast)}</span>
        <span data-testid="dyslexic">{String(settings.dyslexicFont)}</span>
        <span data-testid="line-spacing">{settings.lineSpacing}</span>
        <span data-testid="sepia">{String(settings.sepiaMode)}</span>
        <span data-testid="grayscale">{String(settings.grayscaleMode)}</span>
        <span data-testid="reading-guide">{String(settings.readingGuide)}</span>
        <span data-testid="audio-cues">{String(settings.audioCues)}</span>
        <span data-testid="speaking">{String(isSpeaking)}</span>
        <button onClick={() => updateSetting('fontSize', 'large')}>Aumentar Fuente</button>
        <button onClick={() => updateSetting('highContrast', true)}>Activar Contraste</button>
        <button onClick={() => updateSetting('dyslexicFont', true)}>Activar Dislexia</button>
        <button onClick={() => updateSetting('lineSpacing', 'relaxed')}>Espaciado Relajado</button>
        <button onClick={() => updateSetting('sepiaMode', true)}>Activar Sepia</button>
        <button onClick={() => updateSetting('grayscaleMode', true)}>Activar Grayscale</button>
        <button onClick={() => updateSetting('readingGuide', true)}>Activar Guía</button>
        <button onClick={() => updateSetting('audioCues', true)}>Activar Audio Cues</button>
        <button onClick={() => playAudioCue('click')}>Sonar Click</button>
        <button onClick={() => announce('Mensaje accesible de prueba')}>Anunciar</button>
        <button onClick={resetAllSettings}>Restablecer Todo</button>
      </div>
    );
  };

  it('permite cambiar configuraciones de accesibilidad y aplicarlas al elemento raíz', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('font-size').textContent).toBe('normal');
    expect(screen.getByTestId('high-contrast').textContent).toBe('false');

    // Cambiar a fuente grande
    fireEvent.click(screen.getByText('Aumentar Fuente'));
    expect(screen.getByTestId('font-size').textContent).toBe('large');
    expect(document.documentElement.classList.contains('a11y-font-large')).toBe(true);

    // Activar alto contraste
    fireEvent.click(screen.getByText('Activar Contraste'));
    expect(screen.getByTestId('high-contrast').textContent).toBe('true');
    expect(document.documentElement.classList.contains('a11y-high-contrast')).toBe(true);

    // Activar fuente para dislexia
    fireEvent.click(screen.getByText('Activar Dislexia'));
    expect(screen.getByTestId('dyslexic').textContent).toBe('true');
    expect(document.documentElement.classList.contains('a11y-dyslexic-font')).toBe(true);

    // Activar espaciado relajado
    fireEvent.click(screen.getByText('Espaciado Relajado'));
    expect(screen.getByTestId('line-spacing').textContent).toBe('relaxed');
    expect(document.documentElement.classList.contains('a11y-spacing-relaxed')).toBe(true);

    // Activar modo Sepia
    fireEvent.click(screen.getByText('Activar Sepia'));
    expect(screen.getByTestId('sepia').textContent).toBe('true');
    expect(document.documentElement.classList.contains('a11y-sepia-mode')).toBe(true);

    // Activar modo Monocromático
    fireEvent.click(screen.getByText('Activar Grayscale'));
    expect(screen.getByTestId('grayscale').textContent).toBe('true');
    expect(document.documentElement.classList.contains('a11y-grayscale')).toBe(true);

    // Activar Guía de Lectura
    fireEvent.click(screen.getByText('Activar Guía'));
    expect(screen.getByTestId('reading-guide').textContent).toBe('true');

    // Activar Audio Cues y emitir sonido
    fireEvent.click(screen.getByText('Activar Audio Cues'));
    expect(screen.getByTestId('audio-cues').textContent).toBe('true');
    fireEvent.click(screen.getByText('Sonar Click'));

    // Restablecer todo
    fireEvent.click(screen.getByText('Restablecer Todo'));
    expect(screen.getByTestId('font-size').textContent).toBe('normal');
    expect(screen.getByTestId('high-contrast').textContent).toBe('false');
    expect(screen.getByTestId('dyslexic').textContent).toBe('false');
    expect(screen.getByTestId('line-spacing').textContent).toBe('normal');
    expect(screen.getByTestId('sepia').textContent).toBe('false');
    expect(screen.getByTestId('grayscale').textContent).toBe('false');
  });

  it('renderiza el widget flotante de accesibilidad y abre el panel de configuración', () => {
    render(
      <AccessibilityProvider>
        <AccessibilityWidget />
      </AccessibilityProvider>
    );

    const toggleBtn = screen.getByLabelText(/Abrir opciones de accesibilidad/i);
    expect(toggleBtn).toBeTruthy();

    // Abrir panel
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Accesibilidad Universal/i)).toBeTruthy();
    expect(screen.getByText(/Modo Alto Contraste \(AAA\)/i)).toBeTruthy();
    expect(screen.getByText(/Fuente Adaptada para Dislexia/i)).toBeTruthy();
    expect(screen.getByText(/Pausar Animaciones y Giros/i)).toBeTruthy();
  });

  it('renderiza el modal de atajos de teclado y la tecla de acceso rápido', () => {
    const ShortcutsTestWrapper = () => {
      const { toggleShortcutsModal } = useAccessibility();
      return (
        <div>
          <button onClick={toggleShortcutsModal}>Abrir Atajos</button>
          <KeyboardShortcutsModal />
        </div>
      );
    };

    render(
      <AccessibilityProvider>
        <ShortcutsTestWrapper />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByText('Abrir Atajos'));
    expect(screen.getByText('Atajos de Teclado')).toBeTruthy();
    expect(screen.getByText(/Reproducir \/ Pausar muestra de audio activa/i)).toBeTruthy();
    expect(screen.getByText(/Abrir \/ Cerrar Panel de Accesibilidad/i)).toBeTruthy();
  });

  it('el componente SkipToContent enfoca el contenido principal', () => {
    document.body.innerHTML = '<main id="main-content">Contenido</main>';

    render(
      <AccessibilityProvider>
        <SkipToContent targetId="main-content" />
      </AccessibilityProvider>
    );

    const skipLink = screen.getByText('Saltar al contenido principal');
    expect(skipLink).toBeTruthy();

    fireEvent.click(skipLink);
    const main = document.getElementById('main-content');
    expect(main.getAttribute('tabindex') || main.getAttribute('tabIndex')).toBe('-1');
  });

  it('el componente TTSButton ejecuta la síntesis de voz al hacer clic', () => {
    render(
      <AccessibilityProvider>
        <TTSButton text="Esta es una reseña audiófila de prueba" title="In Rainbows" label="Escuchar" />
      </AccessibilityProvider>
    );

    const btn = screen.getByRole('button', { name: /Escuchar/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);
    expect(mockSpeak).toHaveBeenCalled();
  });
});
