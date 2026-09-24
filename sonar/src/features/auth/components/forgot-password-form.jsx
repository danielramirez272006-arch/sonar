import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck, Send } from 'lucide-react';
import { requestPasswordResetWebhook } from '../../../shared/services/n8n-webhooks';
import { RotatingReview } from './rotating-review';

const EditorialPanel = () => (
  <aside className="auth-editorial" aria-label="Comunidad editorial de audio">
    <div className="auth-editorial__copy">
      <p className="auth-eyebrow">
        <span /> Seguridad & Protección Sonar
      </p>
      <h1>
        <span>Recupera tu</span>
        <span>acceso musical.</span>
      </h1>
      <p>
        Te enviaremos un enlace seguro a tu correo electrónico para que puedas crear una nueva contraseña y volver a tu colección.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <ShieldCheck size={14} />
        Cifrado de extremo a extremo
      </span>
      <span>Protección de cuenta & privacidad</span>
    </div>
  </aside>
);

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Por favor introduce tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestPasswordResetWebhook(cleanEmail);
      setResponseMessage(
        result.message ||
          'Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña.'
      );
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <EditorialPanel />
      <section className="auth-form-area" aria-labelledby="forgot-title">
        <div className="auth-form-wrap">
          <header className="auth-heading">
            <h2 id="forgot-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={26} color="#B80C09" />
              Recuperar Contraseña
            </h2>
            <p>
              {!isSubmitted
                ? 'Ingresa tu correo electrónico para recibir un enlace de restablecimiento.'
                : 'Solicitud enviada con éxito.'}
            </p>
          </header>

          {errorMessage && (
            <p className="auth-error" role="alert" style={{ marginBottom: '1rem', padding: '0.5rem 0.75rem', background: '#fee2e2', borderRadius: '6px' }}>
              {errorMessage}
            </p>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="recovery-email">Correo electrónico</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#856f80' }} />
              </div>

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1.1rem' }}>
                {isLoading ? (
                  'Enviando enlace…'
                ) : (
                  <>
                    Enviar Enlace de Recuperación <Send size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '0.8rem 0' }}>
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                marginBottom: '1rem',
              }}>
                <CheckCircle2 size={46} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#166534' }}>
                ¡Revisa tu Correo!
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                {responseMessage}
              </p>
              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '0.75rem', borderRadius: '8px', fontSize: '0.74rem', color: '#831843', marginBottom: '1.25rem', textAlign: 'left' }}>
                📬 <b>Bandeja de entrada:</b> Busca el correo con el asunto <i>"SONAR - Recuperación de contraseña"</i> y haz clic en el botón para crear tu nueva clave.
              </div>
              <a
                href="#login"
                className="auth-submit"
                style={{ textDecoration: 'none', display: 'inline-flex', width: '100%', boxSizing: 'border-box' }}
              >
                Volver al Inicio de Sesión <ArrowRight size={18} />
              </a>
            </div>
          )}

          <p className="auth-switch" style={{ marginTop: '1.5rem' }}>
            <a href="#login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} /> Volver a Iniciar Sesión
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordForm;
