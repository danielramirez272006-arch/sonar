import React, { useState } from 'react';
import { motion } from 'framer-motion';

const sizeMap = {
  xs: { size: '28px', font: '12px' },
  sm: { size: '36px', font: '14px' },
  md: { size: '44px', font: '16px' },
  lg: { size: '56px', font: '20px' },
  xl: { size: '72px', font: '26px' },
  '2xl': { size: '96px', font: '34px' },
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
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';

  const shouldShowImage = src && !imageError;

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
        <span
          style={{
            color: '#FFFFFF',
            fontSize: currentSize.font,
            fontWeight: 700,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {initial}
        </span>
      )}
    </motion.div>
  );
};

export default Avatar;
