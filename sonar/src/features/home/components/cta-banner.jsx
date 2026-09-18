import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * CtaBanner Component
 *
 * Banner visual de "Llamado a la Acción" (Call to Action) para la página de inicio.
 * Invita a los usuarios a registrarse o iniciar sesión con degradado corporativo y animaciones suaves.
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
      className={`w-full rounded-2xl p-8 md:p-12 my-10 text-center overflow-hidden relative bg-gradient-to-r from-[#fdf5fc] to-[#f8e9f6] dark:bg-gradient-to-r dark:from-[#231123] dark:to-[#4B2840] border border-[#B80C09]/30 shadow-xl ${className}`}
    >
      {/* Efecto de resplandor decorativo de fondo */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#B80C09]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#5c1d5e]/15 dark:bg-[#B80C09]/10 rounded-full blur-3xl pointer-events-none" />

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

        {/* Contenedor flex con botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Botón Iniciar Sesión (Estilo Secundario / Fantasma) */}
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/20 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 shadow-xs text-center cursor-pointer"
          >
            Iniciar Sesión
          </Link>

          {/* Botón Crear Cuenta (Color Principal #B80C09) */}
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-[#B80C09] hover:bg-[#9c0a07] transition-all duration-200 shadow-md shadow-[#B80C09]/25 hover:shadow-lg hover:shadow-[#B80C09]/35 text-center cursor-pointer"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CtaBanner;
