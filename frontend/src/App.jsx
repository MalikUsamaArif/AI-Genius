import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import DashboardLayout  from './layouts/DashboardLayout'
import DashboardHome    from './pages/dashboard/DashboardHome'
import UploadScan       from './pages/dashboard/UploadScan'
import TokenDemo        from './pages/dashboard/TokenDemo'
import ApiKeys          from './pages/dashboard/ApiKeys'
import UserManagement   from './pages/dashboard/UserManagement'
import ProtectedRoute   from './components/ProtectedRoute'
 
export default function App() {
  return (
    <Routes>
      <Route path="/"      element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
 
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index         element={<DashboardHome />} />
        <Route path="upload" element={<UploadScan />} />
        <Route path="tokens" element={<TokenDemo />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="users"  element={<UserManagement />} />
      </Route>
 
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
 
