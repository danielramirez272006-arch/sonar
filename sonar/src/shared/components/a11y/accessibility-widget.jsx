import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../../context/accessibility-context';

export const AccessibilityWidget = () => {
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
    isSpeaking,
  } = useAccessibility();

  const colorBlindOptions = [
    { id: 'none', label: 'Estándar' },
    { id: 'protanopia', label: 'Protanopía (Rojo)' },
    { id: 'deuteranopia', label: 'Deuteranopía (Verde)' },
    { id: 'tritanopia', label: 'Tritanopía (Azul)' },
    { id: 'achromatopsia', label: 'Monocromático' },
  ];

  return (
    <>
      {/* Pestaña lateral discreta en el borde izquierdo (100% libre del reproductor inferior) */}
      <button
        type="button"
        onClick={toggleA11yWidget}
        aria-label="Abrir opciones de accesibilidad (Atajo: Alt + A)"
        title="Opciones de Accesibilidad (Alt + A)"
        className="fixed top-1/2 -translate-y-1/2 left-0 z-[9990] pl-2 pr-2.5 py-3 rounded-r-2xl bg-[#231123]/90 hover:bg-[#B80C09] text-white backdrop-blur-md shadow-xl border-y border-r border-white/20 transition-all duration-300 hover:translate-x-1 cursor-pointer group focus:outline-2 focus:outline-[#B80C09]"
      >
        <span className="material-symbols-outlined text-[20px] text-[#B80C09] group-hover:text-white transition-colors">
          accessibility_new
        </span>
        <span className="sr-only">Opciones de Accesibilidad</span>
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
              className="w-full max-w-xl bg-white dark:bg-[#2e192c] text-[#231123] dark:text-[#FAF5F8] rounded-3xl border border-[#e6d5e2] dark:border-white/15 shadow-2xl p-5 sm:p-7 overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Encabezado */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e6d5e2] dark:border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#B80C09] text-white flex items-center justify-center font-bold shadow-md">
                    <span className="material-symbols-outlined text-[24px]">accessibility_new</span>
                  </div>
                  <div>
                    <h2 id="a11y-title" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                      Accesibilidad Universal
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B80C09]/15 text-[#B80C09] font-extrabold">
                        WCAG 2.1
                      </span>
                    </h2>
                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                      Personaliza el contraste, tipografía, audio y lectura para tu comodidad.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsA11yWidgetOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar panel de accesibilidad"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Contenido con Scroll */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 text-sm">
                
                {/* SECCIÓN 1: Tipografía y Lectura */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    Lectura y Tipografía
                  </h3>

                  {/* 1.1 Tamaño del Texto */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#B80C09]">format_size</span>
                        Tamaño del Texto
                      </span>
                      <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                        {settings.fontSize === 'normal' ? '100% (Normal)' : settings.fontSize === 'large' ? '115% (Grande)' : '130% (Extra)'}
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
                          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            settings.fontSize === opt.id
                              ? 'bg-[#B80C09] text-white shadow-xs'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1.2 Espaciado de Líneas (Interlineado WCAG 1.4.12) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-indigo-500">format_line_spacing</span>
                        Interlineado y Espaciado
                      </span>
                      <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                        {settings.lineSpacing === 'normal' ? 'Estándar' : settings.lineSpacing === 'relaxed' ? 'Relajado' : 'Amplio'}
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
                            settings.lineSpacing === opt.id
                              ? 'bg-[#B80C09] text-white shadow-xs'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1.3 Guía de Lectura Visual (Reading Mask) */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-amber-500">chrome_reader_mode</span>
                      <div>
                        <div className="font-bold text-sm">Guía de Enfoque / Regla de Lectura</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Barra horizontal de seguimiento para no perder la línea al leer
                        </div>
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
                        <div className="font-bold text-sm">Fuente Adaptada para Dislexia</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Mayor espaciado entre letras y palabras para evitar confusión visual
                        </div>
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
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Visión y Contraste
                  </h3>

                  {/* 2.1 Alto Contraste */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-amber-500">contrast</span>
                      <div>
                        <div className="font-bold text-sm">Modo Alto Contraste (AAA)</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Fondo negro absoluto con bordes y tipografía de máxima visibilidad
                        </div>
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
                        <div className="font-bold text-sm">Modo Sepia / Calidez Visual</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Filtro cálido relajante contra la fatiga visual y luz azul
                        </div>
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
                        <div className="font-bold text-sm">Modo Monocromático (Escala de Grises)</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Elimina la saturación para una experiencia visual de bajo estímulo
                        </div>
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
                        <div className="font-bold text-sm">Resaltar Elementos Interactivos</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Distingue botones, enlaces y campos con bordes llamativos
                        </div>
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
                        <div className="font-bold text-sm">Puntero / Cursor Agrandado</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Aumenta el tamaño del ratón para no perder el foco
                        </div>
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
                      <span className="material-symbols-outlined text-[18px] text-[#B80C09]">palette</span>
                      Filtros para Daltonismo
                    </span>
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
                          <span>{opt.label}</span>
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
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    Audio, Movimiento y Asistencia
                  </h3>

                  {/* 3.1 Micro-sonidos de Navegación (Audio Cues) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-teal-500">graphic_eq</span>
                      <div>
                        <div className="font-bold text-sm">Micro-Sonidos de Navegación (Audio Cues)</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Tonos sutiles al interactuar con botones, favoritos y reproductor
                        </div>
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
                        <div className="font-bold text-sm">Pausar Animaciones y Giros</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Para personas con sensibilidad vestibular o mareos por movimiento
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                      className="w-5 h-5 accent-[#B80C09] rounded cursor-pointer"
                    />
                  </label>

                  {/* 3.3 Lector de Pantalla y Síntesis de Voz (TTS) */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#B80C09]">record_voice_over</span>
                        Lector de Reseñas por Voz (TTS)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          isSpeaking
                            ? stopSpeaking()
                            : speak('Bienvenido a SONAR. Esta es una prueba de lectura en voz alta para tus reseñas y análisis líricos.')
                        }
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSpeaking
                            ? 'bg-[#B80C09] text-white animate-pulse'
                            : 'bg-white dark:bg-[#4B2840] text-[#B80C09] dark:text-pink-200 border border-rose-200 dark:border-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isSpeaking ? 'stop' : 'volume_up'}
                        </span>
                        <span>{isSpeaking ? 'Detener Voz' : 'Probar Voz'}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#5c435a] dark:text-[#B89CB0]">
                      <span>Velocidad de Lectura:</span>
                      {[0.8, 1, 1.25].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => updateSetting('ttsRate', rate)}
                          className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                            settings.ttsRate === rate
                              ? 'bg-[#B80C09] text-white'
                              : 'bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/10'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
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
                  <span>Ver Atajos de Teclado (?)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAllSettings}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-[#B80C09] transition-colors cursor-pointer"
                  >
                    Restablecer
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsA11yWidgetOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#B80C09] text-white text-xs font-bold hover:bg-[#960a07] transition-colors cursor-pointer"
                  >
                    Guardar y Cerrar
                  </button>
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
