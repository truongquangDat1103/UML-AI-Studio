import { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user || req.user.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Chỉ admin mới có quyền truy cập', code: 'FORBIDDEN' })
        return
    }
    next()
}
