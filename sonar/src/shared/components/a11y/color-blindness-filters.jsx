import React from 'react';

/**
 * Filtros SVG para simulación y corrección de Daltonismo
 * basados en matrices de transformación espectral estándar WCAG.
 */
export const ColorBlindnessFilters = () => {
  return (
    <svg
      style={{ position: 'absolute', height: 0, width: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Protanopía (Deficiencia de Rojo) */}
        <filter id="sonar-filter-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>

        {/* Deuteranopía (Deficiencia de Verde) */}
        <filter id="sonar-filter-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.700, 0.300, 0,   0, 0
                    0,     0.300, 0.7, 0, 0
                    0,     0,     0,   1, 0"
          />
        </filter>

        {/* Tritanopía (Deficiencia de Azul) */}
        <filter id="sonar-filter-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ColorBlindnessFilters;
