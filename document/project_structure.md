# 🗂️ Tổng Quan Cấu Trúc Dự Án: UML AI Studio

## 📌 Dự án là gì?
**UML AI Studio** là một ứng dụng web full-stack cho phép người dùng **tạo sơ đồ UML (Use Case, Class Diagram) tự động bằng AI** thông qua giao tiếp hội thoại. Người dùng nhập mô tả bằng văn bản → AI sinh ra code Mermaid → hiển thị sơ đồ trực tiếp trên trình duyệt.

---

## 🏗️ Cấu Trúc Thư Mục Gốc `d:\BT\PBL5-v4\`

```
PBL5-v4/
├── uml-ai-studio/          ← Toàn bộ source code ứng dụng (QUAN TRỌNG NHẤT)
├── database_explained.md   ← Tài liệu giải thích cơ sở dữ liệu
├── project_context.md      ← Ngữ cảnh & mục tiêu dự án
├── PROMPT_AI_UML_SYSTEM.md ← System prompt dùng cho AI sinh UML
├── Untitled.make           ← File Mermaid lớn (có thể là ERD hoặc UML mẫu)
├── skill-extracted/        ← Skill/template được giải nén
├── ui-ux-skill/            ← Tài nguyên UI/UX
└── node_modules/           ← Thư viện Node.js gốc
```

---

## 📁 Cấu Trúc Chính: `uml-ai-studio/`

```
uml-ai-studio/
├── frontend/               ← Giao diện người dùng (React + TypeScript + Vite)
├── backend/                ← Server API (Node.js + TypeScript + Express)
├── docker-compose.yml      ← Cấu hình chạy toàn bộ app bằng Docker
├── package.json            ← Script chạy đồng thời frontend + backend
├── CLAUDE.md               ← Hướng dẫn dành cho AI assistant
└── README.md               ← Tài liệu mô tả dự án
```

---

## 🎨 FRONTEND `frontend/src/`

**Công nghệ:** React 18 + TypeScript + Vite + React Router + TanStack Query + Zustand

```
src/
├── main.tsx            ← Điểm khởi động ứng dụng React
├── App.tsx             ← Cấu hình routing toàn bộ ứng dụng
├── index.css           ← CSS toàn cục, design tokens
│
├── pages/              ← Các trang của ứng dụng
│   ├── landing/        → Trang chủ (giới thiệu app, chưa đăng nhập)
│   ├── auth/           → Trang đăng nhập & đăng ký
│   ├── dashboard/      → Trang tổng quan sau khi đăng nhập
│   ├── editor/         → ⭐ TRANG CHÍNH: Chat với AI + xem sơ đồ UML
│   ├── projects/       → Danh sách dự án đã lưu
│   ├── history/        → Lịch sử các phiên làm việc
│   ├── templates/      → Thư viện mẫu UML có sẵn
│   ├── settings/       → Cài đặt tài khoản người dùng
│   └── admin/          → Trang quản trị (chỉ ADMIN)
│       ├── AdminDashboard.tsx   → Tổng quan hệ thống
│       ├── UsersPage.tsx        → Quản lý người dùng
│       ├── AIConfigPage.tsx     → Cấu hình AI (model, API key, prompt)
│       ├── TemplatesAdminPage.tsx → Quản lý mẫu UML
│       ├── AuditPage.tsx        → Nhật ký hoạt động hệ thống
│       ├── QuotaPage.tsx        → Quản lý hạn mức sử dụng
│       ├── BackupPage.tsx       → Sao lưu dữ liệu
│       └── StatsPage.tsx        → Thống kê hệ thống
│
├── components/         ← Các thành phần giao diện tái sử dụng
│   ├── layout/
│   │   ├── AppShell.tsx        → Khung chính (Sidebar + Header + nội dung)
│   │   ├── Sidebar.tsx         → Thanh điều hướng bên trái
│   │   └── Header.tsx          → Thanh tiêu đề trên cùng
│   ├── auth/
│   │   └── RouteGuard.tsx      → Bảo vệ route (ProtectedRoute, AdminRoute, GuestRoute)
│   ├── diagrams/
│   │   └── MermaidRenderer.tsx → ⭐ Render sơ đồ UML từ Mermaid code
│   ├── ui/             → Các component nhỏ (Button, Modal, Input...)
│   └── user/           → Component liên quan đến thông tin người dùng
│
├── stores/             ← Quản lý state toàn cục (Zustand)
│   ├── authStore.ts    → Lưu trữ trạng thái đăng nhập, thông tin user
│   └── diagramStore.ts → Lưu trữ trạng thái sơ đồ UML hiện tại
│
├── services/           ← Giao tiếp với Backend API
│   ├── apiService.ts   → ⭐ Tất cả các hàm gọi API (projects, AI, admin...)
│   └── authService.ts  → Hàm đăng nhập, đăng xuất, đăng ký
│
├── hooks/
│   └── useAuth.ts      → Custom hook lấy thông tin xác thực
│
├── lib/
│   └── queryClient.ts  → Cấu hình TanStack Query (cache API calls)
│
├── types/              → Định nghĩa TypeScript types/interfaces
└── utils/              → Hàm tiện ích
```

