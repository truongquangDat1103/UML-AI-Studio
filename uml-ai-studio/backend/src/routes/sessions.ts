import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../utils/prismaClient.js'
import { verifyToken } from '../middlewares/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = '1', limit = '20' } = req.query as Record<string, string>
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [sessions, total] = await Promise.all([
            prisma.session.findMany({
                where: { userId: req.user!.userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.session.count({ where: { userId: req.user!.userId } }),
        ])

        res.json({ success: true, data: sessions, pagination: { page: parseInt(page), limit: parseInt(limit), total } })
    } catch (err) { next(err) }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await prisma.session.create({
            data: { userId: req.user!.userId, messages: req.body.messages || [] },
        })
        res.status(201).json({ success: true, data: session })
    } catch (err) { next(err) }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.session.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } })
        res.json({ success: true, message: 'Đã xóa phiên' })
    } catch (err) { next(err) }
})

export default router
