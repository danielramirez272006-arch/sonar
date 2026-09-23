import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blobatar } from '@blobatar/react';

const sizeMap = {
  xs: { size: '28px', font: '12px', num: 28 },
  sm: { size: '36px', font: '14px', num: 36 },
  md: { size: '44px', font: '16px', num: 44 },
  lg: { size: '56px', font: '20px', num: 56 },
  xl: { size: '72px', font: '26px', num: 72 },
  '2xl': { size: '96px', font: '34px', num: 96 },
};

export const Avatar = ({
  src,
  name = 'Usuario',
  size = 'md',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const currentSize = sizeMap[size] || sizeMap.md;
  const avatarName = name ? name.trim() : 'usuario-sonar';

  // Usamos imagen real si existe y no es un path mock local inexistente
  const shouldShowImage = Boolean(
    src &&
    !imageError &&
    src.trim() !== '' &&
    !src.startsWith('/avatars/')
  );

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
        backgroundColor: '#4B2840',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Blobatar name={avatarName} size={currentSize.num} animate="hover" />
      )}
    </motion.div>
  );
};

export default Avatar;
