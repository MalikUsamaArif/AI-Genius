import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Access token lives in memory only — never localStorage
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends/receives httpOnly cookies
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      setAccessToken(data.accessToken)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include'
      })
    } catch (_) { /* ignore network errors on logout */ }
    setAccessToken(null)
    setUser(null)
  }, [accessToken])

  // Silent refresh — uses the httpOnly cookie automatically
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setAccessToken(data.accessToken)
      return data.accessToken
    } catch (_) {
      setAccessToken(null)
      setUser(null)
      return null
    }
  }, [])

  // Helper for authenticated API calls — auto-attaches Bearer token
  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
      },
      credentials: 'include'
    })
    return res
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, refresh, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
