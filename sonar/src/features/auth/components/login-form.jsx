import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Headphones, Music2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/auth-context';
import { GoogleIcon } from './social-provider-icon';
import { RotatingReview } from './rotating-review';
import { useGoogleLogin } from '@react-oauth/google';

const EditorialPanel = () => (
  <aside className="auth-editorial" aria-label="Comunidad editorial de audio">
    <div className="auth-editorial__copy">
      <p className="auth-eyebrow"><span /> Comunidad editorial de audio</p>
      <h1><span>Vuelve a la</span><span>conversación musical.</span></h1>
      <p>Califica vinilos, analiza letras con inteligencia artificial y sincroniza tus hallazgos con una comunidad audiófila global.</p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats"><span><Music2 size={14} />64,280 críticas registradas este mes</span><span>28,400 álbumes catalogados</span></div>
  </aside>
);

export const LoginForm = () => {
  const { login, loginWithGoogle, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectForRole = (account) => {
    window.location.hash = account.role === 'admin' ? '#admin' : '#usuario';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const account = await login(formData.email.trim(), formData.password);
      redirectForRole(account);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setMessage('');
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('No se pudo obtener el perfil de Google.');
        const googleUser = await res.json();

        const fakeCredential = btoa(JSON.stringify({ alg: 'RS256' })) + '.' +
          btoa(JSON.stringify({
            sub: googleUser.sub,
            email: googleUser.email,
            given_name: googleUser.given_name,
            name: googleUser.name,
            picture: googleUser.picture,
          })) + '.signature';

        const account = await loginWithGoogle(fakeCredential);
        redirectForRole(account);
      } catch (err) {
        setMessage(err.message || 'No se pudo iniciar sesión con Google.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setMessage('No se pudo conectar con Google. Intenta de nuevo.');
    },
    flow: 'implicit',
  });

  const activeError = message || authError;
  const isAnyLoading = isLoading || googleLoading;

  return (
    <div className="auth-shell">
      <EditorialPanel />
      <section className="auth-form-area" aria-labelledby="login-title">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Headphones size={19} /> SONAR</div>
          <header className="auth-heading">
            <h2 id="login-title">Inicia sesión en Sonar</h2>
            <p>Tu diario sonoro te estaba esperando.</p>
          </header>

          {/* Botón de Google OAuth */}
          <div className="auth-socials" aria-label="Acceso con servicios externos">
            <button
              id="google-login-btn"
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isAnyLoading}
              className="auth-google-btn"
              aria-label="Continuar con Google"
            >
              {googleLoading ? (
                <span className="auth-google-spinner" aria-hidden="true" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? 'Conectando con Google…' : 'Continuar con Google'}
            </button>
          </div>

          <p className="auth-divider"><span />o inicia sesión con tu correo<span /></p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="auth-label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="#forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="auth-password">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {activeError && <p className="auth-error" role="alert">{activeError}</p>}
            <button className="auth-submit" type="submit" disabled={isAnyLoading}>
              {isLoading ? 'Ingresando…' : <>Entrar a Sonar <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="auth-switch">¿Aún no tienes cuenta? <a href="#register">Crea tu cuenta</a></p>
          <p className="auth-legal">Al ingresar aceptas las Condiciones de Servicio y la Política de Privacidad de Sonar.</p>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
