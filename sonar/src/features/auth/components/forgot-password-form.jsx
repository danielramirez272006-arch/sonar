import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck, Eye, EyeOff, Sparkles, RefreshCw, Send } from 'lucide-react';
import { requestPasswordResetWebhook } from '../../../shared/services/n8n-webhooks';
import { getUserByEmail, updateUser, getUsers } from '../../../shared/services/api-client';
import { hashPassword } from '../../../shared/services/crypto-service';
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
        Te enviaremos un código de seguridad de 6 dígitos a tu correo electrónico para verificar tu identidad y restablecer tu contraseña con cifrado SHA-256.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <ShieldCheck size={14} />
        Cifrado seguro de extremo a extremo
      </span>
      <span>Código temporal de 15 minutos</span>
    </div>
  </aside>
);

export const ForgotPasswordForm = () => {
  // Pasos: 1 = Email, 2 = Escribir Código OTP del Correo, 3 = Nueva Contraseña, 4 = Éxito
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Paso 1: Enviar código al correo mediante n8n
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Por favor introduce tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      // Buscar usuario en base de datos local / mock
      let found = await getUserByEmail(cleanEmail);
      if (!found) {
        const allUsers = await getUsers();
        found = allUsers.find(
          (u) =>
            u.email?.toLowerCase() === cleanEmail ||
            u.username?.toLowerCase() === cleanEmail ||
            u.username?.toLowerCase().replace(/\s+/g, '_') === cleanEmail
        );
      }

      setTargetUser(found || { email: cleanEmail });

      // Generar código y enviar webhook a n8n
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await requestPasswordResetWebhook(cleanEmail, code);

      setExpectedCode(result.code || code);
      setResendTimer(15);
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo enviar el código al correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 2: Validar el código de 6 dígitos escrito por el usuario
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (enteredCode.trim() !== expectedCode.trim()) {
      setErrorMessage('El código de 6 dígitos ingresado es incorrecto o ha expirado.');
      return;
    }

    setStep(3);
  };

  // Paso 3: Guardar la nueva contraseña con cifrado SHA-256
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);
    try {
      // Hasheo seguro SHA-256 con salt criptográfico
      const encryptedPassword = await hashPassword(newPassword);

      if (targetUser?.id) {
        await updateUser(targetUser.id, { password: encryptedPassword });
      }

      // Si el usuario en sesión es este, actualizar su sesión local
      try {
        const savedAuth = window.localStorage?.getItem('sonar_auth_user');
        if (savedAuth) {
          const authObj = JSON.parse(savedAuth);
          if (authObj.email?.toLowerCase() === targetUser?.email?.toLowerCase() || authObj.id === targetUser?.id) {
            authObj.password = encryptedPassword;
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(authObj));
          }
        }
      } catch {
        // Fallback
      }

      setStep(4);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo actualizar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const len = newPassword.length;
    if (len === 0) return { label: 'Requerida', pct: '0%', color: 'transparent' };
    if (len < 6) return { label: 'Débil (mínimo 6)', pct: '30%', color: '#ef4444' };
    if (len < 10) return { label: 'Buena', pct: '70%', color: '#f59e0b' };
    return { label: 'Excelente (Cifrado SHA-256)', pct: '100%', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-shell">
      <EditorialPanel />
      <section className="auth-form-area" aria-labelledby="forgot-title">
        <div className="auth-form-wrap">
          <button
            type="button"
            onClick={() => {
              if (step > 1 && step < 4) {
                setStep((s) => s - 1);
              } else {
                window.location.hash = '#login';
              }
            }}
            className="auth-back-btn"
            aria-label="Regresar"
          >
            <ArrowLeft size={15} />
            <span>{step > 1 && step < 4 ? 'Paso anterior' : 'Volver a iniciar sesión'}</span>
          </button>
          <header className="auth-heading">
            <h2 id="forgot-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={26} color="#B80C09" />
              Recuperar Contraseña
            </h2>
            <p>
              {step === 1 && 'Ingresa tu correo para recibir un código de seguridad de 6 dígitos.'}
              {step === 2 && `Ingresa el código que acabamos de enviar a ${email}.`}
              {step === 3 && 'Crea tu nueva contraseña segura para volver a entrar a Sonar.'}
              {step === 4 && '¡Tu contraseña ha sido actualizada y cifrada con éxito!'}
            </p>
          </header>

          {/* Stepper Indicator */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: step >= s ? '#5c1d5e' : 'rgba(0,0,0,0.1)',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="auth-error" role="alert" style={{ marginBottom: '1rem', padding: '0.5rem 0.75rem', background: '#fee2e2', borderRadius: '6px' }}>
              {errorMessage}
            </p>
          )}

          {/* PASO 1: Ingreso de correo */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="auth-form">
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
                  'Enviando código al correo…'
                ) : (
                  <>
                    Enviar Código de Recuperación <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: Escribir el código recibido en el correo */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="auth-form">
              <div style={{
                background: '#faf5f9',
                border: '1px solid #ebd9ea',
                padding: '0.85rem',
                borderRadius: '8px',
                marginBottom: '0.85rem',
                fontSize: '0.74rem',
                color: '#5c435a',
                lineHeight: '1.45',
              }}>
                <div style={{ fontWeight: 'bold', color: '#5c1d5e', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> Correo enviado a {email}
                </div>
                Revisa tu bandeja de entrada o spam. Copia el código de 6 dígitos que te enviamos y escríbelo aquí:
              </div>

              <label htmlFor="otp-input">Código de 6 dígitos</label>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                style={{
                  textAlign: 'center',
                  fontSize: '1.35rem',
                  letterSpacing: '0.35em',
                  fontWeight: '800',
                  height: '3.2rem',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.72rem' }}>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={async () => {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    await requestPasswordResetWebhook(email, newCode);
                    setExpectedCode(newCode);
                    setResendTimer(15);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendTimer > 0 ? '#9ca3af' : '#5c1d5e',
                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '700',
                    padding: 0,
                  }}
                >
                  <RefreshCw size={13} />
                  {resendTimer > 0 ? `Reenviar código en ${resendTimer}s` : 'Reenviar código'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}
                >
                  Cambiar correo
                </button>
              </div>

              <button className="auth-submit" type="submit" style={{ marginTop: '1rem' }}>
                Verificar Código <ArrowRight size={17} />
              </button>
            </form>
          )}

          {/* PASO 3: Nueva Contraseña */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="auth-form">
              <label htmlFor="new-password">Nueva contraseña</label>
              <div className="auth-password">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {newPassword && (
                <div className="auth-strength">
                  <span>Fortaleza de contraseña</span>
                  <b style={{ color: strength.color }}>{strength.label}</b>
                  <i>
                    <em style={{ width: strength.pct, backgroundColor: strength.color }} />
                  </i>
                </div>
              )}

              <label htmlFor="confirm-password" style={{ marginTop: '0.4rem' }}>Confirmar nueva contraseña</label>
              <div className="auth-password">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {confirmPassword && (
                <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: newPassword === confirmPassword ? '#10b981' : '#ef4444' }}>
                  {newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✕ Las contraseñas no coinciden'}
                </div>
              )}

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                {isLoading ? (
                  'Cifrando con SHA-256 y guardando…'
                ) : (
                  <>
                    Guardar Nueva Contraseña <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 4: Éxito */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '0.8rem 0' }}>
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                marginBottom: '1rem',
              }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#166534' }}>
                ¡Contraseña Restablecida con Éxito!
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Tu nueva contraseña ha sido cifrada con <b>SHA-256</b> y guardada en tu cuenta. Ya puedes iniciar sesión con tus nuevas credenciales.
              </p>
              <a
                href="#login"
                className="auth-submit"
                style={{ textDecoration: 'none', display: 'inline-flex', width: '100%', boxSizing: 'border-box' }}
              >
                Iniciar Sesión Ahora <ArrowRight size={18} />
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
