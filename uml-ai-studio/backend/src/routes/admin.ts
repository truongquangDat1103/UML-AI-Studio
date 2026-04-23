import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../utils/prismaClient.js'
import { verifyToken } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/roleGuard.js'

const router = Router()
router.use(verifyToken, requireAdmin)

// ============ USERS ============

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, role, status, page = '1', limit = '10' } = req.query as Record<string, string>
        const where: any = {}
        if (search) where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ]
        if (role) where.role = role
        if (status) where.status = status

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
                select: { id: true, email: true, name: true, role: true, status: true, dailyQuota: true, quotaUsed: true, createdAt: true, lastLoginAt: true },
            }),
            prisma.user.count({ where }),
        ])
        res.json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total } })
    } catch (err) { next(err) }
})

router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, email: true, name: true, role: true, status: true, dailyQuota: true, quotaUsed: true, quotaResetAt: true, createdAt: true, lastLoginAt: true },
        })
        if (!user) { res.status(404).json({ success: false, message: 'User không tồn tại' }); return }

        const [projectCount, sessionCount] = await Promise.all([
            prisma.project.count({ where: { userId: user.id } }),
            prisma.session.count({ where: { userId: user.id } }),
        ])
        res.json({ success: true, data: { ...user, projectCount, sessionCount } })
    } catch (err) { next(err) }
})

router.patch('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, status, dailyQuota } = req.body
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { ...(role && { role }), ...(status && { status }), ...(dailyQuota !== undefined && { dailyQuota }) },
        })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_USER_ROLE_CHANGE', detail: `Updated user ${user.email}: ${JSON.stringify(req.body)}`, ip: req.ip },
        })
        res.json({ success: true, data: user })
    } catch (err) { next(err) }
})

router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.id === req.user!.userId) {
            res.status(400).json({ success: false, message: 'Không thể xóa chính mình' }); return
        }
        const user = await prisma.user.delete({ where: { id: req.params.id } })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_USER_SUSPEND', detail: `Deleted user ${user.email}`, ip: req.ip },
        })
        res.json({ success: true, message: 'Đã xóa user' })
    } catch (err) { next(err) }
})

router.post('/users/:id/reset-quota', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.user.update({ where: { id: req.params.id }, data: { quotaUsed: 0, quotaResetAt: new Date() } })
        res.json({ success: true, message: 'Đã reset quota' })
    } catch (err) { next(err) }
})

// ============ STATS ============

router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const [totalUsers, totalProjects, activeUsers7d, recentProjects, projectsByType] = await Promise.all([
            prisma.user.count(),
            prisma.project.count(),
            prisma.user.count({ where: { lastLoginAt: { gte: sevenDaysAgo } } }),
            prisma.project.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true, diagramType: true } }),
            prisma.project.groupBy({ by: ['diagramType'], _count: true }),
        ])

        // Group projects by day
        const projectsByDay: Record<string, number> = {}
        for (const p of recentProjects) {
            const day = p.createdAt.toISOString().split('T')[0]
            projectsByDay[day] = (projectsByDay[day] || 0) + 1
        }

        // Top users
        const topUsers = await prisma.user.findMany({
            take: 10, orderBy: { quotaUsed: 'desc' },
            select: { id: true, name: true, email: true, quotaUsed: true, dailyQuota: true },
        })

        // Tokens used today
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const tokensToday = await prisma.user.aggregate({ _sum: { quotaUsed: true }, where: { quotaResetAt: { gte: todayStart } } })

        res.json({
            success: true, data: {
                totalUsers, totalProjects,
                totalTokensToday: tokensToday._sum.quotaUsed || 0,
                activeUsersLast7Days: activeUsers7d,
                projectsByDay, projectsByType, topUsers,
            },
        })
    } catch (err) { next(err) }
})

// ============ AI CONFIG ============

router.get('/ai-config', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.aIConfig.findUnique({ where: { id: 'singleton' } })
        if (config && config.apiKey) {
            config.apiKey = '****' + config.apiKey.slice(-4)
        }
        res.json({ success: true, data: config })
    } catch (err) { next(err) }
})

router.put('/ai-config', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.aIConfig.upsert({
            where: { id: 'singleton' },
            update: req.body,
            create: { id: 'singleton', ...req.body },
        })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_CONFIG_UPDATE', detail: 'Updated AI config', ip: req.ip },
        })
        res.json({ success: true, data: config })
    } catch (err) { next(err) }
})

// ============ TEMPLATES (Admin CRUD) ============

router.get('/templates', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } })
        res.json({ success: true, data: templates })
    } catch (err) { next(err) }
})

