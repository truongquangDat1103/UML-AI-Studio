import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../utils/prismaClient.js'
import { verifyToken } from '../middlewares/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        })
        const unreadCount = await prisma.notification.count({
            where: { userId: req.user!.userId, read: false },
        })
        res.json({ success: true, data: notifications, unreadCount })
    } catch (err) { next(err) }
})

router.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        })
        res.json({ success: true })
    } catch (err) { next(err) }
})

router.patch('/read-all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user!.userId, read: false },
            data: { read: true },
        })
        res.json({ success: true })
    } catch (err) { next(err) }
})

export default router
