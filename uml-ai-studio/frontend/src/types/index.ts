// ===== User & Auth Types =====

export type Role = 'admin' | 'user'
export type DiagramType = 'usecase' | 'class'
export type UserStatus = 'active' | 'suspended'

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: Role
  status: UserStatus
  avatar?: string
  quota: {
    daily: number
    used: number
    resetAt: string // ISO date string
  }
  apiKey?: string // personal API key
  createdAt: string
  lastLoginAt?: string
}

export interface AuthToken {
  userId: string
  role: Role
  expiry: number // timestamp ms
  signature: string
}

// ===== Project & Diagram Types =====

export interface Project {
  id: string
  userId: string
  title: string
  description: string
  diagramType: DiagramType
  mermaidCode: string
  explanation: string
  conversationHistory: AIMessage[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ===== AI Types =====

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AIConfig {
  model: string
  apiKey: string // base64 encoded
  systemPromptUseCase: string
  systemPromptClass: string
  temperature: number
  maxTokens: number
}

export interface AIResponse {
  mermaidCode: string
  explanation: string
  suggestions: string[]
}

// ===== Session =====

export interface Session {
  id: string
  userId: string
  diagramType: DiagramType
  initialInput: string
  messages: AIMessage[]
  mermaidCode: string
  explanation: string
  tokenCount: number
  createdAt: string
  updatedAt: string
}

// ===== Template =====

export interface Template {
  id: string
  title: string
  description: string
  diagramType: DiagramType
  mermaidCode: string
  promptExample: string
  createdBy: string
  createdAt: string
}

// ===== Admin Types =====

export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: AuditAction
  detail: string
  ip: string
  timestamp: string
}

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTER'
  | 'DIAGRAM_CREATE'
  | 'DIAGRAM_SAVE'
  | 'DIAGRAM_DELETE'
  | 'PROJECT_CREATE'
  | 'PROJECT_DELETE'
  | 'ADMIN_USER_SUSPEND'
  | 'ADMIN_USER_ROLE_CHANGE'
  | 'ADMIN_CONFIG_UPDATE'
  | 'ADMIN_TEMPLATE_CREATE'
  | 'ADMIN_TEMPLATE_EDIT'
  | 'ADMIN_TEMPLATE_DELETE'
  | 'ADMIN_BACKUP_EXPORT'
  | 'ADMIN_BACKUP_IMPORT'

// ===== Notification =====

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

// ===== Settings =====

export interface UserSettings {
  theme: 'dark' | 'light'
  language: 'vi' | 'en'
}

// ===== Stats =====

export interface DailyStats {
  date: string
  diagramsCreated: number
  tokensUsed: number
  activeUsers: number
}

export interface SystemStats {
  totalUsers: number
  totalDiagrams: number
  tokensToday: number
  activeUsers7d: number
}
