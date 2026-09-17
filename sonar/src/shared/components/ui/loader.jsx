import React from 'react';

/**
 * Skeleton Component
 * 
 * Componente reutilizable con efecto shimmer continuo de izquierda a derecha.
 * Se adapta automáticamente al Modo Claro (gris suave) y Modo Oscuro (dark:bg-[#4B2840]/50).
 */
export const Skeleton = ({
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular' | 'rounded'
  width,
  height,
  className = '',
  style = {},
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4 my-1.5';
      case 'rounded':
        return 'rounded-2xl';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200/80 dark:bg-[#4B2840]/50 ${getVariantClasses()} ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
    >
      {/* Shimmer overlay animado continuo */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[shimmer_1.8s_infinite]"
        style={{
          animation: 'sonarShimmer 1.8s infinite',
        }}
      />
      <style>{`
        @keyframes sonarShimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
