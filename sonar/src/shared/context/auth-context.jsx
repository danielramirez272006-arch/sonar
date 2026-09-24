import { userStatus } from '../services/admin-data.js'
import { createContext, useContext, useMemo, useState } from 'react'
import { getUserByEmail, createUser, updateUser as updateUserApi } from '../services/api-client.js'

// El contexto y el hook se exportan juntos como API de este módulo.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
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

  const value = useMemo(() => {
    async function login(email, password) {
      setIsLoading(true)
      setError(null)

      try {
        const foundUser = await getUserByEmail(email)

        if (!foundUser) {
          throw new Error('No existe un usuario con ese correo electrónico.')
        }

        if (['banned', 'suspended'].includes(userStatus(foundUser))) {
          throw new Error('Esta cuenta está baneada y no puede iniciar sesión.')
        }

        // Comparación directa solo para la autenticación mock local.
        if (foundUser.password !== password) {
          throw new Error('La contraseña es incorrecta.')
        }

        setUser(foundUser)
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(foundUser))
          }
        } catch {
          // La sesión continúa aunque el almacenamiento local no esté disponible.
        }
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

    async function register({ username, email, password, preferences, avatarBg, bio }) {
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

        const newUser = {
          id: `user-${Date.now()}`,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: 'user',
          avatarUrl: '',
          avatarBg: selectedAvatarBg,
          bio: bio || 'Nuevo melómano explorando vinilos y texturas acústicas en Sonar.',
          stats: {
            savedAlbums: 0,
            reviewsCount: 0,
            followers: 0,
            following: 0,
          },
          preferences: initialPreferences,
        }

        try {
          await createUser(newUser)
        } catch {
          // json-server mock fallback
        }

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

    function logout() {
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
        } catch { /* El almacenamiento local puede no estar disponible. */ }
        return updated
      })
    }

    function hasRole(role) {
      return user !== null && user.role === role
    }

    return {
      user,
      isAuthenticated: user !== null,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUser,
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
