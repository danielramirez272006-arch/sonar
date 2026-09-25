import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_TAGS = [
  '☕ Café & Lluvia',
  '🌙 Madrugada Hi-Fi',
  '⚡ Concentración Profunda',
  '🍷 Relax de Fin de Semana',
  '🎧 Análisis Técnico 180g',
];

export const ListeningJournalModal = ({ album, isOpen, onClose }) => {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sonar_listening_journal') || '{}');
    } catch {
      return {};
    }
  });

  const albumId = album?.id || 'general';
  const currentNote = entries[albumId] || { text: '', mood: MOOD_TAGS[0], timestampMark: '03:15' };

  const [noteText, setNoteText] = useState(currentNote.text);
  const [selectedMood, setSelectedMood] = useState(currentNote.mood);
  const [timestampMark, setTimestampMark] = useState(currentNote.timestampMark);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e?.preventDefault();
    const updated = {
      ...entries,
      [albumId]: {
        albumTitle: album?.title,
        artist: album?.artist,
        text: noteText,
        mood: selectedMood,
        timestampMark,
        date: new Date().toLocaleDateString(),
      },
    };
    setEntries(updated);
    try {
      localStorage.setItem('sonar_listening_journal', JSON.stringify(updated));
    } catch {}
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose && onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/15 shadow-2xl text-[#231123] dark:text-white flex flex-col gap-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#B80C09]/20 text-[#B80C09]">
            <span className="material-symbols-outlined text-[24px]">edit_note</span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B80C09]">
              Diario Acústico & Sleeve Notes
            </span>
            <h3 className="text-lg font-black tracking-tight">{album?.title || 'Reflexión Musical'}</h3>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Selector de Ambiente / Estado de Ánimo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#5c435a] dark:text-pink-200">
              Atmósfera de Audición:
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedMood(tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedMood === tag
                      ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-sm'
                      : 'bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 text-[#5c435a] dark:text-[#DCDCDD]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Marcador de Timestamp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#5c435a] dark:text-pink-200">
              Momento o Pasaje Destacado (mm:ss):
            </label>
            <input
              type="text"
              value={timestampMark}
              onChange={(e) => setTimestampMark(e.target.value)}
              placeholder="03:45 (Solo de sintetizador / Entrada de batería)"
              className="w-full text-xs font-medium py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-hidden focus:border-[#B80C09]"
            />
          </div>

          {/* Área de Texto / Notas Íntimas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#5c435a] dark:text-pink-200">
              Tus Notas de Escucha Privadas:
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="¿Qué sensaciones te provocó la textura sonora, el rango dinámico o la mezcla espacial de este álbum?"
              className="w-full text-xs leading-relaxed py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-hidden focus:border-[#B80C09]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer mt-1"
          >
            {isSaved ? '¡Nota Guardada en tu Diario!' : 'Guardar en Diario de Escucha'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ListeningJournalModal;
