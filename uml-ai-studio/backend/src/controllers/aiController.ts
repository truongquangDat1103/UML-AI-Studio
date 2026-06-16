import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../utils/prismaClient.js'
import { generateDiagram } from '../services/aiService.js'

const generateSchema = z.object({
    input: z.string().min(10, 'Yêu cầu phải có ít nhất 10 ký tự'),
    diagramType: z.enum(['USECASE', 'CLASS']),
    conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })).optional(),
    model: z.string().optional(),  // 'gemini' | 'groq' | 'local_llama' | 'claude' | 'colab_uml'
})

export async function generate(req: Request, res: Response, next: NextFunction) {
    try {
        const data = generateSchema.parse(req.body)

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const result = await generateDiagram(
            {
                input: data.input,
                diagramType: data.diagramType,
                conversationHistory: data.conversationHistory,
                model: data.model,
            },
            (chunk) => {
                res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`)
            }
        )

        // Send final result
        res.write(`data: ${JSON.stringify({ type: 'done', result })}\n\n`)

        // Increment quota
        await prisma.user.update({
            where: { id: req.user!.userId },
            data: { quotaUsed: { increment: 1 } },
        })

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: req.user!.userId,
                action: 'DIAGRAM_CREATE',
                detail: `Generated ${data.diagramType} diagram`,
                ip: req.ip,
            },
        })

        res.end()
    } catch (err) {
        // If headers already sent (streaming started), send error via SSE
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: (err as Error).message })}\n\n`)
            res.end()
        } else {
            next(err)
        }
    }
}

export async function refine(req: Request, res: Response, next: NextFunction) {
    try {
        const data = generateSchema.parse(req.body)

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const result = await generateDiagram(
            {
                input: data.input,
                diagramType: data.diagramType,
                conversationHistory: data.conversationHistory,
                model: data.model,
            },
            (chunk) => {
                res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`)
            }
        )

        res.write(`data: ${JSON.stringify({ type: 'done', result })}\n\n`)

        await prisma.user.update({
            where: { id: req.user!.userId },
            data: { quotaUsed: { increment: 1 } },
        })

        res.end()
    } catch (err) {
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: (err as Error).message })}\n\n`)
            res.end()
        } else {
            next(err)
        }
    }
}
