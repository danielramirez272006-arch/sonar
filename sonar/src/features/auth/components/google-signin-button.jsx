import { useEffect, useRef, useState } from 'react';

let gisLoader = null;
function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (!gisLoader) {
    gisLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => fail(), 15000);
      const fail = () => {
        clearTimeout(timeout);
        script.remove();
        gisLoader = null;
        reject(new Error('No se pudo cargar Google. Revisa tu conexión o los bloqueadores del navegador.'));
      };
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        if (!window.google?.accounts?.id) return fail();
        clearTimeout(timeout);
        resolve(window.google.accounts.id);
      }, { once: true });
      script.addEventListener('error', fail, { once: true });
      document.head.appendChild(script);
    });
  }
  return gisLoader;
}

export function GoogleSignInButton({ onCredential, onError, label = 'Continuar con Google', disabled = false, id }) {
  const container = useRef(null);
  const handler = useRef({ onCredential, onError, disabled });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { handler.current = { onCredential, onError, disabled }; }, [onCredential, onError, disabled]);

  useEffect(() => {
    let active = true;
    const target = container.current;
    const report = (cause) => {
      if (!active) return;
      setLoading(false);
      setError(cause.message);
      handler.current.onError?.(cause);
    };
    async function initialize() {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) throw new Error('Falta configurar VITE_GOOGLE_CLIENT_ID para iniciar sesión con Google.');
        const googleId = await loadGoogleIdentity();
        if (!active) return;
        googleId.initialize({
          client_id: clientId,
          ux_mode: 'popup',
          callback: (response) => {
            if (!active || handler.current.disabled) return;
            if (response?.credential) handler.current.onCredential?.(response.credential);
            else report(new Error('Google no devolvió una credencial. Intenta iniciar sesión otra vez.'));
          },
        });
        googleId.renderButton(target, {
          type: 'standard', theme: 'outline', size: 'large',
          text: 'continue_with', shape: 'pill',
          width: Math.min(400, target.clientWidth || 320),
        });
        setLoading(false);
      } catch (cause) { report(cause); }
    }
    initialize();
    return () => { active = false; target?.replaceChildren(); };
  }, [attempt]);

  return (
    <div id={id} aria-label={label} aria-busy={loading || disabled}>
      <div ref={container} inert={disabled ? true : undefined}
        style={{ display: 'flex', justifyContent: 'center', minHeight: 44, opacity: disabled ? 0.6 : 1 }} />
      {loading && <p role="status">Cargando Google...</p>}
      {error && <div role="alert">
        <p>{error}</p>
        <button type="button" disabled={disabled} onClick={() => {
          setError(''); setLoading(true); setAttempt(value => value + 1);
        }}>Reintentar conexión con Google</button>
      </div>}
    </div>
  );
}

export default GoogleSignInButton;
