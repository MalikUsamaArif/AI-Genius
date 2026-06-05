import { Lock, ArrowRight } from 'lucide-react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../context/AuthContext'
 
export default function AccessDenied({ requiredRole, description }) {
  const { user }   = useAuth()
  const navigate   = useNavigate()
 
  return (
    <div className="flex items-center justify-center h-full p-8 animate-fadeIn">
      <div className="card p-10 max-w-lg w-full text-center border-accent-red/30">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-accent-red" size={32} />
        </div>
 
        {/* Title */}
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
          Access Restricted
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          {description || `This section requires ${requiredRole || 'elevated'} access.`}
        </p>
 
        {/* Role info */}
        <div className="bg-bg-tertiary rounded-lg p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Your role</span>
            <span className="text-accent-amber font-medium">{user?.role || 'Unknown'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Required</span>
            <span className="text-accent-cyan font-medium">{requiredRole || 'Premium / Admin'}</span>
          </div>
        </div>
 
        {/* Technical note */}
        <div className="font-mono text-xs text-accent-red bg-accent-red/10 rounded-lg p-3 mb-6 text-left">
          403 Forbidden — Token valid, role insufficient.<br />
          JWT payload role: "{user?.role}" ≠ required: "{requiredRole}"
        </div>
 
        {/* CTA */}
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-ghost flex items-center gap-2 mx-auto text-sm"
        >
          Back to Dashboard <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
 