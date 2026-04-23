# UML AI Studio — CLAUDE.md

## Overview
Full-stack AI-powered UML diagram generator. Frontend (React 19) + Backend (Express v5) monorepo with PostgreSQL database.

## Commands
```bash
npm run dev          # Start both frontend + backend
npm run dev:frontend # Frontend only (port 5173)
npm run dev:backend  # Backend only (port 3001)
npm run build        # Build both
npm run db:migrate   # Run Prisma migration
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Architecture
- **Monorepo** with npm workspaces: `frontend/` + `backend/`
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Zustand (state), TanStack Query (server state), Framer Motion (animations), Mermaid.js (diagrams), Recharts (admin charts)
- **Backend**: Express v5, TypeScript, Prisma v6 (ORM), PostgreSQL 16, JWT auth, bcryptjs, Zod validation, Anthropic SDK

## State Management
- `authStore` — user authentication, token management
- `diagramStore` — current diagram session, mermaid code, messages, streaming state

## Auth Flow
1. Login → POST `/api/auth/login` → JWT token
2. Token stored in `localStorage` key `uml_token`
3. Axios interceptor auto-attaches `Authorization: Bearer <token>`
4. 401 response → auto logout + redirect `/login`
5. `ProtectedRoute` guard checks `isAuthenticated`
6. `AdminRoute` guard checks `user.role === 'ADMIN'`

## AI Flow
1. User types requirement in EditorPage ChatPanel
2. Frontend calls `POST /api/ai/generate` with SSE streaming
3. Backend uses Anthropic SDK to call Claude API
4. Stream chunks sent via SSE → update `streamingText`
5. Final result: `{ mermaidCode, explanation, suggestions }`
6. MermaidRenderer re-renders the diagram

## Key Patterns
- All pages use React.lazy + Suspense (code splitting)
- API calls centralized in `services/apiService.ts`
- Glassmorphism CSS utilities: `.glass-card`, `.glass-input`, `.glass-button`
- Path alias: `@/` → `src/`

## Database
- PostgreSQL via Docker Compose + Prisma ORM
- Models: User, Project, Template, AuditLog, Notification, AIConfig, Session
- Seed: admin account + 4 templates + AI config singleton

## Roles
- **ADMIN**: full system access, admin panel
- **USER**: personal diagrams, projects, settings
