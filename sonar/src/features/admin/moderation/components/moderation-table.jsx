import React, { useState } from 'react';
import { motion } from 'framer-motion';

const mockReports = [
  {
    id: 1,
    user: {
      name: 'Lucas Vane',
      handle: '@lucas_v',
      initial: 'L',
      bg: '#5c1d5e',
    },
    review: {
      album: 'OK Computer — Radiohead',
      excerpt: 'El final de No Surprises revela literalmente el clímax trágico de la narrativa conceptual y...',
    },
    reason: 'Posible Spoiler sin etiqueta',
    confidence: '98% Certeza IA',
    severity: 'warning',
  },
  {
    id: 2,
    user: {
      name: 'Gabriel Noise',
      handle: '@gabriel_n',
      initial: 'G',
      bg: '#B80C09',
    },
    review: {
      album: 'Discovery — Daft Punk',
      excerpt: 'Visita este enlace externo bit.ly/sonar-leaks para descargar stems en alta resolución gratis...',
    },
    reason: 'Enlace externo sospechoso / Spam',
    confidence: '94% Certeza IA',
    severity: 'danger',
  },
  {
    id: 3,
    user: {
      name: 'Martina Sound',
      handle: '@martina_s',
      initial: 'M',
      bg: '#33182b',
    },
    review: {
      album: 'Untrue — Burial',
      excerpt: 'La calidad del prensaje en esta edición es una basura inútil y estafadora...',
    },
    reason: 'Lenguaje potencialmente agresivo',
    confidence: '86% Certeza IA',
    severity: 'warning',
  },
];

export const ModerationTable = ({
  reports = mockReports,
  onApprove = () => {},
  onReject = () => {},
}) => {
  const [items, setItems] = useState(reports);

  const handleApproveAction = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onApprove(id);
  };

  const handleRejectAction = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onReject(id);
  };

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_8px_30px_-4px_rgba(75,40,64,0.06)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] transition-colors duration-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e6d5e2] dark:border-white/10 bg-gray-50/70 dark:bg-[#231123]/50 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
              <th className="py-4 px-6">Usuario</th>
              <th className="py-4 px-6">Reseña</th>
              <th className="py-4 px-6">Motivo (IA)</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6d5e2]/70 dark:divide-white/10 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-[#5c435a] dark:text-[#B89CB0]">
                  No hay reseñas pendientes en la cola de moderación.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-[#231123]/30 transition-colors"
                >
                  {/* Columna Usuario */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ring-2 ring-[#e6d5e2]/60 dark:ring-white/15"
                        style={{ backgroundColor: item.user.bg }}
                      >
                        {item.user.initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#231123] dark:text-white truncate">
                          {item.user.name}
                        </span>
                        <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          {item.user.handle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Columna Reseña */}
                  <td className="py-4 px-6 max-w-xs sm:max-w-md align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#5c1d5e] dark:text-pink-300">
                        {item.review.album}
                      </span>
                      <p className="text-xs sm:text-sm text-[#231123]/90 dark:text-gray-200 line-clamp-2 leading-relaxed">
                        “{item.review.excerpt}”
                      </p>
                    </div>
                  </td>

                  {/* Columna Motivo (IA) */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 self-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {item.reason}
                      </span>
                      <span className="text-[11px] font-semibold text-[#81737e] dark:text-[#B89CB0]">
                        {item.confidence}
                      </span>
                    </div>
                  </td>

                  {/* Columna Acciones */}
                  <td className="py-4 px-6 text-right align-top">
                    <div className="inline-flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleApproveAction(item.id)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-500/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        Aprobar
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleRejectAction(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#B80C09] text-white hover:bg-[#9c0a07] text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Rechazar
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModerationTable;
