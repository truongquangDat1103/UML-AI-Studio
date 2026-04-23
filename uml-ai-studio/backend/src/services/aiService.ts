import Anthropic from '@anthropic-ai/sdk'
import prisma from '../utils/prismaClient.js'
import { DEFAULT_SYSTEM_PROMPT_USECASE, DEFAULT_SYSTEM_PROMPT_CLASS } from '../utils/constants.js'

interface GenerateParams {
    input: string
    diagramType: 'USECASE' | 'CLASS'
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

export async function generateDiagram(params: GenerateParams, onChunk?: (text: string) => void) {
    // Get AI config from DB
    const config = await prisma.aIConfig.findUnique({ where: { id: 'singleton' } })

    const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        throw new Error('API key không được cấu hình. Vui lòng cấu hình trong Admin > AI Config hoặc file .env')
    }

    const model = config?.model || 'claude-sonnet-4-20250514'
    const temperature = config?.temperature || 0.7
    const maxTokens = config?.maxTokens || 4096

    const systemPrompt = params.diagramType === 'USECASE'
        ? (config?.systemPromptUsecase || DEFAULT_SYSTEM_PROMPT_USECASE)
        : (config?.systemPromptClass || DEFAULT_SYSTEM_PROMPT_CLASS)

    const client = new Anthropic({ apiKey })

    // Build messages
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
        ...(params.conversationHistory || []),
        { role: 'user' as const, content: params.input },
    ]

    let fullResponse = ''

    const stream = await client.messages.stream({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages,
    })

    for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullResponse += event.delta.text
            onChunk?.(event.delta.text)
        }
    }

    // Try to parse JSON from response
    try {
        const jsonMatch = fullResponse.match(/\{[\s\S]*"mermaidCode"[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as {
                mermaidCode: string
                explanation: string
                suggestions: string[]
            }
        }
    } catch {
        // If JSON parse fails, return raw response
    }

    return {
        mermaidCode: fullResponse,
        explanation: 'Không thể parse JSON từ AI response',
        suggestions: [],
    }
}
