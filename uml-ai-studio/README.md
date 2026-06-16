# UML AI Studio

AI-powered UML diagram generator that analyzes natural language requirements and generates Use Case and Class diagrams.

## 🚀 Tech Stack

**Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Zustand + TanStack Query + Framer Motion + Mermaid.js + Recharts  
**Backend:** Node.js 22 + Express v5 + TypeScript + Prisma v6 + PostgreSQL 16  
**AI:** Anthropic Claude API (streaming SSE)  
**Theme:** Glassmorphism dark (Space Grotesk + DM Sans)

## 📦 Setup

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
npm install

# 3. Setup database
cd backend
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
cd ..

# 4. Configure environment
# Edit backend/.env — add ANTHROPIC_API_KEY if you have one

# 5. Run dev
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001  
API Health: http://localhost:3001/api/health

## 🔑 Demo Account

```
Email: admin@umlstudio.ai
Password: Admin@123
Role: Admin
```

## 📁 Project Structure

```
uml-ai-studio/
├── frontend/          ← React app (port 5173)
│   └── src/
│       ├── components/  (auth, layout, diagrams, ui)
│       ├── pages/       (auth, dashboard, editor, projects, history, templates, settings, admin)
│       ├── stores/      (authStore, diagramStore)
│       ├── services/    (authService, apiService)
│       ├── hooks/       (useAuth)
│       └── lib/         (axios, mermaid, queryClient)
├── backend/           ← Express API (port 3001)
│   ├── src/
│   │   ├── routes/      (auth, ai, projects, templates, sessions, notifications, admin)
│   │   ├── controllers/ (authController, aiController, projectController)
│   │   ├── middlewares/ (auth, roleGuard, quotaCheck, errorHandler)
│   │   ├── services/    (authService, aiService)
│   │   └── utils/       (prismaClient, constants)
│   └── prisma/          (schema.prisma, seed.ts)
└── docker-compose.yml
```
