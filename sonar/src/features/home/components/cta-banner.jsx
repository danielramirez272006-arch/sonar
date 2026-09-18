import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * CtaBanner Component
 *
 * Banner visual de "Llamado a la Acción" (Call to Action) para la página de inicio.
 * Invita a los usuarios a registrarse o iniciar sesión con acabado Glassmorphism premium,
 * aura de resplandor difuminado y micro-interacciones fluidas.
 *
 * @param {Object} props
 * @param {string} [props.title] - Título principal del banner.
 * @param {string} [props.description] - Texto descriptivo complementario.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export const CtaBanner = ({
  title = 'Tu voz define la música. Únete a Sonar.',
  description = 'Descubre nuevos lanzamientos, comparte tus reseñas con la comunidad y califica los álbumes que marcan tu vida.',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`w-full rounded-2xl p-8 md:p-12 my-10 text-center overflow-hidden relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl ${className}`}
    >
      {/* Aura premium de fondo: círculo difuminado con blur profundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-[#B80C09] opacity-30 blur-3xl rounded-full pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Título grande y llamativo */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#231123] dark:text-white tracking-tight mb-3 sm:mb-4">
          {title}
        </h2>

        {/* Párrafo descriptivo corto */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        {/* Contenedor flex con botones de acción interactivos */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Botón Iniciar Sesión (Estilo Secundario / Fantasma con Glassmorphism) */}
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/20 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 shadow-xs text-center cursor-pointer"
          >
            Iniciar Sesión
          </Link>

          {/* Botón Crear Cuenta (Color Principal #B80C09 con Glow Neón) */}
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-[#B80C09] hover:bg-[#9c0a07] hover:scale-105 hover:shadow-[0_0_20px_rgba(184,12,9,0.4)] transition-all duration-300 shadow-lg text-center cursor-pointer"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CtaBanner;
