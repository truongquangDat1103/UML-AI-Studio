import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prismaClient.js'

export async function quotaCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' })
        return
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
    if (!user) {
        res.status(404).json({ success: false, message: 'User không tồn tại' })
        return
    }

    // Auto reset quota if new day
    const now = new Date()
    const resetAt = new Date(user.quotaResetAt)
    if (now.toDateString() !== resetAt.toDateString()) {
        await prisma.user.update({
            where: { id: user.id },
            data: { quotaUsed: 0, quotaResetAt: now },
        })
        next()
        return
    }

    // Check quota
    if (user.quotaUsed >= user.dailyQuota) {
        res.status(429).json({
            success: false,
            message: `Bạn đã sử dụng hết ${user.dailyQuota} lượt hôm nay. Quota sẽ reset vào ngày mai.`,
            code: 'QUOTA_EXCEEDED',
            quota: { daily: user.dailyQuota, used: user.quotaUsed },
        })
        return
    }

    next()
}
