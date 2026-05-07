import api from '@/lib/axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface GenerateParams {
    input: string
    diagramType: 'USECASE' | 'CLASS'
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

interface AIResult {
    mermaidCode: string
    plantUmlCode?: string
    explanation: string
    suggestions: string[]
}

export async function generateDiagramAPI(
    params: GenerateParams,
    onChunk?: (text: string) => void,
): Promise<AIResult> {
    const token = localStorage.getItem('uml_token')
    const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Lỗi kết nối' }))
        throw new Error(err.message || `HTTP ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let result: AIResult = { mermaidCode: '', explanation: '', suggestions: [] }

    if (reader) {
        let buffer = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6))
                        if (data.type === 'chunk') {
                            onChunk?.(data.text)
                        } else if (data.type === 'done') {
                            result = data.result
                        } else if (data.type === 'error') {
                            throw new Error(data.message)
                        }
                    } catch (e) {
                        if (e instanceof SyntaxError) continue
                        throw e
                    }
                }
            }
        }
    }

    return result
}

export async function refineDiagramAPI(
    params: GenerateParams,
    onChunk?: (text: string) => void,
): Promise<AIResult> {
    const token = localStorage.getItem('uml_token')
    const response = await fetch(`${API_URL}/api/ai/refine`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Lỗi kết nối' }))
        throw new Error(err.message || `HTTP ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let result: AIResult = { mermaidCode: '', explanation: '', suggestions: [] }

    if (reader) {
        let buffer = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6))
                        if (data.type === 'chunk') onChunk?.(data.text)
                        else if (data.type === 'done') result = data.result
                        else if (data.type === 'error') throw new Error(data.message)
                    } catch (e) {
                        if (e instanceof SyntaxError) continue
                        throw e
                    }
                }
            }
        }
    }

    return result
}

// Projects API
export const projectsAPI = {
    list: (params?: Record<string, string>) => api.get('/api/projects', { params }).then(r => r.data),
    getById: (id: string) => api.get(`/api/projects/${id}`).then(r => r.data),
    create: (data: any) => api.post('/api/projects', data).then(r => r.data),
    update: (id: string, data: any) => api.put(`/api/projects/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/api/projects/${id}`).then(r => r.data),
}

// Templates API
export const templatesAPI = {
    list: () => api.get('/api/templates').then(r => r.data),
    getById: (id: string) => api.get(`/api/templates/${id}`).then(r => r.data),
}

// Sessions API
export const sessionsAPI = {
    list: (params?: Record<string, string>) => api.get('/api/sessions', { params }).then(r => r.data),
    create: (data: any) => api.post('/api/sessions', data).then(r => r.data),
    delete: (id: string) => api.delete(`/api/sessions/${id}`).then(r => r.data),
}

// Notifications API
export const notificationsAPI = {
    list: () => api.get('/api/notifications').then(r => r.data),
    markRead: (id: string) => api.patch(`/api/notifications/${id}/read`).then(r => r.data),
    markAllRead: () => api.patch('/api/notifications/read-all').then(r => r.data),
}

// Admin API
export const adminAPI = {
    getUsers: (params?: Record<string, string>) => api.get('/api/admin/users', { params }).then(r => r.data),
    getUser: (id: string) => api.get(`/api/admin/users/${id}`).then(r => r.data),
    updateUser: (id: string, data: any) => api.patch(`/api/admin/users/${id}`, data).then(r => r.data),
    deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`).then(r => r.data),
    resetQuota: (id: string) => api.post(`/api/admin/users/${id}/reset-quota`).then(r => r.data),
    getStats: () => api.get('/api/admin/stats').then(r => r.data),
    getAIConfig: () => api.get('/api/admin/ai-config').then(r => r.data),
    updateAIConfig: (data: any) => api.put('/api/admin/ai-config', data).then(r => r.data),
    getTemplates: () => api.get('/api/admin/templates').then(r => r.data),
    createTemplate: (data: any) => api.post('/api/admin/templates', data).then(r => r.data),
    updateTemplate: (id: string, data: any) => api.put(`/api/admin/templates/${id}`, data).then(r => r.data),
    deleteTemplate: (id: string) => api.delete(`/api/admin/templates/${id}`).then(r => r.data),
    getAuditLogs: (params?: Record<string, string>) => api.get('/api/admin/audit-logs', { params }).then(r => r.data),
    broadcast: (data: any) => api.post('/api/admin/notifications/broadcast', data).then(r => r.data),
    exportBackup: () => api.get('/api/admin/backup').then(r => r.data),
    importBackup: (data: any) => api.post('/api/admin/backup/restore', data).then(r => r.data),
}