const templateSchema = z.object({
    title: z.string().min(1), description: z.string(), diagramType: z.enum(['USECASE', 'CLASS']),
    mermaidCode: z.string(), promptExample: z.string(),
})

router.post('/templates', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = templateSchema.parse(req.body)
        const template = await prisma.template.create({ data: { ...data, createdBy: req.user!.userId } })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_TEMPLATE_CREATE', detail: `Created template: ${template.title}`, ip: req.ip },
        })
        res.status(201).json({ success: true, data: template })
    } catch (err) { next(err) }
})

router.put('/templates/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = templateSchema.partial().parse(req.body)
        const template = await prisma.template.update({ where: { id: req.params.id }, data })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_TEMPLATE_EDIT', detail: `Edited template: ${template.title}`, ip: req.ip },
        })
        res.json({ success: true, data: template })
    } catch (err) { next(err) }
})

router.delete('/templates/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const template = await prisma.template.delete({ where: { id: req.params.id } })
        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_TEMPLATE_DELETE', detail: `Deleted template: ${template.title}`, ip: req.ip },
        })
        res.json({ success: true, message: 'Đã xóa template' })
    } catch (err) { next(err) }
})

// ============ AUDIT LOGS ============

router.get('/audit-logs', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, action, dateFrom, dateTo, page = '1', limit = '20' } = req.query as Record<string, string>
        const where: any = {}
        if (userId) where.userId = userId
        if (action) where.action = action
        if (dateFrom || dateTo) {
            where.timestamp = {}
            if (dateFrom) where.timestamp.gte = new Date(dateFrom)
            if (dateTo) where.timestamp.lte = new Date(dateTo)
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where, orderBy: { timestamp: 'desc' }, skip, take: parseInt(limit),
                include: { user: { select: { email: true, name: true } } },
            }),
            prisma.auditLog.count({ where }),
        ])
        res.json({ success: true, data: logs, pagination: { page: parseInt(page), limit: parseInt(limit), total } })
    } catch (err) { next(err) }
})

// ============ NOTIFICATIONS BROADCAST ============

router.post('/notifications/broadcast', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, message, role } = req.body
        const where: any = {}
        if (role) where.role = role

        const users = await prisma.user.findMany({ where, select: { id: true } })
        await prisma.notification.createMany({
            data: users.map(u => ({ userId: u.id, title, message })),
        })

        res.json({ success: true, message: `Đã gửi thông báo cho ${users.length} người dùng` })
    } catch (err) { next(err) }
})

// ============ BACKUP ============

router.get('/backup', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [users, projects, templates, aiConfig, auditLogs, sessions, notifications] = await Promise.all([
            prisma.user.findMany(),
            prisma.project.findMany(),
            prisma.template.findMany(),
            prisma.aIConfig.findUnique({ where: { id: 'singleton' } }),
            prisma.auditLog.findMany(),
            prisma.session.findMany(),
            prisma.notification.findMany(),
        ])

        const backup = { exportedAt: new Date().toISOString(), users, projects, templates, aiConfig, auditLogs, sessions, notifications }
        res.setHeader('Content-Disposition', `attachment; filename=uml-studio-backup-${new Date().toISOString().split('T')[0]}.json`)
        res.json(backup)
    } catch (err) { next(err) }
})

router.post('/backup/restore', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        if (!data.users || !data.projects) {
            res.status(400).json({ success: false, message: 'Dữ liệu backup không hợp lệ' }); return
        }

        // Transaction for safety
        await prisma.$transaction(async (tx) => {
            // Clear existing data (order matters for foreign keys)
            await tx.notification.deleteMany()
            await tx.session.deleteMany()
            await tx.auditLog.deleteMany()
            await tx.project.deleteMany()
            await tx.template.deleteMany()
            await tx.user.deleteMany()

            // Restore
            if (data.users.length) await tx.user.createMany({ data: data.users })
            if (data.projects.length) await tx.project.createMany({ data: data.projects })
            if (data.templates?.length) await tx.template.createMany({ data: data.templates })
            if (data.aiConfig) await tx.aIConfig.upsert({ where: { id: 'singleton' }, update: data.aiConfig, create: data.aiConfig })
            if (data.sessions?.length) await tx.session.createMany({ data: data.sessions })
            if (data.notifications?.length) await tx.notification.createMany({ data: data.notifications })
        })

        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'ADMIN_BACKUP_IMPORT', detail: 'Database restored from backup', ip: req.ip },
        })

        res.json({ success: true, message: 'Đã phục hồi dữ liệu thành công' })
    } catch (err) { next(err) }
})

export default router
