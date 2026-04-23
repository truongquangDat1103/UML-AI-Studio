// ===== Storage Keys =====
export const STORAGE_KEYS = {
  USERS: 'uml_users',
  TOKEN: 'uml_token',
  PROJECTS: 'uml_projects',
  SESSIONS: 'uml_sessions',
  AI_CONFIG: 'admin:ai-config',
  TEMPLATES: 'admin:templates',
  AUDIT_LOG: 'admin:audit-log',
  NOTIFICATIONS: 'uml_notifications',
  SETTINGS: 'uml_settings',
  DAILY_STATS: 'admin:daily-stats',
  USER_API_KEY: 'user_api_key',
} as const

// ===== App Constants =====
export const APP_NAME = 'UML AI Studio'
export const APP_VERSION = '1.0.0'

// ===== Auth Constants =====
export const DEFAULT_ADMIN = {
  email: 'admin@umlstudio.ai',
  password: 'Admin@123',
  name: 'Administrator',
}

export const TOKEN_EXPIRY_DAYS = 7
export const TOKEN_REFRESH_THRESHOLD_DAYS = 1

// ===== Quota Constants =====
export const DEFAULT_DAILY_QUOTA = 20

// ===== AI Constants =====
export const DEFAULT_AI_MODEL = 'claude-sonnet-4-20250514'
export const AI_MODELS = [
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
  { value: 'claude-haiku-4-20251001', label: 'Claude Haiku 4' },
] as const

export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 4096

export const DEFAULT_SYSTEM_PROMPT_USECASE = `Bạn là chuyên gia phân tích hệ thống phần mềm. Nhiệm vụ:
1. Phân tích yêu cầu người dùng (tiếng Việt hoặc Anh)
2. Trích xuất actors và use cases
3. Xác định relationships: association, include, extend, generalization
4. Sinh Mermaid.js code chính xác cho Use Case Diagram
5. Giải thích từng phần tử bằng tiếng Việt
6. Gợi ý cải tiến

Quy tắc:
- Luôn trả về JSON: { "mermaidCode": "...", "explanation": "...", "suggestions": [...] }
- Mermaid code phải valid, dùng graph TD syntax cho Use Case
- Giải thích ngắn gọn, súc tích
- Gợi ý 2-3 cải tiến hữu ích`

export const DEFAULT_SYSTEM_PROMPT_CLASS = `Bạn là chuyên gia phân tích hệ thống phần mềm. Nhiệm vụ:
1. Phân tích yêu cầu người dùng (tiếng Việt hoặc Anh)
2. Trích xuất classes với attributes và methods
3. Xác định relationships: association, aggregation, composition, inheritance, dependency
4. Xác định multiplicity
5. Sinh Mermaid.js code chính xác cho Class Diagram
6. Giải thích từng class bằng tiếng Việt
7. Gợi ý cải tiến

Quy tắc:
- Luôn trả về JSON: { "mermaidCode": "...", "explanation": "...", "suggestions": [...] }
- Mermaid code phải valid, dùng classDiagram syntax
- Giải thích ngắn gọn, súc tích
- Gợi ý 2-3 cải tiến hữu ích`

// ===== Route Paths =====
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EDITOR: '/editor',
  EDITOR_PROJECT: '/editor/:projectId',
  PROJECTS: '/projects',
  HISTORY: '/history',
  TEMPLATES: '/templates',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_AI_CONFIG: '/admin/ai-config',
  ADMIN_TEMPLATES: '/admin/templates',
  ADMIN_STATS: '/admin/stats',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_QUOTA: '/admin/quota',
  ADMIN_BACKUP: '/admin/backup',
} as const

// ===== Tips =====
export const DAILY_TIPS = [
  '💡 Mô tả yêu cầu càng chi tiết, sơ đồ UML được tạo ra càng chính xác!',
  '💡 Bạn có thể tinh chỉnh sơ đồ bằng cách chat tiếp với AI sau khi tạo.',
  '💡 Sử dụng template mẫu để bắt đầu nhanh hơn!',
  '💡 Nhấn Ctrl+Enter để gửi yêu cầu nhanh trong Editor.',
  '💡 Nhấn Ctrl+S để lưu dự án nhanh trong Editor.',
  '💡 Class Diagram phù hợp cho thiết kế cơ sở dữ liệu và cấu trúc code.',
  '💡 Use Case Diagram giúp hiểu rõ chức năng hệ thống từ góc nhìn người dùng.',
  '💡 Thử nhập yêu cầu bằng cả tiếng Việt lẫn tiếng Anh, AI đều hiểu!',
]

// ===== Avatar Emojis =====
export const AVATAR_EMOJIS = [
  '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🎨', '👩‍🎨',
  '🦊', '🐼', '🐱', '🦁', '🐸',
  '🚀', '⭐', '🔥', '💎', '🎯',
  '🌈', '🌙', '☀️', '🎮', '🎵',
]
