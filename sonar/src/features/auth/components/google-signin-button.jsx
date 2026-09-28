import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleIcon } from './social-provider-icon';

// El boton oficial de Google Identity Services entrega un ID token JWT firmado
// por Google. Es lo unico que el servidor puede validar en /auth/google: el
// flujo implicito de @react-oauth/google solo da access_token, que no sirve.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GIS_SRC = 'https://accounts.google.com/gsi/client';

let gisLoader = null;

function loadGoogleIdentity() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google no esta disponible en este entorno.'));
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (!gisLoader) {
    gisLoader = new Promise((resolve, reject) => {
      const fail = () => { gisLoader = null; reject(new Error('No se pudo cargar el servicio de Google.')); };
      const ready = () => window.google?.accounts?.id
        ? resolve(window.google.accounts.id)
        : fail();
      const script = document.createElement('script');
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', ready, { once: true });
      script.addEventListener('error', fail, { once: true });
      document.head.appendChild(script);
    });
  }
  return gisLoader;
}

export function GoogleSignInButton({ onCredential, onError, label, disabled = false, id }) {
  const [pending, setPending] = useState(false);
  const busy = disabled || pending;
  // Google guarda el callback de initialize() y lo reutiliza en cada pulsacion
  // siguiente. Un ref mantiene vivo el handler actual para no quedar con un
  // closure viejo (el formulario de registro cambia en cada render).
  const handler = useRef({ onCredential, onError });
  useEffect(() => { handler.current = { onCredential, onError }; }, [onCredential, onError]);
  const configuredFor = useRef('');

  const handleClick = useCallback(async () => {
    if (busy || !CLIENT_ID) return;
    setPending(true);
    try {
      const googleId = await loadGoogleIdentity();
      if (configuredFor.current !== CLIENT_ID) {
        googleId.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            if (response?.credential) handler.current.onCredential(response.credential);
            else handler.current.onError?.();
          },
        });
        configuredFor.current = CLIENT_ID;
      }
      // Si la persona cierra el selector sin elegir cuenta, notification marca
      // 'dismissed' o 'skipped': no es un fallo, asi que no se avisa al usuario.
      googleId.prompt(() => {});
      setPending(false);
    } catch (cause) {
      setPending(false);
      handler.current.onError?.(cause);
    }
  }, [busy]);

  // Sin client id no hay forma de autenticarse: no mostrar un boton muerto.
  if (!CLIENT_ID) return null;

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="auth-google-btn"
      aria-label={label}
    >
      <GoogleIcon />
      {label}
    </button>
  );
}

export default GoogleSignInButton;
