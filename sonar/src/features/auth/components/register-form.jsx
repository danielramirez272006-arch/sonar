import { useState, useEffect } from 'react';
import { ArrowRight, Check, Eye, EyeOff, Headphones, Music2, Sparkles, User, Disc3, ShieldCheck, Mail, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../shared/context/auth-context';
import { GoogleIcon, SpotifyIcon } from './social-provider-icon';
import { RotatingReview } from './rotating-review';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';
import { requestRegisterOtpWebhook } from '../../../shared/services/n8n-webhooks';

const AVATAR_PALETTES = [
  { color: '#B80C09', label: 'Carmesí Vinilo' },
  { color: '#5c1d5e', label: 'Púrpura Sonar' },
  { color: '#0284c7', label: 'Azul Eléctrico' },
  { color: '#059669', label: 'Verde Esmeralda' },
  { color: '#d97706', label: 'Ámbar Vintage' },
  { color: '#7c3aed', label: 'Violeta Neón' },
  { color: '#ec4899', label: 'Rosa Synth' },
  { color: '#0f172a', label: 'Obsidiana' },
];

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

      {/* Badges de características audiófilas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '1.1rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.75)', fontSize: '0.68rem', fontWeight: '800', color: '#5c1d5e', border: '1px solid rgba(92,29,94,0.12)', boxShadow: '0 2px 6px rgba(92,29,94,0.05)' }}>
          <Headphones size={13} style={{ color: '#B80C09' }} /> Muestras de Audio HD
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.75)', fontSize: '0.68rem', fontWeight: '800', color: '#5c1d5e', border: '1px solid rgba(92,29,94,0.12)', boxShadow: '0 2px 6px rgba(92,29,94,0.05)' }}>
          <Sparkles size={13} style={{ color: '#d97706' }} /> Análisis de Letras IA
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.75)', fontSize: '0.68rem', fontWeight: '800', color: '#5c1d5e', border: '1px solid rgba(92,29,94,0.12)', boxShadow: '0 2px 6px rgba(92,29,94,0.05)' }}>
          <Disc3 size={13} style={{ color: '#B80C09' }} /> Reseñas de Vinilos
        </span>
      </div>
    </div>

    {/* Tarjeta de Reseñas Rotativas Centrada */}
    <div style={{ margin: '1rem 0' }}>
      <RotatingReview />
    </div>

    {/* Estadísticas de la Comunidad */}
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
  const [step, setStep] = useState('info'); // 'info' | 'otp' | 'password'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: ['Art Rock', 'Electrónica', 'Psicodelia'],
    avatarBg: '#B80C09',
    accountType: 'standard',
    parentalPin: '1234',
  });

  const [enteredOtp, setEnteredOtp] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer = null;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendTimer]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const setValue = (field) => (event) => {
    let val = event.target.value;
    if (field === 'username') {
      val = val.replace(/\s+/g, '_');
    }
    setFormData({ ...formData, [field]: val });
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

  // Validación de seguridad de contraseña
  const hasMinLength = formData.password.length >= 6;
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { label: 'Requerida', pct: '0%', color: 'transparent' };
    if (!hasMinLength) return { label: 'Débil (mínimo 6)', pct: '30%', color: '#ef4444' };
    if (hasMinLength && !hasNumberOrSpecial) return { label: 'Aceptable', pct: '65%', color: '#f59e0b' };
    return { label: 'Excelente (Cifrado SHA-256)', pct: '100%', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  // Paso 1 ➔ Enviar Código OTP mediante Webhook n8n
  const handleRequestOtp = async (event) => {
    event?.preventDefault();
    setErrorMessage('');

    if (!formData.username.trim()) {
      setErrorMessage('Por favor introduce un nombre de usuario.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Por favor introduce un correo electrónico válido.');
      return;
    }
    if (formData.accountType === 'junior') {
      const pin = formData.parentalPin ? formData.parentalPin.trim() : '1234';
      if (pin.length !== 4) {
        setErrorMessage('El PIN de control parental para cuenta Junior debe tener exactamente 4 dígitos (ej. 1234).');
        return;
      }
    }

    setIsSendingOtp(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const res = await requestRegisterOtpWebhook(formData.email, formData.username, otpCode);
      const codeToVerify = res.code || otpCode;
      setSentOtpCode(codeToVerify);
      setOtpNotice(`Código enviado a ${formData.email}. Revisa tu bandeja de entrada.`);
      setResendTimer(15);
      setStep('otp');
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo enviar el código de verificación a tu correo.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Paso 2 ➔ Verificar Código OTP al presionar el botón
  const handleVerifyOtp = (event) => {
    event?.preventDefault();
    setErrorMessage('');

    const cleanInput = enteredOtp.trim();
    if (!cleanInput) {
      setErrorMessage('Por favor ingresa el código de 6 dígitos que llegó a tu correo.');
      return;
    }

    if (cleanInput.length !== 6) {
      setErrorMessage('El código debe tener exactamente 6 dígitos.');
      return;
    }

    if (!sentOtpCode || cleanInput === sentOtpCode) {
      setStep('password');
      setErrorMessage('');
    } else {
      setErrorMessage('El código de 6 dígitos ingresado es incorrecto. Por favor revisa tu correo e inténtalo de nuevo.');
    }
  };

  const handleOtpInputChange = (event) => {
    const val = event.target.value.replace(/\D/g, '').slice(0, 6);
    setEnteredOtp(val);
    if (errorMessage) setErrorMessage('');
  };

  // Paso 3 ➔ Crear cuenta con la contraseña personalizada elegida
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!hasMinLength) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Debes aceptar los Términos y Condiciones para crear tu cuenta.');
      return;
    }

    const pin = (formData.parentalPin && formData.parentalPin.trim().length === 4) 
      ? formData.parentalPin.trim() 
      : '1234';

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        preferences: formData.preferences,
        avatarBg: formData.avatarBg,
        accountType: formData.accountType,
        isJunior: formData.accountType === 'junior',
        parentalControl: {
          enabled: formData.accountType === 'junior',
          blockExplicit: formData.accountType === 'junior',
          pin: pin,
        },
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
      avatarBg: formData.avatarBg,
      preferences: formData.preferences,
      accountType: formData.accountType,
      isJunior: formData.accountType === 'junior',
      parentalControl: {
        enabled: formData.accountType === 'junior',
        blockExplicit: formData.accountType === 'junior',
        pin: formData.parentalPin || '1234',
      },
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
            <h2 id="register-title">
              {step === 'info' && 'Crea tu cuenta en Sonar'}
              {step === 'otp' && 'Verifica tu Correo'}
              {step === 'password' && 'Define tu Contraseña'}
            </h2>
            <p>
              {step === 'info' && 'Personaliza tu identidad y recibe tu código de seguridad.'}
              {step === 'otp' && 'Ingresa el código de 6 dígitos que enviamos a tu bandeja.'}
              {step === 'password' && 'Elige la contraseña que desees para acceder a Sonar.'}
            </p>
          </header>

          {/* Stepper Visual de Registro */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.65rem',
            backgroundColor: '#faf5f9',
            border: '1px solid #ebd9ea',
            fontSize: '0.65rem',
            fontWeight: '800',
          }}>
            <span style={{ color: step === 'info' ? '#B80C09' : '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              {step !== 'info' ? <Check size={12} /> : '1.'} Datos
            </span>
            <span style={{ color: '#d1c5cf' }}>➔</span>
            <span style={{ color: step === 'otp' ? '#B80C09' : step === 'password' ? '#10b981' : '#856f80', display: 'flex', alignItems: 'center', gap: '3px' }}>
              {step === 'password' ? <Check size={12} /> : '2.'} Código OTP
            </span>
            <span style={{ color: '#d1c5cf' }}>➔</span>
            <span style={{ color: step === 'password' ? '#B80C09' : '#856f80' }}>
              3. Contraseña
            </span>
          </div>

          {step === 'info' && (
            <>
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

              <form className="auth-form" onSubmit={handleRequestOtp}>
                {/* Live Profile Preview & Avatar Color Starter */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: '0.65rem',
                  backgroundColor: '#faf5f9',
                  border: '1px solid #ebd9ea',
                  marginBottom: '0.4rem',
                }}>
                  <div style={{
                    position: 'relative',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: formData.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                    transition: 'background-color 0.25s ease',
                  }}>
                    {formData.username ? formData.username.charAt(0).toUpperCase() : <Disc3 size={24} className="animate-spin" style={{ animationDuration: '6s' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#342632' }}>
                        Identidad Sonora
                      </span>
                      <span style={{ fontSize: '0.62rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                        Personalizable
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {AVATAR_PALETTES.map((palette) => (
                        <button
                          key={palette.color}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatarBg: palette.color })}
                          title={palette.label}
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: palette.color,
                            border: formData.avatarBg === palette.color ? '2px solid #231123' : '2px solid transparent',
                            transform: formData.avatarBg === palette.color ? 'scale(1.2)' : 'scale(1)',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.15s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selector de Tipo de Cuenta & Control Parental */}
                <div style={{ marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5c435a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                    <ShieldCheck size={14} color="#B80C09" />
                    Modalidad de Cuenta & Control Parental
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accountType: 'standard' })}
                      style={{
                        padding: '0.55rem 0.5rem',
                        borderRadius: '0.6rem',
                        textAlign: 'left',
                        border: formData.accountType === 'standard' ? '2px solid #B80C09' : '1px solid #ebd9ea',
                        backgroundColor: formData.accountType === 'standard' ? '#fff0f2' : '#faf5f9',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Headphones size={13} color={formData.accountType === 'standard' ? '#B80C09' : '#5c435a'} />
                        <span style={{ fontSize: '0.74rem', fontWeight: '800', color: formData.accountType === 'standard' ? '#B80C09' : '#231123' }}>
                          Estándar
                        </span>
                      </div>
                      <p style={{ fontSize: '0.6rem', color: '#665163', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                        Catálogo libre completo
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accountType: 'junior' })}
                      style={{
                        padding: '0.55rem 0.5rem',
                        borderRadius: '0.6rem',
                        textAlign: 'left',
                        border: formData.accountType === 'junior' ? '2px solid #B80C09' : '1px solid #ebd9ea',
                        backgroundColor: formData.accountType === 'junior' ? '#fff0f2' : '#faf5f9',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ShieldCheck size={13} color={formData.accountType === 'junior' ? '#B80C09' : '#5c435a'} />
                        <span style={{ fontSize: '0.74rem', fontWeight: '800', color: formData.accountType === 'junior' ? '#B80C09' : '#231123' }}>
                          Junior (Segura)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.6rem', color: '#665163', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                        Filtro explícito [E] y PIN
                      </p>
                    </button>
                  </div>

                  {formData.accountType === 'junior' && (
                    <div style={{ marginTop: '0.4rem', padding: '0.45rem 0.65rem', borderRadius: '0.5rem', backgroundColor: '#fff', border: '1px solid #fecdd3', fontSize: '0.65rem', color: '#881337', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>🔒 PIN Parental (4 dígitos):</span>
                        <input
                          type="text"
                          maxLength={4}
                          pattern="[0-9]*"
                          value={formData.parentalPin}
                          onChange={(e) => setFormData({ ...formData, parentalPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          placeholder="1234"
                          style={{ width: '60px', padding: '2px 6px', fontSize: '0.75rem', fontFamily: 'monospace', textAlign: 'center', border: '1px solid #e11d48', borderRadius: '4px' }}
                        />
                      </div>
                      <span style={{ opacity: 0.85, fontSize: '0.59rem' }}>
                        Las pistas con contenido explícito requerirán este PIN para desbloquear su reproducción.
                      </span>
                    </div>
                  )}
                </div>

                <label htmlFor="username">Nombre de usuario</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="username"
                    required
                    autoComplete="username"
                    placeholder="tu_usuario"
                    value={formData.username}
                    onChange={setValue('username')}
                    style={{ paddingLeft: '2.2rem' }}
                  />
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#856f80', fontWeight: 'bold' }}>
                    @
                  </span>
                </div>
                <small style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Tu enlace público: <b>sonar.fm/@{formData.username || 'tu_usuario'}</b></span>
                  {formData.username.length >= 3 && (
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Check size={11} /> Válido
                    </span>
                  )}
                </small>

                <label htmlFor="register-email" style={{ marginTop: '0.2rem' }}>Correo electrónico</label>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@ejemplo.com"
                  value={formData.email}
                  onChange={setValue('email')}
                />

                {/* Calibración de Gustos Musicales Iniciales */}
                <div className="auth-genres-selection" style={{ marginTop: '0.75rem', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5c435a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={13} color="#B80C09" />
                      Calibra tus Gustos
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#B80C09', fontWeight: 'bold' }}>
                      {formData.preferences.length} seleccionados
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '6.5rem', overflowY: 'auto', padding: '2px' }}>
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
                            fontSize: '0.68rem',
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

                {errorMessage && (
                  <p className="auth-error" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button className="auth-submit" type="submit" disabled={isSendingOtp} style={{ marginTop: '0.6rem' }}>
                  {isSendingOtp ? (
                    'Enviando código de verificación…'
                  ) : (
                    <>
                      Continuar y Verificar Correo <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <div style={{
                textAlign: 'center',
                padding: '1.1rem 1rem',
                borderRadius: '0.8rem',
                backgroundColor: '#faf5f9',
                border: '1px solid #ebd9ea',
                marginBottom: '0.9rem',
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#B80C09',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.6rem auto',
                }}>
                  <Mail size={24} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#231123', margin: 0 }}>
                  Código de Verificación
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#665163', marginTop: '0.4rem', lineHeight: '1.45' }}>
                  Hemos enviado un código de 6 dígitos a <b>{formData.email}</b>. Ingrésalo para activar tu cuenta:
                </p>
              </div>

              <label htmlFor="otp-input" style={{ textAlign: 'center', display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                Ingresa los 6 dígitos recibidos
              </label>
              <input
                id="otp-input"
                type="text"
                autoFocus
                required
                maxLength={6}
                pattern="[0-9]*"
                placeholder="• • • • • •"
                value={enteredOtp}
                onChange={handleOtpInputChange}
                style={{
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  letterSpacing: '0.45em',
                  fontFamily: 'monospace',
                  fontWeight: '900',
                  padding: '0.65rem',
                  borderRadius: '0.65rem',
                  border: '2px solid #5c1d5e',
                  backgroundColor: '#ffffff',
                }}
              />

              <p style={{ fontSize: '0.68rem', color: '#856f80', textAlign: 'center', margin: '0.4rem 0 0.2rem 0' }}>
                🔒 Ingresa los 6 dígitos y presiona Verificar Código
              </p>

              {errorMessage && (
                <p className="auth-error" role="alert" style={{ marginTop: '0.5rem' }}>
                  {errorMessage}
                </p>
              )}

              <button className="auth-submit" type="submit" style={{ marginTop: '0.7rem' }}>
                Verificar Código <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', fontSize: '0.72rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  style={{ background: 'none', border: 'none', color: '#665163', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <ArrowLeft size={13} /> Cambiar correo
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isSendingOtp || resendTimer > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendTimer > 0 ? '#9ca3af' : '#B80C09',
                    fontWeight: 'bold',
                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <RefreshCw size={13} className={isSendingOtp ? 'animate-spin' : ''} />
                  {resendTimer > 0 ? `Reenviar código (${resendTimer}s)` : 'Reenviar código'}
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.65rem',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                color: '#166534',
                fontSize: '0.72rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>
                <Check size={16} /> Correo <b>{formData.email}</b> verificado con éxito
              </div>

              <label htmlFor="register-password" style={{ marginTop: '0.2rem' }}>Elige tu contraseña</label>
              <div className="auth-password">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
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
                  <span>Nivel de seguridad</span>
                  <b style={{ color: strength.color }}>{strength.label}</b>
                  <i>
                    <em style={{ width: strength.pct, backgroundColor: strength.color }} />
                  </i>
                </div>
              )}

              {/* Confirm Password Field */}
              <label htmlFor="register-confirm-password" style={{ marginTop: '0.2rem' }}>Confirmar contraseña</label>
              <div className="auth-password">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={setValue('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div style={{ fontSize: '0.66rem', fontWeight: 'bold', color: passwordsMatch ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {passwordsMatch ? (
                    <>
                      <Check size={13} /> Las contraseñas coinciden perfectamente
                    </>
                  ) : (
                    '✕ Las contraseñas no coinciden'
                  )}
                </div>
              )}

              {/* Checklist de requisitos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.3rem',
                background: '#f8f4f7',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.62rem',
                color: '#5c435a',
                marginTop: '0.2rem',
              }}>
                <span style={{ color: hasMinLength ? '#10b981' : '#856f80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {hasMinLength ? '✓' : '○'} Mínimo 6 letras
                </span>
                <span style={{ color: hasNumberOrSpecial ? '#10b981' : '#856f80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {hasNumberOrSpecial ? '✓' : '○'} Números o símbolos
                </span>
              </div>

              {errorMessage && (
                <p className="auth-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <label className="auth-check" style={{ cursor: 'pointer', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span>Deseo recibir la selección curatorial semanal y análisis de letras vía IA.</span>
              </label>

              <label className="auth-check" style={{ marginTop: '0.25rem', cursor: 'pointer' }}>
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
                <span style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
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
                    }}
                    title="Abrir y leer Términos y Condiciones"
                  >
                    Términos y Condiciones
                  </a>{' '}
                  de Sonar.
                </span>
              </label>

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '0.6rem' }}>
                {isLoading ? (
                  'Creando y Cifrando cuenta…'
                ) : (
                  <>
                    Crear mi Radar Sonoro <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('otp')}
                style={{ background: 'none', border: 'none', color: '#665163', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '0.5rem' }}
              >
                <ArrowLeft size={13} /> Volver a verificación de código
              </button>
            </form>
          )}

          <p className="auth-switch">
            ¿Ya tienes cuenta? <a href="#login">Inicia sesión aquí</a>
          </p>
          <p className="auth-legal">
            Al registrarte tus contraseñas se almacenan con cifrado unidireccional SHA-256 según la Política de Privacidad de Sonar.
          </p>
        </div>
      </section>
    </div>
  );
};

export default RegisterForm;