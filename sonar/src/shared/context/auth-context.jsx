import { createContext, useContext, useMemo, useState } from 'react'
import { getUserByEmail } from '../services/api-client.js'

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

        // Comparación directa solo para la autenticación mock local.
        if (foundUser.password !== password) {
          throw new Error('La contraseña es incorrecta.')
        }

        setUser(foundUser)
        try {
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('sonar_auth_user', JSON.stringify(foundUser))
          }
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

    function logout() {
      setUser(null)
      setError(null)
      try {
        if (typeof window !== 'undefined') {
          window.localStorage?.removeItem('sonar_auth_user')
        }
      } catch {}
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
      logout,
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
