import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const StarRating = ({
  value = 0,
  maxStars = 5,
  onChange = () => {},
  readOnly = false,
  size = 28,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating = hoverRating || value;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const isActive = starNumber <= activeRating;

        return (
          <motion.button
            key={starNumber}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange(starNumber)}
            onMouseEnter={() => !readOnly && setHoverRating(starNumber)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            whileHover={!readOnly ? { scale: 1.25 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`p-1 rounded-lg transition-colors duration-150 ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            } outline-none focus:ring-2 focus:ring-[#B80C09]/30`}
            aria-label={`Calificar con ${starNumber} estrellas`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={isActive ? '#B80C09' : 'currentColor'}
              className={`transition-colors duration-200 ${
                isActive
                  ? 'text-[#B80C09] drop-shadow-[0_2px_8px_rgba(184,12,9,0.35)]'
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
              }`}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
};

export default StarRating;
