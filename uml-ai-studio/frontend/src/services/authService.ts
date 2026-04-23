import api from '@/lib/axios'

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    name: string
    email: string
    password: string
}

interface AuthResponse {
    success: boolean
    data: {
        user: {
            id: string
            email: string
            name: string
            role: string
            status: string
            dailyQuota?: number
            quotaUsed?: number
        }
        token: string
    }
}

export async function loginAPI(data: LoginData): Promise<AuthResponse> {
    const res = await api.post('/api/auth/login', data)
    return res.data
}

export async function registerAPI(data: RegisterData): Promise<AuthResponse> {
    const res = await api.post('/api/auth/register', data)
    return res.data
}

export async function getMeAPI() {
    const res = await api.get('/api/auth/me')
    return res.data
}
