import React from 'react';
import { useAccessibility } from '../../context/accessibility-context';

/**
 * Región ARIA Live para anunciar dinámicamente cambios de estado a lectores de pantalla (JAWS, NVDA, VoiceOver, TalkBack)
 */
export const AriaLiveAnnouncer = () => {
  const { ariaAnnouncement } = useAccessibility();

  return (
    <div
      aria-live={ariaAnnouncement.priority || 'polite'}
      aria-atomic="true"
      className="sonar-sr-only"
      id="sonar-aria-live-region"
    >
      {ariaAnnouncement.message}
    </div>
  );
};

export default AriaLiveAnnouncer;
