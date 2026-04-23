import { create } from 'zustand'
import { loginAPI, registerAPI, getMeAPI } from '@/services/authService'
import toast from 'react-hot-toast'

interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'USER'
    status: string
    dailyQuota?: number
    quotaUsed?: number
}

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    checkAuth: () => Promise<void>
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('uml_token'),
    isLoading: true,
    isAuthenticated: false,

    login: async (email, password) => {
        try {
            const res = await loginAPI({ email, password })
            const { user, token } = res.data
            localStorage.setItem('uml_token', token)
            set({ user: user as User, token, isAuthenticated: true })
            toast.success(`Chào mừng ${user.name}!`)
            return true
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đăng nhập thất bại'
            toast.error(msg)
            return false
        }
    },

    register: async (name, email, password) => {
        try {
            const res = await registerAPI({ name, email, password })
            const { user, token } = res.data
            localStorage.setItem('uml_token', token)
            set({ user: user as User, token, isAuthenticated: true })
            toast.success('Đăng ký thành công!')
            return true
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đăng ký thất bại'
            toast.error(msg)
            return false
        }
    },

    logout: () => {
        localStorage.removeItem('uml_token')
        set({ user: null, token: null, isAuthenticated: false })
        toast.success('Đã đăng xuất')
    },

    checkAuth: async () => {
        const token = localStorage.getItem('uml_token')
        if (!token) {
            set({ isLoading: false, isAuthenticated: false })
            return
        }
        try {
            const res = await getMeAPI()
            set({ user: res.data as User, token, isAuthenticated: true, isLoading: false })
        } catch {
            localStorage.removeItem('uml_token')
            set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
    },

    setUser: (user) => set({ user }),
}))
