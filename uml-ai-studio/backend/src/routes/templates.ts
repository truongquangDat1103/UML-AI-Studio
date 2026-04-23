import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../utils/prismaClient.js'
import { verifyToken } from '../middlewares/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } })
        res.json({ success: true, data: templates })
    } catch (err) { next(err) }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const template = await prisma.template.findUnique({ where: { id: req.params.id } })
        if (!template) {
            res.status(404).json({ success: false, message: 'Template không tồn tại' })
            return
        }
        res.json({ success: true, data: template })
    } catch (err) { next(err) }
})

export default router
