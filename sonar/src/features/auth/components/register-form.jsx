import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Headphones, Music2 } from 'lucide-react';
import { apiClient, getUserByEmail } from '../../../shared/services/api-client.js';
import { GoogleIcon, SpotifyIcon } from './social-provider-icon';
import { RotatingReview } from './rotating-review';

const EditorialPanel = () => (
  <aside className="auth-editorial" aria-label="Comunidad editorial de audio">
    <div className="auth-editorial__copy"><p className="auth-eyebrow"><span /> Comunidad editorial de audio</p><h1>Unete a la conversacion musical.</h1><p>Califica vinilos, analiza letras con inteligencia artificial y sincroniza tus hallazgos con una comunidad audiofila global.</p></div>
    <RotatingReview />
    <div className="auth-editorial__stats"><span><Music2 size={14} />64,280 criticas registradas este mes</span><span>28,400 albumes catalogados</span></div>
  </aside>
);

export const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setValue = (field) => (event) => setFormData({ ...formData, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const existingUser = await getUserByEmail(formData.email.trim());
      if (existingUser) throw new Error('Ya existe una cuenta con ese correo.');
      await apiClient.post('/users', {
        username: formData.username.trim(), email: formData.email.trim(), password: formData.password,
        role: 'user', avatarUrl: '/avatars/default-teal.png', bio: '',
        stats: { savedAlbums: 0, reviewsCount: 0, followers: 0 }, preferences: [],
      });
      window.location.hash = '#login';
    } catch (error) {
      setMessage(error.message || 'No se pudo crear la cuenta.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <EditorialPanel />
      <section className="auth-form-area" aria-labelledby="register-title"><div className="auth-form-wrap">
        <div className="auth-mobile-brand"><Headphones size={19} /> SONAR</div>
        <header className="auth-heading"><h2 id="register-title">Crea tu cuenta en Sonar</h2><p>Comienza tu diario sonoro en menos de 1 minuto.</p></header>
        <div className="auth-socials" aria-label="Registro con servicios externos"><button type="button"><SpotifyIcon />Continuar con Spotify</button><button type="button"><GoogleIcon />Continuar con Google</button></div>
        <p className="auth-divider"><span />o registrate con tu correo<span /></p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label><input id="username" required autoComplete="username" placeholder="tu_usuario" value={formData.username} onChange={setValue('username')} />
          <small>Tu perfil publico sera: <b>sonar.fm/@{formData.username || 'tu_usuario'}</b></small>
          <label htmlFor="register-email">Correo electronico</label><input id="register-email" type="email" required autoComplete="email" placeholder="tu@ejemplo.com" value={formData.email} onChange={setValue('email')} />
          <label htmlFor="register-password">Contrasena</label>
          <div className="auth-password"><input id="register-password" type={showPassword ? 'text' : 'password'} required minLength="8" autoComplete="new-password" placeholder="Minimo 8 caracteres" value={formData.password} onChange={setValue('password')} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          <div className="auth-strength"><span>Nivel de fortaleza</span><b>Excelente</b><i><em /></i></div>
          <label className="auth-check"><input type="checkbox" /> <span>Deseo recibir la seleccion curatorial semanal y analisis de letras via IA.</span></label>
          {message && <p className="auth-error" role="alert">{message}</p>}
          <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Creando cuenta...' : 'Crear mi Radar'} <ArrowRight size={18} /></button>
        </form>
        <p className="auth-switch">Ya tienes cuenta? <a href="#login">Inicia sesion</a></p><p className="auth-legal">Al registrarte aceptas las Condiciones de Servicio y la Politica de Privacidad de Sonar.</p>
      </div></section>
    </div>
  );
};

export default RegisterForm;