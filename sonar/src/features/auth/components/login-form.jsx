import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Headphones, Music2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/auth-context';
import { GoogleIcon, SpotifyIcon } from './social-provider-icon';
import { RotatingReview } from './rotating-review';

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
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault(); setMessage('');
    try { const account = await login(formData.email.trim(), formData.password); window.location.hash = account.role === 'admin' ? '#admin' : '#usuario'; }
    catch (error) { setMessage(error.message); }
  };
  return <div className="auth-shell"><EditorialPanel /><section className="auth-form-area" aria-labelledby="login-title"><div className="auth-form-wrap"><div className="auth-mobile-brand"><Headphones size={19} /> SONAR</div><header className="auth-heading"><h2 id="login-title">Inicia sesión en Sonar</h2><p>Tu diario sonoro te estaba esperando.</p></header><div className="auth-socials" aria-label="Acceso con servicios externos"><button type="button"><SpotifyIcon />Continuar con Spotify</button><button type="button"><GoogleIcon />Continuar con Google</button></div><p className="auth-divider"><span />o inicia sesión con tu correo<span /></p><form onSubmit={handleSubmit} className="auth-form"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" required placeholder="tu@ejemplo.com" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /><div className="auth-label-row"><label htmlFor="password">Contraseña</label><a href="#forgot-password">¿Olvidaste tu contraseña?</a></div><div className="auth-password"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Mínimo 8 caracteres" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{message && <p className="auth-error" role="alert">{message}</p>}<button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Ingresando…' : <>Entrar a Sonar <ArrowRight size={18} /></>}</button></form><p className="auth-switch">¿Aún no tienes cuenta? <a href="#register">Crea tu cuenta</a></p><p className="auth-legal">Al ingresar aceptas las Condiciones de Servicio y la Política de Privacidad de Sonar.</p></div></section></div>;
};

export default LoginForm;
