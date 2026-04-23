import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-muted)]">Đang xác thực...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoading, isAuthenticated } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-muted)]">Đang xác thực...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
