import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { accessToken, user } = useAuth()

  /* No token → redirect to login */
  // No token → redirect to login
  if (!accessToken) return <Navigate to="/login" replace />

  /* Role check (optional) */
  // Role check (optional)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-full p-8 animate-fadeIn">
        <div className="card p-8 max-w-md w-full text-center border-accent-red/30 bg-bg-secondary">
          <div className="w-16 h-16 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">Access Restricted</h2>
          <p className="text-text-secondary text-sm">
            This section requires <span className="text-accent-cyan font-medium">{requiredRole}</span> role.
            Your current role is <span className="text-accent-amber font-medium">{user?.role}</span>.
          </p>
          <p className="font-mono text-xs text-accent-red mt-4 bg-accent-red/10 border border-accent-red/20 rounded-lg p-3">
            403 Forbidden — Insufficient role
          </p>
        </div>
      </div>
    )
  }

  return children
}