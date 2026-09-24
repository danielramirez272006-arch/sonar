import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { requestPasswordResetWebhook } from '../../../shared/services/n8n-webhooks';
import { RotatingReview } from './rotating-review';

const EditorialPanel = () => (
  <aside className="auth-editorial" aria-label="Comunidad editorial de audio">
    <div className="auth-editorial__copy">
      <p className="auth-eyebrow">
        <span /> Automatización n8n & Seguridad Sonar
      </p>
      <h1>
        <span>Recupera tu</span>
        <span>acceso musical.</span>
      </h1>
      <p>
        Enviamos un enlace seguro y temporal a tu bandeja de correo para que puedas crear una nueva contraseña encriptada.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <ShieldCheck size={14} />
        Tokens temporales de 15 minutos
      </span>
      <span>Integración con n8n & Gmail</span>
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
      setErrorMessage('Por favor introduce un correo electrónico válido.');
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
      setErrorMessage(err.message || 'No se pudo enviar la solicitud de recuperación.');
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
                ? 'Ingresa tu correo para recibir un enlace de recuperación seguro vía n8n.'
                : 'Solicitud procesada con éxito.'}
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

              <div style={{
                marginTop: '0.75rem',
                background: '#faf5f9',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #ebd9ea',
                fontSize: '0.73rem',
                color: '#5c435a',
                lineHeight: '1.45',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#5c1d5e', marginBottom: '3px' }}>
                  <Sparkles size={14} /> Flujo n8n conectado:
                </div>
                Se enviará un webhook a tu workflow de n8n para generar un token único y enviar el correo con Gmail.
              </div>

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                {isLoading ? (
                  'Conectando con n8n...'
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
                ¡Correo de Recuperación Solicitado!
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                {responseMessage}
              </p>
              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '0.75rem', borderRadius: '8px', fontSize: '0.72rem', color: '#831843', marginBottom: '1.25rem', textAlign: 'left' }}>
                📬 <b>Revisa tu bandeja de entrada:</b> Busca el correo con el asunto <i>"SONAR - Recuperación de contraseña"</i> y abre el botón para restablecer tu clave.
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
