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
      {/* Botón Flotante Discreto de Accesibilidad (Esquina Inferior Izquierda) */}
      <button
        type="button"
        onClick={toggleA11yWidget}
        aria-label="Abrir opciones de accesibilidad (Atajo: Alt + A)"
        title="Opciones de Accesibilidad (Alt + A)"
        className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-[99990] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#231123] dark:bg-white text-white dark:text-[#231123] shadow-2xl border-2 border-[#B80C09] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group focus:outline-3 focus:outline-[#B80C09]"
      >
        <span className="material-symbols-outlined text-[24px] sm:text-[28px] text-[#B80C09] group-hover:rotate-12 transition-transform">
          accessibility_new
        </span>
        <span className="sr-only">Menú de Accesibilidad</span>
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
              <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 text-sm">
                {/* 1. Tamaño del Texto */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
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

                {/* 2. Controles de Conmutación (Toggles) */}
                <div className="space-y-2.5">
                  {/* Alto Contraste */}
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#B80C09]/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-amber-500">contrast</span>
                      <div>
                        <div className="font-bold text-sm">Modo Alto Contraste (AAA)</div>
                        <div className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Fondo oscuro profundo con realces de máxima legibilidad
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

                  {/* Tipografía para Dislexia */}
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

                  {/* Reducción de Animaciones */}
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

                  {/* Resaltado de Enlaces */}
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

                  {/* Cursor Grande */}
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
                </div>

                {/* 3. Filtros para Daltonismo */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                  <span className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B80C09]">palette</span>
                    Modo para Daltonismo
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

                {/* 4. Lector de Pantalla y Síntesis de Voz (TTS) */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col gap-3">
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
                    <span>Velocidad:</span>
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
