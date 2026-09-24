import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EngineStatusModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#190e1a] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-[#B80C09] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-3 mb-5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="text-xl font-black text-white">
                Sonar Engine v2.4
              </h3>
              <span className="text-xs text-emerald-400 font-mono">
                TELEMETRÍA EN VIVO · SISTEMA OPERATIVO
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400">Motor de Audio:</span>
              <span className="text-emerald-400 font-bold">Hi-Res 24-bit / 96kHz (Simulado)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400">Latencia de Red Deezer API:</span>
              <span className="text-emerald-400 font-bold">18 ms (Óptima)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400">Caché Local de Vinilos:</span>
              <span className="text-emerald-400 font-bold">Activo (IndexedDB / LocalStorage)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400">Filtro de Ruido Analógico:</span>
              <span className="text-pink-300 font-bold">Calibración RIAA + 33⅓ RPM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400">Moderación de IA:</span>
              <span className="text-emerald-400 font-bold">Gemini Sound Protocol 3.7</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-6 font-sans">
            El motor de Sonar procesa las transiciones de audio con amortiguación suave, consulta en tiempo real los catálogos de metadatos y mantiene el estado analógico del usuario.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EngineStatusModal;
