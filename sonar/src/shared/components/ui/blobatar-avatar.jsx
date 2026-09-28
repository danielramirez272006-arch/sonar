import { useUIText } from '../../i18n/use-ui-text.js';
import { Avatar } from './avatar';

/**
 * Envoltura de Avatar para los sitios que ya usan el nombre BlobatarAvatar.
 * No decide nada: si hay foto la muestra, y si no, el blobatar con el seed, el
 * tono y el color que el usuario guardo. Se apoya en Avatar para que el mismo
 * usuario se vea igual aqui que en el navbar o el perfil.
 *
 * Acepta los nombres canonicos de avatarPropsFor (avatarHue, avatarTone) y
 * tambien hue y tone, que son los que usaban los call sites antiguos.
 */
export const BlobatarAvatar = ({
  name,
  src,
  size = 44,
  active = false,
  animate = 'always',
  avatarHue,
  avatarTone,
  hue,
  tone,
  avatarStyle,
  avatarSeed,
  avatarIcon,
  avatarBg,
  frame,
  className = '',
}) => {
  const ui = useUIText();
  const avatarName = name?.trim() || 'usuario-sonar';

  return (
    <Avatar
      className={`blobatar-avatar ${className}`.trim()}
      name={avatarName}
      src={src}
      size={size}
      animate={animate}
      // El driver de mirada solo corre cuando el avatar esta activo. En una
      // lista (tabla de admin, reseñas giratorias) pagarlo sin que los ojos
      // sigan al puntero no aporta nada.
      gaze={active}
      active={active}
      avatarStyle={avatarStyle}
      avatarSeed={avatarSeed}
      avatarHue={avatarHue ?? hue}
      avatarTone={avatarTone ?? tone}
      avatarIcon={avatarIcon}
      avatarBg={avatarBg}
      frame={frame}
      aria-label={ui("Avatar de {{value0}}", { value0: avatarName })}
    />
  );
};

export default BlobatarAvatar;
