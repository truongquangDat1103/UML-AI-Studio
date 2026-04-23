import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.error('❌ Error:', err.message)

    // Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Dữ liệu đã tồn tại (unique constraint)',
                code: 'DUPLICATE',
            })
            return
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
                code: 'NOT_FOUND',
            })
            return
        }
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            code: 'VALIDATION_ERROR',
            errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        })
        return
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ success: false, message: 'Token không hợp lệ', code: 'INVALID_TOKEN' })
        return
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ success: false, message: 'Token đã hết hạn', code: 'TOKEN_EXPIRED' })
        return
    }

    // Default
    const statusCode = (err as any).statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
    })
}

// Helper to create HTTP errors
export class HttpError extends Error {
    statusCode: number
    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
    }
}
