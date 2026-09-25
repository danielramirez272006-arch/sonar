import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';
import { useRouter } from '../../../shared/routing/app-router';
import { socialService } from '../../../shared/services/social-service';
import { useAuth } from '../../../shared/context/auth-context';
import { useLanguage } from '../../../shared/context/language-context';

export const ProfileHeader = ({
  user,
  actualReviewsCount,
  onEditProfile,
  isVisitor = false,
}) => {
  const router = useRouter?.();
  const { user: authUser } = useAuth();
  const { t } = useLanguage();

  const currentUser = user || {
    name: 'Mateo Rivaes',
    username: '@mateorivaes',
    bio: 'Coleccionista de vinilos de jazz y art-rock de los 70 y 2000s. Siempre en busca de la masterización perfecta.',
    avatarUrl: '',
    bannerUrl: '',
    preferences: ['Art Rock', 'Electrónica'],
  };

  const currentAuthId = authUser?.id || 'guest_user';
  const targetId = currentUser?.id || currentUser?.username || 'user';
  const isOwnProfile = !isVisitor && (String(currentAuthId) === String(targetId) || !user);

  const [isFollowing, setIsFollowing] = useState(() =>
    socialService.isFollowingUser(currentAuthId, targetId)
  );

  const [equippedFrame, setEquippedFrame] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_frame') || currentUser?.equippedFrame || '';
    } catch {
      return '';
    }
  });

  const [equippedTitle, setEquippedTitle] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_title') || currentUser?.equippedTitle || '';
    } catch {
      return '';
    }
  });

  const [userPoints, setUserPoints] = useState(() => {
    try {
      return Number(localStorage.getItem('sonar_user_points') || currentUser?.sonarPoints || 1250);
    } catch {
      return 1250;
    }
  });

  useEffect(() => {
    setIsFollowing(socialService.isFollowingUser(currentAuthId, targetId));
    const handleFollowChange = (e) => {
      if (e.detail?.targetUserId === String(targetId)) {
        setIsFollowing(e.detail.isFollowing);
      }
    };
    const handleCustomizationChange = (e) => {
      if (e.detail?.equippedFrame !== undefined) setEquippedFrame(e.detail.equippedFrame);
      if (e.detail?.equippedTitle !== undefined) setEquippedTitle(e.detail.equippedTitle);
    };
    window.addEventListener('sonar:follow-user-changed', handleFollowChange);
    window.addEventListener('sonar:profile-customization-changed', handleCustomizationChange);
    return () => {
      window.removeEventListener('sonar:follow-user-changed', handleFollowChange);
      window.removeEventListener('sonar:profile-customization-changed', handleCustomizationChange);
    };
  }, [currentAuthId, targetId]);

  const handleToggleFollow = () => {
    const nextState = socialService.toggleFollowUser(currentAuthId, targetId, currentUser);
    setIsFollowing(nextState);
  };

  const { displayName, handle } = socialService.formatUserIdentity(currentUser);
  const stats = socialService.getUserStats(currentUser, actualReviewsCount);
  const bio = currentUser.bio || t('profile.default_bio', 'Nuevo melómano explorando vinilos y texturas acústicas en Sonar.');

  const handleEditClick = () => {
    try {
      sessionStorage.setItem('sonar_profile_settings_tab', 'profile');
    } catch {}
    if (onEditProfile) {
      onEditProfile();
    } else if (router?.navigate) {
      router.navigate('profile-settings');
    } else {
      window.location.hash = '#profile-settings';
    }
  };

  const defaultBannerGradient = 'linear-gradient(135deg, rgba(184, 12, 9, 0.7) 0%, rgba(75, 40, 64, 0.95) 100%)';
  const bannerBackground = currentUser.bannerUrl
    ? `url(${currentUser.bannerUrl}) center/cover no-repeat`
    : currentUser.bannerGradient || defaultBannerGradient;

  const frameClass = {
    'frame-gold-vinyl': 'ring-4 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)]',
    'frame-neon-cyber': 'ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.85)]',
    'frame-valve-tube': 'ring-4 ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.75)]',
    'frame-hologram': 'ring-4 ring-purple-400 shadow-[0_0_26px_rgba(168,85,247,0.8)]',
    'frame-prism-rainbow': 'ring-4 ring-pink-500 shadow-[0_0_26px_rgba(236,72,153,0.85)]',
    'frame-analog-wood': 'ring-4 ring-amber-700 shadow-[0_0_20px_rgba(180,83,9,0.75)]',
  }[equippedFrame] || 'ring-4 ring-white dark:ring-[#4B2840] shadow-xl';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.06)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Banner Superior Personalizado / Decorativo */}
      <div
        className="w-full h-32 sm:h-44 relative overflow-hidden transition-all duration-300"
        style={{ background: bannerBackground }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        {isOwnProfile && (
          <button
            type="button"
            onClick={handleEditClick}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>{t('profile.change_cover', 'Cambiar Portada')}</span>
          </button>
        )}
      </div>

      {/* Contenido del Perfil */}
      <div className="p-6 sm:p-8 pt-0 sm:pt-0 relative z-10 -mt-12 sm:-mt-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
          {/* Lado Izquierdo: Avatar y Datos */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left flex-1">
            {/* Avatar con borde flotante y Marco de Boutique */}
            <div className={`shrink-0 rounded-full bg-white dark:bg-[#231123] transition-all duration-300 ${frameClass}`}>
              <Avatar
                src={currentUser.avatarUrl}
                name={displayName}
                avatarBg={currentUser.avatarBg || currentUser.avatarColor}
                avatarHue={currentUser.avatarHue}
                avatarTone={currentUser.avatarTone}
                avatarSeed={currentUser.avatarSeed}
                avatarStyle={currentUser.avatarStyle}
                avatarIcon={currentUser.avatarIcon}
                size="2xl"
                className="w-24 h-24 sm:w-28 sm:h-28"
              />
            </div>

            {/* Información y Biografía */}
            <div className="flex flex-col gap-1.5 max-w-xl pt-2 sm:pt-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-[#231123] text-[#5c1d5e] dark:text-pink-200 text-xs font-bold border border-[#e6d5e2] dark:border-white/10">
                  {currentUser.role === 'admin' ? t('profile.role_admin', 'Administrador') : t('profile.role_audiophile_pro', 'Audiófilo Pro')}
                </span>

                {equippedTitle && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#B80C09] text-white text-xs font-black shadow-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">military_tech</span>
                    <span>{equippedTitle}</span>
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">toll</span>
                  <span>{userPoints.toLocaleString()} {t('profile.coins', 'Monedas')}</span>
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
                    {t('profile.tastes', 'Gustos:')}
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
              {(() => {
                const setup = currentUser.audiophileSetup || currentUser.gear || {};
                const turntable = setup.turntable;
                const headphones = setup.headphones;
                const dac = setup.dac || setup.amplifier;
                const format = setup.favoriteFormat;

                if (!turntable && !headphones && !dac && !format) return null;

                return (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1.5">
                    {turntable && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B80C09]/10 text-[#B80C09] dark:text-pink-300 text-[11px] font-bold border border-[#B80C09]/20">
                        <span className="material-symbols-outlined text-[13px]">album</span>
                        <span>{turntable}</span>
                      </span>
                    )}
                    {headphones && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[11px] font-bold border border-blue-500/20">
                        <span className="material-symbols-outlined text-[13px]">headphones</span>
                        <span>{headphones}</span>
                      </span>
                    )}
                    {dac && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                        <span className="material-symbols-outlined text-[13px]">speaker</span>
                        <span>{dac}</span>
                      </span>
                    )}
                    {format && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                        <span className="material-symbols-outlined text-[13px]">graphic_eq</span>
                        <span>{format}</span>
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Lado Derecho: Estadísticas y Botón de Acción */}
          <div className="flex flex-col items-center md:items-end gap-5 shrink-0 w-full sm:w-auto pt-2 sm:pt-4">
            {/* 3 Estadísticas Sociales */}
            <div className="flex items-center gap-6 sm:gap-8 py-2 px-4 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10 shadow-xs">
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                  {stats.reviews || stats.reviewsCount || 0}
                </span>
                <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                  {t('profile.reviews_count', 'Reseñas')}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                  {stats.followers || 0}
                </span>
                <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                  {t('profile.followers', 'Seguidores')}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-[#e6d5e2] dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#231123] dark:text-white">
                  {stats.following ?? 0}
                </span>
                <span className="text-xs text-[#5c435a] dark:text-[#B89CB0] font-medium">
                  {t('profile.following', 'Siguiendo')}
                </span>
              </div>
            </div>

            {/* Botón según sea Perfil Propio o Visitante */}
            {isOwnProfile ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEditClick}
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-[#B80C09] text-[#B80C09] hover:bg-[#B80C09] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>{t('profile.customize_btn', 'Personalizar Perfil & Gustos')}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleFollow}
                type="button"
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-white/10 text-[#231123] dark:text-white hover:bg-red-500/10 hover:text-red-500'
                    : 'bg-[#B80C09] text-white hover:bg-[#960a07]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isFollowing ? 'person_remove' : 'person_add'}
                </span>
                <span>{isFollowing ? t('profile.following', 'Siguiendo') : t('profile.follow_btn', 'Seguir Usuario')}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;


