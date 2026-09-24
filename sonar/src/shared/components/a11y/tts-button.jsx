import React from 'react';
import { useAccessibility } from '../../context/accessibility-context';

export const TTSButton = ({
  text,
  title = '',
  size = 'md',
  className = '',
  label = 'Escuchar',
}) => {
  const { speak, stopSpeaking, isSpeaking, currentSpeakingText } = useAccessibility();

  const isCurrentSpeaking = isSpeaking && currentSpeakingText === text;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isCurrentSpeaking) {
      stopSpeaking();
    } else {
      speak(text, title);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isCurrentSpeaking ? 'Detener lectura en voz alta' : `Escuchar ${title || 'texto'} en voz alta`}
      title={isCurrentSpeaking ? 'Detener lectura en voz alta' : 'Escuchar en voz alta (Text-to-Speech)'}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold transition-all cursor-pointer ${
        isCurrentSpeaking
          ? 'bg-[#B80C09] text-white shadow-md animate-pulse'
          : 'bg-rose-50 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[#B80C09] dark:text-rose-300 border border-rose-200 dark:border-white/10'
      } ${isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs'} ${className}`}
    >
      <span className="material-symbols-outlined text-[15px]">
        {isCurrentSpeaking ? 'volume_off' : 'volume_up'}
      </span>
      {label && <span>{isCurrentSpeaking ? 'Detener' : label}</span>}
    </button>
  );
};

export default TTSButton;
