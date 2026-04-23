import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
    const { user, isAuthenticated, isLoading, login, register, logout, checkAuth } = useAuthStore()

    const isAdmin = user?.role === 'ADMIN'

    return {
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        checkAuth,
    }
}
