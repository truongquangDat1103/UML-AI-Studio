import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
    userId: string
    role: string
    email: string
}

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Token không được cung cấp', code: 'NO_TOKEN' })
        return
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as AuthPayload
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn', code: 'INVALID_TOKEN' })
    }
}
