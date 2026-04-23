import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../utils/prismaClient.js'

const createSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    diagramType: z.enum(['USECASE', 'CLASS']),
    mermaidCode: z.string(),
    explanation: z.string(),
    messages: z.any().optional(),
    tags: z.array(z.string()).optional(),
})

const updateSchema = createSchema.partial()

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const { search, type, sort = 'newest', page = '1', limit = '12' } = req.query as Record<string, string>

        const where: any = { userId: req.user!.userId }
        if (search) where.title = { contains: search, mode: 'insensitive' }
        if (type) where.diagramType = type

        const orderBy = sort === 'oldest' ? { createdAt: 'asc' as const }
            : sort === 'name' ? { title: 'asc' as const }
                : { createdAt: 'desc' as const }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const [projects, total] = await Promise.all([
            prisma.project.findMany({ where, orderBy, skip, take: parseInt(limit) }),
            prisma.project.count({ where }),
        ])

        res.json({ success: true, data: projects, pagination: { page: parseInt(page), limit: parseInt(limit), total } })
    } catch (err) { next(err) }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const project = await prisma.project.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!project) {
            res.status(404).json({ success: false, message: 'Dự án không tồn tại' })
            return
        }
        res.json({ success: true, data: project })
    } catch (err) { next(err) }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const data = createSchema.parse(req.body)
        const project = await prisma.project.create({
            data: { ...data, userId: req.user!.userId, messages: data.messages || [], tags: data.tags || [] },
        })

        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'PROJECT_CREATE', detail: `Created project: ${project.title}`, ip: req.ip },
        })

        res.status(201).json({ success: true, data: project })
    } catch (err) { next(err) }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const data = updateSchema.parse(req.body)
        const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user!.userId } })
        if (!existing) {
            res.status(404).json({ success: false, message: 'Dự án không tồn tại' })
            return
        }

        const project = await prisma.project.update({ where: { id: req.params.id }, data })
        res.json({ success: true, data: project })
    } catch (err) { next(err) }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user!.userId } })
        if (!existing) {
            res.status(404).json({ success: false, message: 'Dự án không tồn tại' })
            return
        }

        await prisma.project.delete({ where: { id: req.params.id } })

        await prisma.auditLog.create({
            data: { userId: req.user!.userId, action: 'PROJECT_DELETE', detail: `Deleted project: ${existing.title}`, ip: req.ip },
        })

        res.json({ success: true, message: 'Đã xóa dự án' })
    } catch (err) { next(err) }
}
