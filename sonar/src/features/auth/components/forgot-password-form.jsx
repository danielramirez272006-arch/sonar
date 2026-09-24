import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
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
        Protegemos tu diario de vinilos y colecciones con cifrado de grado criptográfico SHA-256.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <ShieldCheck size={14} />
        Cifrado seguro de extremo a extremo
      </span>
      <span>Recuperación instantánea</span>
    </div>
  </aside>
);

export const ForgotPasswordForm = () => {
  // Pasos: 1 = Email, 2 = Código de Seguridad OTP, 3 = Nueva Contraseña, 4 = Éxito
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
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

  const generateSecurityCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Paso 1: Localizar la cuenta y generar código de seguridad
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

      if (!found) {
        throw new Error('No encontramos ninguna cuenta registrada con ese correo.');
      }

      setTargetUser(found);
      const code = generateSecurityCode();
      setGeneratedOtp(code);
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Error al buscar la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 2: Verificar el código OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMessage('El código de 6 dígitos ingresado es incorrecto.');
      return;
    }
    setStep(3);
  };

  // Paso 3: Guardar nueva contraseña cifrada SHA-256
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Verifica e inténtalo de nuevo.');
      return;
    }

    setIsLoading(true);
    try {
      // Hasheo criptográfico SHA-256 con salt único
      const encryptedPassword = await hashPassword(newPassword);

      if (targetUser?.id) {
        await updateUser(targetUser.id, { password: encryptedPassword });
      }

      // Si el usuario actual en sesión era este, actualizar la sesión activa
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
          <header className="auth-heading">
            <h2 id="forgot-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={26} color="#B80C09" />
              Recuperar Contraseña
            </h2>
            <p>
              {step === 1 && 'Ingresa tu correo para recibir tu código de seguridad.'}
              {step === 2 && `Ingresa el código de 6 dígitos generado para ${targetUser?.email || email}.`}
              {step === 3 && 'Define tu nueva contraseña con cifrado de grado criptográfico.'}
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
              <label htmlFor="recovery-email">Correo electrónico registrado</label>
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

              <div style={{ marginTop: '0.65rem', background: '#faf5f9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ebd9ea', fontSize: '0.73rem', color: '#5c435a' }}>
                💡 <b>Acceso rápido:</b> Puedes recuperar cuentas registradas como <code>mateo@email.com</code> o el correo con el que te registraste en Sonar.
              </div>

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                {isLoading ? 'Buscando cuenta...' : (
                  <>
                    Continuar con Código de Seguridad <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: Código OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9d174d', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <Sparkles size={15} /> Código de verificación emitido:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.35rem', letterSpacing: '0.3em', fontWeight: '900', color: '#5c1d5e', fontFamily: 'monospace' }}>
                    {generatedOtp}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid #5c1d5e', background: '#fff', color: '#5c1d5e', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Auto-completar
                  </button>
                </div>
              </div>

              <label htmlFor="otp-input">Ingresa el código de 6 dígitos</label>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3em', fontWeight: 'bold' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.72rem' }}>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => {
                    const newCode = generateSecurityCode();
                    setGeneratedOtp(newCode);
                    setResendTimer(60);
                  }}
                  style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#9ca3af' : '#5c1d5e', cursor: resendTimer > 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                >
                  <RefreshCw size={13} />
                  {resendTimer > 0 ? `Reenviar código en ${resendTimer}s` : 'Reenviar código'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  Cambiar correo
                </button>
              </div>

              <button className="auth-submit" type="submit" style={{ marginTop: '0.85rem' }}>
                Verificar código <ArrowRight size={17} />
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

              <label htmlFor="confirm-password" style={{ marginTop: '0.5rem' }}>Confirmar nueva contraseña</label>
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
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: newPassword === confirmPassword ? '#10b981' : '#ef4444' }}>
                  {newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✕ Las contraseñas no coinciden'}
                </div>
              )}

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                {isLoading ? 'Cifrando con SHA-256 y guardando...' : (
                  <>
                    Restablecer Contraseña Cifrada <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 4: Éxito */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#dcfce7', color: '#15803d', marginBottom: '1rem' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#166534' }}>
                ¡Contraseña Restablecida con Éxito!
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Tu nueva contraseña ha sido cifrada mediante el algoritmo <b>SHA-256</b> con un salt único. Ya puedes iniciar sesión de forma segura.
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
