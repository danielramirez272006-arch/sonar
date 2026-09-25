import React, { useState } from 'react';
import { motion } from 'framer-motion';

const INITIAL_QUESTS = [
  {
    id: 'quest-1',
    title: 'Viaje a la Era Dorada del Jazz',
    description: 'Escucha al menos 3 pistas completas de la época 1955-1965 sin interrupciones.',
    progress: 2,
    target: 3,
    unit: 'pistas',
    reward: '+120 Puntos & Medalla Bebop',
    completed: false,
    icon: 'music_note',
  },
  {
    id: 'quest-2',
    title: 'Crítica de Alta Resolución',
    description: 'Escribe una reseña analizando el rango dinámico y mastering de un álbum.',
    progress: 1,
    target: 1,
    unit: 'reseña',
    reward: 'Insignia Platinada en Comentarios',
    completed: true,
    icon: 'rate_review',
  },
  {
    id: 'quest-3',
    title: 'Calibración de Sistema Acústico',
    description: 'Configura tu cadena de señal completa y ajusta tu ecualizador DSP.',
    progress: 1,
    target: 1,
    unit: 'setup',
    reward: '+200 Puntos de Prestigio',
    completed: true,
    icon: 'tune',
  },
  {
    id: 'quest-4',
    title: 'Explorador de Sellos de Culto',
    description: 'Descubre y guarda 2 discos de sellos discográficos independientes.',
    progress: 1,
    target: 2,
    unit: 'álbumes',
    reward: 'Acceso Anticipado a Lanzamientos',
    completed: false,
    icon: 'travel_explore',
  },
];

export const AudiophileQuests = () => {
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_audiophile_quests');
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  const handleClaim = (questId) => {
    const updated = quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q));
    setQuests(updated);
    try {
      localStorage.setItem('sonar_audiophile_quests', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6 text-[#231123] dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B80C09]">
            Gamificación & Misiones Semanales
          </span>
          <h3 className="text-xl font-black tracking-tight mt-0.5">
            Desafíos Acústicos
          </h3>
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
            Completa misiones de escucha y curaduría para elevar tu rango y desbloquear recompensas exclusivas.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20 self-start sm:self-auto">
          Renuevan en 4 días
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => {
          const isDone = quest.progress >= quest.target;
          const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isDone
                  ? 'bg-gradient-to-br from-white to-amber-50/40 dark:from-[#3a1b32] dark:to-[#2b1425] border-amber-300 dark:border-amber-500/30 shadow-xs'
                  : 'bg-gray-50/70 dark:bg-black/20 border-gray-200 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-gradient-to-tr from-amber-500 to-[#B80C09] text-white shadow-md'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{quest.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#231123] dark:text-white">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                      {quest.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-[#5c435a] dark:text-[#B89CB0]">
                    Progreso: {quest.progress} / {quest.target} {quest.unit}
                  </span>
                  <span className="font-mono text-[#B80C09] dark:text-pink-300">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-black/30 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#B80C09] to-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  🎁 {quest.reward}
                </span>

                {isDone ? (
                  quest.claimed ? (
                    <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      ✓ Reclamado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase transition-all shadow-xs cursor-pointer"
                    >
                      Reclamar
                    </button>
                  )
                ) : (
                  <span className="text-[10px] text-gray-400 uppercase font-bold">En curso</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudiophileQuests;
