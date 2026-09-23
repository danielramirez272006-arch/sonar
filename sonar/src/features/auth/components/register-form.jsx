import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Headphones, Music2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/auth-context';
import { GoogleIcon, SpotifyIcon } from './social-provider-icon';
import { RotatingReview } from './rotating-review';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';

const EditorialPanel = () => (
  <aside className="auth-editorial" aria-label="Comunidad editorial de audio">
    <div className="auth-editorial__copy">
      <p className="auth-eyebrow">
        <span /> Comunidad editorial de audio
      </p>
      <h1>Únete a la conversación musical.</h1>
      <p>
        Califica vinilos, analiza letras con inteligencia artificial y sincroniza tus hallazgos con una comunidad audiófila global.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <Music2 size={14} />
        64,280 críticas registradas este mes
      </span>
      <span>28,400 álbumes catalogados</span>
    </div>
  </aside>
);

export const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferences: ['Art Rock', 'Electrónica'],
    avatarBg: '#B80C09',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const setValue = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const toggleGenre = (genre) => {
    const current = formData.preferences || [];
    if (current.includes(genre)) {
      if (current.length === 1) return;
      setFormData({ ...formData, preferences: current.filter((g) => g !== genre) });
    } else {
      setFormData({ ...formData, preferences: [...current, genre] });
    }
  };

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { label: 'Requerida', pct: '0%', color: 'transparent' };
    if (len < 6) return { label: 'Débil', pct: '30%', color: '#ef4444' };
    if (len < 10) return { label: 'Buena', pct: '70%', color: '#f59e0b' };
    return { label: 'Excelente', pct: '100%', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!formData.username.trim()) {
      setErrorMessage('Por favor introduce un nombre de usuario.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Por favor introduce un correo electrónico válido.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Debes aceptar los Términos y Condiciones para crear tu cuenta.');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        preferences: formData.preferences,
        avatarBg: formData.avatarBg,
      });
      window.location.hash = '#usuario';
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
    }
  };

  const handleSocialRegister = async (provider) => {
    setErrorMessage('');
    const randomSuffix = Math.floor(Math.random() * 1000);
    const mockSocialData = {
      username: provider === 'spotify' ? `audiophile_${randomSuffix}` : `google_listener_${randomSuffix}`,
      email: provider === 'spotify' ? `spotify_user_${randomSuffix}@sonar.local` : `google_user_${randomSuffix}@sonar.local`,
      password: 'social_mock_login_123',
    };

    try {
      await register(mockSocialData);
      window.location.hash = '#usuario';
    } catch (err) {
      setErrorMessage(err.message || `No se pudo conectar con ${provider}.`);
    }
  };

  return (
    <div className="auth-shell">
      <EditorialPanel />
      <section className="auth-form-area" aria-labelledby="register-title">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Headphones size={19} /> SONAR
          </div>
          <header className="auth-heading">
            <h2 id="register-title">Crea tu cuenta en Sonar</h2>
            <p>Comienza tu diario sonoro en menos de 1 minuto.</p>
          </header>

          <div className="auth-socials" aria-label="Registro con servicios externos">
            <button
              type="button"
              onClick={() => handleSocialRegister('spotify')}
              disabled={isLoading}
            >
              <SpotifyIcon />
              Continuar con Spotify
            </button>
            <button
              type="button"
              onClick={() => handleSocialRegister('google')}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continuar con Google
            </button>
          </div>

          <p className="auth-divider">
            <span />o regístrate con tu correo<span />
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              required
              autoComplete="username"
              placeholder="tu_usuario"
              value={formData.username}
              onChange={setValue('username')}
            />
            <small>
              Tu perfil público será: <b>sonar.fm/@{formData.username || 'tu_usuario'}</b>
            </small>

            <label htmlFor="register-email">Correo electrónico</label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@ejemplo.com"
              value={formData.email}
              onChange={setValue('email')}
            />

            <label htmlFor="register-password">Contraseña</label>
            <div className="auth-password">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={setValue('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {formData.password && (
              <div className="auth-strength">
                <span>Nivel de fortaleza</span>
                <b style={{ color: strength.color }}>{strength.label}</b>
                <i>
                  <em style={{ width: strength.pct, backgroundColor: strength.color }} />
                </i>
              </div>
            )}

            {errorMessage && (
              <p className="auth-error" role="alert">
                {errorMessage}
              </p>
            )}

            {/* Calibración de Gustos Musicales Iniciales */}
            <div className="auth-genres-selection" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5c435a' }}>
                  Calibra tus Gustos Musicales
                </label>
                <span style={{ fontSize: '0.7rem', color: '#B80C09', fontWeight: 'bold' }}>
                  {formData.preferences.length} elegidos
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#81737e', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                Selecciona tus géneros favoritos para calibrar tus recomendaciones:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '7rem', overflowY: 'auto' }}>
                {GENRE_OPTIONS.map((genre) => {
                  const isSelected = formData.preferences.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: isSelected ? 'bold' : '500',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #B80C09' : '1px solid rgba(0,0,0,0.1)',
                        backgroundColor: isSelected ? '#B80C09' : 'rgba(0,0,0,0.04)',
                        color: isSelected ? '#ffffff' : '#231123',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected ? `✓ ${genre}` : genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="auth-check" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <span>Deseo recibir la selección curatorial semanal y análisis de letras vía IA.</span>
            </label>

            <label className="auth-check" style={{ marginTop: '0.35rem', cursor: 'pointer' }}>
              <input
                id="accept-terms-checkbox"
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errorMessage) setErrorMessage('');
                }}
              />
              <span style={{ fontSize: '0.74rem', lineHeight: '1.4' }}>
                He leído y acepto los{' '}
                <a
                  href="#terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{
                    color: '#B80C09',
                    fontWeight: '700',
                    textDecoration: 'underline',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                  title="Abrir y leer Términos y Condiciones en nueva pestaña"
                >
                  Términos y Condiciones
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle' }}>
                    open_in_new
                  </span>
                </a>{' '}
                de Sonar.
              </span>
            </label>

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? (
                'Creando cuenta…'
              ) : (
                <>
                  Crear mi Radar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <a href="#login">Inicia sesión aquí</a>
          </p>
          <p className="auth-legal">
            Al registrarte aceptas las Condiciones de Servicio y la Política de Privacidad de Sonar.
          </p>
        </div>
      </section>
    </div>
  );
};

export default RegisterForm;