/**
 * Converter: PlantUML JSON (từ LLM Service) → Mermaid code
 * LLM Service trả về: { actors, usecases, relations }
 * Frontend cần: Mermaid string
 */

interface UseCaseData {
    actors?: string[]
    usecases?: string[]
    relations?: Array<{
        // LLM Service dùng source/target; fallback từ/to
        source?: string
        target?: string
        from?: string
        to?: string
        type?: string
        label?: string
    }>
    title?: string
}

export function plantUmlDataToMermaid(data: UseCaseData): string {
    if (!data || typeof data !== 'object') return ''

    const actors = data.actors || []
    const usecases = data.usecases || []
    const relations = data.relations || []

    const lines: string[] = ['graph LR']

    // Định nghĩa Actor nodes (hình người)
    actors.forEach((actor) => {
        const safeId = sanitizeId(actor)
        lines.push(`  ${safeId}([👤 ${actor}])`)
    })

    // Định nghĩa UseCase nodes (hình chữ nhật bo góc)
    usecases.forEach((uc) => {
        const safeId = sanitizeId(uc)
        const label = uc.replace(/^UC_/, '').replace(/_/g, ' ')
        lines.push(`  ${safeId}[${label}]`)
    })

    // Định nghĩa các quan hệ
    // LLM Service dùng source/target; hỗ trợ cả from/to để tương thích
    relations.forEach((rel) => {
        const rawFrom = rel.source ?? rel.from ?? ''
        const rawTo = rel.target ?? rel.to ?? ''
        if (!rawFrom || !rawTo) return   // bỏ qua relation không hợp lệ

        const fromId = sanitizeId(rawFrom)
        const toId = sanitizeId(rawTo)
        const relType = (rel.type || '').toLowerCase()

        if (relType === 'include' || relType === '<<include>>') {
            lines.push(`  ${fromId} -->|"<<include>>"| ${toId}`)
        } else if (relType === 'extend' || relType === '<<extend>>') {
            lines.push(`  ${fromId} -.->|"<<extend>>"| ${toId}`)
        } else if (rel.label) {
            lines.push(`  ${fromId} -->|${rel.label}| ${toId}`)
        } else {
            lines.push(`  ${fromId} --> ${toId}`)
        }
    })

    return lines.join('\n')
}

/** Sanitize string thành ID hợp lệ cho Mermaid (không chứa ký tự đặc biệt) */
function sanitizeId(str: string): string {
    return str.replace(/[^a-zA-Z0-9_]/g, '_')
}

/**
 * Trích xuất Mermaid code từ raw text response (phòng trường hợp LLM trả về text)
 */
export function extractMermaidFromText(text: string): string | null {
    const match = text.match(/```(?:mermaid)?\s*([\s\S]*?)```/)
    return match ? match[1].trim() : null
}

/**
 * Converter: PlantUML JSON (từ LLM Service) → PlantUML code string
 * Input: { actors, usecases, relations, title? }
 */
export function jsonToPlantUml(data: UseCaseData): string {
    if (!data || typeof data !== 'object') return ''

    const actors = data.actors || []
    const usecases = data.usecases || []
    const relations = data.relations || []
    const title = data.title || 'System'

    const lines: string[] = ['@startuml', 'left to right direction', '']

    // Khai báo actors
    actors.forEach((actor) => {
        lines.push(`actor "${actor}"`)
    })

    if (actors.length > 0) lines.push('')

    // Khai báo use cases trong rectangle
    lines.push(`rectangle "${title}" {`)
    usecases.forEach((uc) => {
        const label = uc.replace(/^UC_/, '').replace(/_/g, ' ')
        lines.push(`  usecase "${label}" as ${sanitizePlantId(uc)}`)
    })
    lines.push('}')
    lines.push('')

    // Khai báo quan hệ
    relations.forEach((rel) => {
        const rawFrom = rel.source ?? rel.from ?? ''
        const rawTo = rel.target ?? rel.to ?? ''
        if (!rawFrom || !rawTo) return

        const fromId = sanitizePlantId(rawFrom)
        const toId = sanitizePlantId(rawTo)
        const relType = (rel.type || '').toLowerCase()

        if (relType === 'include' || relType === '<<include>>') {
            lines.push(`${fromId} ..> ${toId} : <<include>>`)
        } else if (relType === 'extend' || relType === '<<extend>>') {
            lines.push(`${fromId} ..> ${toId} : <<extend>>`)
        } else if (rel.label) {
            lines.push(`${fromId} --> ${toId} : ${rel.label}`)
        } else {
            lines.push(`${fromId} --> ${toId}`)
        }
    })

    lines.push('')
    lines.push('@enduml')

    return lines.join('\n')
}

/** Sanitize string thành ID hợp lệ cho PlantUML */
function sanitizePlantId(str: string): string {
    return str.replace(/[^a-zA-Z0-9_]/g, '_')
}
