import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';

export const ProfileHeader = ({
  user = {
    name: 'Mateo Rivaes',
    username: '@mateorivaes',
    bio: 'Coleccionista de vinilos de jazz y art-rock de los 70 y 2000s. Siempre en busca de la masterización perfecta.',
    avatarUrl: '',
    stats: {
      reviews: 142,
      followers: '1.8k',
      following: 389,
    },
  },
  onEditProfile = () => {},
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.06)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
        {/* Lado Izquierdo + Centro: Avatar y Datos del Usuario */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left flex-1">
          {/* Avatar Grande (w-24 h-24) */}
          <div className="shrink-0 ring-4 ring-[#e6d5e2]/60 dark:ring-white/10 rounded-full shadow-md">
            <Avatar
              src={user.avatarUrl}
              name={user.name}
              size="2xl"
              className="w-24 h-24"
            />
          </div>

          {/* Información y Biografía */}
          <div className="flex flex-col gap-1.5 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-bold border border-[#e6d5e2] dark:border-white/10">
                Audiófilo Pro
              </span>
            </div>
            <p className="text-sm font-semibold text-[#5c435a] dark:text-[#B89CB0]">
              {user.username}
            </p>
            <p className="text-sm sm:text-base text-[#231123]/85 dark:text-gray-200 leading-relaxed mt-1">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Lado Derecho: Estadísticas y Botón de Edición */}
        <div className="flex flex-col items-center md:items-end gap-5 shrink-0 w-full sm:w-auto">
          {/* 3 Estadísticas */}
          <div className="flex items-center gap-6 sm:gap-8 py-2 px-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {user.stats.reviews}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                Reseñas
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {user.stats.followers}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                Seguidores
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {user.stats.following}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                Siguiendo
              </span>
            </div>
          </div>

          {/* Botón Editar Perfil */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEditProfile}
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs"
          >
            Editar Perfil
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;
