import { useUIText } from '../../i18n/use-ui-text.js';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../../context/accessibility-context';
import { LanguageSelector } from '../ui/language-selector';

export const AccessibilityWidget = () => {
  const ui = useUIText();
  const {
    settings,
    updateSetting,
    resetAllSettings,
    isA11yWidgetOpen,
    setIsA11yWidgetOpen,
    toggleA11yWidget,
    toggleShortcutsModal,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    isSpeechPaused,
  } = useAccessibility();

  const colorBlindOptions = [
    { id: 'none', label: 'Estándar' },
    { id: 'protanopia', label: 'Protanopía (Rojo)' },
    { id: 'deuteranopia', label: 'Deuteranopía (Verde)' },
    { id: 'tritanopia', label: 'Tritanopía (Azul)' },
    { id: 'achromatopsia', label: 'Monocromático' },
  ];

  const readCurrentPage = () => {
    const mainContent = document.querySelector('main, [role="main"]') || document.body;
    const readableContent = mainContent.cloneNode(true);
    readableContent.querySelectorAll('script, style, nav, button, input, textarea, select, [aria-hidden="true"], [data-speech-ignore]').forEach((element) => element.remove());
    readableContent.querySelectorAll('.material-symbols-outlined, [aria-hidden="true"]').forEach((element) => element.remove());
    readableContent.querySelectorAll('img').forEach((image) => {
      const alternativeText = image.getAttribute('alt')?.trim();
      if (alternativeText) image.replaceWith(document.createTextNode(` ${alternativeText} `));
      else image.remove();
    });
    readableContent.querySelectorAll('[aria-label]').forEach((element) => {
      if (!element.textContent.trim()) element.textContent = element.getAttribute('aria-label');
    });
    const pageText = readableContent.innerText || readableContent.textContent || '';
    const normalizedText = pageText.replace(/\s+/g, ' ').trim();

    if (!normalizedText) {
      speak(ui('No se encontró contenido para leer.'));
      return;
    }

    speak(normalizedText, document.title);
  };

  return (
    <>
      {/* Pestaña lateral discreta en el borde izquierdo (100% libre del reproductor inferior) */}
      <button
        type="button"
        onClick={toggleA11yWidget}
        aria-label={ui("Abrir opciones de accesibilidad (Atajo: Alt + A)")}
        title={ui("Opciones de Accesibilidad (Alt + A)")}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-[9990] pl-2 pr-2.5 py-3 rounded-r-2xl bg-[#231123]/90 hover:bg-[#B80C09] text-white backdrop-blur-md shadow-xl border-y border-r border-white/20 transition-all duration-300 hover:translate-x-1 cursor-pointer group focus:outline-2 focus:outline-[#B80C09]"
      >
        <span className="material-symbols-outlined text-[20px] text-[#B80C09] group-hover:text-white transition-colors">
          accessibility_new
        </span>
        <span className="sr-only">{ui("Opciones de Accesibilidad")}</span>
      </button>

      {/* Modal / Panel de Accesibilidad */}
      <AnimatePresence>
        {isA11yWidgetOpen && (
          <div className="fixed inset-0 z-[99995] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-title"
              className="w-full max-w-xl min-w-0 bg-white dark:bg-[#2e192c] text-[#231123] dark:text-[#FAF5F8] rounded-3xl border border-[#e6d5e2] dark:border-white/15 shadow-2xl p-4 sm:p-7 overflow-hidden relative max-h-[90dvh] flex flex-col"
            >
              {/* Encabezado */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e6d5e2] dark:border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#B80C09] text-white flex items-center justify-center font-bold shadow-md">
                    <span className="material-symbols-outlined text-[24px]">accessibility_new</span>
                  </div>
                  <div>
                        <h2 id="a11y-title" className="text-lg sm:text-2xl font-black tracking-tight flex flex-wrap items-center gap-2">{ui("Accesibilidad Universal")}<span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B80C09]/15 text-[#B80C09] font-extrabold">
                        WCAG 2.1
                      </span>
                    </h2>
                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Personaliza el contraste, tipografía, audio y lectura para tu comodidad.")}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsA11yWidgetOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={ui("Cerrar panel de accesibilidad")}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Contenido con Scroll */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 text-sm">
                
                {/* SECCIÓN 1: Tipografía y Lectura */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>{ui("Lectura y Tipografía")}</h3>

                  {/* 1.1 Tamaño del Texto */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#B80C09]">format_size</span>{ui("Tamaño de la interfaz")}</span>
                      <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                        {settings.fontSize === 'normal' ? '100%' : settings.fontSize === 'large' ? '112%' : '122%'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'normal', label: 'A (Normal)' },
                        { id: 'large', label: 'A+ (Grande)' },
                        { id: 'xlarge', label: 'A++ (Extra)' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateSetting('fontSize', opt.id)}
                          aria-pressed={settings.fontSize === opt.id}
                          className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            settings.fontSize === opt.id
                              ? 'bg-[#B80C09] text-white shadow-md'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {ui(opt.label)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div role="group" aria-labelledby="a11y-text-only-title" className="a11y-text-control p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <h4 id="a11y-text-only-title" className="a11y-text-control-title">{ui('Solo tamaño de las letras')}</h4>
                    <p className="text-sm mb-3">{ui('Agranda las letras sin ampliar las imágenes ni la interfaz.')}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['normal', 'large', 'xlarge'].map((size, index) => <button
                        key={size} type="button" aria-pressed={settings.textOnlySize === size}
                        onClick={() => updateSetting('textOnlySize', size)}
                        className={`min-h-11 px-2 py-2 rounded-xl text-sm font-bold ${settings.textOnlySize === size ? 'bg-[#B80C09] text-white' : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10'}`}
                      >{['100%', '115%', '130%'][index]}</button>)}
                    </div>
                  </div>

                  {/* 1.2 Espaciado de Líneas (Interlineado WCAG 1.4.12) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-indigo-500">format_line_spacing</span>{ui("Interlineado y Espaciado")}</span>
                      <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                        {settings.lineSpacing === 'normal' ? ui("Estándar") : settings.lineSpacing === 'relaxed' ? ui("Relajado") : ui("Amplio")}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'normal', label: 'Estándar' },
                        { id: 'relaxed', label: 'Relajado (1.8x)' },
                        { id: 'loose', label: 'Amplio (2.2x)' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateSetting('lineSpacing', opt.id)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            settings.                            lineSpacing === opt.id
                              ? 'bg-[#B80C09] text-white shadow-xs'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {ui(opt.label)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1.3 Guía de Lectura Visual (Reading Mask) */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-amber-500">chrome_reader_mode</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Guía de Enfoque / Regla de Lectura")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Barra horizontal de seguimiento para no perder la línea al leer")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.readingGuide}
                      onChange={(e) => updateSetting('readingGuide', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 1.4 Tipografía para Dislexia */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-blue-500">font_download</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Fuente Adaptada para Dislexia")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Mayor espaciado entre letras y palabras para evitar confusión visual")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dyslexicFont}
                      onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* SECCIÓN 2: Visión, Confort y Contraste */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>{ui("Visión y Contraste")}</h3>

                  {/* 2.1 Alto Contraste */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-amber-500">contrast</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Modo Alto Contraste (AAA)")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Fondo negro absoluto con bordes y tipografía de máxima visibilidad")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => updateSetting('highContrast', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 2.2 Modo Sepia / Calidez Visual */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-orange-400">wb_sunny</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Modo Sepia / Calidez Visual")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Filtro cálido relajante contra la fatiga visual y luz azul")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sepiaMode}
                      onChange={(e) => updateSetting('sepiaMode', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 2.3 Modo Escala de Grises */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-gray-400">filter_b_and_w</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Modo Monocromático (Escala de Grises)")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Elimina la saturación para una experiencia visual de bajo estímulo")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.grayscaleMode}
                      onChange={(e) => updateSetting('grayscaleMode', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 2.4 Resaltado de Enlaces */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-purple-500">link</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Resaltar Elementos Interactivos")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Distingue botones, enlaces y campos con bordes llamativos")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.highlightLinks}
                      onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 2.5 Cursor Grande */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-rose-500">near_me</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Puntero / Cursor Agrandado")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Aumenta el tamaño del ratón para no perder el foco")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bigCursor}
                      onChange={(e) => updateSetting('bigCursor', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 2.6 Filtros para Daltonismo */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                    <span className="font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#B80C09]">palette</span>{ui("Filtros para Daltonismo")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {colorBlindOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateSetting('colorBlindness', opt.id)}
                          className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                            settings.colorBlindness === opt.id
                              ? 'bg-[#B80C09] text-white shadow-xs'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-[#B80C09]/40'
                          }`}
                        >
                          <span>{ui(opt.label)}</span>
                          {settings.colorBlindness === opt.id && (
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: Audio, Movimiento y Voz */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>{ui("Audio, Movimiento y Asistencia")}</h3>

                  {/* 3.1 Micro-sonidos de Navegación (Audio Cues) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-teal-500">graphic_eq</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Micro-Sonidos de Navegación (Audio Cues)")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Tonos sutiles al interactuar con botones, favoritos y reproductor")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.audioCues}
                      onChange={(e) => updateSetting('audioCues', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </div>

                  {/* 3.2 Reducción de Animaciones */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-emerald-500">motion_photos_off</span>
                      <div>
                        <div className="font-bold text-sm">{ui("Pausar Animaciones y Giros")}</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Para personas con sensibilidad vestibular o mareos por movimiento")}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 3.3 Lectura completa de la página y síntesis de voz */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#B80C09]">record_voice_over</span>{ui("Lectura de toda la página")}</span>
                    </div>
                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">{ui("Lee el contenido principal en el idioma seleccionado. La lectura comienza cuando tú la activas.")}</p>
                    {isSpeaking && <p className="text-xs font-semibold text-[#5c1d5e] dark:text-pink-200" role="status" aria-live="polite">{ui(isSpeechPaused ? 'Lectura pausada' : 'Lectura en curso')}</p>}
                    <div className="a11y-reader__actions">
                      {!isSpeaking && <button type="button" onClick={readCurrentPage} className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold bg-[#B80C09] text-white hover:bg-[#960a07] cursor-pointer">
                        <span className="material-symbols-outlined text-[14px] align-middle mr-1">volume_up</span>{ui("Leer página")}
                      </button>}
                      {isSpeaking && !isSpeechPaused && <button type="button" onClick={pauseSpeaking} className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 cursor-pointer">{ui("Pausar")}</button>}
                      {isSpeaking && isSpeechPaused && <button type="button" onClick={resumeSpeaking} className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 cursor-pointer">{ui("Continuar")}</button>}
                      {isSpeaking && <button type="button" onClick={stopSpeaking} className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 cursor-pointer">{ui("Detener lectura")}</button>}
                    </div>
                    <div className="a11y-reader__speed">
                      <span>{ui("Velocidad de Lectura:")} {isSpeaking && ui("Detén la lectura para cambiar la velocidad.")}</span>
                      <div className="a11y-reader__speed-options" role="group" aria-label={ui("Velocidad de Lectura:")}>
                        {[0.8, 1, 1.25].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            aria-pressed={settings.ttsRate === rate}
                            disabled={isSpeaking}
                            onClick={() => updateSetting('ttsRate', rate)}
                            className={`min-h-11 px-3 rounded-lg font-bold cursor-pointer ${
                              settings.ttsRate === rate
                                ? 'bg-[#B80C09] text-white'
                                : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10'
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 4: Idioma y Región / Language & Region */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">translate</span>{ui("Idioma y Región / Language & Region")}</h3>
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2">
                    <div className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">{ui("Selecciona tu idioma preferido para la interfaz, navegación y controles:")}</div>
                    <LanguageSelector variant="footer" />
                  </div>
                </div>

              </div>

              {/* Pie de Panel con Restablecer y Atajos */}
              <div className="pt-4 border-t border-[#e6d5e2] dark:border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleShortcutsModal}
                  className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">keyboard</span>
                  <span>{ui("Ver Atajos de Teclado (?)")}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAllSettings}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-[#B80C09] transition-colors cursor-pointer"
                  >{ui("Restablecer")}</button>

                  <button
                    type="button"
                    onClick={() => setIsA11yWidgetOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#B80C09] text-white text-xs font-bold hover:bg-[#960a07] transition-colors cursor-pointer"
                  >{ui("Guardar y Cerrar")}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityWidget;
