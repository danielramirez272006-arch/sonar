import React from 'react';
import { useAccessibility } from '../../context/accessibility-context';

/**
 * Capa visual overlay para filtros de accesibilidad (Sepia, Escala de Grises y Daltonismo).
 * Se aplica como capa fija de fondo con pointer-events-none para no romper el apilamiento
 * CSS ni la posición fixed de la barra de navegación, reproductor de audio, modales ni widgets.
 */
export const A11yScreenOverlay = () => {
  const { settings } = useAccessibility();

  const isSepia = Boolean(settings.sepiaMode);
  const isGrayscale = Boolean(settings.grayscaleMode);
  const colorBlindFilter = settings.colorBlindness && settings.colorBlindness !== 'none'
    ? `url(#sonar-filter-${settings.colorBlindness})`
    : null;

  if (!isSepia && !isGrayscale && !colorBlindFilter) {
    return null;
  }

  // Composición de filtros backdrop
  const backdropFilters = [];
  if (isGrayscale) backdropFilters.push('grayscale(100%)');
  if (colorBlindFilter) backdropFilters.push(colorBlindFilter);

  const backdropStyle = backdropFilters.length > 0 ? backdropFilters.join(' ') : undefined;

  return (
    <div
      id="sonar-a11y-screen-overlay"
      className="fixed inset-0 pointer-events-none z-[999980] transition-opacity duration-300"
      style={{
        backdropFilter: backdropStyle,
        WebkitBackdropFilter: backdropStyle,
        backgroundColor: isSepia ? 'rgba(235, 175, 80, 0.13)' : undefined,
        mixBlendMode: isSepia && !isGrayscale ? 'multiply' : undefined,
      }}
      aria-hidden="true"
    />
  );
};

export default A11yScreenOverlay;
