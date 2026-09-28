import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../../context/accessibility-context';
import { useLanguage } from '../../context/language-context';

export const KeyboardShortcutsModal = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useAccessibility();
  const { t } = useLanguage();

  if (!isShortcutsModalOpen) return null;

  const shortcutGroups = [
    {
      category: t('shortcuts.a11y_group', 'Accesibilidad y Asistencia'),
      items: [
        { keys: ['Alt', 'A'], description: 'Abrir / Cerrar Panel de Accesibilidad' },
        { keys: ['?'], description: 'Abrir esta guía de atajos de teclado' },
        { keys: ['Tab'], description: 'Navegar hacia el siguiente elemento interactivo' },
        { keys: ['Shift', 'Tab'], description: 'Navegar hacia el elemento interactivo anterior' },
        { keys: ['Esc'], description: 'Cerrar cualquier ventana modal o menú abierto' },
      ],
    },
    {
      category: t('shortcuts.media_group', 'Reproducción y Control Multimedia'),
      items: [
        { keys: ['Espacio'], description: 'Reproducir / Pausar muestra de audio activa' },
        { keys: ['M'], description: 'Silenciar / Restaurar volumen del reproductor' },
        { keys: ['Ctrl', 'K'], description: 'Enfocar barra de búsqueda global' },
      ],
    },
    {
      category: t('shortcuts.nav_group', 'Navegación Rápida'),
      items: [
        { keys: ['Enter'], description: 'Activar botón, reproducir tarjeta o entrar a perfil' },
        { keys: ['Inicio / Fin'], description: 'Ir al principio o final de la página' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="w-full max-w-2xl bg-white dark:bg-[#2e192c] text-[#231123] dark:text-[#FAF5F8] rounded-3xl border border-[#e6d5e2] dark:border-white/15 shadow-2xl p-6 sm:p-8 overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e6d5e2] dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B80C09]/10 dark:bg-[#B80C09]/30 text-[#B80C09] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">keyboard</span>
              </div>
              <div>
                <h2 id="shortcuts-title" className="text-xl sm:text-2xl font-black tracking-tight">
                  {t('shortcuts.title', 'Atajos de Teclado')}
                </h2>
                <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0]">
                  {t('shortcuts.subtitle', 'Navega de forma rápida y accesible por todo SONAR sin usar el ratón.')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsShortcutsModalOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar guía de atajos"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Lista de Atajos */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
            {shortcutGroups.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#B80C09] dark:text-rose-400">
                  {group.category}
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 gap-4"
                    >
                      <span className="text-sm font-medium text-[#231123] dark:text-gray-200">
                        {item.description}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#4B2840] border border-gray-200 dark:border-white/20 text-xs font-mono font-bold text-[#231123] dark:text-white shadow-xs">
                              {k}
                            </kbd>
                            {kIdx < item.keys.length - 1 && (
                              <span className="text-xs font-bold text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pie */}
          <div className="pt-4 border-t border-[#e6d5e2] dark:border-white/10 flex justify-end shrink-0">
            <button
              type="button"
              onClick={() => setIsShortcutsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-[#B80C09] text-white text-xs font-bold hover:bg-[#960a07] transition-colors cursor-pointer"
            >
              {t('common.close', 'Entendido')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
