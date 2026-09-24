import React from 'react';

/**
 * Enlace de salto al contenido principal (WCAG 2.4.1 Bypass Blocks)
 * Permite a usuarios de teclado y lectores de pantalla saltar la barra de navegación.
 */
export const SkipToContent = ({ targetId = 'main-content' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId) || document.querySelector('main');
    if (target) {
      target.setAttribute('tabIndex', '-1');
      target.focus();
      target.scrollIntoView?.({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sonar-skip-link"
      aria-label="Saltar navegación e ir directamente al contenido principal"
    >
      Saltar al contenido principal
    </a>
  );
};

export default SkipToContent;
