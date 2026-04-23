import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, API_PREFIX } from './utils/constants.js'
import { errorHandler } from './middlewares/errorHandler.js'
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import aiRouter from './routes/ai.js'
import templatesRouter from './routes/templates.js'
import sessionsRouter from './routes/sessions.js'
import notificationsRouter from './routes/notifications.js'
import adminRouter from './routes/admin.js'

dotenv.config()

const app = express()

// Security
app.use(helmet())

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: RATE_LIMIT_MAX,
    message: { success: false, message: 'Quá nhiều request. Vui lòng thử lại sau.' },
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)

// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
    res.json({ success: true, message: 'UML AI Studio API is running', timestamp: new Date().toISOString() })
})

// Routes
app.use(`${API_PREFIX}/auth`, authRouter)
app.use(`${API_PREFIX}/projects`, projectsRouter)
app.use(`${API_PREFIX}/ai`, aiRouter)
app.use(`${API_PREFIX}/templates`, templatesRouter)
app.use(`${API_PREFIX}/sessions`, sessionsRouter)
app.use(`${API_PREFIX}/notifications`, notificationsRouter)
app.use(`${API_PREFIX}/admin`, adminRouter)

// Error handler (must be last)
app.use(errorHandler)

export default app
