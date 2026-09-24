import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, Eye, EyeOff, Sparkles, Music2, UserCheck, HelpCircle } from 'lucide-react';
import { getUserByEmail, updateUser, getUsers } from '../../../shared/services/api-client';
import { hashPassword } from '../../../shared/services/crypto-service';
import { RotatingReview } from './rotating-review';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';

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
        Verificación de identidad instantánea mediante desafío de perfil sonoro y cifrado criptográfico SHA-256.
      </p>
    </div>
    <RotatingReview />
    <div className="auth-editorial__stats">
      <span>
        <ShieldCheck size={14} />
        Validación directa sin correo externo
      </span>
      <span>Cifrado SHA-256 protegido</span>
    </div>
  </aside>
);

export const ForgotPasswordForm = () => {
  // Pasos: 1 = Buscar Cuenta, 2 = Desafío de Identidad Musical/Usuario, 3 = Nueva Contraseña, 4 = Éxito
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  
  // Desafío de seguridad: género musical registrado o nombre de usuario
  const [challengeMethod, setChallengeMethod] = useState('genre'); // 'genre' | 'username'
  const [selectedGenre, setSelectedGenre] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [genreOptions, setGenreOptions] = useState([]);

  // Nueva contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Paso 1: Buscar la cuenta por Correo o @Usuario
  const handleFindAccount = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = identifier.trim().toLowerCase().replace(/^@/, '');

    if (!cleanId) {
      setErrorMessage('Por favor introduce tu correo electrónico o nombre de usuario.');
      return;
    }

    setIsLoading(true);
    try {
      let found = await getUserByEmail(cleanId);
      if (!found) {
        const allUsers = await getUsers();
        found = allUsers.find(
          (u) =>
            u.email?.toLowerCase() === cleanId ||
            u.username?.toLowerCase() === cleanId ||
            u.username?.toLowerCase().replace(/\s+/g, '_') === cleanId
        );
      }

      if (!found) {
        throw new Error('No encontramos ninguna cuenta con ese correo o usuario.');
      }

      setTargetUser(found);

      // Preparar opciones de género musical para el desafío
      const userGenres = found.preferences && found.preferences.length > 0
        ? found.preferences
        : ['Art Rock', 'Electrónica'];
      
      const correctGenre = userGenres[Math.floor(Math.random() * userGenres.length)];
      const otherGenres = GENRE_OPTIONS.filter((g) => !userGenres.includes(g)).slice(0, 3);
      const shuffled = [correctGenre, ...otherGenres].sort(() => Math.random() - 0.5);

      setGenreOptions(shuffled);
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Error al buscar la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 2: Verificar desafío de seguridad
  const handleVerifyChallenge = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (challengeMethod === 'genre') {
      if (!selectedGenre) {
        setErrorMessage('Por favor selecciona uno de los géneros musicales de tu perfil.');
        return;
      }
      const userGenres = targetUser?.preferences || ['Art Rock', 'Electrónica'];
      if (!userGenres.includes(selectedGenre)) {
        setErrorMessage('El género seleccionado no coincide con las preferencias de esta cuenta.');
        return;
      }
      setStep(3);
    } else {
      const cleanUser = confirmUsername.trim().toLowerCase().replace(/^@/, '');
      const actualUser = (targetUser?.username || '').trim().toLowerCase().replace(/\s+/g, '_');
      if (cleanUser !== actualUser && cleanUser !== (targetUser?.username || '').trim().toLowerCase()) {
        setErrorMessage('El nombre de usuario no coincide con la cuenta registrada.');
        return;
      }
      setStep(3);
    }
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

      // Si el usuario actual en sesión era este, actualizar la sesión
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
    if (len < 6) return { label: 'Débil', pct: '30%', color: '#ef4444' };
    if (len < 10) return { label: 'Buena', pct: '70%', color: '#f59e0b' };
    return { label: 'Excelente (Cifrada SHA-256)', pct: '100%', color: '#10b981' };
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
              {step === 1 && 'Ingresa tu correo o usuario para verificar tu cuenta al instante.'}
              {step === 2 && 'Confirma tu identidad mediante el desafío de seguridad de tu cuenta.'}
              {step === 3 && 'Define tu nueva contraseña con cifrado de seguridad SHA-256.'}
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

          {/* PASO 1: Ingreso de correo o usuario */}
          {step === 1 && (
            <form onSubmit={handleFindAccount} className="auth-form">
              <label htmlFor="recovery-identifier">Correo electrónico o Nombre de usuario</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="recovery-identifier"
                  type="text"
                  required
                  placeholder="tu@ejemplo.com o @usuario"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  style={{ paddingLeft: '2.4rem' }}
                />
                <UserCheck size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#856f80' }} />
              </div>

              <div style={{ marginTop: '0.65rem', background: '#faf5f9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ebd9ea', fontSize: '0.73rem', color: '#5c435a', lineHeight: '1.4' }}>
                ⚡ <b>Recuperación directa sin correo:</b> Puedes usar cuentas de demostración como <code>mateo@email.com</code> o la cuenta que acabas de registrar.
              </div>

              <button className="auth-submit" type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
                {isLoading ? 'Verificando cuenta...' : (
                  <>
                    Continuar a Verificación <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: Desafío de Seguridad Audiófilo */}
          {step === 2 && (
            <form onSubmit={handleVerifyChallenge} className="auth-form">
              {/* Tarjeta de Cuenta Encontrada */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: '#fdf2f8',
                border: '1px solid #fbcfe8',
                marginBottom: '0.85rem'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: targetUser?.avatarBg || '#5c1d5e',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {targetUser?.username ? targetUser.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#831843' }}>
                    @{targetUser?.username}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9d174d' }}>
                    {targetUser?.email}
                  </div>
                </div>
              </div>

              {/* Selector de Método de Verificación */}
              <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setChallengeMethod('genre')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: challengeMethod === 'genre' ? '1px solid #5c1d5e' : '1px solid #e5e7eb',
                    background: challengeMethod === 'genre' ? '#5c1d5e' : '#f9fafb',
                    color: challengeMethod === 'genre' ? '#ffffff' : '#4b5563',
                  }}
                >
                  <Music2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  Desafío Musical
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeMethod('username')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: challengeMethod === 'username' ? '1px solid #5c1d5e' : '1px solid #e5e7eb',
                    background: challengeMethod === 'username' ? '#5c1d5e' : '#f9fafb',
                    color: challengeMethod === 'username' ? '#ffffff' : '#4b5563',
                  }}
                >
                  <UserCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  Confirmar Usuario
                </button>
              </div>

              {challengeMethod === 'genre' ? (
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                    <HelpCircle size={14} color="#B80C09" />
                    ¿Cuál de estos géneros forma parte de tu perfil?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {genreOptions.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setSelectedGenre(genre);
                          if (errorMessage) setErrorMessage('');
                        }}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: selectedGenre === genre ? '2px solid #B80C09' : '1px solid #e5e7eb',
                          backgroundColor: selectedGenre === genre ? '#fff1f2' : '#ffffff',
                          color: selectedGenre === genre ? '#B80C09' : '#374151',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {selectedGenre === genre ? `✓ ${genre}` : genre}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="confirm-user-input">Escribe tu nombre de usuario exacto</label>
                  <input
                    id="confirm-user-input"
                    type="text"
                    required
                    placeholder="ej: mateo o tu_usuario"
                    value={confirmUsername}
                    onChange={(e) => {
                      setConfirmUsername(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem', fontSize: '0.72rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  ← Cambiar cuenta
                </button>
              </div>

              <button className="auth-submit" type="submit" style={{ marginTop: '0.85rem' }}>
                Validar Identidad <ArrowRight size={17} />
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
                Tu nueva contraseña ha sido cifrada mediante el algoritmo <b>SHA-256</b> con salt único. Ya puedes iniciar sesión sin problemas.
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
