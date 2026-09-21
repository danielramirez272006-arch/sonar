import React from 'react';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[#B80C09]/15 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full flex flex-col items-center text-center p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-[#4B2840]/60 backdrop-blur-xl border border-[#e6d5e2] dark:border-white/10 shadow-[0_20px_50px_-10px_rgba(75,40,64,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Isotipo Vinilo Rayado Animado */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#181119] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center mb-6 border-4 border-white/10"
        >
          {/* Surcos de vinilo */}
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <div className="absolute inset-4 rounded-full border border-white/10" />
          <div className="absolute inset-7 rounded-full border border-white/10" />
          
          {/* Centro del vinilo con fisura */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B80C09] flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              music_off
            </span>
          </div>

          {/* Rayón diagonal */}
          <div className="absolute w-full h-[2px] bg-white/40 rotate-45 transform origin-center shadow-xs" />
        </motion.div>

        {/* 404 Gigante */}
        <h1
          className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-[#B80C09] leading-none select-none drop-shadow-[0_10px_25px_rgba(184,12,9,0.3)]"
          style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          404
        </h1>

        {/* Subtítulo y Descripción */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight mt-3">
          Disco Rayado
        </h2>

        <p className="text-sm sm:text-base text-[#5c435a] dark:text-[#B89CB0] mt-2 max-w-sm leading-relaxed">
          Parece que la pista que buscas no existe o fue eliminada del archivo sonoro.
        </p>

        {/* Botón Volver al Inicio */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#B80C09] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(184,12,9,0.4)] hover:bg-[#9c0a07] transition-all cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          <span>Volver al inicio</span>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