---

## ⚙️ BACKEND `backend/src/`

**Công nghệ:** Node.js + TypeScript + Express + Prisma ORM + PostgreSQL

```
src/
├── server.ts           ← Điểm khởi động server (lắng nghe cổng)
├── app.ts              ← Cấu hình Express app (middleware, routes)
│
├── routes/             ← Định nghĩa API endpoints
│   ├── auth.ts         → POST /api/auth/login, /register, /logout
│   ├── projects.ts     → CRUD /api/projects
│   ├── ai.ts           → POST /api/ai/generate (gọi AI sinh UML)
│   ├── admin.ts        → /api/admin/* (quản lý hệ thống)
│   ├── sessions.ts     → /api/sessions (lịch sử chat)
│   ├── templates.ts    → /api/templates (mẫu UML)
│   └── notifications.ts→ /api/notifications
│
├── controllers/        ← Xử lý logic của từng route
│   ├── authController.ts     → Xử lý đăng nhập, đăng ký, JWT
│   ├── projectController.ts  → Xử lý lưu/lấy/xóa project
│   └── aiController.ts       → ⭐ Gọi AI API, trả về Mermaid code
│
├── services/           ← Business logic phức tạp
│   ├── aiService.ts    → ⭐ Kết nối với Claude AI API, xử lý response
│   └── authService.ts  → Mã hóa mật khẩu, tạo JWT token
│
├── middlewares/        ← Xử lý trung gian (chạy trước controller)
│   ├── auth.ts         → Kiểm tra JWT token hợp lệ
│   ├── roleGuard.ts    → Kiểm tra quyền ADMIN
│   ├── quotaCheck.ts   → Kiểm tra hạn mức sử dụng AI
│   └── errorHandler.ts → Xử lý lỗi toàn cục
│
├── types/              → TypeScript types cho backend
└── utils/              → Hàm tiện ích (hashing, logging...)
```

---

## 🗃️ DATABASE `backend/prisma/`

**Công nghệ:** PostgreSQL + Prisma ORM

```
prisma/
├── schema.prisma   ← ⭐ Định nghĩa cấu trúc database
├── seed.ts         ← Dữ liệu mẫu để khởi tạo database
├── migrations/     ← Lịch sử thay đổi cấu trúc database
└── ERD.svg         ← Sơ đồ quan hệ thực thể (Entity Relationship Diagram)
```

### Các bảng (Models) trong Database:

| Bảng | Chức năng |
|------|-----------|
| `User` | Tài khoản người dùng (email, mật khẩu, role, quota) |
| `Project` | Dự án UML đã lưu (title, loại diagram, Mermaid code) |
| `Session` | Phiên chat với AI (lịch sử tin nhắn) |
| `Template` | Mẫu UML có sẵn để tham khảo |
| `AuditLog` | Nhật ký mọi hành động trong hệ thống |
| `Notification` | Thông báo gửi đến người dùng |
| `AIConfig` | Cấu hình AI (model, API key, system prompt, temperature) |

---

## 🔄 Luồng Hoạt Động Chính

```
Người dùng nhập mô tả
        ↓
  EditorPage.tsx (Frontend)
        ↓ gọi API
  apiService.ts → POST /api/ai/generate
        ↓
  aiController.ts (Backend)
        ↓
  aiService.ts → Gọi Claude AI API
        ↓ nhận Mermaid code
  Trả về Frontend
        ↓
  MermaidRenderer.tsx → Hiển thị sơ đồ UML
        ↓
  Lưu vào Project (PostgreSQL)
```

---

## 🔐 Hệ Thống Phân Quyền

| Role | Quyền truy cập |
|------|----------------|
| `USER` | Tạo UML, xem project của mình, dùng template |
| `ADMIN` | Toàn quyền + quản lý users, cấu hình AI, xem audit log |

---

## 🚀 Cách Chạy Dự Án

```bash
# Tại thư mục uml-ai-studio/
npm run dev       # Chạy cả frontend (port 5173) và backend (port 3000)
```
