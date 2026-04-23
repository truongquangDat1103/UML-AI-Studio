import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../utils/prismaClient.js'
import { hashPassword, comparePassword, generateToken } from '../services/authService.js'
import { DEFAULT_QUOTA } from '../utils/constants.js'

const registerSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const data = registerSchema.parse(req.body)

        // Check email exists
        const existing = await prisma.user.findUnique({ where: { email: data.email } })
        if (existing) {
            res.status(409).json({ success: false, message: 'Email đã được sử dụng' })
            return
        }

        const passwordHash = await hashPassword(data.password)
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                dailyQuota: DEFAULT_QUOTA,
            },
        })

        const token = generateToken(user.id, user.role, user.email)

        // Audit log
        await prisma.auditLog.create({
            data: { userId: user.id, action: 'USER_REGISTER', detail: `User ${user.email} registered`, ip: req.ip },
        })

        res.status(201).json({
            success: true,
            data: {
                user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
                token,
            },
        })
    } catch (err) {
        next(err)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const data = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({ where: { email: data.email } })
        if (!user) {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
            return
        }

        if (user.status === 'SUSPENDED') {
            res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa. Liên hệ admin.' })
            return
        }

        const valid = await comparePassword(data.password, user.passwordHash)
        if (!valid) {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' })
            return
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        })

        const token = generateToken(user.id, user.role, user.email)

        // Audit log
        await prisma.auditLog.create({
            data: { userId: user.id, action: 'USER_LOGIN', detail: `User ${user.email} logged in`, ip: req.ip },
        })

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id, email: user.email, name: user.name, role: user.role,
                    status: user.status, dailyQuota: user.dailyQuota, quotaUsed: user.quotaUsed,
                },
                token,
            },
        })
    } catch (err) {
        next(err)
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true, email: true, name: true, role: true, status: true,
                dailyQuota: true, quotaUsed: true, quotaResetAt: true,
                createdAt: true, lastLoginAt: true,
            },
        })

        if (!user) {
            res.status(404).json({ success: false, message: 'User không tồn tại' })
            return
        }

        res.json({ success: true, data: user })
    } catch (err) {
        next(err)
    }
}
