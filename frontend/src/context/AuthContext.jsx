import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { loginAdmin } from '../services/authService'
import { getStoredAuth, removeToken, saveToken } from '../utils/authToken'

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => getStoredAuth())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleAuthLogout = () => setAdmin(null)

    window.addEventListener('auth:logout', handleAuthLogout)

    return () => window.removeEventListener('auth:logout', handleAuthLogout)
  }, [])

  const login = async ({ email, password }) => {
    setLoading(true)

    try {
      const response = await loginAdmin({
        email: email.trim(),
        password,
      })

      const nextAdmin = {
        token: response.token,
        type: response.type,
        expiresIn: response.expiresIn,
        name: response.name,
        email: response.email,
        role: response.role,
        signedInAt: new Date().toISOString(),
      }

      saveToken(nextAdmin)
      setAdmin(nextAdmin)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: resolveAuthErrorMessage(error),
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    setAdmin(null)
  }

  const updateAdmin = (nextValues) => {
    setAdmin((currentAdmin) => {
      if (!currentAdmin) {
        return currentAdmin
      }

      const nextAdmin = {
        ...currentAdmin,
        ...nextValues,
        token: nextValues.token || currentAdmin.token,
        type: nextValues.type || currentAdmin.type,
        expiresIn: nextValues.expiresIn || currentAdmin.expiresIn,
      }

      saveToken(nextAdmin)
      return nextAdmin
    })
  }

  const value = useMemo(
    () => ({
      admin,
      loading,
      login,
      logout,
      updateAdmin,
      userAuthenticated: Boolean(admin?.token),
      isAuthenticated: Boolean(admin?.token),
    }),
    [admin, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function resolveAuthErrorMessage(error) {
  const validationErrors = error.response?.data?.validationErrors

  if (validationErrors) {
    return Object.values(validationErrors).join(' ')
  }

  if (error.response?.status === 401) {
    return error.response.data?.message || 'Invalid email or password.'
  }

  return error.response?.data?.message || 'Unable to sign in. Please try again.'
}
