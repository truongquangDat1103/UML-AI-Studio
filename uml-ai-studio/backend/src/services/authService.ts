import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BCRYPT_ROUNDS, JWT_EXPIRES_IN } from '../utils/constants.js'

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function generateToken(userId: string, role: string, email: string): string {
    return jwt.sign(
        { userId, role, email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: JWT_EXPIRES_IN }
    )
}

export function verifyTokenPayload(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
        userId: string
        role: string
        email: string
    }
}
