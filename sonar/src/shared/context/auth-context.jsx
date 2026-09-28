import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest, getUserByEmail, updateUser as updateUserApi, deleteUser as deleteUserApi } from '../services/api-client.js'
import { hashPassword } from '../services/crypto-service.js'
import { notifyLoginAlertWebhook } from '../services/n8n-webhooks.js'

// El contexto y el hook se exportan juntos como API de este módulo.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const authRevision = useRef(0)
  const [user, setUser] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage?.getItem('sonar_auth_user') : null
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // La cookie del servidor determina si la sesion sigue autorizada.
  useEffect(() => {
    let alive = true
    const refresh = () => {
      const revision = authRevision.current
      return apiRequest('/auth/me').then(current => {
        if (!alive || revision !== authRevision.current) return
        setUser(previous => JSON.stringify(previous) === JSON.stringify(current) ? previous : current)
        window.localStorage.setItem('sonar_auth_user', JSON.stringify(current))
      }).catch(() => {
        if (!alive || revision !== authRevision.current) return
        setUser(null)
        window.localStorage.removeItem('sonar_auth_user')
      })
    }
    refresh()
    const timer = setInterval(refresh, 15000)
    return () => { alive = false; clearInterval(timer) }
  }, [])

  // Cierre de sesión automático por inactividad:
  // - Usuario normal: 60 segundos (1 minuto)
  // - Administrador: 30 segundos
  useEffect(() => {
    if (!user) return;

    const timeoutMs = user.role === 'admin' ? 30000 : 60000;
    let timerId = null;

    const handleInactivityLogout = () => {
      authRevision.current++
      const roleLabel = user.role === 'admin' ? 'administrador (30 segundos)' : 'usuario (1 minuto)';
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
      setUser(null);
      setError(`Sesión cerrada por inactividad de ${roleLabel}.`);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage?.removeItem('sonar_auth_user');
          window.location.hash = '#login';
        }
      } catch {
        // Fallback
      }
    };

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(handleInactivityLogout, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
      events.forEach((evt) => {
        window.removeEventListener(evt, resetTimer);
      });
    };
  }, [user]);

  const value = useMemo(() => {
    async function login(email, password) {
      authRevision.current++
      setIsLoading(true)
      setError(null)

      try {
        const foundUser = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

        setUser(foundUser)
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(foundUser))
          }
        } catch {
          // La sesión continúa aunque el almacenamiento local no esté disponible.
        }

        // Disparo de notificación por correo mediante webhook de n8n
        try {
          notifyLoginAlertWebhook({
            email: foundUser.email,
            username: foundUser.username,
            device: typeof navigator !== 'undefined' ? navigator.userAgent : 'Navegador Web',
          }).catch(() => {})
        } catch {}

        return foundUser
      } catch (cause) {
        const loginError = cause instanceof Error
          ? cause
          : new Error('No se pudo iniciar sesión. Inténtalo de nuevo.')
        setError(loginError.message)
        throw loginError
      } finally {
        setIsLoading(false)
      }
    }

    /**
     * Inicia sesión con el token de credencial que entrega Google después del
     * consentimiento OAuth. Busca al usuario por email; si no existe, lo crea
     * automáticamente con los datos de perfil de Google.
     */
    async function loginWithGoogle(credential) {
      authRevision.current++
      setIsLoading(true)
      setError(null)
      try {
        const foundUser = await apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) })

        setUser(foundUser)
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(foundUser))
          }
        } catch { /* localStorage no disponible */ }

        // Disparo de notificación
        try {
          notifyLoginAlertWebhook({
            email: foundUser.email,
            username: foundUser.username,
            device: typeof navigator !== 'undefined' ? navigator.userAgent : 'Navegador Web',
          }).catch(() => {})
        } catch {}

        return foundUser
      } catch (cause) {
        const err = cause instanceof Error ? cause : new Error('No se pudo iniciar sesión con Google.')
        setError(err.message)
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    async function register({ username, email, password, preferences, avatarBg, bio, gear, accountType = 'standard', parentalControl = null, isJunior = false }) {
      authRevision.current++
      setIsLoading(true)
      setError(null)
      try {
        let existingUser = null
        try {
          existingUser = await getUserByEmail(email.trim().toLowerCase())
        } catch {
          // Fallback
        }

        if (existingUser) {
          throw new Error('Ya existe una cuenta con este correo electrónico.')
        }

        const emailStr = email.trim().toLowerCase();
        let hash = 0;
        for (let i = 0; i < emailStr.length; i++) {
          hash = (hash * 31 + emailStr.charCodeAt(i)) % 10000;
        }
        const genreList = [
          'Art Rock', 'Electrónica', 'Psicodelia', 'Jazz & Fusion',
          'Post-Punk', 'Synthwave', 'Ambient & Drone', 'Dream Pop',
          'Hip-Hop Experimental', 'Folk Acústico', 'IDM / Techno', 'Neo-Soul'
        ];
        const g1 = genreList[hash % genreList.length];
        const g2 = genreList[(hash + 3) % genreList.length];
        const initialPreferences = preferences && preferences.length > 0 ? preferences : [g1, g2];

        const avatarColors = ['#B80C09', '#5c1d5e', '#4B2840', '#0284c7', '#059669', '#d97706', '#7c3aed'];
        const selectedAvatarBg = avatarBg || avatarColors[hash % avatarColors.length];

        // Hasheo seguro SHA-256 con salt criptográfico
        const encryptedPassword = await hashPassword(password);

        const resolvedAccountType = accountType || (isJunior ? 'junior' : 'standard');
        const resolvedParentalControl = parentalControl || {
          enabled: resolvedAccountType === 'junior' || isJunior === true,
          blockExplicit: resolvedAccountType === 'junior' || isJunior === true,
          pin: '1234',
        };

        const newUser = {
          id: `user-${Date.now()}`,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: encryptedPassword,
          role: 'user',
          accountType: resolvedAccountType,
          parentalControl: resolvedParentalControl,
          avatarUrl: '',
          avatarBg: selectedAvatarBg,
          bio: bio || (resolvedAccountType === 'junior' 
            ? 'Melómano Junior explorando música segura y educativa en Sonar.' 
            : 'Nuevo melómano explorando vinilos y texturas acústicas en Sonar.'),
          stats: {
            savedAlbums: 0,
            reviewsCount: 0,
            followers: 0,
            following: 0,
          },
          preferences: initialPreferences,
          gear: gear || {
            headphones: 'Auriculares de referencia',
            turntable: 'Tocadiscos Direct Drive',
            favoriteFormat: 'Vinilo 33⅓ RPM',
          },
          badges: resolvedAccountType === 'junior'
            ? ['Melómano Junior', 'Audio Seguro']
            : ['Melómano Verificado', 'Audiófilo Inicial'],
          createdAt: new Date().toISOString(),
        }

        const savedUser = await apiRequest('/users', { method: 'POST', body: JSON.stringify(newUser) })
        Object.assign(newUser, savedUser)
        delete newUser.password

        setUser(newUser)
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(newUser))
          }
        } catch { /* El almacenamiento local puede no estar disponible. */ }

        return newUser
      } catch (cause) {
        const regError = cause instanceof Error
          ? cause
          : new Error('No se pudo completar el registro.')
        setError(regError.message)
        throw regError
      } finally {
        setIsLoading(false)
      }
    }

    async function changePassword(oldPassword, newPassword) {
      if (!user) throw new Error('Debes iniciar sesión para cambiar tu contraseña.')
      if (!newPassword || newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres.')
      }

      return apiRequest('/auth/password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) })
    }

    function logout() {
      authRevision.current++
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {})
      setUser(null)
      setError(null)
      try {
        if (typeof window !== 'undefined') {
          window.localStorage?.removeItem('sonar_auth_user')
        }
      } catch {
        // El cierre de sesión no depende de localStorage.
      }
    }

    async function deleteAccount() {
      if (!user?.id) throw new Error('Debes haber iniciado sesión para eliminar tu cuenta.')
      const targetId = user.id
      try {
        await deleteUserApi(targetId)
      } catch {
        // Fallback local
      }
      logout()
      if (typeof window !== 'undefined') {
        window.location.hash = '#home'
      }
      return true
    }

    function updateUser(changes) {
      setUser((prev) => {
        const updated = { ...(prev || {}), ...changes }
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(updated))
          }
          if (updated.id) {
            updateUserApi(updated.id, changes).catch(() => {})
          }
        } catch { /* El almacenamiento local o API puede no estar disponible. */ }
        return updated
      })
    }

    function updateParentalControl({ enabled, blockExplicit, pin, accountType }) {
      if (!user) throw new Error('Debes iniciar sesión para configurar el control parental.');
      const currentPC = user.parentalControl || { enabled: false, blockExplicit: false, pin: '1234' };
      const nextPC = {
        ...currentPC,
        ...(enabled !== undefined ? { enabled: Boolean(enabled) } : {}),
        ...(blockExplicit !== undefined ? { blockExplicit: Boolean(blockExplicit) } : {}),
        ...(pin !== undefined && pin ? { pin: String(pin).trim() } : {}),
      };
      
      let nextAccountType = accountType !== undefined ? accountType : user.accountType;
      if (nextPC.enabled === false || nextPC.blockExplicit === false) {
        if (nextAccountType === 'junior') {
          nextAccountType = 'standard';
        }
      } else if (nextPC.enabled && nextPC.blockExplicit) {
        if (accountType === 'junior') {
          nextAccountType = 'junior';
        }
      }
      
      updateUser({
        parentalControl: nextPC,
        accountType: nextAccountType,
      });
      return nextPC;
    }

    function verifyParentalPin(pinInput) {
      if (!user) return false;
      const expectedPin = user.parentalControl?.pin || '1234';
      return String(pinInput).trim() === String(expectedPin).trim();
    }

    function hasRole(role) {
      return user !== null && user.role === role;
    }

    const isParentalControlActive = Boolean(
      user?.accountType === 'junior' ||
      (user?.parentalControl?.enabled && user?.parentalControl?.blockExplicit)
    );

    return {
      user,
      isAuthenticated: user !== null,
      isLoading,
      error,
      login,
      loginWithGoogle,
      register,
      changePassword,
      logout,
      deleteAccount,
      updateUser,
      updateParentalControl,
      verifyParentalPin,
      isParentalControlActive,
      isJunior: user?.accountType === 'junior',
      hasRole,
      isAdmin: hasRole('admin'),
      isUser: hasRole('user'),
    }
  }, [user, isLoading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}
