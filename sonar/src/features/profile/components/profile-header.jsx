import { motion } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';
import { useRouter } from '../../../shared/routing/app-router';
import { socialService } from '../../../shared/services/social-service';

export const ProfileHeader = ({
  user,
  actualReviewsCount,
  onEditProfile,
}) => {
  const router = useRouter?.();

  const currentUser = user || {
    name: 'Mateo Rivaes',
    username: '@mateorivaes',
    bio: 'Coleccionista de vinilos de jazz y art-rock de los 70 y 2000s. Siempre en busca de la masterización perfecta.',
    avatarUrl: '',
    preferences: ['Art Rock', 'Electrónica'],
  };

  const { displayName, handle } = socialService.formatUserIdentity(currentUser);
  const stats = socialService.getUserStats(currentUser, actualReviewsCount);
  const bio = currentUser.bio || 'Melómano explorando nuevas texturas acústicas en Sonar.';

  const handleEditClick = () => {
    if (onEditProfile) {
      onEditProfile();
    } else if (router?.navigate) {
      router.navigate('profile-settings');
    } else {
      window.location.hash = '#profile-settings';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.06)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Resplandor ambiental de cabecera */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B80C09]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8 relative z-10">
        {/* Lado Izquierdo + Centro: Avatar y Datos del Usuario */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left flex-1">
          {/* Avatar Grande (w-24 h-24) */}
          <div className="shrink-0 ring-4 ring-[#e6d5e2]/60 dark:ring-white/10 rounded-full shadow-md">
            <Avatar
              src={currentUser.avatarUrl}
              name={displayName}
              avatarBg={currentUser.avatarBg || currentUser.avatarColor}
              avatarSeed={currentUser.avatarSeed}
              avatarStyle={currentUser.avatarStyle}
              avatarIcon={currentUser.avatarIcon}
              size="2xl"
              className="w-24 h-24"
            />
          </div>

          {/* Información y Biografía */}
          <div className="flex flex-col gap-1.5 max-w-xl">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
                {displayName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-bold border border-[#e6d5e2] dark:border-white/10">
                {currentUser.role === 'admin' ? 'Administrador' : 'Audiófilo Pro'}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#5c435a] dark:text-[#B89CB0]">
              {handle}
            </p>
            <p className="text-sm sm:text-base text-[#231123]/85 dark:text-gray-200 leading-relaxed mt-1">
              {bio}
            </p>

            {/* Géneros / Gustos Musicales del Usuario */}
            {currentUser.preferences && currentUser.preferences.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                <span className="text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider mr-1">
                  Gustos:
                </span>
                {currentUser.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#231123] text-[#231123] dark:text-gray-200 text-xs font-medium border border-[#e6d5e2] dark:border-white/10"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            )}

            {/* Equipamiento Audiófilo del Usuario */}
            {currentUser.gear && (currentUser.gear.headphones || currentUser.gear.turntable) && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {currentUser.gear.turntable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B80C09]/10 text-[#B80C09] dark:text-pink-300 text-[11px] font-bold border border-[#B80C09]/20">
                    <span className="material-symbols-outlined text-[13px]">album</span>
                    <span>{currentUser.gear.turntable}</span>
                  </span>
                )}
                {currentUser.gear.headphones && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[11px] font-bold border border-blue-500/20">
                    <span className="material-symbols-outlined text-[13px]">headphones</span>
                    <span>{currentUser.gear.headphones}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Estadísticas y Botón de Edición */}
        <div className="flex flex-col items-center md:items-end gap-5 shrink-0 w-full sm:w-auto">
          {/* 3 Estadísticas */}
          <div className="flex items-center gap-6 sm:gap-8 py-2 px-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {stats.reviews || stats.reviewsCount || 0}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                Reseñas
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {stats.followers || 0}
              </span>
              <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                Seguidores
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                {stats.following ?? 0}
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
            onClick={handleEditClick}
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Personalizar Perfil & Gustos</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;

