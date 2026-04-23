import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/authStore'
import { ProtectedRoute, AdminRoute, GuestRoute } from '@/components/auth/RouteGuard'
import AppShell from '@/components/layout/AppShell'

// Lazy loaded pages
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const EditorPage = lazy(() => import('@/pages/editor/EditorPage'))
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'))
const HistoryPage = lazy(() => import('@/pages/history/HistoryPage'))
const TemplatesPage = lazy(() => import('@/pages/templates/TemplatesPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const AIConfigPage = lazy(() => import('@/pages/admin/AIConfigPage'))
const TemplatesAdminPage = lazy(() => import('@/pages/admin/TemplatesAdminPage'))
const StatsPage = lazy(() => import('@/pages/admin/StatsPage'))
const AuditPage = lazy(() => import('@/pages/admin/AuditPage'))
const QuotaPage = lazy(() => import('@/pages/admin/QuotaPage'))
const BackupPage = lazy(() => import('@/pages/admin/BackupPage'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEEF3]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#6B4FDB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#6B7280] font-medium">Đang tải...</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const isLoggedIn = useAuthStore((s) => !!s.user)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Landing Page — public, redirects if logged in */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense>}
      />

      {/* Auth routes (guest only) */}
      <Route path="/login" element={<GuestRoute><Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense></GuestRoute>} />

      {/* Protected routes inside AppShell */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><DashboardPage /></Suspense>} />
        <Route path="/editor" element={<Suspense fallback={<LoadingFallback />}><EditorPage /></Suspense>} />
        <Route path="/editor/:projectId" element={<Suspense fallback={<LoadingFallback />}><EditorPage /></Suspense>} />
        <Route path="/projects" element={<Suspense fallback={<LoadingFallback />}><ProjectsPage /></Suspense>} />
        <Route path="/history" element={<Suspense fallback={<LoadingFallback />}><HistoryPage /></Suspense>} />
        <Route path="/templates" element={<Suspense fallback={<LoadingFallback />}><TemplatesPage /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<LoadingFallback />}><SettingsPage /></Suspense>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><UsersPage /></Suspense></AdminRoute>} />
        <Route path="/admin/ai-config" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><AIConfigPage /></Suspense></AdminRoute>} />
        <Route path="/admin/templates" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><TemplatesAdminPage /></Suspense></AdminRoute>} />
        <Route path="/admin/stats" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><StatsPage /></Suspense></AdminRoute>} />
        <Route path="/admin/audit" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><AuditPage /></Suspense></AdminRoute>} />
        <Route path="/admin/quota" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><QuotaPage /></Suspense></AdminRoute>} />
        <Route path="/admin/backup" element={<AdminRoute><Suspense fallback={<LoadingFallback />}><BackupPage /></Suspense></AdminRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' },
              style: { borderColor: 'rgba(34, 197, 94, 0.3)' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
              style: { borderColor: 'rgba(239, 68, 68, 0.3)' },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
