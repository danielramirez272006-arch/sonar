import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blobatar } from '@blobatar/react';
import { Disc, Headphones, Radio, Volume2, Mic, Flame } from 'lucide-react';

const sizeMap = {
  xs: { size: '28px', font: '12px', num: 28, iconSize: 14 },
  sm: { size: '36px', font: '14px', num: 36, iconSize: 18 },
  md: { size: '44px', font: '16px', num: 44, iconSize: 22 },
  lg: { size: '56px', font: '20px', num: 56, iconSize: 28 },
  xl: { size: '72px', font: '26px', num: 72, iconSize: 36 },
  '2xl': { size: '96px', font: '34px', num: 96, iconSize: 48 },
};

const ICON_MAP = {
  headphones: Headphones,
  vinyl: Disc,
  radio: Radio,
  volume: Volume2,
  mic: Mic,
  flame: Flame,
};

export const Avatar = ({
  src,
  name,
  username,
  avatarBg,
  backgroundColor,
  bg,
  avatarSeed,
  avatarStyle = 'blobatar',
  avatarIcon,
  size = 'md',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const currentSize = sizeMap[size] || sizeMap.md;
  const rawName = name || username || 'Usuario';
  const effectiveSeed = avatarSeed || rawName.trim() || 'usuario-sonar';
  const bgColor = avatarBg || backgroundColor || bg || '#4B2840';

  // Usamos imagen real si existe y no es un path mock local inexistente
  const shouldShowImage = Boolean(
    (src || avatarStyle === 'image') &&
    src &&
    !imageError &&
    src.trim() !== '' &&
    !src.startsWith('/avatars/')
  );

  const IconComponent = avatarIcon ? ICON_MAP[avatarIcon] : null;

  return (
    <motion.div
      className={className}
      onClick={onClick}
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
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
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
        <Blobatar name={effectiveSeed} size={currentSize.num} animate="hover" />
      )}
    </motion.div>
  );
};

export default Avatar;
