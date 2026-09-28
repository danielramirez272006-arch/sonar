import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleIcon } from './social-provider-icon';

// El botón oficial de Google Identity Services entrega un ID token JWT firmado
// por Google. En modo local/desarrollo sin CLIENT_ID, provee fallback de inicio de sesión fluido.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GIS_SRC = 'https://accounts.google.com/gsi/client';

let gisLoader = null;

function loadGoogleIdentity() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google no está disponible en este entorno.'));
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

export function GoogleSignInButton({ onCredential, onError, label = 'Continuar con Google', disabled = false, id }) {
  const [pending, setPending] = useState(false);
  const busy = disabled || pending;
  const handler = useRef({ onCredential, onError });
  useEffect(() => { handler.current = { onCredential, onError }; }, [onCredential, onError]);
  const configuredFor = useRef('');

  const handleClick = useCallback(async () => {
    if (busy) return;
    setPending(true);

    // Si no hay Client ID en entorno local, proveer inicio con Google de desarrollo
    if (!CLIENT_ID) {
      setTimeout(() => {
        setPending(false);
        handler.current.onCredential?.(
          'dev-google-credential-token',
          {
            email: 'melomano_google@sonar.audio',
            name: 'Melómano Google',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          }
        );
      }, 350);
      return;
    }

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
      googleId.prompt(() => {});
      setPending(false);
    } catch (cause) {
      setPending(false);
      handler.current.onError?.(cause);
    }
  }, [busy]);

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="auth-google-btn flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white font-bold text-sm shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all cursor-pointer"
      aria-label={label}
    >
      <GoogleIcon />
      <span>{pending ? 'Conectando con Google...' : label}</span>
    </button>
  );
}

export default GoogleSignInButton;
