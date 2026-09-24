import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/accessibility-context';

/**
 * Guía de Lectura Visual (Reading Guide / Reading Ruler)
 * Ayuda a personas con TDAH, dislexia o fatiga visual a mantener el foco en la línea actual.
 */
export const ReadingGuide = () => {
  const { settings } = useAccessibility();
  const [posY, setPosY] = useState(250);

  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e) => {
      setPosY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  if (!settings.readingGuide) return null;

  return (
    <div
      className="fixed inset-x-0 pointer-events-none z-[99990] transition-transform duration-75 ease-out"
      style={{
        top: 0,
        transform: `translateY(${posY - 24}px)`,
      }}
      aria-hidden="true"
    >
      <div className="w-full h-12 bg-amber-400/15 dark:bg-amber-300/10 border-y-2 border-amber-500/60 dark:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-between px-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-300 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded shadow-xs">
          📖 Guía de Enfoque Visual
        </span>
        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded shadow-xs">
          Mueve el cursor para deslizar
        </span>
      </div>
    </div>
  );
};

export default ReadingGuide;
