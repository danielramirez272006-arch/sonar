import { Blobatar } from '@blobatar/react';
import { useGaze } from '@blobatar/react/gaze';
import 'blobatar/motion.css';
import 'blobatar/gaze.css';

/** Avatar determinista: el mismo nombre siempre genera el mismo Blobatar. */
export const BlobatarAvatar = ({ name, size = 50, active = false, hue, tone, className = '' }) => {
  const avatarName = name?.trim() || 'usuario-sonar';
  const { ref } = useGaze({
    travel: active ? 2 : 0,
    lookAt: active ? 'pointer' : null,
  });

  return (
    <span className={`blobatar-avatar ${className}`} style={{ width: size, height: size }} aria-label={`Avatar de ${avatarName}`}>
      <Blobatar ref={ref} name={avatarName} size={size} hue={hue} tone={tone} background="circle" animate={active ? 'always' : 'hover'} />
    </span>
  );
};

export default BlobatarAvatar;
