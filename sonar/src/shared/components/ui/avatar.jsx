import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blobatar } from '@blobatar/react';
import { useGaze } from '@blobatar/react/gaze';
import 'blobatar/motion.css';
import 'blobatar/gaze.css';
import { Disc, Headphones, Radio, Volume2, Mic, Flame } from 'lucide-react';

const sizeMap = {
  xs: { size: '28px', font: 12, num: 28, iconSize: 14 },
  sm: { size: '36px', font: 14, num: 36, iconSize: 18 },
  md: { size: '44px', font: 16, num: 44, iconSize: 22 },
  lg: { size: '56px', font: 20, num: 56, iconSize: 28 },
  xl: { size: '72px', font: 26, num: 72, iconSize: 36 },
  '2xl': { size: '96px', font: 34, num: 96, iconSize: 48 },
};

// Un size en pixeles tambien vale, para no tener dos escalas distintas.
const metricsFor = (num) => ({ size: `${num}px`, font: Math.round(num * 0.36), num, iconSize: Math.round(num * 0.5) });

const ICON_MAP = {
  headphones: Headphones,
  vinyl: Disc,
  radio: Radio,
  volume: Volume2,
  mic: Mic,
  flame: Flame,
};

/**
 * Avatar unico de SONAR. Decide foto, iniciales, icono o blobatar, y todos los
 * lugares de la app pasan por aqui para que la misma persona se vea igual en
 * el navbar, el perfil, la tabla de admin y las reseñas.
 */
export const Avatar = ({
  src,
  name,
  username,
  avatarBg,
  backgroundColor,
  bg,
  avatarSeed,
  avatarHue,
  avatarTone,
  avatarStyle = 'blobatar',
  avatarIcon,
  frame,
  size = 'md',
  animate = 'always',
  // gaze: la mirada sigue al puntero. active lo amplifica.
  gaze = false,
  active = false,
  className = '',
  'aria-label': ariaLabel,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const currentSize = sizeMap[size] || (typeof size === 'number' ? metricsFor(size) : sizeMap.md);
  const rawName = name || username || 'Usuario';
  const effectiveSeed = avatarSeed || rawName.trim() || 'usuario-sonar';
  const bgColor = avatarBg || backgroundColor || bg || '#4B2840';

  // El hook corre siempre; sin gaze no se le pasa ref ni travel, y el
  // conductor de mirada queda inerte.
  const { ref: gazeRef } = useGaze({
    travel: gaze ? (active ? 2 : 1) : undefined,
    lookAt: gaze && active ? 'pointer' : null,
  });

  const frameClassMap = {
    'frame-gold-vinyl': 'ring-2 sm:ring-4 ring-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.85)]',
    'frame-neon-cyber': 'ring-2 sm:ring-4 ring-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.85)]',
    'frame-valve-tube': 'ring-2 sm:ring-4 ring-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.8)]',
    'frame-hologram': 'ring-2 sm:ring-4 ring-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.85)]',
    'frame-prism-rainbow': 'ring-2 sm:ring-4 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.85)]',
    'frame-analog-wood': 'ring-2 sm:ring-4 ring-amber-700 shadow-[0_0_16px_rgba(180,83,9,0.7)]',
  };
  const activeFrameClass = frame ? frameClassMap[frame] || '' : '';

  // La foto manda cuando existe; /avatars/ son mocks locales, no imagenes reales.
  const shouldShowImage = Boolean(
    src &&
    !imageError &&
    src.trim() !== '' &&
    !src.startsWith('/avatars/')
  );

  const IconComponent = avatarIcon ? ICON_MAP[avatarIcon] : null;

  return (
    <motion.div
      className={`${className} ${activeFrameClass}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: currentSize.size,
        height: currentSize.size,
        borderRadius: '50%',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: activeFrameClass ? undefined : '0 4px 10px rgba(92, 29, 94, 0.12)',
      }}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={rawName}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : avatarStyle === 'initials' ? (
        <span
          className="font-black text-white tracking-wider uppercase select-none drop-shadow-xs"
          style={{ fontSize: currentSize.font }}
        >
          {rawName.charAt(0)}
        </span>
      ) : avatarStyle === 'icon' && IconComponent ? (
        <IconComponent
          size={currentSize.iconSize}
          className="text-white drop-shadow-md"
        />
      ) : (
        <Blobatar
          ref={gaze ? gazeRef : undefined}
          background="circle"
          hue={avatarHue}
          tone={avatarTone}
          name={effectiveSeed}
          size={currentSize.num}
          animate={animate}
        />
      )}
    </motion.div>
  );
};

export default Avatar;
