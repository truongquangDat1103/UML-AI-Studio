import Anthropic from '@anthropic-ai/sdk'
import prisma from '../utils/prismaClient.js'
import { DEFAULT_SYSTEM_PROMPT_USECASE, DEFAULT_SYSTEM_PROMPT_CLASS } from '../utils/constants.js'
import { plantUmlDataToMermaid, jsonToPlantUml } from '../utils/plantUmlToMermaid.js'

interface GenerateParams {
    input: string
    diagramType: 'USECASE' | 'CLASS'
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

// ─── LLM Microservice (Python/FastAPI) ─────────────────────────────────────────
const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL || 'http://localhost:8000'
const LLM_SERVICE_TIMEOUT_MS = 60_000 // 60s (RAG + inference có thể chậm)

/**
 * Gọi LLM microservice (Python FastAPI) để sinh Use Case diagram.
 * Trả về Mermaid code sau khi convert.
 */
async function callLlmService(userInput: string): Promise<{
    mermaidCode: string
    plantUmlCode: string
    explanation: string
    suggestions: string[]
    model_used?: string
    latency_seconds?: number
}> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), LLM_SERVICE_TIMEOUT_MS)

    try {
        const resp = await fetch(`${LLM_SERVICE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userInput }),
            signal: controller.signal,
        })

        if (!resp.ok) {
            const errText = await resp.text()
            throw new Error(`LLM Service lỗi ${resp.status}: ${errText}`)
        }

        const json = await resp.json() as {
            status: string
            data: {
                actors?: string[]
                usecases?: string[]
                relations?: Array<{
                    // LLM Service dùng source/target
                    source?: string
                    target?: string
                    // fallback compatibility
                    from?: string
                    to?: string
                    type?: string
                    label?: string
                }>
                title?: string
            }
            model_used?: string
            latency_seconds?: number
        }

        if (json.status !== 'success' || !json.data) {
            throw new Error('LLM Service trả về dữ liệu không hợp lệ')
        }

        const mermaidCode = plantUmlDataToMermaid(json.data)
        const plantUmlCode = jsonToPlantUml(json.data)

        const actors = json.data.actors || []
        const usecases = json.data.usecases || []

        return {
            mermaidCode,
            plantUmlCode,
            explanation: `Đã phân tích và tạo Use Case Diagram với ${actors.length} actor(s) và ${usecases.length} use case(s).`,
            suggestions: [
                actors.length > 0 ? `Actors: ${actors.join(', ')}` : '',
                usecases.length > 0 ? `Use Cases: ${usecases.slice(0, 3).join(', ')}${usecases.length > 3 ? '...' : ''}` : '',
            ].filter(Boolean),
            model_used: json.model_used,
            latency_seconds: json.latency_seconds,
        }
    } finally {
        clearTimeout(timer)
    }
}

/**
 * Kiểm tra LLM service có đang chạy không.
 */
export async function checkLlmServiceHealth(): Promise<boolean> {
    try {
        const resp = await fetch(`${LLM_SERVICE_URL}/health`, { signal: AbortSignal.timeout(5000) })
        if (!resp.ok) return false
        // Kiểm tra thêm status trong JSON — "loading" nghĩa là model chưa sẵn sàng
        const json = await resp.json() as { status: string }
        return json.status === 'online'
    } catch {
        return false
    }
}

// ─── Main generate function ─────────────────────────────────────────────────────
export async function generateDiagram(params: GenerateParams, onChunk?: (text: string) => void) {
    const config = await prisma.aIConfig.findUnique({ where: { id: 'singleton' } })

    // ── USECASE: Ưu tiên dùng LLM Service (Python) ──────────────────────────────
    if (params.diagramType === 'USECASE') {
        const llmHealthy = await checkLlmServiceHealth()

        if (llmHealthy) {
            console.log('[AI] Routing to LLM microservice (Python/FastAPI)...')
            try {
                const result = await callLlmService(params.input)
                console.log(`[AI] LLM service OK — model: ${result.model_used}, latency: ${result.latency_seconds?.toFixed(2)}s`)
                // Emit toàn bộ mermaid code như một chunk duy nhất (streaming simulation)
                onChunk?.(JSON.stringify(result))
                return result
            } catch (llmErr) {
                console.warn('[AI] LLM service thất bại, fallback sang Claude:', llmErr)
                // Tiếp tục xuống Claude nếu LLM service lỗi
            }
        } else {
            console.log('[AI] LLM service không khả dụng, dùng Claude...')
        }
    }

    // ── CLASS DIAGRAM hoặc fallback: dùng Claude API ────────────────────────────
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

    // Try to parse JSON from Claude response
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
        // Fallback: return raw response
    }

    return {
        mermaidCode: fullResponse,
        explanation: 'Không thể parse JSON từ AI response',
        suggestions: [],
    }
}
